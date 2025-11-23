// app/src/pages/AboutPage.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Mic, Video, Heart, Sparkles, Zap, Feather, ArrowRight, BookOpen, Utensils, Radio 
} from 'lucide-react';
import { client, urlFor } from '../client'; 

// 1. Import Language Tools
import { useLanguage } from '../context/languagecontext';
import { getLocalizedText } from '../utils/sanityHelper';

// --- ICON MAPPING ---
const ICON_MAP = {
  mic: Mic,
  radio: Radio,
  food: Utensils,
  book: BookOpen,
  video: Video,
  heart: Heart,
  sparkles: Sparkles,
  zap: Zap,
  feather: Feather
};

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    welcome: "Welcome to Marina",
    heroTitle: "The Heart Behind the",
    heroHighlight: "Healing",
    btnBook: "Book a Session",
    btnOffer: "Our Offerings",
    aboutTitle: "About",
    btnProgram: "Explore Programs",
    pillarsTitle: "Pillars of Transformation",
    radioTitle: "A Credible Foundation: Broadcast & Radio",
    journeyTitle: "The Transformative Power",
    ctaTitle: "Ready to find your inner calm?",
    ctaDesc: "Book a one-on-one session with Marina and experience a personalized transformation — intentional, supportive, and carefully guided.",
    ctaBtn: "Book Your Session Now",
    loading: "Loading Story...",
    defaultPeriod: "Date TBD",
    defaultDesc: "No description available."
  },
  de: {
    welcome: "Willkommen bei Marina",
    heroTitle: "Das Herz hinter der",
    heroHighlight: "Heilung",
    btnBook: "Termin Buchen",
    btnOffer: "Unsere Angebote",
    aboutTitle: "Über",
    btnProgram: "Programme entdecken",
    pillarsTitle: "Säulen der Transformation",
    radioTitle: "Ein Fundament des Vertrauens: Radio & Broadcast",
    journeyTitle: "Die transformative Kraft",
    ctaTitle: "Bereit für innere Ruhe?",
    ctaDesc: "Buchen Sie eine persönliche Sitzung mit Marina und erleben Sie eine Transformation – achtsam, unterstützend und liebevoll geführt.",
    ctaBtn: "Jetzt Sitzung Buchen",
    loading: "Lade Geschichte...",
    defaultPeriod: "Datum offen",
    defaultDesc: "Keine Beschreibung verfügbar."
  }
};

const staticHeaderMessages = {
  en: [
    'Spiritual Master & Wellness Guide',
    'Guiding You to Inner Peace',
    'Healing Mind, Body & Soul',
  ],
  de: [
    'Spirituelle Lehrerin & Wellness-Guide',
    'Ihr Wegbegleiter zum inneren Frieden',
    'Heilung für Körper, Geist & Seele',
  ]
};

// --- QUERY (Updated for Multi-Language) ---
const query = `*[_type == "aboutPage"][0] {
  headerTaglines,
  headerTaglines_de,
  profileImage,
  profileBio,
  profileBio_de,
  feature1, feature1_de,
  feature2, feature2_de,
  feature3, feature3_de,
  feature4, feature4_de,
  radioHighlights[] {
    title, title_de,
    period,
    description, description_de,
    iconKey
  },
  journey1, journey1_de,
  journey2, journey2_de,
  journeyFinalNote, journeyFinalNote_de
}`;

// --- REUSABLE CONVEX CARD ---
const FeatureCard = ({ Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, delay }}
    whileHover={{ scale: 1.02, translateY: -4 }}
    className="group relative overflow-hidden rounded-[2rem] p-8 transition-all duration-500"
    style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: `
          inset 0 0 0 1px rgba(255, 255, 255, 0.4),
          inset 0 5px 20px rgba(255, 255, 255, 0.6),
          0 10px 30px rgba(236, 72, 153, 0.1)
        `
    }}
  >
    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-50 mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 border border-white/50">
      <Icon size={28} className="text-rose-500" strokeWidth={1.5} />
    </div>
    
    <h3 className="text-xl font-bold text-rose-900 mb-3 group-hover:text-pink-600 transition-colors">
        {title}
    </h3>
    
    <p className="text-sm text-rose-800/80 leading-relaxed font-medium">
        {desc}
    </p>

    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  </motion.div>
);

const AboutPage = () => {
  const { language } = useLanguage(); // Hook into Language
  const t = STATIC_TEXT[language];

  const [headerIndex, setHeaderIndex] = useState(0);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(query)
      .then((fetchedData) => {
        setData(fetchedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch About Page data:", err);
        setIsLoading(false);
      });
  }, []);

  // Determine Header Messages based on Language
  const headerMessages = (language === 'de' && data?.headerTaglines_de) 
    ? data.headerTaglines_de 
    : (data?.headerTaglines || staticHeaderMessages[language]);

  useEffect(() => {
    const t = setInterval(() => setHeaderIndex((i) => (i + 1) % headerMessages.length), 4800);
    return () => clearInterval(t);
  }, [headerMessages]);

  // --- HELPER: Get Feature Data safely ---
  const getFeature = (key) => {
    const feat = data?.[key];
    if (!feat) return { title: "Title", description: "Description" };
    
    // Manual localization check because feat is an object
    if (language === 'de' && data[`${key}_de`]) {
        return data[`${key}_de`];
    }
    return feat;
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50">
            <p className="text-rose-800 animate-pulse">{t.loading}</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen w-full font-sans bg-rose-50/50 text-rose-900 overflow-hidden">
      
      {/* GLOBAL AMBIENT BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-50 pointer-events-none" />
      
      {/* --- HERO SECTION --- */}
      <header className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed filter brightness-90 contrast-110"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/374754/pexels-photo-374754.jpeg?auto=format&fit=crop&q=90&w=1920&h=900')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-900/60 via-rose-800/40 to-rose-900/80 mix-blend-multiply" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="inline-block mb-6 px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md"
          >
             <span className="text-sm font-bold tracking-[0.2em] text-rose-100 uppercase">
                {t.welcome}
             </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display'] font-bold tracking-tight leading-tight text-white drop-shadow-lg"
          >
            {t.heroTitle} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-white">{t.heroHighlight}</span>
          </motion.h1>

          <div className="h-24 sm:h-32 flex items-center justify-center mt-6">
            <AnimatePresence mode="wait">
              <motion.h3
                key={headerIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                transition={{ duration: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl text-rose-100/90 font-light italic tracking-wide"
              >
                {headerMessages[headerIndex]}
              </motion.h3>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4"
          >
            <Link
              to="/sessionbooking"
              className="px-8 py-4 bg-white text-rose-900 font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300"
            >
              {t.btnBook}
            </Link>
            <Link
              to="/service"
              className="px-8 py-4 bg-white/10 border border-white/30 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300"
            >
              {t.btnOffer}
            </Link>
          </motion.div>
        </div>
      </header>

      {/* --- PROFILE + MISSION --- */}
      <section className="relative -mt-24 z-20 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="relative rounded-[3rem] p-8 sm:p-12 md:p-16 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(30px)',
                boxShadow: `
                  inset 0 0 0 1px rgba(255, 255, 255, 0.8),
                  0 30px 60px rgba(0, 0, 0, 0.1),
                  0 10px 20px rgba(236, 72, 153, 0.05)
                `
            }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-[80px] -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full blur-[80px] -z-10" />

            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative flex-shrink-0"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-pink-500 rounded-full blur-2xl opacity-40 animate-pulse" />
                <img
                  src={
                    data?.profileImage
                      ? urlFor(data.profileImage).width(500).height(500).fit('crop').url()
                      : "https://images.pexels.com/photos/6919996/pexels-photo-6919996.jpeg?auto=format&fit=crop&q=90&w=600&h=600"
                  }
                  alt="Marina"
                  className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover border-[8px] border-white shadow-2xl"
                />
              </motion.div>

              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] font-bold text-rose-950 mb-6">
                  {t.aboutTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Marina</span>
                </h2>

                <p className="text-lg text-rose-900/80 leading-relaxed font-light mb-8">
                  {getLocalizedText(data, 'profileBio', language)}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link to="/programspage" className="group flex items-center gap-2 text-rose-700 font-bold border-b-2 border-rose-200 hover:border-rose-500 transition-all pb-1">
                    {t.btnProgram} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-20 bg-gradient-to-b from-transparent to-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-rose-950 mb-3">
               {t.pillarsTitle}
            </h3>
            <div className="w-20 h-1 bg-pink-400 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              Icon={Mic} 
              title={getFeature('feature1').title}
              desc={getFeature('feature1').description}
              delay={0.1} 
            />
            <FeatureCard 
              Icon={Video} 
              title={getFeature('feature2').title}
              desc={getFeature('feature2').description}
              delay={0.2} 
            />
            <FeatureCard 
              Icon={Heart} 
              title={getFeature('feature3').title}
              desc={getFeature('feature3').description}
              delay={0.3} 
            />
            <FeatureCard 
              Icon={Sparkles} 
              title={getFeature('feature4').title}
              desc={getFeature('feature4').description}
              delay={0.4} 
            />
          </div>
        </div>
      </section>

      {/* --- RADIO CAREER --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-['Playfair_Display'] font-bold text-center text-rose-950 mb-12">
            {t.radioTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data?.radioHighlights || []).map((r, idx) => {
              // Manual localization check for array items
              const title = (language === 'de' && r.title_de) ? r.title_de : r.title;
              const desc = (language === 'de' && r.description_de) ? r.description_de : r.description;
              const IconComponent = ICON_MAP[r.iconKey] || Mic; 

              return (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="group bg-white/40 backdrop-blur-md border border-white/60 p-8 rounded-[2rem] shadow-sm hover:shadow-lg hover:shadow-pink-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-6 group-hover:bg-rose-200 transition-colors">
                     <IconComponent className="w-7 h-7 text-rose-600" strokeWidth={1.5} />
                  </div>

                  <h4 className="text-xl font-bold text-rose-900 mb-2">{title || "Untitled"}</h4>
                  
                  <div className="inline-block px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-pink-600 mb-4 tracking-wide uppercase border border-pink-100">
                      {r.period || t.defaultPeriod}
                  </div>
                  
                  <p className="text-sm text-rose-800/80 leading-relaxed font-medium">
                      {desc || t.defaultDesc}
                  </p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- JOURNEY SECTION --- */}
      <section className="py-20 bg-rose-900 text-rose-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
            <h3 className="text-3xl font-['Playfair_Display'] font-bold text-center mb-12">
                {t.journeyTitle}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                    <Zap className="w-8 h-8 text-pink-300 mb-4" strokeWidth={1.5} />
                    <h4 className="text-xl font-bold mb-3">{getFeature('journey1').title}</h4>
                    <p className="text-rose-100/80 leading-relaxed">
                        {getFeature('journey1').description}
                    </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                    <Feather className="w-8 h-8 text-pink-300 mb-4" strokeWidth={1.5} />
                    <h4 className="text-xl font-bold mb-3">{getFeature('journey2').title}</h4>
                    <p className="text-rose-100/80 leading-relaxed">
                        {getFeature('journey2').description}
                    </p>
                </div>
            </div>

            <p className="text-center mt-12 text-rose-200 italic font-light opacity-80 max-w-2xl mx-auto">
                {getLocalizedText(data, 'journeyFinalNote', language)}
            </p>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-20 text-center relative">
         <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent -z-10" />
         <h3 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-rose-950 mb-6">
             {t.ctaTitle}
         </h3>
         <p className="text-rose-800/70 max-w-xl mx-auto mb-8">
             {t.ctaDesc}
         </p>
         
         <Link 
            to="/sessionbooking"
            className="relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-full shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-1 transition-all duration-300"
         >
            {t.ctaBtn}
         </Link>
      </section>

    </div>
  );
};

export default AboutPage;