import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/languagecontext";

// Constants
const HERO_IMAGE = "https://images.pexels.com/photos/6341545/pexels-photo-6341545.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop";

// --- STATIC TRANSLATIONS ---
const HERO_CONTENT = {
  en: {
    headlines: [
      "Find your inner peace",
      "Heal through Sound and Spirit",
      "Reconnect with your Soul",
      "Transform your energy daily",
    ],
    description: "Embrace emotional, mental, and spiritual well-being with mindful therapy and soulful guidance. Begin your transformation today.",
    bookBtn: "Book Now",
    podcastBtn: "Discover Podcasts"
  },
  de: {
    headlines: [
      "Finde deinen inneren Frieden",
      "Heile durch Klang und Geist",
      "Verbinde dich wieder mit deiner Seele",
      "Transformiere täglich deine Energie",
    ],
    description: "Umarme emotionales, mentales und spirituelles Wohlbefinden mit achtsamer Therapie und gefühlvoller Führung. Beginne noch heute deine Transformation.",
    bookBtn: "Jetzt Buchen",
    podcastBtn: "Podcasts Entdecken"
  }
};

const Hero = () => {
  const { language } = useLanguage();
  const t = HERO_CONTENT[language];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logic: Text Rotation Only (Removed heavy resize/mouse listeners)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % t.headlines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [t.headlines.length]);

  return (
    <section
      className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        // Mobile fallback for 'fixed' background which can be jittery on phones
        backgroundAttachment: 'fixed', 
      }}
    >
      {/* 1. Soft Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/20 via-transparent to-rose-900/20 z-0 pointer-events-none" />
      
      {/* 2. Ambient Light Blobs - Reduced Blur Radius for Performance */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[1]">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-300/20 rounded-full blur-[80px] mix-blend-screen opacity-70" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-300/20 rounded-full blur-[80px] mix-blend-screen opacity-70" />
      </div>

      {/* 3. MAIN CONVEX GLASS CARD */}
      <motion.div
        className="relative z-10 w-full max-w-sm sm:max-w-2xl md:max-w-4xl mx-auto 
                   bg-white/1 backdrop-blur-lg rounded-[2.5rem] 
                   border border-pink-300/50 p-8 sm:p-12 md:p-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          // Optimized "Convex" Glass Effect (Simpler Shadows)
          boxShadow: `
            inset 0 0 0 1px rgba(255, 255, 255, 0.4), 
            0 20px 50px rgba(0, 0, 0, 0.15)
          `,
        }}
      >
        {/* Inner Shine - Simplified */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[2.5rem] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
            transition={{ duration: 0.6 }}
            className="relative z-20"
          >
            <h1
              className="font-['Playfair_Display'] font-bold mb-6 leading-tight 
                         text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight
                         text-rose-950 drop-shadow-sm"
            >
              {t.headlines[currentIndex]}
            </h1>
            
            <motion.p
              className="text-rose-900/90 max-w-xl mx-auto leading-relaxed 
                         text-sm sm:text-base md:text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {t.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* BUTTONS */}
        <motion.div
          className="relative z-20 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link
            to="/sessionbooking"
            className="group relative w-full sm:w-auto px-8 py-4 rounded-full overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-r from-rose-400 to-pink-500"
          >
             <span className="relative text-white font-medium text-sm sm:text-base tracking-wide">
               {t.bookBtn}
             </span>
          </Link>

          <Link
            to="/ProgramsPage"
            className="group relative w-full sm:w-auto px-8 py-4 rounded-full overflow-hidden transition-transform duration-300 hover:-translate-y-1
                       bg-white/50 border border-white/60 backdrop-blur-md shadow-sm hover:bg-white/70"
          >
             <span className="relative text-rose-900 font-medium text-sm sm:text-base tracking-wide group-hover:text-pink-700 transition-colors">
               {t.podcastBtn}
             </span>
          </Link>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Hero;