// import React, { useContext, useEffect, useRef, useState } from "react";
// import uniqid from "uniqid";
// import Quill from "quill";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
// import { toast } from "react-toastify";
// import axios from "axios";

// const AddCourse = () => {
//   const { backendUrl } = useContext(AppContext);

//   const quillRef = useRef(null);
//   const editorRef = useRef(null);

//   const [courseTitle, setCourseTitle] = useState("");
//   const [coursePrice, setCoursePrice] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [image, setImage] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentChapterId, setCurrentChapterId] = useState(null);

//   const [lectureDetails, setLectureDetails] = useState({
//     lectureTitle: "",
//     lectureDuration: "",
//     lectureUrl: "",
//     isPreviewFree: false,
//   });

//   const handleChapter = (action, chapterId) => {
//     if (action === "add") {
//       const title = prompt("Enter Chapter Name:");
//       if (title) {
//         const newChapter = {
//           chapterId: uniqid(),
//           chapterTitle: title,
//           chapterContent: [],
//           collapsed: false,
//           chapterOrder:
//             chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
//         };
//         setChapters([...chapters, newChapter]);
//       }
//     } else if (action === "remove") {
//       setChapters(
//         chapters.filter((chapter) => chapter.chapterId !== chapterId)
//       );
//     } else if (action === "toggle") {
//       setChapters(
//         chapters.map((chapter) =>
//           chapter.chapterId === chapterId
//             ? { ...chapter, collapsed: !chapter.collapsed }
//             : chapter
//         )
//       );
//     }
//   };

//   const handleLecture = (action, chapterId, lectureIndex) => {
//     if (action === "add") {
//       setCurrentChapterId(chapterId);
//       setShowPopup(true);
//     } else if (action === "remove") {
//       setChapters(
//         chapters.map((chapter) => {
//           if (chapter.chapterId === chapterId) {
//             chapter.chapterContent.splice(lectureIndex, 1);
//           }
//           return chapter;
//         })
//       );
//     }
//   };

//   const addLecture = () => {
//     setChapters(
//       chapters.map((chapter) => {
//         if (chapter.chapterId === currentChapterId) {
//           const newLecture = {
//             ...lectureDetails,
//             lectureOrder:
//               chapter.chapterContent.length > 0
//                 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
//                 : 1,
//             lectureId: uniqid(),
//           };
//           chapter.chapterContent.push(newLecture);
//         }
//         return chapter;
//       })
//     );
//     setShowPopup(false);
//     setLectureDetails({
//       lectureTitle: "",
//       lectureDuration: "",
//       lectureUrl: "",
//       isPreviewFree: false,
//     });
//   };

//   const handleSubmit = async (e) => {
//     try {
//       e.preventDefault();

//       const courseData = {
//         courseTitle,
//         courseDescription: quillRef.current.root.innerHTML,
//         coursePrice: Number(coursePrice),
//         discount: Number(discount),
//         courseContent: chapters,
//       };

//       const formData = new FormData();
//       formData.append("courseData", JSON.stringify(courseData));
//       formData.append("image", image);

//       const { data } = await axios.post(
//         backendUrl + "/api/educator/add-course",
//         formData
//       );

//       if (data.success) {
//         toast.success(data.message);
//         setCourseTitle("");
//         setCoursePrice(0);
//         setDiscount(0);
//         setImage(null);
//         setChapters([]);
//         quillRef.current.root.innerHTML = "";
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (!quillRef.current && editorRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//       });
//     }
//   }, []);

//   return (
//     <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4 max-w-md w-full text-gray-500"
//       >
//         <div className="flex flex-col gap-1">
//           <p>Course Title</p>
//           <input
//             onChange={(e) => setCourseTitle(e.target.value)}
//             value={courseTitle}
//             type="text"
//             placeholder="Type here"
//             className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
//             required
//           />
//         </div>
//         <div className="flex flex-col gap-1">
//           <p>Course Description</p>
//           <div ref={editorRef}></div>
//         </div>

//         <div className="flex items-center justify-between flex-wrap">
//           <div className="flex flex-col gap-1">
//             <p>Course Price</p>
//             <input
//               onChange={(e) => setCoursePrice(e.target.value)}
//               value={coursePrice}
//               type="number"
//               placeholder="0"
//               className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
//             />
//           </div>

//           <div className="flex md:flex-row flex-col items-center gap-3">
//             <p>Course Thumbnail</p>
//             <label
//               htmlFor="thumbnailImage"
//               className="flex items-center gap-3 cursor-pointer"
//             >
//               <img
//                 src={assets.file_upload_icon}
//                 alt="file_upload_icon"
//                 className="p-3 bg-blue-500 rounded"
//               />
//               <input
//                 type="file"
//                 id="thumbnailImage"
//                 onChange={(e) => setImage(e.target.files[0])}
//                 accept="image/*"
//                 hidden
//               />
//               {image && (
//                 <img
//                   className="max-h-10"
//                   src={URL.createObjectURL(image)}
//                   alt=""
//                 />
//               )}
//             </label>
//           </div>
//         </div>

//         <div className="flex flex-col gap-1">
//           <p>Discount %</p>
//           <input
//             onChange={(e) => setDiscount(e.target.value)}
//             value={discount}
//             type="number"
//             placeholder="0"
//             min={0}
//             max={100}
//             className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
//             required
//           />
//         </div>

//         {/* Adding Chapters & Lectures */}
//         <div>
//           {chapters.map((chapter, chapterIndex) => (
//             <div key={chapterIndex} className="bg-white border rounded-lg mb-4">
//               <div className="flex justify-between items-center p-4 border-b">
//                 <div className="flex items-center">
//                   <img
//                     onClick={() => handleChapter("toggle", chapter.chapterId)}
//                     src={assets.dropdown_icon}
//                     width={14}
//                     alt="dropdown_icon"
//                     className={`mr-2 cursor-pointer transition-all ${
//                       chapter.collapsed && "-rotate-90"
//                     }`}
//                   />
//                   <span className="font-semibold">
//                     {chapterIndex + 1} {chapter.chapterTitle}
//                   </span>
//                 </div>
//                 <span className="text-gray-500">
//                   {chapter.chapterContent.length} Lectures
//                 </span>
//                 <img
//                   onClick={() => handleChapter("remove", chapter.chapterId)}
//                   src={assets.cross_icon}
//                   alt="cross_icon"
//                   className="cursor-pointer"
//                 />
//               </div>
//               {!chapter.collapsed && (
//                 <div className="p-4">
//                   {chapter.chapterContent.map((lecture, lectureIndex) => (
//                     <div
//                       key={lectureIndex}
//                       className="flex justify-between items-center mb-2"
//                     >
//                       <span>
//                         {lectureIndex + 1} {lecture.lectureTitle} -{" "}
//                         {lecture.lectureDuration} mins -{" "}
//                         <a
//                           href={lecture.lectureUrl}
//                           target="_blank"
//                           className="text-blue-500"
//                         >
//                           Link
//                         </a>{" "}
//                         - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
//                       </span>
//                       <img
//                         src={assets.cross_icon}
//                         alt="cross_icon"
//                         onClick={() =>
//                           handleLecture(
//                             "remove",
//                             chapter.chapterId,
//                             lectureIndex
//                           )
//                         }
//                         className="cursor-pointer"
//                       />
//                     </div>
//                   ))}
//                   <div
//                     className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
//                     onClick={() => handleLecture("add", chapter.chapterId)}
//                   >
//                     + Add Lecture
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//           <div
//             className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
//             onClick={() => handleChapter("add")}
//           >
//             + Add Chapter
//           </div>

//           {showPopup && (
//             <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//               <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
//                 <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

//                 <div className="mb-2">
//                   <p>Lecture Title</p>
//                   <input
//                     type="text"
//                     className="mt-1 block w-full border rounded py-1 px-2"
//                     value={lectureDetails.lectureTitle}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         lectureTitle: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="mb-2">
//                   <p>Duration (minutes)</p>
//                   <input
//                     type="number"
//                     className="mt-1 block w-full border rounded py-1 px-2"
//                     value={lectureDetails.lectureDuration}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         lectureDuration: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="mb-2">
//                   <p>Lecture URL</p>
//                   <input
//                     type="text"
//                     className="mt-1 block w-full border rounded py-1 px-2"
//                     value={lectureDetails.lectureUrl}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         lectureUrl: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="flex gap-2 my-4">
//                   <p>Is Preview Free?</p>
//                   <input
//                     type="checkbox"
//                     className="mt-1 scale-125"
//                     checked={lectureDetails.isPreviewFree}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         isPreviewFree: e.target.checked,
//                       })
//                     }
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   className="w-full bg-blue-400 text-white px-4 py-2 rounded"
//                   onClick={addLecture}
//                 >
//                   Add
//                 </button>

//                 <img
//                   onClick={() => setShowPopup(false)}
//                   src={assets.cross_icon}
//                   className="absolute top-4 right-4 w-4 cursor-pointer"
//                   alt="cross_icon"
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//         <button
//           type="submit"
//           className="bg-black text-white w-max py-2.5 px-8 rounded my-4"
//         >
//           ADD
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddCourse;


// new code 
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
    isPreviewFree: false,
  });

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
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
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
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);

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
                          {lecture.isPreviewFree && (
                            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                              Free
                            </span>
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
                  Lecture URL
                </label>
                <input
                  type="text"
                  className="w-full py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800
                             outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <div
                  onClick={() =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: !lectureDetails.isPreviewFree,
                    })
                  }
                  className={`w-10 h-6 rounded-full cursor-pointer transition-colors relative ${
                    lectureDetails.isPreviewFree
                      ? "bg-emerald-600"
                      : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      lectureDetails.isPreviewFree
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </div>
                <label className="text-sm font-medium text-gray-700 cursor-pointer"
                  onClick={() =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: !lectureDetails.isPreviewFree,
                    })
                  }
                >
                  Free Preview
                </label>
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