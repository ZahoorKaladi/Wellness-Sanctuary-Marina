// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// --- GLOBAL COMPONENTS ---
import CookieBanner from "./components/CookieBanner";
import ScrollToTop from "./components/scrolltotop";    // Use the file we created
import LoadingSpinner from "./components/LoadingSpinner"; // Use the file we created

// --- ASSETS ---
import Bg2 from './assets/Bg2.jpg';

// --- LAZY LOAD PAGES (PERFORMANCE OPTIMIZATION) ---
// This prevents the browser from downloading the entire site at once.
// It loads pages only when the user clicks on them.
const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about"));
const Contact = lazy(() => import("./pages/contact"));
const Service = lazy(() => import("./pages/service"));
const Donation = lazy(() => import("./pages/sessionbooking"));
const ProgramsPage = lazy(() => import("./pages/programs/programspage"));
const BlogPage = lazy(() => import("./pages/blog"));
const BlogPostPage = lazy(() => import("./pages/blog/[slug]"));
const ProductDetailPage = lazy(() => import("./pages/services/[slug]"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

function App() {
  const location = useLocation();

  return (
    <div 
      className="min-h-screen w-full relative"
      style={{
        backgroundImage: `url(${Bg2})`,
        backgroundSize: 'cover', 
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      {/* 1. SCROLL RESTORATION: Ensures new pages start at the top */}
      <ScrollToTop />

      {/* 2. LOADING STATE: Shows the calming flower spinner while pages load */}
      <Suspense fallback={<LoadingSpinner />}>
        
        {/* 3. PAGE TRANSITIONS: Smooth fade-out/fade-in animation */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/service" element={<Service />} />
            <Route path="/sessionbooking" element={<Donation />} />
            <Route path="/ProgramsPage" element={<ProgramsPage />} />
            
            {/* Dynamic Content */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} /> 
            <Route path="/services/:slug" element={<ProductDetailPage />} />

            {/* Legal Pages */}
            <Route path="/datenschutzerklaerung" element={<PrivacyPolicy />} />
          </Routes>
        </AnimatePresence>

      </Suspense>

      {/* 4. COMPLIANCE: Cookie Banner (Overlay) */}
      <CookieBanner />
    </div>
  );
}

export default App;