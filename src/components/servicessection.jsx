import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkle, HeartHandshake, BrainCircuit, Music, Youtube, Users } from "lucide-react";
import { Link } from "react-router-dom";

const iconComponents = { Sparkle, HeartHandshake, BrainCircuit, Music, Youtube, Users };

const ServicesSection = () => {
  const [services] = React.useState([
    {
      id: 1,
      title: "Spirituelle Heilung",
      description: "Bringe deine innere Energie in Einklang und erfahre Frieden durch geführte Heilsitzungen.",
      icon: "Sparkle",
      slug: "spiritual-healing",
    },
    {
      id: 2,
      title: "Emotionale Balance",
      description: "Verwandle Angst in Gelassenheit und entdecke neue Lebensfreude durch Übungen für emotionale Balance.",
      icon: "HeartHandshake",
      slug: "emotional-wellness",
    },
    {
      id: 3,
      title: "Meditationstherapie",
      description: "Personalisierte Meditationen, die dir helfen, zur Ruhe zu kommen und dich wieder mit dir selbst zu verbinden.",
      icon: "BrainCircuit",
      slug: "meditation-therapy",
    },
    {
      id: 4,
      title: "Heilsame Audio-Sitzungen",
      description: "Lausche gefühlvollen Audio-Reisen, die dich in Gelassenheit und Bewusstheit führen.",
      icon: "Music",
      slug: "audio-sessions",
    },
    {
      id: 5,
      title: "Video-Podcasts",
      description: "Entdecke tiefgründige, heilsame Gespräche, die Geist und Seele nähren.",
      icon: "Youtube",
      slug: "video-podcasts",
    },
    {
      id: 6,
      title: "Persönliche Begleitung",
      description: "Einzelsitzungen, die dir helfen, Klarheit, Ausrichtung und emotionale Erdung zu finden.",
      icon: "Users",
      slug: "personal-guidance",
    },
  ]);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-14 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-pink-50/80 via-rose-100/60 to-white/80 font-poppins"
    >
      {/* GLOWING ORBS – TOUCH-SAFE */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-6 left-4 w-32 h-32 sm:w-40 sm:h-40 bg-rose-200/50 rounded-full blur-3xl opacity-60 animate-pulse"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-6 right-4 w-40 h-40 sm:w-56 sm:h-56 bg-pink-300/40 rounded-full blur-3xl opacity-50 animate-pulse"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* HEADING */}
      <motion.div
        className="relative text-center mb-10 sm:mb-12 md:mb-14 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light text-rose-800 mb-2 drop-shadow-sm">
          Heilungs- & Therapieangebote
        </h2>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto leading-relaxed">
          Entdecke heilsame Erfahrungen durch gefühlvolle Podcasts, Meditationen und persönliche Begleitung.
        </p>
      </motion.div>

      {/* SERVICE CARDS GRID */}
      <motion.div
        className="
          relative z-10 
          grid grid-cols-1 
          xs:grid-cols-2 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-5 xs:gap-6 sm:gap-7 lg:gap-8 
          px-4 sm:px-6 lg:px-8 
          max-w-7xl mx-auto
        "
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          visible: { transition: { staggerChildren: 0.12 } },
          hidden: {},
        }}
      >
        {services.map((service) => {
          const Icon = iconComponents[service.icon];
          return (
            <motion.article
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileTap={{ scale: 0.98 }}
              // Hover only on pointer devices
              {...(typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches
                ? { whileHover: { y: -6, scale: 1.04 } }
                : {})}
              className="
                group relative 
                bg-white/25 backdrop-blur-md 
                border border-white/30 
                rounded-2xl p-5 sm:p-6 
                shadow-lg hover:shadow-pink-300/30 
                transition-all duration-500 
                w-full 
                max-w-xs xs:max-w-none 
                mx-auto xs:mx-0 
                overflow-hidden
              "
            >
              {/* GLOW OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-pink-100/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col items-center space-y-3 sm:space-y-4 text-center">
                {/* ICON */}
                <div className="bg-gradient-to-br from-rose-200/70 to-pink-100/70 rounded-full p-3 sm:p-4 shadow-inner group-hover:shadow-pink-300/50 transition-shadow duration-300">
                  {Icon && <Icon size={28} className="sm:size-10 text-rose-700" />}
                </div>

                {/* TITLE */}
                <h3 className="text-lg xs:text-xl sm:text-2xl font-medium text-rose-800 line-clamp-1">
                  {service.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-xs xs:text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-2 break-words px-2">
                  {service.description}
                </p>

                {/* CTA */}
                <Link
                 to="/programspage"
                  className="
                    mt-3 inline-block 
                    bg-rose-300 to-pink-600 
                    hover:from-pink-600 hover:to-rose-700 
                    text-white 
                    px-4 sm:px-5 py-2 sm:py-2.5 
                    rounded-full 
                    text-xs sm:text-sm font-medium 
                    shadow-md hover:shadow-rose-400/50 
                    transition-all duration-300
                  "
                >
                  Mehr erfahren
                </Link>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* CONTACT CTA */}
      <motion.div
        className="text-center mt-14 sm:mt-16 md:mt-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h3 className="text-xl xs:text-2xl sm:text-3xl font-medium text-rose-800 mb-4">
          Bereit für deine Heilungsreise?
        </h3>
        <Link
          to="/contact"
          className="
            inline-block 
            bg-rose-300 
            hover:from-rose-600 hover:to-pink-700 
            text-white 
            px-6 sm:px-8 py-3 sm:py-3.5 
            rounded-full 
            text-base sm:text-lg font-semibold 
            shadow-lg hover:shadow-rose-400/60 
            transition-all duration-300
          "
        >
          Kontaktiere mich
        </Link>
      </motion.div>
    </section>
  );
};

export default ServicesSection;