import React from "react";
import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    // Full screen container, centered, with a soft background
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-rose-50/80 backdrop-blur-sm">
      
      {/* The Animated Icon Container */}
      <div className="relative">
        
        {/* Inner Pulsing Circle */}
        <motion.div
          className="absolute inset-0 bg-rose-200 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Rotating Flower Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8, // Slow, calming rotation
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative z-10 text-rose-500"
        >
          <Flower2 size={48} strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        className="mt-4 text-sm font-medium tracking-widest text-rose-800 uppercase font-['Inter']"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;