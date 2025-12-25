// src/components/CookieBanner.jsx
import React from "react";
import CookieConsent from "react-cookie-consent";

const CookieBanner = () => {
  return (
    <CookieConsent
      // FUNCTIONALITY
      location="bottom"
      buttonText="Akzeptieren" // "Accept"
      declineButtonText="Ablehnen" // "Decline"
      enableDeclineButton
      cookieName="marina_wellness_consent"
      expires={150}
      
      // CONTAINER STYLE (Clean White/Rose Theme)
      style={{ 
        background: "rgba(255, 255, 255, 0.98)", // Almost opaque white for readability
        color: "#881337", // Rose-900 (Dark Red/Pink)
        borderTop: "1px solid #ffe4e6", // Rose-200 (Subtle pink border)
        boxShadow: "0 -4px 20px rgba(225, 29, 72, 0.05)", // Very soft rose shadow
        padding: "10px 0",
        alignItems: "center",
        zIndex: 9999 // Ensure it stays on top of everything
      }}

      // PRIMARY BUTTON STYLE (Matches your "Book Session" buttons)
      buttonStyle={{ 
        background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)", // Rose-500 to Rose-600
        color: "#fff", 
        fontSize: "14px",
        fontWeight: "bold",
        borderRadius: "12px", // Soft rounded corners
        padding: "12px 24px",
        margin: "0 15px 0 0",
        border: "none",
        boxShadow: "0 4px 12px rgba(225, 29, 72, 0.25)", // Soft glow
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}

      // SECONDARY BUTTON STYLE (Subtle Outline)
      declineButtonStyle={{
        background: "transparent",
        color: "#9f1239", // Rose-800
        border: "1px solid #fda4af", // Rose-300
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
        padding: "10px 20px",
        margin: "0",
        cursor: "pointer"
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", paddingRight: "20px" }}>
        
        {/* Branding Title */}
        <div style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: "18px", 
          fontWeight: "bold", 
          color: "#881337", 
          marginBottom: "4px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
           <span>🍪</span> 
           Wir verwenden Cookies
        </div>

        {/* Description */}
        <p style={{ 
          fontSize: "13px", 
          lineHeight: "1.5", 
          margin: 0, 
          color: "#4c0519", // Rose-950
          opacity: 0.9 
        }}>
          Wir nutzen Cookies, um Ihnen die bestmögliche, personalisierte Erfahrung auf unserer Wellness-Website zu bieten.
          <a 
            href="/datenschutzerklaerung" 
            style={{ 
              color: "#e11d48", // Rose-600
              marginLeft: "6px", 
              textDecoration: "underline", 
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Datenschutzerklärung lesen
          </a>.
        </p>
      </div>
    </CookieConsent>
  );
};

export default CookieBanner;