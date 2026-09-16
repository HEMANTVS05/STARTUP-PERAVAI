import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Users, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EventRegistrationModal from './EventRegistrationModal';
import HackathonModal from './HackathonModal';

const GROUP_EVENTS = [
  { id: 'hackathon', name: 'Hackathon', price: 'Rs 1200', limit: '3-5 members', desc: 'hemaaaaaaa solraaaa', venue: 'TRP', day: 'Both Days' },
  { id: 'shark-tank', name: 'Sharktank', price: 'Rs 700', limit: 'Limit 5', desc: 'hemaaaaaaa solraaaa', venue: 'GEETHAM', day: 'Day 1 & 2' },
  { id: 'phoenix-protocol', name: 'Phoenix Protocol', price: 'Rs 500', limit: 'Limit 3', desc: 'hemaaaaaaa solraaaa', venue: 'TRP', day: 'Day 2' },
  { id: 'junk-to-genius', name: 'Junk to Genius', price: 'Rs 500', limit: 'Limit 3', desc: 'hemaaaaaaa solraaaa', venue: 'MBA Seminar Hall 1', day: 'Both Days' },
];

const INDIVIDUAL_EVENTS = [
  { id: 'live-podcast', name: 'Live Podcast', price: 'Rs 150', limit: 'Individual', desc: 'hemaaaaaaa solraaaa', venue: 'GEETHAM', day: 'Both Days' },
  { id: 'panel-discussions', name: 'Panel Discussion', price: 'Rs 150', limit: 'Individual', desc: 'hemaaaaaaa solraaaa', venue: 'GEETHAM', day: 'Day 1' },
  { id: 'illogical-marketing', name: 'Illogical Marketing', price: 'Rs 150', limit: 'Individual', desc: 'hemaaaaaaa solraaaa', venue: 'Hi-Tech Hall 2', day: 'Day 1' },
  { id: 'bootcamp', name: 'Bootcamp', price: 'Rs 300', limit: 'Individual', desc: 'hemaaaaaaa solraaaa', venue: 'MBA Seminar Hall 2', day: 'Both Days' },
];

const EventsPage = () => {
  const navigate = useNavigate();
  const { user, registration } = useAuth();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  const handleRegisterClick = (event) => {
    // Must be logged in with a completed registration and a paid Event Pass
    const hasEventPass = registration &&
      registration.paymentStatus !== 'pending' &&
      registration.passType !== 'None' &&
      registration.passType !== "Visitor's Pass";

    if (!hasEventPass) {
      setShowPaymentAlert(true);
      setTimeout(() => setShowPaymentAlert(false), 4000);
      return;
    }

    setSelectedEvent(event);
  };

  const closeModals = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="w-full min-h-screen pb-24 md:pb-32 px-4 sm:px-6 lg:px-24 pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex items-center gap-6 mb-12"
      >
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-white/50 hover:bg-white rounded-full shadow-sm transition-all border border-black/10"
        >
          <ArrowLeft size={24} className="text-black/80" />
        </button>
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black leading-none">
            Event <span style={{ background: 'linear-gradient(to right, #0b2140, #0f50e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Catalog</span>
          </h1>
          <p className="font-bold text-black/60 uppercase tracking-[0.2em] text-xs mt-2">Explore & Register for Sessions</p>
        </div>
      </motion.div>

      {/* Payment Alert */}
      {showPaymentAlert && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-center gap-3 shadow-md rounded-r-md"
        >
          <AlertCircle className="text-red-500" />
          <p className="text-red-700 font-bold text-sm">You must purchase the Event Pass before registering for individual events!</p>
        </motion.div>
      )}

      {/* Group Events */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-black/10 pb-4">
          <Users className="text-[#0b2140]" size={28} />
          <h2 className="text-3xl font-black uppercase tracking-tight text-black/90">Group Events</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {GROUP_EVENTS.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="bg-white/60 backdrop-blur-md rounded-2xl border border-black/10 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black uppercase tracking-tight leading-tight">{evt.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider">{evt.limit}</span>
                </div>
                <p className="text-sm font-medium text-black/70 leading-snug mb-6">{evt.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/10">
                <p className="font-black text-lg text-black">{evt.price}</p>
                <button
                  onClick={() => handleRegisterClick(evt)}
                  className="bg-black text-white px-5 py-2 rounded-md font-black uppercase text-[11px] tracking-widest hover:bg-gray-800 transition-colors shadow-[3px_3px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.2)] hover:translate-y-[2px]"
                >
                  REGISTER
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Individual Events */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-black/10 pb-4">
          <User className="text-[#a80d11]" size={28} />
          <h2 className="text-3xl font-black uppercase tracking-tight text-black/90">Individual Events</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {INDIVIDUAL_EVENTS.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-white/60 backdrop-blur-md rounded-2xl border border-black/10 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black uppercase tracking-tight leading-tight">{evt.name}</h3>
                </div>
                <p className="text-sm font-medium text-black/70 leading-snug mb-6">{evt.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/10">
                <p className="font-black text-lg text-black">{evt.price}</p>
                <button
                  onClick={() => handleRegisterClick(evt)}
                  className="bg-[#a80d11] text-white px-5 py-2 rounded-md font-black uppercase text-[11px] tracking-widest hover:bg-[#8B0000] transition-colors shadow-[3px_3px_0px_rgba(168,13,17,0.3)] hover:shadow-[1px_1px_0px_rgba(168,13,17,0.3)] hover:translate-y-[2px]"
                >
                  REGISTER
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedEvent?.id === 'hackathon' && (
        <HackathonModal isOpen={true} onClose={closeModals} />
      )}

      {selectedEvent && selectedEvent?.id !== 'hackathon' && (
        <EventRegistrationModal
          event={selectedEvent}
          onClose={closeModals}
        />
      )}
    </div>
  );
};

export default EventsPage;
