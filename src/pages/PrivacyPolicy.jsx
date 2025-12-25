// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Server, Lock, Eye, FileText, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  // Animation: How the whole page enters and exits
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } } // Smoothly fades out upward
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="min-h-screen w-full relative overflow-hidden font-sans text-slate-800 bg-rose-50"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit" // This triggers when you leave the page
    >
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50/30 -z-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-pink-200/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-purple-200/20 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        
        {/* --- NAVIGATION --- */}
        <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-rose-800 hover:text-rose-600 transition-colors font-medium">
                <ArrowLeft size={20} />
                Zurück zur Startseite (Back to Home)
            </Link>
        </div>

        {/* --- MAIN CARD --- */}
        <div
            className="w-full p-8 md:p-12 lg:p-16 rounded-[2.5rem]"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 20px 50px rgba(236, 72, 153, 0.05)'
            }}
        >
            {/* Header */}
            <div className="border-b border-rose-100 pb-8 mb-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-rose-100/50 px-4 py-1 rounded-full text-rose-800 text-xs font-bold tracking-widest uppercase mb-4">
                    <Shield size={14} />
                    Rechtliches / Legal
                </div>
                <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-rose-950 mb-2">
                    Datenschutzerklärung
                </h1>
                <p className="text-rose-800/70 italic text-lg">
                    Privacy Policy
                </p>
            </div>

            <div className="space-y-12">
                {/* 1. Intro */}
                <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex gap-6">
                    <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-rose-50 items-center justify-center text-rose-500">
                        <Eye size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-rose-900 mb-4">
                            1. Datenschutz auf einen Blick
                        </h2>
                        <p className="leading-relaxed text-gray-600 mb-2">
                            <strong>Allgemeine Hinweise:</strong> Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                        </p>
                    </div>
                </motion.section>

                {/* 2. Hosting */}
                <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex gap-6">
                    <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-rose-50 items-center justify-center text-rose-500">
                        <Server size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-rose-900 mb-4">
                            2. Hosting & Sicherheit
                        </h2>
                        <p className="leading-relaxed text-gray-600 mb-4">
                            Wir hosten die Inhalte unserer Website bei einem externen Anbieter (Hoster). Der Anbieter verarbeitet IP-Adressen und technische Daten, um die Sicherheit der Website zu gewährleisten.
                        </p>
                        <div className="bg-white/60 border border-rose-100 p-4 rounded-xl text-sm text-gray-600">
                            <strong>Hoster Information:</strong><br />
                            [BITTE HIER Hoster EINFÜGEN, z.B. Vercel Inc. / Netlify / Hetzner Online GmbH]
                        </div>
                    </div>
                </motion.section>

                {/* 3. Responsible Party */}
                <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex gap-6">
                    <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-rose-50 items-center justify-center text-rose-500">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-rose-900 mb-4">
                            3. Verantwortliche Stelle
                        </h2>
                        <p className="mb-4 text-gray-600">
                            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                        </p>
                        <address className="not-italic bg-rose-50/80 p-6 rounded-2xl border border-rose-100 text-rose-900">
                            <strong className="block text-lg font-['Playfair_Display'] mb-2">[MARINA NAME / BUSINESS NAME]</strong>
                            [Straße und Hausnummer]<br />
                            [PLZ und Ort, Österreich]<br />
                            <br />
                            <div className="flex flex-col gap-1 mt-2">
                                <span className="font-semibold">E-Mail: <span className="font-normal">[E-Mail Adresse]</span></span>
                                <span className="font-semibold">Telefon: <span className="font-normal">[Telefonnummer, optional]</span></span>
                            </div>
                        </address>
                    </div>
                </motion.section>

                {/* 4. Data Collection */}
                <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex gap-6">
                    <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-rose-50 items-center justify-center text-rose-500">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-rose-900 mb-4">
                            4. Datenerfassung
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-rose-800 mb-2">Cookies</h3>
                                <p className="leading-relaxed text-gray-600">
                                    Unsere Internetseiten verwenden so genannte „Cookies“. Diese dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-800 mb-2">Kontaktformular / Buchung</h3>
                                <p className="leading-relaxed text-gray-600">
                                    Wenn Sie uns per Kontaktformular oder Buchungssystem Anfragen zukommen lassen, werden Ihre Angaben (Name, E-Mail, Telefon) zwecks Bearbeitung der Anfrage bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* 5. Rights */}
                <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex gap-6">
                    <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-rose-50 items-center justify-center text-rose-500">
                        <Scale size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-rose-900 mb-4">
                            5. Ihre Rechte (DSGVO)
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></div>
                                <span><strong>Widerruf:</strong> Sie können eine bereits erteilte Einwilligung jederzeit widerrufen.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></div>
                                <span><strong>Auskunft:</strong> Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></div>
                                <span><strong>Löschung:</strong> Sie können die Löschung Ihrer Daten verlangen.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></div>
                                <span><strong>Beschwerde:</strong> Es steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</span>
                            </li>
                        </ul>
                    </div>
                </motion.section>

            </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-rose-800/50 text-sm">
            &copy; {new Date().getFullYear()} Marina Wellness. All rights reserved.
        </div>

      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;