// app/src/components/CounterSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { client } from '../client';

// 1. Import Language Tools
import { useLanguage } from '../context/languagecontext';
import { getLocalizedText } from '../utils/sanityhelper';

// --- QUERY (Updated for Multi-Language) ---
const query = `*[_type == "counterItem"] | order(orderRank asc) {
  _id,
  endValue,
  text,
  text_de,      // Fetch German Text
  suffix,
  suffix_de     // Fetch German Suffix
}`;

// --- SUB-COMPONENT: COUNTER CARD ---
const CounterItem = ({ item, language }) => {
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, Math.round);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  const endValue = item.endValue || 0;
  
  // Dynamic Text Logic
  const text = getLocalizedText(item, 'text', language);
  const suffix = getLocalizedText(item, 'suffix', language);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, endValue, {
        duration: 2.5,
        ease: 'easeOut',
      });
      return controls.stop;
    }
  }, [isInView, endValue, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className="relative overflow-hidden rounded-[2rem] p-8 flex flex-col items-center justify-center group"
      style={{
        // CONVEX GLASS STYLE
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: `
          inset 0 0 0 1px rgba(255, 255, 255, 0.4),
          inset 0 5px 20px rgba(255, 255, 255, 0.6),
          0 10px 30px rgba(236, 72, 153, 0.1)
        `
      }}
    >
      {/* Inner Shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Number */}
      <div className="flex items-baseline justify-center mb-2 font-sans">
        <motion.span className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 drop-shadow-sm">
          {roundedCount}
        </motion.span>
        <span className="text-3xl sm:text-4xl font-bold text-rose-400 ml-1">
          {suffix}
        </span>
      </div>

      {/* Label */}
      <div className="text-sm sm:text-base font-medium text-rose-900/80 text-center leading-snug uppercase tracking-wide">
        {text}
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
const CounterSection = () => {
  const [counterItems, setCounterItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { language } = useLanguage(); // Hook into language state

  useEffect(() => {
    client.fetch(query)
      .then((data) => {
        setCounterItems(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch counter data:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <section className="flex items-center justify-center py-24 bg-rose-50">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </section>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return null; // Fail silently or show a minimal placeholder
  }

  if (counterItems.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 font-sans">
      
      {/* GLOBAL AMBIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 via-white to-purple-50/20 -z-20" />
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-pink-300/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-purple-300/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {counterItems.map((item) => (
            <CounterItem key={item._id} item={item} language={language} /> 
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;