// app/src/components/BlogSection.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { client, urlFor } from "../client";

const postQuery = `*[_type == "post"] | order(publishedAt desc)[0...6] {
  _id,
  title,
  excerpt,
  mainImage,
  "slug": slug.current
}`;

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4500,
  arrows: false,
  centerMode: true,
  centerPadding: "60px",
  cssEase: "cubic-bezier(0.6, 0.05, 0.2, 0.95)",
  responsive: [
    { breakpoint: 640,  settings: { slidesToShow: 1, centerPadding: "20px" } },
    { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "40px" } },
    { breakpoint: 1280, settings: { slidesToShow: 3, centerPadding: "60px" } },
  ],
};

const BlogSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(postQuery)
      .then((data) => {
        setPosts(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-rose-50/80 via-white to-pink-50/50"
    >
      {/* Soft dreamy background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#b08688]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* === PERFECTLY RESPONSIVE TITLE === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 lg:mb-24 px-2"
        >
          <h3
            className="
              font-bold 
              text-3xl          /* Mobile Base */
              xs:text-4xl       /* Large Phone */
              sm:text-5xl       /* Tablet */
              md:text-6xl       /* Laptop */
              lg:text-6xl       /* Desktop */
              xl:text-7xl       /* Large Desktop */
              leading-[1.1]     /* Tighter line height prevents large gaps */
              tracking-tight 
              text-transparent 
              bg-clip-text 
              bg-gradient-to-r 
              from-[#b08688] 
              via-[#b08688] 
              to-pink-500 
              max-w-5xl 
              mx-auto
              w-full
              break-words       /* Prevents text from overflowing screen */
            "
          >
            From Marina’s Journal
          </h3>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 font-light italic max-w-2xl mx-auto leading-relaxed"> {/* Reverted to leading-relaxed */}  
            All Services for your well-being
          </p>
        </motion.div>

        {/* Loading / Empty / Slider */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto border-4 border-[#b08688]/20 border-t-[#b08688] rounded-full animate-spin" />
            <p className="mt-4 text-[#b08688]/70 font-light">Loading journal...</p>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-16 text-gray-500 italic">No journal entries yet ♡</p>
        ) : (
          <Slider {...sliderSettings}>
            {posts.map((post) => (
              <div key={post._id} className="px-3 sm:px-5 py-4"> {/* Added py-4 to prevent shadow clip */}
                <Link to={`/blog/${post.slug || post._id}`}>
                  <motion.article
                    whileHover={{ y: -10 }}
                    className="group relative bg-white/85 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-white/60 h-full flex flex-col hover:shadow-2xl hover:border-[#b08688]/40 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-rose-50 to-pink-50">
                      {post.mainImage ? (
                        <img
                          src={urlFor(post.mainImage).width(800).height(600).fit("crop").quality(85).url()}
                          alt={post.title || "Journal post"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl text-rose-200">♡</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute bottom-4 left-5 text-white text-xs font-semibold tracking-widest">
                        JOURNAL
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#b08688] transition-colors">
                          {post.title || "Untitled"}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 font-light">
                          {post.excerpt || "A gentle reflection on feminine energy and soulful living..."}
                        </p>
                      </div>

                      <div className="mt-5">
                        <span className="inline-block px-5 py-2.5 bg-[#b08688]/10 text-[#b08688] font-medium text-sm rounded-full hover:bg-[#b08688] hover:text-white transition-all duration-300 shadow-lg">
                          Read More
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default BlogSection;