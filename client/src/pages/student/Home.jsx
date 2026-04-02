import React from "react";
import HeroSection from "../../components/student/Home/HeroSection";
import CoursesSection from "../../components/student/Home/CoursesSection";
import WhyUsSection from "../../components/student/Home/WhyUsSection";
import CTABanner from "../../components/student/Home/CTABanner";
import Footer from "../../components/student/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeroSection />
      <CoursesSection />
      <WhyUsSection />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Home;
