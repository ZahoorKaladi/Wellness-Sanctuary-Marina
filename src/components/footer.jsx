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
} from "lucide-react";
import { client } from '../client'; // <-- 1. IMPORT SANITY CLIENT

// 2. This query fetches *only* your new 'footer' document
const query = `*[_type == "footer"][0]`;

// 3. We create a map of icons to make the code cleaner
const socialIcons = {
  socialInstagram: Instagram,
  socialLinkedin: Linkedin,
  socialFacebook: Facebook,
  socialTwitter: Twitter,
  socialYoutube: Youtube,
};

const Footer = () => {
  // 4. Add state for your dynamic data
  const [data, setData] = useState(null);
  // We don't need a loader, the footer can just show fallbacks

  useEffect(() => {
    client.fetch(query)
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch footer data:", err));
  }, []); // Runs once

  // 5. Create a dynamic list of social links to render
  // This is "bulletproof" - it checks if 'data' exists first
  const socialLinks = data ? [
    { key: 'socialInstagram', href: data.socialInstagram },
    { key: 'socialLinkedin', href: data.socialLinkedin },
    { key: 'socialFacebook', href: data.socialFacebook },
    { key: 'socialTwitter', href: data.socialTwitter },
    { key: 'socialYoutube', href: data.socialYoutube },
  ].filter(link => link.href) // Only show icons if a link was entered
  : []; // Default to an empty array

  return (
    <footer className="relative bg-gradient-to-b from-rose-200 via-pink-300 to-rose-400 text-gray-800 font-sans overflow-hidden">
      {/* Static design elements are unchanged */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      <div className="absolute top-[-15%] right-[-15%] w-80 h-80 bg-pink-400/20 rounded-full blur-[120px] md:w-96 md:h-96"></div>
      <div className="absolute bottom-[-15%] left-[-15%] w-80 h-80 bg-rose-400/20 rounded-full blur-[120px] md:w-96 md:h-96"></div>

      <div className="relative container mx-auto px-4 py-10 sm:py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

        {/* About Marina (Now Dynamic) */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 relative after:content-[''] after:absolute after:w-10 after:h-[2px] after:bg-pink-500 after:bottom-0 after:left-0">
            About Marina
          </h3>
          <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
            {/* 6. Dynamic text with fallback */}
            {data?.footerBio || "Reconnect with inner peace through mindfulness and holistic wellness guidance."}
          </p>
          <div className="flex gap-2 sm:gap-3 mt-4">
            {/* 7. Dynamic Social Links */}
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.key];
              return (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-pink-500/50 transition-all duration-300 hover:scale-110"
                  aria-label={`${link.key.replace('social', '')} link`}
                >
                  <Icon size={16} className="text-pink-600" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Explore (Static - this is correct) */}
        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 relative after:content-[''] after:absolute after:w-10 after:h-[2px] after:bg-pink-500 after:bottom-0 after:left-0">
            Explore
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              // { to: "/testimonials", label: "Testimonials" },
              { to: "/blog", label: "Blog" },
              { to: "/contact", label: "Contact" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  className="hover:text-pink-600 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact (Now Dynamic) */}
        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 relative after:content-[''] after:absolute after:w-10 after:h-[2px] after:bg-pink-500 after:bottom-0 after:left-0">
            Contact
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="text-pink-600" size={16} />
              <span>{data?.contactAddress || "Dubai, UAE"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="text-pink-600" size={16} />
              <span>{data?.contactPhone || "+971 555 123456"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="text-pink-600" size={16} />
              <span>{data?.contactEmail || "hello@marinawellness.com"}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter (Now Dynamic Text, Static Form) */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 relative after:content-[''] after:absolute after:w-10 after:h-[2px] after:bg-pink-500 after:bottom-0 after:left-0">
            {data?.newsletterTitle || "Stay Mindful"}
          </h3>
          <p className="text-xs sm:text-sm opacity-80">
            {data?.newsletterSubtitle || "Get weekly mindfulness tips and updates."}
          </p>
          {/* This form is static for now, which is fine. */}
          <form className="flex flex-col sm:flex-row gap-2 bg-white/20 rounded-lg overflow-hidden backdrop-blur-sm">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 sm:p-3 text-gray-800 bg-white/50 focus:outline-none text-xs sm:text-sm rounded"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-pink-500 hover:bg-pink-600 transition-all text-white font-medium rounded text-xs sm:text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="relative border-t border-white/20 text-center py-4 text-xs sm:text-sm opacity-80">
        <p>{data?.footerCopyright || `© ${new Date().getFullYear()} Marina Wellness. All Rights Reserved.`}</p>
        {/* We add a check for the tagline */}
        {data?.footerTagline && (
          <p className="mt-1 text-pink-600">{data.footerTagline}</p>
        )}
      </div>
    </footer>
  );
};

export default Footer;