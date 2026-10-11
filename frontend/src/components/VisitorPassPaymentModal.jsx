import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, Gift } from 'lucide-react';
import SessionPickerModal from './SessionPickerModal';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import api from '../utils/api';

const VisitorPassPaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, registration, refreshRegistration } = useAuth();

  // 'info' | 'session-picker' | 'registering' | 'success'
  const [step, setStep] = useState('info');
  const [loading, setLoading] = useState(false);
  const [chosenSession, setChosenSession] = useState(null);

  // Always reset whenever the modal is opened fresh
  useEffect(() => {
    if (isOpen) {
      setStep('info');
      setChosenSession(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 70, origin: { x: 0, y: 0.6 }, colors: ['#a80d11', '#d82221', '#0b2140', '#f59e0b', '#fff'] });
    confetti({ particleCount: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: ['#a80d11', '#d82221', '#0b2140', '#f59e0b', '#fff'] });
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.4 }, colors: ['#a80d11', '#fbbf24', '#fff', '#0f50e3'] });
    }, 250);
  };

  const handleRegister = async (session) => {
    setLoading(true);
    try {
      const payload = {
        passType: "Visitor's Pass",
        paymentStatus: 'free',
        status: 'active',
        checkedInDay1: false,
        checkedInDay2: false,
      };
      if (session) {
        const dayLabel = session.id.startsWith('d1') ? 'Day 1' : 'Day 2';
        payload.sessionChoice = `${session.title} (${dayLabel})`;
        payload.sessionType = session.type;
        payload.sessionSubtitle = session.time || '';
      }
      await api.patch('/api/registrations', payload);
      await refreshRegistration();
      setLoading(false);
      fireConfetti();
      setStep('success');
    } catch (err) {
      setLoading(false);
      console.error('Failed to register visitor pass', err);
      alert('Registration failed. Please try again or contact support.');
    }
  };

  const handleSessionNext = (session) => {
    setChosenSession(session);
    handleRegister(session);
  };

  const handleSessionSkip = () => {
    setChosenSession(null);
    handleRegister(null);
  };

  return (
    <>
      {/* Session Picker — shown between info and registration */}
      <SessionPickerModal
        isOpen={step === 'session-picker'}
        onSkip={handleSessionSkip}
        onNext={handleSessionNext}
        onBack={() => setStep('info')}
      />

      {/* Main modal */}
      <AnimatePresence>
        {step !== 'session-picker' && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={step === 'success' ? null : onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-50 w-full max-w-sm bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Header */}
              {step !== 'success' && (
                <div className="bg-[#a80d11] p-5 flex items-center justify-between border-b-4 border-black">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 border-2 border-black">
                      <Ticket className="w-5 h-5 text-[#a80d11]" />
                    </div>
                    <h2 className="text-xl font-black uppercase text-white tracking-tight">Visitor Pass</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── STEP: info */}
              {step === 'info' && !loading && (
                <div className="bg-[#f6f4ee] text-center">
                  {/* Pass Holder */}
                  <div className="px-10 pt-8 pb-5">
                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-black/40 mb-2">Pass Holder</p>
                    <p className="font-black text-xl uppercase text-gray-900">
                      {registration?.name || user?.displayName || user?.email || 'Attendee'}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-black/15 mx-6" />

                  {/* FREE badge */}
                  <div className="px-10 pt-6 pb-6">
                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-black/40 mb-3">Admission Fee</p>
                    <div className="relative inline-block">
                      <p className="font-black text-6xl text-[#a80d11]">FREE</p>
                    </div>
                    <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">Completely Free Entry</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-black/15 mx-6" />

                  {/* Button */}
                  <div className="px-6 py-6">
                    <button
                      onClick={() => setStep('session-picker')}
                      className="w-full py-4 border-4 border-black bg-[#a80d11] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all flex items-center justify-center gap-3"
                    >
                      <Gift className="w-5 h-5" />
                      Get My Free Pass
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: registering (loading) */}
              {step === 'registering' || loading ? (
                <div className="p-8 bg-[#f6f4ee] text-center">
                  <div className="py-10">
                    <svg className="animate-spin w-10 h-10 mx-auto text-[#a80d11] mb-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="font-black uppercase tracking-widest text-xs text-gray-600">Registering your pass...</p>
                  </div>
                </div>
              ) : null}

              {/* ── STEP: success */}
              {step === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 bg-white">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-24 h-24 mx-auto bg-green-500 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <p className="font-black text-xs uppercase tracking-[0.3em] text-green-600 mb-1">Registration Successful!</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Visitor Pass</h3>
                    {chosenSession && (
                      <div className="mt-3 bg-[#f0f9ff] border-2 border-[#0b2140]/20 p-3 text-left">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#0b2140]/50 mb-1">Session Registered</p>
                        <p className="font-black text-sm text-[#0b2140]">
                          {chosenSession.title} ({chosenSession.id.startsWith('d1') ? 'Day 1' : 'Day 2'})
                        </p>
                      </div>
                    )}
                    <p className="font-bold text-sm text-gray-600 mt-3 max-w-xs mx-auto mb-6">
                      Your free visitor pass has been registered successfully!
                    </p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="border-4 border-green-500 p-4 bg-green-50 text-left mb-6"
                  >
                    <p className="font-black uppercase tracking-widest text-xs text-green-700 mb-1">Pass Holder</p>
                    <p className="font-black text-sm">{registration?.name || user?.displayName || user?.email}</p>
                    <p className="font-bold text-xs text-gray-500">{registration?.email || user?.email}</p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    onClick={() => { onSuccess?.(); onClose(); }}
                    className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    View My Pass
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VisitorPassPaymentModal;
