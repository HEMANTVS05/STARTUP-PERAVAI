import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Menu, X } from 'lucide-react';
import EventSlideshow from './EventSlideshow';

const EventCard = ({ title, date, color, textColor, border, rotate, style }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: 0 }}
    className={`p-6 md:p-8 ${color} ${textColor} ${border} noise-bg flex flex-col justify-between h-52 md:h-64 transform ${rotate} cursor-pointer transition-all duration-300 shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_rgba(0,0,0,1)]`}
    style={style}
  >
    <div>
      <h4 className="text-2xl md:text-3xl font-black uppercase mb-2 leading-tight">{title}</h4>
      <p className="font-bold opacity-80 uppercase tracking-widest text-xs md:text-sm">{date}</p>
    </div>
    <div className="flex justify-between items-end">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-current flex items-center justify-center">
        <Star className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
      </div>
      <span className="font-black text-base md:text-xl uppercase underline decoration-4 underline-offset-4">Join Now</span>
    </div>
  </motion.div>
);

const redGrad = {
  background: 'linear-gradient(135deg, #a80d11, #d82221)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};
const blueGrad = {
  background: 'linear-gradient(135deg, #0b2140, #0f50e3)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};
const blueGrad2 = {
  background: 'linear-gradient(130deg, #0b2140, #0f50e3)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full min-h-screen pt-3 md:pt-4 pb-24 md:pb-32 px-4 sm:px-6 lg:px-24">

      {/* ── Navbar slides down ── */}
      <motion.nav
        className="flex justify-between items-center mb-0 pb-3 md:pb-4"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-blue-600 tracking-tighter leading-none">
          <img src="peravai_logo.png" alt="Peravai Logo" className="h-30 md:h-30 w-80" />
        </h1>

        {/* Desktop nav links */}
        <div className="hidden lg:flex gap-8 xl:gap-12 text-sm font-black text-gray-500 uppercase tracking-widest">
          <a href="#" className="hover:text-black transition-colors">Insights</a>
          <a href="#" className="hover:text-black transition-colors">Events</a>
          <a href="#" className="hover:text-black transition-colors">Speakers</a>
          <a href="#" className="hover:text-black transition-colors">Mission</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden w-12 h-12 border-4 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* ── Brand gradient divider draws left → right ── */}
      <motion.div
        className="h-[4px] mb-8 md:mb-12 origin-left"
        style={{ background: 'linear-gradient(to right, #a80d11, #d82221 30%, #0b2140 70%, #0f50e3)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden lg:hidden border-4 border-black bg-white mb-10 shadow-[6px_6px_0px_rgba(0,0,0,1)]"
          >
            {['Insights', 'Events', 'Speakers', 'Mission'].map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="block px-8 py-4 font-black uppercase tracking-widest text-gray-600 border-b-2 border-black last:border-b-0 hover:bg-black hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Headline: words sweep up with stagger ── */}
      <div className="text-center mb-20 md:mb-32 relative z-10">
        <h2 className="text-[#1f2022] text-[2.8rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] font-black uppercase tracking-tighter leading-[0.85]">

          {/* Line 1 — HEMA ilana. */}
          <span className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              style={redGrad}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >HEMA&nbsp;</motion.span>
          </span>
          <span className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={blueGrad}>ila</span>na.
            </motion.span>
          </span>

          <br />

          {/* Line 2 — EASWARI ila. */}
          <span className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.99, ease: [0.22, 1, 0.36, 1] }}
            >EASWARI&nbsp;</motion.span>
          </span>
          <span className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={blueGrad2}>ila</span>.
            </motion.span>
          </span>

        </h2>
      </div>

      {/* ── Everything below fades up after headline ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Events Slideshow */}
        <EventSlideshow />

        {/* Upcoming Events Section */}
        <div className="mt-24 md:mt-48 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-16 border-b-8 border-black pb-6 md:pb-8 gap-4">
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase text-black tracking-tighter leading-none">
              Upcoming <br />
              <span style={{ background: 'linear-gradient(135deg, #0b2140, #0f50e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Events.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-12 mt-8 md:mt-16">
            <EventCard
              title="Pitch Fest 2026"
              date="Oct 15 - 10:00 AM"
              color=""
              textColor="text-white"
              border="border-0"
              rotate="-rotate-2"
              style={{ background: 'linear-gradient(135deg, #0b2140, #0f50e3)' }}
            />
            <EventCard
              title="Investor Meetup"
              date="Oct 16 - 02:00 PM"
              color=""
              textColor="text-white"
              border="border-0"
              rotate="rotate-3"
              style={{ background: 'linear-gradient(135deg, #a80d11, #d82221)' }}
            />
            <EventCard
              title="Startup Hackathon"
              date="Oct 17 - 09:00 AM"
              color="bg-transparent"
              textColor="text-black"
              border="border-8 border-black"
              rotate="-rotate-1"
            />
            <EventCard
              title="Networking"
              date="Oct 18 - 07:00 PM"
              color="bg-yellow-400"
              textColor="text-black"
              border="border-0"
              rotate="rotate-2"
            />
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default MainLayout;
