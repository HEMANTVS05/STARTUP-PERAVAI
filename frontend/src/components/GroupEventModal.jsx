import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, LogIn, Copy, Check, Sparkles, ArrowRight,
  Loader2, X, CheckCircle2, Mail, User, Hash, Share2, Link as LinkIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import RazorpayCheckoutButton from './RazorpayCheckoutButton';
import {
  findEventTeamByCode,
  fetchUserEventTeam,
  subscribeToEventTeam,
} from '../services/eventTeamService';

// ── Reusable Field ────────────────────────────────────────────────────────────
const labelCls = 'flex items-center gap-1.5 font-black uppercase tracking-[0.2em] text-[11px] text-black mb-1';
const inputCls = 'w-full border-4 border-black bg-white px-3 py-2.5 font-black text-sm text-black focus:outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400';

const Field = ({ id, label, icon: Icon, required, placeholder, value, onChange, readOnly, disabled, type = 'text' }) => (
  <div className="space-y-1">
    <label htmlFor={id} className={labelCls}>
      {Icon && <Icon className="w-3.5 h-3.5 text-black" />}
      {label}{required && <span className="text-red-600">*</span>}
    </label>
    <input
      id={id} type={type} required={required} placeholder={placeholder}
      value={value} onChange={onChange} readOnly={readOnly} disabled={disabled}
      className={`${inputCls} ${disabled || readOnly ? 'bg-gray-100 text-gray-600 cursor-not-allowed border-dashed' : ''}`}
    />
  </div>
);

const ErrorMsg = ({ msg }) => msg ? (
  <div className="flex items-start gap-3 border-4 border-red-600 bg-red-50 p-3">
    <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
    <p className="text-red-700 font-black text-xs uppercase tracking-wide">{msg}</p>
  </div>
) : null;

// ── Main GroupEventModal ──────────────────────────────────────────────────────
const GroupEventModal = ({ isOpen, onClose, event }) => {
  const { user, registration, refreshRegistration } = useAuth();

  const [view, setView]                   = useState('choice');    // 'choice' | 'payment' | 'create' | 'join' | 'success' | 'dashboard'
  const [paymentStep, setPaymentStep]     = useState('choice');    // 'choice' | 'payment' | 'paid-success'
  const [hasPaid, setHasPaid]             = useState(false);
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState('');
  const [activeTeamData, setActiveTeamData] = useState(null);
  const [createdTeam, setCreatedTeam]     = useState(null);
  const [foundTeam, setFoundTeam]         = useState(null);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [copiedCode, setCopiedCode]       = useState(false);
  const [copiedLink, setCopiedLink]       = useState(false);

  const [formData, setFormData] = useState({
    teamName: '', leaderName: '', maxMembers: 2, invitedEmails: [''],
  });
  const [memberProfile, setMemberProfile] = useState({ name: '', });

  const eventId    = event?.id;
  const eventName  = event?.name || 'Event';
  const eventAccent = event?.accent || '#0b2140';
  const eventFee   = event?.fee || 500;

  // ── Init: check if already in a team ──────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !user) return;
    let unsubscribe = () => {};
    setLoading(true);
    setError('');

    const init = async () => {
      try {
        const existingData = await fetchUserEventTeam(user.uid, eventId);
        if (existingData?.team) {
          setActiveTeamData(existingData);
          setView('dashboard');
          // Subscribe to real-time updates
          unsubscribe = subscribeToEventTeam(eventId, existingData.team.id, (data) => {
            if (data) setActiveTeamData(data);
          });
        } else {
          // Pre-fill leader name
          setFormData(prev => ({
            ...prev,
            leaderName: registration?.name || user.displayName || '',
          }));
          const paidEvents = registration?.paidEvents || [];
          if (paidEvents.includes(eventId)) {
            setHasPaid(true);
            setView('choice');
          } else {
            setView('choice');
          }
        }
      } catch (err) {
        console.error('GroupEventModal init error:', err);
        setView('choice');
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [isOpen, user, eventId]);

  // ── Team size handler ─────────────────────────────────────────────────────
  const handleTeamSizeChange = (size) => {
    const numSize = Number(size);
    const neededInvites = numSize - 1;
    setFormData(prev => {
      let updatedEmails = [...prev.invitedEmails];
      while (updatedEmails.length < neededInvites) updatedEmails.push('');
      updatedEmails = updatedEmails.slice(0, neededInvites);
      return { ...prev, maxMembers: numSize, invitedEmails: updatedEmails };
    });
  };

  // ── Create team ───────────────────────────────────────────────────────────
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.teamName.trim()) { setError('Team name is required.'); return; }
    if (!formData.leaderName.trim()) { setError('Your name is required.'); return; }

    setSubmitting(true);
    try {
      // 1. Create team
      const { data } = await api.post(`/api/event-teams/${eventId}`, {
        teamName: formData.teamName,
        leaderName: formData.leaderName,
        maxMembers: formData.maxMembers,
        invitedEmails: formData.invitedEmails.filter(Boolean),
      });
      setCreatedTeam(data);

      // 2. Add event to registeredEvents
      const currentEvents = registration?.registeredEvents || [];
      if (!currentEvents.includes(eventId)) {
        await api.patch('/api/registrations', {
          registeredEvents: [...currentEvents, eventId],
        });
        await refreshRegistration();
      }

      const updatedData = await fetchUserEventTeam(user.uid, eventId);
      setActiveTeamData(updatedData);
      setView('success');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create team.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Search team by code ───────────────────────────────────────────────────
  const handleSearchTeam = async () => {
    if (!joinCodeInput.trim()) { setError('Please enter a team code.'); return; }
    setSubmitting(true);
    setError('');
    setFoundTeam(null);
    try {
      const team = await findEventTeamByCode(eventId, joinCodeInput.toUpperCase());
      if (!team) { setError('No team found with that code.'); return; }
      if ((team.joinedMemberUids?.length || 0) >= team.maxMembers) {
        setError('This team is already full.'); return;
      }
      setFoundTeam(team);
    } catch (err) {
      setError(err.message || 'Failed to find team.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Join team ─────────────────────────────────────────────────────────────
  const handleJoinTeamSubmit = async () => {
    if (!memberProfile.name.trim()) { setError('Please enter your name.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/api/event-teams/${eventId}/join`, {
        teamCode: joinCodeInput.toUpperCase(),
        name: memberProfile.name.trim(),
        email: user.email,
      });

      // Add event to registeredEvents
      const currentEvents = registration?.registeredEvents || [];
      if (!currentEvents.includes(eventId)) {
        await api.patch('/api/registrations', {
          registeredEvents: [...currentEvents, eventId],
        });
        await refreshRegistration();
      }

      const updatedData = await fetchUserEventTeam(user.uid, eventId);
      setActiveTeamData(updatedData);
      setView('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to join team.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Copy helpers ──────────────────────────────────────────────────────────
  const teamCode = createdTeam?.teamCode || activeTeamData?.team?.teamCode;
  const handleCopyCode = () => {
    if (!teamCode) return;
    navigator.clipboard.writeText(teamCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  const handleCopyLink = () => {
    if (!teamCode) return;
    const link = `${window.location.origin}/events?joinCode=${teamCode}&eventId=${eventId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-50 w-full max-w-2xl max-h-[90vh] bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-black text-white p-4 md:p-5 flex items-center justify-between shrink-0 border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center font-black" style={{ background: eventAccent }}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em]" style={{ color: '#93c5fd' }}>Easwari Startup Peravai</p>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">{eventName} — Team Portal</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 border-2 border-white bg-red-600 text-white flex items-center justify-center font-black hover:bg-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">

          {/* LOADING */}
          {loading && (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-black" />
              <p className="font-black uppercase tracking-widest text-sm text-gray-600">Loading…</p>
            </div>
          )}

          {/* CHOICE: Pay, Create, or Join */}
          {!loading && view === 'choice' && paymentStep === 'choice' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="border-4 border-black p-4 bg-[#f0f9ff] flex items-center gap-4">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center shrink-0" style={{ background: eventAccent }}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black uppercase tracking-[0.2em] text-xs text-[#0b2140] mb-0.5">Registering As</p>
                  <p className="font-black text-base text-black">{registration?.name || user?.displayName || user?.email}</p>
                  <p className="font-bold text-xs text-gray-500">{registration?.email || user?.email}</p>
                </div>
              </div>

              <div className="border-4 border-black p-6 bg-[#fff5f5] text-center">
                <p className="font-black uppercase tracking-[0.25em] text-xs text-gray-500 mb-2">Registration Fee</p>
                <p className="font-black text-5xl text-[#a80d11] mb-1">₹{eventFee}</p>
                <p className="font-bold text-xs text-gray-500 uppercase tracking-wider">{eventName}</p>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                {!hasPaid ? (
                  <>
                    <p className="text-center text-xs font-bold text-gray-500 mb-2">
                      Complete your payment to enter the Team Portal.
                    </p>
                    <button
                      onClick={() => setPaymentStep('payment')}
                      className="w-full py-4 border-4 border-black bg-[#a80d11] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                    >
                      Continue to Payment <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        // Allow them to look at the join screen, but joining will require payment
                        // Actually, let's keep it strictly gated.
                        setPaymentStep('payment'); 
                      }}
                      className="w-full py-3 border-4 border-black bg-white text-black font-black uppercase tracking-[0.15em] text-xs shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4" /> Already have a team?
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setView('create')}
                      className="w-full py-4 border-4 border-black bg-[#a80d11] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                    >
                      <UserPlus className="w-5 h-5" /> Create a New Team
                    </button>
                    <button
                      onClick={() => setView('join')}
                      className="w-full py-3 border-4 border-black bg-white text-black font-black uppercase tracking-[0.15em] text-xs shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4" /> Already have a team? Join Here
                    </button>
                  </>
                )}
                <button onClick={onClose} className="w-full py-2 mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
          {/* VIEW: RAZORPAY (Payment) */}
          {!loading && view === 'choice' && !hasPaid && paymentStep === 'payment' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 text-center">
              <div className="border-4 border-black p-5 bg-[#fff5f5]">
                <p className="font-black uppercase tracking-[0.25em] text-xs text-gray-500 mb-2">Amount</p>
                <p className="font-black text-4xl text-[#a80d11]">₹{eventFee}</p>
                <p className="font-bold text-xs text-gray-400 mt-1">{eventName} Registration</p>
              </div>
              <div className="border-4 border-black p-4 bg-[#f0f9ff] flex items-center gap-3">
                <div className="shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#0b2140]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="text-left">
                  <p className="font-black text-sm">{registration?.name || user?.displayName || user?.email}</p>
                  <p className="font-bold text-xs text-gray-500">{registration?.email || user?.email}</p>
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <RazorpayCheckoutButton
                  amount={eventFee * 100}
                  currency="INR"
                  prefillName={registration?.name || user?.displayName || ''}
                  prefillEmail={registration?.email || user?.email || ''}
                  prefillContact={registration?.phone || ''}
                  onSuccess={async () => {
                    try {
                      // Save payment immediately to backend so they don't lose it if they close the modal
                      const currentPaid = registration?.paidEvents || [];
                      if (!currentPaid.includes(eventId)) {
                        await api.patch('/api/registrations', {
                          paidEvents: [...currentPaid, eventId]
                        });
                        await refreshRegistration();
                      }
                    } catch (err) {
                      console.error("Failed to record payment in profile:", err);
                    }
                    confetti({ particleCount: 120, spread: 70, origin: { x: 0, y: 0.6 }, colors: ['#a80d11', '#d82221', '#0b2140', '#f59e0b', '#fff'] });
                    confetti({ particleCount: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: ['#a80d11', '#d82221', '#0b2140', '#f59e0b', '#fff'] });
                    setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.4 }, colors: ['#a80d11', '#fbbf24', '#fff', '#0f50e3'] }), 250);
                    setPaymentStep('paid-success');
                    setHasPaid(true); 
                  }}
                />
              </div>
              <button onClick={() => setPaymentStep('choice')} className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black mt-4 block mx-auto">
                ← Back
              </button>
            </motion.div>
          )}

          {/* VIEW: PAYMENT SUCCESS */}
          {!loading && view === 'choice' && paymentStep === 'paid-success' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-6">
              <div className="w-20 h-20 bg-black border-4 border-black text-white flex items-center justify-center mx-auto shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h4 className="text-3xl font-black uppercase tracking-tight">Payment Successful!</h4>
                <p className="font-bold text-sm text-gray-500 mt-2">You now have access to the {eventName} Team Portal.</p>
              </div>
              <button
                onClick={() => setPaymentStep('choice')}
                className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.2em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Enter Portal →
              </button>
            </motion.div>
          )}

          {/* CREATE TEAM FORM */}
          {!loading && view === 'create' && hasPaid && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="flex items-center gap-3 border-b-4 border-black pb-4">
                <button onClick={() => setView('choice')} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black">← Back</button>
                <h4 className="text-xl font-black uppercase tracking-tight">Create Team</h4>
              </div>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <Field id="teamName" label="Team Name" icon={Users} required placeholder="Enter your team name" value={formData.teamName} onChange={e => setFormData(p => ({ ...p, teamName: e.target.value }))} />
                <Field id="leaderName" label="Your Full Name" icon={User} required placeholder="Your name" value={formData.leaderName} onChange={e => setFormData(p => ({ ...p, leaderName: e.target.value }))} />
                <div className="space-y-1">
                  <label className={labelCls}><Mail className="w-3.5 h-3.5" /> Your Email (Auto)</label>
                  <input readOnly disabled value={user?.email || ''} className={`${inputCls} bg-gray-100 text-gray-600 cursor-not-allowed border-dashed`} />
                </div>

                {/* Team Size */}
                <div className="border-4 border-black p-4 bg-[#fbfbf8] space-y-2">
                  <label className="font-black uppercase tracking-[0.2em] text-xs text-black block">Team Size <span className="text-red-600">*</span></label>
                  <div className="grid grid-cols-3 gap-3">
                    {[2, 3, 4].map(size => (
                      <button type="button" key={size} onClick={() => handleTeamSizeChange(size)}
                        className={`p-3 border-4 font-black uppercase text-center transition-all text-sm ${formData.maxMembers === size ? 'border-black bg-black text-white' : 'border-black bg-white text-black hover:bg-gray-100'}`}>
                        {size} Members
                      </button>
                    ))}
                  </div>
                </div>

                {/* Member Emails */}
                {formData.invitedEmails.length > 0 && (
                  <div className="border-4 border-black p-4 bg-white space-y-3">
                    <p className="font-black uppercase tracking-widest text-xs">Invited Teammate Emails</p>
                    {formData.invitedEmails.map((emailVal, idx) => (
                      <Field key={idx} id={`mem-${idx}`} label={`Member ${idx + 2} Email`} icon={Mail}
                        type="email" placeholder={`teammate${idx + 2}@college.edu`}
                        value={emailVal}
                        onChange={e => {
                          const updated = [...formData.invitedEmails];
                          updated[idx] = e.target.value;
                          setFormData(p => ({ ...p, invitedEmails: updated }));
                        }} />
                    ))}
                  </div>
                )}

                <ErrorMsg msg={error} />
                <button type="submit" disabled={submitting}
                  className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.2em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-60 flex items-center justify-center gap-3">
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating…</> : <>Create Team & Get Code <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
            </motion.div>
          )}

          {/* JOIN TEAM */}
          {!loading && view === 'join' && hasPaid && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="flex items-center gap-3 border-b-4 border-black pb-4">
                <button onClick={() => setView('choice')} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black">← Back</button>
                <h4 className="text-xl font-black uppercase tracking-tight">Join Team</h4>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Field id="joinCode" label="Team Code" icon={Hash} placeholder="e.g. SPV-7KQ4P"
                    value={joinCodeInput} onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} />
                </div>
                <button onClick={handleSearchTeam} disabled={submitting}
                  className="mt-6 px-6 border-4 border-black bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
              </div>

              <ErrorMsg msg={error} />

              {foundTeam && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-4 border-black p-5 bg-[#fffefa] space-y-4">
                  <div className="border-b-2 border-black/10 pb-3">
                    <p className="font-black text-xs uppercase tracking-widest text-gray-500">Team Found</p>
                    <h5 className="text-2xl font-black uppercase text-black">{foundTeam.teamName}</h5>
                    <p className="font-bold text-xs text-gray-600 mt-1">Leader: <span className="font-black text-black">{foundTeam.leaderName}</span></p>
                    <p className="font-bold text-xs text-blue-700 mt-1">{foundTeam.joinedMemberUids?.length || 1} / {foundTeam.maxMembers} members joined</p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-black uppercase tracking-widest text-xs text-gray-700">Confirm Your Name</p>
                    <Field id="memName" label="Your Full Name" icon={User} required placeholder="Enter your name"
                      value={memberProfile.name} onChange={e => setMemberProfile(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <button onClick={handleJoinTeamSubmit} disabled={submitting || (foundTeam.joinedMemberUids?.length >= foundTeam.maxMembers)}
                    className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.2em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Join Team →'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* SUCCESS SCREEN */}
          {!loading && view === 'success' && createdTeam && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-black border-4 border-black text-white flex items-center justify-center mx-auto shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-[0.3em] text-green-600 mb-1">Team Created!</p>
                <h4 className="text-3xl font-black uppercase tracking-tight">{createdTeam.teamName}</h4>
              </div>
              <div className="border-4 border-black p-6 bg-blue-50 text-center space-y-2">
                <p className="font-black uppercase tracking-[0.2em] text-xs text-blue-900">Your Team Code</p>
                <p className="font-mono font-black text-4xl tracking-wider text-black select-all">{createdTeam.teamCode}</p>
                <p className="font-bold text-xs text-gray-600 uppercase tracking-widest">Share this code with your teammates.</p>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={handleCopyCode} className="py-2.5 px-4 border-2 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1.5">
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
                <button onClick={handleCopyLink} className="py-2.5 px-4 border-2 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1.5">
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <LinkIcon className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <button onClick={() => setView('dashboard')} className="w-full py-3 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-all">
                View Team Dashboard →
              </button>
            </motion.div>
          )}

          {/* DASHBOARD */}
          {!loading && view === 'dashboard' && activeTeamData?.team && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <div>
                  <span className="px-3 py-1 bg-green-600 text-white font-black text-xs uppercase tracking-widest border-2 border-black inline-block mb-1">REGISTERED</span>
                  <h4 className="text-3xl font-black uppercase tracking-tight">{activeTeamData.team.teamName}</h4>
                </div>
                <div className="text-right">
                  <p className="font-black text-xs uppercase tracking-widest text-gray-500">Team Size</p>
                  <p className="font-black text-lg text-black">{activeTeamData.team.joinedMemberUids?.length || 1} / {activeTeamData.team.maxMembers} Members</p>
                </div>
              </div>

              <div className="border-4 border-black p-5 bg-blue-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black uppercase tracking-[0.2em] text-xs text-blue-950">Team Code</p>
                    <p className="font-mono font-black text-3xl tracking-wider text-black select-all">{activeTeamData.team.teamCode}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCopyCode} className="py-2.5 px-3 border-2 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1.5">
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCode ? 'Copied' : 'Copy'}
                    </button>
                    <button onClick={handleCopyLink} className="py-2.5 px-3 border-2 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1.5">
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <LinkIcon className="w-3.5 h-3.5" />}
                      {copiedLink ? 'Copied' : 'Link'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="border-4 border-black p-4 bg-white space-y-3">
                <p className="font-black uppercase tracking-widest text-xs border-b-2 border-black/10 pb-2">Team Members ({activeTeamData.members?.length || 0})</p>
                {(activeTeamData.members || []).map((m, i) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 border-2 border-black/10">
                    <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-black text-xs shrink-0">
                      {m.name?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm text-black">{m.name || m.email}</p>
                      <p className="text-xs text-gray-500">{m.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border ${m.role === 'leader' ? 'bg-black text-white border-black' : 'bg-white text-black border-black/30'}`}>
                      {m.role}
                    </span>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: (activeTeamData.team.maxMembers || 0) - (activeTeamData.members?.length || 0) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex items-center gap-3 p-3 border-2 border-dashed border-black/20">
                    <div className="w-9 h-9 border-2 border-dashed border-black/20 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-black/20" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-black/30">Waiting for member…</p>
                  </div>
                ))}
              </div>

              <button onClick={onClose} className="w-full py-3 border-4 border-black bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all">
                Close
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GroupEventModal;
