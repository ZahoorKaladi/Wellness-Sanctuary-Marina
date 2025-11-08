// app/src/pages/ContactUs.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, AlertTriangle } from "lucide-react";
// 1. We ONLY import the 'readClient'
import { client as readClient } from '../client'; 
// 2. We DELETE the 'createClient' and the 'writeClient' block.
// The secret token is GONE from this file.

// This query is now correct because you made a separate 'contactPage' schema
const query = `*[_type == "contactPage"][0] {
  headerTaglines,
  address,
  phone,
  email,
  hours
}`;

// Static fallbacks for safety
const staticHeaderMessages = [
  {
    title: "We’d Love to Hear From You",
    subtitle: "Reach out with questions, feedback, or just to say hi!",
  },
  {
    title: "Get in Touch Anytime",
    subtitle: "Our team is here to support you around the clock.",
  },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState("initial");
  const [submitError, setSubmitError] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [headerIndex, setHeaderIndex] = useState(0);

  // Fetch dynamic content (this part is perfect)
  useEffect(() => {
    readClient.fetch(query)
      .then((data) => setPageData(data))
      .catch((err) => console.error("Failed to fetch contact page data:", err));
  }, []);

  const headerMessages = pageData?.headerTaglines || staticHeaderMessages;

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

  // --- 3. THIS IS THE NEW, SECURE handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus("submitting");
    setSubmitError(null);

    try {
      // This securely calls your new '/api/submitContact' file
      const response = await fetch('/api/submitContact', {
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

      // It worked!
      setSubmissionStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitError(error.message || "An unknown error occurred.");
      setSubmissionStatus("error");
    }
  };

  // --- (ALL YOUR VARIANTS AND JSX/DESIGN CODE IS 100% UNCHANGED) ---
  const containerVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } } };
  const headerTextVariants = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } }, exit: { opacity: 0, y: -30, transition: { duration: 0.7, ease: "easeInOut" } } };
  const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } };

  return (
    <div className="font-['Playfair_Display'] bg-gradient-to-b from-pink-200 via-rose-200 to-pink-300 min-h-screen w-full">
      {/* HEADER SECTION */}
      <div
        className="relative w-full py-16 sm:py-20 md:py-28 lg:py-36 text-white text-center overflow-hidden bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/7598545/pexels-photo-7598545.jpeg?auto=format&fit=crop&q=80&w=1470')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-rose-700/60 to-rose-900/40 backdrop-blur-sm"></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={headerIndex}
            className="relative z-10 px-4"
            variants={headerTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 drop-shadow-2xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-300">{headerMessages[headerIndex].title}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light italic text-white/90 max-w-xl md:max-w-2xl mx-auto">
              {headerMessages[headerIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="h-6 sm:h-8 md:h-10"></div>
      </div>

      {/* CONTACT SECTION */}
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
            <div className="font-['Playfair_Display'] w-full lg:w-1/2 p-6 sm:p-8 md:p-10 bg-white/25 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 mb-6 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-900 mb-8 text-center tracking-tight">
                Send Us a Message
              </h2>

              {/* Submission Status Messages */}
              <AnimatePresence>
                {submissionStatus === "success" && (
                  <motion.div
                    className="bg-green-100/90 border border-green-500/50 text-green-800 p-4 rounded-xl text-center mb-6 shadow-md"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <p className="font-semibold text-sm sm:text-base">Message Sent Successfully!</p>
                    <p className="text-xs sm:text-sm">We’ll get back to you soon.</p>
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
                      <p className="font-semibold text-sm sm:text-base">Something Went Wrong.</p>
                      <p className="text-xs sm:text-sm">{submitError || "Please try again later."}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Form */}
              {(submissionStatus === "initial" || submissionStatus === "error" || submissionStatus === "submitting") && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-semibold text-rose-800 tracking-wide">Full Name</label>
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleInputChange}
                      className="mt-2 block w-full p-3 sm:p-4 border border-rose-300/80 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-rose-600 bg-white/90 text-sm shadow-md transition-all duration-300 hover:border-rose-500 disabled:opacity-50"
                      placeholder="Enter your full name" required
                      disabled={submissionStatus === "submitting"}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-semibold text-rose-800 tracking-wide">Email Address</label>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleInputChange}
                      className="mt-2 block w-full p-3 sm:p-4 border border-rose-300/80 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-rose-600 bg-white/90 text-sm shadow-md transition-all duration-300 hover:border-rose-500 disabled:opacity-50"
                      placeholder="Enter your email" required
                      disabled={submissionStatus === "submitting"}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="subject" className="block text-sm font-semibold text-rose-800 tracking-wide">Subject</label>
                    <input
                      type="text" id="subject" name="subject"
                      value={formData.subject} onChange={handleInputChange}
                      className="mt-2 block w-full p-3 sm:p-4 border border-rose-300/80 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-rose-600 bg-white/90 text-sm shadow-md transition-all duration-300 hover:border-rose-500 disabled:opacity-50"
                      placeholder="Enter the subject" required
                      disabled={submissionStatus === "submitting"}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="block text-sm font-semibold text-rose-800 tracking-wide">Message</label>
                    <textarea
                      id="message" name="message"
                      value={formData.message} onChange={handleInputChange}
                      rows="5"
                      className="mt-2 block w-full p-3 sm:p-4 border border-rose-300/80 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-rose-600 bg-white/90 text-sm shadow-md transition-all duration-300 hover:border-rose-500 disabled:opacity-50"
                      placeholder="Enter your message" required
                      disabled={submissionStatus === "submitting"}
                    ></textarea>
                  </motion.div>
                  <motion.button
                    type="submit"
                    className="w-full py-3 sm:py-4 px-6 bg-rose-600 text-white rounded-xl shadow-xl font-semibold hover:bg-rose-700 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 flex items-center justify-center gap-2"
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
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>
                </form>
              )}
            </div>

            {/* CONTACT INFO SECTION */}
            <motion.div
              className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 bg-white/25 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-900 mb-6 tracking-tight">
                Contact Information
              </h2>
              <ul className="space-y-5">
                <motion.li className="flex items-center gap-3" variants={itemVariants}>
                  <MapPin size={24} className="text-rose-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm">Address</h4>
                    <p className="text-rose-800 text-xs sm:text-sm">
                      {pageData?.address || "123 Healthcare Road, Karachi, Sindh, Pakistan"}
                    </p>
                  </div>
                </motion.li>
                <motion.li className="flex items-center gap-3" variants={itemVariants}>
                  <Phone size={24} className="text-rose-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm">Phone</h4>
                    <p className="text-rose-800 text-xs sm:text-sm">
                      {pageData?.phone || "+92 21 1234567"}
                    </p>
                  </div>
                </motion.li>
                <motion.li className="flex items-center gap-3" variants={itemVariants}>
                  <Mail size={24} className="text-rose-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm">Email</h4>
                    <p className="text-rose-800 text-xs sm:text-sm">
                      {pageData?.email || "info@marina.org"}
                    </p>
                  </div>
                </motion.li>
                <motion.li className="flex items-center gap-3" variants={itemVariants}>
                  <Clock size={24} className="text-rose-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm">Working Hours</h4>
                    <p className="text-rose-800 text-xs sm:text-sm">
                      {pageData?.hours || "24/7 Emergency, OPD: 9 AM - 5 PM"}
                    </p>
                  </div>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;