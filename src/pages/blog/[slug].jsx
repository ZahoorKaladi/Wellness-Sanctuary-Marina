// app/src/pages/BlogPostPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { client, urlFor } from '../../client'; 
import { PortableText } from '@portabletext/react'; 

// 1. Import Language Tools
import { useLanguage } from '../../context/languagecontext';
import { getLocalizedText } from '../../utils/sanityhelper';

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    backLink: "Back to Journal",
    relatedTitle: "Related Posts",
    loading: "Loading Post...",
    notFound: "Post Not Found",
    notFoundDesc: "The article you are looking for does not exist or has been moved.",
    by: "By",
    on: "on",
    readMore: "Read Article"
  },
  de: {
    backLink: "Zurück zum Journal",
    relatedTitle: "Ähnliche Beiträge",
    loading: "Beitrag wird geladen...",
    notFound: "Beitrag nicht gefunden",
    notFoundDesc: "Der gesuchte Artikel existiert nicht oder wurde verschoben.",
    by: "Von",
    on: "am",
    readMore: "Artikel lesen"
  }
};

// --- QUERY (Updated for Multi-Language) ---
const query = `*[_type == "post" && slug.current == $slug][0] {
  title,
  title_de, // German Title
  "authorName": author->name,
  publishedAt,
  mainImage,
  body, 
  body_de,  // German Content (Portable Text)
  "slug": slug.current,
  "relatedPosts": *[_type == "post" && slug.current != $slug] | order(publishedAt desc)[0...3] {
    _id,
    title,
    title_de,
    excerpt,
    excerpt_de,
    mainImage,
    "slug": slug.current
  }
}`;

// Helper to format date based on locale
const formatDate = (dateString, locale) => {
  return new Date(dateString).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage(); // Hook into Language
  const t = STATIC_TEXT[language];

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setPost(null);
    
    client
      .fetch(query, { slug })
      .then((data) => {
        if (data) {
          setPost(data);
        } else {
          setError('Post not found');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch post:', err);
        setError('Failed to load content.');
        setIsLoading(false);
      });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mb-4" />
          <p className="text-rose-900 font-medium animate-pulse">{t.loading}</p>
        </div>
      );
    }

    if (error || !post) {
      return (
        <div className="font-sans text-center py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-900 mb-4">
            {t.notFound}
          </h1>
          <p className="text-rose-800/70 mb-8">
            {t.notFoundDesc}
          </p>
          <Link
            to="/blog"
            className="inline-block px-8 py-3 bg-rose-500 text-white rounded-full font-medium shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all"
          >
            {t.backLink}
          </Link>
        </div>
      );
    }

    // Determine which body content to render
    // Note: For PortableText, getLocalizedText might need adjustment if it expects simple strings.
    // Here we do it manually for the body since it's an array of blocks.
    const contentBody = (language === 'de' && post.body_de) ? post.body_de : post.body;

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true }}
      >
        {/* POST HERO IMAGE */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-2xl mb-8 shadow-md">
          <img
            src={
              post.mainImage
                ? urlFor(post.mainImage).width(1200).url()
                : "https://via.placeholder.com/1000x500?text=Missing+Image"
            }
            alt={getLocalizedText(post, 'title', language)}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-rose-950 mb-4 leading-tight"
          variants={itemVariants}
        >
          {getLocalizedText(post, 'title', language)}
        </motion.h1>
        
        <motion.div
          className="flex items-center gap-2 text-rose-800/70 text-sm sm:text-base mb-8 font-medium"
          variants={itemVariants}
        >
          <span>{t.by} <span className="text-rose-600">{post.authorName || "Marina"}</span></span>
          <span>•</span>
          <span>{post.publishedAt ? formatDate(post.publishedAt, language) : ""}</span>
        </motion.div>

        {/* RICH TEXT CONTENT */}
        <motion.div
          className="prose prose-lg prose-rose max-w-none text-gray-700 leading-relaxed"
          variants={itemVariants}
        >
          {contentBody ? (
            <PortableText value={contentBody} />
          ) : (
            <p className="italic text-gray-500">
              {language === 'de' ? "Inhalt folgt bald..." : "Content coming soon..."}
            </p>
          )}
        </motion.div>

        <motion.div
          className="flex justify-between items-center mt-12 pt-8 border-t border-rose-200/50"
          variants={itemVariants}
        >
          <Link
            to="/blog"
            className="text-rose-600 font-semibold text-sm sm:text-base hover:text-rose-800 transition-all flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> {t.backLink}
          </Link>
        </motion.div>
      </motion.div>
    );
  };
  
  return (
    <div className="font-sans bg-rose-50/50 min-h-screen pt-24 pb-20 relative overflow-hidden">
      
      {/* GLOBAL AMBIENT BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-pink-300/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-purple-300/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Main Content Card (Convex Glass) */}
        <div 
          className="p-8 sm:p-12 rounded-[2.5rem] mb-16"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: `
              inset 0 0 0 1px rgba(255, 255, 255, 0.5),
              0 20px 60px rgba(236, 72, 153, 0.1)
            `
          }}
        >
          {renderContent()}
        </div>

        {/* RELATED POSTS SECTION */}
        {post && post.relatedPosts && post.relatedPosts.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h2 className="text-3xl font-['Playfair_Display'] font-bold text-rose-950 mb-10 text-center">
              {t.relatedTitle}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {post.relatedPosts.map((relatedPost) => (
                <motion.div
                  key={relatedPost._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group flex flex-col rounded-[2rem] overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        relatedPost.mainImage
                          ? urlFor(relatedPost.mainImage).width(400).height(300).url()
                          : "https://via.placeholder.com/400x300?text=Missing+Image"
                      }
                      alt={getLocalizedText(relatedPost, 'title', language)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 to-transparent opacity-60" />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-rose-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {getLocalizedText(relatedPost, 'title', language)}
                    </h3>
                    <p className="text-sm text-rose-800/70 line-clamp-3 mb-4 flex-grow">
                      {getLocalizedText(relatedPost, 'excerpt', language)}
                    </p>
                    
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <span className="text-xs font-bold text-rose-500 uppercase tracking-wider border-b border-rose-200 pb-1 group-hover:border-rose-500 transition-all">
                        {t.readMore}
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;