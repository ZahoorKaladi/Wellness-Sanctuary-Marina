// app/src/pages/ProgramsPage.jsx
import React, { useState, Suspense, lazy } from "react";

// --- OPTIMIZATION: Lazy Load components ---
// This splits the code so the initial page load is faster.
const HeroSection = lazy(() => import("./herosection"));
const RadioSection = lazy(() => import("./radiosection"));
const WorkshopSection = lazy(() => import("./content_library")); 
const VideoModal = lazy(() => import("./videomodal"));

// Simple Loading Spinner for the lazy components
const LoadingFallback = () => (
  <div className="w-full h-96 flex items-center justify-center text-rose-300">
    <div className="animate-pulse">Loading...</div>
  </div>
);

const ProgramsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const openModal = (videoUrl) => {
    setActiveVideo(videoUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveVideo(null);
  };

  return (
    // FIX: Changed 'overflow-hidden' to 'overflow-x-hidden'
    // 'overflow-hidden' was clipping the content on mobile preventing scrolling to the bottom.
    <div className="relative w-full min-h-screen font-sans bg-rose-50/50 overflow-x-hidden">
      
      {/* --- GLOBAL AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-50 pointer-events-none" />
      {/* Optimized: Added opacity to reduce paint heaviness */}
      <div className="fixed top-0 left-0 w-[50vw] h-[50vw] bg-pink-300/10 rounded-full blur-[100px] -z-50 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vw] bg-purple-300/10 rounded-full blur-[100px] -z-50 pointer-events-none" />

      {/* --- SECTIONS --- */}
      {/* Added pb-16 to ensure bottom content isn't covered by mobile browser bars */}
      <div className="relative z-10 flex flex-col gap-0 pb-16">
        
        <Suspense fallback={<LoadingFallback />}>
          {/* Hero Section */}
          <HeroSection openModal={openModal} />

          {/* Radio History Section */}
          <div className="relative z-20">
             <RadioSection />
          </div>
          
          {/* Workshop/Library Section */}
          {/* Ensure it has a container with width */}
          <div className="relative z-30 w-full">
            <WorkshopSection openModal={openModal} />
          </div>
        </Suspense>

      </div>

      {/* --- GLOBAL VIDEO MODAL --- */}
      <Suspense fallback={null}>
        {isModalOpen && (
            <VideoModal
                isOpen={isModalOpen}
                videoUrl={activeVideo}
                onClose={closeModal}
            />
        )}
      </Suspense>
    </div>
  );
};

export default ProgramsPage;