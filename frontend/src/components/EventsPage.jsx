import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Users, User, AlertCircle, MapPin, Calendar, ArrowRight, X, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EventRegistrationModal from './EventRegistrationModal';
import HackathonModal from './HackathonModal';

const GROUP_EVENTS = [
  {
    id: 'hackathon', name: 'Hackathon', limit: '3–5 Members', desc: 'Hemaaaaa Solraaaa',
    venue: 'TRP', day: 'Both Days', accent: '#0b2140', accentLight: '#e8f0ff',
    rules: [
      { title: '1. Team Size', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Teams must consist of 3 to 5 members. Each member must be a registered participant of the event.' },
      { title: '2. Eligibility', body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. All participants must be currently enrolled students with a valid college ID.' },
      { title: '3. Problem Statement', body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Teams will be assigned a problem statement at the start of the event and must build a solution within the given time.' },
      { title: '4. Submission', body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. All code must be submitted via the official platform before the deadline.' },
      { title: '5. Judging Criteria', body: 'Excepteur sint occaecat cupidatat non proident. Projects will be judged on innovation, technical complexity, design, and presentation skills.' },
      { title: '6. Code of Conduct', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus. Any form of plagiarism or misconduct will lead to immediate disqualification.' },
    ],
  },
  {
    id: 'shark-tank', name: 'Startup Singam Jr', limit: 'Limit 5', desc: 'Pitching Event',
    venue: 'GEETHAM', day: 'Day 1 & 2', accent: '#0b2140', accentLight: '#e8f0ff',
    rules: [
      { title: '1. nee solu', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Teams may have a maximum of 5 members. Solo participation is also permitted.' },
      { title: '2. nee solu', body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Each team will have 5 minutes to pitch and 3 minutes for Q&A from the panel.' },
      { title: '3. nee solu', body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. The startup idea must be original and must not be a copy of an existing business.' },
      { title: '4. nee solu', body: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit. Slides must be submitted 24 hours before the event. Maximum 10 slides allowed.' },
      { title: '5. nee solu', body: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet. Ideas will be judged on market viability, scalability, innovation, and team delivery.' },
    ],
  },
  {
    id: 'phoenix-protocol', name: 'Phoenix Protocol', limit: 'Limit 3', desc: 'Hema Solraaaa',
    venue: 'TRP', day: 'Day 2', accent: '#0b2140', accentLight: '#e8f0ff',
    rules: [
      { title: '1. nee solu', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A maximum of 3 members per team. Each team must register together prior to the event.' },
      { title: '2. Round Structure', body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse. The event consists of multiple elimination rounds. Teams must clear each round to advance.' },
      { title: '3. Resources', body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. No pre-prepared materials are allowed. All work must be done on-site during the event.' },
      { title: '4. Time Limit', body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi. Each round will have a strict time limit. Incomplete submissions will be disqualified.' },
      { title: '5. Conduct', body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa. Fair play is mandatory. Any disruption or unethical behavior results in immediate elimination.' },
    ],
  },
  {
    id: 'junk-to-genius', name: 'Junk to Genius', limit: 'Limit 3', desc: 'Hema Solraaaa',
    venue: 'MBA Seminar Hall 1', day: 'Both Days', accent: '#0b2140', accentLight: '#e8f0ff',
    rules: [
      { title: '1. Team Size', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Teams of up to 3 members. All members must be present on both days of the event.' },
      { title: '2. Materials', body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium. Only materials provided at the venue may be used. No external materials are allowed.' },
      { title: '3. Build Time', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis. Teams have a fixed window to construct their product from the given junk materials.' },
      { title: '4. Presentation', body: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit. Each team must present their creation explaining functionality and innovation to the judges.' },
      { title: '5. Judging Criteria', body: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus. Judged on creativity, structural integrity, utility, and presentation effectiveness.' },
    ],
  },
];

const INDIVIDUAL_EVENTS = [
  {
    id: 'live-podcast', name: 'Live Podcast', desc: 'Hema Solraaaa',
    venue: 'GEETHAM', day: 'Both Days', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Eligibility', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Open to all registered participants. Each participant will be given a topic 15 minutes before going live.' },
      { title: '2. Duration', body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Each podcast session will last a maximum of 8 minutes. Going overtime will incur point deduction.' },
      { title: '3. Content Guidelines', body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Content must be appropriate, respectful, and relevant to the assigned topic. No offensive material.' },
      { title: '4. Scoring', body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Scored on voice clarity, content depth, confidence, and audience engagement.' },
      { title: '5. Code of Conduct', body: 'Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia. Respect for the audience and co-participants is mandatory throughout the session.' },
    ],
  },
  {
    id: 'panel-discussions', name: 'Panel Discussion', desc: 'Hema Solraaaa',
    venue: 'GEETHAM', day: 'Day 1', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Participation', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Individual participation only. Participants will be grouped into panels of 5 on the day of the event.' },
      { title: '2. Topic Disclosure', body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Topics will be revealed 10 minutes before the discussion begins. No prior preparation is allowed.' },
      { title: '3. Speaking Time', body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur. Each participant gets equal speaking time. Interrupting others will result in penalty points.' },
      { title: '4. Judging', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus. Judged on argument strength, factual accuracy, communication skills, and active listening.' },
      { title: '5. Conduct', body: 'Nam libero tempore cum soluta nobis est eligendi optio. All discussions must remain civil and constructive. Personal attacks or disrespectful language is not permitted.' },
    ],
  },
  {
    id: 'illogical-marketing', name: 'Illogical Marketing', desc: 'Hema Solraaaa',
    venue: 'Hi-Tech Hall 2', day: 'Day 1', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Format', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Individual event. Participants must market an absurd, fictional product assigned to them on the spot.' },
      { title: '2. Preparation Time', body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. You will have 5 minutes to prepare your marketing pitch before presenting to the judges.' },
      { title: '3. Pitch Duration', body: 'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi. The pitch must be between 3–5 minutes. No props or pre-made materials allowed.' },
      { title: '4. Creativity Rule', body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. The more outrageous and creative your pitch, the better. Logical pitches will be penalized.' },
      { title: '5. Judging', body: 'Excepteur sint occaecat cupidatat non proident sunt in culpa. Evaluated on creativity, humor, persuasiveness, and overall showmanship.' },
    ],
  },
  {
    id: 'bootcamp', name: 'Bootcamp', desc: 'Hema Solraaaa',
    venue: 'MBA Seminar Hall 2', day: 'Both Days', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Attendance', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Full attendance on both days is mandatory. Partial attendance will result in disqualification from certification.' },
      { title: '2. Prerequisites', body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium. No prior experience is required. Bring your own laptop and a willingness to learn.' },
      { title: '3. Participation', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis. Active participation in all sessions and hands-on activities is expected from every attendee.' },
      { title: '4. Assignments', body: 'Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit. Mini-assignments will be given at the end of each session. Completion is required for certification.' },
      { title: '5. Conduct', body: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe. Maintain decorum in the hall. Disruptive behavior may lead to removal from the bootcamp.' },
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Learn More Modal ─────────────────────────────────────────────────── */
const LearnMoreModal = ({ evt, isGroup, onClose, onRegister }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative flex flex-col w-full max-w-5xl max-h-[88vh] overflow-hidden"
          style={{
            background: '#fff',
            border: '3px solid #111',
            boxShadow: '10px 10px 0px #111',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Accent top bar */}
          <div style={{ height: '6px', background: evt.accent, width: '100%', flexShrink: 0 }} />

          {/* Header */}
          <div
            className="flex items-center justify-between px-7 py-5"
            style={{ borderBottom: '3px solid #111', flexShrink: 0 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center p-2"
                style={{ border: `2px solid ${evt.accent}`, background: evt.accentLight }}
              >
                <BookOpen size={18} color={evt.accent} strokeWidth={3} />
              </div>
              <div>
                <p
                  className="text-[9px] font-black uppercase tracking-[0.22em] mb-0.5"
                  style={{ color: evt.accent }}
                >
                  {isGroup ? '👥 Team Event' : '👤 Individual Event'}
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">
                  {evt.name}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center transition-all"
              style={{
                width: 36, height: 36,
                border: '2.5px solid #111',
                background: '#fff',
                boxShadow: '3px 3px 0 #111',
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#111'; }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-7 py-6" style={{ overflowY: 'auto' }}>
            {/* Meta info strip */}
            <div className="flex flex-wrap gap-4 mb-6 pb-5" style={{ borderBottom: '2px dashed #ddd' }}>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-black/60 uppercase tracking-wider">
                <MapPin size={12} /> {evt.venue}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-black/60 uppercase tracking-wider">
                <Calendar size={12} /> {evt.day}
              </span>
              {evt.limit && (
                <span
                  className="text-[11px] font-black uppercase tracking-widest px-2 py-0.5"
                  style={{ background: evt.accentLight, color: evt.accent, border: `1.5px solid ${evt.accent}` }}
                >
                  {evt.limit}
                </span>
              )}
            </div>

            {/* Rules & Regulations */}
            <div className="mb-6">
              <h3
                className="text-[11px] font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2"
                style={{ color: evt.accent }}
              >
                <span
                  className="inline-block w-6 h-[2.5px]"
                  style={{ background: evt.accent }}
                />
                Rules &amp; Regulations
              </h3>

              {(evt.rules || []).map((rule, i) => (
                <div
                  key={i}
                  className="mb-4 p-4"
                  style={{
                    border: '2px solid #e5e5e5',
                    borderLeft: `4px solid ${evt.accent}`,
                    background: i % 2 === 0 ? '#fafafa' : '#fff',
                  }}
                >
                  <p className="text-[12px] font-black uppercase tracking-wide text-black mb-1.5">
                    {rule.title}
                  </p>
                  <p className="text-[12px] font-medium text-black/60 leading-relaxed">
                    {rule.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer with Register button */}
          <div
            className="flex items-center justify-between px-7 py-5"
            style={{ borderTop: '3px solid #111', background: '#fafafa', flexShrink: 0 }}
          >
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
              Read all rules before registering
            </p>
            <motion.button
              onClick={() => { onClose(); onRegister(evt); }}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-2.5 font-black uppercase text-[11px] tracking-widest px-8 py-3 text-white transition-all"
              style={{
                background: evt.accent,
                border: `2.5px solid ${evt.accent}`,
                boxShadow: `4px 4px 0 #111`,
              }}
            >
              Register <ArrowRight size={13} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Event Card ────────────────────────────────────────────────────────── */
const EventCard = ({ evt, idx, onRegister, isGroup }) => {
  const [hovered, setHovered] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <>
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
          <p className="text-[14px] font-medium text-black/80 leading-relaxed flex-1 mb-4">
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

          {/* Price + Learn More CTA */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '2px solid #111' }}>
            <div>
              <p className="font-black text-xl text-black leading-none">{evt.price}</p>
            </div>
            <motion.button
              onClick={() => setShowLearnMore(true)}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest px-6 py-2.5 text-white transition-all"
              style={{ background: evt.accent, border: `2px solid ${evt.accent}` }}
            >
              Learn More <ChevronRight size={12} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Learn More Modal */}
      {showLearnMore && (
        <LearnMoreModal
          evt={evt}
          isGroup={isGroup}
          onClose={() => setShowLearnMore(false)}
          onRegister={onRegister}
        />
      )}
    </>
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
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-black">
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
