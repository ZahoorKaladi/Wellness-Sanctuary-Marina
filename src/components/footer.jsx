// app/src/components/Footer.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { client } from '../client';

// 1. Import Language Context & Helper
import { useLanguage } from "../context/languagecontext";
import { getLocalizedText } from "../utils/sanityhelper";

// --- STATIC TRANSLATIONS ---
const STATIC_TEXT = {
  en: {
    aboutTitle: "About Marina",
    exploreTitle: "Explore",
    contactTitle: "Contact",
    newsletterTitle: "Stay Mindful",
    newsletterSubtitle: "Join our community for weekly tips and gentle reminders.",
    subscribe: "Subscribe",
    rights: "All Rights Reserved.",
    menu: {
      home: "Home",
      about: "About Us",
      services: "Services",
      journal: "Journal",
      contact: "Contact"
    }
  },
  de: {
    aboutTitle: "Über Marina",
    exploreTitle: "Erkunden",
    contactTitle: "Kontakt",
    newsletterTitle: "Achtsam bleiben",
    newsletterSubtitle: "Treten Sie unserer Community bei für wöchentliche Tipps.",
    subscribe: "Abonnieren",
    rights: "Alle Rechte vorbehalten.",
    menu: {
      home: "Startseite",
      about: "Über uns",
      services: "Angebote",
      journal: "Journal",
      contact: "Kontakt"
    }
  }
};

const query = `*[_type == "footer"][0]`;

const socialIcons = {
  socialInstagram: Instagram,
  socialLinkedin: Linkedin,
  socialFacebook: Facebook,
  socialTwitter: Twitter,
  socialYoutube: Youtube,
};

const Footer = () => {
  const [data, setData] = useState(null);
  const { language } = useLanguage(); // Get current language
  const t = STATIC_TEXT[language];    // Get translations for current language

  useEffect(() => {
    client.fetch(query)
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch footer data:", err));
  }, []);

  const socialLinks = data ? [
    { key: 'socialInstagram', href: data.socialInstagram },
    { key: 'socialLinkedin', href: data.socialLinkedin },
    { key: 'socialFacebook', href: data.socialFacebook },
    { key: 'socialTwitter', href: data.socialTwitter },
    { key: 'socialYoutube', href: data.socialYoutube },
  ].filter(link => link.href) : [];

  return (
    <footer 
      className="relative pt-20 pb-10 overflow-hidden font-sans mt-20"
      style={{
        // THE CONVEX DEEP GLASS STYLE
        backgroundColor: 'rgba(159, 18, 57, 0.85)', // Deep Rose Base
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: `
            inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
            0 -10px 40px rgba(236, 72, 153, 0.15)
        `
      }}
    >
      {/* 1. Ambient Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/50 to-rose-950/80 -z-20" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-500/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      {/* 2. Inner Highlight Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none -z-10" />

      <div className="relative container mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 text-white">

        {/* --- COLUMN 1: ABOUT --- */}
        <div className="space-y-6">
          <div>
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-pink-300" />
                <h3 className="text-2xl font-['Playfair_Display'] italic font-bold">
                  {t.aboutTitle}
                </h3>
             </div>
             <div className="h-1 w-12 bg-pink-400 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.6)]" />
          </div>
          
          <p className="text-sm text-rose-100/80 leading-relaxed font-light">
            {/* Use helper to get localized bio if available, otherwise fallback to English */}
            {getLocalizedText(data, 'footerBio', language) || 
             (language === 'de' 
               ? "Finden Sie inneren Frieden durch Achtsamkeit und ganzheitliche Wellness-Beratung. Beginnen Sie Ihre Reise zu einem ausgeglichenen Leben."
               : "Reconnect with inner peace through mindfulness and holistic wellness guidance. Embrace your journey to a balanced life.")}
          </p>

          {/* Glass Social Buttons */}
          <div className="flex gap-3">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.key];
              return (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full 
                             bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40
                             transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20"
                  aria-label={`${link.key.replace('social', '')} link`}
                >
                  <Icon size={18} className="text-pink-200" />
                </a>
              )
            })}
          </div>
        </div>

        {/* --- COLUMN 2: EXPLORE --- */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold font-serif">{t.exploreTitle}</h3>
            <div className="h-0.5 w-8 bg-white/30 mt-2 rounded-full" />
          </div>
          <ul className="space-y-3 text-sm text-rose-100/80">
            {[
              { to: "/", label: t.menu.home },
              { to: "/about", label: t.menu.about },
              { to: "/service", label: t.menu.services },
              { to: "/blog", label: t.menu.journal },
              { to: "/contact", label: t.menu.contact },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  className="group flex items-center gap-2 hover:text-white transition-all duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400/0 group-hover:bg-pink-400 transition-all" />
                  <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- COLUMN 3: CONTACT --- */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold font-serif">{t.contactTitle}</h3>
            <div className="h-0.5 w-8 bg-white/30 mt-2 rounded-full" />
          </div>
          <ul className="space-y-4 text-sm text-rose-100/80">
            <li className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-full mt-[-2px]">
                <MapPin className="text-pink-300" size={14} />
              </div>
              <span className="leading-tight">{data?.contactAddress || "Dubai, UAE"}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <Phone className="text-pink-300" size={14} />
              </div>
              <span>{data?.contactPhone || "+971 555 123456"}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <Mail className="text-pink-300" size={14} />
              </div>
              <span>{data?.contactEmail || "hello@marinawellness.com"}</span>
            </li>
          </ul>
        </div>

        {/* --- COLUMN 4: NEWSLETTER --- */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold font-serif">
              {data?.newsletterTitle || t.newsletterTitle}
            </h3>
            <div className="h-0.5 w-8 bg-white/30 mt-2 rounded-full" />
          </div>
          <p className="text-sm text-rose-100/70">
            {data?.newsletterSubtitle || t.newsletterSubtitle}
          </p>
          
          {/* Convex Glass Form */}
          <form className="flex flex-col gap-3">
            <div className="relative group">
              <input
                type="email"
                placeholder={language === 'de' ? "Ihre E-Mail-Adresse" : "Your email address"}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-rose-200/50 focus:outline-none focus:border-pink-400/50 focus:bg-black/30 transition-all"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-medium text-sm shadow-lg shadow-pink-900/20 hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {t.subscribe}
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative border-t border-white/10 mt-12 pt-8 text-center">
        <p className="text-xs text-rose-200/40 tracking-wide">
          {data?.footerCopyright || `© ${new Date().getFullYear()} Marina Wellness. ${t.rights}`}
        </p>
        {data?.footerTagline && (
          <p className="mt-2 text-sm font-['Playfair_Display'] italic text-pink-300/80">
            {getLocalizedText(data, 'footerTagline', language)}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;