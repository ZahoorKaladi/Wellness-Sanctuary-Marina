// app/src/pages/BlogPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { client, urlFor } from "../client"; // <-- 1. IMPORT SANITY

// 2. We keep your static header messages
const headerMessages = [
  "Discover Spiritual Wisdom",
  "Journey to Inner Peace",
  "Insights for Wellness",
];

// 3. We define a simple query for ONLY the posts
const postQuery = `*[_type == "post"] | order(_createdAt desc) {
  _id,
  title,
  excerpt,
  mainImage,
  "slug": slug.current
}`;

// 4. We DELETE the static 'blogPosts' array
// const blogPosts = [ ... ];

const BlogPage = () => {
  const [headerIndex, setHeaderIndex] = useState(0);

  // --- 5. NEW STATE FOR DYNAMIC DATA ---
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // ------------------------------------

  // This is your original static animation, it's perfect
  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderIndex((prev) => (prev + 1) % headerMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 6. NEW EFFECT TO FETCH DATA ---
  useEffect(() => {
    client
      .fetch(postQuery)
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blog posts:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []); // Runs once on page load
  // -----------------------------------

  // Your original static variants, all perfect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

  // --- 7. HELPER COMPONENT FOR THE GRID ---
  // This lets us show the static page layout *while*
  // the grid area handles its own loading/error states.
  const renderBlogGrid = () => {
    if (isLoading) {
      return (
        <div className="text-center text-lg text-rose-800">
          Loading posts...
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
        <div className="text-center text-lg text-gray-700">
          No posts found.
        </div>
      );
    }

    // This is the "Success" state
    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {posts.map((post) => (
          <motion.div
            key={post._id} // <-- Use Sanity's unique _id
            className="group bg-white/70 backdrop-blur-lg border border-pink-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
            whileHover={cardHover}
          >
            <div className="relative h-56 md:h-64 overflow-hidden">
              <img
                // 8. "BULLETPROOF" IMAGE LOADING (as promised)
                src={
                  post.mainImage
                    ? urlFor(post.mainImage).width(500).height(400).fit("crop").url()
                    : "https://via.placeholder.com/500x400?text=Missing+Image"
                }
                alt={post.title || "Blog post image"}
                loading="lazy" // <-- LAZY LOADING (as promised)
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-semibold font-['Playfair_Display'] text-rose-900 mb-3 leading-snug">
                {/* 9. "BULLETPROOF" TEXT (as promised) */}
                {post.title || "Untitled Post"}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {post.excerpt || "No summary available."}
              </p>
              <Link to={`/blog/${post.slug || post._id}`}>
                <motion.button
                  className="w-full py-3 bg-rose-300 text-white rounded-xl shadow-md font-medium text-base hover:from-rose-700 hover:to-pink-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };
  
  // --- RENDER FUNCTION ---
  // This layout is all static and will load instantly
  return (
    <div className="font-sans bg-gradient-to-br from-rose-50 via-pink-50 to-white min-h-screen w-full">
      {/* ✨ HEADER SECTION (Your original static code) */}
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

      {/* ✨ BLOG GRID SECTION */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 10. We call our new helper function here */}
          {renderBlogGrid()}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;