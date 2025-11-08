import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Activity } from "lucide-react";

// --- Configuration Data ---
const NAV_ITEMS = [
  { name: 'Home', to: '/' },
  { name: 'Programs', to: '/ProgramsPage' },
  { name: 'About Us', to: '/about' },
  { name: 'Contact', to: '/contact' },
  { name: 'Articles', to: '/blog' },
  { name: 'Services', to: '/service' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ACCENT_COLOR_CLASS = "text-[#B08688]";
  const CTA_COLOR_CLASS = "bg-[#B08688] hover:bg-[#c060a1]";
  const logoFontClass = "font-['Playfair_Display',_serif] italic font-semibold tracking-tight";

  return (
    <nav
      className={`fixed top-0 w-full p-3 z-50 shadow-lg backdrop-blur-md border-b border-white/40 transition-colors duration-300 ${
        scrolled ? 'bg-white/25 shadow-xl' : 'bg-white/15'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Activity className={`h-8 w-8 ${ACCENT_COLOR_CLASS} transition-colors duration-300`} />
          <span className={`text-2xl ${logoFontClass} text-gray-900`}>
            Elevate Wellness
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-[350] tracking-wide text-gray-700 text-[15.5px] transition-all duration-300">
          {NAV_ITEMS.map((item) => (
            <li key={item.name} className="group relative">
              <Link
                to={item.to}
                className="relative transition-all duration-300 text-gray-700 hover:text-[#b08688] font-light"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#b08688] rounded-full transition-all duration-500 ease-out group-hover:w-3/4"></span>
              </Link>
            </li>
          ))}

          {/* CTA Button */}
          <Link
            to="/sessionbooking"
            className={`hidden md:block ${CTA_COLOR_CLASS} text-white px-5 py-2 rounded-full shadow-lg transition duration-300 hover:scale-[1.05] font-medium text-sm`}
          >
            Book a Session
          </Link>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 transition-all duration-300 p-3 rounded-full hover:bg-gray-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#d4a3a3]/40"
          onClick={() => setOpen(!open)}
          aria-label="Toggle mobile menu"
        >
          {open ? (
            <X size={28} className="transition-transform duration-300 rotate-90 text-[#b08688]" />
          ) : (
            <Menu size={28} className="transition-transform duration-300 hover:rotate-12 text-[#b08688]" />
          )}
        </button>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-2/3 max-w-xs z-50 backdrop-blur-2xl bg-[#ffe6e6]/70 shadow-[0_0_20px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-in-out ${
            open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              className="text-gray-700 p-3 rounded-full hover:bg-gray-200 active:scale-90 transition-all focus:outline-none"
              onClick={() => setOpen(false)}
              aria-label="Close mobile menu"
            >
              <X size={26} className="transition-transform duration-300 hover:rotate-90" />
            </button>
          </div>

          {/* Mobile Links */}
          <ul className="flex flex-col py-6 space-y-3 font-light text-gray-800 items-center">
            {NAV_ITEMS.map((item) => (
              <li key={item.name} className="w-full">
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="relative block w-full text-center py-3 text-[16px] tracking-wide transition-all hover:bg-[#b08688]/15 active:scale-[0.98] font-normal text-gray-800"
                >
                  {item.name}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#b08688] rounded-full transition-all duration-500 hover:w-3/4"></span>
                </Link>
              </li>
            ))}

            {/* Mobile CTA Button */}
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="bg-[#b08688] hover:bg-[#a67175] text-white px-6 py-2 rounded-full shadow-md mt-6 font-medium text-sm transition-all active:scale-95"
            >
              Book a Session
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
