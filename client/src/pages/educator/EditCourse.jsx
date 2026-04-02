  import React, { useContext, useEffect, useRef, useState } from "react";
  import uniqid from "uniqid";
  import Quill from "quill";
  import { assets } from "../../assets/assets";
  import { AppContext } from "../../context/AppContext";
  import { toast } from "react-toastify";
  import axios from "axios";
  import { useParams, useNavigate } from "react-router-dom";
  import Loading from "../../components/student/Loading";

  const EditCourse = () => {
    const { backendUrl } = useContext(AppContext);
    const { courseId } = useParams();
    const navigate = useNavigate();

    const quillRef = useRef(null);
    const editorRef = useRef(null);
    const quillInitialized = useRef(false);

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [courseTitle, setCourseTitle] = useState("");
    const [coursePrice, setCoursePrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [chapters, setChapters] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentChapterId, setCurrentChapterId] = useState(null);

    // Inline editing state
    const [editingChapter, setEditingChapter] = useState(null);
    const [editingLecture, setEditingLecture] = useState(null);
    const [editChapterTitle, setEditChapterTitle] = useState("");
    const [editLectureDetails, setEditLectureDetails] = useState({});

    const [lectureDetails, setLectureDetails] = useState({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isUploading: false,
      preSetLectureId: null,
      isPreviewFree: false,
    });

    // Load existing course data
    useEffect(() => {
      const fetchCourse = async () => {
        if (!courseId) {
          return;
        }

        try {
          const { data } = await axios.get(
            `${backendUrl}/api/educator/course/${courseId}`
          );

          if (data.success) {
            const course = data.course;
            setCourseTitle(course.courseTitle);
            setCoursePrice(course.coursePrice);
            setDiscount(course.discount);
            // Safely normalize courseContent so chapterContent is always an array
            const normalizedContent = (course.courseContent || []).map(ch => ({
              ...ch,
              chapterContent: Array.isArray(ch.chapterContent) ? ch.chapterContent : [],
              collapsed: ch.collapsed ?? false,
            }));
            setChapters(normalizedContent);
            
            // Quill init with max retry limit
            if (course.courseDescription) {
              let retryCount = 0;
              const maxRetries = 50;
              
              const setQuillContent = () => {
                if (quillRef.current && quillRef.current.root) {
                  quillRef.current.root.innerHTML = course.courseDescription;
                } else if (retryCount < maxRetries) {
                  retryCount++;
                  setTimeout(setQuillContent, 50);
                } else {
                  console.warn("Quill failed to initialize after max retries");
                }
              };
              setQuillContent();
            }
          } else {
            toast.error(data.message);
            navigate("/educator/my-courses");
          }
        } catch (error) {
          toast.error(error.message || "Failed to load course");
          navigate("/educator/my-courses");
        } finally {
          setIsLoading(false);
        }
      };

      fetchCourse();
    }, [courseId, backendUrl, navigate]);

    // Initialize Quill
    useEffect(() => {
      // Once loading finishes, the form is rendered and editorRef is attached
      if (!isLoading && !quillInitialized.current && editorRef.current && !quillRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
        });
        quillInitialized.current = true;
      }
    }, [isLoading]);

    // Inline chapter edit handlers
    const handleEditChapter = (action, chapterId, chapterTitle) => {
      if (action === "start") {
        setEditingChapter(chapterId);
        setEditChapterTitle(chapterTitle);
      } else if (action === "save") {
        if (editChapterTitle.trim()) {
          setChapters(prevChapters => prevChapters.map(ch => 
            ch.chapterId === chapterId 
              ? { ...ch, chapterTitle: editChapterTitle }
              : ch
          ));
          setEditingChapter(null);
          toast.success("Chapter title updated");
        }
      } else if (action === "cancel") {
        setEditingChapter(null);
      }
    };

    // Inline lecture edit handlers - deep clone properly
    const handleEditLecture = (action, chapterId, lectureIndex, lecture) => {
      if (action === "start") {
        setEditingLecture(lecture.lectureId);
        setEditLectureDetails({
          lectureTitle: lecture.lectureTitle,
          lectureDuration: lecture.lectureDuration,
          isPreviewFree: lecture.isPreviewFree,
        });
      } else if (action === "save") {
        setChapters(prevChapters => prevChapters.map(ch => {
          if (ch.chapterId === chapterId) {
            const newChapterContent = ch.chapterContent.map((lec, idx) => {
              if (idx === lectureIndex) {
                return {
                  ...lec,
                  lectureTitle: editLectureDetails.lectureTitle,
                  lectureDuration: Number(editLectureDetails.lectureDuration),
                  isPreviewFree: editLectureDetails.isPreviewFree,
                };
              }
              return lec;
            });
            return { ...ch, chapterContent: newChapterContent };
          }
          return ch;
        }));
        setEditingLecture(null);
        toast.success("Lecture updated");
      } else if (action === "cancel") {
        setEditingLecture(null);
      }
    };

    // Chapter handlers
    const handleChapter = (action, chapterId) => {
      if (action === "add") {
        const title = prompt("Enter Chapter Name:");
        if (title) {
          const newChapter = {
            chapterId: uniqid(),
            chapterTitle: title,
            chapterContent: [],
            collapsed: false,
            chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
          };
          setChapters([...chapters, newChapter]);
        }
      } else if (action === "remove") {
        setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
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

    // Lecture handlers
    const handleLecture = (action, chapterId, lectureIndex) => {
      if (action === "add") {
        setCurrentChapterId(chapterId);
        setShowPopup(true);
      } else if (action === "remove") {
        setChapters(chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const newContent = [...chapter.chapterContent];
            newContent.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: newContent };
          }
          return chapter;
        }));
      }
    };

    // Video upload handler
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

        const { data } = await axios.post(
          backendUrl + "/api/educator/get-upload-url",
          { lectureId }
        );

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

    // Add lecture to chapter
    const addLecture = () => {
      if (lectureDetails.isUploading) {
        return toast.warn("Please wait for the video to finish uploading.");
      }
      if (!lectureDetails.lectureTitle.trim()) {
        return toast.error("Lecture title is required");
      }
      if (!lectureDetails.lectureDuration || lectureDetails.lectureDuration <= 0) {
        return toast.error("Valid duration is required");
      }
      if (!lectureDetails.lectureUrl) {
        return toast.error("Video URL is required");
      }

      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === currentChapterId) {
            const newLecture = {
              lectureTitle: lectureDetails.lectureTitle,
              lectureDuration: Number(lectureDetails.lectureDuration),
              lectureUrl: lectureDetails.lectureUrl,
              lectureOrder: chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
              lectureId: lectureDetails.preSetLectureId || uniqid(),
              isPreviewFree: lectureDetails.isPreviewFree,
            };
            return {
              ...chapter,
              chapterContent: [...chapter.chapterContent, newLecture]
            };
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
        isPreviewFree: false,
      });
    };

    // Reorder handlers - no state mutation
    const moveChapter = (direction, index) => {
      setChapters(prevChapters => {
        const newChapters = [...prevChapters];
        if (direction === "up" && index > 0) {
          [newChapters[index], newChapters[index - 1]] = 
          [newChapters[index - 1], newChapters[index]];
        } else if (direction === "down" && index < newChapters.length - 1) {
          [newChapters[index], newChapters[index + 1]] = 
          [newChapters[index + 1], newChapters[index]];
        }
        return newChapters.map((ch, idx) => ({ ...ch, chapterOrder: idx + 1 }));
      });
    };

    const moveLecture = (direction, chapterId, index) => {
      setChapters(prevChapters => prevChapters.map(ch => {
        if (ch.chapterId === chapterId) {
          const newLectures = [...ch.chapterContent];
          if (direction === "up" && index > 0) {
            [newLectures[index], newLectures[index - 1]] = 
            [newLectures[index - 1], newLectures[index]];
          } else if (direction === "down" && index < newLectures.length - 1) {
            [newLectures[index], newLectures[index + 1]] = 
            [newLectures[index + 1], newLectures[index]];
          }
          const updatedLectures = newLectures.map((lec, idx) => ({
            ...lec,
            lectureOrder: idx + 1
          }));
          return { ...ch, chapterContent: updatedLectures };
        }
        return ch;
      }));
    };

    // Client-side validation before submit
    const validateForm = () => {
      if (!courseTitle.trim()) {
        toast.error("Course title is required");
        return false;
      }
      if (courseTitle.length > 200) {
        toast.error("Course title must be less than 200 characters");
        return false;
      }
      if (coursePrice < 0) {
        toast.error("Price cannot be negative");
        return false;
      }
      if (discount < 0 || discount > 100) {
        toast.error("Discount must be between 0 and 100");
        return false;
      }
      if (chapters.length === 0) {
        toast.error("Course must have at least one chapter");
        return false;
      }
      for (const chapter of chapters) {
        if (!chapter.chapterTitle.trim()) {
          toast.error("All chapters must have a title");
          return false;
        }
        if (chapter.chapterContent.length === 0) {
          toast.error(`Chapter "${chapter.chapterTitle}" must have at least one lecture`);
          return false;
        }
        for (const lecture of chapter.chapterContent) {
          if (!lecture.lectureTitle.trim()) {
            toast.error("All lectures must have a title");
            return false;
          }
          if (!lecture.lectureDuration || lecture.lectureDuration <= 0) {
            toast.error("All lectures must have a valid duration");
            return false;
          }
        }
      }
      return true;
    };

    // Update submit handler
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      setIsSaving(true);

      try {
        // Filter out collapsed property (UI-only, not in schema)
        const cleanedChapters = chapters.map(({ collapsed, ...rest }) => ({
          ...rest,
          chapterContent: rest.chapterContent.map(({ collapsed: lecCollapsed, ...lecRest }) => lecRest)
        }));

        const courseData = {
          courseTitle,
          courseDescription: quillRef.current?.root.innerHTML || "",
          coursePrice: Number(coursePrice),
          discount: Number(discount),
          courseContent: cleanedChapters,
          isPublished: true,
        };

        const { data } = await axios.put(
          `${backendUrl}/api/educator/update-course/${courseId}`,
          { courseData: JSON.stringify(courseData) }
        );

        if (data.success) {
          toast.success("Course updated successfully!");
          setTimeout(() => {
            navigate("/educator/my-courses");
          }, 1500);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Update failed");
      } finally {
        setIsSaving(false);
      }
    };

    // Show loading state
    if (isLoading) {
      return <Loading />;
    }

    return (
      <div className="min-h-screen bg-gray-50/50 overflow-y-auto md:p-8 p-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Edit Course
            </h1>
          </div>
          
          <button
            onClick={() => navigate("/educator/my-courses")}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          {/* Course Essentials Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Course Essentials</h2>
              <p className="text-sm text-gray-400 mt-1">Update your course details</p>
            </div>

            <div className="space-y-5">
              {/* Course Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Course Title</label>
                <input
                  onChange={(e) => setCourseTitle(e.target.value)}
                  value={courseTitle}
                  type="text"
                  className="w-full py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>

              {/* Price and Discount */}
              <div className="flex flex-wrap gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Course Price ($)</label>
                  <input
                    onChange={(e) => setCoursePrice(e.target.value)}
                    value={coursePrice}
                    type="number"
                    min="0"
                    className="w-36 py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Discount %</label>
                  <input
                    onChange={(e) => setDiscount(e.target.value)}
                    value={discount}
                    type="number"
                    min="0"
                    max="100"
                    className="w-36 py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                  <div ref={editorRef}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
              <p className="text-sm text-gray-400 mt-1">Edit chapters and lectures</p>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapter.chapterId} className="bg-white border border-gray-200 rounded-lg mb-4">
                  {/* Chapter Header with Inline Edit */}
                  <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-3">
                      <img
                        onClick={() => handleChapter("toggle", chapter.chapterId)}
                        src={assets.dropdown_icon}
                        className={`w-3.5 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`}
                      />
                      
                      {editingChapter === chapter.chapterId ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editChapterTitle}
                            onChange={(e) => setEditChapterTitle(e.target.value)}
                            className="border border-emerald-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleEditChapter("save", chapter.chapterId)}
                            className="text-emerald-600 hover:text-emerald-700 text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleEditChapter("cancel")}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-semibold text-gray-800">
                            {chapterIndex + 1}. {chapter.chapterTitle}
                          </span>
                          <button
                            onClick={() => handleEditChapter("start", chapter.chapterId, chapter.chapterTitle)}
                            className="text-gray-400 hover:text-emerald-600 text-xs"
                          >
                            ✏️
                          </button>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {chapter.chapterContent.length} Lectures
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveChapter("up", chapterIndex)}
                          disabled={chapterIndex === 0}
                          className="text-gray-400 hover:text-emerald-600 disabled:opacity-30 text-xs"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveChapter("down", chapterIndex)}
                          disabled={chapterIndex === chapters.length - 1}
                          className="text-gray-400 hover:text-emerald-600 disabled:opacity-30 text-xs"
                        >
                          ↓
                        </button>
                      </div>
                      <img
                        onClick={() => handleChapter("remove", chapter.chapterId)}
                        src={assets.cross_icon}
                        className="w-4 cursor-pointer hover:text-red-500"
                      />
                    </div>
                  </div>

                  {/* Chapter Content */}
                  {!chapter.collapsed && (
                    <div className="p-4">
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <div key={lecture.lectureId}>
                          {editingLecture === lecture.lectureId ? (
                            <div className="bg-emerald-50/50 p-3 rounded-lg mb-2 space-y-3 border border-emerald-100">
                              <div>
                                <label className="text-xs text-gray-600 font-medium">Lecture Title</label>
                                <input
                                  type="text"
                                  value={editLectureDetails.lectureTitle}
                                  onChange={(e) => setEditLectureDetails(prev => ({
                                    ...prev, lectureTitle: e.target.value
                                  }))}
                                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mt-1 outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-600 font-medium">Duration (minutes)</label>
                                <input
                                  type="number"
                                  value={editLectureDetails.lectureDuration}
                                  onChange={(e) => setEditLectureDetails(prev => ({
                                    ...prev, lectureDuration: e.target.value
                                  }))}
                                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mt-1 outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={editLectureDetails.isPreviewFree}
                                  onChange={(e) => setEditLectureDetails(prev => ({
                                    ...prev, isPreviewFree: e.target.checked
                                  }))}
                                  className="w-4 h-4 text-emerald-600 rounded"
                                />
                                <label className="text-sm text-gray-700">Free Preview</label>
                              </div>
                              <div className="flex gap-2 pt-2 border-t border-emerald-100">
                                <button
                                  onClick={() => handleEditLecture("save", chapter.chapterId, lectureIndex, lecture)}
                                  className="bg-emerald-600 text-white px-4 py-1.5 rounded text-sm hover:bg-emerald-700 font-medium"
                                >
                                  Save Changes
                                </button>
                                <button
                                  onClick={() => handleEditLecture("cancel")}
                                  className="bg-white text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-50 border border-gray-300 font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center mb-2 group">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-800">
                                    {lectureIndex + 1}. {lecture.lectureTitle}
                                  </span>
                                  <span className="text-xs text-gray-400">({lecture.lectureDuration} min)</span>
                                  {lecture.isPreviewFree && (
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] uppercase px-2 py-0.5 rounded font-medium">
                                      Free Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => moveLecture("up", chapter.chapterId, lectureIndex)}
                                  disabled={lectureIndex === 0}
                                  className="text-gray-400 hover:text-emerald-600 disabled:opacity-30 text-xs"
                                >
                                  ↑
                                </button>
                                <button
                                  onClick={() => moveLecture("down", chapter.chapterId, lectureIndex)}
                                  disabled={lectureIndex === chapter.chapterContent.length - 1}
                                  className="text-gray-400 hover:text-emerald-600 disabled:opacity-30 text-xs"
                                >
                                  ↓
                                </button>
                                <button
                                  onClick={() => handleEditLecture("start", chapter.chapterId, lectureIndex, lecture)}
                                  className="text-gray-400 hover:text-emerald-600 text-sm"
                                >
                                  ✏️ Edit
                                </button>
                                <img
                                  src={assets.cross_icon}
                                  onClick={() => handleLecture("remove", chapter.chapterId, lectureIndex)}
                                  className="w-4 cursor-pointer hover:text-red-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div
                        className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2 hover:bg-gray-200 transition-colors"
                        onClick={() => handleLecture("add", chapter.chapterId)}
                      >
                        + Add Lecture
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div
                className="flex justify-center items-center bg-emerald-50 p-3 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
                onClick={() => handleChapter("add")}
              >
                + Add Chapter
              </div>
            </div>
          </div>

          {/* Add Lecture Popup */}
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white text-gray-700 p-6 rounded-xl relative w-full max-w-md mx-4">
                <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700">Lecture Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 outline-none focus:border-emerald-500"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                    placeholder="Enter lecture title"
                  />
                </div>

                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 outline-none focus:border-emerald-500"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                    placeholder="e.g., 15"
                  />
                </div>

                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700">Video Upload</label>
                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleVideoUpload}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    disabled={lectureDetails.isUploading}
                  />
                  {lectureDetails.lectureUrl && (
                    <p className={`text-xs mt-1 ${lectureDetails.isUploading ? 'text-yellow-600' : 'text-emerald-600'}`}>
                      {lectureDetails.lectureUrl}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 my-4">
                  <input
                    type="checkbox"
                    id="isPreviewFree"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="isPreviewFree" className="text-sm text-gray-700">Available as free preview</label>
                </div>

                <button
                  type="button"
                  className="w-full bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
                  onClick={addLecture}
                  disabled={lectureDetails.isUploading || !lectureDetails.lectureUrl}
                >
                  {lectureDetails.isUploading ? "Uploading..." : "Add Lecture"}
                </button>

                <button
                  onClick={() => {
                    setShowPopup(false);
                    setLectureDetails({
                      lectureTitle: "",
                      lectureDuration: "",
                      lectureUrl: "",
                      isUploading: false,
                      preSetLectureId: null,
                      isPreviewFree: false,
                    });
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/educator/my-courses")}
              className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  export default EditCourse;
