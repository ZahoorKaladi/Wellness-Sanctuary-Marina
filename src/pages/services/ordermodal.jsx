// app/src/components/ordermodal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, AlertTriangle, ShoppingBag } from "lucide-react";

// 1. Import Language Tools
import { useLanguage } from "../../context/languagecontext";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    title: "Order Details",
    ordering: "You are ordering:",
    labels: {
      name: "Full Name",
      mobile: "Mobile",
      quantity: "Quantity",
      email: "Email Address",
      address: "Delivery Address"
    },
    placeholders: {
      name: "Jane Doe",
      mobile: "+123...",
      email: "jane@example.com",
      address: "Full address..."
    },
    btn: {
      confirm: "Confirm Order",
      processing: "Processing..."
    },
    success: {
      title: "Order Submitted!",
      desc: "We will be in touch shortly."
    },
    error: "Failed to submit. Please try again."
  },
  de: {
    title: "Bestelldetails",
    ordering: "Sie bestellen:",
    labels: {
      name: "Vollständiger Name",
      mobile: "Mobilnummer",
      quantity: "Menge",
      email: "E-Mail-Adresse",
      address: "Lieferadresse"
    },
    placeholders: {
      name: "Max Mustermann",
      mobile: "+49...",
      email: "max@beispiel.de",
      address: "Vollständige Adresse..."
    },
    btn: {
      confirm: "Bestellung bestätigen",
      processing: "Bearbeite..."
    },
    success: {
      title: "Bestellung abgesendet!",
      desc: "Wir werden uns in Kürze bei Ihnen melden."
    },
    error: "Fehler beim Senden. Bitte versuchen Sie es erneut."
  }
};

const OrderModal = ({ isOpen, onClose, product, total }) => {
  const { language } = useLanguage(); // Hook into Language
  const t = STATIC_TEXT[language];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    quantity: 1,
  });

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, quantity: 1 }));
      setStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/submitOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productId: product._id,
          productName: product.name,
          totalPrice: total
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStatus('success');

      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: "", email: "", mobile: "", address: "", quantity: 1 });
      }, 2500);

    } catch (err) {
      console.error("Submit error:", err.message);
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 1. Glass Backdrop */}
          <div 
            className="absolute inset-0 bg-rose-950/40 backdrop-blur-md" 
            onClick={onClose} 
          />

          {/* 2. Convex Glass Modal */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-[2rem]"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
                // THE CONVEX GLASS STYLE
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: `
                  inset 0 0 0 1px rgba(255, 255, 255, 0.5),
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 10px 20px rgba(236, 72, 153, 0.1)
                `
            }}
          >
            {/* Decorative Header Gradient */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-100/80 to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={status === 'submitting'}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/60 hover:bg-white text-rose-400 hover:text-rose-600 transition-all z-20 shadow-sm border border-white"
            >
              <X size={20} />
            </button>

            <div className="relative p-8 pt-10">
              
              {status !== 'success' ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-rose-100 rounded-xl shadow-inner">
                        <ShoppingBag size={20} className="text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-rose-950 font-['Playfair_Display']">
                      {t.title}
                    </h2>
                  </div>
                  
                  <div className="bg-white/50 p-3 rounded-xl border border-rose-100 mb-6">
                    <p className="text-xs text-rose-800/70 uppercase tracking-wider font-bold mb-1">
                      {t.ordering}
                    </p>
                    <p className="text-rose-900 font-medium truncate">{product?.name}</p>
                    <p className="text-rose-500 font-bold mt-1">${total}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-rose-400 uppercase tracking-wider ml-1">
                        {t.labels.name}
                      </label>
                      <input
                        type="text" name="name" value={formData.name}
                        onChange={handleChange} required disabled={status === 'submitting'}
                        className="w-full px-4 py-3 bg-white/60 border border-rose-100 rounded-xl text-rose-900 placeholder-rose-300/70 focus:outline-none focus:border-rose-400 focus:bg-white transition-all shadow-inner"
                        placeholder={t.placeholders.name}
                      />
                    </div>

                    {/* Mobile & Quantity Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-rose-400 uppercase tracking-wider ml-1">
                                {t.labels.mobile}
                            </label>
                            <input
                                type="tel" name="mobile" value={formData.mobile}
                                onChange={handleChange} required disabled={status === 'submitting'}
                                placeholder={t.placeholders.mobile}
                                className="w-full px-4 py-3 bg-white/60 border border-rose-100 rounded-xl text-rose-900 placeholder-rose-300/70 focus:outline-none focus:border-rose-400 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-rose-400 uppercase tracking-wider ml-1">
                                {t.labels.quantity}
                            </label>
                            <input
                                type="number" name="quantity" value={formData.quantity}
                                onChange={handleChange} min="1" required disabled={status === 'submitting'}
                                className="w-full px-4 py-3 bg-white/60 border border-rose-100 rounded-xl text-rose-900 placeholder-rose-300/70 focus:outline-none focus:border-rose-400 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-rose-400 uppercase tracking-wider ml-1">
                        {t.labels.email}
                      </label>
                      <input
                        type="email" name="email" value={formData.email}
                        onChange={handleChange} required disabled={status === 'submitting'}
                        placeholder={t.placeholders.email}
                        className="w-full px-4 py-3 bg-white/60 border border-rose-100 rounded-xl text-rose-900 placeholder-rose-300/70 focus:outline-none focus:border-rose-400 focus:bg-white transition-all shadow-inner"
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-rose-400 uppercase tracking-wider ml-1">
                        {t.labels.address}
                      </label>
                      <textarea
                        name="address" value={formData.address} onChange={handleChange}
                        required disabled={status === 'submitting'} rows="2"
                        placeholder={t.placeholders.address}
                        className="w-full px-4 py-3 bg-white/60 border border-rose-100 rounded-xl text-rose-900 placeholder-rose-300/70 focus:outline-none focus:border-rose-400 focus:bg-white transition-all shadow-inner resize-none"
                      />
                    </div>

                    {/* Error Message */}
                    {status === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2"
                      >
                        <AlertTriangle size={16} />
                        <span>{error || t.error}</span>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{t.btn.processing}</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>{t.btn.confirm}</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                // Success State
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
                  >
                    <CheckCircle className="text-green-500 w-12 h-12" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 font-['Playfair_Display']">
                    {t.success.title}
                  </h3>
                  <p className="text-rose-800/60">
                    {language === 'en' && "Thank you,"} {formData.name}. <br/> 
                    {t.success.desc}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderModal;