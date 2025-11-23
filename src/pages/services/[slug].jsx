// app/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Heart,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import OrderModal from "./ordermodal";
import { client, urlFor } from "../../client";

// 1. Import Language Tools
import { useLanguage } from "../../context/languagecontext";
import { getLocalizedText } from "../../utils/sanityhelper";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    back: "Back to Products",
    premium: "Premium Collection",
    benefits: "Key Benefits",
    price: "Total Price",
    order: "Order Now",
    noBenefits: "No benefits listed.",
    notFound: "Product Not Found",
    notFoundDesc: "This item seems to have disappeared.",
    returnShop: "Return to Shop",
    loading: "Loading Beauty..."
  },
  de: {
    back: "Zurück zu den Produkten",
    premium: "Premium-Kollektion",
    benefits: "Hauptvorteile",
    price: "Gesamtpreis",
    order: "Jetzt bestellen",
    noBenefits: "Keine Vorteile aufgeführt.",
    notFound: "Produkt nicht gefunden",
    notFoundDesc: "Dieser Artikel scheint verschwunden zu sein.",
    returnShop: "Zurück zum Shop",
    loading: "Lade Schönheit..."
  }
};

// --- QUERY (Updated for Multi-Language) ---
const query = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  name_de,
  tagline,
  tagline_de,
  price,
  image,
  description,
  description_de,
  benefits,
  benefits_de
}`;

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage(); // Hook into Language
  const t = STATIC_TEXT[language];

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    client
      .fetch(query, { slug })
      .then((data) => {
        if (data) {
          setProduct(data);
        } else {
          setError("Product not found");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product.");
        setIsLoading(false);
      });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // --- LOADER ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 to-purple-100/50" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          <p className="text-rose-800 font-medium animate-pulse">{t.loading}</p>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 relative overflow-hidden font-['Playfair_Display']">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-white to-pink-100/40" />
        <div className="relative z-10 text-center p-10 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl">
          <h1 className="text-4xl font-bold text-rose-900 mb-4">{t.notFound}</h1>
          <p className="text-rose-800/70 mb-8">{t.notFoundDesc}</p>
          <Link
            to="/service"
            className="px-8 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30"
          >
            {t.returnShop}
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic Content Logic
  const productName = getLocalizedText(product, 'name', language);
  const productTagline = getLocalizedText(product, 'tagline', language);
  const productDesc = getLocalizedText(product, 'description', language);
  // Handle benefits array manually
  const productBenefits = (language === 'de' && product.benefits_de) ? product.benefits_de : product.benefits;

  const total = (product.price * quantity).toFixed(2);

  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-20 font-sans">
      
      {/* 1. AMBIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-20" />
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-pink-300/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-purple-300/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back Button */}
        <Link
          to="/service"
          className="inline-flex items-center text-rose-800/60 hover:text-rose-600 font-medium text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {t.back}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* --- LEFT: PRODUCT IMAGE --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2.5rem] p-4 sm:p-6"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: `
                inset 0 0 0 1px rgba(255, 255, 255, 0.5),
                inset 0 10px 30px rgba(255, 255, 255, 0.8),
                0 20px 50px rgba(236, 72, 153, 0.15)
              `
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-[2.5rem] pointer-events-none" />
            
            <div className="relative z-10 overflow-hidden rounded-[1.5rem] shadow-inner">
              <img
                src={
                  product.image
                    ? urlFor(product.image).width(800).url()
                    : "https://via.placeholder.com/800x800?text=Missing+Image"
                }
                alt={productName}
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* --- RIGHT: DETAILS --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header Info */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-pink-400 w-5 h-5 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest text-rose-400 uppercase">
                    {t.premium}
                  </span>
               </div>
               
               <h1 className="text-4xl sm:text-5xl font-['Playfair_Display'] font-bold text-rose-950 leading-tight">
                 {productName}
               </h1>
               
               <p className="text-lg text-rose-800/60 italic font-medium">
                 {productTagline}
               </p>
            </div>

            {/* Description Box */}
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm">
              <p className="text-rose-950/80 leading-relaxed text-base">
                {productDesc}
              </p>
            </div>

            {/* Benefits List */}
            <div>
              <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wide mb-4">
                {t.benefits}
              </h3>
              <ul className="space-y-3">
                {productBenefits && productBenefits.length > 0 ? (
                  productBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-rose-900/80">
                      <div className="mt-1 p-1 bg-pink-100 rounded-full">
                        <Heart size={12} className="text-pink-500 fill-pink-500" />
                      </div>
                      <span className="leading-tight">{b}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-rose-800/50 italic">{t.noBenefits}</li>
                )}
              </ul>
            </div>

            {/* --- CONTROLS SECTION --- */}
            <div 
              className="rounded-3xl p-6 sm:p-8 mt-8"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3))',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 15px 35px rgba(236, 72, 153, 0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                
                {/* Quantity */}
                <div className="flex items-center gap-4 bg-white/50 rounded-full p-1.5 border border-white/60 shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                  >
                    <ChevronDown size={18} />
                  </button>
                  <span className="w-8 text-center text-lg font-bold text-rose-900 font-sans">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                  >
                    <ChevronUp size={18} />
                  </button>
                </div>

                {/* Price */}
                <div className="flex flex-col items-end sm:items-start">
                   <span className="text-xs text-rose-500 font-bold uppercase tracking-wider">{t.price}</span>
                   <span className="text-3xl font-['Playfair_Display'] font-bold text-rose-900 flex items-center">
                     <DollarSign size={24} className="text-rose-400" strokeWidth={2.5} />
                     {total}
                   </span>
                </div>

              </div>

              {/* Order Button */}
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                {t.order}
              </motion.button>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <OrderModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            product={product}
            total={total}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;