import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { client } from '../client';
import { useLanguage } from "../context/languagecontext";
import { getLocalizedText } from "../utils/sanityhelper";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    heading: "What my wonderful clients say",
    subheading: "Real voices, real change ♡"
  },
  de: {
    heading: "Was meine wundervollen Klientinnen sagen",
    subheading: "Echte Stimmen, echte Veränderung ♡"
  }
};

// --- QUERY ---
const query = `*[_type == "testimonial"] | order(order asc) {
  _id,
  name,
  title,
  title_de, 
  "avatar": avatar.asset->url,
  text,
  text_de
}`;

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const { language } = useLanguage();
  const t = STATIC_TEXT[language];

  // Fetch Data
  useEffect(() => {
    client.fetch(query).then((data) => {
      setTestimonials(data);
      setIsLoading(false);
    });
  }, []);

  // Optimized Navigation Functions (Memoized)
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    // Reset timer on manual interaction
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [testimonials.length]);

  // Optimized Auto-Play (Only active on mobile & when data exists)
  useEffect(() => {
    if (isLoading || testimonials.length <= 1 || typeof window === 'undefined') return;
    
    // Only run on small screens to save resources on desktop
    if (window.innerWidth < 768) {
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isLoading, testimonials.length]);

  if (isLoading) {
    return (
      <section className="py-20 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </section>
    );
  }

  if (!testimonials.length) return null;

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 font-sans">
      
      {/* 1. AMBIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/40 via-white to-purple-50/40 -z-20" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[-5%] w-[30rem] h-[30rem] bg-pink-300/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30rem] h-[30rem] bg-purple-300/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 px-2 max-w-3xl mx-auto"
        >
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-rose-950 mb-4 tracking-tight">
            {t.heading}
          </h3>
          <p className="mt-3 text-lg text-rose-900/60 italic font-light">
            {t.subheading}
          </p>
        </motion.div>

        {/* MOBILE: Auto-rotating Carousel */}
        <div className="block md:hidden relative">
          <div className="overflow-hidden py-4 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="px-2"
              >
                <TestimonialCard testimonial={testimonials[currentIndex]} language={language} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              className="p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-white transition text-rose-800"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-white transition text-rose-800"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                    setCurrentIndex(i);
                    clearInterval(intervalRef.current);
                }}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex
                    ? "w-8 h-2 bg-rose-500"
                    : "w-2 h-2 bg-rose-200"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* TABLET & DESKTOP: Grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <TestimonialCard testimonial={t} language={language} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- OPTIMIZED CONVEX CARD ---
const TestimonialCard = React.memo(({ testimonial, language }) => {
  const avatarUrl = testimonial.avatar || `https://placehold.co/200x200/fce7f3/be185d?text=${testimonial.name.charAt(0)}`;

  return (
    <div 
      className="group relative rounded-[2rem] p-8 h-full flex flex-col items-center text-center transition-transform duration-500 hover:-translate-y-2"
      style={{
        // OPTIMIZED CONVEX GLASS STYLE (Performance Tuned)
        backgroundColor: 'rgba(255, 241, 242, 0.4)', 
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        // Simpler shadow stack renders faster on mobile
        boxShadow: '0 10px 30px -5px rgba(244, 63, 94, 0.15), inset 0 0 0 1px rgba(255,255,255,0.4)'
      }}
    >
      {/* Inner Highlight for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-[2rem] pointer-events-none" />

      {/* Stars */}
      <div className="relative z-10 flex gap-1 mb-6 bg-white/60 px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
        ))}
      </div>

      {/* Text Area */}
      <div className="relative w-full mb-8 flex-grow flex items-center justify-center px-2 z-10">
        <Quote className="absolute -top-6 left-2 text-rose-300/40 w-10 h-10 -rotate-12" />
        <p className="text-base leading-relaxed font-medium text-rose-950/80 italic">
          "{getLocalizedText(testimonial, 'text', language)}"
        </p>
      </div>

      {/* Divider */}
      <div className="w-12 h-1 bg-gradient-to-r from-rose-300 to-pink-300 rounded-full mb-6 relative z-10 opacity-70" />

      {/* Avatar & Name */}
      <div className="flex flex-col items-center relative z-10">
        <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-rose-400 rounded-full blur-md opacity-20" />
          <img
            src={avatarUrl}
            alt={testimonial.name}
            loading="lazy"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-sm bg-rose-100"
          />
        </div>
        <h3 className="text-lg font-bold text-rose-900">{testimonial.name}</h3>
        <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">
          {getLocalizedText(testimonial, 'title', language)}
        </p>
      </div>
    </div>
  );
});

export default TestimonialCarousel;
