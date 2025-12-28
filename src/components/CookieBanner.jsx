// src/components/CookieBanner.jsx
import React from "react";
import CookieConsent from "react-cookie-consent";

const CookieBanner = () => {
  return (
    <CookieConsent
      // --- FUNCTIONALITY ---
      location="bottom"
      buttonText="Akzeptieren"
      declineButtonText="Ablehnen"
      enableDeclineButton
      cookieName="marina_wellness_consent"
      expires={150}
      
      // --- LAYOUT & RESPONSIVENESS (The Fix) ---
      // We use 'containerClasses' instead of 'style' to enable Tailwind's responsive power
      containerClasses="flex flex-col md:flex-row items-center justify-between gap-4 p-6 md:px-10 fixed bottom-0 left-0 w-full z-[9999] bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-[0_-10px_40px_rgba(225,29,72,0.05)] transition-all duration-300"
      
      // --- CONTENT WRAPPER ---
      contentClasses="flex-1 text-center md:text-left mb-2 md:mb-0"

      // --- BUTTONS (Mobile: Full Width | Desktop: Auto Width) ---
      buttonWrapperClasses="flex flex-col sm:flex-row gap-3 w-full md:w-auto"

      // 1. ACCEPT BUTTON
      buttonClasses="!bg-gradient-to-r !from-rose-500 !to-pink-600 !text-white !font-bold !text-sm !py-3 !px-6 !rounded-xl !shadow-lg !shadow-rose-500/20 hover:!shadow-rose-500/40 hover:!scale-[1.02] transition-all !m-0 w-full md:w-auto flex justify-center"
      
      // 2. DECLINE BUTTON
      declineButtonClasses="!bg-transparent !border !border-rose-200 !text-rose-800 !font-medium !text-sm !py-3 !px-6 !rounded-xl hover:!bg-rose-50 transition-all !m-0 w-full md:w-auto flex justify-center"
      
      // Disable default inline styles so our Tailwind classes take priority
      disableStyles={true} 
    >
      {/* --- TEXT CONTENT --- */}
      <div className="max-w-2xl mx-auto md:mx-0">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
           <span className="text-xl">🍪</span> 
           <h3 className="font-['Playfair_Display'] font-bold text-rose-900 text-lg">
             Wir verwenden Cookies
           </h3>
        </div>

        <p className="text-sm text-rose-950/80 leading-relaxed">
          Wir nutzen Cookies für eine bessere, personalisierte Wellness-Erfahrung.
          <a 
            href="/datenschutzerklaerung" 
            className="text-rose-600 font-semibold underline decoration-rose-300 underline-offset-2 hover:text-rose-800 ml-1 transition-colors"
          >
            Datenschutzerklärung lesen
          </a>.
        </p>
      </div>
    </CookieConsent>
  );
};

export default CookieBanner;
