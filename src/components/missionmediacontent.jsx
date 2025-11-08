// app/src/components/MissionMediaContent.jsx
import React, { useState, useEffect } from "react"; // <-- 1. ADD useState, useEffect
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { client, urlFor } from "../client"; // <-- 2. IMPORT SANITY

// 3. We DELETE the static 'videos' array
// const videos = [ ... ];

// 4. We define a query to get all 'featuredVideo' items, sorted by rank
const query = `*[_type == "featuredVideo"] | order(orderRank asc)`;

// Your static Slick settings are perfect
const sliderSettings = {
  dots: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 4000,
  speed: 800,
  slidesToShow: 2,
  slidesToScroll: 1,
  pauseOnHover: false,
  arrows: false,
  adaptiveHeight: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0px",
      },
    },
  ],
};

const MissionMediaContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // --- 5. ADD STATE FOR DYNAMIC DATA ---
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // ------------------------------------

  // --- 6. ADD useEffect TO FETCH DATA ---
  useEffect(() => {
    client
      .fetch(query)
      .then((data) => {
        setVideos(data || []); // Default to an empty array
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch featured videos:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []); // Runs once on component mount
  // ---------------------------------------

  const openModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // --- 7. HELPER FUNCTION TO RENDER THE SLIDER ---
  // This is the professional, bulletproof way.
  const renderSlider = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-48 text-white">
          Loading Videos...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-48 p-4 bg-red-100/20 text-red-200 rounded-lg">
          Error: Could not load videos.
        </div>
      );
    }

    if (videos.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-300">
          No videos are featured right now.
        </div>
      );
    }

    // Success: Render the slider
    return (
      <Slider {...sliderSettings} className="w-full">
        {videos.map((video) => (
          <motion.div
            key={video._id} // <-- Use Sanity's unique _id
            whileHover={{ scale: 1.03 }}
            className="px-0 md:px-4"
          >
            <div
              className="flex flex-col md:flex-row items-center bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md cursor-pointer transition max-w-md mx-auto md:max-w-none"
              onClick={() => openModal(video)} // Pass the whole 'video' object
            >
              <div className="w-full h-40 flex-shrink-0 relative overflow-hidden md:w-48 md:h-28">
                <img
                  // 8. "BULLETPROOF" IMAGE LOADING (as promised)
                  src={
                    video.thumbnail
                      ? urlFor(video.thumbnail).width(300).height(200).fit("crop").url()
                      : "https://via.placeholder.com/300x200.png?text=Missing+Image"
                  }
                  alt={video.title || "Video thumbnail"}
                  className="w-full h-full object-cover"
                  loading="lazy" // <-- LAZY LOADING
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-80"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 px-4 py-4 md:py-0 md:px-4 text-white text-center md:text-left">
                <h4 className="text-lg font-medium">
                  {/* 9. "BULLETPROOF" TEXT (as promised) */}
                  {video.title || "Untitled Video"}
                </h4>
                <p className="text-sm text-gray-300 mt-1">Tap to play</p>
              </div>
            </div>
          </motion.div>
        ))}
      </Slider>
    );
  };

  // --- MAIN RETURN (Your static layout is safe) ---
  return (
    <>
      <section className="w-full py-12">
        {/* This title is static, as requested */}
        <h3 className="text-center text-white text-2xl sm:text-3xl font-semibold mb-10">
          Featured Wellness Videos
        </h3>

        <div className="px-4 md:px-0 md:max-w-6xl md:mx-auto">
          {/* 10. We call our dynamic render function here */}
          {renderSlider()}
        </div>
      </section>

      {/* ───── Video Modal ───── */}
      <AnimatePresence>
        {isModalOpen && selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-11/12 max-w-3xl bg-black rounded-xl overflow-hidden shadow-2xl">
              <video
                // 11. Use the dynamic videoUrl from Sanity
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-auto"
              />
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-white text-xl hover:text-pink-400 transition"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MissionMediaContent;