// import React from "react";

// const BentoCard = ({ title, description, icon, isFeatured, className }) => {
//   return (
//     <div
//       className={`relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between group ${className}`}
//     >
//       {/* Background radial gradient for subtle effect */}
//       <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

//       <div className="relative z-10">
//         <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600 border border-emerald-100">
//           {icon}
//         </div>
//         <h3 className={`font-bold text-gray-900 tracking-tight ${isFeatured ? 'text-2xl mb-4' : 'text-xl mb-3'}`}>
//           {title}
//         </h3>
//         <p className={`${isFeatured ? 'text-base' : 'text-sm'} text-gray-600 leading-relaxed`}>
//           {description}
//         </p>
//       </div>

//       {isFeatured && (
//         <div className="relative z-10 mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="flex -space-x-3">
//               <img className="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=J&background=random" alt="" />
//               <img className="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=M&background=random" alt="" />
//               <img className="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=A&background=random" alt="" />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm font-bold text-gray-900">+12k Students</span>
//               <span className="text-xs text-gray-500 font-medium">Already enrolled</span>
//             </div>
//           </div>
          
//           <a href="#courses" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm w-full sm:w-auto">
//             Enroll Now
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BentoCard;



import React from "react";

const BentoCard = ({ title, description, icon, isFeatured, className, delay, isVisible }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-emerald-50/80 border border-emerald-200/70 p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group ${className} ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 text-emerald-700 border border-emerald-200 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className={`font-bold text-gray-900 tracking-tight ${isFeatured ? 'text-2xl mb-4' : 'text-xl mb-3'}`}>
          {title}
        </h3>
        <p className={`${isFeatured ? 'text-base' : 'text-sm'} text-gray-600 leading-relaxed`}>
          {description}
        </p>
      </div>

      {isFeatured && (
        <div className="relative z-10 mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=J&background=random" alt="" />
              <img className="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=M&background=random" alt="" />
              <img className="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=A&background=random" alt="" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">+12k Students</span>
              <span className="text-xs text-gray-500 font-medium">Already enrolled</span>
            </div>
          </div>
          
          <a href="#courses" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors shadow-sm w-full sm:w-auto">
            Enroll Now
          </a>
        </div>
      )}
    </div>
  );
};

export default BentoCard;