import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { client } from '../client';

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Testimonials
  useEffect(() => {
    const query = `*[_type == "testimonial"] | order(order asc) {
      _id,
      name,
      title,
      "avatar": avatar.asset->url,
      text
    }`;

    client.fetch(query)
      .then((data) => {
        setTestimonials(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Sanity fetch error:", err);
        setIsLoading(false);
      });
  }, []);

  // Loader
  if (isLoading) {
    return (
      <section className="py-14 sm:py-16 md:py-20 bg-gradient-to-b from-rose-50 via-pink-50 to-white flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-rose-200 border-t-[#b08688] rounded-full animate-spin"></div>
          <p className="text-[#b08688] text-sm font-medium animate-pulse">Loading Reviews...</p>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-14 sm:py-16 md:py-20 bg-gradient-to-br from-pink-50/80 via-rose-100/60 to-white/80 font-poppins">
     
      {/* DECORATIVE ORBS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-6 left-4 w-32 h-32 bg-rose-200/50 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-6 right-4 w-40 h-40 bg-pink-300/40 rounded-full blur-3xl opacity-50 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-14 md:mb-16 px-2 max-w-3xl mx-auto"
        >
          <h3 className="text-center sm:text-3xl font-medium text-rose-800 mb-4">
            Was meine wundervollen Klientinnen sagen
          </h3>
          <p className="mt-3 sm:mt-4 text-sm xs:text-base sm:text-lg text-gray-600 italic">
            Echte Stimmen, echte Veränderung ♡
          </p>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-7 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-full max-w-xs xs:max-w-none mx-auto xs:mx-0 h-full"
            >
              <TestimonialCard testimonial={t} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

// -------------------- Testimonial Card --------------------

const TestimonialCard = ({ testimonial }) => {
  const avatarUrl = testimonial.avatar || "https://placehold.co/200x200/fce7f3/be185d?text=" + testimonial.name.charAt(0);

  return (
    <div className="
      group relative
      bg-white/80 backdrop-blur-md
      border border-white/40
      rounded-2xl p-5 sm:p-6
      shadow-lg hover:shadow-pink-300/30
      transition-all duration-500
      h-full flex flex-col
      overflow-hidden
    ">
     
      {/* Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center h-full">

        {/* Stars */}
        <div className="flex gap-1 mb-4 shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
          ))}
        </div>

        {/* Text Container - FIX: Adjusted Quote Position */}
        <div className="relative w-full mb-6 flex-grow flex items-center justify-center px-1">
          {/* FIX: Moved quote higher (-top-4) and slightly left so it doesn't overlap text */}
          <Quote className="absolute -top-4 left-0 text-rose-200/50 w-8 h-8 -rotate-12 transform group-hover:rotate-0 transition-transform duration-500" />
         
          <p className="text-sm sm:text-base leading-relaxed font-medium text-gray-700 italic relative z-10 break-words hyphens-auto">
             "{testimonial.text}"
          </p>
        </div>

        {/* Divider */}
        <div className="w-10 h-1 bg-rose-100 rounded-full mb-4 shrink-0 group-hover:w-16 transition-all duration-500" />

        {/* Profile */}
        <div className="flex flex-col items-center w-full shrink-0">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-rose-200 rounded-full blur-lg opacity-50 animate-pulse" />
            <img
              src={avatarUrl}
              alt={testimonial.name}
              loading="lazy"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md relative z-10"
            />
          </div>

          <h3 className="text-base font-bold text-rose-800 break-words px-1">
            {testimonial.name}
          </h3>

          {/* FIX: Removed 'line-clamp-1' so full title shows */}
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1 break-words px-1 w-full">
            {testimonial.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
