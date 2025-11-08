// app/src/components/CounterSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { client } from '../client'; // <-- 1. IMPORT SANITY CLIENT

// 2. This is the NEW query. It fetches all "counterItem" documents
//    and sorts them by the 'orderRank' you gave them.
const query = `*[_type == "counterItem"] | order(orderRank asc)`;

const CounterSection = () => {
  const [counterItems, setCounterItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. This fetch logic is now pointed at the new query
  useEffect(() => {
    client.fetch(query)
      .then((data) => {
        setCounterItems(data || []); // Default to empty array
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch counter data:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []); // This runs once on component load

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.15 },
    },
  };

  // 4. Your loader is perfect
  if (isLoading) {
    return (
      <section className="flex items-center justify-center min-h-[280px] bg-gradient-to-r from-pink-200 to-rose-100 font-poppins">
        <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-white border-t-rose-500 rounded-full animate-spin"></div>
      </section>
    );
  }

  // 5. Your error handler
  if (error) {
    return (
      <section className="flex items-center justify-center min-h-[280px] bg-gradient-to-r from-pink-200 to-rose-100 font-poppins">
        <div className="text-center p-4 bg-red-100 text-red-700">
          Error: Could not load data.
        </div>
      </section>
    );
  }

  // 6. Your "no content" handler
  if (counterItems.length === 0) {
    return (
      <section className="flex items-center justify-center min-h-[280px] bg-gradient-to-r from-pink-200 to-rose-100 font-poppins">
        <div className="text-center text-lg text-gray-700">
          Counter data not available.
        </div>
      </section>
    );
  }

  // --- Your main component return (unchanged) ---
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-white py-16 sm:py-20 lg:py-24 font-poppins">
      {/* GLOWING ORBS (Static - unchanged) */}
      <div className="absolute -top-20 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-rose-300/40 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-20 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-pink-300/30 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="
            grid grid-cols-1 
            xs:grid-cols-2 
            sm:grid-cols-2 
            lg:grid-cols-4 
            gap-5 xs:gap-6 sm:gap-8 lg:gap-10 
            text-center
          "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          {/* 7. This now maps your *dynamic* 'counterItems' */}
          {counterItems.map((item) => (
            <CounterItem key={item._id} item={item} /> 
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- CounterItem sub-component (Now bulletproof) ---
const CounterItem = ({ item }) => {
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, Math.round);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  const endValue = item.endValue || 0; // Fallback
  const suffix = item.suffix || ""; // Fallback
  const text = item.text || "No Label"; // Fallback

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
      className="
        relative 
        backdrop-blur-md 
        bg-white/40 
        border border-white/60 
        rounded-2xl 
        shadow-xl 
        p-5 xs:p-6 sm:p-7 lg:p-8 
        w-full 
        max-w-xs xs:max-w-none 
        mx-auto 
        xs:mx-0
        group
        overflow-hidden
      "
      {...(typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
        ? { whileHover: { scale: 1.06, y: -6 } }
        : { whileTap: { scale: 0.98 } })}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* NUMBER */}
      <div className="
        text-4xl xs:text-5xl sm:text-5xl md:text-6xl 
        font-extrabold 
        text-rose-700 
        drop-shadow-md 
        leading-tight
      ">
        <motion.span>{roundedCount}</motion.span>
        <span className="text-3xl xs:text-4xl sm:text-5xl ml-1 text-rose-600">
          {suffix}
        </span>
      </div>

      {/* LABEL */}
      <div className="
        mt-2 xs:mt-3 
        text-sm xs:text-base sm:text-lg 
        font-medium 
        text-gray-700 
        opacity-90 
        leading-snug
      ">
        {text}
      </div>

      {/* HOVER GLOW OVERLAY */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-pink-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </motion.div>
  );
};

export default CounterSection;