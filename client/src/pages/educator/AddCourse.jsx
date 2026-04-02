
import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddCourse = () => {
  const { backendUrl } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isUploading: false,
    preSetLectureId: null,
  });

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 500 * 1024 * 1024) {
      toast.error("Video size cannot exceed 500MB");
      e.target.value = "";
      return;
    }

    try {
      setLectureDetails(prev => ({ ...prev, lectureUrl: "Uploading...", isUploading: true }));
      
      const lectureId = uniqid(); 
      
      const { data } = await axios.post(backendUrl + "/api/educator/get-upload-url", { lectureId });
      
      if (!data.success) throw new Error(data.message);
      
      const { uploadUrl, s3Key } = data;

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "video/mp4" }
      });

      if (!uploadResponse.ok) throw new Error("S3 Upload Failed");

      setLectureDetails(prev => ({ 
        ...prev, 
        lectureUrl: s3Key, 
        isUploading: false,
        preSetLectureId: lectureId
      }));

      toast.success("Video uploaded securely to S3!");
      
    } catch (error) {
      toast.error(error.message || "Upload failed");
      setLectureDetails(prev => ({ ...prev, lectureUrl: "", isUploading: false, preSetLectureId: null }));
      e.target.value = "";
    }
  };

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    if (lectureDetails.isUploading) {
      return toast.warn("Please wait for the video to finish uploading.");
    }
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            lectureTitle: lectureDetails.lectureTitle,
            lectureDuration: lectureDetails.lectureDuration,
            lectureUrl: lectureDetails.lectureUrl,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: lectureDetails.preSetLectureId || uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isUploading: false,
      preSetLectureId: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/educator/add-course",
        formData
      );

      if (data.success) {
        toast.success(data.message);
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 overflow-y-auto md:p-8 p-4 pt-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-600 p-2 rounded-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Create New Course
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* ─── Course Essentials Card ─── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Course Essentials
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Define the core identity of your quantitative module.
            </p>
          </div>

          <div className="space-y-5">
            {/* Course Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Course Title
              </label>
              <input
                onChange={(e) => setCourseTitle(e.target.value)}
                value={courseTitle}
                type="text"
                placeholder="e.g., Stochastic Calculus for Algorithmic Trading"
                className="w-full py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 
                           placeholder:text-gray-400 outline-none 
                           focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Price and Discount Row */}
            <div className="flex flex-wrap gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Course Price ($)
                </label>
                <input
                  onChange={(e) => setCoursePrice(e.target.value)}
                  value={coursePrice}
                  type="number"
                  placeholder="0"
                  className="w-36 py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800
                             outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Discount %
                </label>
                <input
                  onChange={(e) => setDiscount(e.target.value)}
                  value={discount}
                  type="number"
                  placeholder="0"
                  min={0}
                  max={100}
                  className="w-36 py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800
                             outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Description
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-white [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[150px]">
                <div ref={editorRef}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Visual Representation Card ─── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Visual Representation
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              The thumbnail serves as the first point of intellectual contact.
            </p>
          </div>

          <label
            htmlFor="thumbnailImage"
            className="flex flex-col items-center justify-center gap-3 p-8 
                       border-2 border-dashed border-gray-200 rounded-xl 
                       cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 
                       transition-colors"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-h-52 rounded-lg object-contain"
              />
            ) : (
              <>
                <div className="bg-emerald-50 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Drag & drop course thumbnail
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  Recommended: 1920×1080 (PNG, JPG)
                </p>
              </>
            )}
            <input
              type="file"
              id="thumbnailImage"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              hidden
            />
          </label>

          {image && (
            <button
              type="button"
              onClick={() => setImage(null)}
              className="mt-3 text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Remove thumbnail
            </button>
          )}
        </div>

        {/* ─── Module Architecture Card ─── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Module Architecture
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Structure your curriculum into logical chapters and lectures.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleChapter("add")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-600 
                         text-emerald-600 text-sm font-medium 
                         hover:bg-emerald-50 transition-colors whitespace-nowrap"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Chapter
            </button>
          </div>

          {/* Chapters */}
          <div className="space-y-4">
            {chapters.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                No chapters yet. Click "Add Chapter" to start building your
                curriculum.
              </div>
            )}

            {chapters.map((chapter, chapterIndex) => (
              <div
                key={chapterIndex}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                {/* Chapter Header */}
                <div className="flex items-center gap-3 p-4 bg-gray-50/80">
                  <button
                    type="button"
                    onClick={() =>
                      handleChapter("toggle", chapter.chapterId)
                    }
                    className="flex-shrink-0"
                  >
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        chapter.collapsed ? "-rotate-90" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>

                  <div className="bg-emerald-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                    {String(chapterIndex + 1).padStart(2, "0")}
                  </div>

                  <span className="font-semibold text-gray-800 flex-1 truncate">
                    {chapter.chapterTitle}
                  </span>

                  <span className="text-xs text-gray-400 mr-2">
                    {chapter.chapterContent.length}{" "}
                    {chapter.chapterContent.length === 1
                      ? "lecture"
                      : "lectures"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleChapter("remove", chapter.chapterId)
                    }
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>

                {/* Lectures */}
                {!chapter.collapsed && (
                  <div className="p-4 space-y-3">
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div
                        key={lectureIndex}
                        className="flex items-center gap-3 group"
                      >
                        <svg
                          className="w-4 h-4 text-gray-300 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                          />
                        </svg>

                        <span className="text-sm text-gray-400 font-mono w-8 flex-shrink-0">
                          {chapterIndex + 1}.{lectureIndex + 1}
                        </span>

                        <div className="flex-1 flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-sm text-gray-700 truncate flex-1">
                            {lecture.lectureTitle}
                          </span>
                          <span className="text-xs text-gray-400">
                            {lecture.lectureDuration} min
                          </span>
                          {lecture.lectureUrl && (
                            <a
                              href={lecture.lectureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                                />
                              </svg>
                            </a>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleLecture(
                              "remove",
                              chapter.chapterId,
                              lectureIndex
                            )
                          }
                          className="text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        handleLecture("add", chapter.chapterId)
                      }
                      className="flex items-center gap-2 text-sm text-emerald-600 font-medium 
                                 hover:text-emerald-700 transition-colors mt-2 ml-7"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Add Lecture
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Submit Button ─── */}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold 
                     py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
          Finalize and Publish Course
        </button>

        <p className="text-center text-xs text-gray-400 tracking-wider uppercase pb-8">
          Proceeding will make this content visible to the Quantpact community.
        </p>
      </form>

      {/* ─── Add Lecture Popup ─── */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Add Lecture
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Define the lecture details for this chapter.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Lecture Title
                </label>
                <input
                  type="text"
                  className="w-full py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800
                             outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="w-full py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800
                             outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Lecture Video
                </label>
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={handleVideoUpload}
                  className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 mb-2
                             outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <p className="text-xs text-gray-400">Or enter a YouTube URL:</p>
                <input
                  type="text"
                  className={`w-full py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800
                             outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors
                             ${lectureDetails.isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  value={lectureDetails.lectureUrl}
                  readOnly={lectureDetails.isUploading}
                  placeholder="https://youtube.com/..."
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold 
                         py-3 rounded-lg transition-colors"
              onClick={addLecture}
            >
              Add Lecture
            </button>

            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;