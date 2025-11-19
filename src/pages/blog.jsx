// app/src/pages/BlogPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { client, urlFor } from "../client";

const POSTS_PER_PAGE = 6;

const headerMessages = [
  "Discover Spiritual Wisdom",
  "Journey to Inner Peace",
  "Insights for Wellness",
];

const CardSkeleton = () => (
    <div className="group bg-white/70 backdrop-blur-lg border border-pink-100 rounded-3xl overflow-hidden shadow-sm animate-pulse">
      <div className="relative h-56 md:h-64 bg-gray-200/80"></div>
      <div className="p-6 md:p-8">
        <div className="h-6 w-3/4 bg-gray-200/80 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200/80 rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-200/80 rounded mb-6"></div>
        <div className="h-12 w-full bg-gray-200/80 rounded-xl"></div>
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
          className="px-4 py-2 bg-white/80 border border-pink-200 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-pink-100/50"
        >
          &larr;
        </button>
        <div className="flex items-center gap-2">
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`w-10 h-10 rounded-lg transition-colors ${currentPage === number ? 'bg-rose-800 text-white shadow-lg' : 'bg-white/80 border border-pink-200 hover:bg-pink-100/50'}`}
            >
              {number}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white/80 border border-pink-200 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-pink-100/50"
        >
          &rarr;
        </button>
      </nav>
    );
};

const BlogPage = () => {
  const [headerIndex, setHeaderIndex] = useState(0);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderIndex((prev) => (prev + 1) % headerMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    const query = `
      {
        "posts": *[_type == "post"] | order(_createdAt desc)[$start...$end] {
          _id,
          title,
          excerpt,
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

  const cardHover = {
    scale: 1.03,
    y: -6,
    boxShadow: "0 12px 25px rgba(236, 72, 153, 0.25)",
    transition: { type: "spring", stiffness: 260 },
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
        <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Error:</strong> Failed to load posts. Please try again later.
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center text-lg text-gray-700 py-10">
          No posts found.
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
            className="group bg-white/70 backdrop-blur-lg border border-pink-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
            whileHover={cardHover}
          >
            <Link to={`/blog/${post.slug || post._id}`} className="block">
              <div className="relative h-56 md:h-64 overflow-hidden">
                <img
                  src={
                    post.mainImage
                      ? urlFor(post.mainImage).width(500).height(400).fit("crop").url()
                      : "https://via.placeholder.com/500x400?text=Missing+Image"
                  }
                  alt={post.title || "Blog post image"}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold font-['Playfair_Display'] text-rose-900 mb-3 leading-snug line-clamp-2">
                  {post.title || "Untitled Post"}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt || "No summary available."}
                </p>
                <span className="w-full block text-center py-3 bg-rose-300 text-white rounded-xl shadow-md font-medium text-base group-hover:bg-rose-700 transition-all">
                  Read More
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    );
  };
  
  return (
    <div className="font-sans bg-gradient-to-br from-rose-50 via-pink-50 to-white min-h-screen w-full">
      <header
        className="relative w-full py-28 md:py-36 text-white text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/374754/pexels-photo-374754.jpeg?auto=format&fit=crop&q=80&w=1920&h=700')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-rose-800/70 via-rose-900/60 to-rose-950/80"></div>

        <div className="relative z-10 px-6">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-extrabold mb-5 tracking-wide"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
              Insights & Inspirations
            </span>
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={headerIndex}
              className="text-base sm:text-lg md:text-xl font-light italic text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
            >
              {headerMessages[headerIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </header>

      <section className="py-20 sm:py-24">
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