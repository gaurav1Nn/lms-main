import React from "react";
import { toast } from "react-toastify";

const StatCard = ({ icon, value, label, children }) => (
  <div className="flex-1 bg-white/80 backdrop-blur-xl border border-emerald-100/50 shadow-xl rounded-2xl p-5 flex flex-col items-center text-center gap-2"
       style={{ boxShadow: '0 25px 60px -12px rgba(5, 150, 105, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.05)' }}>
    <span className="text-3xl">{icon}</span>
    {children ? children : <p className="text-2xl font-bold text-gray-900">{value}</p>}
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const StatsStrip = ({ lectureCompleted, totalLectures, hoursWatched, pct }) => {
  const isComplete = pct === 100;

  const handleCertificateClick = () => {
    toast.info("Certificate generation coming soon!");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Lectures */}
      <StatCard
        icon="🎬"
        value={`${lectureCompleted.length} / ${totalLectures}`}
        label="Lectures Completed"
      />

      {/* Hours */}
      <StatCard
        icon="⏱️"
        value={`${hoursWatched.toFixed(1)} hrs`}
        label="Hours Learned"
      />

      {/* Certificate */}
      <StatCard
        icon="🏆"
        label={isComplete ? "Certificate Ready" : `${100 - pct}% to go`}
      >
        {isComplete ? (
          <button
            onClick={handleCertificateClick}
            className="px-4 py-1.5 text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 15px -3px rgba(5, 150, 105, 0.4)' }}
          >
            Download Certificate
          </button>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{100 - pct}%</p>
        )}
      </StatCard>
    </div>
  );
};

export default StatsStrip;
