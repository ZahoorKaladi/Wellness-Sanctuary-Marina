// app/src/components/RadioSection.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic2, BookOpen, Utensils, Globe2, Radio, Sparkles } from "lucide-react";
import { client, urlFor } from "../../client"; 

// 1. Import Language Tools
import { useLanguage } from "../../context/languagecontext";
import { getLocalizedText } from "../../utils/sanityhelper";

// --- ICON MAPPING ---
const ICON_MAP = {
  globe: Globe2,
  utensils: Utensils,
  book: BookOpen,
  mic: Mic2,
  radio: Radio,
};

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    subtitle: "On Air Since 2009",
    defaultTitle: "Campus & City Radio 94.4 St. Pölten",
    defaultDesc: "Since 2009, Marina has been a voice of compassion and awareness, creating thoughtful programs that connect culture, language, and consciousness.",
    defaultFooter: "Today, Marina continues to bring her warmth and depth to the airwaves, turning radio into a sanctuary of empathy.",
    loading: "Loading History...",
  },
  de: {
    subtitle: "Auf Sendung seit 2009",
    defaultTitle: "Campus & City Radio 94.4 St. Pölten",
    defaultDesc: "Seit 2009 ist Marina eine Stimme des Mitgefühls und des Bewusstseins und gestaltet nachdenkliche Programme, die Kultur, Sprache und Bewusstsein verbinden.",
    defaultFooter: "Heute bringt Marina weiterhin ihre Wärme und Tiefe in den Äther und verwandelt das Radio in einen Zufluchtsort der Empathie.",
    loading: "Lade Geschichte...",
  }
};

// --- UPDATED QUERY ---
// Fetches both English and German fields
const query = `*[_type == "radioSection"][0] {
  title,
  title_de,
  subtitle,
  subtitle_de,
  description,
  description_de,
  profileImage, 
  "items": careerItems[] {
    title,
    title_de,
    period,
    description,
    description_de,
    iconName 
  },
  footerText,
  footerText_de
}`;

const RadioSection = () => {
  const { language } = useLanguage(); // Hook into Language
  const t = STATIC_TEXT[language];

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    client.fetch(query)
      .then((result) => {
        setData(result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch Radio data:", err);
        setIsLoading(false);
      });
  }, []);

  // --- FALLBACK DATA ---
  const fallbackItems = [
    {
      iconName: "globe",
      title: "Migranten am Wort",
      period: "2010–2011 • Pioneer Project",
      description: "A groundbreaking format giving voice to people with migration backgrounds.",
      description_de: "Ein bahnbrechendes Format, das Menschen mit Migrationshintergrund eine Stimme gibt."
    },
    {
      iconName: "utensils",
      title: "Kochen und Schmecken",
      period: "2011–2012 • Cultural Series",
      description: "A culinary radio experience blending taste, diversity, and dialogue.",
      description_de: "Ein kulinarisches Radioerlebnis, das Geschmack, Vielfalt und Dialog verbindet."
    },
    {
      iconName: "book",
      title: "Literaturstunde",
      period: "2012–2013 • Literary Show",
      description: "A soulful exploration of literature as a mirror of human experience.",
      description_de: "Eine seelenvolle Erkundung der Literatur als Spiegel menschlicher Erfahrung."
    },
    {
      iconName: "mic",
      title: "Die Vollkommenheit",
      period: "2023 • Wellness Series",
      description: "A reflective program dedicated to inner awareness.",
      description_de: "Ein reflektierendes Programm, das dem inneren Bewusstsein gewidmet ist."
    },
  ];

  const displayItems = data?.items || fallbackItems;

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <section className="py-24 flex flex-col justify-center items-center bg-rose-50">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mb-4" />
        <p className="text-rose-800 font-medium animate-pulse">{t.loading}</p>
      </section>
    );
  }

  return (
    <section className="relative w-full py-20 lg:py-28 px-4 sm:px-6 overflow-hidden font-sans">
      
      {/* GLOBAL AMBIENT BACKGROUND (Matches other pages) */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-20" />
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-pink-300/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-purple-300/10 rounded-full blur-[100px] -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          
          {/* Dynamic Profile Picture */}
          {data?.profileImage && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mb-8 relative inline-block"
            >
              <div className="absolute inset-0 bg-rose-400 rounded-full blur-2xl opacity-30 animate-pulse" />
              <img 
                src={urlFor(data.profileImage).width(400).height(400).fit('crop').url()} 
                alt="Marina Profile" 
                loading="lazy"
                className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-[4px] border-white shadow-2xl"
              />
            </motion.div>
          )}

          {/* Subtitle Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 px-5 py-2 rounded-full shadow-sm">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
                {getLocalizedText(data, 'subtitle', language) || t.subtitle}
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold mb-6 text-rose-950 leading-tight"
          >
            {getLocalizedText(data, 'title', language) || t.defaultTitle}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-rose-900/70 leading-relaxed font-light"
          >
            {getLocalizedText(data, 'description', language) || t.defaultDesc}
          </motion.p>
        </div>

        {/* --- CAREER GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayItems.map((item, i) => {
            // Resolve Icon
            const IconComponent = ICON_MAP[item.iconName] || Mic2;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                // CONVEX GLASS CARD STYLE
                className="group relative rounded-[2rem] p-8 flex flex-col items-start transition-all duration-500"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: `
                    inset 0 0 0 1px rgba(255, 255, 255, 0.4),
                    inset 0 5px 20px rgba(255, 255, 255, 0.6),
                    0 15px 35px rgba(236, 72, 153, 0.1)
                  `
                }}
              >
                {/* Inner Shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-[2rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon Bubble */}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 border border-white/50">
                  <IconComponent className="w-7 h-7 text-rose-500" strokeWidth={1.5} />
                </div>

                <h3 className="relative z-10 text-xl font-bold text-rose-950 mb-2 leading-tight group-hover:text-pink-600 transition-colors">
                  {getLocalizedText(item, 'title', language)}
                </h3>
                
                <div className="relative z-10 inline-block mb-4">
                   <span className="text-xs font-bold text-rose-500 uppercase tracking-wider border-b border-rose-200 pb-1">
                     {item.period}
                   </span>
                </div>

                <p className="relative z-10 text-sm text-rose-900/70 leading-relaxed font-medium flex-grow">
                  {getLocalizedText(item, 'description', language)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* --- FOOTER QUOTE --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div 
            className="inline-block max-w-3xl p-10 rounded-[2.5rem] border border-rose-200/50 bg-white/40 backdrop-blur-xl shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-50" />
            
            <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-6 animate-pulse" />
            <p className="text-rose-900/80 text-lg md:text-xl italic font-['Playfair_Display'] leading-relaxed">
              "{getLocalizedText(data, 'footerText', language) || t.defaultFooter}"
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default RadioSection;