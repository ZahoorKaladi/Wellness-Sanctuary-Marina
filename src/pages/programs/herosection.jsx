import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";


const headerMessages = [
  "Healing Conversations • Transformative Experiences",
  "From Microphone to Mindfulness • Guiding Over a Decade",
  "Empowering Voices • Inspiring Inner Peace",
  "Luxury Wellness & Deep Connection • With Marina",
];

const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 10,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const HeroSection = () => {
  const [headerIndex, setHeaderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderIndex((prev) => (prev + 1) % headerMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToPrograms = () => {
    const section = document.getElementById("programs");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative w-full h-[100vh] flex flex-col items-center justify-center text-white overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3184420/pexels-photo-3184420.jpeg?auto=format&fit=crop&q=80&w=1920&h=1080"
          alt="Luxury spa background for Marina hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/70 via-rose-800/50 to-transparent mix-blend-multiply" />
      </div>

      {/* Floating Lights */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-rose-300/20 rounded-full blur-3xl top-10 left-10"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute w-[28rem] h-[28rem] bg-pink-300/20 rounded-full blur-3xl bottom-0 right-0"
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, duration: 12 } }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <br />
        
        {/* Host Image */}
        <motion.div
          className=" relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-6 mt-5 rounded-full overflow-hidden border-[3px] border-rose-200/70 shadow-[0_0_60px_rgba(255,192,203,0.5)] backdrop-blur-md"
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.img
            src="https://images.pexels.com/photos/6919996/pexels-photo-6919996.jpeg?auto=format&fit=crop&q=90&w=600&h=600"
            alt="Portrait of Marina Wellness Host"
            className="w-full h-full object-cover rounded-full"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Name & Role */}
        <motion.h1
          id="hero-title"
          className="text-5xl sm:text-6xl md:text-7xl font-['Playfair_Display'] font-extrabold mb-3 tracking-wide"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-100 via-pink-200 to-rose-400 animate-gradient-x">
            Marina
          </span>
        </motion.h1>
        <p className="text-xl md:text-2xl text-rose-100 font-light mb-6">
          Luxury Wellness Host, Therapist & Podcaster
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-rose-50/90 max-w-2xl mx-auto mb-8 leading-relaxed">
          With over <span className="font-semibold text-rose-200">12 years of experience</span> in emotional healing,
          mindful storytelling, and podcasting, Marina has inspired thousands to embrace clarity, calm, and luxury
          wellness through the art of connection.
        </p>

        {/* Animated Tagline */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={headerIndex}
              className="text-lg sm:text-xl md:text-2xl text-rose-50/95 font-light tracking-wide leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
            >
              {headerMessages[headerIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link
            to="/about">
          <motion.button
            
            className="px-8 py-3 text-rose-900 font-semibold text-lg rounded-full bg-white/90 hover:bg-white shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-500"
            whileHover={{ scale: 1.05 }}
          >
            Read Full Story
          </motion.button>
          </Link>
          <Link
          to="/sessionbooking">
          <motion.button
            onClick={scrollToPrograms}
            className="px-8 py-3 text-white font-semibold text-lg rounded-full border border-white/70 bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all duration-500 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
            whileHover={{ scale: 1.05 }}
          >
            Book Session
          </motion.button>
          </Link>
        </div>
      </motion.div>
      <br />
      <br />
    </section>
  );
};

export default HeroSection;
