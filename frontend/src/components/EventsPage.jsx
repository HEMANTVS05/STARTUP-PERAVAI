import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Users, User, AlertCircle, MapPin, Calendar, ArrowRight, X, BookOpen, ChevronRight, ChevronLeft, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EventRegistrationModal from './EventRegistrationModal';
import HackathonModal from './HackathonModal';
import GroupEventModal from './GroupEventModal';
import AuthModal from './AuthModal';
import RegistrationForm from './RegistrationForm';
import api from '../utils/api';
import hackathonRulesPoster from '../assets/rules11.png';
import pitchRulesPoster from '../assets/rules22.png';
import hackathonPoster from '../assets/hackathon_cover.png';
import singamposter from '../assets/singam_cover.png';
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
import madhav from '../assets/madhav.png';
import masterclass from '../assets/masterclass.png';

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
    venue: 'MLCP labs', day: 'Both Days', time: '1 PM Onwards', accent: '#0b2140', accentLight: '#e8f0ff', fee: 1500,
    rules: [
      { title: 'Team Size', body: 'Each team must consist of 3–5 members.' },
      { title: 'Participation Confirmation', body: 'Participation will be confirmed upon completion of payment.' },
      { title: 'Registration & Payment', body: 'The team leader must register and make the payment for all team members. All team members must join the team created by the team leader.' },
      { title: 'Reporting Time', body: 'All participants must report to their allocated venue 15 minutes before the start of the event. ID cards are mandatory for all participants.' },
      { title: 'Problem Statements', body: 'Problem statements will be revealed on the day of the event.' },
      { title: 'Code of Conduct', body: 'Any form of unfair practice or copied work will lead to immediate disqualification. The judges\' decision will be final and will not be open to discussion.' },
    ],
    // Add poster image paths here when ready:
    // posters: [hackathonPoster, hackathonRulesPoster],
    coverImage: hackathonPoster,
    posters: [hackathonRulesPoster],
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
          <span className="block text-[16px] font-bold text-black/70 mt-2">The winning team gets the opportunity to bring their idea into life at the SRM Easwari Innovation Center, during Peravai. </span>
        </div>
      </>
    ),
    venue: 'Academic Block', day: 'Day 1', time: '12 PM Onwards', accent: '#0b2140', accentLight: '#e8f0ff',
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
    venue: 'EEC', day: 'Both Days', time: '12 PM Onwards', accent: '#0b2140', accentLight: '#e8f0ff',
    rules: [
      { title: '1. Team Size', body: 'Teams can have a minimum of 1 and a maximum of 5 members.' },
      { title: '2. Registration & Payment', body: 'The team leader must register and make the payment of ₹700 for the team. Members must join using the team code.' },
      { title: '3. Presentation', body: 'Each team will get 5 minutes to pitch their idea, followed by a 3-minute Q&A session with the judges.' },
      { title: '4. Format', body: 'Presentations must be in PPT or PDF format. Prototypes are highly encouraged.' },
      { title: '5. Judging Criteria', body: 'Evaluated on innovation, business model, market research, and clarity of pitch.' },
    ],
    coverImage: pitchPoster, // Placeholder
    posters: [pitchRulesPoster], // Placeholder
    fee: 1,
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
    venue: 'Academic Block', day: 'Day 2', time: '9 AM Onwards', accent: '#0b2140', accentLight: '#e8f0ff',
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
  },
];

const INDIVIDUAL_EVENTS = [
  // Live Podcast — commented out until guests are confirmed
  // { id: 'live-podcast', name: 'Live Podcast', ... }
  // Panel Discussion — commented out until guests are confirmed
  // { id: 'panel-discussions', name: 'Panel Discussion', ... }
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
    venue: 'MBA Seminar Hall 2', day: 'Both Days', time: '11:30 AM Onwards', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Attendance', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Full attendance on both days is mandatory. Partial attendance will result in disqualification from certification.' },
      { title: '2. Prerequisites', body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium. No prior experience is required. Bring your own laptop and a willingness to learn.' },
      { title: '3. Participation', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis. Active participation in all sessions and hands-on activities is expected from every attendee.' },
      { title: '4. Assignments', body: 'Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit. Mini-assignments will be given at the end of each session. Completion is required for certification.' },
      { title: '5. Conduct', body: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe. Maintain decorum in the hall. Disruptive behavior may lead to removal from the bootcamp.' },
    ],

    coverImage: bootcampPoster,
    posters: [lavanya],

  },
  {
    id: 'masterclass', name: 'Masterclass',
    cardDesc: 'An exclusive session with industry experts to dive deep into specialized topics.',
    desc: (
      <>
        <span className="block text-xl font-black uppercase tracking-tight text-[#a80d11] mb-3">Ready to master the art of startups?</span>
        <span className="block mt-2 text-black/75">
          This <strong>Masterclass</strong> is a hands-on session designed for students and aspiring entrepreneurs who want to transform their ideas into real, user-focused solutions.
        </span>
        <div className="mt-6 p-6" style={{ background: '#fff0f0', borderLeft: '6px solid #a80d11' }}>
          <span className="block font-black uppercase tracking-widest text-[#a80d11] text-lg">Masterclass</span>
          <span className="block text-[16px] font-bold text-black/70 mt-2">Learn from the best in the industry.</span>
        </div>
      </>
    ),
    venue: 'Hi-Tech Hall 2', day: 'Day 2', time: '10 AM Onwards', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Registration', body: 'Registration is mandatory and costs ₹100.' },
      { title: '2. Attendance', body: 'Please arrive 15 minutes before the session starts.' },
      { title: '3. Materials', body: 'Bring a notepad or device to take notes.' },
    ],
    coverImage: madhav, // Placeholder
    posters: [masterclass], // Placeholder
    fee: 100,
  },

  {
    id: 'illogical-marketing', name: 'The Art of Selling Nothing',
    cardDesc: 'You\'ll receive an illogical product on the spot and must pitch it convincingly using branding, storytelling and persuasion.',
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
    venue: 'Hi-Tech Hall 2', day: 'Day 1', time: '9 AM Onwards', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Solo Event', body: 'This is a solo event.' },
      { title: '2. Participation Confirmation', body: 'Participation will be confirmed upon completion of payment.' },
      { title: '3. Reporting Time', body: 'All participants must report to their allocated venue 15 minutes before the start of the event. ID cards are mandatory for all participants.' },
      { title: '4. Format', body: 'Participants will be given an illogical product and must come up with convincing marketing strategies to sell it. The judges will provide the product on the spot.' },
      { title: '5. Code of Conduct', body: 'Any form of unfair practice or copied work will lead to immediate disqualification. The judges\' decision will be final and will not be open to discussion.' },
    ],
    coverImage: artPoster,
    posters: [artRulesPoster],
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
    venue: 'MBA Seminar Hall 1', day: 'Both Days', time: '9 AM Onwards', accent: '#a80d11', accentLight: '#fff0f0',
    rules: [
      { title: '1. Solo Event', body: 'This is an individual event open to all interested participants.' },
      { title: '2. Participation Confirmation', body: 'Participation will be confirmed upon completion of registration.' },
      { title: '3. Reporting Time', body: 'Report to the venue 15 minutes prior. ID cards are mandatory.' },
    ],
    coverImage: risePoster, // Using placeholder until specific poster is provided
    posters: [riseRulesPoster],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Event Poster (single image, no slideshow) ─────────────────────────── */
const PosterSlideshow = ({ posters, accent }) => {
  const poster = posters?.[0];

  return (
    <div className="mb-6">
      {/* Section label */}
      <h3
        className="text-[11px] font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-2"
        style={{ color: accent }}
      >
        <span className="inline-block w-5 h-[2.5px]" style={{ background: accent }} />
        Event Poster
      </h3>

      <div
        style={{
          background: '#fff',
          border: '3px solid #111',
          boxShadow: '6px 6px 0 #111',
          overflow: 'hidden',
        }}
      >
        {!poster ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#bbb', padding: '100px 20px' }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 11 }}>Poster Coming Soon</span>
          </div>
        ) : (
          <img
            src={poster}
            alt="Event Poster"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        )}
      </div>
    </div>
  );
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
    id: 'd1p1',
    day: 'day1',
    label: 'Panel 1',
    topic: 'From Participation to Power: Reimagining the Role of Women in India\'s Entrepreneurial Economy',
    about: 'A conversation on how women are moving beyond participation to leadership, ownership, and decision-making across India\'s startup ecosystem. The session explores the barriers, opportunities, networks, and support systems shaping the next generation of women entrepreneurs.',
    guests: [
      { id: 'p1g1', name: 'Guest 01', role: 'CEO, StartupX', photo: null },
      { id: 'p1g2', name: 'Guest 02', role: 'VC Partner', photo: null },
      { id: 'p1g3', name: 'Guest 03', role: 'Founder & CTO', photo: null },
      { id: 'p1g4', name: 'Guest 04', role: 'Angel Investor', photo: null },
      { id: 'p1g5', name: 'Guest 05', role: 'Policy Advisor', photo: null },
    ],
  },
  {
    id: 'd1p2',
    day: 'day1',
    label: 'Panel 2',
    topic: 'The New Industrial Revolution: Where Startups, Manufacturing & EmergingTechnologies Converge',
    about: 'A deep dive into how AI, robotics, semiconductors, automation, and advanced manufacturing are transforming India\'s industrial landscape. Industry leaders and founders explore how technology-driven startups can build globally competitive products and reshape the future of manufacturing.',
    guests: [
      { id: 'p2g1', name: 'Guest 01', role: 'AI Researcher', photo: null },
      { id: 'p2g2', name: 'Guest 02', role: 'Deep Tech VC', photo: null },
      { id: 'p2g3', name: 'Guest 03', role: 'Startup Mentor', photo: null },
      { id: 'p2g4', name: 'Guest 04', role: 'Innovation Head', photo: null },
      { id: 'p2g5', name: 'Guest 05', role: 'Product Strategist', photo: null },
    ],
  },
  {
    id: 'd2p1',
    day: 'day2',
    label: 'Panel 1',
    topic: 'Beyond the Metros Building Companies, Capabilities & Capital Across the Next Generation of Indian Cities',
    about: 'A conversation on the rise of entrepreneurial ecosystems beyond India\'s traditional startup hubs, where regional talent, MSMEs, and emerging founders are building ambitious companies. The session explores how access to capital, incubation, infrastructure, and local networks can unlock the potential of Tier-2 and Tier-3 cities.',
    guests: [
      { id: 'p3g1', name: 'Guest 01', role: 'Impact Founder', photo: null },
      { id: 'p3g2', name: 'Guest 02', role: 'ESG Consultant', photo: null },
      { id: 'p3g3', name: 'Guest 03', role: 'Green Tech CEO', photo: null },
      { id: 'p3g4', name: 'Guest 04', role: 'Social Entrepreneur', photo: null },
      { id: 'p3g5', name: 'Guest 05', role: 'Impact Investor', photo: null },
    ],
  },
  {
    id: 'd2p2',
    day: 'day2',
    label: 'Panel 2',
    topic: 'The Road to Investment: How Investor Interest Becomes Conviction, Commitment & Capital',
    about: 'What makes an investor move from noticing a startup to believing in its potential and committing capital? Founders and investors unpack the journey from first conversation to due diligence, conviction, deal-making, and long-term partnership.',
    guests: [
      { id: 'p4g1', name: 'Guest 01', role: 'Growth Hacker', photo: null },
      { id: 'p4g2', name: 'Guest 02', role: 'CMO, ScaleUp', photo: null },
      { id: 'p4g3', name: 'Guest 03', role: 'Product Manager', photo: null },
      { id: 'p4g4', name: 'Guest 04', role: 'Community Lead', photo: null },
      { id: 'p4g5', name: 'Guest 05', role: 'Retention Expert', photo: null },
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
        maxWidth: 220,
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
        borderTop: `30px solid ${accent}`,
        borderLeft: '30px solid transparent',
      }} />
      {guest.photo ? (
        <img src={guest.photo} alt={guest.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
      ) : (
        <svg width="80" height="80" viewBox="0 0 56 56" fill="none">
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
  const [activeDay, setActiveDay] = useState('day1');
  const [activePanelIdx, setActivePanelIdx] = useState(0);

  const filteredPanels = PANEL_DATA.filter(p => p.day === activeDay);
  const panel = filteredPanels[activePanelIdx] || filteredPanels[0];

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
          className="relative flex flex-col w-full"
          style={{
            maxWidth: '1300px',
            minHeight: '78vh',
            maxHeight: '100vh',
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
              <div>
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
                onClick={() => { setActiveDay(day); setActivePanelIdx(0); }}
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

          {/* Panel Title & Navigation */}
          <div className="flex items-center justify-between px-7 pt-7 pb-2" style={{ flexShrink: 0 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, textTransform: 'uppercase', color: accent, lineHeight: 1, margin: 0, letterSpacing: '-0.02em' }}>
              {panel.label}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setActivePanelIdx(prev => (prev > 0 ? prev - 1 : filteredPanels.length - 1))}
                className="flex items-center justify-center transition-all"
                style={{ width: 44, height: 44, background: '#fff', border: '3px solid #111', boxShadow: '4px 4px 0 #111' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #111'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 #111'; }}
              >
                <ArrowLeft size={20} color="#111" strokeWidth={3} />
              </button>
              <button
                onClick={() => setActivePanelIdx(prev => (prev < filteredPanels.length - 1 ? prev + 1 : 0))}
                className="flex items-center justify-center transition-all"
                style={{ width: 44, height: 44, background: '#111', border: '3px solid #111', boxShadow: '4px 4px 0 #111' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #111'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 #111'; }}
              >
                <ArrowRight size={20} color="#fff" strokeWidth={3} />
              </button>
            </div>
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

                {/* Panel topic - large text */}
                <div style={{ marginBottom: 36 }}>
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
                  <p style={{ fontSize: 17, fontWeight: 600, color: 'rgba(0,0,0,0.82)', lineHeight: 1.85, margin: 0 }}>
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
                  ðŸŽ™ï¸ Live Podcast
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
            {/* Event Overview */}
            <div
              className="mb-8"
              style={{
                padding: '20px 24px',
                border: '2px solid #e5e5e5',
                borderLeft: `5px solid ${evt.accent}`,
                background: '#fafafa',
                boxShadow: '4px 4px 0 #e5e5e5',
              }}
            >
              <p
                className="text-lg font-black uppercase tracking-[0.22em] mb-4"
                style={{ color: evt.accent }}
              >
                Event Overview
              </p>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'rgba(0,0,0,0.62)', lineHeight: 1.85, margin: 0 }}>
                <span className="block font-bold text-black/90 mb-2">What really happens behind the success story?</span>
                <span className="block mb-2">
                  Hear directly from successful founders from Tamil Nadu as they share their entrepreneurial journeys — the risks they took, the failures they faced, the decisions that changed everything, and what they did differently to build their ventures.
                </span>
                <span className="block mb-3">
                  An honest, unfiltered conversation beyond the usual success stories, giving the audience a real look into what it takes to build, fail, adapt and grow a startup.
                </span>
                <span className="block italic text-black/75 mb-4">
                  No scripts. No filters. Just real founder stories.
                </span>
                <span
                  className="inline-block font-black uppercase text-[11px] tracking-[0.2em]"
                  style={{ background: evt.accentLight, color: evt.accent, border: `2px solid ${evt.accent}`, padding: '4px 10px' }}
                >
                  Join Live
                </span>
              </div>
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

/* ── Rise Her — Special Learn More (no poster, idea form after registration) ── */
const RiseHerLearnMoreModal = ({ evt, onClose, onRegister }) => {
  const { user, registration } = useAuth();
  const isRegistered = !!(
    registration?.paidEvents?.includes('riseher') ||
    registration?.registeredEvents?.includes('riseher')
  );
  const [form, setForm] = useState({ startupName: '', ideaBrief: '', pitchDeckUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(isRegistered);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isRegistered) {
      api.get('/api/riseher/my')
        .then(res => {
          if (res.data && res.data.startupName) {
            setSubmitted(true);
          }
        })
        .catch(err => {
          // If 404, it means no submission yet, which is fine
          console.error('No previous submission found or error fetching.');
        })
        .finally(() => {
          setLoadingStatus(false);
        });
    } else {
      setLoadingStatus(false);
    }
  }, [isRegistered]);

  const setF = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const accent = evt.accent || '#a80d11';
  const iCls = 'w-full border-4 border-black px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white placeholder:text-gray-400';
  const lCls = 'block font-black uppercase tracking-[0.2em] text-xs text-black mb-1.5';

  const handleSubmit = async () => {
    if (!form.startupName.trim()) { setFormError('Startup / Project / Idea Name is required.'); return; }
    if (!form.ideaBrief.trim()) { setFormError('Please briefly explain your idea.'); return; }
    if (!form.pitchDeckUrl.trim()) { setFormError('Presentation / Pitch Deck link is required.'); return; }
    setFormError('');
    setSubmitting(true);
    try {
      await api.post('/api/riseher', {
        startupName: form.startupName.trim(),
        ideaBrief: form.ideaBrief.trim(),
        pitchDeckUrl: form.pitchDeckUrl.trim(),
      });
      setSubmitted(true);
    } catch (e) {
      setFormError('Submission failed. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden"
          style={{ background: '#fff', border: '3px solid #111', boxShadow: '10px 10px 0px #111' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Gradient accent bar */}
          <div style={{ height: '6px', background: 'linear-gradient(to right,#a80d11,#d82221 45%,#0b2140 55%,#0f50e3)', flexShrink: 0 }} />

          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: '3px solid #111', flexShrink: 0 }}>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-0.5" style={{ color: accent }}>👤 Individual Event</p>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">{evt.name}</h2>
            </div>
            <button
              onClick={onClose}
              style={{ width: 36, height: 36, border: '2.5px solid #111', background: '#fff', boxShadow: '3px 3px 0 #111', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#111'; }}
            ><X size={16} /></button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-7 py-6">

            {/* Meta strip */}
            <div className="flex flex-wrap gap-4 mb-6 pb-5" style={{ borderBottom: '2px dashed #ddd' }}>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-black/60 uppercase tracking-wider"><MapPin size={12} /> {evt.venue}</span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-black/60 uppercase tracking-wider"><Calendar size={12} /> {evt.day}</span>
              {evt.time && <span className="flex items-center gap-1.5 text-[11px] font-bold text-black/60 uppercase tracking-wider"><Clock size={12} /> {evt.time}</span>}
              {evt.fee && <span className="text-[11px] font-black px-2 py-0.5 uppercase tracking-widest" style={{ background: '#fff0f0', color: accent, border: `1.5px solid ${accent}` }}>₹{evt.fee} Entry</span>}
            </div>

            {/* Description — always shown, NO poster */}
            <div className="mb-6 p-5" style={{ border: '2px solid #e0e0e0', borderLeft: `5px solid ${accent}`, background: '#fff', boxShadow: '4px 4px 0 #e0e0e0' }}>
              <h4 className="text-sm font-black uppercase tracking-[0.25em] mb-3" style={{ color: accent }}>About Rise Her</h4>
              <div className="text-[15px] font-medium text-black/80 leading-relaxed">{evt.desc}</div>
            </div>

            {/* Idea Submission Form — locked until registered */}
            {isRegistered ? (
              loadingStatus ? (
                <div className="py-12 flex justify-center text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-green-500 border-4 border-black mx-auto flex items-center justify-center" style={{ boxShadow: '5px 5px 0 #111' }}>
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-black text-xs uppercase tracking-[0.3em] text-green-600">🎉 Submitted!</p>
                  <h3 className="text-xl font-black uppercase tracking-tight">Thank You</h3>
                  <p className="text-sm font-bold text-gray-500 max-w-xs mx-auto">Your details have been shared with the TN RISE team. We'll be in touch!</p>
                  <button onClick={onClose} className="px-8 py-3 border-4 border-black bg-black text-white font-black uppercase tracking-widest text-xs shadow-[4px_4px_0_#555] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Close</button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div className="flex items-center gap-3 p-3" style={{ background: '#f0f9ff', border: '3px solid #0b2140' }}>
                    <CheckCircle2 size={18} className="text-[#0b2140] shrink-0" />
                    <p className="font-black text-xs uppercase tracking-wider text-[#0b2140]">You're registered! Please fill in the details below.</p>
                  </div>

                  <div>
                    <label className={lCls}>Startup / Project / Idea Name <span className="text-red-600">*</span></label>
                    <input type="text" placeholder="e.g. GreenPath Solutions" value={form.startupName} onChange={setF('startupName')} className={iCls} />
                  </div>

                  <div>
                    <label className={lCls}>Briefly Explain Your Idea <span className="text-red-600">*</span></label>
                    <textarea rows={4} placeholder="What problem does it solve? How does it work? What impact does it create?" value={form.ideaBrief} onChange={setF('ideaBrief')} className="w-full border-4 border-black px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white placeholder:text-gray-400 resize-none" />
                  </div>

                  <div>
                    <label className={lCls}>Presentation / Pitch Deck <span className="text-red-600">*</span></label>
                    <input type="url" placeholder="https://drive.google.com/..." value={form.pitchDeckUrl} onChange={setF('pitchDeckUrl')} className={iCls} />
                    <p className="mt-2 text-[13px] font-bold text-gray-500 leading-relaxed">
                      Please upload the presentation or pitch deck of your Startup / Project / Idea and provide the Google Drive link here.{' '}
                      <strong className="text-black">Please ensure that the necessary access permissions have been enabled for the link so that the TN RISE team can view the presentation.</strong>
                    </p>
                  </div>

                  <div className="p-4 text-[15px] font-bold text-black/70 leading-relaxed" style={{ border: '2px dashed #ccc', background: '#fafafa' }}>
                    <p className="mb-3"><em>*This is only to help TN RISE understand your Startup / Project / Idea better and curate the session accordingly, and does not act as an evaluation parameter.</em></p>
                    <p><strong className="text-black">Note:</strong> In case you have teammates working on the same Startup / Project / Idea, please ask them to register individually.</p>
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 p-3 text-red-700 bg-red-50 border-l-4 border-red-600 font-bold text-xs">
                      <AlertCircle size={14} className="shrink-0" /> {formError}
                    </div>
                  )}

                  <button onClick={handleSubmit} disabled={submitting}
                    className="w-full py-4 border-4 border-black text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: accent }}
                  >
                    {submitting ? 'Submitting…' : <><span>Submit Details</span> <ArrowRight size={16} /></>}
                  </button>
                </motion.div>
              )
            ) : (
              <div className="p-6 text-center" style={{ border: '3px dashed #ccc', background: '#fafafa' }}>
                <p className="font-bold text-sm text-black/60">Complete your registration first to fill the idea submission form.</p>
              </div>
            )}
          </div>

          {/* Footer — only shown when not yet registered */}
          {!isRegistered && (
            <div className="flex items-center justify-between px-7 py-5" style={{ borderTop: '3px solid #111', background: '#fafafa', flexShrink: 0 }}>
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Spots are limited — secure yours now</p>
              <motion.button onClick={() => { onClose(); onRegister(evt); }} whileTap={{ scale: 0.96 }} whileHover={{ y: -2 }}
                className="flex items-center gap-2.5 font-black uppercase text-[11px] tracking-widest px-8 py-3 text-white transition-all"
                style={{ background: accent, border: `2.5px solid ${accent}`, boxShadow: '4px 4px 0 #111' }}
              >
                Register <ArrowRight size={13} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Learn More Modal ─────────────────────────────────────────────────── */
const LearnMoreModal = ({ evt, isGroup, onClose, onRegister }) => {
  if (evt.id === 'riseher') {
    return <RiseHerLearnMoreModal evt={evt} onClose={onClose} onRegister={onRegister} />;
  }
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
          className="relative flex flex-col w-full max-w-5xl max-h-[95vh] overflow-hidden"
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
              {evt.time && (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-black/60 uppercase tracking-wider">
                  <Clock size={12} /> {evt.time}
                </span>
              )}
              {evt.limit && (
                <span
                  className="text-[11px] font-black uppercase tracking-widest px-2 py-0.5"
                  style={{ background: evt.accentLight, color: evt.accent, border: `1.5px solid ${evt.accent}` }}
                >
                  {evt.limit}
                </span>
              )}
            </div>

            {/* Event Description */}
            <div className="mb-6">
              <div
                className="p-6"
                style={{
                  border: '2px solid #e0e0e0',
                  borderLeft: `5px solid ${evt.accent}`,
                  background: '#fff',
                  boxShadow: '4px 4px 0 #e0e0e0',
                }}
              >
                <h4 className="text-lg font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2" style={{ color: evt.accent }}>
                  <span className="inline-block w-6 h-[3px]" style={{ background: evt.accent }} />
                  Event Overview
                </h4>
                <div className="text-[18px] font-medium text-black/80 leading-relaxed">
                  {evt.desc}
                </div>
              </div>
            </div>

            {/* Poster Slideshow — always shown */}
            <PosterSlideshow posters={evt.posters || []} accent={evt.accent} />

          </div>

          {/* Footer with Register button */}
          <div
            className="flex items-center justify-between px-7 py-5"
            style={{ borderTop: '3px solid #111', background: '#fafafa', flexShrink: 0 }}
          >
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
              Spots are limited — secure yours now
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
            {evt.cardDesc || evt.desc}
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
            {evt.time && (
              <>
                <span className="text-black/30">•</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-black/50 uppercase tracking-wider">
                  <Clock size={10} /> {evt.time}
                </span>
              </>
            )}
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

const SectionHeader = ({ icon: Icon, label, accent, className = "mb-8" }) => (
  <div className={`flex items-end gap-4 ${className}`}>
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

const EventCategorySlideshow = ({ events, label, icon: Icon, accent, onRegister, isGroup }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const { registration } = useAuth();

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p + 1) % events.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + events.length) % events.length);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 1 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
  };

  const event = events[current];

  return (
    <div className="mb-16">
      {/* Section Header & Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
        <SectionHeader icon={Icon} label={label} accent={accent} className="mb-0" />

        {/* Navigation Arrows for Slideshow */}
        <div className="flex gap-2 md:gap-4 z-10">
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

      <div className="w-full flex justify-center">
        <div
          className="relative w-full max-w-[95%] xl:max-w-6xl h-[450px] md:h-[600px] lg:h-[600px] bg-gray-200 overflow-hidden border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] group cursor-pointer"
          onClick={() => setShowLearnMore(true)}
        >
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
              {/* Event poster/image */}
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.name}
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ objectPosition: 'center top' }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: event.accentLight }}>
                  {/* Background pattern */}
                  <div className="w-full h-full opacity-30"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
                      backgroundSize: '20px 20px'
                    }}
                  />
                  <p className="absolute font-black text-4xl text-black/20 uppercase tracking-widest text-center px-4">{event.name}</p>
                </div>
              )}


              {/* Badges top left */}
              <div className="absolute top-0 left-0 p-6 flex flex-wrap gap-2 z-10 pointer-events-none">
                <span
                  className="text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5"
                  style={{ background: event.accent, color: '#fff', border: `2px solid #111` }}
                >
                  {isGroup ? '👥 Team Event' : '👤 Individual'}
                </span>
                {event.limit && (
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5 bg-white text-black border-2 border-black">
                    {event.limit}
                  </span>
                )}
              </div>

              {/* Title and Description Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 text-white flex flex-col justify-end pointer-events-none">
                <div className="flex flex-wrap items-center gap-3 mb-3 drop-shadow-md">
                  <span className="flex items-center gap-3 text-[9px] sm:text-[11px] font-black uppercase tracking-widest px-2.5 py-1 bg-white text-black border-2 border-black">
                    <MapPin size={12} strokeWidth={2.5} /> {event.venue}
                  </span>
                  <span className="flex items-center gap-3 text-[9px] sm:text-[11px] font-black uppercase tracking-widest px-2.5 py-1 bg-white text-black border-2 border-black">
                    <Calendar size={12} strokeWidth={2.5} /> {event.day}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-3 text-[9px] sm:text-[11px] font-black uppercase tracking-widest px-2.5 py-1 bg-white text-black border-2 border-black">
                      <Clock size={12} strokeWidth={2.5} /> {event.time}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-4xl lg:text-5xl text-black font-black uppercase tracking-tighter leading-none drop-shadow-md">
                  {event.id === 'shark-tank' ? (
                    <>
                      Startup Singam<br />
                      <span style={{ paddingLeft: '0em' }}>Junior</span>
                    </>
                  ) : event.id === 'illogical-marketing' ? (
                    <>
                      The Art of<br />
                      Selling Nothing
                    </>
                  ) : event.name}
                </h3>

                {/* Action Buttons (Learn More / Register) */}
                <div className="mt-4 flex gap-3 pointer-events-auto">
                  {event.id !== 'masterclass' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowLearnMore(true); }}
                      className="flex items-center gap-1.5 font-black uppercase text-[11px] tracking-widest px-5 py-2.5 bg-white text-black border-4 border-black hover:bg-gray-200 transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                      Learn More <ChevronRight size={14} />
                    </button>
                  )}
                  {(() => {
                    const PAYMENT_ONLY = ['masterclass', 'riseher', 'illogical-marketing', 'design-thinking-bootcamp'];
                    const isPaidOnly = PAYMENT_ONLY.includes(event.id);
                    const isRegistered = registration?.registeredEvents?.includes(event.id)
                      || (isPaidOnly && registration?.paidEvents?.includes(event.id));
                    if (isRegistered) {
                      // Non-clickable green badge for registered events
                      return (
                        <span
                          className="flex items-center gap-1.5 font-black uppercase text-[11px] tracking-widest px-5 py-2.5 text-white border-4 cursor-default select-none"
                          style={{ background: '#16a34a', borderColor: '#15803d' }}
                        >
                          <CheckCircle2 size={14} /> Registered
                        </span>
                      );
                    }
                    return (
                      <button
                        onClick={(e) => { e.stopPropagation(); onRegister(event); }}
                        className="flex items-center gap-1.5 font-black uppercase text-[11px] tracking-widest px-5 py-2.5 text-white border-4 transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
                        style={{ background: event.accent, borderColor: '#111' }}
                      >
                        Register <ArrowRight size={14} />
                      </button>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showLearnMore && (
        <LearnMoreModal
          evt={event}
          isGroup={isGroup}
          onClose={() => setShowLearnMore(false)}
          onRegister={onRegister}
        />
      )}
    </div>
  );
};

const EventsPage = () => {
  const navigate = useNavigate();
  const { user, registration } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupEvent, setSelectedGroupEvent] = useState(null);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, pass: '', source: '' });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [pendingEventAfterProfile, setPendingEventAfterProfile] = useState(null);
  const [showGeneralPassWarning, setShowGeneralPassWarning] = useState(false);
  const [showMultipleEventWarning, setShowMultipleEventWarning] = useState(false);
  const [pendingEventAfterWarning, setPendingEventAfterWarning] = useState(null);

  const handleRegisterClick = (event) => {
    if (!user) {
      setAuthModal({ open: true, pass: 'EVENT PASS', source: 'event-browse' });
      return;
    }
    if (!registration) {
      setPendingEventAfterProfile(event);
      setShowProfileForm(true);
      return;
    }
    // Already registered — open the right modal directly
    const PAYMENT_ONLY = ['masterclass', 'riseher', 'illogical-marketing', 'design-thinking-bootcamp'];
    const isPaidOnly = PAYMENT_ONLY.includes(event.id);
    const alreadyRegistered = registration.registeredEvents?.includes(event.id)
      || (isPaidOnly && registration.paidEvents?.includes(event.id));
    if (alreadyRegistered) {
      if (event.id === 'hackathon') {
        setSelectedEvent(event);
      } else if (GROUP_EVENTS.find(g => g.id === event.id)) {
        setSelectedGroupEvent(event);
        setShowGroupModal(true);
      } else {
        setSelectedEvent(event);
      }
      return;
    }
    // Not yet registered
    if (event.id === 'hackathon') {
      setSelectedEvent(event);
    } else if (GROUP_EVENTS.find(g => g.id === event.id)) {
      setSelectedGroupEvent(event);
      setShowGroupModal(true);
    } else {
      setSelectedEvent(event);
    }
  };

  const closeModals = () => {
    setSelectedEvent(null);
    setShowGroupModal(false);
    setSelectedGroupEvent(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
      <EventCategorySlideshow
        events={GROUP_EVENTS}
        label="Group Events"
        icon={Users}
        accent="#0b2140"
        onRegister={handleRegisterClick}
        isGroup={true}
      />

      {/* Individual Events */}
      <EventCategorySlideshow
        events={INDIVIDUAL_EVENTS}
        label="Individual Events"
        icon={User}
        accent="#a80d11"
        onRegister={handleRegisterClick}
        isGroup={false}
      />

      {/* Modals */}
      {selectedEvent?.id === 'hackathon' && (
        <HackathonModal isOpen={true} onClose={closeModals} />
      )}
      {selectedEvent && selectedEvent?.id !== 'hackathon' && !GROUP_EVENTS.find(g => g.id === selectedEvent?.id) && (
        <EventRegistrationModal event={selectedEvent} onClose={closeModals} />
      )}
      {showGroupModal && selectedGroupEvent && selectedGroupEvent.id !== 'hackathon' && (
        <GroupEventModal
          isOpen={showGroupModal}
          event={selectedGroupEvent}
          onClose={closeModals}
        />
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

      {/* General Pass Warning Modal */}
      {showGeneralPassWarning && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <div
            className="fixed inset-0"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowGeneralPassWarning(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-md border-4 border-black bg-white shadow-[14px_14px_0px_rgba(0,0,0,1)]"
          >
            <div className="h-3" style={{ background: 'linear-gradient(to right, #a80d11, #d82221 45%, #0b2140 55%, #0f50e3)' }} />
            <div className="p-8">
              <div className="flex justify-end mb-4">
                <button onClick={() => setShowGeneralPassWarning(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="w-16 h-16 bg-red-500 border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Already Have General Pass</h3>
              <p className="font-bold text-gray-600 mb-6 leading-relaxed">
                You have already bought the General Pass, try with a different account.
              </p>
              <button
                onClick={() => setShowGeneralPassWarning(false)}
                className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default EventsPage;
