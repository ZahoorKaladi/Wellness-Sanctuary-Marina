// src/components/Layout.jsx
import React from 'react';
import Navbar from './navbar';
import Footer from './footer'; // <-- Import the new Footer component

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer /> {/* <-- Add the Footer here */}
    </div>
  );
};

export default Layout;