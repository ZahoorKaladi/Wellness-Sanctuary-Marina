import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkle, HeartHandshake, BrainCircuit, Music, Youtube, Users } from "lucide-react";
import { Link } from "react-router-dom";

// 1. Import Language Context
import { useLanguage } from "../context/languagecontext";

const iconComponents = { Sparkle, HeartHandshake, BrainCircuit, Music, Youtube, Users };

// --- STATIC DATA (Multi-Language) ---
const SERVICES_DATA = [
  {
    id: 1,
    icon: "Sparkle",
    slug: "spiritual-healing",
    en: { title: "Spiritual Healing", description: "Align your inner energy and find peace through guided healing sessions." },
    de: { title: "Spirituelle Heilung", description: "Bringe deine innere Energie in Einklang und erfahre Frieden durch geführte Heilsitzungen." }
  },
  {
    id: 2,
    icon: "HeartHandshake",
    slug: "emotional-wellness",
    en: { title: "Emotional Balance", description: "Transform anxiety into calm and discover new joy through balance exercises." },
    de: { title: "Emotionale Balance", description: "Verwandle Angst in Gelassenheit und entdecke neue Lebensfreude durch Übungen für emotionale Balance." }
  },
  {
    id: 3,
    icon: "BrainCircuit",
    slug: "meditation-therapy",
    en: { title: "Meditation Therapy", description: "Personalized meditations to help you rest and reconnect with yourself." },
    de: { title: "Meditationstherapie", description: "Personalisierte Meditationen, die dir helfen, zur Ruhe zu kommen und dich wieder mit dir selbst zu verbinden." }
  },
  {
    id: 4,
    icon: "Music",
    slug: "audio-sessions",
    en: { title: "Healing Audio", description: "Listen to soulful audio journeys that guide you into serenity and awareness." },
    de: { title: "Heilsame Audio-Sitzungen", description: "Lausche gefühlvollen Audio-Reisen, die dich in Gelassenheit und Bewusstheit führen." }
  },
  {
    id: 5,
    icon: "Youtube",
    slug: "video-podcasts",
    en: { title: "Video Podcasts", description: "Discover deep, healing conversations that nourish the mind and soul." },
    de: { title: "Video-Podcasts", description: "Entdecke tiefgründige, heilsame Gespräche, die Geist und Seele nähren." }
  },
  {
    id: 6,
    icon: "Users",
    slug: "personal-guidance",
    en: { title: "Personal Guidance", description: "1:1 sessions helping you find clarity, alignment, and emotional grounding." },
    de: { title: "Persönliche Begleitung", description: "Einzelsitzungen, die dir helfen, Klarheit, Ausrichtung und emotionale Erdung zu finden." }
  },
];

// --- STATIC TEXT LABELS ---
const STATIC_TEXT = {
  en: {
    heading: "Healing & Therapy Services",
    subheading: "Discover healing experiences through soulful podcasts, meditations, and personal guidance.",
    ctaCard: "Learn More",
    footerHeading: "Ready for your healing journey?",
    footerBtn: "Contact Me"
  },
  de: {
    heading: "Heilungs- & Therapieangebote",
    subheading: "Entdecke heilsame Erfahrungen durch gefühlvolle Podcasts, Meditationen und persönliche Begleitung.",
    ctaCard: "Mehr erfahren",
    footerHeading: "Bereit für deine Heilungsreise?",
    footerBtn: "Kontaktiere mich"
  }
};

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  // 2. Hook into Language
  const { language } = useLanguage();
  const t = STATIC_TEXT[language];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 lg:py-24 bg-gradient-to-br from-pink-50/50 via-rose-50/30 to-white/80 font-sans"
    >
      {/* AMBIENT BLURS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <motion.div
          className="absolute top-0 left-[-10%] w-[30rem] h-[30rem] bg-rose-200/30 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-[-10%] w-[30rem] h-[30rem] bg-pink-300/20 rounded-full blur-[100px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* HEADING */}
      <motion.div
        className="relative text-center mb-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-rose-500 mb-4 drop-shadow-sm">
          {t.heading}
        </h2>
        <p className="text-lg text-rose-900/60 max-w-2xl mx-auto leading-relaxed font-light italic">
          {t.subheading}
        </p>
      </motion.div>

      {/* SERVICE CARDS GRID */}
      <motion.div
        className="
          relative z-10 
          grid grid-cols-1 
          xs:grid-cols-2 
          lg:grid-cols-3 
          gap-6 lg:gap-8 
          px-4 sm:px-6 lg:px-8 
          max-w-7xl mx-auto
        "
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
      >
        {SERVICES_DATA.map((service) => {
          const Icon = iconComponents[service.icon];
          // Get content based on current language
          const content = service[language]; 

          return (
            <motion.article
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="group relative rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-500"
              style={{
                // --- THE PINKISH CONVEX GLASS STYLE ---
                backgroundColor: 'rgba(255, 241, 242, 0.35)', 
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: `
                  inset 0 0 0 1px rgba(255, 255, 255, 0.3), 
                  inset 0 5px 15px rgba(255, 228, 230, 0.6), 
                  0 15px 35px rgba(244, 63, 94, 0.1)
                `
              }}
            >
              {/* Inner Highlight Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-rose-100/10 rounded-[2rem] pointer-events-none" />

              {/* ICON */}
              <div className="relative z-10 mb-5 p-4 rounded-full bg-gradient-to-br from-rose-100/50 to-white/50 shadow-inner border border-white/40 group-hover:scale-110 transition-transform duration-300">
                {Icon && <Icon size={32} className="text-rose-600/80 group-hover:text-rose-600 transition-colors" />}
              </div>

              {/* TITLE */}
              <h3 className="relative z-10 text-xl sm:text-2xl font-serif font-bold text-rose-900 mb-3">
                {content.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="relative z-10 text-sm sm:text-base text-rose-950/70 leading-relaxed mb-6 flex-grow">
                {content.description}
              </p>

              {/* CTA */}
              <Link
                to="/programspage"
                className="
                  relative z-10
                  inline-flex items-center justify-center
                  px-6 py-2.5 
                  rounded-full 
                  text-sm font-semibold text-rose-700
                  bg-white/40 border border-white/60
                  shadow-sm hover:shadow-md hover:bg-white/60
                  transition-all duration-300
                "
              >
                {t.ctaCard}
              </Link>

            </motion.article>
          );
        })}
      </motion.div>

      {/* BOTTOM CTA */}
      <motion.div
        className="text-center mt-16 lg:mt-24 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h3 className="text-2xl sm:text-3xl font-serif font-medium text-rose-500 mb-6">
          {t.footerHeading}
        </h3>
        <Link
          to="/contact"
          className="
            group relative inline-flex items-center justify-center
            px-8 py-3.5 rounded-full overflow-hidden
            bg-gradient-to-r from-rose-300 to-pink-400
            shadow-[0_10px_20px_rgba(244,63,94,0.2)]
            hover:shadow-[0_15px_25px_rgba(244,63,94,0.3)]
            hover:-translate-y-1 transition-all duration-300
          "
        >
          <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity" />
          <span className="relative text-white font-semibold tracking-wide text-lg">
            {t.footerBtn}
          </span>
        </Link>
      </motion.div>
    </section>
  );
};

export default ServicesSection;