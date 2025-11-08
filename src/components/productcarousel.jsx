// app/src/components/AdBannerCarousel.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { client, urlFor } from "../client"; // <-- 1. IMPORT SANITY

// 2. We DELETE the static 'ads' array
// const ads = [ ... ];

// 3. We define a query to get all ads, sorted by our new 'orderRank' field
const adQuery = `*[_type == "adBanner"] | order(orderRank asc) {
  _id,
  discount,
  titleLine1,
  titleLine2,
  offer,
  linkUrl,
  productImage
}`;

// Your animation variants are perfect
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const AdBannerCarousel = () => {
  // --- 4. ADD STATE FOR DYNAMIC DATA ---
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // ------------------------------------

  const [[page, direction], setPage] = useState([0, 0]);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 640);

  const paginate = (newDirection) => {
    if (ads.length === 0) return; // Don't paginate if there are no ads
    setPage([page + newDirection, newDirection]);
  };

  // --- 5. ADD useEffect TO FETCH DATA ---
  useEffect(() => {
    client
      .fetch(adQuery)
      .then((data) => {
        setAds(data || []); // Default to an empty array if data is null
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch ad banners:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []); // Runs once on mount
  // -----------------------------------

  // Your original autoplay timer, now safe
  useEffect(() => {
    if (ads.length > 1) { // Only autoplay if there's more than one ad
      const interval = setInterval(() => paginate(1), 5000);
      return () => clearInterval(interval);
    }
  }, [page, ads.length]); // Re-run if ads load

  // Your original resize listener is perfect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 6. HELPER FUNCTION TO RENDER THE SLIDES ---
  // This is the professional, bulletproof way.
  const renderSlides = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-blue-900">
          Loading...
        </div>
      );
    }

    if (error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-red-700 bg-red-100">
          Error: Could not load ads.
        </div>
      );
    }

    if (ads.length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-gray-700">
          No promotions are active right now.
        </div>
      );
    }

    // Success: We have ads, so we calculate the current one
    const adIndex = ((page % ads.length) + ads.length) % ads.length;
    const ad = ads[adIndex];

    return (
      <>
        {/* Animated Slide Container */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col sm:flex-row items-center justify-between px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12"
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
            {/* Text Content (Now dynamic and safe) */}
            <div className="w-full sm:w-1/2 flex flex-col justify-center text-center sm:text-left py-4 xs:py-5 sm:py-6">
              <span className="text-xs font-bold text-gray-800 tracking-wider uppercase">
                {ad.discount}
              </span>
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase text-blue-900 leading-tight my-1 xs:my-2">
                {ad.titleLine1}<br />
                {ad.titleLine2}
              </h2>
              <a 
                href={ad.linkUrl} // <-- Use dynamic link
                className="text-xs font-semibold text-gray-700 uppercase flex items-center justify-center sm:justify-start gap-1 xs:gap-2 mt-2 xs:mt-3 hover:text-blue-900 transition-colors"
              >
                {ad.offer}
                <ArrowRight size={12} className="xs:w-4 xs:h-4" />
              </a>
            </div>

            {/* Product Image (Now dynamic and safe) */}
            <div className="w-full sm:w-1/2 flex items-center justify-center sm:justify-end py-2 xs:py-4 sm:py-0">
              <img
                src={
                  ad.productImage
                    ? urlFor(ad.productImage).width(300).url()
                    : "https://via.placeholder.com/300.png?text=Missing+Image"
                }
                alt={`${ad.titleLine1} ${ad.titleLine2}`}
                className="w-28 xs:w-32 sm:w-40 md:w-48 lg:w-52 h-auto object-contain drop-shadow-lg"
                loading="lazy"
              />
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons (Only show if more than 1 ad) */}
        {ads.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-2 xs:left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white focus:bg-white p-3 xs:p-3.5 sm:p-2 rounded-full shadow-md z-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ChevronLeft className="text-gray-700 w-5 h-5 xs:w-6 xs:h-6 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-2 xs:right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white focus:bg-white p-3 xs:p-3.5 sm:p-2 rounded-full shadow-md z-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Next slide"
            >
              <ChevronRight className="text-gray-700 w-5 h-5 xs:w-6 xs:h-6 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Dots (Only show if more than 1 ad) */}
        {ads.length > 1 && (
          <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 xs:gap-2.5 sm:gap-2 z-30">
            {ads.map((_, i) => {
              const adIndex = ((page % ads.length) + ads.length) % ads.length;
              return (
                <button
                  key={i}
                  onClick={() => setPage([i, i > adIndex ? 1 : -1])}
                  className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                    i === adIndex
                      ? "bg-blue-900 scale-110"
                      : "bg-gray-700/50 hover:bg-gray-900/70"
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
  
  // --- MAIN RETURN (Static layout is safe) ---
  return (
    <section className="relative w-full h-[220px] xs:h-[240px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-2xl shadow-lg font-sans">
      
      {/* 1. Static Background Image (from your original code) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
      >
        <div className="absolute inset-0 bg-white/30"></div>
      </div>

      {/* 2. Render the dynamic slides */}
      {renderSlides()}

    </section>
  );
};

export default AdBannerCarousel;