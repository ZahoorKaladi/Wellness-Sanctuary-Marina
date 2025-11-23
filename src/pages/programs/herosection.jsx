// app/src/components/HeroSection.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { client, urlFor } from "../../client"; 
import { useLanguage } from "../../context/languagecontext";
import { getLocalizedText } from "../../utils/sanityhelper";

// --- STATIC TRANSLATIONS & FALLBACKS ---
const STATIC_CONTENT = {
  en: {
    defaultName: "Marina",
    defaultRole: "Luxury Wellness Host, Therapist & Podcaster",
    defaultDesc: "With over 12 years of experience in emotional healing, mindful storytelling, and podcasting, Marina has inspired thousands to embrace clarity, calm, and luxury wellness.",
    defaultMessages: [
      "Healing Conversations",
      "Transformative Experiences",
      "Mindful Storytelling",
      "Luxury Wellness",
    ],
    readBtn: "Read Full Story",
    bookBtn: "Book Session"
  },
  de: {
    defaultName: "Marina",
    defaultRole: "Luxus-Wellness-Host, Therapeutin & Podcasterin",
    defaultDesc: "Mit über 12 Jahren Erfahrung in emotionaler Heilung, achtsamem Storytelling und Podcasting hat Marina Tausende dazu inspiriert, Klarheit und Ruhe zu finden.",
    defaultMessages: [
      "Heilende Gespräche",
      "Transformative Erfahrungen",
      "Achtsames Storytelling",
      "Luxus-Wellness",
    ],
    readBtn: "Ganze Geschichte lesen",
    bookBtn: "Sitzung buchen"
  }
};

// --- ANIMATION CONFIG ---
const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 10,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// --- GROQ QUERY ---
const query = `*[_type == "heroSection"][0] {
  name,
  role,
  role_de,
  description,
  description_de,
  backgroundImage,
  profileImage,
  rotatingMessages,
  rotatingMessages_de
}`;

const HeroSection = () => {
  const { language } = useLanguage();
  const t = STATIC_CONTENT[language];

  const [data, setData] = useState(null);
  const [headerIndex, setHeaderIndex] = useState(0);

  // FETCH DATA
  useEffect(() => {
    client.fetch(query)
      .then((result) => setData(result))
      .catch(console.error);
  }, []);

  // DETERMINE DISPLAY DATA
  const displayName = data?.name || t.defaultName;
  const displayRole = getLocalizedText(data, 'role', language) || t.defaultRole;
  const displayDesc = getLocalizedText(data, 'description', language) || t.defaultDesc;

  const displayMessages = (language === 'de' && data?.rotatingMessages_de?.length > 0)
    ? data.rotatingMessages_de
    : (data?.rotatingMessages?.length > 0 ? data.rotatingMessages : t.defaultMessages);
  
  const displayBg = data?.backgroundImage 
    ? urlFor(data.backgroundImage).width(1920).quality(80).auto('format').url() 
    : "https://images.pexels.com/photos/3184420/pexels-photo-3184420.jpeg?auto=format&fit=crop&q=80&w=1920";

  const displayProfile = data?.profileImage 
    ? urlFor(data.profileImage).width(400).height(400).quality(90).auto('format').url() 
    : "https://images.pexels.com/photos/6919996/pexels-photo-6919996.jpeg?auto=format&fit=crop&q=90&w=400&h=400";

  // ROTATING MESSAGE LOGIC
  useEffect(() => {
    setHeaderIndex(0);
  }, [language, displayMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderIndex((prev) => (prev + 1) % displayMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayMessages]);

  const scrollToPrograms = () => {
    const section = document.getElementById("programs");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden font-sans"
      aria-labelledby="hero-title"
    >
      {/* Background Image - Optimized with fixed position for parallax feel without JS */}
      <div className="absolute inset-0 z-0">
        <img
          src={displayBg}
          alt="Background"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/60 via-rose-900/40 to-rose-950/20 mix-blend-multiply" />
      </div>

      {/* Floating Lights - Simplified for Performance */}
      <div className="absolute inset-0 opacity-40 pointer-events-none z-0">
        <motion.div
          className="absolute w-96 h-96 bg-rose-400/20 rounded-full blur-3xl top-0 left-0"
          animate={floatingAnimation}
        />
      </div>

      {/* MAIN CONTENT - Horizontal Glass Card */}
      <motion.div
        className="relative z-10 w-full max-w-6xl px-4 md:px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div 
          className="rounded-[2rem] p-6 md:p-8 backdrop-blur-md overflow-hidden"
          style={{
            // OPTIMIZED GLASS EFFECT (Faster rendering)
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
          }}
        >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                
                {/* LEFT: Image (On desktop) / Top (On mobile) */}
                <motion.div 
                    className="shrink-0 relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative z-10">
                        <img 
                            src={displayProfile} 
                            alt={displayName} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    {/* Decorative ring behind image */}
                    <div className="absolute -inset-2 rounded-full border border-white/10 z-0 animate-pulse" />
                </motion.div>

                {/* RIGHT: Content - Text Aligned Left on Desktop, Center on Mobile */}
                <div className="flex-1 text-center md:text-left">
                    {/* Role Tag */}
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-rose-100 text-xs md:text-sm tracking-wider font-medium mb-3 border border-white/10">
                        {displayRole}
                    </span>

                    {/* Name */}
                    <h1 className="text-4xl md:text-6xl font-['Playfair_Display'] font-bold mb-4 tracking-tight">
                        <span className="text-white drop-shadow-md">
                            {displayName}
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm md:text-lg text-rose-50/90 leading-relaxed max-w-2xl mb-6 font-light">
                        {displayDesc}
                    </p>

                    {/* Rotating Message */}
                    <div className="h-8 mb-6 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={headerIndex}
                                className="text-base md:text-xl text-white font-serif italic"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                            >
                                {displayMessages[headerIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <Link to="/about">
                            <motion.button
                                className="px-6 py-2.5 bg-white text-rose-900 font-semibold rounded-full shadow-lg hover:bg-rose-50 transition-colors text-sm md:text-base"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t.readBtn}
                            </motion.button>
                        </Link>
                        <Link to="/sessionbooking">
                            <motion.button
                                onClick={scrollToPrograms}
                                className="px-6 py-2.5 border border-white/50 bg-transparent text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-sm md:text-base backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t.bookBtn}
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;