// import React, { useContext } from "react";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
// import { Link } from "react-router-dom";

// const CourseCard = ({ course }) => {
//   const { currency, calculateRating } = useContext(AppContext);

//   return (
//     <Link
//       to={"/course/" + course._id}
//       onClick={() => scrollTo(0, 0)}
//       className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
//     >
//       <img
//         className="w-full"
//         src={assets.course_thumbnail}
//         alt="courseThumbnail"
//       />
//       <div className="p-3 text-left">
//         <h3 className="text-base font-semibold">{course.courseTitle}</h3>
//         <p className="text-gray-500">
//           {course.educator?.name || "Unknown Educator"}
//         </p>
//         <div className="flex items-center space-x-2">
//           <p>{calculateRating(course)}</p>
//           <div className="flex">
//             {[...Array(5)].map((_, i) => (
//               <img
//                 key={i}
//                 src={
//                   i < Math.floor(calculateRating(course))
//                     ? assets.star
//                     : assets.star_blank
//                 }
//                 alt="star"
//                 className="w-3.5 h-3.5"
//               />
//             ))}
//           </div>
//           <p className="text-gray-500">{course.courseRatings.length}</p>
//         </div>
//         <p className="text-base font-semibold text-gray-800">
//           {currency}
//           {(
//             course.coursePrice -
//             (course.discount * course.coursePrice) / 100
//           ).toFixed(2)}
//         </p>
//       </div>
//     </Link>
//   );
// };

// export default CourseCard;


import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  const rating = calculateRating(course);
  const originalPrice = course.coursePrice;
  const finalPrice = (originalPrice - (course.discount * originalPrice) / 100).toFixed(2);
  const hasDiscount = course.discount > 0;

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="group bg-white border border-gray-200/80 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
          src={assets.course_thumbnail}
          alt={course.courseTitle}
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            {course.discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5">
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300">
          {course.courseTitle}
        </h3>

        <p className="text-sm text-gray-500 font-medium">
          {course.educator?.name || "Unknown Educator"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{rating}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                alt=""
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            ({course.courseRatings.length})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-100 mt-1">
          <span className="text-lg font-black text-gray-900">
            {currency}{finalPrice}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through font-medium">
              {currency}{originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;