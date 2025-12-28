// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Server, Lock, Eye, FileText, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="min-h-screen w-full relative overflow-x-hidden font-sans text-slate-800 bg-rose-50"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-50 pointer-events-none" />
      
      {/* Container with responsive padding */}
      <div className="container mx-auto px-4 py-8 md:py-20 max-w-4xl">
        
        <div className="mb-6 md:mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-rose-800 hover:text-rose-600 transition-colors font-medium text-sm md:text-base">
                <ArrowLeft size={18} />
                Zurück zur Startseite
            </Link>
        </div>

        <div
            className="w-full p-6 md:p-12 rounded-3xl"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 10px 40px rgba(236, 72, 153, 0.05)'
            }}
        >
            {/* Header */}
            <div className="border-b border-rose-100 pb-6 mb-8 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-rose-100/50 px-3 py-1 rounded-full text-rose-800 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-3">
                    <Shield size={12} />
                    Rechtliches / Legal
                </div>
                {/* Responsive Font Size for Title */}
                <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-rose-950 mb-2 leading-tight">
                    Datenschutzerklärung
                </h1>
                <p className="text-rose-800/70 italic text-base md:text-lg">
                    Privacy Policy
                </p>
            </div>

            <div className="space-y-10 md:space-y-12">
                {/* Section Template */}
                <Section 
                    icon={<Eye size={24} />} 
                    title="1. Datenschutz auf einen Blick"
                    variants={sectionVariants}
                >
                    <p className="leading-relaxed text-gray-600 text-sm md:text-base">
                        <strong>Allgemeine Hinweise:</strong> Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                    </p>
                </Section>

                <Section 
                    icon={<Server size={24} />} 
                    title="2. Hosting & Sicherheit"
                    variants={sectionVariants}
                >
                    <p className="leading-relaxed text-gray-600 mb-4 text-sm md:text-base">
                        Wir hosten die Inhalte unserer Website bei einem externen Anbieter. Der Anbieter verarbeitet IP-Adressen und technische Daten zur Sicherheit.
                    </p>
                </Section>

                <Section 
                    icon={<FileText size={24} />} 
                    title="3. Verantwortliche Stelle"
                    variants={sectionVariants}
                >
                    <address className="not-italic bg-rose-50/50 p-5 rounded-xl border border-rose-100 text-rose-900 text-sm md:text-base">
                        <strong className="block text-lg font-['Playfair_Display'] mb-2">Marina Therapie</strong>
                        [Ihre Adresse]<br />
                        [PLZ Ort, Österreich]<br />
                        <div className="mt-3 text-xs md:text-sm text-rose-800/80">
                           E-Mail: kontakt@marinatherapie.com
                        </div>
                    </address>
                </Section>

                <Section 
                     icon={<Lock size={24} />} 
                     title="4. Datenerfassung"
                     variants={sectionVariants}
                >
                    <div className="space-y-4 text-sm md:text-base text-gray-600">
                        <div>
                            <h3 className="font-bold text-rose-800">Cookies</h3>
                            <p>Wir verwenden Cookies, um unser Angebot nutzerfreundlicher zu machen.</p>
                        </div>
                    </div>
                </Section>

                 <Section 
                     icon={<Scale size={24} />} 
                     title="5. Ihre Rechte (DSGVO)"
                     variants={sectionVariants}
                >
                    <ul className="space-y-2 text-sm md:text-base text-gray-600 list-disc pl-5 marker:text-rose-400">
                        <li><strong>Widerruf:</strong> Einwilligung jederzeit widerrufbar.</li>
                        <li><strong>Auskunft:</strong> Recht auf Info über gespeicherte Daten.</li>
                        <li><strong>Löschung:</strong> Recht auf Löschung der Daten.</li>
                    </ul>
                </Section>
            </div>
        </div>

        <div className="text-center mt-12 text-rose-800/50 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Marina Therapie. All rights reserved.
        </div>
      </div>
    </motion.div>
  );
};

// Helper Component to keep code clean and responsive
const Section = ({ icon, title, children, variants }) => (
    <motion.section 
        variants={variants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        className="flex flex-col md:flex-row gap-4 md:gap-6"
    >
        {/* Icon hidden on very small screens, shown on md+ */}
        <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-rose-50 items-center justify-center text-rose-500">
            {icon}
        </div>
        <div>
            <h2 className="text-xl md:text-2xl font-['Playfair_Display'] font-bold text-rose-900 mb-3">
                {title}
            </h2>
            {children}
        </div>
    </motion.section>
);

export default PrivacyPolicy;
