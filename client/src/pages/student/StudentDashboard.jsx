

// new code
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Footer from "../../components/student/Footer";
import ResumeCard from "../../components/student/dashboard/ResumeCard";
import StatsStrip from "../../components/student/dashboard/StatsStrip";
import ChapterOverview from "../../components/student/dashboard/ChapterOverview";

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

  const chapterProgress = sortedChapters.map((ch) => {
    const total = ch.chapterContent.length;
    const done = ch.chapterContent.filter((l) =>
      lectureCompleted.includes(l.lectureId)
    ).length;
    return { ...ch, done, total };
  });

  return { totalLectures, pct, hoursWatched, resumeChapter, resumeLecture, chapterProgress };
};

const DashboardWrapper = ({ children }) => (
  <div
    style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#fafafa",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "280px",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        zIndex: 0,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: "279px",
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)",
        zIndex: 1,
      }}
    />
    <div
      style={{
        position: "relative",
        zIndex: 10,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
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

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && enrolledCourses.length === 0) fetchUserEnrolledCourses();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated) return;
      if (enrolledCourses.length === 0) { setLoading(false); return; }
      const course = enrolledCourses[0];
      try {
        const { data } = await axios.post(
          backendUrl + "/api/user/get-course-progress",
          { courseId: course._id }
        );
        if (data.success && data.progressData) {
          setLectureCompleted(data.progressData.lectureCompleted || []);
        } else { setLectureCompleted([]); }
      } catch { setProgressError(true); setLectureCompleted([]); }
      finally { setLoading(false); }
    };
    fetchProgress();
  }, [enrolledCourses]);

  if (loading) {
    return (
      <DashboardWrapper>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "32px", height: "32px",
                border: "3px solid #334155",
                borderTopColor: "#10b981",
                borderRadius: "50%",
                animation: "dashSpin 0.7s linear infinite",
              }}
            />
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#94a3b8", letterSpacing: "0.02em" }}>
              Preparing your dashboard…
            </p>
            <style>{`@keyframes dashSpin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  if (enrolledCourses.length === 0) {
    const targetCourseId = allCourses.length > 0 ? allCourses[0]._id : null;
    return (
      <DashboardWrapper>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "52px 44px",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "52px", height: "52px", borderRadius: "12px",
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
              No Courses Yet
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.65, marginBottom: "28px" }}>
              Get started with your quantitative trading journey. Enroll in a course to track your progress here.
            </p>
            <Link
              to={targetCourseId ? `/course/${targetCourseId}` : "/course-list"}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "10px 24px", background: "#0f172a", color: "#fff",
                fontSize: "13px", fontWeight: 600, borderRadius: "8px",
                textDecoration: "none", letterSpacing: "0.01em",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                transition: "opacity 0.15s",
              }}
            >
              {targetCourseId ? "Explore Course" : "Browse Courses"}
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
        <Footer />
      </DashboardWrapper>
    );
  }

  const course = enrolledCourses[0];
  const sortedChapters = getSortedChapters(course);
  const { totalLectures, pct, hoursWatched, resumeChapter, resumeLecture, chapterProgress } =
    computeProgress(sortedChapters, lectureCompleted);
  const firstName = userData?.name?.split(" ")[0] || "there";

  return (
    <DashboardWrapper>
      <main style={{ flex: 1, maxWidth: "860px", margin: "0 auto", width: "100%", padding: "36px 20px 60px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px", paddingTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div
              style={{
                width: "46px", height: "46px", borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: "17px", flexShrink: 0,
                boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
                Welcome back, {firstName}
              </h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "3px 0 0", lineHeight: 1.4 }}>
                {pct === 100
                  ? "You've completed the entire course. Outstanding work."
                  : `${pct}% complete · ${totalLectures - lectureCompleted.length} lectures remaining`
                }
              </p>
            </div>
          </div>

          {/* Thin progress */}
          <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%", width: `${pct}%`, borderRadius: "99px",
                background: "linear-gradient(90deg, #10b981, #34d399)",
                transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>

          {progressError && (
            <div
              style={{
                marginTop: "14px", display: "flex", alignItems: "center", gap: "8px",
                fontSize: "12px", color: "#fbbf24", background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.15)", borderRadius: "8px", padding: "8px 12px",
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fbbf24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              Progress data couldn't be loaded. Please refresh.
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <ResumeCard
            course={course}
            resumeChapter={resumeChapter}
            resumeLecture={resumeLecture}
            lectureCompleted={lectureCompleted}
            totalLectures={totalLectures}
            pct={pct}
          />
          <StatsStrip
            lectureCompleted={lectureCompleted}
            totalLectures={totalLectures}
            hoursWatched={hoursWatched}
            pct={pct}
          />
          <ChapterOverview
            chapterProgress={chapterProgress}
            courseId={course._id}
            lectureCompleted={lectureCompleted}
          />
        </div>
      </main>
      <Footer />
    </DashboardWrapper>
  );
};

export default StudentDashboard;