import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const MyCourses = () => {
  const { currency, backendUrl, isEducator } = useContext(AppContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to permanently delete this course?\n\n• Enrolled users will lose access\n• Course progress will be removed\n• Purchase records will remain in the database")) {
      return;
    }
    
    setDeletingCourseId(courseId);
    try {
      const { data } = await axios.delete(`${backendUrl}/api/educator/delete-course/${courseId}`);
      if (data.success) {
        toast.success(data.message);
        fetchEducatorCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDeletingCourseId(null);
    }
  };

  const fetchEducatorCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/educator/courses");

      data.success && setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  return courses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <th className="px-4 py-3 font-semibold truncate">All Courses</th>
              <th className="px-4 py-3 font-semibold truncate">Earnings</th>
              <th className="px-4 py-3 font-semibold truncate">Students</th>
              <th className="px-4 py-3 font-semibold truncate">Published On</th>
              <th className="px-4 py-3 font-semibold truncate">Actions</th>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={assets.course_thumbnail}
                      alt="Course Image"
                      className="w-16"
                    />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                      className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                    >
                      Edit Course
                    </button>
                    <button
                      disabled={deletingCourseId === course._id}
                      onClick={() => handleDeleteCourse(course._id)}
                      className={`font-medium text-sm transition-colors ${deletingCourseId === course._id ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-600'}`}
                    >
                      {deletingCourseId === course._id ? "Deleting..." : "Delete Course"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
