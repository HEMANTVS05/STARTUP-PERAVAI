import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "Pitch Fest 2026",
    tag: "MAIN STAGE",
    date: "Oct 15, 2026",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    accent: "bg-blue-600",
    textAccent: "text-blue-600",
    borderAccent: "border-blue-600",
  },
  {
    id: 2,
    title: "Founder's Networking",
    tag: "LOUNGE",
    date: "Oct 16, 2026",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut labore et dolore magna aliqua. Quisque id diam vel quam elementum pulvinar etiam non quam lacus.",
    accent: "bg-[#1f2022]",
    textAccent: "text-[#1f2022]",
    borderAccent: "border-[#1f2022]",
  },
  {
    id: 3,
    title: "Startup Hackathon",
    tag: "WORKSHOP",
    date: "Oct 17, 2026",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget nunc lobortis mattis aliquam. Egestas maecenas pharetra convallis posuere morbi leo urna.",
    accent: "bg-yellow-400",
    textAccent: "text-yellow-600",
    borderAccent: "border-yellow-400",
  },
  {
    id: 4,
    title: "Investor Meetup",
    tag: "KEYNOTE",
    date: "Oct 18, 2026",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    accent: "bg-blue-600",
    textAccent: "text-blue-600",
    borderAccent: "border-blue-600",
  },
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

  const event = events[current];

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="w-full border-t-4 border-b-4 border-black py-6 md:py-8 my-10 md:my-16">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-15 md:mb-12 px-4 sm:px-6 lg:px-24">
        <div>
          <p className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Featured Events</p>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-black tracking-tighter leading-none">
            What's<br /><span className="text-blue-600">Happening.</span>
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2 md:gap-4 pb-2">
          <button
            onClick={prev}
            className="w-10 h-10 md:w-14 md:h-14 border-4 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 md:w-14 md:h-14 border-4 border-black bg-black text-white hover:bg-blue-600 hover:border-blue-600 flex items-center justify-center transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Slide Area */}
      <div className="px-4 sm:px-6 lg:px-24">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)]"
          >
            {/* Image Side */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] bg-gray-200 overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-black">
              {/* Filler placeholder with brutalist pattern */}
              <div className="absolute inset-0 bg-gray-100">
                <div className="w-full h-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #e5e7eb 0, #e5e7eb 1px, transparent 0, transparent 50%)',
                    backgroundSize: '20px 20px'
                  }}
                />
              </div>
              {/* Image placeholder label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-4 border-dashed border-gray-400 p-8 text-center">
                  <p className="font-black uppercase text-gray-400 text-xl tracking-widest">Event Image</p>
                  <p className="font-bold text-gray-300 text-sm mt-2 uppercase tracking-widest">Slide {current + 1}</p>
                </div>
              </div>
              {/* Accent tag overlay */}
              <div className={`absolute top-6 left-6 ${event.accent} px-4 py-2 shadow-[3px_3px_0px_rgba(0,0,0,1)]`}>
                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3 text-white" />
                  <span className="text-white font-black text-xs tracking-[0.2em]">{event.tag}</span>
                </div>
              </div>
            </div>

            {/* Description Side */}
            <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-16 bg-white">
              {/* Slide counter */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex gap-2">
                  {events.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
                      className={`h-2 transition-all duration-500 border-2 border-black ${idx === current ? 'w-8 md:w-10 bg-black' : 'w-3 md:w-4 bg-transparent'}`}
                    />
                  ))}
                </div>
                <span className="font-black text-gray-300 text-2xl md:text-4xl">{String(current + 1).padStart(2, '0')}</span>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className={`w-5 h-5 ${event.textAccent}`} />
                  <span className="font-black uppercase tracking-widest text-sm text-gray-500">{event.date}</span>
                </div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase text-black leading-none tracking-tighter mb-6 md:mb-8">
                  {event.title}
                </h3>

                <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                  {event.description}
                </p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-6">
                <button className={`${event.accent} text-white font-black uppercase tracking-widest text-sm px-8 py-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150`}>
                  Register Now
                </button>
                <span className="font-black uppercase text-sm text-black underline decoration-4 underline-offset-4 cursor-pointer hover:text-blue-600 transition-colors">
                  Learn More →
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventSlideshow;
