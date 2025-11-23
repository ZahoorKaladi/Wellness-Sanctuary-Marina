// app/src/components/AdBannerCarousel.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { client, urlFor } from "../client";

// 1. Import Language Tools
import { useLanguage } from "../context/languagecontext";
import { getLocalizedText } from "../utils/sanityhelper";

// --- QUERY (Updated for Multi-Language) ---
const adQuery = `*[_type == "adBanner"] | order(orderRank asc) {
  _id,
  discount,
  discount_de,
  titleLine1,
  titleLine1_de,
  titleLine2,
  titleLine2_de,
  offer,
  offer_de,
  linkUrl,
  productImage
}`;

// --- ANIMATION VARIANTS ---
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)"
  }),
  center: { 
    x: 0, 
    opacity: 1,
    scale: 1,
    filter: "blur(0px)"
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)"
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const AdBannerCarousel = () => {
  const { language } = useLanguage(); // Hook into Language

  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [[page, direction], setPage] = useState([0, 0]);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 640);

  const paginate = (newDirection) => {
    if (ads.length === 0) return;
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    client
      .fetch(adQuery)
      .then((data) => {
        setAds(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch ad banners:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => paginate(1), 6000);
      return () => clearInterval(interval);
    }
  }, [page, ads.length]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- HELPER TO RENDER SLIDES ---
  const renderSlides = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-rose-400">
          <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-rose-800 bg-rose-50/50">
          {language === 'en' ? "Unable to load offers." : "Angebote konnten nicht geladen werden."}
        </div>
      );
    }

    if (ads.length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-rose-800/60 font-light italic">
          {language === 'en' ? "No promotions currently available." : "Derzeit keine Aktionen verfügbar."}
        </div>
      );
    }

    const adIndex = ((page % ads.length) + ads.length) % ads.length;
    const ad = ads[adIndex];

    return (
      <>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "anticipate" }}
            className="absolute inset-0 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 md:px-16 lg:px-20 py-6"
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            {/* Text Content */}
            <div className="w-full sm:w-1/2 flex flex-col justify-center text-center sm:text-left z-10">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-pink-600 tracking-widest uppercase mb-2 bg-pink-100/50 inline-block px-2 py-1 rounded-full self-center sm:self-start border border-pink-200/50"
              >
                {/* Dynamic Discount */}
                {getLocalizedText(ad, 'discount', language)}
              </motion.span>
              
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-rose-950 leading-[1.1] mb-3 drop-shadow-sm">
                {/* Dynamic Title Lines */}
                {getLocalizedText(ad, 'titleLine1', language)} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
                  {getLocalizedText(ad, 'titleLine2', language)}
                </span>
              </h2>
              
              <a 
                href={ad.linkUrl}
                className="group inline-flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-medium text-rose-800 hover:text-pink-600 transition-colors mt-2"
              >
                <span className="border-b border-rose-300 group-hover:border-pink-500 pb-0.5 uppercase tracking-wide">
                  {/* Dynamic Offer Text */}
                  {getLocalizedText(ad, 'offer', language)}
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Product Image */}
            <div className="w-full sm:w-1/2 h-full flex items-center justify-center sm:justify-end relative z-10 mt-4 sm:mt-0">
              {/* Image Glow */}
              <div className="absolute w-40 h-40 bg-pink-400/20 rounded-full blur-3xl -z-10" />
              
              <motion.img
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                src={
                  ad.productImage
                    ? urlFor(ad.productImage).width(400).url()
                    : "https://via.placeholder.com/300.png?text=Missing+Image"
                }
                alt="Ad Banner Product"
                className="w-32 sm:w-48 md:w-56 lg:w-64 h-auto object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        {ads.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/50 p-2 rounded-full shadow-sm z-30 transition-all text-rose-900"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/50 p-2 rounded-full shadow-sm z-30 transition-all text-rose-900"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {ads.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {ads.map((_, i) => {
              const adIndex = ((page % ads.length) + ads.length) % ads.length;
              return (
                <button
                  key={i}
                  onClick={() => setPage([i, i > adIndex ? 1 : -1])}
                  className={`rounded-full transition-all duration-500 ${
                    i === adIndex
                      ? "w-6 h-2 bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                      : "w-2 h-2 bg-rose-900/20 hover:bg-rose-900/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              )
            })}
          </div>
        )}
      </>
    );
  };
  
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div 
        className="relative w-full h-[280px] sm:h-[320px] md:h-[380px] overflow-hidden rounded-[2.5rem]"
        style={{
            // THE CONVEX GLASS EFFECT
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: `
                inset 0 0 0 1px rgba(255, 255, 255, 0.6),
                inset 0 10px 20px rgba(255, 255, 255, 0.71),
                0 20px 50px rgba(236, 72, 153, 0.15)
            `
        }}
      >
        {/* 1. Ambient Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/40 via-white/5 to-purple-50/40 z-0" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-300/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-300/20 rounded-full blur-[80px]" />
        
        {/* 2. Inner Highlight for Glass Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-[2.5rem] pointer-events-none z-[1]" />

        {/* 3. Dynamic Slides */}
        {renderSlides()}
      </div>
    </section>
  );
};

export default AdBannerCarousel;
