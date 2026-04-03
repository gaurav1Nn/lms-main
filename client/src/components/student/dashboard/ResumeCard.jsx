// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { assets } from "../../../assets/assets";

// const ResumeCard = ({ course, resumeChapter, resumeLecture, lectureCompleted, totalLectures, pct }) => {
//   const navigate = useNavigate();

//   const isComplete = pct === 100;
//   const isNotStarted = lectureCompleted.length === 0;

//   const getButtonLabel = () => {
//     if (isComplete) return "Review Course";
//     if (isNotStarted) return "Start Learning →";
//     return "Resume Lecture →";
//   };

//   return (
//     <div className="rounded-2xl border border-emerald-100/50 bg-white/80 backdrop-blur-xl p-6 shadow-xl" style={{ boxShadow: '0 25px 60px -12px rgba(5, 150, 105, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.05)' }}>
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Thumbnail */}
//         <div className="flex-shrink-0">
//           <img
//             src={assets.course_thumbnail}
//             alt={course.courseTitle}
//             className="w-full md:w-48 h-32 object-cover rounded-lg border border-gray-200"
//           />
//         </div>

//         {/* Info */}
//         <div className="flex-1 flex flex-col justify-between gap-4">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">{course.courseTitle}</h2>

//             {isComplete ? (
//               <div className="mt-2 flex items-center gap-2 text-emerald-600 font-medium">
//                 <span className="text-xl">✅</span>
//                 <span>Course Completed</span>
//               </div>
//             ) : (
//               <div className="mt-2 text-sm text-gray-600 space-y-0.5">
//                 {resumeChapter && (
//                   <p className="text-gray-800 font-medium">{resumeChapter.chapterTitle}</p>
//                 )}
//                 {resumeLecture && (
//                   <p>{resumeLecture.lectureTitle}</p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Progress bar */}
//           <div className="space-y-1.5">
//             <div className="flex justify-between text-xs text-gray-600">
//               <span>{lectureCompleted.length} of {totalLectures} lectures completed</span>
//               <span className="text-emerald-600 font-semibold">{pct}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-700"
//                 style={{ width: `${pct}%` }}
//               />
//             </div>
//           </div>

//           {/* CTA Button */}
//           <button
//             onClick={() => navigate(`/player/${course._id}`)}
//             className="self-start mt-1 px-6 py-2.5 text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
//             style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 15px -3px rgba(5, 150, 105, 0.4)' }}
//           >
//             {getButtonLabel()}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResumeCard;


import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../../assets/assets";

const ResumeCard = ({ course, resumeChapter, resumeLecture, lectureCompleted, totalLectures, pct }) => {
  const navigate = useNavigate();
  const isComplete = pct === 100;
  const isNotStarted = lectureCompleted.length === 0;

  const getButtonLabel = () => {
    if (isComplete) return "Review Course";
    if (isNotStarted) return "Start Learning";
    return "Continue Learning";
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Thumbnail */}
        <div style={{ flexShrink: 0, width: "200px", minHeight: "160px", position: "relative", background: "#f1f5f9" }}>
          <img
            src={assets.course_thumbnail}
            alt={course.courseTitle}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              display: "block", position: "absolute", inset: 0,
            }}
          />
          {/* Status badge */}
          <div
            style={{
              position: "absolute", top: "10px", left: "10px",
              padding: "3px 10px", borderRadius: "6px", fontSize: "11px",
              fontWeight: 600, letterSpacing: "0.02em",
              background: isComplete ? "#059669" : isNotStarted ? "#475569" : "#0f172a",
              color: "#ffffff",
              backdropFilter: "blur(8px)",
            }}
          >
            {isComplete ? "COMPLETED" : isNotStarted ? "NEW" : `${pct}%`}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: "280px", padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.35 }}>
                {course.courseTitle}
              </h2>
            </div>

            {isComplete ? (
              <div
                style={{
                  marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "5px 12px", borderRadius: "6px",
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  fontSize: "12px", fontWeight: 600, color: "#15803d",
                }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#15803d" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All lectures completed
              </div>
            ) : (
              <div style={{ marginTop: "10px" }}>
                {resumeChapter && (
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: "0 0 2px" }}>
                    {resumeChapter.chapterTitle}
                  </p>
                )}
                {resumeLecture && (
                  <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                    Up next: {resumeLecture.lectureTitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom row */}
          <div>
            {/* Progress bar */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Progress
                </span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>
                  {lectureCompleted.length}/{totalLectures}
                </span>
              </div>
              <div style={{ height: "5px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%", width: `${pct}%`, borderRadius: "99px",
                    background: isComplete
                      ? "linear-gradient(90deg, #059669, #10b981)"
                      : "linear-gradient(90deg, #0f172a, #334155)",
                    transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(`/player/${course._id}`)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "9px 20px", fontSize: "13px", fontWeight: 600,
                color: "#ffffff", background: "#0f172a",
                border: "none", borderRadius: "8px", cursor: "pointer",
                letterSpacing: "0.01em",
                boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.1s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.1)"; }}
            >
              {getButtonLabel()}
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;