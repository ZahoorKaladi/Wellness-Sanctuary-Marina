// app/src/components/MissionHeroContent.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { urlFor } from '../client'; 
import { Link } from 'react-router-dom';

const MissionHeroContent = ({ 
  isInView, 
  isSmallScreen, 
  setHovered, 
  content // Data fetched from Sanity passed here
}) => {
  
  // --- 1. Process Dynamic Content with Fallbacks ---
  
  // Image
  const imageSrc = content?.profileImage 
    ? urlFor(content.profileImage).width(400).height(400).fit('crop').url()
    : "https://images.pexels.com/photos/6919996/pexels-photo-6919996.jpeg?auto=compress&cs=tinysrgb&w=900";

  // Bio
  const bioText = content?.bio || "Guiding you through sound healing, mindfulness, and deep emotional clarity. Join me in exploring meditative audio journeys and soulful reflections crafted to calm your inner world.";

  // Title Construction: 
  // We combine Name (Pink) + Title (White) to keep your specific design
  const name = content?.name || "Marina";
  const jobTitle = content?.title || "Spiritual Therapist & Host";
  const formattedTitleHtml = `<span class='text-[#d4a3a3]'>${name}</span> ${jobTitle}`;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-12 text-center md:text-left">
        
        {/* --- Profile Image --- */}
        <motion.div
            className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full p-[3px] backdrop-blur-sm border border-white/30 shadow-lg transition-transform flex-shrink-0 mx-auto"
            onMouseEnter={() => !isSmallScreen && setHovered(true)}
            onMouseLeave={() => !isSmallScreen && setHovered(false)}
            whileTap={{ scale: isSmallScreen ? 1.05 : 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            whileHover={{
                scale: 1.1,
                boxShadow: "0 0 25px rgba(212, 163, 163, 0.8)",
            }}
            transition={{
                duration: 0.4,
                ease: "easeOut",
                scale: { type: "spring", stiffness: 300, damping: 20 },
                boxShadow: { duration: 0.6, repeat: Infinity, repeatType: "reverse" },
            }}
        >
            <img
                src={imageSrc}
                alt={`${name}, ${jobTitle}`}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
            />
        </motion.div>

        {/* --- Title and Description --- */}
        <div className="flex-1 mt-6 md:mt-0 text-center md:text-left px-4 sm:px-6">
            <motion.h3
                className="font-semibold text-white drop-shadow-md text-balance text-[1.25rem] xs:text-[1.4rem] sm:text-3xl md:text-4xl lg:text-5xl leading-snug sm:leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                // This injects the HTML with the pink span for the name
                dangerouslySetInnerHTML={{ __html: formattedTitleHtml }}
            />
            <motion.p
              className={`
              mt-3 xs:mt-4 sm:mt-5
              text-sm xs:text-base sm:text-lg md:text-xl
              text-white/90
              max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl
              mx-auto md:mx-0
              leading-relaxed xs:leading-loose
              tracking-wide
              text-center md:text-left
              hyphens-auto
              break-words
            `}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {bioText}
            </motion.p>
        </div>

        {/* --- Buttons --- */}
        <motion.div
            className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-3 sm:gap-4 max-w-[300px] sm:max-w-none mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <Link to="/sessionbooking">
                <button 
                    className="w-full sm:w-auto px-4 py-3 min-h-[44px] text-[0.7rem] sm:text-sm rounded-lg bg-white/15 border border-white/20 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-md"
                >
                    Book a Session
                </button>
            </Link>
            <Link to="/programspage">
                <button 
                    className="w-full sm:w-auto px-4 py-3 min-h-[44px] text-[0.7rem] sm:text-sm rounded-lg bg-[#B08688]/85 hover:bg-[#9c7375] focus:outline-none focus:ring-2 focus:ring-[#B08688]/50 transition-all duration-300 transform hover:scale-105"
                >
                    Explore Podcasts
                </button>
            </Link>
        </motion.div>
    </div>
  );
};

export default MissionHeroContent;