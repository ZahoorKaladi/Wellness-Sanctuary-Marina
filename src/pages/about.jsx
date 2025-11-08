// app/src/pages/AboutPage.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mic, Video, Heart, Sparkles, Zap, Feather } from 'lucide-react';
import { client, urlFor } from '../client'; // <-- 1. IMPORT SANITY

// 2. We keep your static header messages as a FALLBACK
const staticHeaderMessages = [
  'Spiritual Master & Wellness Guide',
  'Guiding You to Inner Peace',
  'Healing Mind, Body & Soul',
];

// 3. We define a single, simple query to get all page content
const query = `*[_type == "aboutPage"][0]`;

// 4. We DELETE the static 'radioCareerHighlights' array
// const radioCareerHighlights = [ ... ];

// Your static FeatureCard component is perfect and UNCHANGED
const FeatureCard = ({ Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, delay }}
    whileHover={{ scale: 1.03, translateY: -6 }}
    className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-white/18 backdrop-blur-md border border-white/10 shadow-lg"
  >
    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-400/40 to-pink-500/20 mb-4">
      <Icon size={26} className="text-rose-800" />
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-rose-900 mb-2">{title}</h3>
    <p className="text-sm text-rose-700 leading-relaxed">{desc}</p>
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileHover={{ opacity: 0.06, x: 0 }}
      transition={{ duration: 0.6 }}
      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white to-transparent mix-blend-screen"
    />
  </motion.div>
);

const AboutPage = () => {
  const [headerIndex, setHeaderIndex] = useState(0);

  // --- 5. ADD STATE FOR DYNAMIC DATA ---
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // We won't add an error state, to keep the page static-first
  // If data fails to load, it will just show the original static text
  
  // --- 6. DERIVE DYNAMIC CONTENT WITH FALLBACKS (The Bulletproof part) ---
  const headerMessages = data?.headerTaglines || staticHeaderMessages;
  const radioHighlights = data?.radioHighlights || []; // Default to empty array
  const pageData = data || {}; // Default to empty object

  // 7. This useEffect fetches the data
  useEffect(() => {
    client
      .fetch(query)
      .then((fetchedData) => {
        setData(fetchedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch About Page data:", err);
        setIsLoading(false); // Let the page render with static fallbacks
      });
  }, []);

  // Your original header animation hook is perfect
  useEffect(() => {
    const t = setInterval(() => setHeaderIndex((i) => (i + 1) % headerMessages.length), 4800);
    return () => clearInterval(t);
  }, [headerMessages]); // It now safely depends on the (dynamic or static) headerMessages

  // Your static particles are perfect
  const particles = [
    { id: 1, size: 90, x: 10, y: 8, delay: 0 },
    { id: 2, size: 60, x: 80, y: 14, delay: 1.2 },
    { id: 3, size: 40, x: 40, y: 72, delay: 0.6 },
  ];

  return (
    <div className="min-h-screen w-full font-inter bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100 text-rose-900">
      
      {/* HERO (Now hybrid - static design, dynamic text) */}
      <header className="relative w-full overflow-hidden">
        {/* All your static backgrounds and particles are unchanged */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed filter saturate-110"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/374754/pexels-photo-374754.jpeg?auto=format&fit=crop&q=90&w=1920&h=900')",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-900/45 via-rose-800/35 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-sm" />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0, 0.28, 0.06], y: [0, -6, 0], scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 6 + p.delay, delay: p.delay }}
            className="absolute rounded-full bg-gradient-to-br from-pink-300/40 to-rose-500/20 blur-3xl"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          />
        ))}

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 sm:py-36 lg:py-44 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-extrabold tracking-tight leading-tight text-white"
          >
            {/* This title is static, as requested */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-100 via-pink-200 to-white">The Heart Behind the Healing</span>
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.h3
              key={headerIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
              className="mt-4 text-md sm:text-lg md:text-xl text-rose-100/90 max-w-3xl mx-auto italic"
            >
              {/* This text is now dynamic */}
              {headerMessages[headerIndex]}
            </motion.h3>
          </AnimatePresence>

          {/* Static buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Link
              to="/sessionbooking"
              className="relative inline-flex items-center gap-3 rounded-full px-8 py-3 bg-white/95 text-rose-800 font-semibold shadow-2xl border border-white/80 hover:scale-[1.02] transition-transform duration-300"
            >
              Book a Session
            </Link>
            <Link
              to="/service"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2 bg-transparent border border-white/30 text-white/90 hover:bg-white/8 transition-colors"
            >
              Our Offerings
            </Link>
          </motion.div>
        </div>
      </header>

      {/* PROFILE + MISSION (Now hybrid) */}
      <section className="relative -mt-16 sm:-mt-20 z-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="bg-white/18 backdrop-blur-lg border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="rounded-full p-1 bg-gradient-to-br from-rose-400 to-pink-400 shadow-[0_30px_80px_rgba(236,72,153,0.12)]">
                  <img
                    // DYNAMIC PROFILE IMAGE
                    src={
                      pageData.profileImage
                        ? urlFor(pageData.profileImage).width(300).height(300).fit('crop').url()
                        : "https://images.pexels.com/photos/6919996/pexels-photo-6919996.jpeg?auto=format&fit=crop&q=90&w=600&h=600"
                    }
                    alt="Marina"
                    className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full object-cover border-4 border-white/30"
                  />
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-18px] w-40 h-8 rounded-full blur-xl opacity-30 bg-white/30" />
              </motion.div>

              <div className="flex-1 text-center lg:text-left">
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-['Playfair_Display'] font-extrabold text-rose-900"
                >
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-rose-900 via-pink-500 to-rose-700">MARI</span>
                  <span className="inline-block ml-1 text-pink-500">NA</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mt-4 text-sm sm:text-base text-rose-800 leading-relaxed max-w-2xl mx-auto lg:mx-0 italic"
                >
                  {/* DYNAMIC BIO TEXT */}
                  {pageData.profileBio || "Since 2009, Marina's work at Campus & City Radio 94.4 St. Pölten has focused on fostering dialogue and human stories — building a foundation of trust, presence and impact. spiritual guidance & holistic healing at a young age. Her work combines ancient wisdom with modern practice to help you reclaim calm, clarity and presence."}
                </motion.p>

                {/* Static buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
                >
                  <Link to="/programspage" className="text-sm px-4 py-2 rounded-full bg-rose-700/10 border border-rose-700/20 text-rose-900">Explore Programs</Link>
                  <Link to="/contact" className="text-sm px-4 py-2 rounded-full bg-white/90 text-rose-800 shadow">Contact Marina</Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID (Now hybrid - static icons, dynamic text) */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl font-['Playfair_Display'] text-rose-900 font-bold text-center mb-10"
          >
            Marina's Pillars of Transformation
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              Icon={Mic} 
              title={pageData.feature1?.title || "Audio Therapies"}
              desc={pageData.feature1?.description || "Guided meditations and sound baths to soothe the nervous system."}
              delay={0.05} 
            />
            <FeatureCard 
              Icon={Video} 
              title={pageData.feature2?.title || "Video Journeys"}
              desc={pageData.feature2?.description || "Visualizations for deep mindfulness and self-discovery."}
              delay={0.15} 
            />
            <FeatureCard 
              Icon={Heart} 
              title={pageData.feature3?.title || "Inner Healing"}
              desc={pageData.feature3?.description || "Emotional release, energy work and heart-centered awareness."}
              delay={0.25} 
            />
            <FeatureCard 
              Icon={Sparkles} 
              title={pageData.feature4?.title || "Spiritual Clarity"}
              desc={pageData.feature4?.description || "Practical wisdom to ground your spirit and illuminate the path."}
              delay={0.35} 
            />
          </div>
        </div>
      </section>

      {/* RADIO CAREER (Now hybrid - static title, dynamic content) */}
      <section className="py-12 sm:py-16 bg-rose-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl text-rose-900 font-bold text-center mb-8"
          >
            A Credible Foundation: Broadcast & Radio
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* DYNAMIC RADIO HIGHLIGHTS */}
            {radioHighlights.map((r, idx) => (
              <motion.article
                key={idx} // Using 'idx' is okay here as the list is static
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * idx }}
                className="p-6 rounded-xl bg-white shadow-xl border-t-4 border-rose-500"
              >
                <div className="text-4xl mb-3">{r.icon || '🎙️'}</div>
                <h4 className="text-lg font-semibold text-rose-900">{r.title || "Untitled Program"}</h4>
                <div className="text-sm font-medium text-rose-700 mt-2">{r.period || "Date TBD"}</div>
                <p className="mt-3 text-sm text-rose-700 leading-relaxed">{r.description || "No description."}</p>
              </motion.article>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-rose-700 italic max-w-3xl mx-auto">
            {/* DYNAMIC BIO TEXT (REUSED) */}
            {pageData.profileBio || "Since 2009, Marina's work at Campus & City Radio 94.4 St. Pölten has focused on fostering dialogue and human stories — building a foundation of trust, presence and impact."}
          </p>
        </div>
      </section>

      {/* IN-DEPTH JOURNEY (Now hybrid - static icons/title, dynamic text) */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-2xl sm:text-3xl font-bold text-center text-rose-900 mb-8">
            The Transformative Power
          </motion.h3>

          <div className="space-y-6">
            <motion.div className="flex items-start gap-4 p-5 rounded-2xl bg-white/14 border-l-8 border-rose-700 shadow-md" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Zap size={22} className="text-rose-700 mt-1" />
              <div>
                <h4 className="font-semibold text-rose-900">
                  {pageData.journey1?.title || "Empowerment Through Breath"}
                </h4>
                <p className="text-sm text-rose-700 leading-relaxed">
                  {pageData.journey1?.description || "Signature breathwork techniques designed to release held stress and unlock the body's natural flow — leading to immediate emotional relief and clarity."}
                </p>
              </div>
            </motion.div>

            <motion.div className="flex items-start gap-4 p-5 rounded-2xl bg-white/14 border-l-8 border-rose-700 shadow-md" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.06 }}>
              <Feather size={22} className="text-rose-700 mt-1" />
              <div>
                <h4 className="font-semibold text-rose-900">
                  {pageData.journey2?.title || "Visualizations for Lasting Change"}
                </h4>
                <p className="text-sm text-rose-700 leading-relaxed">
                  {pageData.journey2?.description || "Guided visualizations to reprogram old patterns and manifest a life aligned with your highest self — change starts within."}
                </p>
              </div>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.12 }} className="text-center text-sm text-rose-700 italic">
              {pageData.journeyFinalNote || "Join a global community and take the next step on your path toward balance, joy and deeper meaning."}
            </motion.p>
          </div>
        </div>
      </section>

      {/* CTA (Static) */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-rose-300 to-pink-300 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h3 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold mb-4">Ready to find your inner calm?</motion.h3>
          <p className="max-w-2xl mx-auto text-sm sm:text-base mb-6 opacity-95">Book a one-on-one session with Marina and experience a personalized transformation — intentional, supportive, and carefully guided.</p>
          <div className="relative inline-block">
            <motion.div
              aria-hidden
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: [0.95, 1.06, 0.98], opacity: [0.08, 0.16, 0.06] }}
              transition={{ repeat: Infinity, duration: 2.6 }}
              className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-r from-rose-400 to-pink-400 opacity-30"
            />
            <Link to="/sessionbooking" className="relative inline-flex items-center px-10 py-3 rounded-full bg-white/95 text-rose-900 font-semibold shadow-2xl border border-white/80">Book Your Session Now</Link>
          </div>
        </div>
      </section>

      {/* Footer (Static) */}
      <footer className="py-10 text-center text-sm text-rose-700">
        © {new Date().getFullYear()} Marina — All rights reserved.
      </footer>
    </div>
  );
};

export default AboutPage;