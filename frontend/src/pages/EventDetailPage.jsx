import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Clock, Users, User, ChevronRight,
  ArrowRight, BookOpen, Zap, CheckCircle2, AlertCircle, Loader2,
  ExternalLink, Shield, Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

/* ─── Import all assets (same as EventsPage) ─────────────────────────── */
import hackathonRulesPoster from '../assets/rules11.png';
import pitchRulesPoster from '../assets/rules22.png';
import hackathonPoster from '../assets/hackathon_cover.png';
import rupeesPoster from '../assets/rupees_cover.png';
import scaleupPoster from '../assets/scaleup_cover.png';
import rupeesRulesPoster from '../assets/rules33.png';
import scaleupRulesPoster from '../assets/rules44.png';
import bootcampPoster from '../assets/bootcamp_cover.png';
import artPoster from '../assets/art_cover.png';
import lavanya from '../assets/lavanya.png';
import artRulesPoster from '../assets/rules55.png';
import rupeesOverviewImage from '../assets/SDG.png';
import risePoster from '../assets/rise_cover.png';
import riseRulesPoster from '../assets/rules66.png';
import pitchPoster from '../assets/pitch_cover.png';

/* ─── Event Data (mirrored from EventsPage) ──────────────────────────── */
const GROUP_EVENTS = [
  {
    id: 'hackathon', name: 'Hackathon', limit: '3–5 Members',
    cardDesc: (
      <>
        <span className="block text-[14px] font-black uppercase tracking-tight text-[#0b2140] mb-2">24 Hours. One Mission. Reimagine the Transportation of Chennai.</span>
        <span className="block mt-2 font-bold text-black/90">What if you had 24 hours to build an idea that could transform the way Chennai moves?</span>
        <span className="block mt-2 text-black/75">
          The <strong>Chennai Unified Metropolitan Transport Authority (CUMTA)</strong> is bringing together young innovators for an intense 24-hour challenge.
        </span>
      </>
    ),
    desc: (
      <>
        <span className="block text-xl font-black uppercase tracking-tight text-[#0b2140] mb-3">24 Hours. One Mission. Reimagine the Transportation of Chennai.</span>
        <span className="block mt-2 font-bold text-black/90">What if you had 24 hours to build an idea that could transform the way Chennai moves?</span>
        <span className="block mt-2 text-black/75">
          The <strong>Chennai Unified Metropolitan Transport Authority (CUMTA)</strong> is bringing together young innovators for an intense 24-hour challenge to imagine, create and prototype the future of Chennai's transportation.
        </span>
        <span className="block mt-2 text-black/75">
          From streets to public transport, from everyday commuters to emerging technology — the future of Chennai's mobility needs new ideas. Now, it's your turn to rethink it.
        </span>
        <span className="block mt-3 font-black text-black/90 uppercase text-[12px] tracking-wide">
          Gather your team. Bring your ideas. Build under pressure. Reimagine Chennai.
        </span>
        <span className="block mt-2 text-black/75">
          Open to passionate student innovators from across Tamil Nadu, this is your opportunity to build, experiment, collaborate and turn an idea into something that could make a difference.
        </span>
        <div className="mt-6 p-6" style={{ background: '#f8fafc', borderLeft: '6px solid #0b2140' }}>
          <span className="block font-black uppercase tracking-widest text-[#0b2140] text-lg">CUMTA 24-Hour Challenge</span>
          <span className="block text-[16px] font-bold text-black/70 mt-2">Where ideas move Chennai.</span>
          <span className="block text-[14px] uppercase tracking-[0.3em] font-black mt-3 text-black">Your 24 hours start here.</span>
        </div>
      </>
    ),
    venue: 'MLCP labs', day: 'Both Days', time: '1 PM Onwards', accent: '#0b223e', accentLight: '#eff6ff', fee: 1500,
    rules: [
      { title: 'Team Size', body: 'Each team must consist of 3–5 members.' },
      { title: 'Participation Confirmation', body: 'Participation will be confirmed upon completion of payment.' },
      { title: 'Registration & Payment', body: 'The team leader must register and make the payment for all team members. All team members must join the team created by the team leader.' },
      { title: 'Reporting Time', body: 'All participants must report to their allocated venue 15 minutes before the start of the event. ID cards are mandatory for all participants.' },
      { title: 'Problem Statements', body: 'Problem statements will be revealed on the day of the event.' },
      { title: 'Code of Conduct', body: "Any form of unfair practice or copied work will lead to immediate disqualification. The judges' decision will be final and will not be open to discussion." },
    ],
    coverImage: hackathonPoster,
    posters: [hackathonRulesPoster],
    isGroup: true,
  },
  {
    id: 'rupees-to-reality', name: 'Rupees to Reality', limit: 'Limit 3',
    cardDesc: 'Rupees to Reality challenges teams to turn an imaginary budget into a real-world solution.',
    desc: (
      <>
        <span className="block text-xl font-black uppercase tracking-tight text-[#0b2140] mb-3">Rupees to Reality challenges teams to turn an imaginary budget into a real-world solution.</span>
        <span className="block mt-2 text-black/75">
          Teams will receive a virtual capital fund and a catalogue of Idea Lab equipment with their prices. Using only their given budget, they must choose their resources and design a project that addresses a real-world problem and aligns with one or more <strong>UN Sustainable Development Goals (SDGs)</strong>.
        </span>
        <span className="block mt-2 text-black/75">
          The resources are not physically provided during the challenge. Teams will be judged on their idea, resource planning, creativity, uniqueness and feasibility.
        </span>
        <div className="mt-4">
          <img src={rupeesOverviewImage} alt="SDG Goals" className="h-20 md:h-24 object-contain" />
        </div>
        <div className="mt-6 p-6" style={{ background: '#f8fafc', borderLeft: '6px solid #0b2140' }}>
          <span className="block font-black uppercase tracking-widest text-[#0b2140] text-lg">And the best part?</span>
          <span className="block text-[16px] font-bold text-black/70 mt-2">The winning team gets the opportunity to bring their idea into life at the SRM Easwari Innovation Center, during Peravai.</span>
        </div>
      </>
    ),
    venue: 'Academic Block', day: 'Day 1', time: '12 PM Onwards', accent: '#e4ab00ff', accentLight: '#fefce8',
    rules: [
      { title: '1. Team Size', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Teams of up to 3 members. All members must be present on both days of the event.' },
      { title: '2. Materials', body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium. Only materials provided at the venue may be used. No external materials are allowed.' },
      { title: '3. Build Time', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis. Teams have a fixed window to construct their product from the given junk materials.' },
      { title: '4. Presentation', body: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit. Each team must present their creation explaining functionality and innovation to the judges.' },
      { title: '5. Judging Criteria', body: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus. Judged on creativity, structural integrity, utility, and presentation effectiveness.' },
    ],
    coverImage: rupeesPoster,
    posters: [rupeesRulesPoster],
    fee: 600,
    isGroup: true,
  },
  {
    id: 'pitch-perfect', name: 'Pitch Perfect', limit: '1–5 Members',
    cardDesc: 'A two-day startup pitching competition taking young entrepreneurs from the first pitch to the investor stage.',
    desc: (
      <>
        <span className="block text-xl font-black uppercase tracking-tight text-[#0b2140] mb-3">From the first pitch to the investor room</span>
        <span className="block mt-2 text-black/75">
          In partnership with Nebula, <strong>Pitch Perfect</strong> is a two-day startup pitching competition that gives young entrepreneurs the opportunity to take their ideas from the first pitch to the investor stage.
        </span>
        <span className="block font-black uppercase tracking-widest text-[#0b2140] text-sm mt-4">Day 1 - Prelims</span>
        <span className="block mt-1 text-black/75">
          Participants will pitch their startup ideas before a preliminary jury, presenting their problem statement, solution, business model, market opportunity and growth potential. Based on their pitch and overall potential, the strongest teams will be shortlisted for the grand finale.
        </span>
        <span className="block font-black uppercase tracking-widest text-[#0b2140] text-sm mt-4">Day 2 - Grand Finale</span>
        <span className="block mt-1 text-black/75">
          The shortlisted teams will pitch their startups directly in front of a distinguished panel of investors, presenting their ventures, answering investor questions and making their case for why their startup deserves attention and opportunity.
        </span>
        <div className="mt-6 p-6" style={{ background: '#f8fafc', borderLeft: '6px solid #0b2140' }}>
          <span className="block font-black uppercase tracking-widest text-[#0b2140] text-lg">Pitch Perfect</span>
          <span className="block text-[16px] font-bold text-black/70 mt-2">This is where young founders take their ideas one step closer to becoming real ventures.</span>
        </div>
      </>
    ),
    venue: 'EEC', day: 'Both Days', time: '12 PM Onwards', accent: '#980000', accentLight: '#fef2f2',
    rules: [
      { title: '1. Team Size', body: 'Teams can have a minimum of 1 and a maximum of 5 members.' },
      { title: '2. Registration & Payment', body: 'The team leader must register and make the payment of ₹700 for the team. Members must join using the team code.' },
      { title: '3. Presentation', body: 'Each team will get 5 minutes to pitch their idea, followed by a 3-minute Q&A session with the judges.' },
      { title: '4. Format', body: 'Presentations must be in PPT or PDF format. Prototypes are highly encouraged.' },
      { title: '5. Judging Criteria', body: 'Evaluated on innovation, business model, market research, and clarity of pitch.' },
    ],
    coverImage: pitchPoster,
    posters: [pitchRulesPoster],
    fee: 700,
    isGroup: true,
  },
  {
    id: 'scale-up-studio', name: 'ScaleUp Studio', limit: 'Limit 3',
    cardDesc: 'Teams will select an existing Indian brand and take on the challenge of reimagining it for a new generation.',
    desc: (
      <>
        <span className="block text-xl font-black uppercase tracking-tight text-[#0b2140] mb-3">What if you could rethink a brand from the ground up?</span>
        <span className="block mt-2 text-black/75">
          In <strong>Scale Up Studio</strong>, teams will select an existing brand and take on the challenge of reimagining it for a new generation.
        </span>
        <span className="block mt-2 text-black/75">
          Participants will analyse the brand, identify opportunities for improvement and rework its identity, design, technical aspects and business strategy to create a fresh and relevant version of the brand.
        </span>
        <span className="block mt-2 text-black/75">
          From rebranding and customer experience to product design, technology and business models, teams have the freedom to rethink how the brand could evolve in today's market.
        </span>
        <div className="mt-6 p-6" style={{ background: '#f8fafc', borderLeft: '6px solid #0b2140' }}>
          <span className="block font-black uppercase tracking-widest text-[#0b2140] text-lg">Scale Up Studio</span>
          <span className="block text-[16px] font-bold text-black/70 mt-2">Teams will present their reimagined brand and strategy to the jury.</span>
          <span className="block text-[16px] font-bold text-black/70 mt-2">Showcasing how their ideas can create a stronger, more relevant and future-ready business.</span>
        </div>
      </>
    ),
    venue: 'Academic Block', day: 'Day 2', time: '9 AM Onwards', accent: '#099249ff', accentLight: '#f0fdf4',
    rules: [
      { title: '1. nee solu', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A maximum of 3 members per team. Each team must register together prior to the event.' },
      { title: '2. Round Structure', body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse. The event consists of multiple elimination rounds. Teams must clear each round to advance.' },
      { title: '3. Resources', body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. No pre-prepared materials are allowed. All work must be done on-site during the event.' },
      { title: '4. Time Limit', body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi. Each round will have a strict time limit. Incomplete submissions will be disqualified.' },
      { title: '5. Conduct', body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa. Fair play is mandatory. Any disruption or unethical behavior results in immediate elimination.' },
    ],
    coverImage: scaleupPoster,
    posters: [scaleupRulesPoster],
    fee: 600,
    isGroup: true,
  },
];

const INDIVIDUAL_EVENTS = [
  {
    id: 'design-thinking-bootcamp', name: 'Design Thinking Bootcamp',
    cardDesc: 'A hands-on session designed for students and aspiring entrepreneurs who want to transform their ideas into real, user-focused solutions.',
    desc: (
      <>
        <span className="block text-xl font-black uppercase tracking-tight text-[#a80d11] mb-3">Have an idea for a startup but aren't sure where to start?</span>
        <span className="block mt-2 text-black/75">
          The <strong>Design Thinking Bootcamp</strong> is a hands-on session designed for students and aspiring entrepreneurs who want to transform their ideas into real, user-focused solutions.
        </span>
        <span className="block mt-2 text-black/75">
          Led by Lavanya G, an experienced entrepreneurship enabler, innovation coach and strategic advisor, the bootcamp will guide participants through the fundamentals of design thinking, problem identification, user understanding, ideation, validation and solution development.
        </span>
        <span className="block mt-2 text-black/75">
          Rather than simply teaching entrepreneurship, the session will help participants think like founders - understand the problem before building the solution, challenge assumptions, identify real user needs and explore whether an idea can become a meaningful venture.
        </span>
        <div className="mt-6 p-6" style={{ background: '#fff0f0', borderLeft: '6px solid #a80d11' }}>
          <span className="block font-black uppercase tracking-widest text-[#a80d11] text-lg">Design Thinking Bootcamp</span>
          <span className="block text-[16px] font-bold text-black/70 mt-2">Whether you already have a startup idea or simply have a problem you want to solve.</span>
          <span className="block text-[14px] italic text-black/60 mt-2">This bootcamp will give you the frameworks and guidance to take your first step.</span>
        </div>
        <div className="mt-6 p-5" style={{ background: '#fff0f0', borderLeft: '6px solid #a80d11', borderRadius: '8px' }}>
          <span className="block text-[18px] font-black uppercase tracking-tight text-black">Lavanya G</span>
          <a
            href="https://www.linkedin.com/in/lavanya-g-028a55186/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 font-black uppercase text-[11px] tracking-widest text-white transition-all"
            style={{ background: '#0077b5', borderRadius: '4px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            View LinkedIn Profile
          </a>
        </div>
      </>
    ),
    venue: 'MBA Seminar Hall 2', day: 'Both Days', time: '11:30 AM Onwards', accent: '#f43b38', accentLight: '#fef2f2',
    rules: [
      { title: '1. Attendance', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Full attendance on both days is mandatory. Partial attendance will result in disqualification from certification.' },
      { title: '2. Prerequisites', body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium. No prior experience is required. Bring your own laptop and a willingness to learn.' },
      { title: '3. Participation', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis. Active participation in all sessions and hands-on activities is expected from every attendee.' },
      { title: '4. Assignments', body: 'Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit. Mini-assignments will be given at the end of each session. Completion is required for certification.' },
      { title: '5. Conduct', body: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe. Maintain decorum in the hall. Disruptive behavior may lead to removal from the bootcamp.' },
    ],
    coverImage: bootcampPoster,
    posters: [lavanya],
    isGroup: false,
  },
  {
    id: 'illogical-marketing', name: 'The Art of Selling Nothing',
    cardDesc: "You'll receive an illogical product on the spot and must pitch it convincingly using branding, storytelling and persuasion.",
    desc: (
      <>
        <span className="block text-xl font-black uppercase tracking-tight text-[#a80d11] mb-3">Can you sell a product that makes absolutely no sense?</span>
        <span className="block mt-2 text-black/75">
          In this challenge, participants will be given an illogical or unconventional product and must create a convincing sales pitch to make it desirable to the audience.
        </span>
        <span className="block mt-3 font-bold text-black/90">Participants will be evaluated on their ability to:</span>
        <ul className="list-disc pl-5 mt-1 text-black/75 space-y-1">
          <li>Understand the product and target audience</li>
          <li>Present a convincing sales pitch</li>
          <li>Demonstrate communication and persuasion skills</li>
          <li>Use branding, positioning and storytelling effectively</li>
          <li>Handle the challenge with spontaneity and confidence</li>
        </ul>
        <div className="mt-6 p-6" style={{ background: '#fff0f0', borderLeft: '6px solid #a80d11' }}>
          <span className="block font-black uppercase tracking-widest text-[#a80d11] text-lg">The Art of Selling Nothing</span>
          <span className="block text-[16px] font-bold text-black/70 mt-2">The product may be illogical.</span>
          <span className="block text-[14px] italic text-black/60 mt-2">Your marketing strategy cannot be.</span>
        </div>
      </>
    ),
    venue: 'Hi-Tech Hall 2', day: 'Day 1', time: '9 AM Onwards', accent: '#8504fc', accentLight: '#faf5ff',
    rules: [
      { title: '1. Solo Event', body: 'This is a solo event.' },
      { title: '2. Participation Confirmation', body: 'Participation will be confirmed upon completion of payment.' },
      { title: '3. Reporting Time', body: 'All participants must report to their allocated venue 15 minutes before the start of the event. ID cards are mandatory for all participants.' },
      { title: '4. Format', body: 'Participants will be given an illogical product and must come up with convincing marketing strategies to sell it. The judges will provide the product on the spot.' },
      { title: '5. Code of Conduct', body: "Any form of unfair practice or copied work will lead to immediate disqualification. The judges' decision will be final and will not be open to discussion." },
    ],
    coverImage: artPoster,
    posters: [artRulesPoster],
    isGroup: false,
  },
  {
    id: 'riseher', name: 'Rise Her',
    cardDesc: 'A dedicated women-only cohort focused on identifying, empowering and supporting aspiring women entrepreneurs.',
    desc: (
      <>
        <span className="block text-xl font-black uppercase tracking-tight text-[#a80d11] mb-3">Identify. Mentor. Empower. Build the next generation of women entrepreneurs.</span>
        <span className="block mt-2 text-black/75">
          A dedicated women-only cohort focused on identifying, empowering and supporting aspiring women entrepreneurs who are looking to explore entrepreneurship and build meaningful ventures.
        </span>
        <span className="block mt-2 text-black/75">
          With several women-led startups already identified through the TN RISE ecosystem, this initiative aims to discover and nurture the next generation of women entrepreneurs - students with entrepreneurial aspirations, ideas or the ambition to build their own ventures.
        </span>
        <span className="block mt-2 text-black/75">
          The cohort will provide participants with mentorship, guidance and exposure to the startup ecosystem, helping them shape their ideas, understand the entrepreneurial journey and explore opportunities to turn their concepts into viable ventures.
        </span>
        <div className="mt-6 p-6" style={{ background: '#fff0f0', borderLeft: '6px solid #a80d11' }}>
          <span className="block font-black uppercase tracking-widest text-[#a80d11] text-lg">Rise Her</span>
          <span className="block text-[16px] font-bold text-black/70 mt-2">Selected participants will also have the opportunity to be onboarded for continued mentorship and support through TN RISE, creating a pathway beyond the event towards further guidance and entrepreneurial development.</span>
        </div>
      </>
    ),
    venue: 'MBA Seminar Hall 1', day: 'Both Days', time: '9 AM Onwards', accent: '#c50637', accentLight: '#fff1f2',
    rules: [
      { title: '1. Solo Event', body: 'This is an individual event open to all interested participants.' },
      { title: '2. Participation Confirmation', body: 'Participation will be confirmed upon completion of registration.' },
      { title: '3. Reporting Time', body: 'Report to the venue 15 minutes prior. ID cards are mandatory.' },
    ],
    coverImage: risePoster,
    posters: [riseRulesPoster],
    isGroup: false,
  },
];

const ALL_EVENTS = [...GROUP_EVENTS, ...INDIVIDUAL_EVENTS];

/* ─── Animated Section Wrapper ────────────────────────────────────────── */
const FadeInSection = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Rule Card ───────────────────────────────────────────────────────── */
const RuleCard = ({ rule, index, accent }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-5 p-5 bg-white"
      style={{
        border: '2.5px solid #111',
        borderLeft: `6px solid ${accent}`,
        boxShadow: '5px 5px 0 #111',
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center font-black text-white text-sm"
        style={{ width: 36, height: 36, background: accent, border: '2px solid #111' }}
      >
        {index + 1}
      </div>
      <div>
        <p className="font-black uppercase tracking-wide text-[12px] mb-1" style={{ color: accent }}>
          {rule.title}
        </p>
        <p className="text-[15px] font-medium text-black/75 leading-relaxed">{rule.body}</p>
      </div>
    </motion.div>
  );
};


/* ─── Main Event Detail Page ──────────────────────────────────────────── */
const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, registration } = useAuth();
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollY } = useScroll();

  /* Hero parallax */
  const heroY = useTransform(scrollY, [0, 500], [0, 160]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 350], [1, 1.08]);

  /* Find event */
  const event = ALL_EVENTS.find(e => e.id === eventId);
  const isGroup = event ? event.isGroup : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#fffcf4] bg-grid-pattern">
        <div className="text-center">
          <p className="text-6xl font-black text-black/10 uppercase tracking-widest mb-4">404</p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Event Not Found</h1>
          <p className="text-black/50 font-bold mb-8">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 mx-auto font-black uppercase text-[11px] tracking-widest px-8 py-3.5 bg-black text-white"
            style={{ border: '4px solid #111', boxShadow: '5px 5px 0 #555' }}
          >
            <ArrowLeft size={14} /> Back to Events
          </button>
        </div>
      </div>
    );
  }

  const accent = event.accent;
  const accentLight = event.accentLight;

  const isRegistered =
    registration?.registeredEvents?.includes(event.id) ||
    registration?.paidEvents?.includes(event.id);

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div ref={containerRef} className="min-h-screen bg-[#fffcf4] bg-grid-pattern overflow-x-hidden">

      {/* ── Floating Back Button ─────────────────────────────────────────── */}
      <motion.button
        onClick={() => navigate('/events')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest px-4 py-2.5 bg-white text-black"
        style={{ border: '3px solid #111', boxShadow: '4px 4px 0 #111' }}
        whileHover={{ y: -1, boxShadow: '5px 5px 0 #111' }}
        whileTap={{ scale: 0.97 }}
      >
        <ArrowLeft size={13} />
        Events
      </motion.button>

      {/* ── Event Header (Enhanced Catalog Style) ─────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative w-full pt-20 pb-4 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto overflow-hidden"
      >
        <div className="relative z-10 flex flex-col">
          {/* Top badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-3 mb-5"
          >
            <span
              className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
              style={{ background: accentLight, color: accent, border: `1px solid ${accent}` }}
            >
              {isGroup ? '👥 Team Event' : '👤 Individual'}
            </span>
            {event.limit && (
              <span className="text-[11px] font-bold uppercase tracking-widest text-black/60 bg-black/5 px-3 py-1.5 rounded-full">
                {event.limit}
              </span>
            )}
            {event.fee && (
              <span className="text-[11px] font-bold uppercase tracking-widest text-black/60 bg-black/5 px-3 py-1.5 rounded-full">
                &#8377;{event.fee} Entry Fee
              </span>
            )}
          </motion.div>

          {/* Event name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black uppercase leading-[0.9] tracking-tighter mb-8"
            style={{ 
              fontSize: 'clamp(40px, 8vw, 85px)', 
              color: '#0a0a0a',
              letterSpacing: '-0.03em'
            }}
          >
            {event.name}
          </motion.h1>

          {/* Meta details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4"
          >
            {[
              { icon: <MapPin size={16} strokeWidth={2.5} />, label: event.venue },
              { icon: <Calendar size={16} strokeWidth={2.5} />, label: event.day },
              ...(event.time ? [{ icon: <Clock size={16} strokeWidth={2.5} />, label: event.time }] : []),
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-black/5 hover:border-black/10 transition-colors"
              >
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ background: accentLight, color: accent }}
                >
                  {item.icon}
                </div>
                <span className="text-[13px] font-bold uppercase tracking-widest text-black/80">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Animated Divider */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
          className="w-full h-[3px] mt-6 origin-left"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
      </div>

      {/* ── Body Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-2 md:py-8 max-w-7xl mx-auto">

        {/* ── Two-column layout (desc + sidebar) ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* ── Left: Main Content ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-14">

            {/* ── About Section ─────────────────────────────────────────── */}
            <FadeInSection>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="flex items-center justify-center p-2.5"
                  style={{ border: `3px solid ${accent}`, background: accentLight }}
                >
                  <BookOpen size={20} color={accent} strokeWidth={3} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-black uppercase tracking-tighter"
                  style={{ color: accent }}
                >
                  About the Event
                </h2>
              </div>
              <div
                className="p-7 md:p-10 bg-white"
                style={{
                  border: '3px solid #111',
                  borderLeft: `7px solid ${accent}`,
                  boxShadow: '8px 8px 0 #111',
                }}
              >
                <div className="text-[16px] md:text-[17px] font-medium text-black/80 leading-relaxed space-y-3">
                  {event.desc}
                </div>
              </div>
            </FadeInSection>

            {/* ── Poster / Brochure ─────────────────────────────────────── */}
            {event.posters && event.posters.length > 0 && (
              <FadeInSection delay={0.15}>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="flex items-center justify-center p-2.5"
                    style={{ border: `3px solid ${accent}`, background: accentLight }}
                  >
                    <Star size={20} color={accent} strokeWidth={3} />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-black uppercase tracking-tighter"
                    style={{ color: accent }}
                  >
                    Event Poster
                  </h2>
                </div>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '12px 12px 0 #111' }}
                  transition={{ duration: 0.25 }}
                  style={{
                    border: '3px solid #111',
                    boxShadow: '8px 8px 0 #111',
                    overflow: 'hidden',
                    background: '#fff',
                  }}
                >
                  <img
                    src={event.posters[0]}
                    alt="Event Poster"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </motion.div>
              </FadeInSection>
            )}
          </div>

          {/* ── Right: Sticky Sidebar ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* ── Register Card ─────────────────────────────────────── */}
              <FadeInSection delay={0.2}>
                <motion.div
                  className="bg-white"
                  style={{
                    border: '3px solid #111',
                    boxShadow: '8px 8px 0 #111',
                    overflow: 'hidden',
                  }}
                  whileHover={{ y: -3, boxShadow: '12px 12px 0 #111' }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Top accent bar */}
                  <div style={{ height: 6, background: accent }} />

                  <div className="p-7">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-1" style={{ color: accent }}>
                      {isGroup ? '👥 Team Event' : '👤 Individual Event'}
                    </p>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-5">
                      {event.name}
                    </h3>

                    {/* Info grid */}
                    <div className="space-y-3 mb-7">
                      {[
                        { icon: <MapPin size={13} />, label: 'Venue', value: event.venue },
                        { icon: <Calendar size={13} />, label: 'Day', value: event.day },
                        ...(event.time ? [{ icon: <Clock size={13} />, label: 'Time', value: event.time }] : []),
                        ...(event.limit ? [{ icon: <Users size={13} />, label: 'Team Size', value: event.limit }] : []),
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center mt-0.5" style={{ color: accent }}>
                            {item.icon}
                          </span>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-black/40">{item.label}</p>
                            <p className="text-[13px] font-bold text-black">{item.value}</p>
                          </div>
                        </div>
                      ))}
                      {event.fee && (
                        <div
                          className="flex items-center justify-between p-3 mt-2"
                          style={{ background: accentLight, border: `2px solid ${accent}` }}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>
                            Entry Fee
                          </span>
                          <span className="text-xl font-black text-black">&#8377;{event.fee}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ height: 2, background: '#111', marginBottom: 20 }} />

                    {/* Register / Registered button */}
                    {isRegistered ? (
                      <div
                        className="w-full flex items-center justify-center gap-2 font-black uppercase text-[11px] tracking-widest py-4 text-white"
                        style={{ background: '#16a34a', border: '3px solid #15803d' }}
                      >
                        <CheckCircle2 size={15} /> Registered
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => navigate('/events', { state: { registerEventId: event.id } })}
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2.5 font-black uppercase text-[11px] tracking-widest py-4 text-white transition-all"
                        style={{
                          background: accent,
                          border: '3px solid #111',
                          boxShadow: '5px 5px 0 #111',
                        }}
                        whileHover={{ y: -2, boxShadow: '7px 7px 0 #111' }}
                      >
                        Register Now <ArrowRight size={14} />
                      </motion.button>
                    )}

                    <button
                      onClick={() => navigate('/events')}
                      className="w-full flex items-center justify-center gap-2 mt-3 font-black uppercase text-[10px] tracking-widest py-3 text-black bg-transparent transition-all hover:bg-black/5"
                      style={{ border: '2.5px solid #111' }}
                    >
                      <ArrowLeft size={12} /> Back to Events
                    </button>
                  </div>
                </motion.div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA Banner ────────────────────────────────────────────── */}
      <FadeInSection delay={0.1}>
        <div
          className="relative overflow-hidden"
          style={{ background: accent, borderTop: '4px solid #111', borderBottom: '4px solid #111' }}
        >
          {/* Animated diagonal stripes */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 20px)',
            }}
            animate={{ backgroundPosition: ['0px 0px', '28.284px 28.284px'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative z-10 px-6 md:px-24 py-14 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">
                Don't miss out
              </p>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                Ready to join<br />{event.name}?
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                onClick={() => navigate('/events', { state: { registerEventId: event.id } })}
                className="flex items-center gap-3 font-black uppercase text-[11px] tracking-widest px-10 py-4 bg-white text-black border-4 border-black"
                style={{ boxShadow: '6px 6px 0 rgba(0,0,0,0.4)' }}
                whileHover={{ y: -2, boxShadow: '8px 8px 0 rgba(0,0,0,0.4)' }}
                whileTap={{ scale: 0.97 }}
              >
                Register Now <ArrowRight size={14} />
              </motion.button>
              <motion.button
                onClick={() => navigate('/events')}
                className="flex items-center gap-3 font-black uppercase text-[11px] tracking-widest px-10 py-4 text-white"
                style={{ border: '4px solid rgba(255,255,255,0.4)' }}
                whileHover={{ borderColor: 'rgba(255, 255, 255, 0.9)', background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft size={14} /> View All Events
              </motion.button>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  );
};

export default EventDetailPage;
