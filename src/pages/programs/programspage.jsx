import React, { useState } from "react";
import RadioSection from "./radiosection";
import WorkshopSection from "./content_library";
import VideoModal from "./videomodal";
import HeroSection from "./herosection";

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
    <div className="relative w-full min-h-screen bg-transparent">
      <header className="w-full bg-transparent">
       <HeroSection openModal={openModal} />
      </header>

      {/* Full-width transparent sections */}
      <div className="w-full bg-transparent">
        <RadioSection openModal={openModal} />
        
        <WorkshopSection openModal={openModal} />

      </div>

      {/* Overlay Modal */}
      <VideoModal
        isOpen={isModalOpen}
        videoUrl={activeVideo}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProgramsPage;
