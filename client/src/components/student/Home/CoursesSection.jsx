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

  const gridClass = courseCount <= 2
    ? "flex flex-wrap justify-center gap-8"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

  const cardWrapperClass = courseCount <= 2 ? "w-full sm:w-[380px]" : "";

  return (
    <section id="courses" className="relative py-24 overflow-hidden" ref={sectionRef}
      style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 40%, #d1fae5 100%)' }}>

      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large blurred orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />

        {/* Small accent dots */}
        <div className="absolute top-20 right-[15%] w-3 h-3 rounded-full bg-emerald-400 opacity-30" />
        <div className="absolute bottom-32 left-[10%] w-2 h-2 rounded-full bg-emerald-500 opacity-25" />
        <div className="absolute top-[40%] right-[8%] w-4 h-4 rounded-full bg-emerald-300 opacity-20" />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />

        {/* Top fade line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #6ee7b7, transparent)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationFillMode: 'both' }}>

          {/* Pill Badge */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))',
              borderColor: 'rgba(16,185,129,0.25)',
              color: '#059669'
            }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
            Curriculum
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Featured Quantitative Courses
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Institutional-grade programs designed by industry practitioners in algorithmic trading and quantitative finance.
          </p>

          {/* Underline accent */}
          <div className="mt-5 flex justify-center">
            <div className="w-16 h-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
          </div>
        </div>

        {/* Course Cards */}
        <div className={`${gridClass} ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          {allCourses && allCourses.slice(0, 8).map((course, index) => (
            <div key={index} className={cardWrapperClass}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {/* View All */}
        {courseCount > 2 && (
          <div className={`mt-12 flex justify-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Link
              to="/course-list"
              onClick={() => scrollTo(0, 0)}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 4px 15px -3px rgba(5, 150, 105, 0.35)'
              }}
            >
              View All Courses
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;