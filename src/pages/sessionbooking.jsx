// app/src/pages/SessionBookingPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flower2, Clock, Mail, Phone, MessageCircle, Instagram, Facebook,
  CalendarCheck, User, Users, AlertTriangle, Sparkles, CheckCircle2
} from "lucide-react";

// 1. Import Client & Language Tools
import { client as readClient } from '../client'; 
import { useLanguage } from "../context/languagecontext";
import { getLocalizedText } from "../utils/sanityhelper";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    tag: "Virtual Clinic",
    formTitle: "Schedule Your Session",
    infoTitle: "Quick Details",
    sessionTypes: {
      Consultation: "Initial Consultation",
      Individual: "Individual Virtual Therapy",
      Group: "Group Wellness Session"
    },
    labels: {
      name: "Full Name",
      phone: "Phone Number",
      email: "Email Address",
      type: "Select Session Type",
      date: "Preferred Date & Time"
    },
    // --- NEW LEGAL TEXT ---
    legal: {
        text: "I have read and agree to the ",
        link: "Privacy Policy (Datenschutzerklärung)"
    },
    placeholders: {
      name: "Jane Doe",
      phone: "+1 234 567 890",
      email: "jane@example.com"
    },
    btn: {
      confirm: "Confirm Booking Request",
      processing: "Processing..."
    },
    note: "* This submits a request. Final confirmation will be sent via email.",
    success: {
      title: "Booking Request Received!",
      desc: "We'll review your preference and confirm the appointment shortly."
    },
    error: {
      title: "Booking Failed.",
      desc: "Please try again or contact us directly."
    },
    infoLabels: {
      location: "Location",
      locationDesc: "Virtual Worldwide via Zoom",
      phone: "Phone Support",
      email: "Email",
      hours: "Office Hours",
      connect: "Stay Connected"
    }
  },
  de: {
    tag: "Virtuelle Klinik",
    formTitle: "Vereinbaren Sie Ihre Sitzung",
    infoTitle: "Schnelle Details",
    sessionTypes: {
      Consultation: "Erstberatung",
      Individual: "Individuelle Therapie",
      Group: "Gruppen-Wellness"
    },
    labels: {
      name: "Vollständiger Name",
      phone: "Telefonnummer",
      email: "E-Mail-Adresse",
      type: "Sitzungstyp wählen",
      date: "Wunschtermin & Zeit"
    },
    // --- NEW LEGAL TEXT (German) ---
    legal: {
        text: "Ich habe die ",
        link: "Datenschutzerklärung gelesen und akzeptiere sie"
    },
    placeholders: {
      name: "Max Mustermann",
      phone: "+49 123 456 789",
      email: "max@beispiel.de"
    },
    btn: {
      confirm: "Buchung anfragen",
      processing: "Bearbeite..."
    },
    note: "* Dies ist eine Anfrage. Die endgültige Bestätigung erfolgt per E-Mail.",
    success: {
      title: "Anfrage erhalten!",
      desc: "Wir prüfen Ihren Wunschtermin und bestätigen ihn in Kürze."
    },
    error: {
      title: "Buchung fehlgeschlagen.",
      desc: "Bitte versuchen Sie es erneut oder kontaktieren Sie uns."
    },
    infoLabels: {
      location: "Ort",
      locationDesc: "Virtuell weltweit via Zoom",
      phone: "Telefon-Support",
      email: "E-Mail",
      hours: "Öffnungszeiten",
      connect: "Verbinden"
    }
  }
};

// --- QUERY ---
const query = `*[_type == "aboutPage"][0] {
  bookingHeaderTaglines,
  bookingHeaderTaglines_de,
  contactPhone,
  contactEmail,
  officeHours,
  officeHours_de,
  socialFacebook,
  socialInstagram,
  socialWhatsApp
}`;

const staticHeaderMessages = {
  en: [
    { title: "Book Your Clarity Session", subtitle: "Begin your personalized, virtual journey toward mental and emotional well-being." },
    { title: "Reserve Your Expert Therapy Slot", subtitle: "Secure a private session with Marina to address your mind-body goals." }
  ],
  de: [
    { title: "Buchen Sie Ihre Klarheitssitzung", subtitle: "Beginnen Sie Ihre persönliche, virtuelle Reise zu mentalem und emotionalem Wohlbefinden." },
    { title: "Reservieren Sie Ihren Therapieplatz", subtitle: "Sichern Sie sich eine private Sitzung mit Marina, um Ihre Ziele zu erreichen." }
  ]
};

const therapySessionTypes = [
  { key: "Consultation", icon: <CalendarCheck size={18} /> },
  { key: "Individual", icon: <User size={18} /> },
  { key: "Group", icon: <Users size={18} /> },
];

const SessionBookingPage = () => {
  const { language } = useLanguage();
  const t = STATIC_TEXT[language];

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
  
  // --- NEW STATE: Privacy Agreement ---
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    readClient.fetch(query)
      .then((data) => setPageData(data))
      .catch((err) => console.error("Failed to fetch booking page data:", err));
  }, []);

  // Dynamic Header Logic
  const headerMessages = (language === 'de' && pageData?.bookingHeaderTaglines_de)
    ? pageData.bookingHeaderTaglines_de
    : (pageData?.bookingHeaderTaglines || staticHeaderMessages[language]);

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
      const response = await fetch('/api/submitBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      setSubmissionStatus("success");
      setFormData({ name: "", email: "", phone: "", sessionType: therapySessionTypes[0].key, dateTime: "" });
      setAgreed(false); // Reset checkbox

    } catch (error) {
      console.error("Error booking session:", error);
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
          backgroundImage: `url('https://images.pexels.com/photos/5699709/pexels-photo-5699709.jpeg?auto=format&fit=crop&q=80&w=1920&h=1080')`,
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
               <span className="text-xs font-bold tracking-widest text-rose-100 uppercase">{t.tag}</span>
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

      {/* MAIN BOOKING SECTION */}
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
            
            {/* --- FORM SECTION (Convex Glass) --- */}
            <div 
              className="w-full lg:w-8/12 p-8 sm:p-10 md:p-12 rounded-[2.5rem] mb-8 lg:mb-0"
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
              <h2 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-rose-950 mb-8 text-center">
                {t.formTitle}
              </h2>

              {/* Submission Status */}
              <AnimatePresence mode="wait">
                {submissionStatus === "success" && (
                  <motion.div
                    key="success"
                    className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center mb-8 flex items-center justify-center gap-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <CheckCircle2 size={28} className="text-green-600" />
                    <div className="text-left">
                      <p className="font-bold text-lg">{t.success.title}</p>
                      <p className="text-sm opacity-80">{t.success.desc}</p>
                    </div>
                  </motion.div>
                )}
                {submissionStatus === "error" && (
                  <motion.div
                    key="error"
                    className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl text-center mb-8 flex items-center justify-center gap-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <AlertTriangle size={28} className="text-red-600" />
                    <div className="text-left">
                      <p className="font-bold text-lg">{t.error.title}</p>
                      <p className="text-sm opacity-80">{t.error.desc}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                        <label className="block text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">
                            {t.labels.name}
                        </label>
                        <input
                            type="text" name="name"
                            value={formData.name} onChange={handleInputChange}
                            className="w-full p-4 rounded-xl bg-white/50 border border-rose-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-rose-900 placeholder-rose-300"
                            placeholder={t.placeholders.name} required
                            disabled={submissionStatus === "submitting"}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">
                            {t.labels.phone}
                        </label>
                        <input
                            type="tel" name="phone"
                            value={formData.phone} onChange={handleInputChange}
                            className="w-full p-4 rounded-xl bg-white/50 border border-rose-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-rose-900 placeholder-rose-300"
                            placeholder={t.placeholders.phone} required
                            disabled={submissionStatus === "submitting"}
                        />
                    </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                    <label className="block text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">
                        {t.labels.email}
                    </label>
                    <input
                        type="email" name="email"
                        value={formData.email} onChange={handleInputChange}
                        className="w-full p-4 rounded-xl bg-white/50 border border-rose-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-rose-900 placeholder-rose-300"
                        placeholder={t.placeholders.email} required
                        disabled={submissionStatus === "submitting"}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <label className="block text-xs font-bold text-rose-900 uppercase tracking-widest mb-3">
                        {t.labels.type}
                    </label>
                    <div className="grid sm:grid-cols-3 gap-3">
                        {therapySessionTypes.map((type) => (
                            <button
                                key={type.key} type="button"
                                onClick={() => !(submissionStatus === "submitting") && setFormData({ ...formData, sessionType: type.key })}
                                className={`p-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 border ${
                                    formData.sessionType === type.key
                                    ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white border-transparent shadow-lg scale-105"
                                    : "bg-white/60 text-rose-800 border-rose-200 hover:bg-white hover:shadow-md"
                                }`}
                                disabled={submissionStatus === "submitting"}
                            >
                                {type.icon}
                                <span className="text-center">{t.sessionTypes[type.key]}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <label className="block text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">
                        {t.labels.date}
                    </label>
                    <input
                        type="datetime-local" name="dateTime"
                        value={formData.dateTime} onChange={handleInputChange}
                        className="w-full p-4 rounded-xl bg-white/50 border border-rose-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-rose-900"
                        required
                        disabled={submissionStatus === "submitting"}
                    />
                </motion.div>

                {/* --- NEW LEGAL COMPLIANCE CHECKBOX --- */}
                <motion.div variants={itemVariants} className="flex items-start gap-3 p-4 bg-white/40 rounded-xl border border-rose-100">
                    <input 
                        type="checkbox"
                        id="privacy-agree"
                        required
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <label htmlFor="privacy-agree" className="text-sm text-rose-900 cursor-pointer">
                        {t.legal.text} 
                        <a 
                            href="/datenschutzerklaerung" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-bold underline text-rose-700 hover:text-rose-900"
                        >
                            {t.legal.link}
                        </a>
                    </label>
                </motion.div>

                <motion.button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    // DISABLED IF: Submitting OR Not Agreed
                    disabled={submissionStatus === "submitting" || !agreed}
                    whileHover={submissionStatus !== "submitting" && agreed ? { scale: 1.02 } : {}}
                    whileTap={submissionStatus !== "submitting" && agreed ? { scale: 0.98 } : {}}
                >
                    {submissionStatus === "submitting" ? (
                        <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t.btn.processing}
                        </>
                    ) : (
                        t.btn.confirm
                    )}
                </motion.button>
                
                <p className="text-xs text-rose-800/60 text-center font-medium">
                    {t.note}
                </p>
              </form>
            </div>

            {/* --- INFO SECTION (Convex Glass) --- */}
            <motion.div
              className="w-full lg:w-4/12 p-8 sm:p-10 rounded-[2.5rem] h-fit flex flex-col gap-8"
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
                <h2 className="text-3xl font-['Playfair_Display'] font-bold text-rose-950 mb-6">
                  {t.infoTitle}
                </h2>
                
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                       <Flower2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-sm mb-1">{t.infoLabels.location}</h4>
                      <p className="text-rose-800/80 text-xs">{t.infoLabels.locationDesc}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                       <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-sm mb-1">{t.infoLabels.phone}</h4>
                      <p className="text-rose-800/80 text-xs">{pageData?.contactPhone || "+92 300 1234567"}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                       <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-sm mb-1">{t.infoLabels.email}</h4>
                      <p className="text-rose-800/80 text-xs">{pageData?.contactEmail || "healing@serenity.com"}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                       <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-sm mb-1">{t.infoLabels.hours}</h4>
                      <p className="text-rose-800/80 text-xs">
                        {getLocalizedText(pageData, 'officeHours', language) || "Mon-Fri: 9 AM - 6 PM"}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-white/40">
                <h4 className="font-bold text-rose-900 text-sm mb-4">{t.infoLabels.connect}</h4>
                <div className="flex gap-4">
                  <a href={pageData?.socialFacebook || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-rose-700 hover:bg-white hover:text-rose-500 transition-all shadow-sm">
                    <Facebook size={20} />
                  </a>
                  <a href={pageData?.socialInstagram || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-rose-700 hover:bg-white hover:text-rose-500 transition-all shadow-sm">
                    <Instagram size={20} />
                  </a>
                  <a href={pageData?.socialWhatsApp || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-green-700 hover:bg-white hover:text-green-500 transition-all shadow-sm">
                    <MessageCircle size={20} />
                  </a>
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