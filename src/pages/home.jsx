// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import Optimized Components
import Hero from "../components/hero"; // Ensure naming matches file
import MissionSection from "../components/missionsection";
import CounterSection from "../components/countersection";
import ServicesSection from "../components/servicessection";
import TestimonialCarousel from "../components/testimonialcarousel";
import BlogSection from "../components/blogsection";


const Home = () => {
  const navigate = useNavigate();

  // --- HANDLERS ---
  // These are passed down to sections that have buttons needing navigation
  const handleBookSession = () => {
    navigate('/sessionbooking');
  };

  const handleExplorePodcasts = () => {
    navigate('/programspage');
  };

  return (
    <div className="relative w-full min-h-screen font-sans bg-rose-50/50 overflow-hidden">
      
      {/* --- MASTER BACKGROUND --- */}
      {/* This creates the seamless ambient light behind all glass sections */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-50 pointer-events-none" />
      <div className="fixed top-0 left-0 w-[50vw] h-[50vw] bg-pink-300/10 rounded-full blur-[120px] -z-50 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vw] bg-purple-300/10 rounded-full blur-[120px] -z-50 pointer-events-none" />

      {/* --- PAGE CONTENT --- */}
      <div className="relative z-10 flex flex-col gap-0">
        
        {/* 1. Hero */}
        <Hero />

        {/* 2. Mission (Self-fetching) */}
        <MissionSection 
          handleBookSession={handleBookSession}
          handleExplorePodcasts={handleExplorePodcasts}
        />
        {/* 4. Blog Journal */}
        <BlogSection />

        {/* 5. Stats Counter */}
        <CounterSection />

        {/* 6. Services Grid */}
        <ServicesSection />

        {/* 7. Testimonials */}
        <TestimonialCarousel />
      
      </div>
    </div>
  );
};

export default Home;