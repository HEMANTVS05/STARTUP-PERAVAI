import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Users, ChevronRight, SkipForward } from 'lucide-react';
import poster1 from '../assets/ippopay.png';
import poster2 from '../assets/chaikings.png';

// ── Session Data ────────────────────────────────────────────────────────────────
const SESSIONS = {
  day1: {
    label: 'Day 1',
    date: 'Oct 30, 2026',
    color: '#a80d11',
    sessions: [
      {
        id: 'd1-p1', type: 'podcast',
        title: "Mohan K",
        time: 'Ippopay Co-Founder',
        titleColor: '#19afd0',
        desc: 'Are you fascinated by FinTech and curious about how UPI, digital payments and merchant transactions actually work in India? Join Mohan K, Co-Founder & CEO of IppoPay, for a live podcast on the technology, innovation and business transforming the way India pays. Perfect for students, aspiring FinTech founders and anyone curious about the future of digital payments in India.',
        poster: poster1,
      },
      {
        id: 'd1-p2', type: 'podcast',
        title: '',
        time: '',
        titleColor: '',
        desc: '',
        poster: null,
      },
      {
        id: 'd1-panel1', type: 'panel',
        title: 'The New Industrial Revolution',
        time: 'Where Startups, Manufacturing & Emergin Technologies Converge',
        titleColor: '#92400e',   // amber-brown — industrial / manufacturing
        desc: 'Curious about where the next wave of industrial innovation is coming from? This panel brings together the worlds of startups, manufacturing and emerging technologies to unpack how AI, robotics, automation, advanced engineering and deep tech are reshaping the way industries build, operate and scale. A must-attend conversation for aspiring founders, engineers, innovators and anyone interested in the future of industry.',
        poster: null,
      },
      {
        id: 'd1-panel2', type: 'panel',
        title: 'Beyond the Metros',
        time: 'Building Companies, Capabilities & Capital Across the Next Generation of Indian Cities',
        titleColor: '#5b21b6',   // violet — emerging cities / next-gen
        desc: 'India’s next entrepreneurial hotspots are emerging beyond the metros. This panel brings together founders, investors and ecosystem leaders to explore how Tier 2 and Tier 3 cities are building companies, developing local talent, attracting capital and creating thriving startup ecosystems. A must-attend conversation for anyone interested in the next generation of India’s business and innovation hubs.',
        poster: null,
      },
    ],
  },
  day2: {
    label: 'Day 2',
    date: 'Oct 31, 2026',
    color: '#0b2140',
    sessions: [
      {
        id: 'd2-p1', type: 'podcast',
        title: 'Jahabar sadique',
        time: 'Chai Kings Co-Founder',
        titleColor: '#00a652',   // teal — original Chai Kings popup color
        desc: 'For those curious about entrepreneurship, consumer brands and building a successful franchise, this conversation with Jahabar Sadique, Co-Founder of Chai Kings, explores how a simple idea can grow into a recognisable homegrown brand through customer insight, branding, operations and smart expansion. Join us for a live podcast on building, scaling and creating a successful franchise business.',
        poster: poster2,
      },
      {
        id: 'd2-p2', type: 'podcast',
        title: 'Funding in the New Economy',
        time: '12:00 PM',
        titleColor: '#b45309',   // warm orange — economy / finance
        desc: '',
        poster: null,
      },
      {
        id: 'd2-panel1', type: 'panel',
        title: "The Investor's Perspective",
        time: '2:00 PM',
        titleColor: '#065f46',   // emerald — investors / growth
        desc: '',
        poster: null,
      },
      {
        id: 'd2-panel2', type: 'panel',
        title: 'Tech for Tamil Nadu',
        time: '4:00 PM',
        titleColor: '#a80d11',   // red — Tamil Nadu flagship brand color
        desc: '',
        poster: null,
      },
    ],
  },
};

// ── Session Card ────────────────────────────────────────────────────────────────
const SessionCard = ({ session, dayColor, selected, disabled, onSelect, onLearnMore }) => {
  const [expanded, setExpanded] = useState(false);
  const isPodcast = session.type === 'podcast';

  return (
    <motion.div
      onClick={() => !disabled && onSelect(session)}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`relative flex flex-col border-4 overflow-hidden transition-all ${selected
        ? 'border-[#a80d11] shadow-[6px_6px_0px_rgba(168,13,17,0.5)]'
        : disabled
          ? 'border-black/15 opacity-30 cursor-not-allowed'
          : 'border-black hover:shadow-[6px_6px_0px_rgba(0,0,0,0.85)] cursor-pointer shadow-[4px_4px_0px_rgba(0,0,0,0.7)]'
        }`}
      style={{ background: selected ? '#fff5f5' : '#ffffff' }}
    >
      {/* Colour strip at top */}
      <div
        className="h-[5px] w-full shrink-0"
        style={{ background: selected ? '#a80d11' : dayColor }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Type badge */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0"
            style={{ background: selected ? '#a80d11' : dayColor }}
          >
            {isPodcast
              ? <Mic className="w-4 h-4 text-white" />
              : <Users className="w-4 h-4 text-white" />
            }
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-black/50 border-b-2 border-black/20 pb-0.5">
            {isPodcast ? 'Live Podcast' : 'Panel Discussion'}
          </span>
        </div>

        {/* Title */}
        <p className="font-black text-base text-black leading-snug mb-2">
          {session.title}
        </p>

        {/* Time */}
        <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-3">
          {session.time}
        </p>

        {/* Description space */}
        <div className="flex-1 mb-3 min-h-[52px]">
          {session.desc ? (
            <div>
              <p
                className="text-md text-black/70 font-bold leading-relaxed"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: expanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: expanded ? 'visible' : 'hidden',
                }}
              >
                {session.desc}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
                className="mt-1.5 text-[13px] font-black uppercase tracking-widest text-[#a80d11] hover:underline flex items-center gap-0.5 transition-all"
              >
                {expanded ? '▲ Show Less' : '▼ Read More'}
              </button>
            </div>
          ) : (
            <p className="text-xs text-black/25 font-bold italic">Description coming soon...</p>
          )}
        </div>

        {/* Selected indicator / Learn More */}
        <div className="flex items-center justify-between border-t-2 border-black/10 pt-3">
          {selected ? (
            <span className="text-[11px] font-black uppercase tracking-widest text-[#a80d11] flex items-center gap-1.5">
              <div className="w-4 h-4 bg-[#a80d11] flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              Selected
            </span>
          ) : (
            <span />
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onLearnMore(session); }}
            className="text-[13px] font-black uppercase tracking-widest text-[#a80d11] hover:underline flex items-center gap-1 transition-all"
          >
            Learn More <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Poster Popup (16:9, no text) ────────────────────────────────────────────────
const PosterPopup = ({ session, dayLabel, onClose }) => {
  if (!session) return null;
  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 bg-black/90" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 260 }}
        className="relative z-10 w-full max-w-5xl border-4 border-white shadow-2xl overflow-hidden bg-black"
      >
        {/* Title bar — uses per-session colour */}
        <div className="border-b-4 border-white px-5 py-3 flex items-center justify-between" style={{ background: session.titleColor || '#19afd0' }}>
          <div>
            <p className="text-white/60 text-[15px] font-black uppercase tracking-widest">{dayLabel}</p>
            <p className="text-white font-black text-lg leading-tight">{session.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors ml-4 shrink-0"
          >
            <X className="w-4 h-4 text-[#a80d11] hover:text-white" />
          </button>
        </div>

        {/* Poster — 16:9 */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <div className="absolute inset-0">
            {session.poster ? (
              <img src={session.poster} alt="Event poster" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#0b2140] flex flex-col items-center justify-center gap-4">
                <div className="text-7xl">{session.type === 'podcast' ? '🎙️' : '🎤'}</div>
                <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em]">Poster Coming Soon</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main SessionPickerModal ─────────────────────────────────────────────────────
const SessionPickerModal = ({ isOpen, onSkip, onNext, onBack }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [learnMoreSession, setLearnMoreSession] = useState(null);
  const [learnMoreDay, setLearnMoreDay] = useState('');

  if (!isOpen) return null;

  const handleSelect = (session) => {
    setSelectedSession(prev => prev?.id === session.id ? null : session);
  };

  const d1 = SESSIONS.day1;
  const d2 = SESSIONS.day2;
  const d1Podcasts = d1.sessions.filter(s => s.type === 'podcast');
  const d1Panels = d1.sessions.filter(s => s.type === 'panel');
  const d2Podcasts = d2.sessions.filter(s => s.type === 'podcast');
  const d2Panels = d2.sessions.filter(s => s.type === 'panel');

  const renderCard = (session, dayData) => (
    <SessionCard
      key={session.id}
      session={session}
      dayColor={dayData.color}
      selected={selectedSession?.id === session.id}
      disabled={!!(selectedSession && selectedSession.id !== session.id)}
      onSelect={handleSelect}
      onLearnMore={(s) => { setLearnMoreSession(s); setLearnMoreDay(dayData.label); }}
    />
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />

        {/* Modal — nearly fullscreen */}
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-h-[95vh] flex flex-col bg-[#f6f4ee] border-4 border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] overflow-hidden"
          style={{ maxWidth: 'min(1300px, calc(100vw - 24px))' }}
        >
          {/* ── Header (matches VisitorPassPaymentModal style) */}
          <div className="bg-[#a80d11] border-b-4 border-black px-8 py-5 shrink-0 flex items-start justify-between">
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.35em] mb-1.5">Choose Any 1 Session</p>
              <h2 className="text-white text-4xl font-black uppercase tracking-tight leading-none">Before That...</h2>
            </div>
            <button
              onClick={onSkip}
              className="w-9 h-9 bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors shrink-0 ml-6"
            >
              <X className="w-4 h-4 text-[#a80d11]" />
            </button>
          </div>

          {/* ── Body (Scrollable Area) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">

            {/* ── NOTE Box (Now scrollable) */}
            <div className="bg-[#f6f4ee] border-b-4 border-black px-8 py-5 shrink-0">
              <div className="border-4 border-black bg-[#0b2140] shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <div className="flex items-stretch">
                  {/* Left accent bar with ! */}
                  <div className="bg-[#a80d11] border-r-4 border-black px-4 flex items-center justify-center shrink-0">
                    <span className="text-white font-black text-2xl">!</span>
                  </div>
                  {/* Content */}
                  <div className="px-6 py-4">
                    <p className="text-[#f59e0b] font-black text-base uppercase tracking-[0.3em] mb-2">Note</p>
                    <p className="text-white font-black text-base leading-relaxed">
                      To ensure fair participation for all attendees, each visitor pass will provide access to{' '}
                      <span className="text-[#f59e0b] underline underline-offset-2">one session only</span>.
                      {' '}We encourage you to choose your session carefully based on your interests and make the most of the opportunity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Day 1 | divider | Day 2 */}
            <div className="flex flex-grow divide-x-4 divide-black">

              {/* ── Day 1 half */}
              <div className="flex-1 px-6 py-7">
                {/* Day 1 header */}
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-4 border-black">
                  <div className="w-10 h-10 bg-[#a80d11] border-2 border-black flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-black">D1</span>
                  </div>
                  <div>
                    <p className="font-black text-xl uppercase tracking-tight text-black">Day 1</p>
                    <p className="text-xs text-black/40 font-black uppercase tracking-widest">Oct 30, 2026</p>
                  </div>
                </div>

                {/* D1 Podcasts */}
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-3 border-b border-black/10 pb-1">Live Podcasts</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {d1Podcasts.map(s => renderCard(s, d1))}
                </div>

                {/* D1 Panels */}
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-3 border-b border-black/10 pb-1">Panel Discussions</p>
                <div className="grid grid-cols-2 gap-4">
                  {d1Panels.map(s => renderCard(s, d1))}
                </div>
              </div>

              {/* ── Day 2 half */}
              <div className="flex-1 px-6 py-7">
                {/* Day 2 header */}
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-4 border-black">
                  <div className="w-10 h-10 bg-[#0b2140] border-2 border-black flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-black">D2</span>
                  </div>
                  <div>
                    <p className="font-black text-xl uppercase tracking-tight text-black">Day 2</p>
                    <p className="text-xs text-black/40 font-black uppercase tracking-widest">Oct 31, 2026</p>
                  </div>
                </div>

                {/* D2 Podcasts */}
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-3 border-b border-black/10 pb-1">Live Podcasts</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {d2Podcasts.map(s => renderCard(s, d2))}
                </div>

                {/* D2 Panels */}
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-3 border-b border-black/10 pb-1">Panel Discussions</p>
                <div className="grid grid-cols-2 gap-4">
                  {d2Panels.map(s => renderCard(s, d2))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer */}
          <div className="shrink-0 bg-[#f6f4ee] border-t-4 border-black px-8 py-4 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
            <div>
              {selectedSession ? (
                <p className="text-sm font-black text-black flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#a80d11] border-2 border-black flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Selected: <span className="text-[#a80d11]">{selectedSession.title}</span>
                </p>
              ) : (
                <p className="text-sm text-black/40 font-black uppercase tracking-widest">No session selected (optional)</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onSkip}
                className="flex items-center gap-2 px-6 py-3 border-4 border-black bg-white text-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <SkipForward className="w-4 h-4" /> Skip
              </button>
              <button
                onClick={() => onNext(selectedSession)}
                className="flex items-center gap-2 px-8 py-3 border-4 border-black bg-[#a80d11] text-white font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Poster popup */}
        <AnimatePresence>
          {learnMoreSession && (
            <PosterPopup
              session={learnMoreSession}
              dayLabel={learnMoreDay}
              onClose={() => setLearnMoreSession(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export { SESSIONS };
export default SessionPickerModal;
