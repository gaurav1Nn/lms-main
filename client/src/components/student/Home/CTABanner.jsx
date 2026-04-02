import React from "react";
import { Link } from "react-router-dom";

const CTABanner = () => {
  return (
    <section className="relative py-24 bg-gray-900 overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[100%] bg-gradient-to-l from-emerald-600/30 to-transparent blur-3xl rounded-full transform rotate-12"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[80%] bg-gradient-to-tr from-emerald-800/40 to-transparent blur-3xl rounded-full"></div>
        {/* Decorative Bubbles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full opacity-10 bg-emerald-500" />
        <div className="absolute bottom-1/3 right-20 w-14 h-14 rounded-full opacity-15 bg-emerald-400" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
          Begin Your <span className="text-emerald-400">Quantitative</span> Mastery Today
        </h2>
        
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop relying on intuition. Start building robust systems with our institutional-grade curriculum and lifetime access to future models.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/course-list"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 rounded-xl bg-emerald-500 text-gray-900 font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:shadow-emerald-500/40 transition-all active:scale-95"
          >
            Get Started Now
          </Link>
          <a 
            href="#courses"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 rounded-xl bg-transparent text-white font-semibold border border-gray-600 hover:border-gray-400 hover:bg-gray-800 transition-all active:scale-95"
          >
            Explore Curriculum
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-500 font-medium tracking-wide">
          {/* 14-DAY MONEY-BACK GUARANTEE. NO QUESTIONS ASKED. */}
        </p>
      </div>
    </section>
  );
};

export default CTABanner;
