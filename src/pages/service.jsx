// app/src/pages/ServicePage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { DollarSign, Tag, Info, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { client, urlFor } from "../client"; 

// 1. Import Language Tools
import { useLanguage } from "../context/languagecontext";
import { getLocalizedText } from "../utils/sanityhelper";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    curated: "Curated Collection",
    title: "Holistic Health Essentials",
    subtitle: "Hand-picked by Marina to support your journey towards inner harmony and radiant living.",
    price: "Price",
    details: "Details",
    loading: "Loading products...",
    error: "Failed to load products. Please try again later.",
    empty: "No products found.",
    noteTitle: "A Note from Marina",
    noteDesc: "These products are chosen with intention to complement your healing practice. However, true wellness is a holistic journey. For personalized guidance tailored to your unique energy, consider booking a consultation."
  },
  de: {
    curated: "Kuratierte Kollektion",
    title: "Ganzheitliche Gesundheits-Essentials",
    subtitle: "Von Marina handverlesen, um Ihre Reise zu innerer Harmonie und strahlendem Leben zu unterstützen.",
    price: "Preis",
    details: "Details",
    loading: "Produkte werden geladen...",
    error: "Produkte konnten nicht geladen werden.",
    empty: "Keine Produkte gefunden.",
    noteTitle: "Eine Notiz von Marina",
    noteDesc: "Diese Produkte wurden mit Bedacht ausgewählt, um Ihre Heilpraxis zu ergänzen. Wahres Wohlbefinden ist jedoch eine ganzheitliche Reise. Für eine persönliche Beratung, die auf Ihre einzigartige Energie zugeschnitten ist, buchen Sie bitte eine Konsultation."
  }
};

// --- QUERY (Updated for Multi-Language) ---
const productQuery = `*[_type == "product"] | order(_createdAt asc) {
  _id,
  name,
  name_de,
  tagline,
  tagline_de,
  price,
  image,
  "slug": slug.current,
  category,
  category_de,
  focus,
  focus_de
}`;

// --- SUB-COMPONENT: PRODUCT CARD ---
const ProductCard = ({ product, language, t }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group relative flex flex-col rounded-[2rem] overflow-hidden transition-all duration-500"
    style={{
        // CONVEX GLASS STYLE
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
    {/* Image Area */}
    <div className="relative h-64 overflow-hidden p-4">
        <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-inner">
            <img
                src={
                product.image
                    ? urlFor(product.image).width(500).height(500).url()
                    : "https://via.placeholder.com/400x400?text=Missing+Image"
                }
                alt={getLocalizedText(product, 'name', language)}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Badge */}
            {product.focus && (
                <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full border border-white text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                   <Info size={10} /> {getLocalizedText(product, 'focus', language)}
                </div>
            )}
        </div>
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>

    {/* Content Area */}
    <div className="p-6 pt-2 flex flex-col flex-1">
        {product.category && (
            <div className="flex items-center gap-1 mb-2">
               <Tag size={12} className="text-pink-400" />
               <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                 {getLocalizedText(product, 'category', language)}
               </span>
            </div>
        )}

        <h3 className="text-xl font-bold text-rose-950 mb-2 leading-tight group-hover:text-pink-600 transition-colors">
            {getLocalizedText(product, 'name', language) || "Untitled Product"}
        </h3>
        
        <p className="text-sm text-rose-800/70 line-clamp-2 mb-4 font-medium">
            {getLocalizedText(product, 'tagline', language) || "No description available."}
        </p>

        <div className="mt-auto pt-4 border-t border-white/40 flex justify-between items-center">
            <div className="flex flex-col">
               <span className="text-[10px] text-rose-400 font-bold uppercase">{t.price}</span>
               <span className="text-lg font-bold text-rose-900 flex items-center gap-0.5 font-['Playfair_Display']">
                <DollarSign size={14} className="text-pink-500" strokeWidth={3} /> 
                {(product.price || 0).toFixed(2)}
               </span>
            </div>
            
            <Link
                to={`/services/${product.slug || product._id}`}
                className="py-1.5 px-3 bg-white text-rose-500 text-xs font-semibold rounded-full shadow-sm border border-rose-100 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center gap-1"
            >
                {t.details} <ChevronRight size={14} />
            </Link>
        </div>
    </div>
  </motion.div>
);

const ServicePage = () => {
  const { language } = useLanguage(); // Hook into Language
  const t = STATIC_TEXT[language];

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client
      .fetch(productQuery)
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const renderProductGrid = () => {
    if (isLoading) {
      return (
        <div className="col-span-full flex justify-center py-20">
           <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-10 bg-rose-50 rounded-2xl border border-rose-100 text-rose-800">
          <p>{t.error}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="col-span-full text-center py-10 text-rose-800/60 italic">
          {t.empty}
        </div>
      );
    }

    return products.map((product) => (
       <ProductCard key={product._id} product={product} language={language} t={t} />
    ));
  };

  return (
    <div className="min-h-screen w-full font-sans bg-rose-50/50 text-rose-900 overflow-hidden">
      
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-50 pointer-events-none" />
      
      {/* --- HERO SECTION --- */}
      <header className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/374754/pexels-photo-374754.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-900/60 via-rose-800/40 to-rose-900/80 mix-blend-multiply" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-10">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1 }}
             className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md"
           >
              <span className="text-xs font-bold tracking-[0.2em] text-rose-100 uppercase flex items-center gap-2">
                 <Sparkles size={12} /> {t.curated}
              </span>
           </motion.div>

           <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-bold text-white mb-4 drop-shadow-lg"
           >
             {t.title}
           </motion.h1>

           <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-rose-100/90 font-light italic max-w-2xl mx-auto"
           >
             {t.subtitle}
           </motion.p>
        </div>
      </header>

      {/* --- PRODUCT GRID SECTION --- */}
      <section className="relative -mt-20 z-20 pb-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {renderProductGrid()}
            </div>
        </div>
      </section>

      {/* --- SHOPPING NOTE --- */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-[2rem] flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 30px rgba(236, 72, 153, 0.08)'
          }}
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
             <ShoppingBag size={24} className="text-rose-600" />
          </div>
          
          <div>
             <h4 className="text-xl font-bold text-rose-900 mb-2 font-['Playfair_Display']">
               {t.noteTitle}
             </h4>
             <p className="text-rose-800/80 leading-relaxed text-sm font-medium">
               {t.noteDesc}
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicePage;