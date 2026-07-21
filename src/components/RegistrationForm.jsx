import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Loader2, User, Mail, Phone, GraduationCap,
  Building2, MapPin, Briefcase, ChevronLeft, CreditCard,
  Lock, CheckCircle2, Shield, Zap, Crown, Ticket, X
} from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

// ── Shared UI ────────────────────────────────────────────────────────────────
const inputCls = 'w-full border-4 border-black px-3 py-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 bg-white placeholder:text-gray-300';
const labelCls = 'flex items-center gap-2 font-black uppercase tracking-[0.2em] text-xs text-gray-500 mb-1';

const Field = ({ id, label, icon: Icon, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={id} className={labelCls}><Icon className="w-3.5 h-3.5" />{label}</label>
    <input id={id} {...props} className={inputCls} />
  </div>
);

const Select = ({ id, label, icon: Icon, children, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={id} className={labelCls}><Icon className="w-3.5 h-3.5" />{label}</label>
    <select id={id} {...props} className={`${inputCls} appearance-none cursor-pointer`}>{children}</select>
  </div>
);

const ErrorMsg = ({ msg }) => msg
  ? <p className="text-red-600 font-bold text-xs border-l-4 border-red-600 pl-3 py-1">{msg}</p>
  : null;

// Pass colours
const passStrip = {
  'General Pass': 'linear-gradient(to right,#000,#333)',
  'Event Pass': 'linear-gradient(to right,#a80d11,#d82221,#0b2140,#0f50e3)',
  'Premium Pass': 'linear-gradient(to right,#1f2022,#555)',
};
const passDot = {
  'General Pass': '#000',
  'Event Pass': 'linear-gradient(135deg,#a80d11,#0f50e3)',
  'Premium Pass': '#1f2022',
};
const passPrice = { 'General Pass': 'Free', 'Event Pass': '₹499', 'Premium Pass': '₹999' };
const passIcon = { 'General Pass': Ticket, 'Event Pass': Zap, 'Premium Pass': Crown };

// ── PaymentGateway ────────────────────────────────────────────────────────────
const PaymentGateway = ({ passType, setPassType, registrationData, onSuccess, onBack }) => {
  const { user, refreshRegistration } = useAuth();
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [method, setMethod] = useState('card'); // 'card' | 'upi'
  const [upi, setUpi] = useState('');
  const [error, setError] = useState('');
  const isFree = passType === 'General Pass';
  const PassIcon = passIcon[passType] || Ticket;

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExp = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

  const save = async () => {
    await setDoc(doc(db, 'registrations', user.uid), {
      uid: user.uid,
      passType,
      ...registrationData,
      registeredAt: serverTimestamp(),
      checkedInDay1: false,
      checkedInDay2: false,
      paymentStatus: isFree ? 'free' : 'paid',
    }, { merge: true });
    await refreshRegistration();
  };

  const handlePay = async () => {
    if (isFree) { setPaying(true); await save(); setPaid(true); setPaying(false); return; }
    if (method === 'card') {
      if (card.number.replace(/\s/g, '').length < 16) { setError('Enter a valid 16-digit card number.'); return; }
      if (card.expiry.length < 5) { setError('Enter a valid expiry date.'); return; }
      if (card.cvv.length < 3) { setError('Enter a valid CVV.'); return; }
      if (!card.name.trim()) { setError('Enter cardholder name.'); return; }
    } else {
      if (!upi.includes('@')) { setError('Enter a valid UPI ID (e.g. name@upi).'); return; }
    }
    setError(''); setPaying(true);
    // Simulate payment (replace with real gateway like Razorpay)
    await new Promise(r => setTimeout(r, 2000));
    await save(); setPaid(true); setPaying(false);
  };

  // ── Success screen ──
  if (paid) return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 space-y-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
        className="w-20 h-20 bg-black flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </motion.div>
      <div>
        <p className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-1">You're In!</p>
        <h3 className="text-3xl font-black uppercase tracking-tight">Registration<br />Complete</h3>
      </div>
      <div className="border-4 border-black p-4 bg-white text-left space-y-1">
        <p className="font-black uppercase tracking-widest text-xs text-gray-400">Pass Issued</p>
        <p className="font-black text-xl uppercase">{passType}</p>
        <p className="font-bold text-sm text-gray-500">{registrationData.name} · {registrationData.email}</p>
      </div>
      <button onClick={onSuccess}
        className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
        View My QR Pass →
      </button>
    </motion.div>
  );

  return (
    <motion.div key="payment" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} className="space-y-5">

      <button onClick={onBack} className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Order summary / Pass Selector */}
      <div className="border-4 border-black p-4 flex items-center gap-4 relative" style={{ background: '#f8f8f5' }}>
        <div className="w-12 h-12 border-4 border-black flex items-center justify-center flex-shrink-0 bg-white">
          <PassIcon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0 relative">
          <select value={passType} onChange={(e) => setPassType(e.target.value)}
            className="w-full font-black uppercase tracking-tight text-lg leading-tight bg-transparent focus:outline-none cursor-pointer pr-4">
            <option value="General Pass">General Pass</option>
            <option value="Event Pass">Event Pass</option>
            <option value="Premium Pass">Premium Pass</option>
          </select>
          <p className="font-bold text-xs text-gray-500 uppercase tracking-widest mt-1">Tap to change pass</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-black text-2xl">{passPrice[passType]}</p>
          {!isFree && <p className="font-bold text-xs text-gray-400 uppercase">incl. GST</p>}
        </div>
      </div>

      {isFree ? (
        <div className="border-4 border-black p-4 bg-green-50 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <p className="font-black text-sm uppercase tracking-widest text-green-700">No Payment Required</p>
        </div>
      ) : (
        <>
          {/* Method toggle */}
          <div className="grid grid-cols-2 gap-3">
            {['card', 'upi'].map((m) => (
              <button key={m} onClick={() => { setMethod(m); setError(''); }}
                className={`py-3 border-4 font-black uppercase tracking-widest text-xs transition-all
                  ${method === m ? 'border-black bg-black text-white' : 'border-black bg-white text-black hover:bg-gray-50'}`}>
                {m === 'card' ? '💳 Card' : '📱 UPI'}
              </button>
            ))}
          </div>

          {method === 'card' && (
            <div className="space-y-3">
              <Field id="pay-name" label="Cardholder Name" icon={User} type="text"
                placeholder="As on card" value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))} />
              <Field id="pay-card" label="Card Number" icon={CreditCard} type="text"
                placeholder="1234 5678 9012 3456" maxLength={19}
                value={card.number} onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))} />
              <div className="grid grid-cols-2 gap-3">
                <Field id="pay-exp" label="Expiry" icon={CreditCard} type="text"
                  placeholder="MM/YY" maxLength={5}
                  value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: formatExp(e.target.value) }))} />
                <Field id="pay-cvv" label="CVV" icon={Lock} type="password"
                  placeholder="•••" maxLength={4}
                  value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} />
              </div>
            </div>
          )}

          {method === 'upi' && (
            <Field id="pay-upi" label="UPI ID" icon={Zap} type="text"
              placeholder="yourname@upi" value={upi} onChange={e => setUpi(e.target.value)} />
          )}

          <div className="flex items-center gap-2 border-4 border-black p-3 bg-white">
            <Shield className="w-4 h-4 text-green-600 shrink-0" />
            <p className="font-bold text-xs text-gray-500">256-bit SSL secured · Your data is encrypted</p>
          </div>
        </>
      )}

      <ErrorMsg msg={error} />

      <button onClick={handlePay} disabled={paying}
        className="w-full flex items-center justify-center gap-3 py-5 border-4 border-black font-black uppercase tracking-[0.15em] text-sm bg-[#1f2022] text-white
          shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1
          transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed">
        {paying
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
          : isFree
            ? <>Confirm Registration <ArrowRight className="w-5 h-5" /></>
            : <>Pay {passPrice[passType]} <ArrowRight className="w-5 h-5" /></>
        }
      </button>

      {!isFree && (
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          Powered by Razorpay · Refunds within 7 days
        </p>
      )}
    </motion.div>
  );
};

// ── RegistrationForm ──────────────────────────────────────────────────────────
const RegistrationForm = ({ passType, onSuccess, isPaymentOnly = false, onClose }) => {
  const { user, refreshRegistration } = useAuth();
  const [step, setStep] = useState(isPaymentOnly ? 'payment' : 'role'); // 'role' | 'details' | 'payment'
  const [role, setRole] = useState(''); // 'student' | 'startup'
  const [error, setError] = useState('');
  const [localPass, setLocalPass] = useState(passType || 'General Pass');
  const [savingProfile, setSavingProfile] = useState(false);

  // Student fields
  const [student, setStudent] = useState({
    firstName: '', lastName: '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    location: '',
    college: '',
    year: '',
    department: '',
  });

  // Startup fields
  const [startup, setStartup] = useState({
    firstName: '', lastName: '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    companyName: '',
    location: '',
  });

  const setS = (field) => (e) => setStudent(f => ({ ...f, [field]: e.target.value }));
  const setSt = (field) => (e) => setStartup(f => ({ ...f, [field]: e.target.value }));

  const validateDetails = () => {
    if (role === 'student') {
      const { firstName, lastName, email, phone, location, college, year, department } = student;
      if (!firstName || !lastName || !email || !phone || !location || !college || !year || !department)
        return 'Please fill in all required fields.';
    } else {
      const { firstName, lastName, email, phone, companyName, location } = startup;
      if (!firstName || !lastName || !email || !phone || !companyName || !location)
        return 'Please fill in all required fields.';
    }
    return '';
  };

  const getRegistrationData = () => {
    if (role === 'student') {
      return {
        role: 'student',
        name: `${student.firstName} ${student.lastName}`,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        location: student.location,
        college: student.college,
        year: student.year,
        department: student.department,
      };
    }
    return {
      role: 'startup',
      name: `${startup.firstName} ${startup.lastName}`,
      firstName: startup.firstName,
      lastName: startup.lastName,
      email: startup.email,
      phone: startup.phone,
      companyName: startup.companyName,
      location: startup.location,
    };
  };

  const handleDetailsNext = async () => {
    const err = validateDetails();
    if (err) { setError(err); return; }
    setError('');
    setSavingProfile(true);
    
    try {
      await setDoc(doc(db, 'registrations', user.uid), {
        uid: user.uid,
        ...getRegistrationData(),
        registeredAt: serverTimestamp(),
        paymentStatus: 'pending',
        passType: 'None',
        checkedInDay1: false,
        checkedInDay2: false,
      }, { merge: true });
      await refreshRegistration();
      onSuccess();
    } catch(err) {
      setError('Failed to save profile. Please try again.');
    }
    setSavingProfile(false);
  };

  const strip = passStrip[localPass] || passStrip['General Pass'];

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }} />

      <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-50 w-full max-w-xl max-h-[90vh] flex flex-col border-4 border-black shadow-[14px_14px_0px_rgba(0,0,0,1)] bg-[#fffefa]">

        <div className="h-3 shrink-0" style={{ background: strip }} />

        <div className="p-6 md:p-8 overflow-y-auto">
          {/* Progress steps */}
          {!isPaymentOnly && (
            <div className="flex items-center gap-2 mb-8">
              {['Role', 'Details'].map((s, i) => {
                const stepMap = ['role', 'details'];
                const active = stepMap.indexOf(step) >= i;
                return (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-1.5 ${active ? 'text-black' : 'text-gray-300'}`}>
                      <div className={`w-6 h-6 border-2 flex items-center justify-center text-xs font-black transition-colors
                        ${step === stepMap[i] ? 'border-black bg-black text-white' : active ? 'border-black bg-white text-black' : 'border-gray-300 bg-white text-gray-300'}`}>
                        {i + 1}
                      </div>
                      <span className="font-black text-xs uppercase tracking-widest hidden sm:inline">{s}</span>
                    </div>
                    {i < 1 && <div className={`flex-1 h-[2px] ${active && stepMap.indexOf(step) > i ? 'bg-black' : 'bg-gray-200'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <div className="flex justify-between items-center mb-1">
            <p className="font-black uppercase tracking-[0.3em] text-xs text-gray-400">
              {isPaymentOnly ? `Claiming · ${localPass}` : 'Complete Profile'}
            </p>
            {onClose && (
              <button onClick={onClose} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: Role Selection ── */}
            {step === 'role' && (
              <motion.div key="role" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="space-y-6">
                <h2 className="text-3xl font-black uppercase tracking-tight border-b-4 border-black pb-5 mb-6">
                  Who are you?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Student card */}
                  <button onClick={() => setRole('student')}
                    className={`p-6 border-4 text-left transition-all duration-150 group
                      ${role === 'student'
                        ? 'border-black bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,0.3)]'
                        : 'border-black bg-white hover:bg-gray-50 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1'}`}>
                    <GraduationCap className={`w-8 h-8 mb-3 ${role === 'student' ? 'text-white' : 'text-black'}`} />
                    <p className="font-black uppercase tracking-tight text-lg">Student</p>
                    <p className={`font-bold text-xs mt-1 uppercase tracking-widest ${role === 'student' ? 'text-white/70' : 'text-gray-400'}`}>
                      College / University
                    </p>
                  </button>
                  {/* Startup owner card */}
                  <button onClick={() => setRole('startup')}
                    className={`p-6 border-4 text-left transition-all duration-150 group
                      ${role === 'startup'
                        ? 'border-black bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,0.3)]'
                        : 'border-black bg-white hover:bg-gray-50 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1'}`}>
                    <Briefcase className={`w-8 h-8 mb-3 ${role === 'startup' ? 'text-white' : 'text-black'}`} />
                    <p className="font-black uppercase tracking-tight text-lg">Startup Owner</p>
                    <p className={`font-bold text-xs mt-1 uppercase tracking-widest ${role === 'startup' ? 'text-white/70' : 'text-gray-400'}`}>
                      Founder / Co-founder
                    </p>
                  </button>
                </div>
                {!role && <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-widest">Select your role to continue</p>}
                {role && (
                  <button onClick={() => { setError(''); setStep('details'); }}
                    className="w-full flex items-center justify-center gap-3 py-4 border-4 border-black font-black uppercase tracking-[0.15em] text-sm bg-[#1f2022] text-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    Continue as {role === 'student' ? 'Student' : 'Startup Owner'} <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            )}

            {/* ── STEP 2: Details ── */}
            {step === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-5">
                <div className="flex items-center justify-between border-b-4 border-black pb-5 mb-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Your Details</h2>
                  <button onClick={() => { setStep('role'); setError(''); }}
                    className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                </div>

                {/* Common: First / Last name */}
                <div className="grid grid-cols-2 gap-3">
                  <Field id="reg-first" label="First Name" icon={User} type="text"
                    placeholder="Hemant" value={role === 'student' ? student.firstName : startup.firstName}
                    onChange={role === 'student' ? setS('firstName') : setSt('firstName')} required />
                  <Field id="reg-last" label="Last Name" icon={User} type="text"
                    placeholder="VS" value={role === 'student' ? student.lastName : startup.lastName}
                    onChange={role === 'student' ? setS('lastName') : setSt('lastName')} required />
                </div>
                <Field id="reg-email" label="Email" icon={Mail} type="email"
                  placeholder="you@example.com" value={role === 'student' ? student.email : startup.email}
                  onChange={role === 'student' ? setS('email') : setSt('email')} required />
                <Field id="reg-phone" label="Contact Number" icon={Phone} type="tel"
                  placeholder="+91 98765 43210" value={role === 'student' ? student.phone : startup.phone}
                  onChange={role === 'student' ? setS('phone') : setSt('phone')} required />
                <Field id="reg-location" label="Location (City)" icon={MapPin} type="text"
                  placeholder="e.g. Chennai" value={role === 'student' ? student.location : startup.location}
                  onChange={role === 'student' ? setS('location') : setSt('location')} required />

                {/* Student-specific */}
                {role === 'student' && (
                  <>
                    <Field id="reg-college" label="College / Institution" icon={Building2} type="text"
                      placeholder="e.g. Easwari Engineering College"
                      value={student.college} onChange={setS('college')} required />
                    <div className="grid grid-cols-2 gap-3">
                      <Select id="reg-year" label="Year" icon={GraduationCap}
                        value={student.year} onChange={setS('year')} required>
                        <option value="">Select Year</option>
                        <option>1st Year</option><option>2nd Year</option>
                        <option>3rd Year</option><option>4th Year</option>
                        <option>PG / MBA</option><option>Alumni / Other</option>
                      </Select>
                      <Field id="reg-dept" label="Department" icon={GraduationCap} type="text"
                        placeholder="e.g. CSE" value={student.department} onChange={setS('department')} required />
                    </div>
                  </>
                )}

                {/* Startup-specific */}
                {role === 'startup' && (
                  <Field id="reg-company" label="Startup Company Name" icon={Briefcase} type="text"
                    placeholder="e.g. TechNova Solutions"
                    value={startup.companyName} onChange={setSt('companyName')} required />
                )}

                <ErrorMsg msg={error} />

                <button onClick={handleDetailsNext} disabled={savingProfile}
                  className="w-full flex items-center justify-center gap-3 py-4 border-4 border-black font-black uppercase tracking-[0.15em] text-sm bg-[#1f2022] text-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50">
                  {savingProfile ? <><Loader2 className="w-5 h-5 animate-spin"/> Saving...</> : <>Save Profile <ArrowRight className="w-5 h-5" /></>}
                </button>
              </motion.div>
            )}

            {/* ── STEP 3: Payment ── */}
            {step === 'payment' && (
              <PaymentGateway
                passType={localPass}
                setPassType={setLocalPass}
                registrationData={{}} // Already saved in firestore, we just need to update passType
                onSuccess={onSuccess}
                onBack={onClose}
              />
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegistrationForm;
