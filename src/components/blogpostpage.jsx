// app/src/pages/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// 1. Import Context & Helpers
import { useLanguage } from '../context/languagecontext';
import { getLocalizedText } from '../utils/sanityhelper';
import { client, urlFor } from '../client';

// --- STATIC TRANSLATIONS (Fallback for Header) ---
const HEADER_MESSAGES = {
  en: [
    "Discover Spiritual Wisdom",
    "Journey to Inner Peace",
    "Insights for Wellness",
  ],
  de: [
    "Entdecke spirituelle Weisheit",
    "Reise zum inneren Frieden",
    "Erkenntnisse für Wohlbefinden",
  ]
};

const STATIC_TEXT = {
  en: {
    title: "Insights & Inspirations",
    readMore: "Read More"
  },
  de: {
    title: "Einsichten & Inspirationen",
    readMore: "Mehr lesen"
  }
};

// --- SANITY QUERY ---
// Fetches posts with BOTH English and German fields
const query = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  title_de,
  excerpt,
  excerpt_de,
  mainImage,
  "slug": slug.current
}`;

const BlogPage = () => {
  const [headerIndex, setHeaderIndex] = useState(0);
  
  // 2. State for Data & Language
  const { language } = useLanguage(); // 'en' or 'de'
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fetch Data
  useEffect(() => {
    client.fetch(query)
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setIsLoading(false);
      });
  }, []);

  // 4. Header Carousel Logic
  const currentMessages = HEADER_MESSAGES[language];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderIndex((prevIndex) => (prevIndex + 1) % currentMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentMessages.length]); // Reset if language changes length

  // --- ANIMATION VARIANTS (Unchanged) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const cardHover = {
    scale: 1.03,
    y: -5,
    boxShadow: "0 10px 20px rgba(236, 72, 153, 0.3)",
    transition: { type: "spring", stiffness: 300 },
  };

  // --- LOADING STATE (Maintains Layout) ---
  if (isLoading) {
    return (
      <div className="font-sans bg-gradient-to-b from-pink-200 via-rose-200 to-pink-300 min-h-screen w-full flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-white border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="font-sans bg-gradient-to-b from-pink-200 via-rose-200 to-pink-300 min-h-screen w-full">
      
      {/* ENHANCED FULL-WIDTH DYNAMIC HEADER */}
      <div 
        className="relative w-full py-20 sm:py-28 md:py-36 lg:py-48 text-white text-center overflow-hidden bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/374754/pexels-photo-374754.jpeg?auto=format&fit=crop&q=80&w=1920&h=600')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-rose-700/60 to-rose-900/40 backdrop-blur-sm"></div>

        <motion.div className="relative z-10 px-4">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-extrabold mb-6 tracking-wide drop-shadow-2xl"
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, type: "spring", damping: 12 }}
            whileHover={{ scale: 1.02, textShadow: "0 0 15px rgba(255,255,255,0.9)" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-300">
              {STATIC_TEXT[language].title}
            </span>
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.h3
              key={headerIndex} // Key change triggers animation
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-light italic text-white/90 max-w-3xl md:max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            >
              {/* Dynamic Header Message based on Language */}
              {currentMessages[headerIndex]}
            </motion.h3>
          </AnimatePresence>
          <div className='h-6 sm:h-8 md:h-10'></div>
        </motion.div>
      </div>

      {/* BLOG POSTS SECTION */}
      <section className="py-16 sm:py-24 md:py-28 -mt-8 sm:-mt-12 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={containerVariants}
          >
            {posts.map((post) => (
              <motion.div
                key={post._id}
                className="p-4 sm:p-6 rounded-2xl bg-white/25 backdrop-blur-lg shadow-lg border border-white/30 hover:border-pink-400/50 transition-all duration-300 overflow-hidden flex flex-col"
                variants={itemVariants}
                whileHover={cardHover}
              >
                <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-xl mb-4">
                  <img
                    src={
                      post.mainImage
                        ? urlFor(post.mainImage).width(600).height(400).url()
                        : "https://via.placeholder.com/600x400?text=No+Image"
                    }
                    alt={getLocalizedText(post, 'title', language)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                
                <h3 className="text-lg sm:text-xl md:text-2xl font-['Playfair_Display'] font-semibold text-rose-900 mb-3 tracking-tight">
                  {/* Dynamic Title */}
                  {getLocalizedText(post, 'title', language)}
                </h3>
                
                <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-4 flex-grow line-clamp-3">
                  {/* Dynamic Excerpt */}
                  {getLocalizedText(post, 'excerpt', language)}
                </p>
                
                <Link to={`/blog/${post.slug}`}>
                  <motion.button
                    className="w-full py-2 sm:py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl shadow-md font-medium text-sm sm:text-base hover:from-pink-700 hover:to-rose-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {STATIC_TEXT[language].readMore}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State Handling */}
          {!isLoading && posts.length === 0 && (
             <div className="text-center text-rose-900/60 italic mt-10">
                {language === 'en' ? "No articles found." : "Keine Artikel gefunden."}
             </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default BlogPage;