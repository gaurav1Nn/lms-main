import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-gray-800">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start w-full">
            <div className="flex items-center gap-2 mb-6">
              <img src={assets.logo_dark} alt="Quantpact Logo" className="w-10 lg:w-12" />
              <span className="text-2xl lg:text-3xl font-black text-white tracking-tight">Quantpact</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The Stoic Architect of Quantitative Learning. High-fidelity instruction for the modern algorithmic specialist.
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col items-start w-full">
            <h2 className="font-bold text-white tracking-wide mb-6">Platform</h2>
            <ul className="flex flex-col space-y-3 text-sm text-gray-400 font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Curriculum</a></li>
              {/* <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing Structure</a></li> */}
              {/* <li><a href="#" className="hover:text-emerald-400 transition-colors">Outcomes</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Educator Network</a></li> */}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col items-start w-full">
            <h2 className="font-bold text-white tracking-wide mb-6">Resources</h2>
            <ul className="flex flex-col space-y-3 text-sm text-gray-400 font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Algorithmic Blog</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Data Science Tools</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Market Reports</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          Newsletter / Legal
          <div className="flex flex-col items-start w-full">
            <h2 className="font-bold text-white tracking-wide mb-6">Stay Updated</h2>
            <p className="text-sm text-gray-400 mb-4">
              Weekly alpha signals and strategy breakdowns.
            </p>
            <form className="flex items-center gap-2 w-full" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors shadow-sm">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between py-8 gap-4">
          <p className="text-xs text-gray-500 font-medium">
            Copyright © {new Date().getFullYear()} Quantpact Ltd. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Risk Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;