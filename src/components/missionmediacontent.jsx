import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { client, urlFor } from "../client"; 

// 1. Import Language Tools
import { useLanguage } from "../context/languagecontext";
import { getLocalizedText } from "../utils/sanityhelper";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    title: "Trending",
    highlight: "Moments",
    subtitle: "Swipe to Explore"
  },
  de: {
    title: "Angesagte",
    highlight: "Momente",
    subtitle: "Zum Entdecken wischen"
  }
};

// --- DATA QUERY ---
const query = `*[_type == "featuredVideo"] | order(orderRank asc) {
  _id,
  title,
  title_de,
  videoUrl,
  thumbnail
}`;

const triggerHaptic = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(10);
  }
};

// --- SUB-COMPONENTS ---

// 1. OPTIMIZED PROGRESS BAR
const ProgressBar = ({ videoRef, isActive }) => {
  const progressRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    let animationFrameId;

    const update = () => {
      if (video.duration && progressRef.current) {
        const percentage = (video.currentTime / video.duration) * 100;
        progressRef.current.style.width = `${percentage}%`;
      }
      animationFrameId = requestAnimationFrame(update);
    };
    
    update();
    
    video.addEventListener('timeupdate', update);
    video.addEventListener('play', update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('timeupdate', update);
      video.removeEventListener('play', update);
    };
  }, [videoRef, isActive]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden z-20">
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-pink-300 to-rose-500 shadow-[0_0_10px_rgba(244,114,182,0.8)]"
        style={{ width: '0%', willChange: 'width' }} 
      />
    </div>
  );
};

// 2. ROBUST VIDEO CARD
const VideoCard = React.memo(({ data, isActive, scrollToCenter, language }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.log("Auto-play prevented:", error);
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
      video.currentTime = 0;
    }
  }, [isActive]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    triggerHaptic();
  };

  const handleCardClick = () => {
    if (!isActive) {
      scrollToCenter();
    } else {
      const video = videoRef.current;
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
      triggerHaptic();
    }
  };

  return (
    <motion.div
      layout
      className={`relative flex-shrink-0 rounded-[2rem] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.4,0.25,1)] cursor-pointer group
        ${isActive 
          ? "w-[85vw] sm:w-[28rem] h-[65vh] sm:h-[70vh] scale-100 z-10 shadow-[0_20px_50px_-12px_rgba(236,72,153,0.3)] ring-1 ring-white/20" 
          : "w-[70vw] sm:w-[24rem] h-[55vh] sm:h-[60vh] scale-95 opacity-50 z-0 grayscale-[40%] hover:opacity-80"}
      `}
      onClick={handleCardClick}
    >
      {/* Glassmorphism Convex Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none z-30 mix-blend-overlay" />
      
      <video
        ref={videoRef}
        // FIX 1: Pass null if videoUrl is missing to prevent browser fetch error
        src={data.videoUrl || null}
        className={`absolute inset-0 w-full h-full object-cover ${isActive ? 'opacity-100' : 'opacity-0'}`}
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
      />

      {/* FIX 2: Check for thumbnail existence before rendering img src */}
      <img
        src={data.thumbnail ? urlFor(data.thumbnail).width(600).quality(80).url() : null}
        alt={data.title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying && isActive ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

      <AnimatePresence>
        {isActive && (
          <div className="relative z-20 h-full flex flex-col justify-between p-6">
            <div className="flex justify-end">
               <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={toggleMute}
                className="bg-black/20 backdrop-blur-xl border border-white/30 p-3 rounded-full text-white hover:bg-pink-500/30 transition-colors"
              >
                {isMuted ? "🔇" : "🔊"}
              </motion.button>
            </div>

            <div>
               <motion.h3 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.1 }}
                 className="text-white text-2xl font-serif font-medium tracking-wide drop-shadow-lg"
               >
                 {getLocalizedText(data, 'title', language)}
               </motion.h3>
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  className="h-1 bg-pink-500 mt-3 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]" 
               />
            </div>
            
            <ProgressBar videoRef={videoRef} isActive={isActive} />
          </div>
        )}
      </AnimatePresence>

      {/* Play Icon Overlay */}
      {(!isActive || !isPlaying) && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg">
            <span className="text-white ml-1 text-xl">▶</span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

// --- MAIN COMPONENT ---
const FeatureReels = () => {
  const { language } = useLanguage();
  const t = STATIC_TEXT[language];

  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    client.fetch(query).then((data) => setVideos(data));
  }, []);

  // FIXED SCROLL LISTENER
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || videos.length === 0) return;

    let timeout;
    const handleScroll = () => {
      const center = container.scrollLeft + container.clientWidth / 2;
      const children = container.children;
      
      let closestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(center - childCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
        triggerHaptic();
      }
    };

    const onScroll = () => {
      if (timeout) cancelAnimationFrame(timeout);
      timeout = requestAnimationFrame(handleScroll);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    
    // Run once on mount
    handleScroll();

    return () => container.removeEventListener("scroll", onScroll);
  }, [activeIndex, videos]); 

  const scrollToCard = useCallback((index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const children = container.children;
    if (children[index]) {
      const child = children[index];
      const scrollLeft = child.offsetLeft - (container.clientWidth / 2) + (child.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, []);

  if (!videos.length) return null;

  return (
    <section className="py-24 relative overflow-hidden min-h-[80vh] flex flex-col justify-center">
      {/* Background Blurs */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[25rem] h-[25rem] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-10 px-4"
        >
          <h2 className="text-4xl sm:text-6xl font-serif text-white mb-3 drop-shadow-xl">
            {t.title} <span className="italic text-pink-400 text-glow">{t.highlight}</span>
          </h2>
          <p className="text-white/60 text-xs font-light tracking-[0.3em] uppercase">
            {t.subtitle}
          </p>
        </motion.div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto w-full px-[7.5vw] sm:px-[calc(50%-14rem)] py-8 pb-12 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {videos.map((video, index) => (
            <div key={video._id} className="snap-center shrink-0 flex items-center justify-center">
              <VideoCard 
                data={video} 
                isActive={index === activeIndex} 
                scrollToCenter={() => scrollToCard(index)}
                language={language}
              />
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .text-glow { text-shadow: 0 0 20px rgba(244,114,182,0.5); }
      `}</style>
    </section>
  );
};

export default FeatureReels;