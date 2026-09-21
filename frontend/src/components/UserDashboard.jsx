import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Ticket, Calendar, MapPin, User, Briefcase, GraduationCap, Building2, Zap, ShieldCheck } from 'lucide-react';
import QRCode from 'react-qr-code';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const passThemes = {
  'Visitor\'s Pass': {
    bg: '#ffffff',
    text: 'text-gray-900',
    border: 'border-gray-900',
    strip: 'linear-gradient(135deg, #2563eb, #9333ea)',
    accent: '#2563eb',
    badgeBg: '#f0fdf4',
    badgeText: '#15803d',
    shadow: 'shadow-[16px_16px_0px_rgba(0,0,0,1)]'
  },
  'Event Pass': {
    bg: '#0f172a',
    text: 'text-white',
    border: 'border-gray-700',
    strip: 'linear-gradient(135deg, #e11d48, #f59e0b)',
    accent: '#f59e0b',
    badgeBg: '#451a03',
    badgeText: '#fcd34d',
    shadow: 'shadow-[16px_16px_0px_rgba(225,29,72,0.8)]'
  },
};

const UserDashboard = ({ onClose }) => {
  const { user, registration } = useAuth();

  // Handle fallback if passType is 'None' or empty
  const displayPassType = (!registration?.passType || registration?.passType === 'None')
    ? "Visitor's Pass"
    : registration.passType;

  const theme = passThemes[displayPassType] || passThemes['Visitor\'s Pass'];
  const isPremium = displayPassType !== 'Visitor\'s Pass';

  const handleSignOut = async () => {
    await signOut(auth);
    onClose?.();
    window.location.reload();
  };

  if (!registration) return null;

  // Generate Monogram
  const name = registration.name || user?.displayName || 'Attendee';
  const monogram = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Dynamic Backdrop */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{
          background: isPremium ? 'radial-gradient(circle at center, rgba(30,0,10,0.8) 0%, rgba(0,0,0,0.95) 100%)' : 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(12px)'
        }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40, rotateX: -10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`relative z-50 w-full max-w-md max-h-[92vh] flex flex-col border-4 ${theme.border} ${theme.shadow} overflow-hidden rounded-xl`}
        style={{ background: theme.bg }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        {/* Animated Glow for Premium Pass */}
        {isPremium && (
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-rose-500/20 to-transparent pointer-events-none z-0" />
        )}

        {/* Top gradient strip */}
        <div className="h-3 shrink-0 relative z-10 w-full" style={{ background: theme.strip }} />

        <div className={`p-6 md:p-8 overflow-y-auto ${theme.text} relative z-10`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-8 relative">
            <div>
              <p className="font-black uppercase tracking-[0.4em] text-[10px] opacity-70 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" style={{ color: theme.accent }} />
                Easwari Startup Peravai
              </p>
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                Your Pass
              </h2>
            </div>
          </div>

          {/* Pass type badge (Bigger and better!) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`flex items-center gap-4 border-4 ${theme.border} p-5 mb-8 rounded-lg overflow-hidden relative group`}
            style={{
              background: isPremium ? 'rgba(255,255,255,0.05)' : '#ffffff',
              boxShadow: `4px 4px 0 ${isPremium ? '#334155' : '#000'}`
            }}
          >
            {/* Hover shine effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

            <div className={`p-3 rounded-full shrink-0 flex items-center justify-center`} style={{ background: theme.strip }}>
              {isPremium ? <Zap className="w-8 h-8 text-white" /> : <Ticket className="w-8 h-8 text-white" />}
            </div>
            <div>
              <p className="font-black text-3xl uppercase tracking-tighter leading-none mb-1" style={{ color: isPremium ? theme.accent : 'inherit' }}>
                {displayPassType}
              </p>
              <div className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-black uppercase tracking-widest" style={{ background: theme.badgeBg, color: theme.badgeText }}>
                {displayPassType === 'Visitor\'s Pass' ? 'Open Entry Valid' : displayPassType === 'Event Pass' ? 'All-Access Granted' : 'VIP Access'}
              </div>
            </div>
          </motion.div>

          {/* User info - Redesigned as ID Card style */}
          <div className={`mb-8 p-5 border-4 ${theme.border} rounded-lg`} style={{ background: isPremium ? 'rgba(0,0,0,0.3)' : '#f8fafc' }}>
            <div className="flex items-center gap-4 mb-5 pb-5 border-b-2 border-current border-opacity-10">
              <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-black shadow-inner" style={{ borderColor: theme.accent, color: theme.accent, background: isPremium ? '#1e293b' : '#fff' }}>
                {monogram}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Passholder</p>
                <p className="text-xl font-black uppercase leading-tight">{name}</p>
                <p className="text-xs font-bold opacity-70 mt-1">{registration.email || user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-3">
              {[
                registration.role === 'startup'
                  ? { icon: Briefcase, label: 'Company', value: registration.companyName }
                  : { icon: Building2, label: 'Institution', value: registration.college },
                registration.role === 'startup'
                  ? { icon: MapPin, label: 'City', value: registration.location }
                  : { icon: GraduationCap, label: 'Academics', value: (registration.year && registration.department) ? `${registration.year} · ${registration.department}` : '' },
              ].map(({ icon: Icon, label, value }, i) => {
                if (!value || typeof value !== 'string' || value.includes('undefined') || value.trim() === '') return null;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 mt-0.5 opacity-50 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-50">{label}</p>
                      <span className="font-bold text-sm">{value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QR code and Gate Status side-by-side */}
          <div className="flex gap-4 mb-8">
            {/* Check-in status */}
            <div className={`flex-1 border-4 ${theme.border} p-4 rounded-lg flex flex-col`} style={{ background: isPremium ? 'rgba(0,0,0,0.3)' : '#f8fafc' }}>
              <p className="font-black uppercase tracking-[0.2em] text-[10px] opacity-60 mb-3">
                Gate Entry
              </p>
              <div className="flex flex-col gap-2 flex-1 justify-center">
                {['Day 1', 'Day 2'].map((day, i) => {
                  const checked = i === 0 ? registration.checkedInDay1 : registration.checkedInDay2;
                  return (
                    <div key={day} className={`flex items-center justify-between p-2 rounded border-2 ${checked ? 'border-green-500' : 'border-transparent'} ${checked ? (isPremium ? 'bg-green-900/30' : 'bg-green-50') : 'opacity-60'}`}>
                      <p className="font-black text-xs uppercase">{day}</p>
                      <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-green-500' : 'opacity-30'}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QR code */}
            <div className={`flex flex-col items-center justify-center border-4 ${theme.border} p-4 rounded-lg bg-white shrink-0 shadow-inner`}>
              <div className="p-1">
                <QRCode
                  value={user?.uid || 'invalid'}
                  size={90}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                />
              </div>
              <p className="font-black uppercase tracking-[0.2em] text-[8px] text-black mt-3 text-center max-w-[90px]">
                Scan at Gate
              </p>
            </div>
          </div>

          {/* Event details */}
          <div className={`mt-2 flex items-center justify-between border-t-2 border-current border-opacity-10 pt-5`}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-50" />
              <span className="font-black text-[11px] uppercase tracking-widest opacity-80">Oct 15 & 16, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 opacity-50" />
              <span className="font-black text-[11px] uppercase tracking-widest opacity-80">Hiran Soluva</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
