import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Menu, X, Check, Zap, Crown, Ticket, MapPin, Clock, LogOut, QrCode, UserCircle, ChevronDown } from 'lucide-react';
import EventSlideshow from './EventSlideshow';
import AuthModal from './AuthModal';
import RegistrationForm from './RegistrationForm';
import UserDashboard from './UserDashboard';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

// ─── gradient presets ────────────────────────────────────────────────────────
const redGrad = { background: 'linear-gradient(135deg,#a80d11,#d82221)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const blueGrad = { background: 'linear-gradient(135deg,#0b2140,#0f50e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const blueGrad2 = { background: 'linear-gradient(130deg,#0b2140,#0f50e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

const EventCard = ({ title, date, color, textColor, border, rotate }) => (
  <motion.div
    whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
    className={`p-6 md:p-8 ${color} ${textColor} ${border} flex flex-col justify-between h-48 md:h-56 transform ${rotate} cursor-pointer transition-all duration-300 shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_rgba(0,0,0,0.8)]`}
  >
    <div>
      <h4 className="text-2xl md:text-3xl font-black uppercase mb-1 leading-tight tracking-tight">{title}</h4>
      <p className="font-bold opacity-80 uppercase tracking-widest text-xs md:text-sm">{date}</p>
    </div>
    <div className="flex justify-between items-end mt-4">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-current flex items-center justify-center">
        <Star className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
      </div>
      <span className="font-black text-base md:text-xl uppercase underline decoration-4 underline-offset-4">Join Now</span>
    </div>
  </motion.div>
);

// ─── Pass Card ───────────────────────────────────────────────────────────────
const PassCard = ({ name, icon: Icon, price, features, cta, style, textClass, borderClass, isFeatured, delay, onClaim }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className={`relative flex flex-col ${borderClass}
      ${isFeatured ? 'border-8 z-10 scale-100 md:scale-105' : 'border-4'}
      shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)]
      hover:shadow-[14px_14px_0px_rgba(0,0,0,0.7)] transition-all duration-300`}
    style={style}
  >
    {/* Featured badge */}

    <div className="p-6 md:p-8 flex-1 flex flex-col">
      {/* Icon + Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 border-4 ${borderClass} flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${textClass}`} />
        </div>
        <div>
          <p className={`font-black text-2xl md:text-3xl uppercase tracking-tight ${textClass}`}>{name}</p>
          {price && <p className={`font-bold text-sm uppercase tracking-widest opacity-60 ${textClass}`}>{price}</p>}
        </div>
      </div>

      {/* Divider */}
      <div className={`h-1 w-full mb-8 ${isFeatured ? 'bg-white/30' : 'bg-black/10'}`} />

      {/* Features */}
      <ul className="space-y-4 flex-1 mb-10">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 w-5 h-5 shrink-0 border-2 ${borderClass} flex items-center justify-center`}>
              <Check className={`w-3 h-3 ${textClass}`} strokeWidth={3} />
            </div>
            <span className={`font-bold text-sm md:text-base leading-snug ${textClass} opacity-90`}>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onClaim}
        className={`w-full py-4 font-black uppercase tracking-[0.15em] text-sm border-4 ${borderClass}
        bg-transparent ${textClass}
        ${borderClass === 'border-white'
            ? 'shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:bg-white hover:text-black'
            : 'shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white'}
        transition-all duration-200
        hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:translate-x-1 active:translate-y-1`}
      >
        {cta}
      </button>
    </div>
  </motion.div>
);

// ─── Main Layout ─────────────────────────────────────────────────────────────
const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, pass: '', source: '' });
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPass, setPendingPass] = useState('');
  const userMenuRef = useRef(null);
  const { user, registration, loadingAuth } = useAuth();

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
      setAuthModal({ open: true, pass: 'General Pass', source: 'navbar' });
    } else if (!registration) {
      setPendingPass('General Pass');
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
  }, [user, registration, authModal.open]);

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
      name: 'General Pass',
      icon: Ticket,
      price: 'No Cost · Open Entry',
      features: [
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
      ],
      cta: 'CLAIM GENERAL PASS',
      style: { background: '#fffefaff' },
      textClass: 'text-black',
      borderClass: 'border-black',
      isFeatured: false,
      delay: 0.1,
    },
    {
      name: 'Event Pass',
      icon: Zap,
      price: 'Event Access',
      features: [
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
      ],
      cta: 'UPGRADE TO ELITE',
      style: { background: 'linear-gradient(145deg, #a80d11, #d82221, #0b2140, #0f50e3)' },
      textClass: 'text-white',
      borderClass: 'border-white',
      isFeatured: true,
      delay: 0.0,
    },
    {
      name: 'Premium Pass',
      icon: Crown,
      price: 'Premium Access',
      features: [
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
        'hema soluvan',
      ],
      cta: 'Upgrade to Premium',
      style: { background: '#1f2022' },
      textClass: 'text-white',
      borderClass: 'border-white',
      isFeatured: false,
      delay: 0.2,
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
            {['Insights', 'Events', 'Passes'].map(item => (
              <a key={item}
                href={item === 'Insights' ? '#' : `#${item.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, item === 'Insights' ? '' : item.toLowerCase())}
                className="relative group hover:text-black transition-colors py-1">
                {item}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </a>
            ))}

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
                        <button onClick={() => { setPendingPass('General Pass'); setShowRegForm(true); setUserMenuOpen(false); }}
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
              {['Insights', 'Events', 'Passes'].map((item) => (
                <a key={item}
                  href={item === 'Insights' ? '#' : `#${item.toLowerCase()}`}
                  onClick={(e) => handleNavClick(e, item === 'Insights' ? '' : item.toLowerCase())}
                  className="block px-8 py-4 font-black uppercase tracking-widest text-gray-600 border-b-2 border-black last:border-b-0 hover:bg-black hover:text-white transition-colors">
                  {item}
                </a>
              ))}
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
          <h2 className="text-[#1f2022] text-[2.8rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] font-black uppercase tracking-tighter leading-[0.85]">
            <span className="inline-block overflow-hidden">
              <motion.span className="inline-block" style={redGrad}
                initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}>HEMA&nbsp;</motion.span>
            </span>
            <span className="inline-block overflow-hidden">
              <motion.span className="inline-block"
                initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}>
                <span style={blueGrad}>ila</span>na.
              </motion.span>
            </span>
            <br />
            <span className="inline-block overflow-hidden">
              <motion.span className="inline-block"
                initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.99, ease: [0.22, 1, 0.36, 1] }}>EASWARI&nbsp;</motion.span>
            </span>
            <span className="inline-block overflow-hidden">
              <motion.span className="inline-block"
                initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}>
                <span style={blueGrad2}>ila</span>.
              </motion.span>
            </span>
          </h2>

          {/* Hero Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 md:mt-20 flex flex-col sm:flex-row gap-4 items-center justify-center w-full px-4"
          >
            {/* Primary CTA — solid black, neobrutalist */}
            <a
              href="#passes"
              onClick={(e) => handleNavClick(e, 'passes')}
              className="w-full sm:w-auto px-10 py-4 bg-[#1f2022] text-white font-black uppercase tracking-[0.18em] text-sm border-4 border-[#1f2022] shadow-[6px_6px_0px_rgba(0,0,0,0.25)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-150"
            >
              Grab Your Pass →
            </a>
            {/* Secondary CTA — transparent with thick border */}
            <a
              href="#events"
              onClick={(e) => handleNavClick(e, 'events')}
              className="w-full sm:w-auto px-10 py-4 bg-transparent text-[#1f2022] font-black uppercase tracking-[0.18em] text-sm border-4 border-[#1f2022] shadow-[6px_6px_0px_rgba(0,0,0,0.15)] hover:bg-[#1f2022] hover:text-white hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-150"
            >
              Explore Events
            </a>
          </motion.div>

          {/* ── Stats bar ── */}
          <motion.div
            className="mt-12 md:mt-16 grid grid-cols-3 gap-0 border-4 border-[#1f2022] max-w-2xl mx-auto shadow-[6px_6px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {[['HEMA', 'Participants'], ['HEMA', 'Speakers'], ['HEMA', 'Power Days']].map(([num, label], i) => (
              <div key={i} className={`py-5 px-4 text-center ${i < 2 ? 'border-r-4 border-[#1f2022]' : ''}`}>
                <p className="font-black text-2xl md:text-3xl text-[#1f2022] leading-none">{num}</p>
                <p className="font-bold text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Marquee Ticker ── */}
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

        {/* ── Below hero fades up ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >

          {/* Events Slideshow */}
          <EventSlideshow />

          {/* ── Upcoming Events ── */}
          <div id="events" className="mt-24 md:mt-8 relative z-10 px-4 sm:px-6 lg:px-24">
            <div className="flex items-end justify-between mb-9 md:mb-12">
              <div>
                <p className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Discover More</p>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-black tracking-tighter leading-none">
                  Upcoming<br /><span className="text-blue-600">Events.</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              <EventCard
                title="Event peru"
                date="Oct 15 - 10:00 AM"
                color="bg-blue-700"
                textColor="text-white"
                border="border-0"
                rotate="-rotate-1"
              />
              <EventCard
                title="Event peru"
                date="Oct 16 - 02:00 PM"
                color="bg-[#1f2022]"
                textColor="text-white"
                border="border-0"
                rotate="rotate-2"
              />
              <EventCard
                title="Event peru"
                date="Oct 17 - 09:00 AM"
                color="bg-white"
                textColor="text-black"
                border="border-8 border-black"
                rotate="-rotate-2"
              />
              <EventCard
                title="Event peru"
                date="Oct 18 - 07:00 PM"
                color="bg-yellow-400"
                textColor="text-black"
                border="border-0"
                rotate="rotate-2"
              />
              <EventCard
                title="Event peru"
                date="Oct 15 - 10:00 AM"
                color="bg-red-600"
                textColor="text-white"
                border="border-0"
                rotate="-rotate-2"
              />
              <EventCard
                title="Event peru"
                date="Oct 15 - 10:00 AM"
                color="bg-purple-500"
                textColor="text-black"
                border="border-0"
                rotate="rotate-2"
              />
              <EventCard
                title="Event peru"
                date="Oct 15 - 10:00 AM"
                color="bg-orange-600"
                textColor="text-white"
                border="border-0"
                rotate="-rotate-2"
              />
              <EventCard
                title="Event peru"
                date="Oct 15 - 10:00 AM"
                color="bg-cyan-500"
                textColor="text-black"
                border="border-0"
                rotate="rotate-1"
              />

            </div>
          </div>



          {/* ── Section Divider ── */}
          <div className="mt-20 md:mt-24 mb-16 md:mb-20 px-4 sm:px-6 lg:px-24 flex items-center gap-6">
            <div className="flex-1 h-[4px] bg-black" />
          </div>

          {/* ── Passes Section ── */}
          <div id="passes" className="relative z-10 px-4 sm:px-6 lg:px-24">
            {/* Section Header — centered, large, original style */}
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

            {/* Pass Cards — Elite centered and scaled up */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center md:items-stretch max-w-6xl mx-auto">
              {passes.map((pass) => (
                <PassCard key={pass.name} {...pass} onClaim={() => handlePassClick(pass.name)} />
              ))}
            </div>

            {/* Fine print */}
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

      {/* ── Auth Modal ── */}
      <AuthModal
        isOpen={authModal.open}
        onClose={handleAuthClose}
        selectedPass={authModal.pass}
      />

      {/* ── Registration Form (new user) ── */}
      <AnimatePresence>
        {user && !registration && showRegForm && (
          <RegistrationForm
            isPaymentOnly={false}
            passType={pendingPass}
            onSuccess={() => {
              setShowRegForm(false);
              const el = document.getElementById('passes');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onClose={() => setShowRegForm(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Payment Gateway (existing user, pending pass) ── */}
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

      {/* ── User Dashboard (existing user) ── */}
      <AnimatePresence>
        {showDashboard && registration && (
          <UserDashboard onClose={() => setShowDashboard(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default MainLayout;
