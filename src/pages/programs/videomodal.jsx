import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VideoModal = ({ isOpen, videoUrl, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white/10 backdrop-blur-md border border-pink-200 rounded-2xl shadow-2xl w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white bg-pink-500 hover:bg-pink-600 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-md transition-all duration-300"
            >
              ×
            </button>

            {/* Video Frame */}
            <div className="aspect-video rounded-2xl overflow-hidden border border-pink-300/40 shadow-lg">
              <iframe
                src={videoUrl}
                title="Program Video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
