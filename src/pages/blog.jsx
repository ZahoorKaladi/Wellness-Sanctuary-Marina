// app/src/pages/BlogPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { client, urlFor } from "../client";

// 1. Import Language Tools
import { useLanguage } from "../context/languagecontext";
import { getLocalizedText } from "../utils/sanityHelper";

const POSTS_PER_PAGE = 6;

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    heading: "Insights & Inspirations",
    messages: [
      "Discover Spiritual Wisdom",
      "Journey to Inner Peace",
      "Insights for Wellness",
    ],
    readMore: "Read More",
    loading: "Loading Articles...",
    empty: "No posts found.",
    error: "Failed to load posts. Please try again later."
  },
  de: {
    heading: "Einsichten & Inspirationen",
    messages: [
      "Entdecke spirituelle Weisheit",
      "Reise zum inneren Frieden",
      "Erkenntnisse für Wohlbefinden",
    ],
    readMore: "Mehr lesen",
    loading: "Artikel werden geladen...",
    empty: "Keine Beiträge gefunden.",
    error: "Beiträge konnten nicht geladen werden."
  }
};

// --- COMPONENTS ---

const CardSkeleton = () => (
  <div className="group bg-white/40 backdrop-blur-lg border border-white/60 rounded-[2rem] overflow-hidden shadow-sm animate-pulse h-full">
    <div className="relative h-56 md:h-64 bg-rose-100/50"></div>
    <div className="p-6 md:p-8">
      <div className="h-6 w-3/4 bg-rose-100/50 rounded mb-4"></div>
      <div className="h-4 w-full bg-rose-100/50 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-rose-100/50 rounded mb-6"></div>
      <div className="h-12 w-full bg-rose-100/50 rounded-xl"></div>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPosts, postsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-3 sm:gap-4 mt-16 sm:mt-20">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white/40 border border-white/60 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-white/60 text-rose-900"
      >
        &larr;
      </button>
      <div className="flex items-center gap-2">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-10 h-10 rounded-xl transition-all duration-300 font-medium ${
              currentPage === number 
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30' 
                : 'bg-white/40 border border-white/60 text-rose-900 hover:bg-white/60'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white/40 border border-white/60 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-white/60 text-rose-900"
      >
        &rarr;
      </button>
    </nav>
  );
};

const BlogPage = () => {
  const { language } = useLanguage(); // Hook into Language
  const t = STATIC_TEXT[language];

  const [headerIndex, setHeaderIndex] = useState(0);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Header Rotation Logic
  useEffect(() => {
    // Reset index when language changes
    setHeaderIndex(0);
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderIndex((prev) => (prev + 1) % t.messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [t.messages.length]);

  // Data Fetching
  useEffect(() => {
    setIsLoading(true);
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    const query = `
      {
        "posts": *[_type == "post"] | order(_createdAt desc)[$start...$end] {
          _id,
          title,
          title_de,
          excerpt,
          excerpt_de,
          mainImage,
          "slug": slug.current
        },
        "totalPosts": count(*[_type == "post"])
      }
    `;

    client
      .fetch(query, { start, end })
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPosts(data.totalPosts || 0);
        setIsLoading(false);
        window.scrollTo({ top: 400, behavior: 'smooth' });
      })
      .catch((err) => {
        console.error("Failed to fetch blog posts:", err);
        setError(err);
        setIsLoading(false);
      });
  }, [currentPage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const renderBlogGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl shadow-sm">
          <strong>Error:</strong> {t.error}
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center text-lg text-rose-800/60 py-20 italic">
          {t.empty}
        </div>
      );
    }

    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {posts.map((post) => (
          <motion.div
            key={post._id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            // CONVEX GLASS CARD STYLE
            className="group relative rounded-[2rem] overflow-hidden flex flex-col transition-all duration-500"
            style={{
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
            <Link to={`/blog/${post.slug || post._id}`} className="block h-full flex flex-col">
              <div className="relative h-56 md:h-64 overflow-hidden m-4 mb-0 rounded-3xl shadow-inner">
                <img
                  src={
                    post.mainImage
                      ? urlFor(post.mainImage).width(500).height(400).fit("crop").url()
                      : "https://via.placeholder.com/500x400?text=Missing+Image"
                  }
                  alt={getLocalizedText(post, 'title', language)}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-rose-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold font-['Playfair_Display'] text-rose-900 mb-3 leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors">
                  {getLocalizedText(post, 'title', language)}
                </h3>
                
                <p className="text-rose-800/70 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow font-medium">
                  {getLocalizedText(post, 'excerpt', language)}
                </p>
                
                <span className="w-full block text-center py-3 rounded-xl bg-gradient-to-r from-rose-300 to-pink-300 text-white shadow-md font-bold text-sm uppercase tracking-wide hover:from-rose-600 hover:to-pink-600 transition-all">
                  {t.readMore}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    );
  };
  
  return (
    <div className="font-sans bg-rose-50/50 min-h-screen w-full relative overflow-hidden">
      
      {/* GLOBAL AMBIENT BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-50 pointer-events-none" />
      
      <header
        className="relative w-full py-28 md:py-36 text-white text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/374754/pexels-photo-374754.jpeg?auto=format&fit=crop&q=80&w=1920&h=700')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-rose-900/70 via-rose-800/60 to-rose-900/80 mix-blend-multiply backdrop-blur-[2px]"></div>

        <div className="relative z-10 px-6">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-extrabold mb-5 tracking-wide"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100 drop-shadow-lg">
              {t.heading}
            </span>
          </motion.h1>

          <div className="h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.p
                key={headerIndex}
                className="text-base sm:text-lg md:text-xl font-light italic text-white/90 tracking-wide"
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.7 }}
                >
                {t.messages[headerIndex]}
                </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </header>

      <section className="py-20 sm:py-24 relative z-20 -mt-10">
        {/* Ambient Blobs */}
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-pink-300/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-purple-300/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderBlogGrid()}
          <Pagination 
            currentPage={currentPage}
            totalPosts={totalPosts}
            postsPerPage={POSTS_PER_PAGE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </section>
    </div>
  );
};

export default BlogPage;