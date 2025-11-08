// app/src/OrderModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, AlertTriangle } from "lucide-react";

// 1. We DELETE the 'createClient' import and the insecure 'client' block.
// The secret token is now GONE from this file.

const OrderModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    quantity: 1,
  });

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. THIS IS THE NEW, SECURE handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      // This securely calls your new '/api/submitOrder' file
      const response = await fetch('/api/submitOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productId: product._id, // Send the product's Sanity ID
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // If the server (your API file) has an error
        throw new Error(data.message || 'Something went wrong');
      }

      // It worked! Show the success message
      setStatus('success');

      // Your original logic to close the modal after a delay
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: "", email: "", mobile: "", address: "", quantity: 1 });
      }, 1500);

    } catch (err) {
      console.error("Submit error:", err.message);
      setStatus('error');
      setError(err.message);
    }
  };

  // --- (The rest of your component's JSX is 100% UNCHANGED) ---
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 18 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={status === 'submitting'}
              className="absolute top-3 right-3 text-gray-500 hover:text-rose-600 transition"
            >
              <X size={22} />
            </button>

            {status !== 'success' ? (
              <>
                <h2 className="text-2xl font-semibold text-rose-700 mb-2">
                  Order {product?.name}
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  Please fill out your details below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Product Name (readonly) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={product?.name || ""}
                      readOnly
                      className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleChange} required disabled={status === 'submitting'}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-gray-100"
                    />
                  </div>
                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel" name="mobile" value={formData.mobile}
                      onChange={handleChange} required disabled={status === 'submitting'}
                      placeholder="+92XXXXXXXXXX"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-gray-100"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email" name="email" value={formData.email}
                      onChange={handleChange} required disabled={status === 'submitting'}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-gray-100"
                    />
                  </div>
                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address" value={formData.address} onChange={handleChange}
                      required disabled={status === 'submitting'} rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-gray-100"
                    />
                  </div>
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number" name="quantity" value={formData.quantity}
                      onChange={handleChange} min="1" required disabled={status === 'submitting'}
                      className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-gray-100"
                    />
                  </div>

                  {/* Error Message Display */}
                  {status === 'error' && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                      <AlertTriangle size={18} />
                      <p>
                        <strong>Error:</strong> {error || "Failed to submit. Please try again."}
                      </p>
                    </div>
                  )}

                  {/* Submit Button (with loader) */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-2.5 rounded-lg shadow-md hover:from-rose-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {status === 'submitting' ? (
                      <>
                        <motion.div 
                          className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"
                          role="status"
                          aria-label="Loading..."
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Order
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              // Success Message
              <div className="flex flex-col items-center py-10">
                <CheckCircle className="text-green-500" size={56} />
                <h3 className="text-lg font-semibold text-gray-800 mt-3">
                  Order Submitted!
                </h3>
                <p className="text-sm text-gray-500 text-center mt-1">
                  We’ll contact you soon to confirm your order.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderModal;