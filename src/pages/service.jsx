// app/src/ServicePage.jsx
import React, { useState, useEffect } from "react"; // <-- 1. ADD useState, useEffect
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DollarSign, Tag, Info, ChevronRight, ShoppingBag } from "lucide-react";
import { client, urlFor } from "../client"; // <-- 2. IMPORT SANITY (Check this path, might be './client')

// 3. We DELETE the static 'productData' array
// const productData = [ ... ];

// 4. We define a query for ONLY the products
const productQuery = `*[_type == "product"] | order(_createdAt asc) {
  _id,
  name,
  tagline,
  price,
  image,
  "slug": slug.current,
  category,
  focus
}`;

const ServicePage = () => {
  // --- 5. ADD STATE FOR DYNAMIC DATA ---
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // ------------------------------------

  // --- 6. ADD useEffect TO FETCH DATA ---
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
  }, []); // Runs once on page load
  // -----------------------------------

  // --- 7. HELPER COMPONENT FOR THE GRID ---
  // This renders your dynamic grid with loading/error states,
  // while the main page layout stays static.
  const renderProductGrid = () => {
    if (isLoading) {
      return (
        <div className="text-center text-lg text-rose-800 col-span-full">
          Loading products...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg col-span-full">
          <strong>Error:</strong> Failed to load products. Please try again later.
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center text-lg text-gray-700 col-span-full">
          No products found.
        </div>
      );
    }

    // Success: Render the product cards
    return products.map((product) => (
      <motion.div
        key={product._id} // <-- Use Sanity's unique _id
        className="group bg-white border border-rose-100/40 rounded-2xl shadow-md overflow-hidden flex flex-col hover:border-rose-300 transition-all duration-300"
        whileHover={{ scale: 1.03 }}
      >
        <div className="relative h-56 sm:h-60 overflow-hidden">
          <img
            // 8. "BULLETPROOF" IMAGE LOADING (as promised)
            src={
              product.image
                ? urlFor(product.image).width(400).url()
                : "https://via.placeholder.com/400x400?text=Missing+Image"
            }
            alt={product.name || "Product image"}
            loading="lazy" // <-- LAZY LOADING (as promised)
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Only render if 'focus' exists */}
          {product.focus && (
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-rose-600/90 text-white text-[10px] rounded-full flex items-center gap-1 shadow">
              <Info size={12} /> {product.focus}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          {/* Only render if 'category' exists */}
          {product.category && (
            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-semibold uppercase w-fit mb-2 flex items-center gap-1">
              <Tag size={11} /> {product.category}
            </span>
          )}
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {/* 9. "BULLETPROOF" TEXT (as promised) */}
            {product.name || "Untitled Product"}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.tagline || "No description available."}
          </p>

          <div className="mt-auto pt-3 border-t border-rose-50 flex justify-between items-center">
            <span className="text-lg font-bold text-rose-600 flex items-center gap-0.5">
              <DollarSign size={16} /> 
              {(product.price || 0).toFixed(2)}
            </span>
            <Link
              to={`/services/${product.slug || product._id}`} // Fallback to _id
              className="py-1.5 px-3 bg-rose-300 text-white text-xs font-semibold rounded-full shadow-md hover:from-rose-700 hover:to-pink-700 flex items-center gap-1"
            >
              Details <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    ));
  };

  // --- MAIN RETURN (Your static layout is safe) ---
  return (
    <div className="font-[Inter] bg-gradient-to-br from-slate-50 via-white to-pink-50/50 pt-20 overflow-x-hidden">
      
      {/* HEADER (Your original static code) */}
      <div
        className="relative w-full py-24 text-white text-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/374754/pexels-photo-374754.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/80 via-pink-800/50 to-rose-600/60 backdrop-blur-[2px]" />
        <div className="relative w-full px-6">
          <motion.h1
            className="text-4xl md:text-6xl font-['Playfair_Display'] font-extrabold mb-3 text-white drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Holistic Health Products
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-light italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Curated by Marina — essentials for inner harmony and radiant living.
          </motion.p>
        </div>
      </div>

      {/* PRODUCT GRID (Now dynamic) */}
      <div className="w-full px-4 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* 10. We call our new dynamic render function here */}
        {renderProductGrid()}
      </div>

      {/* FOOTER NOTE (Your original static code) */}
      <div className="w-full px-6 pb-16">
        <motion.div
          className="p-6 bg-rose-500/10 border-l-4 border-rose-600 rounded-xl flex flex-col sm:flex-row items-start gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ShoppingBag size={28} className="text-rose-600 mt-1 shrink-0" />
          <div>
            <h4 className="text-lg font-bold text-gray-800">
              Shopping Note from Marina:
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              These products are hand-picked to complement your healing journey.
              For personalized guidance, book a consultation with Marina.
           </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicePage;