import React from "react";
import { toast } from "react-toastify";

const StatCard = ({ icon, value, label, children }) => (
  <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex flex-col items-center text-center gap-2">
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
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-semibold rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5"
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
