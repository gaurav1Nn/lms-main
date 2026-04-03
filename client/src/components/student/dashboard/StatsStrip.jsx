// import React from "react";
// import { toast } from "react-toastify";

// const StatCard = ({ icon, value, label, children }) => (
//   <div className="flex-1 bg-white/80 backdrop-blur-xl border border-emerald-100/50 shadow-xl rounded-2xl p-5 flex flex-col items-center text-center gap-2"
//        style={{ boxShadow: '0 25px 60px -12px rgba(5, 150, 105, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.05)' }}>
//     <span className="text-3xl">{icon}</span>
//     {children ? children : <p className="text-2xl font-bold text-gray-900">{value}</p>}
//     <p className="text-sm text-gray-600">{label}</p>
//   </div>
// );

// const StatsStrip = ({ lectureCompleted, totalLectures, hoursWatched, pct }) => {
//   const isComplete = pct === 100;

//   const handleCertificateClick = () => {
//     toast.info("Certificate generation coming soon!");
//   };

//   return (
//     <div className="flex flex-col sm:flex-row gap-4">
//       {/* Lectures */}
//       <StatCard
//         icon="🎬"
//         value={`${lectureCompleted.length} / ${totalLectures}`}
//         label="Lectures Completed"
//       />

//       {/* Hours */}
//       <StatCard
//         icon="⏱️"
//         value={`${hoursWatched.toFixed(1)} hrs`}
//         label="Hours Learned"
//       />

//       {/* Certificate */}
//       <StatCard
//         icon="🏆"
//         label={isComplete ? "Certificate Ready" : `${100 - pct}% to go`}
//       >
//         {isComplete ? (
//           <button
//             onClick={handleCertificateClick}
//             className="px-4 py-1.5 text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
//             style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 15px -3px rgba(5, 150, 105, 0.4)' }}
//           >
//             Download Certificate
//           </button>
//         ) : (
//           <p className="text-2xl font-bold text-gray-900">{100 - pct}%</p>
//         )}
//       </StatCard>
//     </div>
//   );
// };

// export default StatsStrip;


import React from "react";
import { toast } from "react-toastify";

const StatsStrip = ({ lectureCompleted, totalLectures, hoursWatched, pct }) => {
  const isComplete = pct === 100;

  const handleCertificateClick = () => {
    toast.info("Certificate generation coming soon!");
  };

  const stats = [
    {
      label: "Lectures",
      value: `${lectureCompleted.length}/${totalLectures}`,
      sub: "completed",
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      ),
      color: "#10b981",
      bg: "#f0fdf4",
      border: "#dcfce7",
    },
    {
      label: "Hours",
      value: hoursWatched.toFixed(1),
      sub: "learned",
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "#6366f1",
      bg: "#eef2ff",
      border: "#e0e7ff",
    },
    {
      label: "Certificate",
      value: isComplete ? "Ready" : `${100 - pct}% left`,
      sub: isComplete ? "Download now" : "to unlock",
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 10.5h-1.5A3.375 3.375 0 007.5 14.25v4.5m6-6a3 3 0 10-6 0 3 3 0 006 0z" />
        </svg>
      ),
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fef3c7",
      action: isComplete ? handleCertificateClick : null,
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
      {stats.map((stat, i) => (
        <div
          key={i}
          onClick={stat.action || undefined}
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            padding: "20px 18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)",
            cursor: stat.action ? "pointer" : "default",
            transition: "transform 0.12s, box-shadow 0.15s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            if (stat.action) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.08)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)";
          }}
        >
          {/* Icon badge */}
          <div
            style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: stat.bg, border: `1px solid ${stat.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "14px",
            }}
          >
            {stat.icon}
          </div>

          {/* Value */}
          <p style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "0 0 2px", letterSpacing: "-0.02em", lineHeight: 1 }}>
            {stat.value}
          </p>

          {/* Label */}
          <p style={{ fontSize: "12px", fontWeight: 500, color: "#94a3b8", margin: 0, letterSpacing: "0.01em" }}>
            {stat.label} · <span style={{ color: "#64748b" }}>{stat.sub}</span>
          </p>

          {/* CTA for certificate */}
          {stat.action && (
            <div
              style={{
                marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "4px",
                fontSize: "11px", fontWeight: 700, color: stat.color,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}
            >
              Download
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={stat.color} strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
          )}

          {/* Subtle accent line at top */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "2px", background: stat.color, opacity: 0.15,
            }}
          />
        </div>
      ))}

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StatsStrip;