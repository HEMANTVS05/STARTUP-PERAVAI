import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { Star, Menu, X, Check, Zap, Crown, Ticket, MapPin, Clock, LogOut, QrCode, UserCircle, ChevronDown, Users, Download, Mail, Phone, ExternalLink, Lightbulb, Globe, Rocket, Hammer, Network, TrendingUp, Trophy, Home, BookOpen, Layers } from 'lucide-react';
import EventSlideshow from './EventSlideshow';
import AuthModal from './AuthModal';
import RegistrationForm from './RegistrationForm';
import UserDashboard from './UserDashboard';
import HackathonModal from './HackathonModal';
import EventRegistrationModal from './EventRegistrationModal';
import Dock from './Dock';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import VisitorDetailsModal from './VisitorDetailsModal';

import speaker1 from '../assets/MAMAAAA.jpeg';
import eventBrochure from '../assets/EVENT_BROCHURE.pdf';

const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const numMatch = value.match(/\d+/);
  const numValue = numMatch ? parseInt(numMatch[0]) : 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, numValue, {
        duration: 1.0,
        ease: "easeOut",
        onUpdate: (val) => {
          if (ref.current) {
            ref.current.textContent = Math.floor(val) + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, numValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

// ─── gradient presets ────────────────────────────────────────────────────────
const redGrad = { background: 'linear-gradient(135deg,#a80d11,#d82221)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const blueGrad = { background: 'linear-gradient(135deg,#0b2140,#0f50e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const blueGrad2 = { background: 'linear-gradient(130deg,#0b2140,#0f50e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const fullGrad = { background: 'linear-gradient(135deg,#a80d11,#d82221 40%,#0b2140 70%,#0f50e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const logoGrad = { background: 'linear-gradient(to right, #d82221 30%, #a80d11 40%, #11315dff 50%, #0f50e3 120%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

// ─── Events Data (22 events) ──────────────────────────────────────────────────
const eventsData = [
  // TECHNICAL COMPETITIONS
  { id: 'hackathon', name: 'Hackathon', venue: 'TRP', day: 'Both Days', description: 'Collaboration with TNWeSafe. Build real solutions that matter.', eventType: 'Team Event', category: 'Technical', color: 'bg-blue-700', textColor: 'text-white', border: 'border-0', rotate: '-rotate-1', useHackathonModal: true },
  { id: 'shark-tank', name: 'Shark Tank', venue: 'GEETHAM', day: 'Day 1 & 2', description: 'Early stage students pitch in front of dedicated investors. Top 20 teams shortlisted from 50 registrations.', eventType: 'Team Event', category: 'Technical', color: 'bg-[#1f2022]', textColor: 'text-white', border: 'border-0', rotate: 'rotate-2' },
  { id: 'phoenix-protocol', name: 'Phoenix Protocol', venue: 'TRP', day: 'Day 2', description: 'Revive forgotten brands — uncover what went wrong and pitch a comeback strategy stronger than ever.', eventType: 'Team Event', category: 'Technical', color: 'bg-white', textColor: 'text-black', border: 'border-8 border-black', rotate: '-rotate-2' },
  { id: 'illogical-marketing', name: 'Illogical Marketing', venue: 'Hi-Tech Hall 2', day: 'Day 1', description: 'Market and promote illogical objects. The goal is maximum marketing ability — creativity over logic.', eventType: 'Individual', category: 'Technical', color: 'bg-yellow-400', textColor: 'text-black', border: 'border-0', rotate: 'rotate-2' },
  { id: 'junk-to-genius', name: 'Junk to Genius', venue: 'MBA Seminar Hall 1', day: 'Both Days', description: 'Using UN Sustainable Development Goals, build something brilliant from waste items.', eventType: 'Team Event', category: 'Technical', color: 'bg-red-600', textColor: 'text-white', border: 'border-0', rotate: '-rotate-2' },
  // SUBMISSION EVENT
  { id: 'reel-making', name: 'Reel Making', venue: 'Award Show Screening', day: 'Submission', description: 'Create a reel capturing the startup spirit. Top reels screened live during the award show.', eventType: 'Team Event', category: 'Submission', color: 'bg-purple-600', textColor: 'text-white', border: 'border-0', rotate: 'rotate-1' },
  // EXPO
  { id: 'stall-expo', name: 'Stall Expo', venue: 'OAT', day: 'Both Days', description: 'Startups, sponsors, and clubs showcase to participants, investors, and students at SRM Ramapuram.', eventType: 'Showcase', category: 'Expo', color: 'bg-orange-500', textColor: 'text-white', border: 'border-0', rotate: '-rotate-1' },
  { id: 'student-project-expo', name: 'Student Project Expo', venue: 'Library', day: 'Both Days', description: 'University students showcase their working projects to relevant stakeholders and a live audience.', eventType: 'Individual/Team', category: 'Expo', color: 'bg-cyan-500', textColor: 'text-black', border: 'border-0', rotate: 'rotate-2' },
  // EXPERT EVENTS
  { id: 'panel-discussions', name: 'Panel Discussions', venue: 'GEETHAM', day: 'Day 1', description: 'Panelists engage in a curated discussion on relevant topics with a select interactive audience.', eventType: 'Individual', category: 'Expert', color: 'bg-indigo-600', textColor: 'text-white', border: 'border-0', rotate: '-rotate-1' },
  { id: 'keynote-speeches', name: 'Keynote Speeches', venue: 'TRP / GEETHAM', day: 'Both Days', description: 'Inspiring keynote sessions alongside inaugurations and the beginning of key events.', eventType: 'Attendance', category: 'Expert', color: 'bg-[#2d3748]', textColor: 'text-white', border: 'border-0', rotate: 'rotate-1' },
  { id: 'live-podcast', name: 'Live Podcast', venue: 'GEETHAM', day: 'Both Days', description: 'Live podcast sessions with industry leaders, founders, and startup ecosystem builders.', eventType: 'Individual', category: 'Expert', color: 'bg-pink-500', textColor: 'text-white', border: 'border-0', rotate: '-rotate-2' },
  { id: 'pavilions', name: 'Pavilions', venue: 'Wing 3', day: 'Day 1', description: 'StartupTN and other organizations with inquiry spots and scheme explanations.', eventType: 'Attendance', category: 'Expert', color: 'bg-teal-500', textColor: 'text-white', border: 'border-0', rotate: 'rotate-2' },
  // MAIN STAGE
  { id: 'social-impact-awards', name: 'Social Impact Awards', venue: 'GEETHAM', day: 'Day 2', description: 'Recognizing social impact-oriented startups making a real difference in the world.', eventType: 'Award', category: 'Main Stage', color: 'bg-amber-500', textColor: 'text-black', border: 'border-0', rotate: '-rotate-1' },
  { id: 'sponsor-promotions', name: 'Sponsor Promotions', venue: 'Along with Awards', day: 'Day 2', description: 'Startup companies launch new products or technology in front of stakeholders for maximum reach.', eventType: 'Showcase', category: 'Main Stage', color: 'bg-lime-400', textColor: 'text-black', border: 'border-0', rotate: 'rotate-2' },
  { id: 'valedictory', name: 'Valedictory', venue: 'Along with Awards', day: 'Day 2', description: 'Grand closing ceremony honouring the Hackathon and Shark Tank winners.', eventType: 'Attendance', category: 'Main Stage', color: 'bg-rose-600', textColor: 'text-white', border: 'border-0', rotate: '-rotate-2' },
  { id: 'easwari-startups-launch', name: 'Easwari Startups Launch', venue: 'Main Stage', day: 'Day 2', description: 'Identifying and honouring student startups incubated by Dr. R Shivakumar Foundation.', eventType: 'Award', category: 'Main Stage', color: 'bg-violet-600', textColor: 'text-white', border: 'border-0', rotate: 'rotate-1' },
  { id: 'standup', name: 'Standup', venue: 'Main Stage', day: 'Day 1', description: 'Lightning standup sessions — share your startup idea with the audience in 60 seconds.', eventType: 'Individual', category: 'Main Stage', color: 'bg-emerald-500', textColor: 'text-white', border: 'border-0', rotate: '-rotate-1' },
  // WORKSHOP / MENTORSHIP
  { id: 'design-thinking-bootcamp', name: 'Design Thinking Bootcamp', venue: 'MBA Seminar Hall 2', day: 'Both Days', description: 'A hands-on workshop to develop human-centric, real-world problem-solving skills.', eventType: 'Individual', category: 'Workshop', color: 'bg-sky-500', textColor: 'text-white', border: 'border-0', rotate: 'rotate-2' },
  { id: 'startup-dating', name: 'Startup Dating', venue: 'Hi-Tech 1', day: 'Both Days', description: 'Students with identified problems get guidance to transform their idea into a real startup.', eventType: 'Individual', category: 'Workshop', color: 'bg-fuchsia-500', textColor: 'text-white', border: 'border-0', rotate: '-rotate-1' },
  { id: 'incubation-hub-pavilions', name: 'Incubation Hub Pavilions', venue: 'Wing 3', day: 'Both Days', description: 'Pavilions for incubation organizations — inquiry spots and scheme explanations.', eventType: 'Attendance', category: 'Workshop', color: 'bg-yellow-600', textColor: 'text-white', border: 'border-0', rotate: 'rotate-1' },
  // ADD-ONS
  { id: 'one-to-one-mentorship', name: 'One-to-One Mentorship', venue: 'Library Panels', day: 'Both Days', description: 'Get personalized one-on-one guidance from industry experts and successful founders.', eventType: 'Individual', category: 'Mentorship', color: 'bg-[#374151]', textColor: 'text-white', border: 'border-0', rotate: '-rotate-2' },
  { id: 'fireside-chat', name: 'Fireside Chat', venue: 'CIVIL Ground Floor', day: 'Both Days', description: 'Intimate conversations with successful entrepreneurs and innovators in a relaxed setting.', eventType: 'Individual', category: 'Mentorship', color: 'bg-red-800', textColor: 'text-white', border: 'border-0', rotate: 'rotate-2' },
];

const EventCard = ({ title, date, color, textColor, border, rotate, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
    className={`p-6 md:p-8 ${color} ${textColor} ${border} flex flex-col justify-between min-h-[14rem] md:min-h-[16rem] transform ${rotate} cursor-pointer transition-all duration-300 shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_rgba(0,0,0,0.8)]`}
  >
    <div>
      <h4 className="text-2xl md:text-3xl font-black uppercase mb-1 leading-tight tracking-tight break-words">{title}</h4>
      <p className="font-bold opacity-80 uppercase tracking-widest text-xs md:text-sm">{date}</p>
    </div>
    <div className="flex justify-between items-end mt-6 gap-2">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-current flex items-center justify-center shrink-0">
        <Star className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
      </div>
      <span className="font-black text-base md:text-xl uppercase underline decoration-4 underline-offset-4 whitespace-nowrap text-right">Join Now</span>
    </div>
  </motion.div>
);

// ─── Pass Card (Ticket Style) ─────────────────────────────────────────────────
const PassCard = ({ name, nameLine2, icon: Icon, price, stubGradient, ticketBg, ticketSunburst, rightBg, rightGradient, rightTextDark, delay, description, description2, buttonText, secondaryButtonText, onClaim, onSecondaryClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6, scale: 1.012, transition: { duration: 0.2 } }}
    className="w-full cursor-pointer relative"
    onClick={onClaim}
    style={{ filter: 'drop-shadow(6px 12px 16px rgba(0,0,0,0.25)) drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' }}
  >
    <div
      className="flex w-full overflow-hidden"
      style={{
        height: '240px',
        position: 'relative',
        WebkitMaskImage: 'radial-gradient(circle at 0px 50%, transparent 24px, black 25px), radial-gradient(circle at 100% 50%, transparent 24px, black 25px)',
        WebkitMaskSize: '51% 100%',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'left, right',
        maskImage: 'radial-gradient(circle at 0px 50%, transparent 24px, black 25px), radial-gradient(circle at 100% 50%, transparent 24px, black 25px)',
        maskSize: '51% 100%',
        maskRepeat: 'no-repeat',
        maskPosition: 'left, right',
        borderRadius: '16px'
      }}
    >
      {/* Inner Bevel Border */}
      <div className="absolute inset-0 pointer-events-none z-50 rounded-2xl border-[3px] border-white/20 shadow-[inset_0_0_12px_rgba(0,0,0,0.2)]" />

      {/* LEFT STUB */}
      <div
        className="flex flex-col items-center justify-center shrink-0 relative"
        style={{
          width: '150px',
          background: stubGradient,
          padding: '12px 10px',
        }}
      >
        {/* Stars top/bottom */}
        <div className="absolute top-6 left-0 right-0 flex justify-center">
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px' }}>★</span>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px' }}>★</span>
        </div>
        {/* Rotated text */}
        <div style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', textAlign: 'center' }}>
          <p className="font-black uppercase text-white tracking-[0.25em]" style={{ fontSize: '18px', lineHeight: 1.2 }}>STARTUP</p>
          <p className="font-black uppercase text-white tracking-[0.25em]" style={{ fontSize: '18px', lineHeight: 1.2 }}>PERAVAI</p>
        </div>
      </div>

      {/* SOLID SEPARATOR LEFT */}
      <div
        className="shrink-0 relative z-20 bg-black/80"
        style={{ width: '3px' }}
      />

      {/* MIDDLE SECTION — sunburst + empty space */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ background: ticketBg }}
      >
        {/* Sunburst SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 130"
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: ticketSunburst === 'light' ? 0.22 : 0.14 }}
        >
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15) * (Math.PI / 180);
            const x2 = 200 + Math.cos(angle) * 600;
            const y2 = 65 + Math.sin(angle) * 600;
            return (
              <line
                key={i}
                x1="200" y1="65"
                x2={x2} y2={y2}
                stroke={ticketSunburst === 'light' ? '#8B6914' : '#1E3A6E'}
                strokeWidth="18"
              />
            );
          })}
        </svg>
        {/* Content area for Description & Button */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 md:p-12 text-center gap-5">
          <p className="font-bold text-black/100 text-base md:text-lg max-w-md mx-auto leading-snug">
            {description}
          </p>

          <div className="flex gap-4">
            {secondaryButtonText && (
              <button
                onClick={(e) => { e.stopPropagation(); onSecondaryClick?.(); }}
                className="bg-transparent text-black border-2 border-black/80 px-5 md:px-8 py-3 rounded-md font-black uppercase text-[10px] md:text-xs tracking-[0.15em] hover:bg-black/5 transition-all"
              >
                {secondaryButtonText}
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onClaim?.(); }}
              className="bg-black hover:bg-gray-800 text-white border-2 border-black/10 px-5 md:px-8 py-3 rounded-md font-black uppercase text-[10px] md:text-xs tracking-[0.15em] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:translate-y-[2px] transition-all"
            >
              {buttonText}
            </button>
          </div>

          {description2 && (
            <p className="font-black text-red-600 text-sm md:text-base leading-snug">
              {description2}
            </p>
          )}
        </div>
      </div>

      {/* SOLID SEPARATOR RIGHT */}
      <div
        className="shrink-0 relative z-20 bg-black/80"
        style={{ width: '3px' }}
      />

      {/* RIGHT SECTION — Pass info */}
      <div
        className="flex flex-col items-start justify-center shrink-0 relative overflow-hidden"
        style={{
          width: '320px',
          background: rightGradient || rightBg,
          padding: '24px 34px',
        }}
      >
        {/* Decorative stars top */}
        <div className="absolute top-5 left-0 right-0 flex justify-center gap-3">
          <span style={{ color: rightTextDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)', fontSize: '12px' }}>★</span>
          <span style={{ color: rightTextDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)', fontSize: '12px' }}>★</span>
          <span style={{ color: rightTextDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)', fontSize: '12px' }}>★</span>
        </div>
        {/* Decorative star bottom */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <span style={{ color: rightTextDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)', fontSize: '12px' }}>★</span>
        </div>
        {/* Top rule */}
        <div className="absolute top-10 left-5 right-5 h-[2px]" style={{ background: rightTextDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.35)' }} />
        {/* Bottom rule */}
        <div className="absolute bottom-10 left-5 right-5 h-[2px]" style={{ background: rightTextDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.35)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start gap-1 mt-1 w-full">
          {/* Top row: Icon + Titles */}
          <div className="flex flex-row items-center gap-4">
            {/* Icon box */}
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: '60px', height: '60px',
                border: `4px solid ${rightTextDark ? '#1a1a1a' : '#ffffff'}`,
              }}
            >
              <Icon style={{ width: '32px', height: '32px', color: rightTextDark ? '#1a1a1a' : '#ffffff' }} />
            </div>

            {/* Text Stack */}
            <div className="flex flex-col">
              <p
                className="font-black uppercase leading-none tracking-tighter"
                style={{ fontSize: '42px', lineHeight: 0.95, color: rightTextDark ? '#1a1a1a' : '#ffffff' }}
              >
                {name}
              </p>
              {nameLine2 && (
                <p
                  className="font-black uppercase leading-none tracking-tighter"
                  style={{ fontSize: '42px', lineHeight: 0.95, color: rightTextDark ? '#1a1a1a' : '#ffffff' }}
                >
                  {nameLine2}
                </p>
              )}
            </div>
          </div>

          {/* Bottom text */}
          <p
            className="font-bold uppercase tracking-[0.25em]"
            style={{ fontSize: '13px', color: rightTextDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)', marginTop: '10px' }}
          >
            {price}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Guest Speakers Data & Component ─────────────────────────────────────────
const speakers = [
  {
    name: 'Hemachaandra Na S',
    company: 'ALL ROUNDER',
    photo: speaker1,
    linkedin: 'https://linkedin.com/'
  },
  {
    name: 'SPEAKER 2',
    company: 'COMPANY 2',
    photo: '',
    linkedin: 'https://linkedin.com/'
  },
  {
    name: 'SPEAKER 3',
    company: 'COMPANY 3',
    photo: '',
    linkedin: 'https://linkedin.com/'
  },
  {
    name: 'SPEAKER 4',
    company: 'COMPANY 4',
    photo: '',
    linkedin: 'https://linkedin.com/'
  },
  {
    name: 'SPEAKER 5',
    company: 'COMPANY 5',
    photo: '',
    linkedin: 'https://linkedin.com/'
  },
];

const SpeakerCard = ({ speaker }) => (
  <div className="group relative shrink-0 w-64 md:w-72 border-4 border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-300 mx-4 select-none">
    <div className="relative h-64 md:h-72 border-b-4 border-black overflow-hidden bg-gray-200">
      <img
        src={speaker.photo}
        alt={speaker.name}
        draggable={false}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 pointer-events-none"
      />
      <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer"
        className="absolute bottom-4 right-4 w-10 h-10 bg-[#1f2022] border-4 border-black flex items-center justify-center text-white hover:bg-black transition-colors shadow-[3px_3px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
        onClick={e => e.stopPropagation()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
    </div>
    <div className="p-4 md:p-5 text-left">
      <h3 className="font-black uppercase text-lg md:text-xl tracking-tight leading-none mb-1">{speaker.name}</h3>
      <p className="font-bold text-gray-500 text-xs uppercase tracking-widest">{speaker.company}</p>
    </div>
  </div>
);

// ─── Speakers Carousel (drag + arrows + auto-scroll) ─────────────────────────
const SpeakersCarousel = () => {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const animFrameRef = useRef(null);
  const speedRef = useRef(3); // px per frame

  // Auto-scroll loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      if (!isPaused && !isDragging) {
        track.scrollLeft += speedRef.current;
        // Infinite loop: when we've scrolled half the total width, reset silently
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPaused, isDragging]);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = 300; // approximate card + margin
    track.scrollBy({ left: dir * cardWidth * 2, behavior: 'smooth' });
  };

  // Mouse drag handlers
  const onMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartX.current = trackRef.current.scrollLeft;
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    trackRef.current.scrollLeft = scrollStartX.current - dx;
  };
  const onMouseUp = () => setIsDragging(false);

  // Touch drag handlers
  const onTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    scrollStartX.current = trackRef.current.scrollLeft;
  };
  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - dragStartX.current;
    trackRef.current.scrollLeft = scrollStartX.current - dx;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); setIsDragging(false); }}
    >
      {/* Arrow buttons */}
      <div className="flex justify-end gap-3 px-4 sm:px-6 lg:px-24 mb-6">
        <button
          onClick={() => scroll(-1)}
          className="w-12 h-12 border-4 border-black bg-white flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150"
          aria-label="Previous speakers"
        >
          ←
        </button>
        <button
          onClick={() => scroll(1)}
          className="w-12 h-12 border-4 border-black bg-[#1f2022] text-white flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150"
          aria-label="Next speakers"
        >
          →
        </button>
      </div>

      {/* Gradient masks */}
      <div className="absolute left-0 bottom-0 w-10 md:w-24 z-10 pointer-events-none" style={{ top: '4rem', background: 'linear-gradient(to right, #fffefa, transparent)' }} />
      <div className="absolute right-0 bottom-0 w-10 md:w-24 z-10 pointer-events-none" style={{ top: '4rem', background: 'linear-gradient(to left, #fffefa, transparent)' }} />

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className={`flex overflow-x-scroll pb-6 pt-2 scroll-smooth ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {/* Duplicate speakers for infinite illusion */}
        {[...Array(4)].map((_, i) =>
          speakers.map((speaker, index) => (
            <SpeakerCard key={`${i}-${index}`} speaker={speaker} />
          ))
        )}
      </div>
    </div>
  );
};

// ─── Main Layout ─────────────────────────────────────────────────────────────
const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, pass: '', source: '' });
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPass, setPendingPass] = useState('');

  // Hackathon Modal state
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [hackathonJoinCode, setHackathonJoinCode] = useState('');
  const [profileWarning, setProfileWarning] = useState(false);

  // Event registration modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventPassGate, setShowEventPassGate] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);

  const userMenuRef = useRef(null);
  const { user, registration, loadingAuth } = useAuth();
  const navigate = useNavigate();

  // Handle URL joinCode parameter on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('joinCode') || urlParams.get('code');
    if (code) {
      setHackathonJoinCode(code);
      if (!user) {
        setAuthModal({ open: true, pass: '', source: 'hackathon' });
      } else if (!registration) {
        // User logged in but profile incomplete — show warning + open registration form
        setProfileWarning(true);
        setTimeout(() => setProfileWarning(false), 5000);
        setPendingPass('Visitor\'s Pass');
        setShowRegForm(true);
      } else {
        const hasEventPass = registration.paymentStatus !== 'pending' &&
          registration.passType !== 'None' &&
          registration.passType !== 'Visitor\'s Pass';
        if (!hasEventPass) {
          setShowEventPassGate(true);
        } else {
          setShowHackathonModal(true);
        }
      }
    }
  }, [user, registration]);

  // Open Hackathon Modal Helper — gates on Event Pass + profile completion
  const handleOpenHackathon = (code = '') => {
    if (code) setHackathonJoinCode(code);
    if (!user) {
      setAuthModal({ open: true, pass: '', source: 'hackathon' });
    } else if (!registration) {
      setProfileWarning(true);
      setTimeout(() => setProfileWarning(false), 5000);
      setPendingPass('Visitor\'s Pass');
      setShowRegForm(true);
    } else {
      const hasEventPass = registration.paymentStatus !== 'pending' &&
        registration.passType !== 'None' &&
        registration.passType !== 'Visitor\'s Pass';
      if (!hasEventPass) {
        setShowEventPassGate(true);
      } else {
        setShowHackathonModal(true);
      }
    }
  };

  const handleExploreEvents = () => {
    if (!user) {
      setAuthModal({ open: true, pass: 'EVENT PASS', source: 'event-browse' });
    } else {
      navigate('/events');
    }
  };

  // ── Event card "Join Now" — gates on Event Pass ───────────────────────────────
  const handleEventJoin = (event) => {
    if (!user) {
      setPendingEvent(event);
      setAuthModal({ open: true, pass: '', source: 'event' });
      return;
    }
    if (!registration) {
      setPendingEvent(event);
      setPendingPass('Visitor\'s Pass');
      setShowRegForm(true);
      return;
    }
    const hasEventPass = registration.paymentStatus !== 'pending' &&
      registration.passType !== 'None' &&
      registration.passType !== 'Visitor\'s Pass';
    if (!hasEventPass) {
      setShowEventPassGate(true);
      return;
    }
    if (event.useHackathonModal) {
      setShowHackathonModal(true);
    } else {
      setSelectedEvent(event);
      setShowEventModal(true);
    }
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
    setShowDashboard(false);
    window.location.reload();
  };

  // ── Navbar "Register Here" click ──
  const handleRegisterHereClick = () => {
    if (!user) {
      setAuthModal({ open: true, pass: 'Visitor\'s Pass', source: 'navbar' });
    } else if (!registration) {
      setPendingPass('Visitor\'s Pass');
      setShowRegForm(true);
    } else if (registration.paymentStatus === 'pending') {
      const el = document.getElementById('passes');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowDashboard(true);
    }
  };

  // ── Pass card click ──
  const handlePassClick = (passName) => {
    if (!user) {
      setAuthModal({ open: true, pass: passName, source: 'pass' });
    } else if (!registration) {
      setPendingPass(passName);
      setShowRegForm(true);
    } else if (registration.paymentStatus === 'pending') {
      setPendingPass(passName);
      setShowPayment(true);
    } else {
      setShowDashboard(true);
    }
  };

  // ── Auth modal closed (user just signed in) ──
  const handleAuthClose = () => {
    setAuthModal(prev => ({ ...prev, open: false }));
  };

  // When auth state resolves after modal closes
  useEffect(() => {
    if (!user || authModal.open) return;

    const hasEventPass = registration &&
      registration.paymentStatus !== 'pending' &&
      registration.passType !== 'None' &&
      registration.passType !== 'Visitor\'s Pass';

    // ── Hackathon source ──
    if (authModal.source === 'hackathon') {
      setAuthModal(prev => ({ ...prev, source: '' }));
      if (!registration) {
        setPendingPass('Visitor\'s Pass');
        setShowRegForm(true);
      } else if (!hasEventPass) {
        setShowEventPassGate(true);
      } else {
        setShowHackathonModal(true);
      }
      return;
    }

    // ── Event source ──
    if (authModal.source === 'event') {
      setAuthModal(prev => ({ ...prev, source: '' }));
      const evt = pendingEvent;
      if (!evt) return;
      if (!registration) {
        setPendingPass('Visitor\'s Pass');
        setShowRegForm(true);
      } else if (!hasEventPass) {
        setShowEventPassGate(true);
      } else if (evt.useHackathonModal) {
        setShowHackathonModal(true);
      } else {
        setSelectedEvent(evt);
        setShowEventModal(true);
        setPendingEvent(null);
      }
      return;
    }

    if (!authModal.pass) return;

    if (!registration) {
      setPendingPass(authModal.pass);
      setShowRegForm(true);
    } else if (registration.paymentStatus === 'pending') {
      if (authModal.source === 'pass') {
        setPendingPass(authModal.pass);
        setShowPayment(true);
      } else {
        const el = document.getElementById('passes');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setShowDashboard(true);
    }
    setAuthModal(prev => ({ ...prev, pass: '' }));
  }, [user, registration, authModal.open, authModal.source, pendingEvent]);

  // ── Floating dock scroll state ──
  const [dockVisible, setDockVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setDockVisible(window.scrollY > 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Display name for navbar
  const displayName = registration?.firstName || user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Account';


  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const isTop = targetId === '';
    const targetElement = isTop ? document.body : document.getElementById(targetId);

    if (targetElement) {
      const targetPosition = isTop ? 0 : targetElement.getBoundingClientRect().top + window.scrollY - 40;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 1200;
      let start = null;

      const easeInOutQuart = (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, startPosition + distance * easeInOutQuart(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
    setMenuOpen(false);
  };


  const passes = [
    {
      name: "VISITOR",
      nameLine2: 'PASS',
      icon: Ticket,
      price: "VISITOR'S ENTRY",
      // Left red stub
      stubGradient: '#a80d11',
      // Middle cream/sunburst
      ticketBg: '#ffffffff',
      ticketSunburst: 'dark',
      // Right cream section (dark text)
      rightBg: '#f6f4ee',
      rightGradient: null,
      rightTextDark: true,
      description: 'Your Gateway into Easwari Startup Peravai',
      buttonText: 'GET YOUR PASS',
      secondaryButtonText: "WHAT YOU'LL GET",
      onSecondaryClick: () => setShowVisitorModal(true),
      delay: 0.1,
    },
    {
      name: 'EVENT',
      nameLine2: 'PASS',
      icon: Zap,
      price: 'EVENT ACCESS',
      // Left blue stub
      stubGradient: '#0a2140',
      // Middle light blue/sunburst
      ticketBg: '#e4e5e7ff',
      ticketSunburst: 'blue',
      // Right red-to-blue gradient (white text)
      rightGradient: 'linear-gradient(135deg, #a80d11, #d82221 40%, #0b2140 60%, #0f50e3)',
      rightBg: null,
      rightTextDark: false,
      description: 'Ideas Need Action. Be the Changemaker.',
      buttonText: 'EXPLORE EVENTS',
      description2: 'Participate in Our Events.',
      onClaim: () => handleExploreEvents(),
      delay: 0.0,
    },
  ];

  return (
    <>
      <div className="w-full min-h-screen pt-3 md:pt-4 pb-24 md:pb-32 px-4 sm:px-6 lg:px-24">

        {/* ── Navbar ── */}
        <motion.nav
          className="flex justify-between items-center mb-0 pb-3 md:pb-4"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-blue-600 tracking-tighter leading-none">
            <img src="peravai_logo.png" alt="Peravai Logo" className="h-30 md:h-30 w-80" />
          </h1>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10 text-sm font-black text-gray-500 uppercase tracking-widest">
            {['Insights', 'Passes', 'Speakers', 'Brochure', 'Contact'].map(item => (
              <a key={item}
                href={`#${item === 'Insights' ? 'whats-happening' : item.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, item === 'Insights' ? 'whats-happening' : item.toLowerCase())}
                className="relative group hover:text-black transition-colors py-1">
                {item}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </a>
            ))}

            {/*<a
              href={eventBrochure}
              download="EVENT_BROCHURE.pdf"
              className="flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-red-800 text-white font-white uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
              style={{ background: 'linear-gradient(to right, #a80d11 20%, #d82221 90%)' }}
            >
              <Download className="w-5 h-6" />
              Brochure
            </a>
            */}

            {/* ── Register Here / User menu ── */}
            {!user ? (
              <button id="nav-register-btn" onClick={handleRegisterHereClick}
                className="px-5 py-2.5 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.15em] text-xs
                shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150">
                Log In / Register
              </button>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 border-4 border-black bg-white font-black uppercase tracking-widest text-xs
                  shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150">
                  <UserCircle className="w-4 h-4" />
                  {displayName}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 border-4 border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] z-50">
                      <button onClick={() => { handleOpenHackathon(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest text-xs bg-blue-50 text-blue-900 hover:bg-black hover:text-white transition-colors border-b-2 border-black">
                        <Users className="w-4 h-4 text-blue-600" /> Hackathon Team
                      </button>
                      {registration && registration.paymentStatus !== 'pending' && (
                        <button onClick={() => { setShowDashboard(true); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors border-b-2 border-black">
                          <QrCode className="w-4 h-4" /> My Pass
                        </button>
                      )}
                      {registration && registration.paymentStatus === 'pending' && (
                        <button onClick={() => {
                          setUserMenuOpen(false);
                          const el = document.getElementById('passes');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                          className="w-full flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors border-b-2 border-black">
                          <Ticket className="w-4 h-4" /> Choose Pass
                        </button>
                      )}
                      {!registration && (
                        <button onClick={() => { setPendingPass('Visitor\'s Pass'); setShowRegForm(true); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors border-b-2 border-black">
                          <UserCircle className="w-4 h-4" /> Complete Profile
                        </button>
                      )}
                      <button onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest text-xs text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden w-12 h-12 border-4 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.nav>

        {/* Brand divider */}
        <motion.div
          className="h-[4px] mb-8 md:mb-12 origin-left"
          style={{ background: 'linear-gradient(to right, #a80d11, #d82221 30%, #0b2140 70%, #0f50e3)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              className="overflow-hidden lg:hidden border-4 border-black bg-white mb-10 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              {['Insights', 'Events', 'Passes', 'Speakers', 'Contact'].map((item) => (
                <a key={item}
                  href={`#${item === 'Insights' ? 'whats-happening' : item.toLowerCase()}`}
                  onClick={(e) => handleNavClick(e, item === 'Insights' ? 'whats-happening' : item.toLowerCase())}
                  className="block px-8 py-4 font-black uppercase tracking-widest text-gray-600 border-b-2 border-black last:border-b-0 hover:bg-black hover:text-white transition-colors">
                  {item}
                </a>
              ))}
              <a
                href={eventBrochure}
                download="EVENT_BROCHURE.pdf"
                className="w-full flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-white border-b-2 border-black hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(to right, #a80d11 20%, #d82221 80%)' }}
              >
                <Download className="w-5 h-5" /> Download Brochure
              </a>
              {user && registration && registration.paymentStatus !== 'pending' && (
                <button onClick={() => { setShowDashboard(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-gray-600 border-b-2 border-black hover:bg-black hover:text-white transition-colors">
                  <QrCode className="w-5 h-5" /> My QR
                </button>
              )}
              {user && registration && registration.paymentStatus === 'pending' && (
                <button onClick={() => {
                  setMenuOpen(false);
                  const el = document.getElementById('passes');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                  className="w-full flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-gray-600 border-b-2 border-black hover:bg-black hover:text-white transition-colors">
                  <Ticket className="w-5 h-5" /> Choose Pass
                </button>
              )}
              {user && (
                <button onClick={() => { handleOpenHackathon(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-blue-900 bg-blue-50 border-b-2 border-black hover:bg-black hover:text-white transition-colors">
                  <Users className="w-5 h-5 text-blue-600" /> Hackathon Team
                </button>
              )}
              {!user ? (
                <button onClick={() => { handleRegisterHereClick(); setMenuOpen(false); }}
                  className="w-full px-8 py-4 font-black uppercase tracking-widest bg-[#1f2022] text-white hover:bg-black transition-colors text-left">
                  Log In / Register
                </button>
              ) : (
                <button onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                  <LogOut className="w-5 h-5" /> Log Out ({displayName})
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero Headline ── */}
        <div className="text-center mb-20 md:mb-32 relative z-10">
          <div className="relative w-full px-4 mb-2">
            <h2 className="font-black uppercase tracking-tighter text-center w-full leading-none">
              <span className="block overflow-hidden mb-1">
                <motion.span
                  className="block whitespace-nowrap"
                  style={{ ...logoGrad, fontSize: 'clamp(3rem, 9vw, 8rem)' }}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.75, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  EASWARI
                </motion.span>
              </span>
              <span className="flex items-baseline justify-center gap-[2vw] overflow-hidden">
                <span className="overflow-hidden">
                  <motion.span
                    className="block whitespace-nowrap"
                    style={{ ...redGrad, fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.75, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
                  >
                    STARTUP
                  </motion.span>
                </span>

                <span className="overflow-hidden">
                  <motion.span
                    className="block whitespace-nowrap"
                    style={{ ...blueGrad, fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.75, delay: 1.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    PERAVAI
                  </motion.span>
                </span>
              </span>
            </h2>

            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-[5px] w-full origin-right mt-6"
              style={{ background: 'linear-gradient(to left, #a80d11, #d82221 45%, #0b2140 55%, #0f50e3)' }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 md:mt-20 flex flex-col sm:flex-row gap-4 items-center justify-center w-full px-4"
          >
            <a
              href="#passes"
              onClick={(e) => handleNavClick(e, 'passes')}
              className="w-full sm:w-auto px-10 py-4 bg-[#1f2022] text-white font-black uppercase tracking-[0.18em] text-sm border-4 border-[#1f2022] shadow-[6px_6px_0px_rgba(0,0,0,0.25)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-150"
            >
              Grab Your Pass →
            </a>
            <a
              href="#events"
              onClick={(e) => handleNavClick(e, 'events')}
              className="w-full sm:w-auto px-10 py-4 bg-transparent text-[#1f2022] font-black uppercase tracking-[0.18em] text-sm border-4 border-[#1f2022] shadow-[6px_6px_0px_rgba(0,0,0,0.15)] hover:bg-[#1f2022] hover:text-white hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-150"
            >
              Explore Events
            </a>
          </motion.div>

          <motion.div
            className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-[#1f2022] max-w-2xl mx-auto shadow-[6px_6px_0px_rgba(0,0,0,1)] divide-y-4 md:divide-y-0 md:divide-x-4 divide-[#1f2022]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {[['10000+', 'Participants'], ['100+', 'Founders & Leaders'], ['3', 'Days of Impact']].map(([num, label], i) => (
              <div key={i} className="py-5 px-4 text-center">
                <p className="font-black text-2xl md:text-3xl text-[#1f2022] leading-none"><AnimatedNumber value={num} /></p>
                <p className="font-bold text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── ABOUT PERAVAI ── */}
        <div id="about" className="relative mt-16 md:mt-24 mb-0 px-4 sm:px-6 lg:px-0 overflow-hidden">
          <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[22vw] font-black uppercase tracking-tighter text-black/[0.025] whitespace-nowrap leading-none">
              PERAVAI
            </span>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 md:mb-14"
            >
              <div className="h-[4.5px] mb-6 w-full" style={{ background: 'linear-gradient(to right, #000000ff, #000000ff 35%, #000000ff 100%, #0f50e3)' }} />
              <p className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Who We Are</p>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-black tracking-tighter leading-none">
                About<br /><span style={blueGrad}>Peravai.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-7 border-4 border-black bg-[#f6f4ee] text-black p-8 md:p-12 shadow-[10px_10px_0px_rgba(0,0,0,1)] flex flex-col gap-8"
              >
                <div>
                  <p className="font-black text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: '#bd1d1d' }}>
                    Where Ideas Meet Action. Where Ambition Finds Opportunity.
                  </p>
                  <p className="font-black text-xl md:text-2xl xl:text-3xl leading-snug tracking-tight text-black">
                    Tamil Nadu's student-driven startup and innovation movement{' '}
                    <span style={{ color: '#a80d11' }}>
                      connecting students, entrepreneurs, investors,
                    </span>{' '}
                    academia, and industry through a shared ecosystem{' '}
                    <span style={{ color: '#002f6bff' }}>
                      built for ideas to grow into impact.
                    </span>
                  </p>
                </div>
                <div className="border-t-2 border-white/10 pt-6">
                  <p className="font-black text-sm md:text-base leading-relaxed text-gray-500">
                    Every breakthrough begins with an idea. But ideas become reality when they meet the right people, opportunities, resources, and support.{' '}
                    <span className="text-black">Peravai exists to build that bridge.</span>
                  </p>
                </div>
              </motion.div>

              <div className="lg:col-span-5 flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="border-4 border-black bg-[#f6f4ee] p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex items-start gap-5"
                >
                  <div className="w-11 h-11 shrink-0 border-black flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f6f4ee)' }}>
                    <Lightbulb className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-500 mb-1">The Bridge</p>
                    <p className="font-black text-sm md:text-base leading-snug text-[#1f2022]">
                      From classrooms of Chennai to emerging innovation hubs : bringing the next generation of founders and changemakers with networks they need.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="border-4 border-black bg-[#f6f4ee] p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex items-start gap-5"
                >
                  <div className="w-11 h-11 shrink-0 border-black flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f6f4ee)' }}>
                    <Globe className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-500 mb-1">The Reach</p>
                    <p className="font-black text-sm md:text-base leading-snug text-[#1f2022]">
                      Tier 2 &amp; Tier 3 cities across Tamil Nadu where talent finds opportunity and ambition finds a path to action.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="border-4 border-black bg-[#f6f4ee] p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex items-start gap-5"
                >
                  <div className="w-11 h-11 shrink-0 border-black flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f6f4ee)' }}>
                    <Rocket className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-500 mb-1">The Vision</p>
                    <p className="font-black text-sm md:text-base leading-snug text-[#1f2022]">
                      A stronger, more connected innovation ecosystem where ideas find support and talent leads tomorrow's industry.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] divide-y-4 md:divide-y-0 divide-x-0 md:divide-x-4 divide-black overflow-hidden"
            >
              {[
                { word: 'BUILD', sub: 'Ideas into products', Icon: Hammer, bg: '#a80d11', text: '#fff' },
                { word: 'CONNECT', sub: 'People & opportunities', Icon: Network, bg: '#1f2022', text: '#fff' },
                { word: 'GROW', sub: 'Talent & networks', Icon: TrendingUp, bg: '#0b2140', text: '#fff' },
                { word: 'LEAD', sub: 'The innovation wave', Icon: Trophy, bg: '#fffefa', text: '#1f2022' },
              ].map(({ word, sub, Icon, bg, text }, i) => (
                <div key={i} className="py-7 px-5 text-center group hover:brightness-90 transition-all duration-200 cursor-default" style={{ background: bg }}>
                  <div className="flex justify-center mb-2">
                    <Icon className="w-5 h-5" style={{ color: text, opacity: 0.7 }} />
                  </div>
                  <p className="font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none" style={{ color: text }}>
                    {word}
                  </p>
                  <p className="font-bold text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: text, opacity: 0.55 }}>{sub}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 border-l-[6px] border-black bg-[#2c2d2c] px-9 py-5 shadow-[6px_6px_0px_rgba(0,0,0,0.12)]"
            >
              <p className="font-black text-base md:text-xl text-[#f8f8f8] leading-snug">
                "We are building a stronger, more connected innovation ecosystem for Tamil Nadu one where{' '}
                <span style={{ color: '#e84040' }}>talent finds opportunity</span>,{' '}
                <span style={{ color: '#4b80f7' }}>ideas find support</span>, and{' '}
                <span className="text-white">ambition finds a path to action</span>."
              </p>
              <p className="mt-3 font-black text-[10px] uppercase tracking-[0.35em] text-gray-200">— Peravai Mission</p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div id="whats-happening">
            <EventSlideshow onOpenHackathon={() => handleOpenHackathon()} />
          </div>

          <div id="brochure" className="mt-20 md:mt-28 relative z-10 px-4 sm:px-6 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-6xl mx-auto"
            >
              <div className="relative border-4 border-black bg-[#f6f4ee] shadow-[14px_14px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="h-[6px]" style={{ background: 'linear-gradient(to right, #a80d11, #d82221 40%, #0b2140 60%, #0f50e3)' }} />
                <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                  <span className="text-[12vw] font-black uppercase tracking-tighter text-black/[0.04] whitespace-nowrap leading-none text-center">
                    STARTUP<br />PERAVAI
                  </span>
                </div>

                <div className="relative z-10 p-6 md:p-8 lg:p-10">
                  <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-12 md:mb-16">
                    <div>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="font-black uppercase tracking-[0.4em] text-[#d82221] text-xs mb-5"
                      >
                        · Official Document · 2026
                      </motion.p>
                      <motion.h2
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black mb-6"
                      >
                        Event<br />
                        <span style={{ background: 'linear-gradient(to right, #a80d11, #d82221 40%, #0b2140 60%, #0f50e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                          Brochure.
                        </span>
                      </motion.h2>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex flex-row items-center gap-4"
                      >
                        <motion.a
                          href={eventBrochure}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 3, y: -3, transition: { duration: 0.12 } }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-3 px-7 py-4 border-2 border-black bg-white text-black font-black uppercase tracking-[0.15em] text-sm shadow-[5px_5px_0px_rgba(0,0,0,0.25)] hover:shadow-none transition-all duration-150 whitespace-nowrap"
                        >
                          <ExternalLink className="w-5 h-5" />
                          View Brochure
                        </motion.a>
                        <motion.a
                          href={eventBrochure}
                          download="EVENT_BROCHURE.pdf"
                          whileHover={{ x: 3, y: -3, transition: { duration: 0.12 } }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-3 px-7 py-4 border-4 border-yellow-400 bg-yellow-400 text-black font-black uppercase tracking-[0.15em] text-sm shadow-[5px_5px_0px_rgba(234,179,8,0.5)] hover:shadow-none transition-all duration-150 whitespace-nowrap"
                        >
                          <Download className="w-5 h-5" />
                          Download PDF
                        </motion.a>
                      </motion.div>
                    </div>

                    <div className="hidden lg:flex items-center justify-center relative" style={{ minHeight: '240px' }}>
                      <motion.div
                        initial={{ opacity: 0, rotate: 12, y: 30 }}
                        whileInView={{ opacity: 1, rotate: 12, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute w-44 h-60 border-4 border-white/20 bg-white/5 p-5 flex flex-col justify-between"
                        style={{ top: '0px', right: '20px' }}
                      >
                        <div>
                          <div className="w-5 h-5 border-2 border-white/30 mb-3" />
                          <div className="space-y-2">
                            {[1, 0.8, 0.6, 0.8].map((w, i) => <div key={i} className="h-1.5 bg-white/20 rounded-none" style={{ width: `${w * 100}%` }} />)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {[1, 0.7].map((w, i) => <div key={i} className="h-1.5 bg-white/20" style={{ width: `${w * 100}%` }} />)}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, rotate: -5, y: 30 }}
                        whileInView={{ opacity: 1, rotate: -5, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute w-44 h-60 border-4 border-white/30 bg-[#2a2d30] p-5 flex flex-col justify-between shadow-[8px_8px_0px_rgba(0,0,0,0.5)]"
                        style={{ top: '15px', right: '60px' }}
                      >
                        <div>
                          <div className="font-black text-white/50 text-[9px] uppercase tracking-[0.3em] mb-2">Peravai 2026</div>
                          <div className="h-[3px] w-full mb-3" style={{ background: 'linear-gradient(to right, #a80d11, #0f50e3)' }} />
                          <div className="space-y-2">
                            {[1, 0.8, 0.6, 0.75].map((w, i) => <div key={i} className="h-1.5 bg-white/15" style={{ width: `${w * 100}%` }} />)}
                          </div>
                        </div>
                        <div className="border-2 border-yellow-400/50 p-2 text-center">
                          <p className="text-yellow-400 font-black text-[9px] uppercase tracking-[0.25em]">Official</p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, rotate: 2, y: 30 }}
                        whileInView={{ opacity: 1, rotate: 2, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute w-44 h-60 border-4 border-white bg-[#fffefa] p-5 flex flex-col justify-between shadow-[10px_10px_0px_rgba(0,0,0,1)]"
                        style={{ top: '30px', right: '100px' }}
                      >
                        <div>
                          <div className="font-black text-black text-[9px] uppercase tracking-[0.3em] mb-2">PERAVAI 2026</div>
                          <div className="h-[2px] w-full mb-3" style={{ background: 'linear-gradient(to right, #a80d11, #0f50e3)' }} />
                          <div className="space-y-2">
                            {[1, 0.8, 0.55, 0.8].map((w, i) => <div key={i} className="h-2 bg-gray-200 border border-black/10" style={{ width: `${w * 100}%` }} />)}
                          </div>
                        </div>
                        <div className="border-4 border-black p-2 text-center bg-yellow-400">
                          <p className="text-black font-black text-[9px] uppercase tracking-[0.2em]">Brochure</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="h-[6px]" style={{ background: 'linear-gradient(to left, #a80d11, #d82221 40%, #0b2140 60%, #0f50e3)' }} />
              </div>
            </motion.div>
          </div>

          <div className="mt-20 md:mt-24 mb-16 md:mb-20 px-4 sm:px-6 lg:px-24 flex items-center gap-6">
            <div className="flex-1 h-[4px] bg-black" />
          </div>

          <div id="passes" className="relative z-10 px-4 sm:px-6 lg:px-24">
            <div className="text-center mb-10 md:mb-20">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-black uppercase tracking-[0.35em] text-gray-400 text-xs md:text-sm mb-4"
              >
                Choose Your Access
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none"
              >
                Get Your <br />
                <span style={blueGrad}>Pass.</span>
              </motion.h2>
            </div>

            <div className="flex flex-col gap-10 max-w-5xl mx-auto">
              {passes.map((pass) => (
                <PassCard
                  key={pass.name + pass.nameLine2}
                  {...pass}
                  onClaim={pass.onClaim ? pass.onClaim : () => handlePassClick(`${pass.name} ${pass.nameLine2}`)}
                />
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mt-12"
            >
              All passes include entry to Easwari Startup Peravai 2026
            </motion.p>
          </div>
        </motion.div>
      </div>

      <div className="mt-20 md:mt-24 mx-4 sm:mx-6 lg:mx-24 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #a80d11 20%, #1f2022 50%, #0f50e3 80%, transparent)' }} />

      <div id="speakers" className="py-12 md:py-20 relative">
        <div className="text-center mb-10 md:mb-14 relative z-10">
          <p className="font-black uppercase tracking-[0.35em] text-gray-400 text-xs md:text-sm mb-4">
            Hear from the best
          </p>
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-black">
            Guest <br />
            <span style={redGrad}>Speakers.</span>
          </h2>
        </div>
        <SpeakersCarousel />
      </div>

      <div className="mx-4 sm:mx-6 lg:mx-24 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #a80d11 20%, #1f2022 50%, #0f50e3 80%, transparent)' }} />

      <div className="mt-16 md:mt-12 border-y-4 border-black bg-[#1f2022] overflow-hidden py-4">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(2)].map((_, ri) => (
            <span key={ri} className="flex gap-12 shrink-0">
              {['Startup Peravai 2026', '\u2605 Oct 15 & 16', 'Easwari Engineering College', '\u2605 500+ Participants', 'Pitch \u00b7 Network \u00b7 Grow', '\u2605 Register Now', "Tamil Nadu's Biggest Student Summit", '\u2605 Limited Passes'].map((t, i) => (
                <span key={i} className="font-black uppercase tracking-[0.25em] text-sm text-white/80">{t}</span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      <div id="contact" className="py-16 md:py-24 relative z-10 px-4 sm:px-6 lg:px-24 bg-yellow-400 border-b-4 border-black">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 max-w-7xl mx-auto">
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-black uppercase tracking-[0.35em] text-black/60 text-xs md:text-sm mb-4"
            >
              Get in touch
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-black mb-6 md:mb-8"
            >
              Contact <br />
              <span className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">Us.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="font-bold text-black/80 max-w-md text-base md:text-lg"
            >
              Have questions about the event? Want to partner with us? Drop a message or reach out through our socials.
            </motion.p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.a
              href="mailto:contact@peravai.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group flex flex-col gap-4 p-6 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all"
            >
              <div className="w-12 h-12 bg-violet-600 border-4 border-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-xs text-gray-500 mb-1">Email</p>
                <p className="font-bold text-black truncate">contact@peravai.com</p>
              </div>
            </motion.a>

            <motion.a
              href="tel:+919876543210"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group flex flex-col gap-4 p-6 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all text-white"
            >
              <div className="w-12 h-12 bg-red-600 border-4 border-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-xs text-gray-500 mb-1">Phone</p>
                <p className="font-bold text-black">+91 98765 43210</p>
              </div>
            </motion.a>

            <motion.a
              href="https://www.instagram.com/startup_peravai/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group flex flex-col gap-4 p-6 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all"
            >
              <div className="w-12 h-12 bg-black border-4 border-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-xs text-gray-500 mb-1">Instagram</p>
                <p className="font-bold text-black truncate">@startup_peravai</p>
              </div>
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/easwari-startup-peravai?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="group flex flex-col gap-4 p-6 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all text-white"
            >
              <div className="w-12 h-12 bg-blue-600 border-4 border-black text-white-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-xs text-gray-500 mb-1">LinkedIn</p>
                <p className="font-bold truncate text-black">Startup Peravai</p>
              </div>
            </motion.a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {profileWarning && (
          <motion.div
            initial={{ opacity: 0, y: 80, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 80, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-8 left-1/2 z-[200] flex items-center gap-4 px-6 py-4 border-4 border-black bg-[#1f2022] text-white shadow-[8px_8px_0px_rgba(0,0,0,1)] max-w-sm w-[calc(100%-2rem)]"
          >
            <div className="w-10 h-10 border-2 border-white bg-yellow-400 flex items-center justify-center shrink-0">
              <span className="text-black font-black text-lg">!</span>
            </div>
            <div className="flex-1">
              <p className="font-black uppercase tracking-widest text-xs text-yellow-400 mb-0.5">Profile Required</p>
              <p className="font-bold text-sm leading-snug">
                Complete your profile first, then you can join the Hackathon.
              </p>
            </div>
            <button
              onClick={() => setProfileWarning(false)}
              className="shrink-0 w-8 h-8 border-2 border-white hover:bg-white hover:text-black flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModal.open}
        onClose={handleAuthClose}
        selectedPass={authModal.pass}
      />

      <AnimatePresence>
        {user && !registration && showRegForm && (
          <RegistrationForm
            isPaymentOnly={false}
            passType={pendingPass}
            onSuccess={() => {
              setShowRegForm(false);
              if (pendingEvent) {
                setShowEventPassGate(true);
                setPendingEvent(null);
              } else if (hackathonJoinCode) {
                setShowHackathonModal(true);
              } else {
                const el = document.getElementById('passes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onClose={() => setShowRegForm(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {user && registration?.paymentStatus === 'pending' && showPayment && (
          <RegistrationForm
            isPaymentOnly={true}
            passType={pendingPass}
            onSuccess={() => {
              setShowPayment(false);
              setShowDashboard(true);
            }}
            onClose={() => setShowPayment(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDashboard && registration && (
          <UserDashboard onClose={() => setShowDashboard(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHackathonModal && (
          <HackathonModal
            isOpen={showHackathonModal}
            onClose={() => {
              setShowHackathonModal(false);
              setHackathonJoinCode('');
            }}
            initialJoinCode={hackathonJoinCode}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEventPassGate && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              className="fixed inset-0"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowEventPassGate(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md border-4 border-black bg-[#fffefa] shadow-[14px_14px_0px_rgba(0,0,0,1)]"
            >
              <div className="h-3" style={{ background: 'linear-gradient(to right, #a80d11, #d82221 45%, #0b2140 55%, #0f50e3)' }} />
              <div className="p-8">
                <div className="flex justify-end mb-4">
                  <button onClick={() => setShowEventPassGate(false)} className="text-gray-400 hover:text-black transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-16 h-16 bg-yellow-400 border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <Ticket className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Event Pass Required</h3>
                <p className="font-bold text-gray-600 mb-2 leading-relaxed">
                  To register for events, you need an{' '}
                  <span className="text-black font-black">Event Pass</span>.
                </p>
                <p className="font-bold text-gray-400 text-sm mb-8">
                  Upgrade your pass to unlock registration access to all 22+ events.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    id="event-gate-view-passes"
                    onClick={() => {
                      setShowEventPassGate(false);
                      const el = document.getElementById('passes');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    View Passes →
                  </button>
                  <button
                    onClick={() => setShowEventPassGate(false)}
                    className="w-full py-3 border-4 border-black bg-white font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Event Registration Modal ── */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <EventRegistrationModal
            event={selectedEvent}
            onClose={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
            }}
          />
        )}
      </AnimatePresence>

      <VisitorDetailsModal isOpen={showVisitorModal} onClose={() => setShowVisitorModal(false)} />

      {/* ── Floating Dock Navbar (appears on scroll) ── */}
      <AnimatePresence>
        {dockVisible && (
          <motion.div
            className="fixed bottom-6 left-1/2 z-[999] hidden lg:flex"
            style={{ x: '-50%' }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <Dock
              panelHeight={68}
              baseItemSize={48}
              magnification={68}
              items={[
                {
                  icon: <Home size={20} />,
                  label: 'Home',
                  onClick: () => handleNavClick({ preventDefault: () => { } }, ''),
                },
                {
                  icon: <Lightbulb size={20} />,
                  label: 'Insights',
                  onClick: () => handleNavClick({ preventDefault: () => { } }, 'whats-happening'),
                },
                {
                  icon: <Ticket size={20} />,
                  label: 'Passes',
                  onClick: () => handleNavClick({ preventDefault: () => { } }, 'passes'),
                },
                {
                  icon: <Users size={20} />,
                  label: 'Speakers',
                  onClick: () => handleNavClick({ preventDefault: () => { } }, 'speakers'),
                },
                {
                  icon: <BookOpen size={20} />,
                  label: 'Brochure',
                  onClick: () => handleNavClick({ preventDefault: () => { } }, 'brochure'),
                },
                {
                  icon: <Mail size={20} />,
                  label: 'Contact',
                  onClick: () => handleNavClick({ preventDefault: () => { } }, 'contact'),
                },
              ]}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainLayout;
