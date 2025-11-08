import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mic2, BookOpen, Utensils, Globe2 } from "lucide-react";

const radioCareer = [
  {
    icon: <Globe2 className="w-6 h-6 text-rose-400" />,
    title: "Migranten am Wort (Migrants on Air)",
    period: "2010–2011 • Pioneer Project",
    description:
      "A groundbreaking format at Campus & City Radio 94.4 St. Pölten giving voice to people with migration backgrounds — exploring integration, identity, and the art of building bridges between cultures.",
  },
  {
    icon: <Utensils className="w-6 h-6 text-rose-400" />,
    title: "Kochen und Schmecken (Cooking & Tasting)",
    period: "2011–2012 • Cultural Series",
    description:
      "A culinary radio experience blending taste, diversity, and dialogue — where food became a medium for cultural connection and storytelling.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-rose-400" />,
    title: "Literaturstunde (Hour of Literature)",
    period: "2012–2013 • Literary Show",
    description:
      "A soulful exploration of literature as a mirror of human experience — connecting languages, emotions, and consciousness through the power of words.",
  },
  {
    icon: <Mic2 className="w-6 h-6 text-rose-400" />,
    title: "Die Vollkommenheit des Menschen",
    period: "2023 • Wellness Radio Series",
    description:
      "A reflective program dedicated to inner awareness — guiding listeners to transform pain and crisis into strength and mindfulness.",
  },
];

const RadioSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative w-full py-24 px-6 bg-[rgba(30,15,20,0.85)] text-gray-100 overflow-hidden backdrop-blur-sm"
    >
      {/* Soft background gradient for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/40 via-rose-800/50 to-rose-900/70 pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center"
        initial="hidden"
        animate={controls}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* Header */}
        <motion.h2
          variants={fadeUp}
          className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold mb-4 text-rose-300"
        >
          Campus & City Radio 94.4 St. Pölten
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-gray-300 text-lg max-w-3xl mx-auto mb-16 leading-relaxed"
        >
          Since 2009, Marina has been a voice of compassion and awareness at
          <span className="text-rose-400 font-semibold">
            {" "}
            Campus & City Radio 94.4 St. Pölten
          </span>
           creating thoughtful programs that connect culture, language, and
          consciousness. Her broadcasts invite listeners into spaces of
          empathy, reflection, and growth.
        </motion.p>

        {/* Career Timeline */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {radioCareer.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="bg-white/10 border border-rose-200/20 rounded-2xl p-8 text-left shadow-lg hover:shadow-rose-500/20 hover:border-rose-400/40 transition-all duration-500 backdrop-blur-md"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-rose-200 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-rose-400 mb-2">{item.period}</p>
              <p className="text-sm text-gray-200 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing Note */}
        <motion.div
          variants={fadeUp}
          className="mt-20 text-gray-300 max-w-3xl mx-auto text-sm leading-relaxed border-t border-rose-200/20 pt-10"
        >
          Today, Marina continues to bring her warmth and depth to the airwaves,
          merging mindfulness, dialogue, and creative expression — turning
          radio into a sanctuary of learning, empathy, and transformation.
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RadioSection;
