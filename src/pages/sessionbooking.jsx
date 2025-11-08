// app/src/pages/SessionBookingPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Flower2, Clock, Mail, Phone, MessageCircle, Instagram, Facebook,
  CalendarCheck, User, Users, AlertTriangle,
} from "lucide-react";

// 1. We ONLY import the 'readClient'. The insecure 'writeClient' is GONE.
import { client as readClient } from '../client'; 

// 2. The query is correct. It fetches from 'aboutPage'.
const query = `*[_type == "aboutPage"][0] {
  bookingHeaderTaglines,
  contactPhone,
  contactEmail,
  officeHours,
  socialFacebook,
  socialInstagram,
  socialWhatsApp
}`;

// Static fallbacks for safety
const staticHeaderMessages = [
  {
    title: "Book Your Clarity Session",
    subtitle: "Begin your personalized, virtual journey toward mental and emotional well-being.",
  },
  {
    title: "Reserve Your Expert Therapy Slot",
    subtitle: "Secure a private session with Marina to address your mind-body goals.",
  },
];

// Static session types
const therapySessionTypes = [
  { key: "Consultation", label: "Initial Consultation", icon: <CalendarCheck size={18} /> },
  { key: "Individual", label: "Individual Virtual Therapy", icon: <User size={18} /> },
  { key: "Group", label: "Group Wellness Session", icon: <Users size={18} /> },
];

const SessionBookingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sessionType: therapySessionTypes[0].key,
    dateTime: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState("initial");
  const [submitError, setSubmitError] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [headerIndex, setHeaderIndex] = useState(0);

  // --- This section is perfect ---
  useEffect(() => {
    readClient.fetch(query)
      .then((data) => setPageData(data))
      .catch((err) => console.error("Failed to fetch booking page data:", err));
  }, []);
  const headerMessages = pageData?.bookingHeaderTaglines || staticHeaderMessages;
  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderIndex((prevIndex) => (prevIndex + 1) % headerMessages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [headerMessages]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // ---------------------------------

  // --- 3. THIS IS THE NEW, SECURE handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus("submitting");
    setSubmitError(null);

    try {
      // This securely calls your new '/api/submitBooking' file
      const response = await fetch('/api/submitBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        // If the server (your API file) has an error
        throw new Error(data.message || 'Something went wrong');
      }

      setSubmissionStatus("success");
      setFormData({ name: "", email: "", phone: "", sessionType: therapySessionTypes[0].key, dateTime: "" });

    } catch (error) {
      console.error("Error booking session:", error);
      setSubmitError(error.message || "An unknown error occurred.");
      setSubmissionStatus("error");
    }
  };

  // --- (ALL YOUR VARIANTS AND JSX/DESIGN CODE IS 100% UNCHANGED) ---
  const containerVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } } };
  const headerTextVariants = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } }, exit: { opacity: 0, y: -30, transition: { duration: 0.7, ease: "easeInOut" } } };
  const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } };
  const primaryGradient = "bg-gradient-to-r from-rose-600 to-pink-600";
  const primaryHoverGradient = "hover:from-pink-700 hover:to-rose-700";
  const accentText = "text-rose-600";
  const accentBorder = "border-rose-300/80";
  const cardBackground = "bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30";

  return (
    <div className="font-['Inter'] bg-gradient-to-b from-rose-50 via-white to-pink-50/50 min-h-screen w-full">
      {/* HEADER SECTION */}
      <div
        className="relative w-full py-20 sm:py-24 md:py-32 lg:py-40 text-white text-center overflow-hidden bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/5699709/pexels-photo-5699709.jpeg?auto=format&fit=crop&q=80&w=1920&h=1080')`,
        }}
      >
        <div className="absolute inset-0 bg-rose-900/40 backdrop-blur-sm"></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={headerIndex}
            className="relative z-10 px-4"
            variants={headerTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-extrabold tracking-tight mb-3 drop-shadow-2xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-300">{headerMessages[headerIndex].title}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light italic text-white/90 max-w-2xl mx-auto px-4">
              {headerMessages[headerIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* MAIN BOOKING SECTION */}
      <section className="py-12 sm:py-16 md:py-20 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            className="w-full lg:flex lg:gap-8 lg:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {/* FORM SECTION */}
            <div className={`w-full lg:w-2/3 p-6 sm:p-8 md:p-10 ${cardBackground} mb-6 lg:mb-0`}>
              <h2 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-rose-900 mb-8 text-center tracking-tight">
                Schedule Your Virtual Session
              </h2>

              {/* Submission Status Messages */}
              <AnimatePresence>
                {submissionStatus === "success" && (
                  <motion.div
                    className="bg-green-100/90 border border-green-500/50 text-green-800 p-4 rounded-xl text-center mb-6 shadow-md flex items-center justify-center gap-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <CalendarCheck size={24} className="text-green-600" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Booking Request Received!</p>
                      <p className="text-xs sm:text-sm">We'll review your preference and confirm the appointment shortly.</p>
                    </div>
                  </motion.div>
                )}
                {submissionStatus === "error" && (
                  <motion.div
                    className="bg-red-100/90 border border-red-500/50 text-red-800 p-4 rounded-xl text-center mb-6 shadow-md flex items-center gap-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <AlertTriangle size={24} className="text-red-600" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Booking Failed.</p>
                      <p className="text-xs sm:text-sm">{submitError || "Please try again or contact us directly."}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className="block text-sm font-semibold text-rose-800 tracking-wide">Full Name</label>
                  <input
                    type="text" id="name" name="name"
                    value={formData.name} onChange={handleInputChange}
                    className={`mt-2 block w-full p-3 sm:p-4 border ${accentBorder} rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-rose-600 bg-white/90 text-sm shadow-md transition-all duration-300 hover:border-rose-500 disabled:opacity-50`}
                    placeholder="Enter your full name" required
                    disabled={submissionStatus === "submitting"}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className="block text-sm font-semibold text-rose-800 tracking-wide">Email Address</label>
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleInputChange}
                    className={`mt-2 block w-full p-3 sm:p-4 border ${accentBorder} rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-rose-600 bg-white/90 text-sm shadow-md transition-all duration-300 hover:border-rose-500 disabled:opacity-50`}
                    placeholder="Enter your email" required
                    disabled={submissionStatus === "submitting"}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label htmlFor="phone" className="block text-sm font-semibold text-rose-800 tracking-wide">Phone Number</label>
                  <input
                    type="tel" id="phone" name="phone"
                    value={formData.phone} onChange={handleInputChange}
                    className={`mt-2 block w-full p-3 sm:p-4 border ${accentBorder} rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-rose-600 bg-white/90 text-sm shadow-md transition-all duration-300 hover:border-rose-500 disabled:opacity-50`}
                    placeholder="Enter your phone number (for contact)" required
                    disabled={submissionStatus === "submitting"}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-rose-800 tracking-wide">Select Session Type</label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {therapySessionTypes.map((type) => (
                      <motion.button
                        key={type.key} type="button"
                        onClick={() => ! (submissionStatus === "submitting") && setFormData({ ...formData, sessionType: type.key })}
                        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium text-sm transition-all shadow-md flex items-center gap-2 ${
                          formData.sessionType === type.key
                            ? `${primaryGradient} text-white`
                            : "bg-white/80 text-rose-800 hover:bg-rose-100/90 border border-rose-300/80 hover:shadow-lg"
                        } ${submissionStatus === "submitting" ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileHover={submissionStatus !== "submitting" ? { scale: 1.05 } : {}}
                        whileTap={submissionStatus !== "submitting" ? { scale: 0.95 } : {}}
                      >
                        {type.icon}
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label htmlFor="dateTime" className="block text-sm font-semibold text-rose-800 tracking-wide">Preferred Date & Time</label>
                  <input
                    type="datetime-local" id="dateTime" name="dateTime"
                    value={formData.dateTime} onChange={handleInputChange}
                    className={`mt-2 block w-full p-3 sm:p-4 border ${accentBorder} rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-rose-600 bg-white/90 text-sm shadow-md transition-all duration-300 hover:border-rose-500 disabled:opacity-50`}
                    required
                    disabled={submissionStatus === "submitting"}
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  className={`w-full py-3 sm:py-4 px-6 ${primaryGradient} text-white rounded-xl shadow-xl font-semibold ${primaryHoverGradient} transition-all duration-300 text-sm sm:text-base disabled:opacity-50 flex items-center justify-center gap-2`}
                  disabled={submissionStatus === "submitting"}
                  variants={itemVariants}
                  whileHover={submissionStatus !== "submitting" ? { scale: 1.05 } : {}}
                  whileTap={submissionStatus !== "submitting" ? { scale: 0.95 } : {}}
                >
                  {submissionStatus === "submitting" ? (
                    <>
                      <motion.div 
                        className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"
                        role="status"
                        aria-label="Loading..."
                      />
                      Sending Request...
                    </>
                  ) : (
                    "Confirm Booking Request"
                  )}
                </motion.button>
                <p className="text-xs text-rose-800 text-center font-medium mt-3">
                   This submits a request. Final confirmation will be sent via email.
                </p>
              </form>
            </div>

            {/* CONTACT INFO SECTION (Now dynamic) */}
            <motion.div
              className={`w-full lg:w-1/3 p-6 sm:p-8 md:p-10 ${cardBackground}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-rose-900 mb-6 tracking-tight">
                Quick Contact & Details
              </h2>
              <ul className="space-y-5">
                <motion.li className="flex items-start gap-3" variants={itemVariants}>
                  <Flower2 size={22} className={`${accentText} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm">Virtual Location</h4>
                    <p className="text-rose-800 text-xs sm:text-sm">Available Worldwide via Zoom/Platform</p>
                  </div>
                </motion.li>
                <motion.li className="flex items-start gap-3" variants={itemVariants}>
                  <Phone size={22} className={`${accentText} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm">Phone Support (Urgent)</h4>
                    <p className="text-rose-800 text-xs sm:text-sm">{pageData?.contactPhone || "+92 300 1234567"}</p>
                  </div>
                </motion.li>
                <motion.li className="flex items-start gap-3" variants={itemVariants}>
                  <Mail size={22} className={`${accentText} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm">General Inquiries</h4>
                    <p className="text-rose-800 text-xs sm:text-sm">{pageData?.contactEmail || "healing@serenity.com"}</p>
                  </div>
                </motion.li>
                <motion.li className="flex items-start gap-3" variants={itemVariants}>
                  <Clock size={22} className={`${accentText} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm">Office Hours</h4>
                    <p className="text-rose-800 text-xs sm:text-sm">{pageData?.officeHours || "Mon-Fri: 9 AM - 6 PM"}</p>
                  </div>
                </motion.li>
              </ul>

              <div className="mt-8 pt-4 border-t border-rose-300/50">
                <h4 className="font-semibold text-rose-900 mb-3 text-sm">Stay Connected</h4>
                <div className="flex gap-4 text-rose-800">
                  <motion.a
                    href={pageData?.socialFacebook || "#"}
                    target="_blank" rel="noopener noreferrer"
                    className="hover:text-rose-600 transition-colors"
                    aria-label="Facebook"
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                  >
                    <Facebook size={24} />
                  </motion.a>
                  <motion.a
                    href={pageData?.socialInstagram || "#"}
                    target="_blank" rel="noopener noreferrer"
                    className="hover:text-rose-600 transition-colors"
                    aria-label="Instagram"
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                  >
                    <Instagram size={24} />
                  </motion.a>
                  <motion.a
                    href={pageData?.socialWhatsApp || "#"}
                    target="_blank" rel="noopener noreferrer"
                    className="hover:text-green-600 transition-colors"
                    aria-label="WhatsApp"
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                  >
                    <MessageCircle size={24} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SessionBookingPage;