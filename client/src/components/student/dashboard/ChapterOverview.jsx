


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChapterOverview = ({ chapterProgress, courseId, lectureCompleted = [] }) => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredLecId, setHoveredLecId] = useState(null);

  const totalChapters = chapterProgress.length;
  const completedChapters = chapterProgress.filter(
    (ch) => ch.done === ch.total && ch.total > 0
  ).length;

  const toggleChapter = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const goToPlayer = () => {
    navigate(`/player/${courseId}`);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Course Chapters
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              margin: "3px 0 0",
              fontWeight: 500,
            }}
          >
            {completedChapters} of {totalChapters} chapters completed
          </p>
        </div>
        <div
          style={{
            padding: "4px 10px",
            borderRadius: "6px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            fontSize: "11px",
            fontWeight: 700,
            color: "#475569",
            letterSpacing: "0.02em",
          }}
        >
          {totalChapters} chapters
        </div>
      </div>

      {/* Chapter list */}
      <div style={{ padding: "4px 0" }}>
        {chapterProgress.map((chapter, index) => {
          const chapterPct =
            chapter.total === 0
              ? 0
              : Math.round((chapter.done / chapter.total) * 100);
          const isComplete =
            chapter.done === chapter.total && chapter.total > 0;
          const isStarted = chapter.done > 0;
          const isHovered = hoveredId === chapter.chapterId;
          const isExpanded = expandedId === chapter.chapterId;

          return (
            <div key={chapter.chapterId}>
              {/* Chapter row */}
              <div
                onClick={() => toggleChapter(chapter.chapterId)}
                onMouseEnter={() => setHoveredId(chapter.chapterId)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 24px",
                  cursor: "pointer",
                  background: isExpanded
                    ? "#f8fafc"
                    : isHovered
                    ? "#fafbfc"
                    : "transparent",
                  borderLeft: isExpanded
                    ? "2px solid #10b981"
                    : isHovered
                    ? "2px solid #cbd5e1"
                    : "2px solid transparent",
                  transition: "all 0.12s ease",
                  userSelect: "none",
                }}
              >
                {/* Chapter number / status */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "12px",
                    fontWeight: 700,
                    background: isComplete
                      ? "#059669"
                      : isStarted
                      ? "#f0fdf4"
                      : "#f8fafc",
                    color: isComplete
                      ? "#ffffff"
                      : isStarted
                      ? "#059669"
                      : "#94a3b8",
                    border: isComplete
                      ? "none"
                      : isStarted
                      ? "1px solid #bbf7d0"
                      : "1px solid #e2e8f0",
                    transition: "all 0.15s",
                  }}
                >
                  {isComplete ? (
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#ffffff"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  )}
                </div>

                {/* Chapter info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color:
                          isExpanded || isHovered ? "#0f172a" : "#334155",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        transition: "color 0.12s",
                      }}
                    >
                      {chapter.chapterTitle}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        flexShrink: 0,
                        color: isComplete ? "#059669" : "#94a3b8",
                      }}
                    >
                      {chapter.done}/{chapter.total}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "3px",
                        background: "#f1f5f9",
                        borderRadius: "99px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "99px",
                          width: `${chapterPct}%`,
                          background: isComplete
                            ? "#059669"
                            : isStarted
                            ? "linear-gradient(90deg, #0f172a, #475569)"
                            : "transparent",
                          transition:
                            "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#94a3b8",
                        flexShrink: 0,
                        width: "28px",
                        textAlign: "right",
                      }}
                    >
                      {chapterPct}%
                    </span>
                  </div>
                </div>

                {/* Expand/collapse arrow */}
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  style={{
                    flexShrink: 0,
                    transform: isExpanded
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease, opacity 0.15s",
                    opacity: isHovered || isExpanded ? 1 : 0.5,
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>

              {/* ── Expanded lecture list ───────────────────────────── */}
              {isExpanded && (
                <div
                  style={{
                    background: "#f8fafc",
                    borderTop: "1px solid #f1f5f9",
                    borderBottom: "1px solid #f1f5f9",
                    padding: "6px 0",
                  }}
                >
                  {chapter.chapterContent.map((lec, lecIndex) => {
                    const isDone = lectureCompleted.includes(lec.lectureId);
                    const isLecHovered = hoveredLecId === lec.lectureId;

                    // Format duration
                    const mins = lec.lectureDuration
                      ? Math.round(lec.lectureDuration)
                      : null;
                    const durationLabel = mins
                      ? mins >= 60
                        ? `${Math.floor(mins / 60)}h ${mins % 60}m`
                        : `${mins} min`
                      : null;

                    return (
                      <div
                        key={lec.lectureId}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPlayer();
                        }}
                        onMouseEnter={() =>
                          setHoveredLecId(lec.lectureId)
                        }
                        onMouseLeave={() => setHoveredLecId(null)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 24px 10px 74px",
                          cursor: "pointer",
                          background: isLecHovered
                            ? "#f1f5f9"
                            : "transparent",
                          transition: "background 0.1s",
                        }}
                      >
                        {/* Completion indicator */}
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isDone ? "#059669" : "#ffffff",
                            border: isDone
                              ? "none"
                              : "2px solid #cbd5e1",
                            transition: "all 0.15s",
                          }}
                        >
                          {isDone ? (
                            <svg
                              width="12"
                              height="12"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="#ffffff"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          ) : (
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: 700,
                                color: "#94a3b8",
                              }}
                            >
                              {lecIndex + 1}
                            </span>
                          )}
                        </div>

                        {/* Lecture info */}
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              minWidth: 0,
                            }}
                          >
                            {/* Play / completed icon */}
                            {isDone ? (
                              <svg
                                width="14"
                                height="14"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="#059669"
                                strokeWidth="1.8"
                                style={{ flexShrink: 0 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="14"
                                height="14"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="#94a3b8"
                                strokeWidth="1.8"
                                style={{ flexShrink: 0 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                                />
                              </svg>
                            )}

                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: isDone ? 500 : 500,
                                color: isDone ? "#64748b" : "#334155",
                                textDecoration: isDone
                                  ? "line-through"
                                  : "none",
                                textDecorationColor: "#cbd5e1",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                transition: "color 0.12s",
                              }}
                            >
                              {lec.lectureTitle}
                            </span>
                          </div>

                          {/* Right side: duration + status */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexShrink: 0,
                            }}
                          >
                            {durationLabel && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 500,
                                  color: "#94a3b8",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "3px",
                                }}
                              >
                                <svg
                                  width="10"
                                  height="10"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="#94a3b8"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {durationLabel}
                              </span>
                            )}

                            {/* Status pill */}
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                padding: "2px 7px",
                                borderRadius: "4px",
                                background: isDone ? "#f0fdf4" : "#f8fafc",
                                color: isDone ? "#059669" : "#94a3b8",
                                border: isDone
                                  ? "1px solid #bbf7d0"
                                  : "1px solid #e2e8f0",
                              }}
                            >
                              {isDone ? "Done" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Chapter summary bar inside expanded */}
                  <div
                    style={{
                      margin: "8px 24px 8px 74px",
                      padding: "10px 14px",
                      background: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "4px",
                          background: "#f1f5f9",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${chapterPct}%`,
                            borderRadius: "99px",
                            background: isComplete
                              ? "#059669"
                              : "linear-gradient(90deg, #10b981, #34d399)",
                            transition:
                              "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: isComplete ? "#059669" : "#475569",
                          flexShrink: 0,
                        }}
                      >
                        {chapterPct}%
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPlayer();
                      }}
                      style={{
                        marginLeft: "14px",
                        padding: "5px 14px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#ffffff",
                        background: "#0f172a",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        letterSpacing: "0.01em",
                        transition: "opacity 0.12s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.85")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                    >
                      {isComplete ? "Review" : "Continue"}
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterOverview;