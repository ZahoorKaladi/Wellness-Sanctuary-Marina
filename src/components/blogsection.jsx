// app/src/components/BlogSection.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { client, urlFor } from "../client";

// 1. Import Language Tools
import { useLanguage } from "../context/languagecontext";
import { getLocalizedText } from "../utils/sanityhelper";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    heading: "From Marina’s Journal",
    subheading: "Insights for your well-being journey",
    tag: "Journal",
    readMore: "Read Article",
    empty: "No entries found."
  },
  de: {
    heading: "Aus Marinas Tagebuch",
    subheading: "Einblicke für Ihre Wohlfühlreise",
    tag: "Tagebuch",
    readMore: "Artikel lesen",
    empty: "Keine Einträge gefunden."
  }
};

// --- QUERY (Updated for Multi-Language) ---
const postQuery = `*[_type == "post"] | order(publishedAt desc)[0...6] {
  _id,
  title,
  title_de,     // Fetch German Title
  excerpt,
  excerpt_de,   // Fetch German Excerpt
  mainImage,
  "slug": slug.current
}`;

// --- SUB-COMPONENT: JOURNAL CARD ---
const JournalCard = ({ post, language }) => (
  <Link to={`/blog/${post.slug || post._id}`} className="block h-full select-none dragging-none">
    <motion.article
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative h-full flex flex-col overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 transition-all duration-500"
      style={{
        boxShadow: `
          inset 0 0 0 1px rgba(255, 255, 255, 0.5), 
          inset 0 5px 20px rgba(255, 255, 255, 0.8),
          0 15px 40px rgba(236, 72, 153, 0.1)
        `,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {post.mainImage ? (
          <img
            src={urlFor(post.mainImage).width(600).height(450).fit("crop").quality(85).auto("format").url()}
            alt={getLocalizedText(post, 'title', language)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-pink-50 text-pink-200 text-6xl">
            ♡
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/40">
           <span className="text-[10px] font-bold tracking-widest text-white uppercase">
             {STATIC_TEXT[language].tag}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 md:p-8">
        <h3 className="font-serif text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
          {/* Dynamic Title */}
          {getLocalizedText(post, 'title', language)}
        </h3>
        
        <p className="text-gray-600/90 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
          {/* Dynamic Excerpt */}
          {getLocalizedText(post, 'excerpt', language)}
        </p>

        <div className="mt-auto pt-4 border-t border-white/30 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-rose-900/70 uppercase group-hover:text-rose-600 transition-colors">
            {STATIC_TEXT[language].readMore}
          </span>
          <motion.div 
            className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors"
          >
            →
          </motion.div>
        </div>
      </div>
    </motion.article>
  </Link>
);

// --- MAIN COMPONENT ---
const BlogSection = () => {
  const { language } = useLanguage(); // Hook into language state
  const t = STATIC_TEXT[language];

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch Data
  useEffect(() => {
    client
      .fetch(postQuery)
      .then((data) => {
        setPosts(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // --- AUTO PLAY LOGIC ---
  useEffect(() => {
    if (isLoading || isPaused || posts.length === 0) return;

    const autoScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // Check if we are near the end
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

        if (isAtEnd) {
          // Smoothly scroll back to start
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const scrollAmount = clientWidth < 768 ? clientWidth * 0.85 : clientWidth / 3; 
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    };

    const interval = setInterval(autoScroll, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [isLoading, isPaused, posts.length]);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-white/0">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/30 to-white/80 -z-20" />
      <div className="absolute top-20 left-0 w-[30rem] h-[30rem] bg-pink-300/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-20 right-0 w-[30rem] h-[30rem] bg-purple-300/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-rose-900 via-pink-600 to-purple-700 bg-clip-text text-transparent">
              {t.heading}
            </span>
          </h2>
          <p className="text-lg text-rose-900/60 font-light italic">
            {t.subheading}
          </p>
        </motion.div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 italic">{t.empty}</p>
        ) : (
          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
          >
            {/* AUTO-SCROLL CONTAINER */}
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
              style={{ scrollBehavior: 'smooth' }}
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="snap-center shrink-0 w-[85vw] sm:w-[22rem] lg:w-[24rem] h-auto flex"
                >
                  <JournalCard post={post} language={language} />
                </motion.div>
              ))}
              
              <div className="shrink-0 w-4 sm:w-0" />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default BlogSection;