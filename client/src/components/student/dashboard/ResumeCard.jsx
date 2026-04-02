import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../../assets/assets";

const ResumeCard = ({ course, resumeChapter, resumeLecture, lectureCompleted, totalLectures, pct }) => {
  const navigate = useNavigate();

  const isComplete = pct === 100;
  const isNotStarted = lectureCompleted.length === 0;

  const getButtonLabel = () => {
    if (isComplete) return "Review Course";
    if (isNotStarted) return "Start Learning →";
    return "Resume Lecture →";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={assets.course_thumbnail}
            alt={course.courseTitle}
            className="w-full md:w-48 h-32 object-cover rounded-lg border border-gray-200"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{course.courseTitle}</h2>

            {isComplete ? (
              <div className="mt-2 flex items-center gap-2 text-emerald-600 font-medium">
                <span className="text-xl">✅</span>
                <span>Course Completed</span>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-600 space-y-0.5">
                {resumeChapter && (
                  <p className="text-gray-800 font-medium">{resumeChapter.chapterTitle}</p>
                )}
                {resumeLecture && (
                  <p>{resumeLecture.lectureTitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{lectureCompleted.length} of {totalLectures} lectures completed</span>
              <span className="text-emerald-600 font-semibold">{pct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate(`/player/${course._id}`)}
            className="self-start mt-1 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 text-sm"
          >
            {getButtonLabel()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
