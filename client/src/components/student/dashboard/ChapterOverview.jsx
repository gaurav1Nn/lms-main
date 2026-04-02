import React from "react";
import { useNavigate } from "react-router-dom";

const StatusIcon = ({ done, total }) => {
  if (done === 0) {
    return (
      <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 inline-block" />
    );
  }
  if (done === total) {
    return (
      <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-xs text-white">
        ✓
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 inline-block" />
  );
};

const ChapterOverview = ({ chapterProgress, courseId }) => {
  const navigate = useNavigate();

  const handleChapterClick = () => {
    navigate(`/player/${courseId}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Chapters</h2>
      <div className="space-y-3">
        {chapterProgress.map((chapter) => {
          const chapterPct = chapter.total === 0
            ? 0
            : Math.round((chapter.done / chapter.total) * 100);

          return (
            <div
              key={chapter.chapterId}
              onClick={handleChapterClick}
              className="bg-white/80 backdrop-blur-xl border border-emerald-100/50 rounded-2xl p-4 cursor-pointer hover:border-emerald-400 hover:bg-white transition-all duration-200 group shadow-md"
              style={{ boxShadow: '0 10px 30px -10px rgba(5, 150, 105, 0.1)' }}
            >
              <div className="flex items-center gap-3">
                <StatusIcon done={chapter.done} total={chapter.total} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                      {chapter.chapterTitle}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {chapter.done} / {chapter.total} lectures
                    </span>
                  </div>
                  {/* Per-chapter progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${chapterPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterOverview;
