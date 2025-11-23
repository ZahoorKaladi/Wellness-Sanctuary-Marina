import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/languagecontext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const selectLang = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* Trigger Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)"
        }}
      >
        <Globe size={18} className="text-rose-800 group-hover:text-rose-600 transition-colors" />
        <span className="text-sm font-medium text-rose-900 uppercase tracking-wide">
          {language}
        </span>
        <ChevronDown size={14} className={`text-rose-800 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-32 overflow-hidden rounded-2xl origin-top-right"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.5)"
            }}
          >
            <div className="p-1 flex flex-col gap-1">
              {['en', 'de'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => selectLang(lang)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    language === lang 
                      ? "bg-rose-100 text-rose-900" 
                      : "text-gray-600 hover:bg-rose-50 hover:text-rose-800"
                  }`}
                >
                  <span className="text-lg">{lang === 'en' ? '🇬🇧' : '🇩🇪'}</span>
                  {lang === 'en' ? 'English' : 'Deutsch'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;