import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { client, urlFor } from "../client";
import { useLanguage } from "../context/languagecontext";

// --- STATIC TRANSLATIONS ---
const STATIC_CONTENT = {
  en: {
    introLines: [
      "Certified Women's Coach & Hormone Expert",
      "Guiding women back to their natural power",
      "Creator of Balance, Self-Love & Ease",
      "Your journey to femininity starts here",
    ],
    btnPrograms: "My Programs",
    btnContact: "Write to Me"
  },
  de: {
    introLines: [
      "Zertifizierte Frauencoach & Hormonexpertin",
      "Begleite Frauen zurück zu ihrer natürlichen Kraft",
      "Schöpferin von Balance, Selbstliebe & Leichtigkeit",
      "Deine Reise zu mehr Weiblichkeit beginnt hier",
    ],
    btnPrograms: "Zu meinen Programmen",
    btnContact: "Schreib mir"
  }
};

// --- ICONS (Defined outside to prevent re-creation) ---
const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pb-[1px]">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const PenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pb-[1px]">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const ProfileMissionCard = () => {
  const { language } = useLanguage();
  const t = STATIC_CONTENT[language];

  const [pageData, setPageData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Optimized fetch
    client.fetch(`*[_type == "aboutPage"][0]{ profileImage }`).then(setPageData);
  }, []);

  // Reset index on language change
  useEffect(() => {
    setLineIndex(0);
  }, [language]);

  // Rotation Logic
  useEffect(() => {
    if (!isHovered) {
      setLineIndex(0);
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % t.introLines.length);
    }, 3800);

    return () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, t.introLines.length]);

  const profileImg = pageData?.profileImage
    ? urlFor(pageData.profileImage).width(500).height(500).fit("crop").url()
    : "https://images.pexels.com/photos/6919996/pexels-photo-6919996.jpeg?auto=format&fit=crop&q=90&w=800";

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden py-10 lg:py-0">
      
      {/* Background Ambience - Reduced Blur for Performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/10 via-transparent to-pink-100/10 -z-20" />
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-pink-300/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-rose-300/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

      <div className="w-full max-w-5xl px-4 md:px-6 z-10">
        
        {/* --- CONVEX GLASS CARD --- */}
        <motion.div
          className="relative rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 md:p-12 lg:p-14"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          style={{
            // OPTIMIZED GLASS: Lighter blur and simpler shadows
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            backdropFilter: 'blur(16px)', 
            boxShadow: `
              inset 0 0 0 1px rgba(255, 255, 255, 0.6), 
              0 20px 60px rgba(180, 150, 160, 0.15)
            `,
          }}
        >
          {/* Separate Shine Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-purple-100/20 pointer-events-none" />

          {/* --- LEFT: PHOTO --- */}
          <div className="relative flex-shrink-0 z-10">
            <motion.div 
              className="relative p-2 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-300 via-pink-400 to-purple-400 rounded-full opacity-30 blur-md animate-pulse" />
              
              <div className="relative rounded-full p-1.5 bg-gradient-to-b from-white to-pink-50 shadow-xl">
                <img
                  src={profileImg}
                  alt="Marina"
                  className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full object-cover border-[6px] border-white shadow-inner"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <AnimatePresence>
                {isHovered && (
                  <>
                     <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-2 right-2 w-4 h-4 bg-pink-400 rounded-full border-2 border-white shadow-md" />
                     <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ delay: 0.1 }} className="absolute bottom-4 left-0 w-3 h-3 bg-purple-400 rounded-full border-2 border-white shadow-md" />
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* --- RIGHT: TEXT CONTENT --- */}
          <div className="flex-1 text-center md:text-left z-10 space-y-6 md:space-y-8 max-w-lg">
            
            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-rose-900 via-pink-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
                MARINA
              </span>
            </motion.h2>

            {/* ROTATING TEXT AREA */}
            <div className="h-16 md:h-20 flex items-center justify-center md:justify-start">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${language}-${lineIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-base md:text-lg lg:text-xl font-medium text-rose-900/80 italic"
                >
                  {t.introLines[lineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
              
              <Link to="/programspage" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full sm:w-auto px-8 py-3.5 rounded-full overflow-hidden bg-gradient-to-r from-rose-50 to-pink-50 border border-pink-200/50 shadow-lg shadow-pink-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2 text-rose-900 group-hover:text-white font-medium transition-colors">
                    {t.btnPrograms}
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-pink-500 group-hover:text-white"
                    >
                      <HeartIcon />
                    </motion.span>
                  </span>
                </motion.button>
              </Link>

              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/30 backdrop-blur-sm border border-white/60 hover:bg-white/50 transition-all shadow-sm"
                >
                  <span className="flex items-center justify-center gap-2 text-rose-900 font-medium">
                    {t.btnContact}
                    <span className="text-pink-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
                      <PenIcon />
                    </span>
                  </span>
                </motion.button>
              </Link>

            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default ProfileMissionCard;