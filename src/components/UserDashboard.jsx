import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Ticket, QrCode, Calendar, MapPin, LogOut, User, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

const passColors = {
  'General Pass': {
    bg: '#fffefa',
    text: 'text-black',
    border: 'border-black',
    badge: '#000',
    strip: 'linear-gradient(to right,#000,#333)',
  },
  'Event Pass': {
    bg: 'linear-gradient(145deg,#a80d11,#d82221,#0b2140,#0f50e3)',
    text: 'text-white',
    border: 'border-white',
    badge: '#fff',
    strip: 'linear-gradient(to right,#a80d11,#d82221,#0b2140,#0f50e3)',
  },
  'Premium Pass': {
    bg: '#1f2022',
    text: 'text-white',
    border: 'border-white',
    badge: '#fff',
    strip: 'linear-gradient(to right,#1f2022,#555)',
  },
};

const UserDashboard = ({ onClose }) => {
  const { user, registration } = useAuth();
  const colors = passColors[registration?.passType] || passColors['General Pass'];
  const isFeatured = registration?.passType !== 'General Pass';

  const handleSignOut = async () => {
    await signOut(auth);
    onClose?.();
    window.location.reload();
  };

  if (!registration) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-50 w-full max-w-md max-h-[90vh] flex flex-col border-4 ${colors.border} shadow-[14px_14px_0px_rgba(0,0,0,1)]`}
        style={{ background: colors.bg }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient strip */}
        <div className="h-2 shrink-0" style={{ background: colors.strip }} />

        <div className={`p-6 md:p-8 overflow-y-auto ${colors.text}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className={`font-black uppercase tracking-[0.3em] text-xs opacity-60 mb-1`}>
                Startup Peravai 2026
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tight">
                Your Pass
              </h2>
            </div>
          </div>

          {/* Pass type badge */}
          <div className={`flex items-center gap-3 border-4 ${colors.border} p-4 mb-6`}>
            <Ticket className="w-8 h-8 shrink-0" />
            <div>
              <p className="font-black text-2xl uppercase tracking-tight">{registration.passType}</p>
              <p className={`text-xs font-bold uppercase tracking-widest opacity-60`}>
                {registration.passType === 'General Pass' ? 'Open Access' : registration.passType === 'Event Pass' ? 'Full Event Access' : 'VIP Access'}
              </p>
            </div>
          </div>

          {/* User info */}
          <div className="space-y-3 mb-8">
            {registration && [
              { icon: User, value: registration.name || user?.displayName || 'Attendee' },
              registration.role === 'startup'
                ? { icon: Briefcase, value: registration.companyName }
                : { icon: Building2, value: registration.college },
              registration.role === 'startup'
                ? { icon: MapPin, value: registration.location }
                : { icon: GraduationCap, value: (registration.year && registration.department) ? `${registration.year} · ${registration.department}` : '' },
            ].map(({ icon: Icon, value }, i) => {
              if (!value || typeof value !== 'string' || value.includes('undefined') || value.trim() === '') return null;
              return (
                <div key={i} className={`flex items-center gap-3 border-b-2 ${isFeatured ? 'border-white/20' : 'border-black/10'} pb-3`}>
                  <Icon className="w-4 h-4 shrink-0 opacity-60" />
                  <span className="font-bold text-sm">{value}</span>
                </div>
              );
            })}

            {!registration?.role && (
              <div className="p-4 border-2 border-red-500 bg-red-50 mt-4">
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Old Test Account Detected</p>
                <p className="text-sm text-red-700 font-medium">
                  This account was created before the profile system was finished, so the database is empty. 
                  To test the new form, please sign in with a different email/phone, or delete this user from your Firebase Console.
                </p>
              </div>
            )}
          </div>

          {/* Check-in status */}
          <div className={`border-4 ${colors.border} p-4 mb-6`}>
            <p className="font-black uppercase tracking-[0.2em] text-xs opacity-60 mb-3">
              Gate Entry Status
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Day 1', 'Day 2'].map((day, i) => {
                const checked = i === 0 ? registration.checkedInDay1 : registration.checkedInDay2;
                return (
                  <div key={day} className={`flex items-center gap-2 p-3 border-2 ${colors.border} ${checked ? (isFeatured ? 'bg-white/10' : 'bg-black/5') : ''}`}>
                    <CheckCircle2 className={`w-5 h-5 ${checked ? '' : 'opacity-20'}`} />
                    <div>
                      <p className="font-black text-xs uppercase">{day}</p>
                      <p className="font-bold text-xs opacity-50">{checked ? 'Checked in' : 'Not yet'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QR code */}
          <div className={`flex flex-col items-center border-4 ${colors.border} p-6 gap-4 bg-white`}>
            <div className="p-2 border-2 border-black bg-white">
              <QRCode
                value={user?.uid || 'invalid'}
                size={120}
                bgColor="#ffffff"
                fgColor="#000000"
                level="Q"
              />
            </div>
            <div className="text-center">
              <p className="font-black uppercase tracking-[0.2em] text-xs text-black mb-1">
                Show this at the gate
              </p>
              <p className="font-mono font-bold text-xs text-black/40">UID: {user?.uid?.slice(0, 12)}…</p>
            </div>
          </div>

          {/* Event details */}
          <div className={`mt-6 flex items-center justify-between border-t-4 ${isFeatured ? 'border-white/30' : 'border-black/10'} pt-5`}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-50" />
              <span className="font-black text-xs uppercase tracking-widest opacity-60">Oct 15 & 16</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 opacity-50" />
              <span className="font-black text-xs uppercase tracking-widest opacity-60">EEC</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
