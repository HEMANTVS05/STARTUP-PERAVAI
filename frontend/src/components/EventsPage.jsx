import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Users, User, AlertCircle, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EventRegistrationModal from './EventRegistrationModal';
import HackathonModal from './HackathonModal';

const GROUP_EVENTS = [
  { id: 'hackathon', name: 'Hackathon', price: 'Rs 1200', limit: '3–5 Members', desc: 'Hemaaaaa Solraaaa', venue: 'TRP', day: 'Both Days', accent: '#0b2140', accentLight: '#e8f0ff' },
  { id: 'shark-tank', name: 'Shark Tank', price: 'Rs 700', limit: 'Limit 5', desc: 'Hemaaa Solraaaa', venue: 'GEETHAM', day: 'Day 1 & 2', accent: '#0b2140', accentLight: '#e8f0ff' },
  { id: 'phoenix-protocol', name: 'Phoenix Protocol', price: 'Rs 500', limit: 'Limit 3', desc: 'Hema Solraaaa', venue: 'TRP', day: 'Day 2', accent: '#0b2140', accentLight: '#e8f0ff' },
  { id: 'junk-to-genius', name: 'Junk to Genius', price: 'Rs 500', limit: 'Limit 3', desc: 'Hema Solraaaa', venue: 'MBA Seminar Hall 1', day: 'Both Days', accent: '#0b2140', accentLight: '#e8f0ff' },
];

const INDIVIDUAL_EVENTS = [
  { id: 'live-podcast', name: 'Live Podcast', price: 'Rs 150', desc: 'Hema Solraaaa', venue: 'GEETHAM', day: 'Both Days', accent: '#a80d11', accentLight: '#fff0f0' },
  { id: 'panel-discussions', name: 'Panel Discussion', price: 'Rs 150', desc: 'Hema Solraaaa', venue: 'GEETHAM', day: 'Day 1', accent: '#a80d11', accentLight: '#fff0f0' },
  { id: 'illogical-marketing', name: 'Illogical Marketing', price: 'Rs 150', desc: 'Hema Solraaaa', venue: 'Hi-Tech Hall 2', day: 'Day 1', accent: '#a80d11', accentLight: '#fff0f0' },
  { id: 'bootcamp', name: 'Bootcamp', price: 'Rs 300', desc: 'Hema Solraaaa', venue: 'MBA Seminar Hall 2', day: 'Both Days', accent: '#a80d11', accentLight: '#fff0f0' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const EventCard = ({ evt, idx, onRegister, isGroup }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={idx}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group flex flex-col overflow-hidden cursor-pointer"
      style={{
        background: '#fff',
        border: `3px solid #111`,
        boxShadow: hovered ? '8px 8px 0px #111' : '4px 4px 0px #111',
        transform: hovered ? 'translate(-2px, -2px)' : 'translate(0,0)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
    >
      {/* Accent top bar */}
      <div style={{ height: '5px', background: evt.accent, width: '100%' }} />

      <div className="flex flex-col flex-1 p-5">
        {/* Category badge + limit */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1"
            style={{ background: evt.accentLight, color: evt.accent, border: `1.5px solid ${evt.accent}` }}
          >
            {isGroup ? '👥 Team Event' : '👤 Individual'}
          </span>
          {evt.limit && (
            <span className="text-[12px] font-black uppercase tracking-widest text-black/70">
              {evt.limit}
            </span>
          )}
        </div>

        {/* Name */}
        <h3
          className="font-black uppercase leading-none tracking-tighter mb-3"
          style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', lineHeight: 1.05 }}
        >
          {evt.name}
        </h3>

        {/* Description */}
        <p className="text-[12px] font-medium text-black/60 leading-relaxed flex-1 mb-4">
          {evt.desc}
        </p>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1 text-[10px] font-bold text-black/50 uppercase tracking-wider">
            <MapPin size={10} /> {evt.venue}
          </span>
          <span className="text-black/30">•</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-black/50 uppercase tracking-wider">
            <Calendar size={10} /> {evt.day}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: '2px solid #111' }}>
          <div>
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-0.5">Fee</p>
            <p className="font-black text-xl text-black leading-none">{evt.price}</p>
          </div>
          <motion.button
            onClick={() => onRegister(evt)}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest px-4 py-2.5 text-white transition-all"
            style={{ background: evt.accent, border: `2px solid ${evt.accent}` }}
          >
            Register <ArrowRight size={12} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ icon: Icon, label, accent }) => (
  <div className="flex items-end gap-4 mb-8">
    <div className="relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: accent, transform: 'translate(4px, 4px)' }}
      />
      <div className="p-3 border-3 border-black" style={{ border: '3px solid #111', background: '#fff' }}>
        <Icon size={22} color={accent} strokeWidth={3} />
      </div>
    </div>
    <div>
      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none text-black">
        {label}
      </h2>
      <div className="h-[3px] w-full mt-1" style={{ background: accent }} />
    </div>
  </div>
);

const EventsPage = () => {
  const navigate = useNavigate();
  const { user, registration } = useAuth();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  const handleRegisterClick = (event) => {
    const hasEventPass = registration &&
      registration.paymentStatus !== 'pending' &&
      registration.passType !== 'None' &&
      registration.passType !== "Visitor's Pass";

    if (!hasEventPass) {
      setShowPaymentAlert(true);
      setTimeout(() => setShowPaymentAlert(false), 4000);
      return;
    }
    setSelectedEvent(event);
  };

  const closeModals = () => setSelectedEvent(null);

  return (
    <div
      className="w-full min-h-screen pb-32 px-4 sm:px-6 lg:px-24 pt-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex items-center gap-6 mb-14"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center transition-all"
          style={{
            width: 44, height: 44,
            border: '3px solid #111',
            background: '#fff',
            boxShadow: '3px 3px 0 #111',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0 #111'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '3px 3px 0 #111'; }}
        >
          <ArrowLeft size={20} className="text-black" />
        </button>
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
              EVENT
            </h1>
            <h1
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none"
              style={{ background: 'linear-gradient(135deg,#a80d11,#d82221 40%,#0b2140 70%,#0f50e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              CATALOG
            </h1>
          </div>
          <p className="font-bold text-black/50 uppercase tracking-[0.25em] text-xs mt-1.5">
            Explore &amp; Register for Sessions
          </p>
        </div>
      </motion.div>

      <div className="h-[4.5px] mb-6 w-full" style={{ background: 'linear-gradient(to right, #000000ff, #000000ff 35%, #000000ff 100%, #0f50e3)' }} />

      {/* Payment Alert */}
      <AnimatePresence>
        {showPaymentAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 mb-10"
            style={{ border: '3px solid #a80d11', background: '#fff5f5', boxShadow: '4px 4px 0 #a80d11' }}
          >
            <AlertCircle className="text-[#a80d11] shrink-0" size={20} />
            <p className="text-[#a80d11] font-black text-sm uppercase tracking-wide">
              You need an Event Pass to register for individual events!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Events */}
      <div className="mb-16">
        <SectionHeader icon={Users} label="Group Events" accent="#0b2140" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {GROUP_EVENTS.map((evt, idx) => (
            <EventCard key={evt.id} evt={evt} idx={idx} onRegister={handleRegisterClick} isGroup={true} />
          ))}
        </div>
      </div>

      {/* Individual Events */}
      <div className="mb-12">
        <SectionHeader icon={User} label="Individual Events" accent="#a80d11" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {INDIVIDUAL_EVENTS.map((evt, idx) => (
            <EventCard key={evt.id} evt={evt} idx={idx} onRegister={handleRegisterClick} isGroup={false} />
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedEvent?.id === 'hackathon' && (
        <HackathonModal isOpen={true} onClose={closeModals} />
      )}
      {selectedEvent && selectedEvent?.id !== 'hackathon' && (
        <EventRegistrationModal event={selectedEvent} onClose={closeModals} />
      )}
    </div>
  );
};

export default EventsPage;
