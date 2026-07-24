import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Eye, EyeOff, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import {
  auth, googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  fetchSignInMethodsForEmail, sendPasswordResetEmail,
} from '../firebase';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Backdrop = ({ onClick }) => (
  <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
    onClick={onClick} />
);

// Shared input style
const inputCls = "w-full border-4 border-black px-3 py-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 bg-white placeholder:text-gray-300";
const btnPrimary = "w-full flex items-center justify-center gap-3 py-3 border-4 border-black font-black uppercase tracking-[0.15em] text-sm bg-[#1f2022] text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150";
const btnSecondary = "w-full flex items-center justify-center gap-3 py-3 px-6 border-4 border-black font-black uppercase tracking-[0.15em] text-sm bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150";
const backBtn = "flex items-center gap-1 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-5";

const AuthModal = ({ isOpen, onClose, selectedPass }) => {
  // steps: choose | email | email-password | email-signup | forgot | loading
  const [step, setStep] = useState('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('choose');
      setEmail(''); setPassword(''); setConfirmPassword('');
      setError(''); setResetSent(false); setIsNewUser(false);
    }
  }, [isOpen]);

  // ── Google ──
  const handleGoogle = async () => {
    setStep('loading'); setError('');
    try { await signInWithPopup(auth, googleProvider); onClose(); }
    catch (err) { setError(err.message || 'Google sign-in failed.'); setStep('choose'); }
  };

  // ── Email: check if account exists ──
  const handleEmailContinue = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return; }
    setError(''); setStep('loading');
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0 && methods.includes('password')) {
        setIsNewUser(false); setStep('email-password');
      } else if (methods.length > 0 && !methods.includes('password')) {
        // Signed up via Google etc.
        setError(`This email is linked to ${methods[0]} sign-in. Use that method instead.`);
        setStep('email');
      } else {
        setIsNewUser(true); setStep('email-signup');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.'); setStep('email');
    }
  };

  // ── Email: sign in ──
  const handleEmailSignIn = async () => {
    if (!password) { setError('Enter your password.'); return; }
    setError(''); setStep('loading');
    try { await signInWithEmailAndPassword(auth, email, password); onClose(); }
    catch (err) {
      const msg = err.code === 'auth/wrong-password' ? 'Incorrect password.' : err.message;
      setError(msg); setStep('email-password');
    }
  };

  // ── Email: sign up ──
  const handleEmailSignUp = async () => {
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setError(''); setStep('loading');
    try { await createUserWithEmailAndPassword(auth, email, password); onClose(); }
    catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'Account already exists. Sign in instead.' : err.message;
      setError(msg); setStep('email-signup');
    }
  };

  // ── Forgot password ──
  const handleForgotPassword = async () => {
    setError(''); setStep('loading');
    try { await sendPasswordResetEmail(auth, email); setResetSent(true); setStep('forgot'); }
    catch (err) { setError(err.message); setStep('forgot'); }
  };

  const stripColor = selectedPass === 'Event Pass'
    ? 'linear-gradient(to right,#a80d11,#d82221,#0b2140,#0f50e3)'
    : selectedPass === 'Premium Pass' ? 'linear-gradient(to right,#1f2022,#555)'
      : 'linear-gradient(to right,#000,#333)';

  const ErrorMsg = ({ msg }) => msg
    ? <p className="text-red-600 font-bold text-xs border-l-4 border-red-600 pl-3 py-1">{msg}</p>
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClick={onClose} />

          <motion.div key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 32 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true" role="dialog"
          >
            <div className="relative w-full max-w-md max-h-[90vh] flex flex-col border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)]"
              style={{ background: '#fffefa' }} onClick={(e) => e.stopPropagation()}>

              <div className="h-3 w-full shrink-0" style={{ background: stripColor }} />

              <div className="p-6 md:p-8 overflow-y-auto">
                <button onClick={onClose}
                  className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                  style={{ border: '3px solid black' }}>
                  <X className="w-4 h-4" />
                </button>

                <h2 className="text-3xl font-black uppercase tracking-tight text-black mb-8 border-b-4 border-black pb-5">
                  Login / Register
                </h2>

                <AnimatePresence mode="wait">

                  {/* ── CHOOSE ── */}
                  {step === 'choose' && (
                    <motion.div key="choose" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <p className="font-bold text-gray-500 text-xs uppercase tracking-widest mb-6">Sign in to continue</p>

                      <button id="auth-google-btn" onClick={handleGoogle} className={btnSecondary}>
                        <GoogleIcon /> Continue with Google
                      </button>

                      <button id="auth-email-btn" onClick={() => { setError(''); setStep('email'); }}
                        className={btnPrimary}>
                        <Mail className="w-5 h-5" /> Continue with Email
                      </button>

                      <ErrorMsg msg={error} />
                      <p className="text-xs text-gray-400 font-bold text-center mt-4 leading-relaxed">
                        By continuing you agree to our terms & privacy policy.
                      </p>
                    </motion.div>
                  )}

                  {/* ── EMAIL: enter address ── */}
                  {step === 'email' && (
                    <motion.div key="email" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <button onClick={() => { setStep('choose'); setError(''); }} className={backBtn}>
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <p className="font-bold text-gray-500 text-xs uppercase tracking-widest">Your email address</p>
                      <p className="text-xs text-gray-400 font-bold">Works with Gmail, Yahoo, Outlook — any email.</p>
                      <input id="auth-email-input" type="email" placeholder="you@example.com"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailContinue()}
                        className={inputCls} autoFocus />
                      <ErrorMsg msg={error} />
                      <button id="auth-email-continue-btn" onClick={handleEmailContinue} className={btnPrimary}>
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* ── EMAIL: existing user — sign in ── */}
                  {step === 'email-password' && (
                    <motion.div key="email-password" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <button onClick={() => { setStep('email'); setError(''); }} className={backBtn}>
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <p className="font-bold text-gray-500 text-xs uppercase tracking-widest">Welcome back!</p>
                      <p className="font-black text-black text-sm">{email}</p>
                      <div className="relative">
                        <input id="auth-signin-password" type={showPass ? 'text' : 'password'}
                          placeholder="Your password" value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEmailSignIn()}
                          className={inputCls} autoFocus />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <ErrorMsg msg={error} />
                      <button id="auth-signin-btn" onClick={handleEmailSignIn} className={btnPrimary}>
                        Sign In <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setError(''); setResetSent(false); setStep('forgot'); }}
                        className="w-full text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors py-1">
                        Forgot password?
                      </button>
                    </motion.div>
                  )}

                  {/* ── EMAIL: new user — sign up ── */}
                  {step === 'email-signup' && (
                    <motion.div key="email-signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <button onClick={() => { setStep('email'); setError(''); }} className={backBtn}>
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <p className="font-bold text-gray-500 text-xs uppercase tracking-widest">Create your account</p>
                      <p className="font-black text-black text-sm">{email}</p>
                      <div className="relative">
                        <input id="auth-signup-password" type={showPass ? 'text' : 'password'}
                          placeholder="Create a password (min 6 chars)" value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={inputCls} autoFocus />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="relative">
                        <input id="auth-signup-confirm" type={showConfirm ? 'text' : 'password'}
                          placeholder="Confirm password" value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEmailSignUp()}
                          className={inputCls} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Password strength hint */}
                      {password && (
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className={`flex-1 h-1 transition-colors ${password.length > i * 3
                              ? password.length < 6 ? 'bg-red-500' : password.length < 10 ? 'bg-yellow-400' : 'bg-green-500'
                              : 'bg-gray-200'
                              }`} />
                          ))}
                        </div>
                      )}
                      <ErrorMsg msg={error} />
                      <button id="auth-signup-btn" onClick={handleEmailSignUp} className={btnPrimary}>
                        Create Account <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* ── FORGOT PASSWORD ── */}
                  {step === 'forgot' && (
                    <motion.div key="forgot" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <button onClick={() => { setStep('email-password'); setError(''); }} className={backBtn}>
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      {resetSent ? (
                        <div className="border-4 border-black p-6 text-center space-y-3">
                          <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <p className="font-black uppercase tracking-widest text-sm">Reset Email Sent!</p>
                          <p className="text-xs font-bold text-gray-500 leading-relaxed">
                            Check <span className="text-black">{email}</span> for a password reset link.
                            Also check your spam folder.
                          </p>
                          <button onClick={() => { setStep('email-password'); setResetSent(false); }}
                            className={btnPrimary + ' mt-4'}>
                            Back to Sign In
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-bold text-gray-500 text-xs uppercase tracking-widest">Reset your password</p>
                          <p className="text-xs text-gray-400 font-bold">
                            We'll send a reset link to <span className="text-black font-black">{email}</span>
                          </p>
                          <ErrorMsg msg={error} />
                          <button id="auth-reset-btn" onClick={handleForgotPassword} className={btnPrimary}>
                            Send Reset Link <ArrowRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* ── LOADING ── */}
                  {step === 'loading' && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-12 gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-black" />
                      <p className="font-black uppercase tracking-widest text-sm text-gray-500">Authenticating…</p>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

