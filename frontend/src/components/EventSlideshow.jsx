import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import minister from "../assets/minister1.jpeg";
import team from "../assets/team1.jpeg";

const events = [
  {
    id: 1,
    title: (
      <>
        Minister Launches <br /> <span>Startup Peravai</span>
      </>
    ),
    description: "An impactful beginning marked by the honorable minister officially launching the Peravai, setting the stage for 2 days of innovation, networking, and growth for the startup ecosystem.",
    image: minister,
  },
  {
    id: 2,
    title: "Peravai Team",
    description: "Transform waste into wonder. Join innovative minds as they engineer brilliant solutions from everyday scrap, competing for top honors in sustainable creation.",
    image: team,
  },
  {
    id: 3,
    title: "Founder's Networking",
    description: "Connect with the brightest minds in the ecosystem. An exclusive evening of high-value conversations, partnership building, and knowledge sharing among top founders.",
    image: null,
  },
  {
    id: 4,
    title: "Startup Hackathon",
    description: "A 48-hour sprint to build the future. Collaborate with developers, designers, and visionaries to prototype groundbreaking products and pitch to top investors.",
    image: null,
  }
];

const EventSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % events.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + events.length) % events.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 1 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
  };

  const event = events[current];

  return (
    <div className="w-full py-6 md:py-8 my-10 md:my-16">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 md:mb-12 px-4 sm:px-6 lg:px-24">
        <div>
          <p className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Featured Highlights</p>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-black tracking-tighter leading-none">
            Event<br /><span className="text-[#a80d11]">Highlights</span>
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2 md:gap-4 pb-2 z-10">
          <button
            onClick={prev}
            className="w-10 h-10 md:w-14 md:h-14 border-4 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 md:w-14 md:h-14 border-4 border-black bg-black text-white hover:bg-[#a80d11] hover:border-[#a80d11] flex items-center justify-center transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-24">
        <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[21/9] lg:h-[650px] bg-gray-200 overflow-hidden border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] group">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              {event.image ? (
                <img
                  src={event.image}
                  alt={typeof event.title === 'string' ? event.title : 'Event Highlight'}
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ objectPosition: 'center top' }}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="w-full h-full opacity-30"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #e5e7eb 0, #e5e7eb 1px, transparent 0, transparent 50%)',
                      backgroundSize: '20px 20px'
                    }}
                  />
                  <p className="absolute font-black text-4xl text-gray-300 uppercase tracking-widest">Image Coming Soon</p>
                </div>
              )}

              {/* Overlay gradient at bottom to ensure text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Title and Description Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 text-white flex flex-col justify-end">
                <h3 className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-3 sm:mb-5 drop-shadow-md">
                  {event.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-200 font-bold max-w-3xl leading-relaxed uppercase tracking-wider drop-shadow-md">
                  {event.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EventSlideshow;
