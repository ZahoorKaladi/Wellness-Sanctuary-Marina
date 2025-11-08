// app/src/components/WorkshopSection.jsx

import React, { useState, useEffect, useRef } from "react";
// --- THIS IS THE FIX ---
import { motion, useAnimation } from "framer-motion"; // 1. Removed 'useInView' from here
import { useInView } from "react-intersection-observer"; // 2. Added this import back
// ------------------------
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { client, urlFor } from "../../client"; // (Make sure this path is correct)

// Query for workshops
const workshopQuery = `*[_type == "workshop"] | order(date desc) {
  _id,
  title,
  date,
  thumbnail,
  videoUrl
}`;

// Helper to format the date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

// Slick slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false,
  centerMode: true,
  centerPadding: "10px",
  responsive: [
    { breakpoint: 640, settings: { slidesToShow: 1, centerPadding: "15px" } },
    { breakpoint: 768, settings: { slidesToShow: 2, centerPadding: "10px" } },
    { breakpoint: 1024, settings: { slidesToShow: 3, centerPadding: "0" } },
  ],
};

const WorkshopSection = ({ openModal }) => {
  const controls = useAnimation();
  // This line will now work correctly
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  useEffect(() => {
    client
      .fetch(workshopQuery)
      .then((data) => {
        setWorkshops(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch workshops:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
    }),
  };

  const renderWorkshopGrid = () => {
    if (isLoading) {
      return (
        <div className="text-center text-lg text-pink-200 col-span-full">
          Loading sessions...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-6 bg-red-100/20 border border-red-400 text-red-200 rounded-lg col-span-full">
          <strong>Error:</strong> Failed to load sessions. Please try again later.
        </div>
      );
    }

    if (workshops.length === 0) {
      return (
        <div className="text-center text-lg text-pink-200 col-span-full">
          No sessions are currently scheduled.
        </div>
      );
    }

    return workshops.map((workshop, index) => (
      <motion.div
        key={workshop._id}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate={controls}
        whileHover={{
          scale: 1.03,
          y: -8,
          boxShadow: "0 10px 30px rgba(255, 192, 203, 0.25)",
        }}
        className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg transition-all duration-500"
      >
        <div className="relative overflow-hidden">
          <img
            src={
              workshop.thumbnail
                ? urlFor(workshop.thumbnail).width(500).height(400).fit("crop").url()
                : "https://via.placeholder.com/500x400.png?text=Missing+Image" // <-- Fixed Placeholder URL
            }
            alt={workshop.title || "Workshop thumbnail"}
            className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <motion.button
              onClick={() => openModal(workshop.videoUrl)}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 border border-pink-300 text-white rounded-full font-medium transition-all duration-300 backdrop-blur-sm"
            >
              ▶ Watch Session
            </motion.button>
          </div>
        </div>
        <div className="p-5 text-center">
          <h3 className="text-xl font-semibold text-white mb-1">
            {workshop.title || "Untitled Session"}
          </h3>
          <p className="text-sm text-pink-200">
            {workshop.date ? formatDate(workshop.date) : "Date TBD"}
          </p>
        </div>
      </motion.div>
    ));
  };

  return (
    <section
      ref={ref}
      className="relative w-full py-20 px-4 md:px-12 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-pink-900/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-pink-400/20 to-rose-600/20 blur-3xl"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={inView ? { y: [null, `${Math.random() * 80}%`], opacity: [0.3, 0.5, 0.3] } : {}}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="relative z-10">
        <motion.h2
          className="relative text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-center text-white mb-14 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Wellness <span className="text-pink-300">Audio & Video Sessions</span>
        </motion.h2>
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-10 z-10">
          {renderWorkshopGrid()}
        </div>
      </div>
    </section>
  );
};

export default WorkshopSection;