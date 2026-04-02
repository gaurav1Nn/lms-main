// import React from "react";
// import BentoCard from "./BentoCard";

// const features = [
//   {
//     title: "Advanced Algorithmic HFT Systems",
//     description: "Learn to build and deploy high-frequency trading algorithms using C++ and Python. Master order book dynamics and latency reduction.",
//     isFeatured: true,
//     className: "md:col-span-2 md:row-span-2",
//     icon: (
//       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
//       </svg>
//     )
//   },
//   {
//     title: "Real-World Strategies",
//     description: "Implement mean reversion, statistical arbitrage, and momentum strategies currently used by top tier proprietary trading desks.",
//     isFeatured: false,
//     className: "md:col-span-1",
//     icon: (
//       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
//       </svg>
//     )
//   },
//   {
//     title: "Data Science for Alpha",
//     description: "Extract predictive signals from massive financial datasets using pandas, numpy, and machine learning models.",
//     isFeatured: false,
//     className: "md:col-span-1",
//     icon: (
//       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
//       </svg>
//     )
//   },
//   {
//     title: "Structured Paths",
//     description: "Follow curated learning trajectories progressing from foundational financial math to advanced deployment architectures.",
//     isFeatured: false,
//     className: "md:col-span-1",
//     icon: (
//       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
//       </svg>
//     )
//   },
//   {
//     title: "Behavioral Finance",
//     description: "Understand the psychological biases of retail markets and how quantitative systems exploit emotional trading anomalies.",
//     isFeatured: false,
//     className: "md:col-span-1",
//     icon: (
//       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
//       </svg>
//     )
//   },
//   {
//     title: "Instant Lifetime Access",
//     description: "Pay once and receive continuous updates as market regimes evolve and new algorithmic models are introduced.",
//     isFeatured: false,
//     className: "md:col-span-1 md:col-start-1 md:col-end-2",
//     icon: (
//       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
//       </svg>
//     )
//   },
//   {
//     title: "Risk Management",
//     description: "Implement institutional-level risk constraints, maximum drawdown controls, and portfolio variance optimizations.",
//     isFeatured: false,
//     className: "md:col-span-2 md:col-start-2 md:col-end-4",
//     icon: (
//       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
//       </svg>
//     )
//   }
// ];

// const WhyUsSection = () => {
//   return (
//     <section id="why-us" className="py-24 bg-white relative">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Section Header */}
//         <div className="text-center md:text-left mb-16">
//           <p className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-3">
//             Why Quantpact
//           </p>
//           <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
//             Everything You Need To <br className="hidden md:block" />
//             Succeed In <span className="text-emerald-500">Finance</span>.
//           </h2>
//         </div>

//         {/* Bento Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
//           {features.map((feature, index) => (
//             <BentoCard 
//               key={index}
//               title={feature.title}
//               description={feature.description}
//               icon={feature.icon}
//               isFeatured={feature.isFeatured}
//               className={feature.className}
//             />
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default WhyUsSection;


import React from "react";
import BentoCard from "./BentoCard";
import useScrollAnimation from "../../../hooks/useScrollAnimation";

const features = [
  {
    title: "Advanced Algorithmic HFT Systems",
    description: "Learn to build and deploy high-frequency trading algorithms using C++ and Python. Master order book dynamics and latency reduction.",
    isFeatured: true,
    className: "md:col-span-2 md:row-span-2",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
    )
  },
  {
    title: "Real-World Strategies",
    description: "Implement mean reversion, statistical arbitrage, and momentum strategies currently used by top tier proprietary trading desks.",
    isFeatured: false,
    className: "md:col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
    )
  },
  {
    title: "Data Science for Alpha",
    description: "Extract predictive signals from massive financial datasets using pandas, numpy, and machine learning models.",
    isFeatured: false,
    className: "md:col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
      </svg>
    )
  },
  {
    title: "Structured Paths",
    description: "Follow curated learning trajectories progressing from foundational financial math to advanced deployment architectures.",
    isFeatured: false,
    className: "md:col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
    )
  },
  {
    title: "Behavioral Finance",
    description: "Understand the psychological biases of retail markets and how quantitative systems exploit emotional trading anomalies.",
    isFeatured: false,
    className: "md:col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>
    )
  },
  {
    title: "Instant Lifetime Access",
    description: "Pay once and receive continuous updates as market regimes evolve and new algorithmic models are introduced.",
    isFeatured: false,
    className: "md:col-span-1 md:col-start-1 md:col-end-2",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
      </svg>
    )
  },
  {
    title: "Risk Management",
    description: "Implement institutional-level risk constraints, maximum drawdown controls, and portfolio variance optimizations.",
    isFeatured: false,
    className: "md:col-span-2 md:col-start-2 md:col-end-4",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
    )
  }
];

const WhyUsSection = () => {
  const [sectionRef, isVisible] = useScrollAnimation(0.1);

  return (
    <section id="why-us" className="py-24 bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/30 relative overflow-hidden" ref={sectionRef}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full opacity-10 bg-emerald-500" />
        <div className="absolute bottom-1/3 right-20 w-14 h-14 rounded-full opacity-15 bg-emerald-400" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className={`text-center md:text-left mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
          <p className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-3">
            Why Quantpact
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Everything You Need To <br className="hidden md:block" />
            Succeed In <span className="text-emerald-500">Finance</span>.
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {features.map((feature, index) => (
            <BentoCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              isFeatured={feature.isFeatured}
              className={feature.className}
              delay={isVisible ? index * 0.08 : 0}
              isVisible={isVisible}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyUsSection;