// app/src/components/JourneySection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { client } from '../client'; // <-- 1. IMPORT SANITY CLIENT

// 2. This is the new query for your dedicated schema
const query = `*[_type == "journeySection"][0] {
  title,
  paragraph,
  buttonText,
  buttonLink,
  statsTitle,
  progressPercent,
  progressGoalText,
  stat1,
  stat2,
  stat3
}`;

const JourneySection = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // <-- 3. Add error state
  const [canHover, setCanHover] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // 4. This is your existing 'canHover' check, it's perfect
  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    setCanHover(mediaQuery.matches);
    const handler = (e) => setCanHover(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // 5. This is your NEW data fetch
  useEffect(() => {
    client.fetch(query)
      .then((fetchedData) => {
        setData(fetchedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch Journey Section data:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.2 },
    },
  };

  // Your Orb component is perfect
  const Orb = ({ i }) => {
    if (shouldReduceMotion) return null;
    return (
      <motion.div
        className="absolute rounded-full bg-[#b08688]/20 blur-3xl pointer-events-none"
        style={{
          width: "clamp(80px, 20vw, 160px)",
          height: "clamp(80px, 20vw, 160px)",
          top: `${15 + i * 12}%`,
          left: i % 2 === 0 ? "5%" : "55%",
          transform: "translateX(-50%)",
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 12 + i * 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  };

  // 6. This is your existing loader, which is perfect
  if (isLoading) {
    return (
      <section className="flex items-center justify-center min-h-[280px] bg-gradient-to-r from-pink-200 to-rose-100 font-poppins">
        <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-white border-t-rose-500 rounded-full animate-spin"></div>
      </section>
    );
  }

  // 7. This is the new error handler
  if (error) {
    return (
      <section className="flex items-center justify-center min-h-[280px] bg-gradient-to-r from-pink-200 to-rose-100 font-poppins">
        <div className="text-center p-4 bg-red-100 text-red-700">
          Error: Could not load content.
        </div>
      </section>
    );
  }

  // 8. We get the dynamic progress value, with a fallback
  const progress = data?.progressPercent || 0;

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 font-poppins overflow-hidden bg-gradient-to-b from-[#fff6f6]/80 via-[#fbe9eb]/60 to-[#f9e0e1]/80">
      {/* FLOATING ORBS (Static) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden xs:block">
        {[...Array(5)].map((_, i) => (
          <Orb key={i} i={i} />
        ))}
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12 xl:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* LEFT: TEXT + CTA (Now Dynamic) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 text-[#2f2f2f]">
              {/* 9. Dynamic text with fallback */}
              {data?.title || "Join the Healing Journey"}
            </h2>
            <p className="... (all your existing classNames) ...">
              {/* 9. Dynamic text with fallback */}
              {data?.paragraph || "We’re building a community of emotional balance, mindful awareness, and holistic healing. Be part of a movement that inspires peace, compassion, and renewal — within and around you."}
            </p>
            <Link
              to={data?.buttonLink || "/contact"} // <-- 9. Dynamic link
              className="inline-block w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-[#b08688] ... (rest of classNames) ..."
            >
              <motion.span whileTap={{ scale: 0.95 }}>
                {/* 9. Dynamic text with fallback */}
                {data?.buttonText || "Join the Movement"}
              </motion.span>
            </Link>
          </div>

          {/* RIGHT: PROGRESS + STATS (Now Dynamic) */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <motion.div
              className="p-5 sm:p-6 md:p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 text-[#2f2f2f] text-center">
                {/* 9. Dynamic text with fallback */}
                {data?.statsTitle || "Our Collective Growth"}
              </h3>
              <p className="text-xs xs:text-sm sm:text-base text-gray-700 text-center mb-3">
                {/* 9. Dynamic text with fallback */}
                {progress}% of our goal to reach {data?.progressGoalText || "10,000 mindful souls"}
              </p>

              {/* PROGRESS BAR */}
              <div className="relative bg-white/50 rounded-full h-2.5 sm:h-3 mb-5 overflow-hidden shadow-inner">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#b08688] to-[#d2a1a4] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }} // <-- 9. Dynamic progress
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{ boxShadow: "0 2px 8px rgba(176, 134, 136, 0.4)" }}
                />
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 text-center">
                {/* Stat 1 */}
                <motion.div
                  whileHover={canHover ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 sm:p-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl shadow-md"
                >
                  <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#b08688]">
                    {/* 9. Dynamic text with fallback */}
                    {data?.stat1?.number || "8.4k+"}
                  </div>
                  <div className="text-xs sm:text-sm text-[#2f2f2f] mt-1">
                    {data?.stat1?.label || "Community Members"}
                  </div>
                </motion.div>

                {/* Stat 2 */}
                <motion.div
                  whileHover={canHover ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 sm:p-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl shadow-md"
                >
                  <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#b08688]">
                    {data?.stat2?.number || "120+"}
                  </div>
                  <div className="text-xs sm:text-sm text-[#2f2f2f] mt-1">
                    {data?.stat2?.label || "Healing Circles"}
                  </div>
                </motion.div>

                {/* Stat 3 */}
                <motion.div
                  whileHover={canHover ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 sm:p-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl shadow-md xs:col-span-3 sm:col-span-1"
                >
                  <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#b08688]">
                    {data?.stat3?.number || "50+"}
                  </div>
                  <div className="text-xs sm:text-sm text-[#2f2f2f] mt-1">
                    {data?.stat3?.label || "Mindful Projects"}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// This component is unchanged, but now part of the same file
const CounterItem = ({ item }) => {
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, Math.round);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  const endValue = item.endValue || 0;
  const suffix = item.suffix || "";
  const text = item.text || "No Label";

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
      className="... (all your existing classNames) ..."
      {...(typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
        ? { whileHover: { scale: 1.06, y: -6 } }
        : { whileTap: { scale: 0.98 } })}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="... (number classNames) ...">
        <motion.span>{roundedCount}</motion.span>
        <span className="... (suffix classNames) ...">
          {suffix}
        </span>
      </div>
      <div className="... (label classNames) ...">
        {text}
      </div>
      <div className="... (hover glow classNames) ..."></div>
    </motion.div>
  );
};

export default JourneySection;