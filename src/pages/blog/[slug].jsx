// app/src/pages/BlogPostPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { client, urlFor } from '../../client'; // <-- 1. IMPORT SANITY
import { PortableText } from '@portabletext/react'; // <-- 2. IMPORT THE RENDERER

// 3. This is ONE query to get EVERYTHING: the post AND related posts
const query = `*[_type == "post" && slug.current == $slug][0] {
  title,
  "authorName": author->name, // Get the author's name
  publishedAt,
  mainImage,
  body, // This is your 'fullContent' as Portable Text
  "slug": slug.current,
  // This sub-query gets 3 related posts, excluding the current one
  "relatedPosts": *[_type == "post" && slug.current != $slug] | order(publishedAt desc)[0...3] {
    _id,
    title,
    excerpt,
    mainImage,
    "slug": slug.current
  }
}`;

// 4. We DELETE the static 'blogPosts' array
// const blogPosts = [ ... ];

// This is a helper to format the date from Sanity
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogPostPage = () => {
  const { slug } = useParams(); // Gets the "embracing-mindfulness" from the URL
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This runs when the 'slug' changes
    setIsLoading(true);
    setPost(null); // Clear the old post
    
    client
      .fetch(query, { slug }) // Pass the 'slug' from the URL into the query
      .then((data) => {
        if (data) {
          setPost(data);
        } else {
          setError('Post not found'); // Set a specific error if no post matches
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch post:', err);
        setError('Failed to load content.');
        setIsLoading(false);
      });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]); // Re-run this hook if the slug changes

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  
  // --- 5. LOADING, ERROR, AND 404 HANDLING (Professional Approach) ---

  // This renders your static layout, but with a loader *inside* the content box
  // This is exactly what you requested!
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
  <p className="text-rose-900 font-semibold text-lg animate-pulse">
    Loading Post<span className="animate-ping text-rose-500">...</span>
  </p>
</div>

      );
    }

    // This renders your beautiful "404" page if the post is not found
    if (error || !post) {
      return (
        <div className="font-['Playfair_Display'] text-center py-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-900 mb-4 tracking-tight">
            404 - Post Not Found
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-800">
            {error || "The blog post you are looking for does not exist."}
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-block px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl shadow-xl font-semibold text-sm sm:text-base hover:from-pink-700 hover:to-rose-700 transition-all duration-300"
          >
            Back to Blog
          </Link>
        </div>
      );
    }

    // --- 6. SUCCESS STATE (Render the Post) ---
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* POST HERO IMAGE (Now dynamic and safe) */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-xl mb-8">
          <img
            src={
              post.mainImage
                ? urlFor(post.mainImage).width(1000).url()
                : "https://via.placeholder.com/1000x500?text=Missing+Image"
            }
            alt={post.title || "Blog post image"}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-rose-900 mb-4 tracking-tight"
          variants={itemVariants}
        >
          {post.title || "Untitled Post"}
        </motion.h1>
        <motion.div
          className="text-gray-800 text-sm sm:text-base mb-6 italic"
          variants={itemVariants}
        >
          By <span className="font-semibold text-rose-800">{post.authorName || "Marina"}</span> on {post.publishedAt ? formatDate(post.publishedAt) : "Date not available"}
        </motion.div>

        {/* 7. THIS IS THE BIGGEST CHANGE ---
            We use <PortableText> to safely render the rich text content.
            This replaces 'dangerouslySetInnerHTML' and is 100% production-safe.
        */}
        <motion.div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          variants={itemVariants}
        >
          {post.body ? (
            <PortableText value={post.body} />
          ) : (
            <p>This post has no content yet.</p>
          )}
        </motion.div>

        <motion.div
          className="flex justify-between items-center mt-12 pt-6 border-t border-pink-200/50"
          variants={itemVariants}
        >
          <Link
            to="/blog"
            className="text-rose-800 font-semibold text-sm sm:text-base hover:text-rose-600 transition-all duration-300"
          >
            &larr; Back to All Posts
          </Link>
        </motion.div>
      </motion.div>
    );
  };
  
  // --- RENDER FUNCTION ---
  // The static parts of your page load instantly
  return (
    <motion.div
      className="font-['Playfair_Display'] bg-gradient-to-b from-pink-200 via-rose-200 to-pink-300 min-h-screen pt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* The main content box renders the loading/error/success state */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white/25 backdrop-blur-xl shadow-xl border border-white/30">
          {renderContent()}
        </div>

        {/* RELATED POSTS SECTION (Now dynamic and safe) */}
        {/* We only show this section if the main post loaded successfully */}
        {post && post.relatedPosts && (
          <motion.section
            className="py-12 sm:py-16 md:py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-900 mb-8 text-center tracking-tight">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {post.relatedPosts.map((relatedPost) => (
                <motion.div
                  key={relatedPost._id}
                  className="p-4 sm:p-6 rounded-2xl bg-white/25 backdrop-blur-lg shadow-lg border border-white/30 hover:border-pink-400/50 transition-all duration-300 overflow-hidden"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.03,
                    y: -5,
                    boxShadow: "0 10px 20px rgba(236, 72, 153, 0.3)",
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-xl mb-4">
                    <img
                      src={
                        relatedPost.mainImage
                          ? urlFor(relatedPost.mainImage).width(400).url()
                          : "https://via.placeholder.com/400x300?text=Missing+Image"
                      }
                      alt={relatedPost.title || "Related post image"}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-rose-900 mb-3 tracking-tight">
                    {relatedPost.title || "Untitled Post"}
                  </h3>
                  <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-4">
                    {relatedPost.excerpt || "No summary available."}
                  </p>
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <motion.button
                      className="w-full py-2 sm:py-3 bg-rose-300 text-white rounded-xl shadow-md font-medium text-sm sm:text-base hover:from-pink-700 hover:to-rose-700 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Read More
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPostPage;