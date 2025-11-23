import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // Cleaner close icon

const VideoModal = ({ isOpen, videoUrl, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 1. Backdrop (Dark Rose Blur) */}
          <motion.div 
            className="absolute inset-0 bg-rose-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
          />

          {/* 2. Modal Content (Convex Glass) */}
          <motion.div
            className="relative w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            onClick={(e) => e.stopPropagation()}
            style={{
                // THE CONVEX GLASS STYLE
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: `
                  inset 0 0 0 1px rgba(255, 255, 255, 0.2),
                  inset 0 5px 20px rgba(255, 255, 255, 0.3),
                  0 25px 50px -12px rgba(0, 0, 0, 0.5)
                `
            }}
          >
            {/* Inner Highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none z-10" />

            {/* Close Button Bar */}
            <div className="relative z-20 flex justify-end p-4 pr-6 pt-6">
              <button
                onClick={onClose}
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-rose-500 hover:border-rose-500 transition-all duration-300 hover:rotate-90 shadow-lg backdrop-blur-md"
                aria-label="Close Modal"
              >
                <X size={20} className="text-white/80 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative z-20 px-4 pb-8 sm:px-8 sm:pb-10">
               <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
                 {videoUrl ? (
                   <iframe
                     src={videoUrl}
                     title="Program Video"
                     className="w-full h-full"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-white/50">
                     Video URL not found.
                   </div>
                 )}
               </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;