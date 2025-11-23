// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import Layout from "./components/layout";
import ScrollToTop from "./components/scrolltotop";
import { LanguageProvider } from './context/languagecontext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 1. Provider MUST wrap Layout so Navbar can access it */}
      <LanguageProvider>
        
        {/* 2. Helper utility */}
        <ScrollToTop />
        
        {/* 3. Layout contains the Navbar */}
        <Layout>
          {/* 4. App contains the Pages */}
          <App />
        </Layout>

      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);