import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";
import { extractYouTubeId } from "../../utils/videoUtils";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const [videoData, setVideoData] = useState(null);
  const abortControllerRef = useRef(null);

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.map((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
        // Pass course directly so getCourseProgress has it before state update
        getCourseProgress(course);
      }
    });
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses]);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async (courseDataOverride) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId }
      );

      if (data.success) {
        setProgressData(data.progressData);
        // Auto-select first incomplete lecture (Option C — Player self-resolves resume point)
        const completed = data.progressData?.lectureCompleted || [];
        const source = courseDataOverride || courseData;
        if (source && completed !== null) {
          const sortedChapters = [...source.courseContent]
            .sort((a, b) => a.chapterOrder - b.chapterOrder)
            .map((ch) => ({
              ...ch,
              chapterContent: [...ch.chapterContent].sort(
                (a, b) => a.lectureOrder - b.lectureOrder
              ),
            }));

          // Find first incomplete lecture
          let found = false;
          for (let ci = 0; ci < sortedChapters.length && !found; ci++) {
            const ch = sortedChapters[ci];
            for (let li = 0; li < ch.chapterContent.length && !found; li++) {
              const lec = ch.chapterContent[li];
              if (!completed.includes(lec.lectureId)) {
                setPlayerData({ ...lec, chapter: ci + 1, lecture: li + 1 });
                found = true;
              }
            }
          }
          // If all complete, load the last lecture
          if (!found && sortedChapters.length > 0) {
            const lastCh = sortedChapters[sortedChapters.length - 1];
            const lastLec = lastCh.chapterContent[lastCh.chapterContent.length - 1];
            if (lastLec) {
              setPlayerData({
                ...lastLec,
                chapter: sortedChapters.length,
                lecture: lastCh.chapterContent.length,
              });
            }
          }
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!playerData) return;

    const fetchVideoUrl = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const { data } = await axios.post(
          backendUrl + "/api/user/get-video-url",
          { courseId, lectureId: playerData.lectureId },
          { signal: abortControllerRef.current.signal }
        );

        if (data.success) {
          setVideoData({ type: data.type, url: data.url });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        toast.error(error.message);
      }
    };

    fetchVideoUrl();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [playerData, courseId, backendUrl]);



  return courseData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* left column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""
                          }`}
                        src={assets.down_arrow_icon}
                        alt="down_arrow_icon"
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"
                      }`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={
                              progressData &&
                                progressData.lectureCompleted.includes(
                                  lecture.lectureId
                                )
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            alt={false ? "blue_tick_icon" : "play_icon"}
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Watch
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* right column */}
        <div className="md:mt-10">
          {playerData && videoData ? (
            <div>
              {videoData.type === "youtube" ? (
                <YouTube
                  videoId={extractYouTubeId(videoData.url)}
                  iframeClassName="w-full aspect-video"
                />
              ) : (
                <video
                  controls
                  controlsList="nodownload"
                  className="w-full aspect-video"
                  src={videoData.url}
                  autoPlay
                  onContextMenu={(e) => e.preventDefault()}
                  onError={() => toast.error("Error loading secure video. Your session may have expired.")}
                />
              )}
              <div className="flex justify-between items-center mt-1">
                <p>
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className="text-blue-600"
                >
                  {progressData &&
                    progressData.lectureCompleted.includes(playerData.lectureId)
                    ? "Completed"
                    : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData ? courseData.courseThumbnail : ""}
              alt={courseData ? courseData.courseTitle : ""}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;
