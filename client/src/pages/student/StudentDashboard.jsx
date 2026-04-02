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

const DashboardWrapper = ({ children }) => (
  <div className="relative min-h-screen flex flex-col overflow-hidden" 
    style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #a7f3d0 60%, #6ee7b7 100%)' }}>
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #34d399, transparent 70%)' }} />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #059669, transparent 70%)' }} />
      <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full opacity-10 bg-emerald-500 blur-xl" />
      <div className="absolute bottom-1/3 right-20 w-16 h-16 rounded-full opacity-15 bg-emerald-400 blur-lg" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    </div>
    <div className="relative z-10 flex-1 flex flex-col">
      {children}
    </div>
  </div>
);

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
      <DashboardWrapper>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-emerald-700">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-semibold">Loading your learning environment...</p>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  // ── Not enrolled ──────────────────────────────────────────────────────────
  if (enrolledCourses.length === 0) {
    const targetCourseId = allCourses.length > 0 ? allCourses[0]._id : null;
    return (
      <DashboardWrapper>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/50 rounded-2xl p-10 max-w-md text-center shadow-xl" style={{ boxShadow: '0 25px 60px -12px rgba(5, 150, 105, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.05)' }}>
            <div className="text-5xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Start Your Journey
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't enrolled in any course yet. Begin your quantitative
              trading journey today.
            </p>
            {targetCourseId ? (
              <Link
                to={`/course/${targetCourseId}`}
                className="inline-block px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 15px -3px rgba(5, 150, 105, 0.4)' }}
              >
                Explore Quantpact Course →
              </Link>
            ) : (
              <Link
                to="/course-list"
                className="inline-block px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 15px -3px rgba(5, 150, 105, 0.4)' }}
              >
                Browse Courses →
              </Link>
            )}
          </div>
        </div>
        <Footer />
      </DashboardWrapper>
    );
  }

  // ── Main dashboard ─────────────────────────────────────────────────────────
  const course = enrolledCourses[0];
  const sortedChapters = getSortedChapters(course);
  const { totalLectures, pct, hoursWatched, resumeChapter, resumeLecture, chapterProgress } =
    computeProgress(sortedChapters, lectureCompleted);

  const firstName = userData?.name?.split(" ")[0] || "there";

  return (
    <DashboardWrapper>

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
    </DashboardWrapper>
  );
};

export default StudentDashboard;
