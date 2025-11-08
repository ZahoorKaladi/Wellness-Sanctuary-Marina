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
} from "lucide-react";
import OrderModal from "./OrderModal";
import { client, urlFor } from "../../client"; // <-- 1. IMPORT SANITY

// 2. We DELETE the static 'productData' array
// const productData = [ ... ];

// 3. This is the query to get ONE product based on the URL "slug"
const query = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  tagline,
  price,
  image,
  description,
  benefits
}`;
// The '$slug' is a variable we will pass in

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 4. Add loading state
  const [error, setError] = useState(null); // 5. Add error state
  
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true); // Set loading true when slug changes
    
    client
      .fetch(query, { slug }) // Pass the slug from the URL into the query
      .then((data) => {
        if (data) {
          setProduct(data);
        } else {
          setError("Product not found"); // Set a specific error
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product.");
        setIsLoading(false);
      });
      
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]); // This re-runs the fetch whenever the URL slug changes

  // 6. PROFESSIONAL LOADER
  // This keeps your page layout but shows a "loading" message inside
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/50 pt-24 pb-20 flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Loading Product...</p>
      </div>
    );
  }

  // 7. PROFESSIONAL ERROR / 404
  // We re-use your exact 404/Error component from the static file!
  if (error || !product) {
    return (
      <div className="font-['Playfair_Display'] bg-gradient-to-b from-pink-200 via-rose-200 to-pink-300 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-900 mb-4 tracking-tight">
            404 - Product Not Found
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-800">
            {error || "The blog post you are looking for does not exist."}
          </p>
          <Link
            to="/service" // Changed from /blog to match your other component
            className="mt-6 inline-block px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl shadow-xl font-semibold text-sm sm:text-base hover:from-pink-700 hover:to-rose-700 transition-all duration-300"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // 8. SUCCESS STATE
  // We can only calculate 'total' after we know 'product' exists
  const total = (product.price * quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        {/* Product Image (Now dynamic and safe) */}
        <div>
          <img
            src={
              product.image
                ? urlFor(product.image).width(800).url()
                : "https://via.placeholder.com/800x800?text=Missing+Image"
            }
            alt={product.name || "Product image"}
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </div>

        {/* Product Details (Now dynamic and safe) */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            {product.name || "Untitled Product"}
          </h1>
          <p className="text-gray-700 italic">
            {product.tagline || "No tagline available."}
          </p>
          <p className="text-gray-700">
            {product.description || "No description available."}
          </p>

          <ul className="space-y-2">
            {/* We check if benefits exist before mapping */}
            {product.benefits && product.benefits.length > 0 ? (
              product.benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <Heart size={16} className="text-rose-600" /> {b}
                </li>
              ))
            ) : (
              <li className="flex items-center gap-2 text-gray-500 italic">
                No benefits listed.
              </li>
            )}
          </ul>

          {/* Quantity Controls (This code is static and perfect) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 bg-rose-100 rounded-full hover:bg-rose-200 transition"
            >
              <ChevronDown size={18} />
            </button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 bg-rose-100 rounded-full hover:bg-rose-200 transition"
            >
              <ChevronUp size={18} />
            </button>
          </div>

          {/* Price and Order (This code is static and perfect) */}
          <div className="flex justify-between items-center border-t pt-4">
            <span className="text-3xl font-bold text-rose-600 flex items-center gap-1">
              <DollarSign size={24} /> {total}
            </span>
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:from-rose-700 hover:to-pink-700 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <ShoppingCart size={20} /> Order Now
            </motion.button>
          </div>

          {/* Return to Products Button (Static) */}
          <div className="pt-6">
            <Link
              to="/service" // Use the correct link to your product grid
              className="inline-flex items-center text-rose-600 hover:underline font-medium text-sm"
            >
              <ArrowLeft size={16} className="mr-1" /> Return to Products
            </Link>
          </div>
        </div>
      </div>

      {/* Order Modal (This code is static and perfect) */}
      <AnimatePresence>
        {isModalOpen && (
          <OrderModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            product={product} // Pass the dynamic product
            total={total}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;