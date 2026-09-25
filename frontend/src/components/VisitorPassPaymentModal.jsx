import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, CheckCircle2 } from 'lucide-react';
import RazorpayCheckoutButton from './RazorpayCheckoutButton';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import api from '../utils/api';

const VisitorPassPaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, registration, refreshRegistration } = useAuth();
  
  // 'info' | 'payment' | 'paid-success'
  const [paymentStep, setPaymentStep] = useState('info');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 70, origin: { x: 0, y: 0.6 }, colors: ['#a80d11', '#d82221', '#0b2140', '#f59e0b', '#fff'] });
    confetti({ particleCount: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: ['#a80d11', '#d82221', '#0b2140', '#f59e0b', '#fff'] });
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.4 }, colors: ['#a80d11', '#fbbf24', '#fff', '#0f50e3'] });
    }, 250);
  };

  const handlePaymentSuccess = async (data) => {
    setLoading(true);
    try {
      // Update registration to paid in backend
      await api.patch('/api/registrations', {
        passType: "Visitor's Pass",
        paymentStatus: 'paid',
        status: 'active',
        checkedInDay1: false,
        checkedInDay2: false
      });
      await refreshRegistration();
      
      setLoading(false);
      fireConfetti();
      setPaymentStep('paid-success');
    } catch (err) {
      setLoading(false);
      console.error("Failed to update registration", err);
      alert("Payment succeeded but failed to update profile. Please contact support.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={paymentStep === 'paid-success' ? null : onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-50 w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] overflow-hidden"
        >
          {/* Header (Only show if not success) */}
          {paymentStep !== 'paid-success' && (
            <div className="bg-[#a80d11] p-6 flex items-center justify-between border-b-4 border-black">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 border-2 border-black">
                  <Ticket className="w-6 h-6 text-[#a80d11]" />
                </div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">Visitor Pass</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* VIEW: INFO CARD (Step 1) */}
          {paymentStep === 'info' && (
            <div className="p-8 text-center bg-[#f6f4ee]">
              <p className="font-black uppercase tracking-[0.2em] text-xs opacity-60 mb-2">
                Pass Holder
              </p>
              <p className="font-black text-xl mb-6 uppercase text-gray-900">
                {registration?.name || user?.displayName || user?.email || 'Attendee'}
              </p>

              <div className="border-t-2 border-b-2 border-black/10 py-6 mb-8">
                <p className="font-black uppercase tracking-[0.2em] text-xs opacity-60 mb-2">
                  Amount to Pay
                </p>
                <p className="font-black text-4xl text-[#a80d11]">
                  ₹50
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setPaymentStep('payment')}
                  className="w-full py-4 border-4 border-black bg-[#a80d11] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  Continue to Payment <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* VIEW: RAZORPAY (Step 2) */}
          {paymentStep === 'payment' && (
            <div className="p-8 text-center bg-[#f6f4ee]">
              {loading ? (
                <div className="py-10">
                  <svg className="animate-spin w-10 h-10 mx-auto text-[#a80d11] mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="font-black uppercase tracking-widest text-xs text-gray-600">Processing Payment...</p>
                </div>
              ) : (
                <>
                  <div className="border-4 border-black p-5 bg-[#fff5f5] mb-6">
                    <p className="font-black uppercase tracking-[0.25em] text-xs text-gray-500 mb-2">Amount</p>
                    <p className="font-black text-4xl text-[#a80d11]">₹50</p>
                    <p className="font-bold text-xs text-gray-400 mt-1">Visitor Pass Registration</p>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <RazorpayCheckoutButton
                      amount={100} // CHANGEEEEEEE (100 paise = 1 INR test amount)
                      currency="INR"
                      prefillName={registration?.name || user?.displayName || ''}
                      prefillEmail={registration?.email || user?.email || ''}
                      prefillContact={registration?.phone || ''}
                      onSuccess={handlePaymentSuccess}
                      onError={(err) => {
                        console.error("Payment failed", err);
                      }}
                    />
                  </div>
                  <button onClick={() => setPaymentStep('info')} className="w-full py-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">← Back</button>
                </>
              )}
            </div>
          )}

          {/* VIEW: SUCCESS (Step 3) */}
          {paymentStep === 'paid-success' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 bg-white">
              <motion.div
                initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-24 h-24 mx-auto bg-green-500 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <p className="font-black text-xs uppercase tracking-[0.3em] text-green-600 mb-1">🎉 Payment Successful!</p>
                <h3 className="text-2xl font-black uppercase tracking-tight">Visitor Pass</h3>
                <p className="font-bold text-sm text-gray-600 mt-2 max-w-xs mx-auto mb-6">
                  Payment has been done successfully for registration.
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
                onClick={() => {
                  onSuccess?.();
                  onClose();
                }}
                className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                View My Pass
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </motion.button>
            </motion.div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VisitorPassPaymentModal;
