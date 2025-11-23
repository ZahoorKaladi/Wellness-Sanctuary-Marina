import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/languagecontext";
import { translations } from "../utils/translations";
import LanguageSwitcher from "../components/languageswitcher";

// Refactor Nav Items
const NAV_LINKS = [
  { key: "home", to: "/" },
  { key: "programs", to: "/ProgramsPage" },
  { key: "about", to: "/about" },
  { key: "Articles", to: "/blog" }, 
  { key: "services", to: "/service" },
  { key: "contact", to: "/contact" },
];

// Custom Staggered Hamburger
const StaggeredHamburger = ({ isOpen, onClick, isScrolled }) => (
  <button
    onClick={onClick}
    className={`lg:hidden p-3 rounded-full transition-all duration-300 group ${
        isScrolled ? 'hover:bg-[#B08688]/10' : 'hover:bg-white/10'
    }`}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <div className="relative w-7 h-6 flex flex-col justify-between">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-0.5 w-full rounded-full transition-all duration-300 ease-in-out ${
            // Pink if menu open, otherwise depends on scroll (White at top, Pink when scrolled)
            isOpen ? "bg-[#B08688]" : (isScrolled ? "bg-[#B08688]" : "bg-white")
          } ${
            isOpen
              ? i === 0
                ? "rotate-45 translate-y-3"
                : i === 2
                ? "-rotate-45 translate-y-[-1.25rem]"
                : "opacity-0"
              : i === 1
              ? "w-full group-hover:w-4/5 group-hover:ml-auto"
              : i === 0
              ? "w-full"
              : "w-4/5 -ml-1 group-hover:w-full group-hover:ml-0"
          }`}
        />
      ))}
    </div>
  </button>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language]; 

  // Optimized Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const scrolled = offset > 20;
      if (isScrolled !== scrolled) {
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // CONVEX GLASS STYLE 
  const navStyle = isScrolled
    ? {
        backgroundColor: "rgba(255, 245, 247, 0.35)", 
        backdropFilter: "blur(16px)",
        boxShadow: `
          inset 0 0 0 1px rgba(255, 255, 255, 0.6),
          inset 0 -5px 20px rgba(255, 255, 255, 0.5),
          0 10px 30px rgba(176, 134, 136, 0.15) 
        `,
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
      }
    : {
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        boxShadow: "none",
        borderBottom: "1px solid transparent",
      };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={navStyle}
      >
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between relative z-10">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#B08688] rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <Sparkles className={`h-9 w-9 transition-transform duration-500 relative z-10 group-hover:rotate-12 ${isScrolled ? 'text-[#B08688]' : 'text-white'}`} />
            </div>
            <span className={`text-2xl font-['Playfair_Display'] italic tracking-tight transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
              Elevate Wellness
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className={`relative font-light text-sm tracking-wider transition-colors duration-300
                           /* FIXED VISIBILITY: White when top, Gray when scrolled */
                           ${isScrolled ? "text-gray-700" : "text-white"}
                           /* HOVER EFFECT: Always Pink/Peach (#B08688) */
                           hover:text-[#B08688]
                           after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px 
                           after:bg-[#B08688] after:transition-all after:duration-500 
                           hover:after:w-full`}
              >
                {t[item.key] || item.key}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className={`pl-2 border-l ${isScrolled ? 'border-[#B08688]/30' : 'border-white/30'}`}>
                <LanguageSwitcher />
            </div>

            {/* CTA Button */}
            <Link
              to="/sessionbooking"
              className="ml-2 relative group px-7 py-3 rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#B08688]/20"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(4px)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)"
              }}
            >
               <div className="absolute inset-0 bg-[#B08688] transition-colors duration-300 group-hover:bg-[#c060a1]" />
               <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50 pointer-events-none" />
               
               <span className="relative z-10 font-medium text-sm text-white flex items-center gap-2">
                 {t.bookSession}
               </span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <StaggeredHamburger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} isScrolled={isScrolled} />
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Menu (Unchanged) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-50 lg:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm z-50 shadow-2xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(25px)",
              }}
            >
              <div className="flex flex-col h-full relative z-10">
                <div className="p-6 flex justify-between items-center border-b border-[#B08688]/20">
                  <LanguageSwitcher />
                  <StaggeredHamburger isOpen={isOpen} onClick={() => setIsOpen(false)} isScrolled={true} />
                </div>

                <nav className="flex-1 px-8 py-12 overflow-y-auto">
                  <ul className="space-y-7">
                    {NAV_LINKS.map((item, i) => (
                      <motion.li
                        key={item.key}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <Link
                          to={item.to}
                          onClick={() => setIsOpen(false)}
                          className="block text-2xl font-light text-gray-800 hover:text-[#B08688] transition-colors"
                        >
                          {t[item.key] || item.key}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                  >
                    <Link
                      to="/sessionbooking"
                      onClick={() => setIsOpen(false)}
                      className="inline-block bg-[#B08688] hover:bg-[#c060a1] text-white px-10 py-5 rounded-full text-lg font-medium shadow-lg hover:shadow-[#B08688]/40 hover:scale-105 transition-all duration-300"
                    >
                      {t.bookSession}
                    </Link>
                  </motion.div>
                </nav>

                <div className="p-8 text-center">
                   <p className="text-sm text-[#B08688] font-['Playfair_Display'] italic opacity-60">
                    Glow from within
                   </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}