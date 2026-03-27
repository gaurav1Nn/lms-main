import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Navbar from "../../components/student/Navbar";
import Footer from "../../components/student/Footer";
import ResumeCard from "../../components/student/dashboard/ResumeCard";
import StatsStrip from "../../components/student/dashboard/StatsStrip";
import ChapterOverview from "../../components/student/dashboard/ChapterOverview";

// ─── Computation helpers ────────────────────────────────────────────────────

const getSortedChapters = (course) =>
  [...course.courseContent]
    .sort((a, b) => a.chapterOrder - b.chapterOrder)
    .map((ch) => ({
      ...ch,
      chapterContent: [...ch.chapterContent].sort(
        (a, b) => a.lectureOrder - b.lectureOrder
      ),
    }));

const computeProgress = (sortedChapters, lectureCompleted) => {
  const totalLectures = sortedChapters.reduce(
    (sum, ch) => sum + ch.chapterContent.length,
    0
  );

  const pct =
    totalLectures === 0
      ? 0
      : Math.round((lectureCompleted.length / totalLectures) * 100);

  const hoursWatched =
    totalLectures === 0
      ? 0
      : sortedChapters
          .flatMap((ch) => ch.chapterContent)
          .filter((l) => lectureCompleted.includes(l.lectureId))
          .reduce((sum, l) => sum + l.lectureDuration, 0) / 60;

  // Find resume point
  let resumeChapter = null;
  let resumeLecture = null;
  outer: for (const ch of sortedChapters) {
    for (const lec of ch.chapterContent) {
      if (!lectureCompleted.includes(lec.lectureId)) {
        resumeChapter = ch;
        resumeLecture = lec;
        break outer;
      }
    }
  }

  // Per-chapter progress
  const chapterProgress = sortedChapters.map((ch) => {
    const total = ch.chapterContent.length;
    const done = ch.chapterContent.filter((l) =>
      lectureCompleted.includes(l.lectureId)
    ).length;
    return { ...ch, done, total };
  });

  return { totalLectures, pct, hoursWatched, resumeChapter, resumeLecture, chapterProgress };
};

// ─── Component ──────────────────────────────────────────────────────────────

const StudentDashboard = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    enrolledCourses,
    fetchUserEnrolledCourses,
    allCourses,
    backendUrl,
    userData,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [progressError, setProgressError] = useState(false);
  const [lectureCompleted, setLectureCompleted] = useState([]);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  // Fetch enrolled courses if not already loaded
  useEffect(() => {
    if (isAuthenticated && enrolledCourses.length === 0) {
      fetchUserEnrolledCourses();
    }
  }, [isAuthenticated]);

  // Once we have courseData, fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated) return;

      // If enrolledCourses hasn't loaded yet, keep waiting
      if (enrolledCourses.length === 0) {
        // We'll wait — but we don't want to spin forever if user is genuinely not enrolled
        // Give it a moment; if token exists but courses are still empty, show not-enrolled
        setLoading(false);
        return;
      }

      const course = enrolledCourses[0];
      try {
        const { data } = await axios.post(
          backendUrl + "/api/user/get-course-progress",
          { courseId: course._id }
        );
        if (data.success && data.progressData) {
          setLectureCompleted(data.progressData.lectureCompleted || []);
        } else {
          setLectureCompleted([]);
        }
      } catch {
        setProgressError(true);
        setLectureCompleted([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [enrolledCourses]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-gray-600">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Not enrolled ──────────────────────────────────────────────────────────
  if (enrolledCourses.length === 0) {
    const targetCourseId = allCourses.length > 0 ? allCourses[0]._id : null;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md text-center shadow-lg">
            <div className="text-5xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Start Your Journey
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't enrolled in any course yet. Begin your quantitative
              trading journey today.
            </p>
            {targetCourseId ? (
              <Link
                to={`/course/${targetCourseId}`}
                className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore Quantpact Course →
              </Link>
            ) : (
              <Link
                to="/course-list"
                className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-semibold rounded-lg transition-all"
              >
                Browse Courses →
              </Link>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Main dashboard ─────────────────────────────────────────────────────────
  const course = enrolledCourses[0];
  const sortedChapters = getSortedChapters(course);
  const { totalLectures, pct, hoursWatched, resumeChapter, resumeLecture, chapterProgress } =
    computeProgress(sortedChapters, lectureCompleted);

  const firstName = userData?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">

        {/* Section 1 — Welcome Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1 text-gray-600">
            You've completed{" "}
            <span className="text-emerald-600 font-semibold">{pct}%</span>{" "}
            of your learning journey.
          </p>

          {/* API error banner */}
          {progressError && (
            <p className="mt-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2">
              Couldn't load your progress. Try refreshing.
            </p>
          )}
        </div>

        {/* Section 2 — Resume Learning Card */}
        <ResumeCard
          course={course}
          resumeChapter={resumeChapter}
          resumeLecture={resumeLecture}
          lectureCompleted={lectureCompleted}
          totalLectures={totalLectures}
          pct={pct}
        />

        {/* Section 3 — Stats Strip */}
        <StatsStrip
          lectureCompleted={lectureCompleted}
          totalLectures={totalLectures}
          hoursWatched={hoursWatched}
          pct={pct}
        />

        {/* Section 4 — Chapter Overview */}
        <ChapterOverview
          chapterProgress={chapterProgress}
          courseId={course._id}
        />
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
