// app/src/pages/ContactUs.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, AlertTriangle, Send, Sparkles } from "lucide-react";
import { client as readClient } from '../client'; 

// 1. Import Language Tools
import { useLanguage } from "../context/languagecontext";
import { getLocalizedText } from "../utils/sanityHelper";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    title: "Send Us a Message",
    contactInfo: "Contact Info",
    labels: {
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message"
    },
    placeholders: {
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "How can we help?",
      message: "Tell us about your thoughts..."
    },
    btn: {
      send: "Send Message",
      sending: "Sending..."
    },
    success: {
      title: "Message Sent Successfully!",
      desc: "We’ll get back to you soon."
    },
    error: "Something Went Wrong.",
    info: {
      address: "Address",
      phone: "Phone",
      email: "Email",
      hours: "Working Hours"
    }
  },
  de: {
    title: "Senden Sie uns eine Nachricht",
    contactInfo: "Kontaktinformationen",
    labels: {
      name: "Vollständiger Name",
      email: "E-Mail-Adresse",
      subject: "Betreff",
      message: "Nachricht"
    },
    placeholders: {
      name: "Max Mustermann",
      email: "max@beispiel.de",
      subject: "Wie können wir helfen?",
      message: "Erzählen Sie uns von Ihren Gedanken..."
    },
    btn: {
      send: "Nachricht Senden",
      sending: "Senden..."
    },
    success: {
      title: "Nachricht erfolgreich gesendet!",
      desc: "Wir melden uns in Kürze bei Ihnen."
    },
    error: "Etwas ist schief gelaufen.",
    info: {
      address: "Adresse",
      phone: "Telefon",
      email: "E-Mail",
      hours: "Öffnungszeiten"
    }
  }
};

// --- QUERY ---
const query = `*[_type == "contactPage"][0] {
  headerTaglines,
  headerTaglines_de,
  address,
  phone,
  email,
  hours,
  hours_de
}`;

const staticHeaderMessages = {
  en: [
    { title: "We’d Love to Hear From You", subtitle: "Reach out with questions, feedback, or just to say hi!" },
    { title: "Get in Touch Anytime", subtitle: "Our team is here to support you around the clock." }
  ],
  de: [
    { title: "Wir würden gerne von Ihnen hören", subtitle: "Kontaktieren Sie uns bei Fragen, Feedback oder einfach nur so!" },
    { title: "Jederzeit erreichbar", subtitle: "Unser Team ist rund um die Uhr für Sie da." }
  ]
};

const ContactUs = () => {
  const { language } = useLanguage(); // Hook into Language
  const t = STATIC_TEXT[language];

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

  useEffect(() => {
    readClient.fetch(query)
      .then((data) => setPageData(data))
      .catch((err) => console.error("Failed to fetch contact page data:", err));
  }, []);

  // Use dynamic headers based on language
  const headerMessages = (language === 'de' && pageData?.headerTaglines_de)
    ? pageData.headerTaglines_de
    : (pageData?.headerTaglines || staticHeaderMessages[language]);

  const mapAddress = pageData?.address || "Karachi, Sindh, Pakistan";

  useEffect(() => {
    // Reset index on language change
    setHeaderIndex(0);
  }, [language]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus("submitting");
    setSubmitError(null);

    try {
      const response = await fetch('/api/submitContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      setSubmissionStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitError(error.message || "An unknown error occurred.");
      setSubmissionStatus("error");
    }
  };

  const containerVariants = { 
    hidden: { opacity: 0, y: 50 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } } 
  };
  
  const itemVariants = { 
    hidden: { opacity: 0, x: -20 }, 
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } 
  };

  return (
    <div className="font-sans bg-rose-50/50 min-h-screen w-full overflow-hidden">
      
      {/* GLOBAL AMBIENT BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-50 pointer-events-none" />
      
      {/* HEADER SECTION */}
      <div
        className="relative w-full min-h-[60vh] flex items-center justify-center text-white text-center overflow-hidden bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/7598545/pexels-photo-7598545.jpeg?auto=format&fit=crop&q=80&w=1470')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-rose-900/60 via-rose-800/40 to-rose-900/80 mix-blend-multiply backdrop-blur-[2px]" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={headerIndex}
            className="relative z-10 px-4 max-w-4xl"
            initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8 } }}
            exit={{ opacity: 0, y: -30, filter: "blur(5px)", transition: { duration: 0.8 } }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6">
               <Sparkles size={14} className="text-rose-200" />
               <span className="text-xs font-bold tracking-widest text-rose-100 uppercase">
                 {language === 'de' ? 'Kontakt' : 'Contact Us'}
               </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-extrabold tracking-tight mb-4 drop-shadow-lg leading-tight">
              {headerMessages[headerIndex].title}
            </h1>
            <p className="text-lg sm:text-xl font-light italic text-rose-100/90 max-w-2xl mx-auto">
              {headerMessages[headerIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CONTACT SECTION */}
      <section className="relative py-20 lg:py-28 w-full -mt-20 z-20">
        
        {/* Ambient Blobs */}
        <div className="absolute top-20 left-0 w-[40rem] h-[40rem] bg-pink-300/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-purple-300/20 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            className="w-full lg:flex lg:gap-10 lg:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            
            {/* --- FORM SECTION --- */}
            <div 
              className="w-full lg:w-7/12 p-8 sm:p-10 md:p-12 rounded-[2.5rem] mb-8 lg:mb-0"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: `
                  inset 0 0 0 1px rgba(255, 255, 255, 0.5),
                  0 20px 50px rgba(236, 72, 153, 0.15)
                `
              }}
            >
              <h2 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-rose-950 mb-8 tracking-tight text-center">
                {t.title}
              </h2>

              <AnimatePresence mode="wait">
                {submissionStatus === "success" && (
                  <motion.div
                    key="success"
                    className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center mb-8 shadow-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <p className="font-bold text-lg mb-1">{t.success.title}</p>
                    <p className="text-sm opacity-80">{t.success.desc}</p>
                  </motion.div>
                )}
                
                {submissionStatus === "error" && (
                  <motion.div
                    key="error"
                    className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl text-center mb-8 shadow-sm flex flex-col items-center gap-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <AlertTriangle size={32} className="text-red-500" />
                    <div>
                      <p className="font-bold text-lg">{t.error}</p>
                      <p className="text-sm opacity-80">{submitError || "Please try again later."}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {(submissionStatus === "initial" || submissionStatus === "error" || submissionStatus === "submitting") && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <label htmlFor="name" className="block text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">
                          {t.labels.name}
                        </label>
                        <input
                          type="text" id="name" name="name"
                          value={formData.name} onChange={handleInputChange}
                          className="w-full p-4 rounded-xl bg-white/50 border border-rose-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-rose-900 placeholder-rose-300"
                          placeholder={t.placeholders.name} required
                          disabled={submissionStatus === "submitting"}
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <label htmlFor="email" className="block text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">
                          {t.labels.email}
                        </label>
                        <input
                          type="email" id="email" name="email"
                          value={formData.email} onChange={handleInputChange}
                          className="w-full p-4 rounded-xl bg-white/50 border border-rose-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-rose-900 placeholder-rose-300"
                          placeholder={t.placeholders.email} required
                          disabled={submissionStatus === "submitting"}
                        />
                      </motion.div>
                  </div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="subject" className="block text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">
                      {t.labels.subject}
                    </label>
                    <input
                      type="text" id="subject" name="subject"
                      value={formData.subject} onChange={handleInputChange}
                      className="w-full p-4 rounded-xl bg-white/50 border border-rose-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-rose-900 placeholder-rose-300"
                      placeholder={t.placeholders.subject} required
                      disabled={submissionStatus === "submitting"}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="block text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">
                      {t.labels.message}
                    </label>
                    <textarea
                      id="message" name="message"
                      value={formData.message} onChange={handleInputChange}
                      rows="5"
                      className="w-full p-4 rounded-xl bg-white/50 border border-rose-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-rose-900 placeholder-rose-300 resize-none"
                      placeholder={t.placeholders.message} required
                      disabled={submissionStatus === "submitting"}
                    ></textarea>
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={submissionStatus === "submitting"}
                    variants={itemVariants}
                    whileHover={submissionStatus !== "submitting" ? { scale: 1.02 } : {}}
                    whileTap={submissionStatus !== "submitting" ? { scale: 0.98 } : {}}
                  >
                    {submissionStatus === "submitting" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t.btn.sending}
                      </>
                    ) : (
                      <>
                        {t.btn.send} <Send size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>

            {/* --- INFO SECTION --- */}
            <motion.div
              className="w-full lg:w-5/12 p-8 sm:p-10 rounded-[2.5rem] h-fit flex flex-col gap-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: `
                  inset 0 0 0 1px rgba(255, 255, 255, 0.4),
                  0 15px 35px rgba(236, 72, 153, 0.1)
                `
              }}
            >
              <div>
                <h2 className="text-3xl font-['Playfair_Display'] font-bold text-rose-950 mb-8">
                  {t.contactInfo}
                </h2>
                
                <ul className="space-y-8">
                  <motion.li className="flex items-start gap-4" variants={itemVariants}>
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                       <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-lg mb-1">{t.info.address}</h4>
                      <p className="text-rose-800/80 text-sm leading-relaxed">
                        {pageData?.address || "123 Healthcare Road, Karachi, Sindh, Pakistan"}
                      </p>
                    </div>
                  </motion.li>

                  <motion.li className="flex items-start gap-4" variants={itemVariants}>
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                       <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-lg mb-1">{t.info.phone}</h4>
                      <p className="text-rose-800/80 text-sm">
                        {pageData?.phone || "+92 21 1234567"}
                      </p>
                    </div>
                  </motion.li>

                  <motion.li className="flex items-start gap-4" variants={itemVariants}>
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                       <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-lg mb-1">{t.info.email}</h4>
                      <p className="text-rose-800/80 text-sm">
                        {pageData?.email || "info@marina.org"}
                      </p>
                    </div>
                  </motion.li>

                  <motion.li className="flex items-start gap-4" variants={itemVariants}>
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                       <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-lg mb-1">{t.info.hours}</h4>
                      <p className="text-rose-800/80 text-sm leading-relaxed">
                        {getLocalizedText(pageData, 'hours', language) || "24/7 Emergency, OPD: 9 AM - 5 PM"}
                      </p>
                    </div>
                  </motion.li>
                </ul>
              </div>

              {/* Live Google Map */}
              <div className="w-full h-56 rounded-3xl overflow-hidden border border-white/50 shadow-inner relative group">
                 <div className="absolute inset-0 bg-rose-900/10 pointer-events-none z-10 group-hover:opacity-0 transition-opacity duration-500" />
                 <iframe
                   title="Location Map"
                   width="100%"
                   height="100%"
                   frameBorder="0"
                   scrolling="no"
                   marginHeight="0"
                   marginWidth="0"
                   style={{ filter: 'grayscale(10%) contrast(1.1)' }}
                   src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                 />
              </div>

            </motion.div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;