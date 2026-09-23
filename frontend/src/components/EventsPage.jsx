import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Users, User, AlertCircle, MapPin, Calendar, ArrowRight, X, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EventRegistrationModal from './EventRegistrationModal';
import HackathonModal from './HackathonModal';
import AuthModal from './AuthModal';
import RegistrationForm from './RegistrationForm';

const GROUP_EVENTS = [
  {
    id: 'hackathon', name: 'Hackathon', limit: '3–5 Members', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 24 hours. Details about CUMTA.',
    venue: 'MLCP labs', day: 'Both Days', accent: '#0b2140', accentLight: '#e8f0ff',
    rules: [
      { title: '1. Team Size', body: 'Each team must consist of 3–5 members.' },
      { title: '2. Participation Confirmation', body: 'Participation will be confirmed upon completion of payment.' },
      { title: '3. Registration & Payment', body: 'The team leader must register and make the payment for all team members. All team members must join the team created by the team leader.' },
      { title: '4. Reporting Time', body: 'All participants must report to their allocated venue 15 minutes before the start of the event. ID cards are mandatory for all participants.' },
      { title: '5. Problem Statements', body: 'Problem statements will be revealed on the day of the event.' },
      { title: '6. Code of Conduct', body: 'Any form of unfair practice or copied work will lead to immediate disqualification. The judges’ decision will be final and will not be open to discussion.' },
    ],
  },
  {
    id: 'shark-tank', name: 'Startup Singam Jr', limit: 'Limit 5',
    desc: (
      <>
        <span>In partnership with <strong>Startup Singam</strong>, this is a <strong>two-day startup pitching competition</strong> for young entrepreneurs.</span>
        <span className="block mt-2 text-black/75"><strong>Day 1 — Prelims:</strong> Pitch before a preliminary jury and get shortlisted.</span>
        <span className="block mt-1 text-black/75"><strong>Day 2 — Grand Finale:</strong> Present directly to a distinguished panel of investors.</span>
      </>
    ),
    venue: 'Civil Block 3rd Floor - Computer labs', day: 'Day 1 & 2', accent: '#0b2140', accentLight: '#e8f0ff',
    rules: [
      { title: '1. Team Size', body: 'Each team can have a maximum of 5 members.' },
      { title: '2. Participation Confirmation', body: 'Participation will be confirmed upon completion of payment.' },
      { title: '3. Registration & Payment', body: 'The team leader must register and make the payment for all team members. All team members must join the team created by the team leader.' },
      { title: '4. Reporting Time', body: 'All participants must report to their allocated venue 15 minutes before the start of the event. ID cards are mandatory for all participants.' },
      { title: '5. Finale Eligibility', body: 'Only teams selected from the prelims will be eligible to present in the finale. All teams must adhere to the presentation time allotted by the organizing committee.' },
      { title: '6. Code of Conduct', body: 'Any form of unfair practice or copied work will lead to immediate disqualification. The judges’ decision will be final and will not be open to discussion.' },
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
    id: 'live-podcast', name: 'Live Podcast',
    desc: (
      <>
        <span><strong>What really happens behind the success story?</strong></span>
        <span className="block mt-2">Hear directly from <strong>successful founders from Tamil Nadu</strong> as they share their journeys — the risks, the failures, and the decisions that changed everything.</span>
        <span className="block mt-2 text-black/75 italic">No scripts. No filters. Just real founder stories.</span>
      </>
    ),
    venue: 'GEETHAM / TRP', day: 'Both Days', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Eligibility', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Open to all registered participants. Each participant will be given a topic 15 minutes before going live.' },
      { title: '2. Duration', body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Each podcast session will last a maximum of 8 minutes. Going overtime will incur point deduction.' },
      { title: '3. Content Guidelines', body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Content must be appropriate, respectful, and relevant to the assigned topic. No offensive material.' },
      { title: '4. Scoring', body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Scored on voice clarity, content depth, confidence, and audience engagement.' },
      { title: '5. Code of Conduct', body: 'Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia. Respect for the audience and co-participants is mandatory throughout the session.' },
    ],
  },
  {
    id: 'panel-discussions', name: 'Panel Discussion',
    desc: (
      <>
        <span>A dynamic panel where <strong>industry leaders, entrepreneurs and experts</strong> share real-time insights on a given theme.</span>
        <span className="block mt-2 text-black/75">Expect real-world challenges, diverse viewpoints, and practical experiences — followed by an <strong>interactive Q&amp;A</strong> with the panelists.</span>
      </>
    ),
    venue: 'GEETHAM / TRP', day: 'Day 1', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Participation', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Individual participation only. Participants will be grouped into panels of 5 on the day of the event.' },
      { title: '2. Topic Disclosure', body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Topics will be revealed 10 minutes before the discussion begins. No prior preparation is allowed.' },
      { title: '3. Speaking Time', body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur. Each participant gets equal speaking time. Interrupting others will result in penalty points.' },
      { title: '4. Judging', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus. Judged on argument strength, factual accuracy, communication skills, and active listening.' },
      { title: '5. Conduct', body: 'Nam libero tempore cum soluta nobis est eligendi optio. All discussions must remain civil and constructive. Personal attacks or disrespectful language is not permitted.' },
    ],
  },
  {
    id: 'illogical-marketing', name: 'Illogical Marketing',
    desc: (
      <>
        <span><strong>Can you sell a product that makes absolutely no sense?</strong></span>
        <span className="block mt-2">You'll receive an illogical product on the spot and must pitch it convincingly — using <strong>branding, storytelling and persuasion</strong>.</span>
        <span className="block mt-2 text-black/75 italic">The product may be illogical. Your marketing strategy cannot be.</span>
      </>
    ),
    venue: 'Hi-Tech Hall 2', day: 'Day 1', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Solo Event', body: 'This is a solo event.' },
      { title: '2. Participation Confirmation', body: 'Participation will be confirmed upon completion of payment.' },
      { title: '3. Reporting Time', body: 'All participants must report to their allocated venue 15 minutes before the start of the event. ID cards are mandatory for all participants.' },
      { title: '4. Format', body: 'Participants will be given an illogical product and must come up with convincing marketing strategies to sell it. The judges will provide the product on the spot.' },
      { title: '5. Code of Conduct', body: 'Any form of unfair practice or copied work will lead to immediate disqualification. The judges’ decision will be final and will not be open to discussion.' },
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

/* ── Podcast Speakers Data ─────────────────────────────────────────────── */
const PODCAST_SPEAKERS = {
  day1: [
    {
      id: 'spk-d1-1',
      name: 'Speaker 1',
      title: 'lorem ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      photo: null,
    },
    {
      id: 'spk-d1-2',
      name: 'Speaker 2',
      title: 'Hema pola varuma',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      id: 'spk-d1-3',
      name: 'Speaker 3',
      title: 'Hema pola varuma',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia magni dolores eos.',
    },
    {
      id: 'spk-d1-4',
      name: 'Speaker 4',
      title: 'Hema pola varuma',
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    },
  ],
  day2: [
    {
      id: 'spk-d2-1',
      name: 'Sofia Martínez',
      title: 'Head of Growth, ScaleUp Labs',
      description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
    },
    {
      id: 'spk-d2-2',
      name: 'Arjun Krishnamurthy',
      title: 'CTO, DeepMind Startups',
      description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente.',
    },
    {
      id: 'spk-d2-3',
      name: 'Lena Fischer',
      title: 'Co-Founder, GreenBuild Systems',
      description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur sit amet consectetur.',
    },
    {
      id: 'spk-d2-4',
      name: 'Ravi Shankar',
      title: 'Director, National Innovation Hub',
      description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    },
  ],
};

/* ── Podcast Speaker Card ───────────────────────────────────────────────── */
const SpeakerCard = ({ speaker, accent, accentLight, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-stretch"
    style={{
      border: '3px solid #111',
      borderLeft: `6px solid ${accent}`,
      background: '#fff',
      boxShadow: '6px 6px 0 #111',
      minHeight: 230,
    }}
  >
    {/* Square photo box */}
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width: 280,
        minHeight: 230,
        background: accentLight,
        overflow: 'hidden',
        flexShrink: 0,
        borderRight: `3px solid ${accent}`,
        position: 'relative',
      }}
    >
      {/* accent corner tag */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 0, height: 0,
        borderTop: `38px solid ${accent}`,
        borderRight: '38px solid transparent',
        zIndex: 2,
      }} />
      {speaker.photo ? (
        <img
          src={speaker.photo}
          alt={speaker.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
        />
      ) : (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="34" r="22" fill={accent} opacity="0.42" />
          <ellipse cx="48" cy="78" rx="32" ry="18" fill={accent} opacity="0.22" />
        </svg>
      )}
    </div>

    {/* Info */}
    <div
      className="flex-1 flex flex-col justify-center"
      style={{ padding: '30px 32px' }}
    >
      <p
        style={{
          fontWeight: 900,
          fontSize: 22,
          color: '#111',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          margin: '0 0 6px',
        }}
      >
        {speaker.name}
      </p>
      <p
        style={{
          fontWeight: 900,
          fontSize: 11,
          color: accent,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          margin: '0 0 18px',
        }}
      >
        {speaker.title}
      </p>
      <div style={{ width: 40, height: 3, background: accent, marginBottom: 18 }} />
      <p
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: 'rgba(0,0,0,0.6)',
          lineHeight: 1.85,
          margin: 0,
        }}
      >
        {speaker.description}
      </p>
    </div>
  </motion.div>
);

/* ── Panel Discussion Data ─────────────────────────────────────────────── */
const PANEL_DATA = [
  {
    id: 'panel-1',
    label: 'Panel 1',
    topic: 'The Future of Startup Ecosystems in India',
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    guests: [
      { id: 'p1g1', name: 'Guest 01', role: 'CEO, StartupX', photo: null },
      { id: 'p1g2', name: 'Guest 02', role: 'VC Partner', photo: null },
      { id: 'p1g3', name: 'Guest 03', role: 'Founder & CTO', photo: null },
      { id: 'p1g4', name: 'Guest 04', role: 'Angel Investor', photo: null },
      { id: 'p1g5', name: 'Guest 05', role: 'Policy Advisor', photo: null },
    ],
  },
  {
    id: 'panel-2',
    label: 'Panel 2',
    topic: 'Funding in the Age of AI & Deep Tech',
    about: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet consectetur.',
    guests: [
      { id: 'p2g1', name: 'Guest 01', role: 'AI Researcher', photo: null },
      { id: 'p2g2', name: 'Guest 02', role: 'Deep Tech VC', photo: null },
      { id: 'p2g3', name: 'Guest 03', role: 'Startup Mentor', photo: null },
      { id: 'p2g4', name: 'Guest 04', role: 'Innovation Head', photo: null },
      { id: 'p2g5', name: 'Guest 05', role: 'Product Strategist', photo: null },
    ],
  },
  {
    id: 'panel-3',
    label: 'Panel 3',
    topic: 'Building Sustainable Businesses from Day Zero',
    about: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi id est laborum et dolorum fuga.',
    guests: [
      { id: 'p3g1', name: 'Guest 01', role: 'Impact Founder', photo: null },
      { id: 'p3g2', name: 'Guest 02', role: 'ESG Consultant', photo: null },
      { id: 'p3g3', name: 'Guest 03', role: 'Green Tech CEO', photo: null },
      { id: 'p3g4', name: 'Guest 04', role: 'Social Entrepreneur', photo: null },
      { id: 'p3g5', name: 'Guest 05', role: 'Impact Investor', photo: null },
    ],
  },
  {
    id: 'panel-4',
    label: 'Panel 4',
    topic: 'Scaling from 0 to 1 Million Users',
    about: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint molestiae.',
    guests: [
      { id: 'p4g1', name: 'Guest 01', role: 'Growth Hacker', photo: null },
      { id: 'p4g2', name: 'Guest 02', role: 'CMO, ScaleUp', photo: null },
      { id: 'p4g3', name: 'Guest 03', role: 'Product Manager', photo: null },
      { id: 'p4g4', name: 'Guest 04', role: 'Community Lead', photo: null },
      { id: 'p4g5', name: 'Guest 05', role: 'Retention Expert', photo: null },
    ],
  },
  {
    id: 'panel-5',
    label: 'Panel 5',
    topic: 'Leadership & Culture in High-Growth Teams',
    about: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum dolorem eum fugiat quo voluptas nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit.',
    guests: [
      { id: 'p5g1', name: 'Guest 01', role: 'Exec Coach', photo: null },
      { id: 'p5g2', name: 'Guest 02', role: 'HR Director', photo: null },
      { id: 'p5g3', name: 'Guest 03', role: 'Culture Strategist', photo: null },
      { id: 'p5g4', name: 'Guest 04', role: 'Founder & CEO', photo: null },
      { id: 'p5g5', name: 'Guest 05', role: 'Leadership Coach', photo: null },
    ],
  },
];

/* ── Panel Guest Portrait ─────────────────────────────────────────────────── */
const PanelGuestPortrait = ({ guest, accent, accentLight }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: '1 1 0',
      minWidth: 0,
    }}
  >
    {/* Photo square */}
    <div
      style={{
        width: '100%',
        aspectRatio: '1',
        maxWidth: 140,
        border: `3px solid ${accent}`,
        background: accentLight,
        overflow: 'hidden',
        boxShadow: `4px 4px 0 #111`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        position: 'relative',
      }}
    >
      {/* corner triangle */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 0, height: 0,
        borderTop: `24px solid ${accent}`,
        borderLeft: '24px solid transparent',
      }} />
      {guest.photo ? (
        <img src={guest.photo} alt={guest.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
      ) : (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="20" r="13" fill={accent} opacity="0.45" />
          <ellipse cx="28" cy="46" rx="20" ry="11" fill={accent} opacity="0.25" />
        </svg>
      )}
    </div>
    {/* Name */}
    <p style={{
      fontWeight: 900, fontSize: 12, color: '#111',
      textTransform: 'uppercase', letterSpacing: '-0.01em',
      textAlign: 'center', margin: '0 0 3px', lineHeight: 1.1,
    }}>{guest.name}</p>
    {/* Role */}
    <p style={{
      fontWeight: 700, fontSize: 10, color: accent,
      textTransform: 'uppercase', letterSpacing: '0.12em',
      textAlign: 'center', margin: 0, lineHeight: 1.3,
    }}>{guest.role}</p>
  </div>
);

/* ── Panel Discussion Modal ───────────────────────────────────────────── */
const PanelDiscussionModal = ({ evt, onClose, onRegister }) => {
  const [activePanel, setActivePanel] = useState(0);
  const panel = PANEL_DATA[activePanel];
  const accent = evt.accent;
  const accentLight = evt.accentLight;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(5px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 44, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 44, scale: 0.96 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative flex flex-col w-full max-w-6xl"
          style={{
            maxHeight: '94vh',
            background: '#fff',
            border: '3px solid #111',
            boxShadow: '12px 12px 0px #111',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Accent bar */}
          <div style={{ height: 6, background: accent, flexShrink: 0 }} />

          {/* Header */}
          <div
            className="flex items-center justify-between px-7 py-5"
            style={{ borderBottom: '3px solid #111', flexShrink: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2"
                style={{ border: `2px solid ${accent}`, background: accentLight }}>
                {/* Mic SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-0.5" style={{ color: accent }}>
                  💬 Panel Discussion · Day 1
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">
                  {evt.name}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center transition-all"
              style={{ width: 36, height: 36, border: '2.5px solid #111', background: '#fff', boxShadow: '3px 3px 0 #111', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#111'; }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Panel Tabs */}
          <div className="flex items-center px-7 pt-5 pb-0 gap-2" style={{ flexShrink: 0, flexWrap: 'wrap' }}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mr-3">Select Panel:</p>
            {PANEL_DATA.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePanel(i)}
                className="font-black uppercase text-[11px] tracking-widest px-5 py-2 transition-all"
                style={{
                  background: activePanel === i ? accent : '#fff',
                  color: activePanel === i ? '#fff' : '#111',
                  border: `2.5px solid ${activePanel === i ? accent : '#111'}`,
                  boxShadow: activePanel === i ? `4px 4px 0 #111` : '2px 2px 0 #ccc',
                  transform: activePanel === i ? 'translate(-1px,-1px)' : 'translate(0,0)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-7 py-6" style={{ overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
              >
                {/* Panel header badge */}
                <div className="flex items-center gap-3 mb-6" style={{ borderBottom: '2px dashed #ddd', paddingBottom: 16 }}>
                  <div
                    style={{ background: accent, border: '2px solid #111', boxShadow: '3px 3px 0 #111', padding: '4px 14px', display: 'inline-flex', alignItems: 'center' }}
                  >
                    <span className="text-white font-black uppercase tracking-[0.3em] text-[11px]">{panel.label}</span>
                  </div>
                  <p className="text-[11px] font-bold text-black/50 uppercase tracking-widest">5 Guests · Panel Discussion</p>
                </div>

                {/* 5 Guests in a row */}
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    marginBottom: 36,
                    padding: '20px 20px 24px',
                    border: '3px solid #111',
                    borderTop: `5px solid ${accent}`,
                    background: accentLight,
                    boxShadow: '6px 6px 0 #111',
                  }}
                >
                  {panel.guests.map(g => (
                    <PanelGuestPortrait key={g.id} guest={g} accent={accent} accentLight="#fff" />
                  ))}
                </div>

                {/* Panel topic - large text */}
                <div style={{ marginBottom: 20 }}>
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 flex items-center gap-2"
                    style={{ color: accent }}
                  >
                    <span style={{ display: 'inline-block', width: 24, height: 2.5, background: accent }} />
                    Panel Topic
                  </p>
                  <h3
                    style={{
                      fontWeight: 900,
                      fontSize: 'clamp(22px, 3vw, 32px)',
                      color: '#111',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1,
                      margin: 0,
                      borderLeft: `5px solid ${accent}`,
                      paddingLeft: 16,
                    }}
                  >
                    {panel.topic}
                  </h3>
                </div>

                {/* About the panel */}
                <div
                  style={{
                    padding: '20px 24px',
                    border: '2px solid #e5e5e5',
                    borderLeft: `5px solid ${accent}`,
                    background: '#fafafa',
                    boxShadow: '4px 4px 0 #e5e5e5',
                  }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.22em] mb-3"
                    style={{ color: accent }}
                  >
                    About this Panel
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 500, color: 'rgba(0,0,0,0.62)', lineHeight: 1.85, margin: 0 }}>
                    {panel.about}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-7 py-5"
            style={{ borderTop: '3px solid #111', background: '#fafafa', flexShrink: 0 }}
          >
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
              Register to participate in the panel discussion
            </p>
            <motion.button
              onClick={() => { onClose(); onRegister(evt); }}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-2.5 font-black uppercase text-[11px] tracking-widest px-8 py-3 text-white transition-all"
              style={{
                background: accent,
                border: `2.5px solid ${accent}`,
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

/* ── Podcast Learn More Modal ───────────────────────────────────────────── */
const PodcastLearnMoreModal = ({ evt, onClose, onRegister }) => {
  const [activeDay, setActiveDay] = useState('day1');
  const speakers = PODCAST_SPEAKERS[activeDay];

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
          className="relative flex flex-col w-full max-w-6xl"
          style={{
            maxHeight: '94vh',
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
                {/* Mic icon inline */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={evt.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              </div>
              <div>
                <p
                  className="text-[9px] font-black uppercase tracking-[0.22em] mb-0.5"
                  style={{ color: evt.accent }}
                >
                  🎙️ Live Podcast · Both Days
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

          {/* Day Tabs */}
          <div
            className="flex items-center gap-0 px-7 pt-5 pb-0"
            style={{ flexShrink: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mr-4">
              Select Day:
            </p>
            {['day1', 'day2'].map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className="font-black uppercase text-[11px] tracking-widest px-6 py-2.5 mr-2 transition-all"
                style={{
                  background: activeDay === day ? evt.accent : '#fff',
                  color: activeDay === day ? '#fff' : '#111',
                  border: `2.5px solid ${activeDay === day ? evt.accent : '#111'}`,
                  boxShadow: activeDay === day ? `4px 4px 0 #111` : '2px 2px 0 #ccc',
                  transform: activeDay === day ? 'translate(-1px,-1px)' : 'translate(0,0)',
                }}
              >
                {day === 'day1' ? 'Day 1' : 'Day 2'}
              </button>
            ))}
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-7 py-6" style={{ overflowY: 'auto' }}>
            {/* Day label */}
            <div className="flex items-center gap-3 mb-5" style={{ borderBottom: '2px dashed #ddd', paddingBottom: '16px' }}>
              <div
                className="flex items-center justify-center px-4 py-1.5"
                style={{ background: evt.accent, border: '2px solid #111', boxShadow: '3px 3px 0 #111' }}
              >
                <span className="text-white font-black uppercase tracking-[0.3em] text-[11px]">
                  {activeDay === 'day1' ? 'DAY 1' : 'DAY 2'}
                </span>
              </div>
              <p className="text-[11px] font-bold text-black/50 uppercase tracking-widest">
                {activeDay === 'day1' ? 'Speakers & Guests' : 'Speakers & Guests'} · {speakers.length} Sessions
              </p>
            </div>

            {/* Speakers section label */}
            <h3
              className="text-[11px] font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2"
              style={{ color: evt.accent }}
            >
              <span className="inline-block w-6 h-[2.5px]" style={{ background: evt.accent }} />
              Podcast Guests
            </h3>

            {/* Speaker cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                }}
              >
                {speakers.map((spk, i) => (
                  <SpeakerCard
                    key={spk.id}
                    speaker={spk}
                    accent={evt.accent}
                    accentLight={evt.accentLight}
                    index={i}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-7 py-5"
            style={{ borderTop: '3px solid #111', background: '#fafafa', flexShrink: 0 }}
          >
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
              Register to attend the live podcast
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

/* ── Learn More Modal ─────────────────────────────────────────────────── */
const LearnMoreModal = ({ evt, isGroup, onClose, onRegister }) => {
  if (evt.id === 'live-podcast') {
    return <PodcastLearnMoreModal evt={evt} onClose={onClose} onRegister={onRegister} />;
  }
  if (evt.id === 'panel-discussions') {
    return <PanelDiscussionModal evt={evt} onClose={onClose} onRegister={onRegister} />;
  }
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

            {/* Event Description & Photo */}
            <div className="mb-8">
              <div
                className="mb-6 p-4"
                style={{
                  border: '2px solid #e5e5e5',
                  borderLeft: `4px solid ${evt.accent}`,
                  background: '#fafafa',
                }}
              >
                <h4 className="text-[12px] font-black uppercase tracking-wide text-black mb-1.5 flex items-center gap-2">
                  Event Overview
                </h4>
                <p className="text-[12px] font-medium text-black/60 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div
                className="w-full bg-gray-50 flex items-center justify-center overflow-hidden"
                style={{
                  height: '280px',
                  border: '3px solid #111',
                  boxShadow: '6px 6px 0 #111'
                }}
              >
                {evt.photo ? (
                  <img src={evt.photo} alt={evt.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    <span className="font-black uppercase tracking-widest text-xs">Event Photo Placeholder</span>
                  </div>
                )}
              </div>
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
const EventCard = ({ evt, idx, onRegister, isGroup, onLoginRequest }) => {
  const [hovered, setHovered] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
          <div className="text-[14.5px] font-medium text-black/90 leading-relaxed flex-1 mb-4">
            {evt.desc}
          </div>

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
  const [authModal, setAuthModal] = useState({ open: false, pass: '', source: '' });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [pendingEventAfterProfile, setPendingEventAfterProfile] = useState(null);

  const handleRegisterClick = (event) => {
    if (!user) {
      setAuthModal({ open: true, pass: 'EVENT PASS', source: 'event-browse' });
      return;
    }
    // Profile not completed yet — prompt them to complete it first
    if (!registration) {
      setPendingEventAfterProfile(event);
      setShowProfileForm(true);
      return;
    }
    // Profile complete — open event modal directly
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
            <EventCard key={evt.id} evt={evt} idx={idx} onRegister={handleRegisterClick} isGroup={true} onLoginRequest={() => setAuthModal({ open: true, pass: 'EVENT PASS', source: 'event-browse' })} />
          ))}
        </div>
      </div>

      {/* Individual Events */}
      <div className="mb-12">
        <SectionHeader icon={User} label="Individual Events" accent="#a80d11" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {INDIVIDUAL_EVENTS.map((evt, idx) => (
            <EventCard key={evt.id} evt={evt} idx={idx} onRegister={handleRegisterClick} isGroup={false} onLoginRequest={() => setAuthModal({ open: true, pass: 'EVENT PASS', source: 'event-browse' })} />
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
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal(prev => ({ ...prev, open: false }))}
        selectedPass={authModal.pass}
      />
      {/* Profile Completion — shown when user clicks Register without a profile */}
      {showProfileForm && (
        <RegistrationForm
          passType="Visitor's Pass"
          onSuccess={() => {
            setShowProfileForm(false);
            // After profile done, open the event they originally wanted
            if (pendingEventAfterProfile) {
              setSelectedEvent(pendingEventAfterProfile);
              setPendingEventAfterProfile(null);
            }
          }}
          onClose={() => {
            setShowProfileForm(false);
            setPendingEventAfterProfile(null);
          }}
        />
      )}
    </div>
  );
};

export default EventsPage;
