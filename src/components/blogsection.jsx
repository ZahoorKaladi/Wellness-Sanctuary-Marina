// app/src/components/BlogSection.jsx (or wherever it lives)

import React, { useState, useEffect, useRef } from "react"; // <-- 1. ADD useState, useEffect
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { client, urlFor } from "../client"; // <-- 2. IMPORT SANITY

// 3. We DELETE the static 'dummyPosts' array
// const dummyPosts = [ ... ];

// 4. We define a query to get the 6 most recent posts
const postQuery = `*[_type == "post"] | order(publishedAt desc)[0...6] {
  _id,
  title,
  excerpt,
  mainImage,
  "slug": slug.current
}`;

// Your static Slick settings are perfect
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false,
  centerMode: true,
  centerPadding: "10px",
  responsive: [
    { breakpoint: 640, settings: { slidesToShow: 1, centerPadding: "15px" } },
    { breakpoint: 768, settings: { slidesToShow: 2, centerPadding: "10px" } },
    { breakpoint: 1024, settings: { slidesToShow: 3, centerPadding: "0" } },
  ],
};

const BlogSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // --- 5. ADD STATE FOR DYNAMIC DATA ---
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // ------------------------------------

  // --- 6. ADD useEffect TO FETCH POSTS ---
  useEffect(() => {
    client
      .fetch(postQuery)
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch posts for carousel:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []); // Runs once on component mount
  // ---------------------------------------

  // All your animation variants are perfect
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const cardHover = {
    y: -8,
    scale: 1.03,
    boxShadow: "0 15px 30px rgba(236, 72, 153, 0.25)",
    transition: { type: "spring", stiffness: 300 },
  };

  // --- 7. HELPER FUNCTION TO RENDER THE SLIDER ---
  // This is the professional approach you asked for.
  // The static parts of the component will render, and this
  // function will handle the dynamic part.
  const renderSlider = () => {
    if (isLoading) {
      return (
        <div className="text-center text-lg text-rose-800 p-10">
          Loading Journal...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Error:</strong> Failed to load posts.
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center text-lg text-gray-700 p-10">
          No posts found.
        </div>
      );
    }

    // Success: Render the slider
    return (
      <Slider {...sliderSettings}>
        {posts.map((post, i) => (
          <div key={post._id} className="px-2 sm:px-3"> {/* Use Sanity _id for key */}
            <Link
              to={`/blog/${post.slug || post._id}`} // Use slug, with fallback to _id
              className="block w-full h-full"
              aria-label={`Read: ${post.title || 'Untitled Post'}`}
            >
              <motion.article
                whileHover={cardHover}
                whileTap={{ scale: 0.98 }}
                className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl overflow-hidden shadow-xl hover:border-pink-300/60 transition-all duration-500 h-full flex flex-col"
              >
                {/* IMAGE (Bulletproof & Lazy Load) */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={
                      post.mainImage
                        ? urlFor(post.mainImage).width(400).height(300).fit("crop").url()
                        : "https://via.placeholder.com/400x300?text=Missing+Image"
                    }
                    alt={post.title || "Blog post image"}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy" // <-- LAZY LOADING
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent" />
                </div>

                {/* CONTENT (Bulletproof) */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="font-semibold text-rose-900 mb-2 line-clamp-2 text-sm sm:text-base md:text-lg leading-tight">
                      {post.title || "Untitled Post"}
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-700/80 leading-snug line-clamp-3 mb-3">
                      {post.excerpt || "No summary available."}
                    </p>
                  </div>
                  <span className="mt-2 inline-block px-4 py-2 text-xs sm:text-sm font-medium text-white bg-rose-300 rounded-full shadow-md hover:from-pink-600 hover:to-rose-700 transition-all duration-300">
                    Read More
                  </span>
                </div>
              </motion.article>
            </Link>
          </div>
        ))}
      </Slider>
    );
  };

  // --- MAIN RETURN (Your static layout is safe) ---
  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 font-['Playfair_Display'] overflow-hidden bg-gradient-to-b from-transparent via-pink-50/5 to-transparent"
    >
      {/* FLOATING GLOW ORBS (Static) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-pink-400/20 to-rose-600/20 blur-3xl"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={isInView ? { y: [null, `${Math.random() * 80}%`], opacity: [0.3, 0.5, 0.3] } : {}}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* HEADING (Static) */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-900 mb-3 drop-shadow-md">
            From Marina’s Journal
          </h2>
          <p className="
  text-sm 
  xs:text-base 
  sm:text-lg 
  md:text-xl 
  text-rose-800/85 
  max-w-xs 
  xs:max-w-sm 
  sm:max-w-md 
  md:max-w-lg 
  lg:max-w-xl 
  xl:max-w-2xl 
  mx-auto 
  leading-relaxed 
  xs:leading-loose 
  italic 
  text-center 
  sm:text-center 
  md:text-center 
  px-4 
  hyphens-auto 
  break-words
">
            Soulful reflections and practices to nurture your mind, body, and spirit.
          </p>
        </motion.div>

        {/* RESPONSIVE SLIDER (Now dynamic) */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          {/* 8. We call our dynamic render function here */}
          {renderSlider()}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;