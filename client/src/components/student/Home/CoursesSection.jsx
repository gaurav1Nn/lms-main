// import React, { useContext } from "react";
// import { AppContext } from "../../../context/AppContext";
// import CourseCard from "../CourseCard";
// import { Link } from "react-router-dom";
// import useScrollAnimation from "../../../hooks/useScrollAnimation";

// const CoursesSection = () => {
//   const { allCourses } = useContext(AppContext);
//   const [sectionRef, isVisible] = useScrollAnimation();

//   return (
//     <section id="courses" className="py-20 bg-gray-50" ref={sectionRef}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Section Header */}
//         <div className={`text-center md:text-left mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
//           <p className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-2">
//             Curriculum
//           </p>
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//             <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
//               Featured Quantitative Courses
//             </h2>
//             <Link 
//               to="/course-list" 
//               className="hidden md:inline-flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
//             >
//               View All Courses
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
//               </svg>
//             </Link>
//           </div>
//         </div>

//         {/* Courses Grid */}
//         <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
//           {allCourses && allCourses.slice(0, 8).map((course, index) => (
//             <CourseCard key={index} course={course} />
//           ))}
//         </div>

//         {/* Mobile View All Button */}
//         <div className="mt-10 flex justify-center md:hidden">
//           <Link 
//             to="/course-list" 
//             className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors shadow-sm"
//           >
//             View All Courses
//           </Link>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default CoursesSection;


import React, { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import CourseCard from "../CourseCard";
import { Link } from "react-router-dom";
import useScrollAnimation from "../../../hooks/useScrollAnimation";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);
  const [sectionRef, isVisible] = useScrollAnimation();

  const courseCount = allCourses?.length || 0;

  // Dynamic grid: center cards when 1-2 courses, expand grid when more
  const gridClass = courseCount <= 2
    ? "flex flex-wrap justify-center gap-8"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

  // Wider cards when only 1-2 courses
  const cardWrapperClass = courseCount <= 2 ? "w-full sm:w-[380px]" : "";

  return (
    <section id="courses" className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
          <p className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-2">
            Curriculum
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Featured Quantitative Courses
          </h2>
        </div>

        {/* Courses */}
        <div className={`${gridClass} ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          {allCourses && allCourses.slice(0, 8).map((course, index) => (
            <div key={index} className={cardWrapperClass}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {/* View All — only show if more than 2 courses */}
        {courseCount > 2 && (
          <div className="mt-10 flex justify-center">
            <Link
              to="/course-list"
              onClick={() => scrollTo(0, 0)}
              className="inline-flex items-center gap-1 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              View All Courses
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default CoursesSection;