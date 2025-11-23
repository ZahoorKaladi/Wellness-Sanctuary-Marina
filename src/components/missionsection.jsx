import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion"; // Added useScroll, useTransform
import MissionHeroContent from './missionherocontent';
import MissionMediaContent from './missionmediacontent';
import AdBannerCarousel from './productcarousel';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { client } from "../client";
import { useLanguage } from "../context/languagecontext";

// Utility to categorize screen size
const getDeviceCategory = (width) => {
  if (width < 640) return 'small';
  if (width >= 640 && width < 1024) return 'tablet';
  return 'desktop';
};

const missionQuery = '*[_type == "mission"][0]';

export default function MissionSection({ handleBookSession, handleExplorePodcasts }) {
  const { language } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const [deviceCategory, setDeviceCategory] = useState('desktop'); 
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [missionData, setMissionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // OPTIMIZATION: Use Framer Motion for scroll values instead of State
  // This prevents the entire component from re-rendering on every scroll event
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]);

  useEffect(() => {
    client.fetch(missionQuery)
      .then(data => {
        setMissionData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch mission data:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const checkDevice = () => {
      setDeviceCategory(getDeviceCategory(window.innerWidth));
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
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
    <motion.section
      ref={containerRef}
      className="relative py-12 sm:py-16 md:py-24 lg:py-28 overflow-hidden min-h-screen font-sans bg-cover bg-center"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundPosition: "center",
        // Apply the optimized scroll value directly to style
        backgroundPositionY: deviceCategory === 'desktop' ? backgroundY : 'center', 
        backgroundAttachment: deviceCategory === 'desktop' ? "fixed" : "scroll", 
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/50 via-pink-900/40 to-rose-900/70 mix-blend-multiply pointer-events-none" />
      
      {/* Floating Orb Animations */}
      {!prefersReducedMotion && orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: "radial-gradient(circle at 30% 30%, rgba(255, 170, 180, 0.4), rgba(255,255,255,0.05))",
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
      
      {/* Main Content Container - REMOVED CONVEX GLASS EFFECT */}
      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white font-sans w-full min-w-0"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
          {/* Direct rendering without the heavy glass/border wrapper */}
          <div className="space-y-12">
            <MissionHeroContent
                isInView={isInView}
                isSmallScreen={isSmallScreen}
                setHovered={setHovered}
                handleBookSession={handleBookSession}
                handleExplorePodcasts={handleExplorePodcasts}
                content={missionData}
                language={language}
            />

            <MissionMediaContent
                isInView={isInView}
                prefersReducedMotion={prefersReducedMotion}
                isSmallScreen={isSmallScreen}
                settings={settings}
                language={language}
            />

             <AdBannerCarousel
                isInView={isInView}
                prefersReducedMotion={prefersReducedMotion}
                isSmallScreen={isSmallScreen}
                settings={settings}
                language={language}
            />
        </div>
      </motion.div>
    </motion.section>
  );
}