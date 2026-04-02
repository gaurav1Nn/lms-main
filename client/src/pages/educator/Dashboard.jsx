import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currency, backendUrl, isEducator, userData } =
    useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/educator/dashboard");
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAvatarUrl = (student) => {
    if (student?.imageUrl) return student.imageUrl;
    const name = student?.name || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=059669&color=fff&size=40`;
  };

  const educatorFirstName = userData?.name?.split(" ")[0] || "Admin";

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col gap-8 md:p-8 p-4 pt-8 bg-gray-50/50">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, {educatorFirstName} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's your overview for the current trading cycle.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Earnings Card */}
        <div className="bg-white rounded-2xl border-[1.5px] border-emerald-300 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">
                Total Earnings
              </p>
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[34px] font-black tracking-tight text-gray-900">
                {formatCurrency(dashboardData.totalEarnings)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-sm font-bold text-emerald-600">+12.4%</span>
            <span className="text-sm text-gray-500 font-medium">vs last month</span>
          </div>
        </div>

        {/* Total Students Card */}
        <div className="bg-white rounded-2xl border-[1.5px] border-emerald-300 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">
                Total Students
              </p>
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 flex items-center justify-center">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[34px] font-black tracking-tight text-gray-900">
                {dashboardData.enrolledStudentsData.length.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-sm font-bold text-emerald-600">+86</span>
            <span className="text-sm text-gray-500 font-medium">new this week</span>
          </div>
        </div>

        {/* Active Courses Card */}
        <div className="bg-white rounded-2xl border-[1.5px] border-emerald-300 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">
                Active Courses
              </p>
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 flex items-center justify-center">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[34px] font-black tracking-tight text-gray-900">
                {dashboardData.totalCourses}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap"><span className="text-gray-900 font-bold">3</span> currently in review</span>
          </div>
        </div>
      </div>

      {/* Recent Enrollments Table */}
      <div className="bg-white rounded-2xl border flex-1 border-gray-100 shadow-sm mt-4">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Enrollments
          </h2>
          <Link
            to="/educator/student-enrolled"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View All Students
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 hidden sm:table-cell">
                  #
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 hidden md:table-cell">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 hidden sm:table-cell">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-400 hidden sm:table-cell">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(item.student)}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            item.student?.name || "U"
                          )}&background=059669&color=fff&size=40`;
                        }}
                      />
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {item.student?.name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]">
                    {item.courseTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell whitespace-nowrap">
                    {formatDate(item.purchaseDate || item.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right hidden sm:table-cell">
                    <span className="text-sm font-semibold text-emerald-600">
                      {item.amount != null ? formatCurrency(item.amount) : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {dashboardData.enrolledStudentsData.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No enrollments yet. Share your courses to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;