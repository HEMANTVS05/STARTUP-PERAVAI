import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Ticket, Calendar, MapPin,
  Briefcase, GraduationCap, Building2, Zap, ShieldCheck,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { fetchUserTeamData } from '../services/hackathonService';

const passThemes = {
  "Visitor's Pass": {
    cardBg: '#f6f4ee',
    cardBorder: '4px solid #111',
    cardShadow: '12px 12px 0px #111',
    stripColors: 'linear-gradient(135deg, #0b2140, #a80d11)',
    accent: '#a80d11',
    accentText: '#a80d11',
    headerText: '#111111',
    subText: '#444444',
    badgeBg: '#0b2140',
    badgeText: '#f6f4ee',
    sectionBg: '#ffffff',
    sectionBorder: '2px solid #111',
    monogramBg: '#111111',
    monogramText: '#f6f4ee',
    monogramBorder: '#a80d11',
    entryBorder: '2px solid #111',
    footerText: '#444',
  },
  'Event Pass': {
    cardBg: '#f6f4ee',
    cardBorder: '4px solid #111',
    cardShadow: '12px 12px 0px #111',
    stripColors: 'linear-gradient(135deg, #0b2140, #a80d11)',
    accent: '#a80d11',
    accentText: '#a80d11',
    headerText: '#111111',
    subText: '#444444',
    badgeBg: '#0b2140',
    badgeText: '#f6f4ee',
    sectionBg: '#ffffff',
    sectionBorder: '2px solid #111',
    monogramBg: '#111111',
    monogramText: '#f6f4ee',
    monogramBorder: '#a80d11',
    entryBorder: '2px solid #111',
    footerText: '#444',
  },
};

// ── Single pass card ────────────────────────────────────────────────────────────
export const PassCard = ({ registration, user, passType, eventName, qrSuffix, onClose, onOpenHackathon, overrideQrValue }) => {
  const t = passThemes[passType] || passThemes["Visitor's Pass"];
  const isEvent = passType !== "Visitor's Pass";
  const name = registration.name || user?.displayName || 'Attendee';
  const monogram = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const qrValue = overrideQrValue || (qrSuffix ? `${user?.uid}::${qrSuffix}` : (user?.uid || 'invalid'));

  const passLabel = isEvent ? (eventName?.toUpperCase() || 'EVENT') : "VISITOR'S PASS";
  const passSubLabel = isEvent ? eventName : (registration.sessionChoice || 'General Access');
  const passTag = isEvent ? 'All-Access Granted' : 'Open Entry Valid';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        background: t.cardBg,
        border: t.cardBorder,
        boxShadow: t.cardShadow,
        color: t.headerText,
        borderRadius: '12px',
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '22px 22px' }} />

      {/* Top gradient strip */}
      <div style={{ height: '6px', background: t.stripColors, width: '100%', position: 'relative', zIndex: 1 }} />

      <div style={{ padding: '28px 28px 24px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.35em', color: t.subText, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck style={{ width: '13px', height: '13px', color: t.accent }} />
            Easwari Startup Peravai
          </p>
          <h2 style={{ fontSize: '28px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, color: t.headerText }}>
            Your Pass
          </h2>
        </div>

        {/* ── Pass type badge ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: t.sectionBg, border: t.sectionBorder, borderRadius: '10px', padding: '14px 16px', marginBottom: '18px', boxShadow: isEvent ? '3px 3px 0 #334155' : '3px 3px 0 #111' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: t.stripColors, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isEvent ? <Zap style={{ width: '22px', height: '22px', color: '#fff' }} /> : <Ticket style={{ width: '22px', height: '22px', color: '#fff' }} />}
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: t.accentText, lineHeight: 1 }}>
              {isEvent ? 'Event Pass' : "Visitor's Pass"}
            </p>
            <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.headerText, marginTop: '4px', opacity: 0.85 }}>
              {passSubLabel}
            </p>
            <span style={{ display: 'inline-block', background: t.badgeBg, color: t.badgeText, fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '2px 8px', borderRadius: '4px', marginTop: '6px' }}>
              {passTag}
            </span>
          </div>
        </div>

        {/* ── Session Info (Visitor Pass only — podcast or panel) ── */}
        {!isEvent && registration.sessionType && (registration.sessionType === 'podcast' || registration.sessionType === 'panel') && (
          <div style={{ background: registration.sessionType === 'podcast' ? '#222222ff' : '#0b2140', border: '2px solid #111', borderRadius: '10px', padding: '14px 16px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px' }}>{registration.sessionType === 'podcast' ? '🎙️' : '🎤'}</span>
              <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: registration.sessionType === 'podcast' ? '#ffffffff' : '#a78bfa' }}>
                {registration.sessionType === 'podcast' ? 'Live Podcast' : 'Panel Discussion'}
              </span>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#f6f4ee', lineHeight: 1.2, marginBottom: registration.sessionSubtitle ? '6px' : 0 }}>
              {registration.sessionChoice?.replace(/\s*\(Day \d\)$/, '') || 'Session'}
            </p>
            {registration.sessionSubtitle && (
              <p style={{ fontSize: '11px', fontWeight: 700, color: registration.sessionType === 'podcast' ? '#93c5fd' : '#c4b5fd', letterSpacing: '0.05em' }}>
                {registration.sessionType === 'podcast' ? '🎤 ' : '💬 '}{registration.sessionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* ── Passholder info ── */}
        <div style={{ background: t.sectionBg, border: t.sectionBorder, borderRadius: '10px', padding: '16px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '14px', borderBottom: t.entryBorder, marginBottom: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: t.monogramBg, border: `3px solid ${t.monogramBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: t.monogramText, flexShrink: 0 }}>
              {monogram}
            </div>
            <div>
              <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: t.subText, marginBottom: '2px' }}>Passholder</p>
              <p style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, color: t.headerText }}>{name}</p>
              <p style={{ fontSize: '11px', fontWeight: 700, color: t.subText, marginTop: '3px' }}>{registration.email || user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              registration.role === 'startup'
                ? { Icon: Briefcase, label: 'Company', value: registration.companyName }
                : { Icon: Building2, label: 'Institution', value: registration.college },
              registration.role === 'startup'
                ? { Icon: MapPin, label: 'City', value: registration.location }
                : { Icon: GraduationCap, label: 'Academics', value: (registration.year && registration.department) ? `${registration.year} · ${registration.department}` : '' },
            ].map(({ Icon, label, value }, i) => {
              if (!value || typeof value !== 'string' || value.includes('undefined') || value.trim() === '') return null;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Icon style={{ width: '15px', height: '15px', color: t.subText, marginTop: '1px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: t.subText, marginBottom: '1px' }}>{label}</p>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: t.headerText }}>{value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Gate Entry + QR ── */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '18px' }}>
          {/* Gate entry */}
          <div style={{ flex: 1, background: t.sectionBg, border: t.sectionBorder, borderRadius: '10px', padding: '14px' }}>
            <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: t.subText, marginBottom: '10px' }}>Gate Entry</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Day 1', 'Day 2'].map((day, i) => {
                const checked = i === 0 ? registration.checkedInDay1 : registration.checkedInDay2;
                return (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '6px', border: checked ? 'none' : t.entryBorder, background: checked ? '#22c55e' : 'transparent', transition: 'all 0.2s' }}>
                    <p style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: checked ? '#fff' : t.subText }}>
                      {day}{checked && ' — Scanned'}
                    </p>
                    <CheckCircle2 style={{ width: '14px', height: '14px', color: checked ? '#fff' : t.subText, opacity: checked ? 1 : 0.3 }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* QR code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: t.sectionBorder, borderRadius: '10px', padding: '12px', flexShrink: 0 }}>
            <QRCode value={qrValue} size={88} bgColor="#ffffff" fgColor="#000000" level="Q" />
            <p style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#000', marginTop: '8px', textAlign: 'center', maxWidth: '90px' }}>
              Scan at Gate
            </p>
          </div>
        </div>

        {/* ── Team Portal Button (Hackathon only) ── */}
        {passType === 'Event Pass' && eventName?.toLowerCase() === 'hackathon' && onOpenHackathon && (
          <div style={{ marginBottom: '18px' }}>
            <button
              onClick={onOpenHackathon}
              style={{ width: '100%', padding: '12px 20px', background: '#111', color: '#f6f4ee', border: '2px solid #111', borderRadius: '8px', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
              onMouseEnter={e => { e.target.style.background = '#a80d11'; e.target.style.borderColor = '#a80d11'; }}
              onMouseLeave={e => { e.target.style.background = '#111'; e.target.style.borderColor = '#111'; }}
            >
              <Zap style={{ width: '16px', height: '16px' }} />
              View Hackathon Team Portal
            </button>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: t.entryBorder, paddingTop: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar style={{ width: '13px', height: '13px', color: t.subText }} />
            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.footerText }}>Oct 30 & 31, 2026</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin style={{ width: '13px', height: '13px', color: t.subText }} />
            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.footerText }}>Easwari Engineering College</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main UserDashboard ──────────────────────────────────────────────────────────
const UserDashboard = ({ onClose, onOpenHackathon }) => {
  const { user, registration } = useAuth();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [hackathonLeaderUid, setHackathonLeaderUid] = React.useState(null);

  React.useEffect(() => {
    if (user && registration?.registeredEvents?.includes('hackathon')) {
      fetchUserTeamData(user.uid).then(data => {
        if (data?.team?.leaderUid) {
          setHackathonLeaderUid(data.team.leaderUid);
        }
      }).catch(err => console.error("Error fetching hackathon team:", err));
    }
  }, [user, registration]);

  const handleSignOut = async () => {
    await signOut(auth);
    onClose?.();
    window.location.reload();
  };

  if (!registration) return null;

  // ── Determine which passes to show ──────────────────────────────────────────
  const passes = [];

  const hasVisitorPass =
    registration.passType === "Visitor's Pass" && registration.paymentStatus === 'paid';

  if (hasVisitorPass) {
    passes.push({ passType: "Visitor's Pass", eventName: registration.sessionChoice || null, qrSuffix: null });
  }

  // Event passes — one per registered event
  const registeredEvents = registration.registeredEvents || [];
  if (registeredEvents.length > 0) {
    registeredEvents.forEach((evt) => {
      passes.push({ passType: 'Event Pass', eventName: evt, qrSuffix: evt });
    });
  }

  // If no passes at all, show a fallback visitor pass (unpaid / pending state)
  if (passes.length === 0) {
    passes.push({ passType: "Visitor's Pass", eventName: null, qrSuffix: null });
  }

  const nextPass = () => {
    setCurrentIndex((prev) => (prev + 1) % passes.length);
  };

  const prevPass = () => {
    setCurrentIndex((prev) => (prev - 1 + passes.length) % passes.length);
  };

  const currentPass = passes[currentIndex];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <div className="relative z-50 flex items-center justify-center w-full gap-3 sm:gap-4 px-1 sm:px-0">
        {/* Left Arrow */}
        {passes.length > 1 && (
          <button
            onClick={prevPass}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-white hover:bg-white hover:text-black transition-all shrink-0"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Current Pass Container */}
        <div className="flex-1 min-w-0 max-w-[340px] sm:max-w-sm md:max-w-md">
          {/* Close button */}
          <div className="flex justify-end mb-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/25 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              <X className="w-4 h-6.5" />
            </button>
          </div>
          <PassCard
            registration={registration}
            user={user}
            passType={currentPass.passType}
            eventName={currentPass.eventName}
            qrSuffix={currentPass.qrSuffix}
            onClose={onClose}
            onOpenHackathon={currentPass.eventName?.toLowerCase() === 'hackathon' ? onOpenHackathon : undefined}
            overrideQrValue={currentPass.qrSuffix === 'hackathon' && hackathonLeaderUid ? `${hackathonLeaderUid}::hackathon` : undefined}
          />
          {/* Pagination indicators */}
          {passes.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {passes.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-[#a80d11]' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Arrow */}
        {passes.length > 1 && (
          <button
            onClick={nextPass}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-white hover:bg-white hover:text-black transition-all shrink-0"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default UserDashboard;
