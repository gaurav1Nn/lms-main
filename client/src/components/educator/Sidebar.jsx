// import React, { useContext } from "react";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
// import { NavLink } from "react-router-dom";

// const Sidebar = () => {
//   const { isEducator } = useContext(AppContext);

//   const menuItems = [
//     { name: "Dashboard", path: "/educator", icon: assets.home_icon },
//     { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
//     {
//       name: "My Courses",
//       path: "/educator/my-courses",
//       icon: assets.my_course_icon,
//     },
//     {
//       name: "Student Enrolled",
//       path: "/educator/student-enrolled",
//       icon: assets.person_tick_icon,
//     },
//   ];

//   return (
//     isEducator && (
//       <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
//         {menuItems.map((item) => (
//           <NavLink
//             to={item.path}
//             key={item.name}
//             end={item.path === "/educator"}
//             className={({ isActive }) =>
//               `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${
//                 isActive
//                   ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
//                   : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
//               }`
//             }
//           >
//             <img src={item.icon} alt={item.name} className="w-6 h-6" />
//             <p className="md:block hidden text-center">{item.name}</p>
//           </NavLink>
//         ))}
//       </div>
//     )
//   );
// };

// export default Sidebar;


// new code
import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/educator", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    },
    { 
      name: "Add Course", 
      path: "/educator/add-course", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
    },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    },
    {
      name: "Student Enrolled",
      path: "/educator/student-enrolled",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    },
  ];

  return (
    isEducator && (
      <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/educator"}
            className={({ isActive }) =>
              `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-6 mx-4 my-1.5 rounded-2xl gap-3 transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 font-medium"
              }`
            }
          >
            {item.icon}
            <p className="md:block hidden text-[15px]">{item.name}</p>
          </NavLink>
        ))}
      </div>
    )
  );
};

export default Sidebar;
