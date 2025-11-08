// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Service from "./pages/service"; // Service.jsx
import Donation from "./pages/sessionbooking";
import ProgramsPage from "./pages/programs/programspage";
import BlogPostPage from "./pages/blog/[slug]";
import BlogPage from "./pages/blog";
import ProductDetailPage from "./pages/services/[slug]"; // services/[slug].jsx
import Bg2 from './assets/Bg2.jpg';

function App() {
  return (
   // Root Body: Fixed Background Image and Color
    <div 
      className="min-h-screen w-full p-0 flex flex-col items-center text-text-dark"
      style={{
        backgroundImage: `url(${Bg2})`,
        backgroundSize: 'cover', 
        backgroundAttachment: 'fixed',
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} /> {/* This renders Service.jsx */}
        <Route path="/sessionbooking" element={<Donation />} />
        <Route path="/ProgramsPage" element={<ProgramsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} /> 
  
        {/* THIS DYNAMIC ROUTE IS CORRECTLY DEFINED AND MATCHES THE NEW LINKS */}
        <Route path="/services/:slug" element={<ProductDetailPage />} /> {/* This renders services/[slug].jsx */}
      </Routes>
    </div>
  );
}

export default App;