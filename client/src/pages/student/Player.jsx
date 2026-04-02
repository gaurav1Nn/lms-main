import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import YouTube from "react-youtube";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";
import { extractYouTubeId } from "../../utils/videoUtils";

const Player = () => {
  const {
    enrolledCourses,
    backendUrl,
    userData,
    fetchUserEnrolledCourses,
    token,
  } = useContext(AppContext);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const [videoData, setVideoData] = useState(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const abortControllerRef = useRef(null);
  const hasFetchedEnrollmentsRef = useRef(false);
  const sidebarRef = useRef(null);

  // Memoized sorted course content
  const sortedCourseContent = useMemo(() => {
    if (!courseData?.courseContent) return [];

    return [...courseData.courseContent]
      .sort((a, b) => a.chapterOrder - b.chapterOrder)
      .map((chapter) => ({
        ...chapter,
        chapterContent: [...chapter.chapterContent].sort(
          (a, b) => a.lectureOrder - b.lectureOrder
        ),
      }));
  }, [courseData]);

  // Flatten all lectures for navigation
  const allLectures = useMemo(() => {
    const lectures = [];
    sortedCourseContent.forEach((chapter, chIndex) => {
      chapter.chapterContent.forEach((lecture, lecIndex) => {
        lectures.push({
          ...lecture,
          chapterIndex: chIndex,
          lectureIndex: lecIndex,
          globalIndex: lectures.length + 1,
        });
      });
    });
    return lectures;
  }, [sortedCourseContent]);

  // Find previous/next lecture
  const { prevLecture, nextLecture, currentIndex } = useMemo(() => {
    if (!playerData)
      return { prevLecture: null, nextLecture: null, currentIndex: -1 };

    const idx = allLectures.findIndex(
      (lec) => lec.lectureId === playerData.lectureId
    );
    return {
      prevLecture: idx > 0 ? allLectures[idx - 1] : null,
      nextLecture: idx < allLectures.length - 1 ? allLectures[idx + 1] : null,
      currentIndex: idx,
    };
  }, [playerData, allLectures]);

  // Calculate completion stats
  const { completedCount, totalLectures, percentComplete, timeRemaining } =
    useMemo(() => {
      if (!progressData || !courseData) {
        return {
          completedCount: 0,
          totalLectures: 0,
          percentComplete: 0,
          timeRemaining: "0 min",
        };
      }

      const completed = progressData.lectureCompleted || [];
      let total = 0;
      let remainingMinutes = 0;

      courseData.courseContent.forEach((chapter) => {
        chapter.chapterContent.forEach((lecture) => {
          total++;
          if (!completed.includes(lecture.lectureId)) {
            remainingMinutes += lecture.lectureDuration;
          }
        });
      });

      const h = Math.floor(remainingMinutes / 60);
      const m = remainingMinutes % 60;
      const timeStr = h > 0 ? `${h}h ${m}m` : `${m} min`;

      return {
        completedCount: completed.length,
        totalLectures: total,
        percentComplete:
          total > 0 ? Math.round((completed.length / total) * 100) : 0,
        timeRemaining: timeStr,
      };
    }, [progressData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    let isMounted = true;

    const resolveCourseAccess = async () => {
      if (!token) {
        if (isMounted) {
          setIsLoadingCourse(false);
        }
        return;
      }

      setIsLoadingCourse(true);

      let courses = enrolledCourses;

      if (courses.length === 0 && !hasFetchedEnrollmentsRef.current) {
        hasFetchedEnrollmentsRef.current = true;
        await fetchUserEnrolledCourses();

        try {
          const { data } = await axios.get(backendUrl + "/api/user/enrolled-courses");
          if (!isMounted) return;

          if (data.success) {
            courses = [...data.enrolledCourses].reverse();
          } else {
            toast.error(data.message);
            setIsLoadingCourse(false);
            return;
          }
        } catch (error) {
          if (!isMounted) return;
          toast.error(error.response?.data?.message || error.message);
          setIsLoadingCourse(false);
          return;
        }
      }

      const course = courses.find((item) => item._id === courseId);

      if (!isMounted) return;

      if (!course) {
        toast.error("Please enroll in this course to access the player");
        navigate(`/course/${courseId}`);
        return;
      }

      setCourseData(course);
      const userRating = course.courseRatings?.find(
        (item) => item.userId === userData?._id
      );
      setInitialRating(userRating?.rating || 0);
      getCourseProgress(course);
      setIsLoadingCourse(false);
    };

    resolveCourseAccess();

    return () => {
      isMounted = false;
    };
  }, [
    backendUrl,
    courseId,
    enrolledCourses,
    fetchUserEnrolledCourses,
    navigate,
    token,
    userData,
  ]);

  useEffect(() => {
    if (!playerData || sortedCourseContent.length === 0) return;

    const chapterIndex = sortedCourseContent.findIndex((chapter) =>
      chapter.chapterContent.some(
        (lecture) => lecture.lectureId === playerData.lectureId
      )
    );

    if (chapterIndex !== -1) {
      setOpenSections((prev) => ({ ...prev, [chapterIndex]: true }));
    }
  }, [playerData, sortedCourseContent]);

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

  // Auto-scroll to active lecture
  useEffect(() => {
    if (playerData) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const activeElement = document.getElementById(
            `lecture-${playerData.lectureId}`
          );
          if (activeElement) {
            activeElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      });
    }
  }, [playerData]);

  // Navigation handlers
  const handlePreviousLecture = () => {
    if (prevLecture) {
      setPlayerData({
        ...prevLecture,
        chapter: prevLecture.chapterIndex + 1,
        lecture: prevLecture.lectureIndex + 1,
      });
      if (window.innerWidth < 768) {
        setIsMobileSidebarOpen(false);
      }
    }
  };

  const handleNextLecture = () => {
    if (nextLecture) {
      setPlayerData({
        ...nextLecture,
        chapter: nextLecture.chapterIndex + 1,
        lecture: nextLecture.lectureIndex + 1,
      });
      if (window.innerWidth < 768) {
        setIsMobileSidebarOpen(false);
      }
    }
  };

  const handleLectureSelect = (lecture, chapterIndex, lectureIndex) => {
    setPlayerData({
      ...lecture,
      chapter: chapterIndex + 1,
      lecture: lectureIndex + 1,
    });
    setIsMobileSidebarOpen(false);
  };

  // Key takeaways (placeholder)
  const takeaways = [
    "Understanding order book dynamics and market microstructure fundamentals",
    "Key statistical methods for identifying trading opportunities",
    "Risk management frameworks used by quantitative trading firms",
  ];
  return courseData && !isLoadingCourse ? (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/my-enrollments")}
            className="text-gray-600 hover:text-emerald-600 transition-colors"
          >
            ←
          </button>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase text-emerald-600 font-mono tracking-widest">
              QUANTPACT LMS
            </span>
            <span className="text-[15px] font-bold text-gray-900 truncate max-w-xs">
              {courseData.courseTitle}
            </span>
          </div>
        </div>

        {/* Center - Completion Pill */}
        <div className="hidden sm:flex items-center px-4 py-1.5 bg-emerald-50 rounded-full">
          <span className="text-sm font-semibold text-emerald-700">
            {completedCount}/{totalLectures} COMPLETED
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
            {userData?.name?.charAt(0) || "U"}
          </div>
        </div>
      </div>

      {/* Progress Bar below top bar */}
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row">
        {/* LEFT COLUMN - 65% */}
        <div className="w-full md:w-[65%] p-4 md:p-8">
          {/* Video Player */}
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            {playerData && videoData ? (
              videoData.type === "youtube" ? (
                <YouTube
                  videoId={extractYouTubeId(videoData.url)}
                  iframeClassName="w-full h-full"
                  opts={{
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                    },
                  }}
                />
              ) : (
                <video
                  controls
                  controlsList="nodownload"
                  className="w-full h-full"
                  src={videoData.url}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={() =>
                    toast.error(
                      "Error loading secure video. Your session may have expired."
                    )
                  }
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Loading video...
              </div>
            )}
          </div>

          {/* Lecture Info */}
          <div className="pt-5">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-mono">
              MODULE {playerData?.chapter || 1} · LECTURE{" "}
              {playerData ? allLectures[currentIndex]?.globalIndex : 1}
            </p>
            <div className="flex items-start justify-between mt-2">
              <h1 className="text-2xl font-bold text-gray-900 max-w-lg">
                {playerData?.lectureTitle || ""}
              </h1>
              <div className="flex items-center gap-2 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">
                  {formatDuration(playerData?.lectureDuration || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation + Mark Complete */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-4">
              <button
                onClick={handlePreviousLecture}
                disabled={!prevLecture}
                className={`text-sm ${
                  !prevLecture
                    ? "opacity-30 cursor-not-allowed"
                    : "text-gray-500 hover:text-emerald-600"
                }`}
              >
                ← Previous Lecture
              </button>
              <button
                onClick={handleNextLecture}
                disabled={!nextLecture}
                className={`text-sm ${
                  !nextLecture
                    ? "opacity-30 cursor-not-allowed"
                    : "text-gray-500 hover:text-emerald-600"
                }`}
              >
                Next Lecture →
              </button>
            </div>
            <div className="text-right">
              <button
                onClick={() => markLectureAsCompleted(playerData.lectureId)}
                disabled={
                  progressData?.lectureCompleted?.includes(playerData.lectureId)
                }
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  progressData?.lectureCompleted?.includes(playerData.lectureId)
                    ? "bg-emerald-50 text-emerald-600 cursor-default"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {progressData?.lectureCompleted?.includes(playerData.lectureId)
                  ? "✓ Completed"
                  : "✓ Mark as Complete"}
              </button>
              {nextLecture && (
                <p className="text-xs text-gray-400 mt-2">
                  Up next: {nextLecture.lectureTitle} ·{" "}
                  {formatDuration(nextLecture.lectureDuration)} min
                </p>
              )}
              {!nextLecture && (
                <p className="text-xs text-emerald-600 font-medium mt-2">
                  🎉 Final lecture!
                </p>
              )}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100 border-l-4 border-l-emerald-500">
            <h3 className="text-xs uppercase tracking-widest text-emerald-600 font-mono font-semibold mb-4">
              KEY QUANTITATIVE TAKEAWAYS
            </h3>
            <ol className="space-y-3">
              {takeaways.map((takeaway, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-emerald-600 font-bold font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {takeaway}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Rating Section */}
          {progressData?.lectureCompleted?.length >= 1 && (
            <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Rate this Course
              </h3>
              <Rating initialRating={initialRating} onRate={handleRate} />
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR - 35% */}
        <div className="hidden md:block w-full md:w-[35%] sticky top-16 h-[calc(100vh-64px)] overflow-y-auto sidebar-scroll bg-white border-l border-gray-200">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
              <span className="text-sm font-semibold text-emerald-600">
                {percentComplete}% DONE
              </span>
            </div>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              ~{timeRemaining} remaining
            </p>
          </div>

          {/* Chapter Groups */}
          <div ref={sidebarRef}>
            {sortedCourseContent.map((chapter, chapterIndex) => {
              const isOpen = openSections[chapterIndex] !== false;
              return (
                <div key={chapterIndex}>
                  {/* Chapter Header */}
                  <div
                    className="px-5 pt-5 pb-2 cursor-pointer flex items-center justify-between"
                    onClick={() => toggleSection(chapterIndex)}
                  >
                    <span className="text-[11px] uppercase tracking-widest text-gray-400 font-mono">
                      CHAPTER {chapterIndex + 1}: {chapter.chapterTitle}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transform transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Lecture Rows */}
                  {isOpen &&
                    chapter.chapterContent.map((lecture, lectureIndex) => {
                      const isCompleted =
                        progressData?.lectureCompleted?.includes(
                          lecture.lectureId
                        );
                      const isActive = playerData?.lectureId === lecture.lectureId;
                      const globalIndex =
                        allLectures.findIndex(
                          (l) => l.lectureId === lecture.lectureId
                        ) + 1;

                      return (
                        <div
                          id={`lecture-${lecture.lectureId}`}
                          key={lecture.lectureId}
                          onClick={() =>
                            handleLectureSelect(
                              lecture,
                              chapterIndex,
                              lectureIndex
                            )
                          }
                          className={`px-5 py-3 cursor-pointer transition-colors ${
                            isActive
                              ? "bg-emerald-50/50 rounded-lg border border-emerald-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Status Icon */}
                            <div className="w-6 h-6 flex-shrink-0">
                              {isCompleted ? (
                                <svg
                                  className="w-6 h-6 text-emerald-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : isActive ? (
                                <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center animate-pulse">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                              )}
                            </div>

                            {/* Middle Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {globalIndex}. {lecture.lectureTitle}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">
                                  {formatDuration(lecture.lectureDuration)}
                                </span>
                                <span className="text-[10px] uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                                  VIDEO
                                </span>
                              </div>
                            </div>

                            {/* Right Icon + WATCHING NOW */}
                            <div className="flex items-center">
                              {isActive && (
                                <div className="flex items-center gap-1 mr-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  <span className="text-[10px] uppercase tracking-wide text-emerald-600 font-medium">
                                    WATCHING NOW
                                  </span>
                                </div>
                              )}
                              <svg
                                className="w-5 h-5 text-gray-300 group-hover:text-emerald-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING BUTTON */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-emerald-700 z-40"
      >
        📑 Course Content
      </button>

      {/* MOBILE BOTTOM SHEET */}
      {isMobileSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 h-[70vh] bg-white z-50 rounded-t-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto sidebar-scroll">
              {sortedCourseContent.map((chapter, chapterIndex) => {
                const isOpen = openSections[chapterIndex] !== false;
                return (
                  <div key={chapterIndex}>
                    <div
                      className="px-5 pt-5 pb-2 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleSection(chapterIndex)}
                    >
                      <span className="text-[11px] uppercase tracking-widest text-gray-400 font-mono">
                        CHAPTER {chapterIndex + 1}: {chapter.chapterTitle}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transform transition-transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {isOpen &&
                      chapter.chapterContent.map((lecture, lectureIndex) => {
                        const isCompleted =
                          progressData?.lectureCompleted?.includes(
                            lecture.lectureId
                          );
                        const isActive =
                          playerData?.lectureId === lecture.lectureId;
                        const globalIndex =
                          allLectures.findIndex(
                            (l) => l.lectureId === lecture.lectureId
                          ) + 1;

                        return (
                          <div
                            id={`lecture-${lecture.lectureId}`}
                            key={lecture.lectureId}
                            onClick={() =>
                              handleLectureSelect(
                                lecture,
                                chapterIndex,
                                lectureIndex
                              )
                            }
                            className={`px-5 py-3 cursor-pointer transition-colors ${
                              isActive
                                ? "bg-emerald-50/50 rounded-lg border border-emerald-100"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 flex-shrink-0">
                                {isCompleted ? (
                                  <svg
                                    className="w-6 h-6 text-emerald-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : isActive ? (
                                  <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center animate-pulse">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {globalIndex}. {lecture.lectureTitle}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-400">
                                    {formatDuration(lecture.lectureDuration)}
                                  </span>
                                  <span className="text-[10px] uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                                    VIDEO
                                  </span>
                                </div>
                              </div>

                              {isActive && (
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  <span className="text-[10px] uppercase tracking-wide text-emerald-600 font-medium">
                                    WATCHING NOW
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  ) : (
    <Loading />
  );
};

// Simple duration formatter
const formatDuration = (minutes) => {
  if (!minutes) return "0 min";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) {
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${m} min`;
};

export default Player;
