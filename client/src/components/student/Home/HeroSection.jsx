import React from "react";

const HeroSection = () => {
  return (
    <section className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-emerald-100/60 to-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full opacity-10 bg-emerald-500" />
        <div className="absolute bottom-1/3 right-20 w-14 h-14 rounded-full opacity-15 bg-emerald-400" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-6 animate-fade-in-up" style={{ animationDelay: '0s', animationFillMode: 'both' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Institutional Grade Learning
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              Master the Art of <br className="hidden sm:block" />
              <span className="text-emerald-600">Quantitative</span> Trading.
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Equip yourself with the mathematical models, algorithmic execution strategies, and data science frameworks used by elite HFT firms globally.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <a 
                href="#courses" 
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-xl bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-700/25 hover:bg-emerald-800 hover:shadow-emerald-700/30 transition-all active:scale-95"
              >
                Explore Curriculum
              </a>
              <a 
                href="#why-us"
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-xl bg-white text-gray-700 font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
              >
                Why US
              </a>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 font-medium animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://ui-avatars.com/api/?name=Alex&background=random" alt="" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://ui-avatars.com/api/?name=Sarah&background=random" alt="" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://ui-avatars.com/api/?name=Michael&background=random" alt="" />
              </div>
              <p>Trusted by <span className="text-gray-900 font-bold">12,000+</span> traders</p>
            </div>
          </div>

          {/* Right Column: Static Illustration Container */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
            {/* Decorative background blurs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-200/40 to-cyan-200/40 blur-3xl rounded-full -z-10 mix-blend-multiply"></div>
            
            {/* Static Dashboard Container (No 3D Perspective) */}
            <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 overflow-hidden group hover:shadow-emerald-900/5 transition-all duration-500 lg:animate-float">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm font-semibold text-gray-500">System Accuracy</p>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight mt-1">94.2%</h3>
                </div>
                <div className="flex gap-1.5 items-center bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  <span className="text-sm font-bold text-emerald-600">+12.5%</span>
                </div>
              </div>

              {/* Mock Line Chart */}
              <div className="h-48 w-full flex items-end gap-2 px-2 relative">
                {/* Horizontal reference lines */}
                <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6 z-0">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full border-t border-dashed border-gray-100 h-0"></div>
                  ))}
                </div>
                
                {/* Chart bars */}
                {[45, 30, 60, 45, 80, 65, 95, 85, 100].map((height, i) => (
                  <div key={i} className="relative flex-1 bg-emerald-200 rounded-t-sm z-10 group-hover:bg-emerald-300 transition-colors duration-300" style={{ height: `${height}%` }}>
                    {height >= 95 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none">
                        Alpha
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mock Terminal Logic Below Chart */}
              <div className="mt-6 pt-6 border-t border-gray-100 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-inner">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-500">STATUS: EXECUTING</p>
                    <p className="text-sm font-semibold text-gray-900">Mean Reversion Algo V4</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


