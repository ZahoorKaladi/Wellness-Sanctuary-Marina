// app/src/components/WorkshopSection.jsx

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion"; 
import { useInView } from "react-intersection-observer"; 
import { client, urlFor } from "../../client"; // Adjusted path to standard

// 1. Import Language Tools
import { useLanguage } from "../../context/languagecontext";
import { getLocalizedText } from "../../utils/sanityhelper";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    title: "Wellness Audio & Video Sessions",
    watchBtn: "Watch Session",
    loading: "Loading sessions...",
    error: "Failed to load sessions.",
    empty: "No sessions are currently scheduled.",
    dateTbd: "Date TBD"
  },
  de: {
    title: "Wellness Audio- & Videositzungen",
    watchBtn: "Sitzung ansehen",
    loading: "Sitzungen werden geladen...",
    error: "Sitzungen konnten nicht geladen werden.",
    empty: "Derzeit sind keine Sitzungen geplant.",
    dateTbd: "Datum offen"
  }
};

// --- QUERY (Updated for Multi-Language) ---
const workshopQuery = `*[_type == "workshop"] | order(date desc) {
  _id,
  title,
  title_de, // Fetch German Title
  date,
  thumbnail,
  videoUrl
}`;

// Helper to format the date based on language
const formatDate = (dateString, locale) => {
  return new Date(dateString).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const WorkshopSection = ({ openModal }) => {
  const { language } = useLanguage(); // Hook into Language
  const t = STATIC_TEXT[language];

  const controls = useAnimation();
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
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
  };

  const renderWorkshopGrid = () => {
    if (isLoading) {
      return (
        <div className="col-span-full flex justify-center py-10">
           <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl col-span-full">
          <strong>Error:</strong> {t.error}
        </div>
      );
    }

    if (workshops.length === 0) {
      return (
        <div className="text-center text-lg text-rose-800/60 col-span-full italic">
          {t.empty}
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
        whileHover={{ y: -8 }}
        // CONVEX GLASS CARD STYLE
        className="group relative rounded-[2rem] overflow-hidden transition-all duration-500"
        style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: `
              inset 0 0 0 1px rgba(255, 255, 255, 0.4),
              inset 0 5px 20px rgba(255, 255, 255, 0.6),
              0 10px 30px rgba(236, 72, 153, 0.1)
            `
        }}
      >
        {/* Inner Shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

        <div className="relative overflow-hidden m-3 rounded-3xl shadow-inner">
          <img
            src={
              workshop.thumbnail
                ? urlFor(workshop.thumbnail).width(500).height(400).fit("crop").url()
                : "https://via.placeholder.com/500x400.png?text=No+Image"
            }
            alt={getLocalizedText(workshop, 'title', language)}
            className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          
          {/* Overlay Button */}
          <div className="absolute inset-0 bg-rose-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.button
              onClick={() => openModal(workshop.videoUrl)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-white/90 text-rose-600 rounded-full font-bold text-sm shadow-lg backdrop-blur-md flex items-center gap-2"
            >
              <span>▶</span> {t.watchBtn}
            </motion.button>
          </div>
        </div>

        <div className="p-5 text-center">
          <h3 className="text-lg font-bold text-rose-900 mb-1 leading-tight group-hover:text-pink-600 transition-colors">
            {getLocalizedText(workshop, 'title', language)}
          </h3>
          <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            {workshop.date ? formatDate(workshop.date, language) : t.dateTbd}
          </p>
        </div>
      </motion.div>
    ));
  };

  return (
    <section
      ref={ref}
      className="relative w-full py-20 px-4 md:px-12 overflow-hidden font-sans bg-rose-50/30"
    >
      {/* AMBIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/20 -z-20" />
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-pink-300/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-purple-300/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h2
          className="relative text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-center text-rose-950 mb-14 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {t.title}
        </motion.h2>
        
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-8 z-10">
          {renderWorkshopGrid()}
        </div>
      </div>
    </section>
  );
};

export default WorkshopSection;