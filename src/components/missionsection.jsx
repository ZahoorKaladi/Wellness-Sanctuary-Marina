import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import MissionHeroContent from './MissionHeroContent';
import MissionMediaContent from './MissionMediaContent';
import "slick-carousel/slick/slick.css"; // Ensure Slick CSS is here
import "slick-carousel/slick/slick-theme.css";

// Utility to categorize screen size
const getDeviceCategory = (width) => {
    if (width < 640) return 'small';
    if (width >= 640 && width < 1024) return 'tablet';
    return 'desktop';
};

export default function MissionSection({ handleBookSession, handleExplorePodcasts }) {
  const [hovered, setHovered] = useState(false);
  const [deviceCategory, setDeviceCategory] = useState('desktop'); 
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // 1. Device Category Check (for JS logic)
  useEffect(() => {
    const checkDevice = () => {
      setDeviceCategory(getDeviceCategory(window.innerWidth));
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 2. Parallax Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (deviceCategory === 'desktop') {
        setScrollY(window.scrollY * 0.2);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [deviceCategory]);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  // Cleaned up logic using the deviceCategory state
  const isSmallScreen = deviceCategory === 'small';
  const isTablet = deviceCategory === 'tablet';

  const orbs = useMemo(() => {
    if (prefersReducedMotion) return [];
    
    const orbCount = isSmallScreen ? 3 : isTablet ? 5 : 7;
    const maxSize = isSmallScreen ? 50 : isTablet ? 70 : 90;

    return Array.from({ length: orbCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 25 + Math.random() * maxSize,
      opacity: 0.1 + Math.random() * 0.15,
    }));
  }, [isSmallScreen, isTablet, prefersReducedMotion]);

  // React Slick settings are managed here and passed down
  const settings = {
    dots: true,
    infinite: true,
    autoplay: !prefersReducedMotion,
    autoplaySpeed: 7000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: deviceCategory === 'desktop',
    pauseOnHover: true,
    adaptiveHeight: true,
    swipeToSlide: true,
    touchThreshold: 10,
    responsive: [
      { breakpoint: 1024, settings: { arrows: false } },
      { breakpoint: 640, settings: { arrows: false, dots: true } },
    ],
  };

  const bgImage = isSmallScreen
    ? "https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
    : "https://images.pexels.com/photos/6341545/pexels-photo-6341545.jpeg?auto=compress&cs=tinysrgb&w=1600";
    
  return (
    <section
      ref={containerRef}
      className="relative py-12 sm:py-16 md:py-24 lg:py-28 overflow-hidden rounded-2xl min-h-screen font-poppins bg-gray-30- bg-cover bg-center"
      style={{
        backgroundImage: isSmallScreen
          ? `linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), linear-gradient(180deg, rgba(255, 170, 180, 0.2), rgba(255, 182, 193, 0.15)), url('${bgImage}')`
          : `linear-gradient(180deg, rgba(7, 3, 3, 0.3), rgba(12, 7, 10, 0.2)), url('${bgImage}')`,
        backgroundPosition: "center",
        backgroundPositionY: deviceCategory === 'desktop' ? `${scrollY}px` : 'center', 
        backgroundRepeat: "no-repeat",
        backgroundAttachment: deviceCategory === 'desktop' ? "fixed" : "scroll", 
      }}
    >
      {/* --- Floating Orb Animations (Background Effect) --- */}
      {!prefersReducedMotion && orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="w-full bg-transparent absolute rounded-full pointer-events-none animate-pulseLight"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: "radial-gradient(circle at 30% 30%, rgba(255, 170, 180, 0.5), rgba(255,255,255,0.05))",
            filter: `blur(8px)`,
            zIndex: 10,
          }}
          animate={{
            y: [0, isSmallScreen ? 5 : 15, 0],
            opacity: [orb.opacity, orb.opacity + 0.15, orb.opacity],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            ease: "easeInOut",
            scale: { repeatType: "reverse" },
          }}
        />
      ))}
      
      {/* --- Main Content Container --- */}
      <motion.div
        className=" relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white font-poppins"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* RENDER CHILD 1: Profile and CTA */}
        <MissionHeroContent
            isInView={isInView}
            isSmallScreen={isSmallScreen}
            setHovered={setHovered}
            handleBookSession={handleBookSession}
            handleExplorePodcasts={handleExplorePodcasts}
        />

        {/* RENDER CHILD 2: Media and Blog Grid */}
        <MissionMediaContent
            isInView={isInView}
            prefersReducedMotion={prefersReducedMotion}
            isSmallScreen={isSmallScreen}
            settings={settings} // Pass the optimized settings down
        />
      </motion.div>
    </section>
  );
}