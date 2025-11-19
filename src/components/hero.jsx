import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Constants - Optimized and fallback-enabled image URLs
const HERO_IMAGE_MOBILE = "https://images.pexels.com/photos/6341545/pexels-photo-6341545.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop";
const HERO_IMAGE_DESKTOP = "https://images.pexels.com/photos/6341545/pexels-photo-6341545.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop";
const FALLBACK_IMAGE_LOCAL = "https://via.placeholder.com/600x800?text=Fallback+Image";

const content = [
  "Finde deinen inneren Frieden",
  "Heile durch Klang und Geist",
  "Verbinde dich wieder mit deiner Seele",
  "Transformiere täglich deine Energie",
];

// ----------------------------------------------------------------------
// MAIN HERO COMPONENT - OPTIMIZED: Adjusted BG Zoom for Mobile
// ----------------------------------------------------------------------
const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % content.length);
    }, 5000);
    const checkDevice = () => setIsMobile(window.innerWidth <= 768);
    const checkMotionPreference = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener('change', (e) => setPrefersReducedMotion(e.matches));
      return () => mediaQuery.removeEventListener('change', (e) => setPrefersReducedMotion(e.matches));
    };
    const img = new Image();
    img.src = isMobile ? HERO_IMAGE_MOBILE : HERO_IMAGE_DESKTOP;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
    checkDevice();
    checkMotionPreference();
    window.addEventListener('resize', checkDevice);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  const description = "Umarme emotionales, mentales und spirituelles Wohlbefinden mit achtsamer Therapie und gefühlvoller Führung. Beginne noch heute deine Transformation.";

  const backgroundStyle = useMemo(() => {
    const imageUrl = isMobile ? HERO_IMAGE_MOBILE : HERO_IMAGE_DESKTOP;
    return {
      backgroundImage: `url('${imageLoaded ? imageUrl : FALLBACK_IMAGE_LOCAL}')`,
      backgroundAttachment: prefersReducedMotion || isMobile ? 'scroll' : 'fixed',
      backgroundPosition: 'center',
      backgroundSize: isMobile ? 'contain' : 'cover', // Contain on mobile to show full image
      backgroundRepeat: 'no-repeat',
      transition: 'background-position 0.4s ease-out',
    };
  }, [isMobile, prefersReducedMotion, imageLoaded]);

  const handleMouseMove = (e) => {
    if (!prefersReducedMotion && heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroRef.current.style.backgroundPosition = `${50 + (x / rect.width - 0.5) * 10}% ${50 + (y / rect.height - 0.5) * 10}%`;
    }
  };

  // Debug log for background style
  useEffect(() => {
    if (heroRef.current) {
      console.log('Applied background style:', heroRef.current.style);
    }
  }, [backgroundStyle]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8 overflow-hidden font-poppins"
      style={backgroundStyle}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 z-0 pointer-events-none" />
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden z-[5] pointer-events-none">
          {[...Array(isMobile ? 4 : 8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-br from-pink-300/40 to-purple-400/40 blur-sm"
              initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, opacity: 0.2, scale: 0.5 }}
              animate={{ x: [null, `${Math.random() * 100}%`], y: [null, `${Math.random() * 100}%`], opacity: [0.1, 0.4, 0.1], scale: [0.5, 1.1, 0.5] }}
              transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
            />
          ))}
        </div>
      )}
      <motion.div
        className="relative z-10 w-full max-w-sm sm:max-w-2xl md:max-w-4xl mx-auto bg-black/20 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200/40 p-6 sm:p-8 md:p-12 ring-2 ring-pink-300/30"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: prefersReducedMotion ? 0.6 : 1.5, ease: "easeOut", type: "spring", stiffness: 80 }}
        whileHover={{ boxShadow: "0 0 60px rgba(212, 163, 163, 0.6)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -30, rotateX: 15 }}
            transition={{ duration: prefersReducedMotion ? 0.4 : 1, ease: "easeOut" }}
          >
            <h1
              className="text-white font-semibold mb-4 sm:mb-6 leading-tight drop-shadow-2xl text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl break-words tracking-wide"
              style={{ textShadow: "0 4px 15px rgba(0, 0, 0, 0.9)", fontFamily: "'Poppins', sans-serif" }}
            >
              {content[currentIndex]}
            </h1>
            <motion.p
              className="text-white/95 max-w-xl mx-auto leading-relaxed px-1 sm:px-2 text-xs sm:text-sm md:text-base break-words font-light drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0.4 : 1 }}
              style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)", fontFamily: "'Inter', sans-serif" }}
            >
              {description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.4 : 1, delay: prefersReducedMotion ? 0 : 0.5 }}
        >
          <Link
            to="/sessionbooking"
            className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-[#d4a3a3] hover:bg-[#c58989] text-white rounded-full font-medium shadow-xl hover:shadow-2xl hover:scale-[1.05] transform transition-all duration-300 text-xs sm:text-sm ring-2 ring-pink-300/50 drop-shadow-lg"
            style={{ textShadow: "0 2px 5px rgba(0, 0, 0, 0.5)", fontFamily: "'Poppins', sans-serif" }}
          >
            Jetzt Buchen
          </Link>
          <Link
            to="/ProgramsPage"
            className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 border-2 border-pink-300/70 text-white hover:bg-pink-900/20 hover:text-white rounded-full font-medium shadow-xl transition-all duration-300 text-xs sm:text-sm backdrop-blur-sm drop-shadow-lg"
            style={{ textShadow: "0 2px 5px rgba(0, 0, 0, 0.5)", fontFamily: "'Poppins', sans-serif" }}
          >
            Podcasts Entdecken
          </Link>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-black/15 to-transparent z-5 pointer-events-none" />
    </section>
  );
};

export default Hero;