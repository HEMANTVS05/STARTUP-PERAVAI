import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, MapPin } from 'lucide-react';

const VisitorDetailsModal = ({ isOpen, onClose, onGetPass, hasPass }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl min-h-[80vh] max-h-[90vh] flex flex-col bg-[#f5e9c8] rounded-2xl shadow-2xl overflow-hidden border border-black/10"
        >
          {/* Header */}
          <div className="bg-[#a80d11] p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tight">Visitor's Pass Details</h2>
            <p className="text-white/80 text-sm font-medium mt-1">Step into the heart of Innovation and Entrepreneurship</p>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <p className="text-xl text-black/90 leading-relaxed font-medium mb-8" style={{ textAlign: 'justify' }}>
              <i><span style={{ color: '#a80d11', fontWeight: 'bold' }}>Peravai</span> <b>is a vibrant space where ideas, people, and possibilities come together to create meaningful impact. With a visitor pass, you can explore diverse perspectives, experience inspiring conversations, and witness collaboration in action. More than being just an event, it is an experience that celebrates innovation, ambition, and the power of collective progress.</b></i>
            </p>

            <div className="space-y-4 pr-2">
              <div className="mt-2 mb-4">
                <h3 className="text-xl font-black uppercase text-black tracking-widest border-b-2 border-black/10 pb-2">Pavilions</h3>
              </div>
              <div className="bg-white/50 rounded-xl p-6 border border-black/10 flex flex-col gap-8 shadow-sm">

                <div>
                  <h3 className="text-lg text-[#a80d11] font-black uppercase mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#a80d11]" />
                    TN RISE
                  </h3>
                  <p className="text-black/100 font-medium text-sm leading-relaxed pl-6 border-l-2 border-[#a80d11]/20">A Tamil Nadu initiative focused on advancing women’s entrepreneurship and enabling women-led businesses to access networks, mentorship, markets and growth opportunities. It works towards building a stronger ecosystem for women entrepreneurs across the state.</p>
                </div>

                <div>
                  <h3 className="text-lg text-[#a80d11] font-black uppercase mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#a80d11]" />
                    JETRO
                  </h3>
                  <p className="text-black/80 font-medium text-sm leading-relaxed pl-6 border-l-2 border-[#a80d11]/20">The Japan External Trade Organization supports international business by promoting trade, investment and collaboration between Japan and global markets. It also supports startups, innovation and overseas business expansion.</p>
                </div>

                <div>
                  <h3 className="text-lg text-[#a80d11] font-black uppercase mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#a80d11]" />
                    ICC
                  </h3>
                  <p className="text-black/80 font-medium text-sm leading-relaxed pl-6 border-l-2 border-[#a80d11]/20">The Indian Chamber of Commerce is a leading business organization that promotes trade, investment, entrepreneurship and economic growth. It connects businesses through B2B matchmaking, international delegations, industry initiatives and networking.</p>
                </div>

                <div>
                  <h3 className="text-lg text-[#a80d11] font-black uppercase mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#a80d11]" />
                    iTNT
                  </h3>
                  <p className="text-black/80 font-medium text-sm leading-relaxed pl-6 border-l-2 border-[#a80d11]/20">Tamil Nadu Technology (iTNT) Hub is a DeepTech and Emerging Tech innovation ecosystem connecting startups, researchers, academia, investors, industry and government. It supports innovation through incubation, acceleration, technology transfer and industry collaboration.</p>
                </div>

                <div>
                  <h3 className="text-lg text-[#a80d11] font-black uppercase mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#a80d11]" />
                    TN WeSafe
                  </h3>
                  <p className="text-black/80 font-medium text-sm leading-relaxed pl-6 border-l-2 border-[#a80d11]/20">Tamil Nadu Women Employment & Safety is a government initiative focused on strengthening women’s workforce participation and access to employment opportunities. It works across employment, entrepreneurship, skilling, safety and enabling services for women.</p>
                </div>

                <div>
                  <h3 className="text-lg text-[#a80d11] font-black uppercase mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#a80d11]" />
                    Overqualified Housewives
                  </h3>
                  <p className="text-black/80 font-medium text-sm leading-relaxed pl-6 border-l-2 border-[#a80d11]/20">A platform focused on promoting financial independence and skill monetisation among Indian women, particularly through flexible and work-from-home opportunities. It connects skilled women with trusted employment opportunities and businesses.</p>
                </div>

              </div>

              <div className="mt-8 mb-4">
                <h3 className="text-xl font-black uppercase text-black tracking-widest border-b-2 border-black/10 pb-2"></h3>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-black/5 hover:border-[#a80d11]/30 transition-colors">
                <h3 className="text-lg text-[#a80d11] font-black uppercase mb-1 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#a80d11]" />
                  Stall Expo
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
                  <MapPin size={14} className="text-gray-400" /> Venue: Open Air Theatre
                </div>
                <p className="text-black/80 font-medium text-sm leading-relaxed">Experience a grand two-day startup expo featuring 120+ startups from across Tamil Nadu, bringing together breakthrough ideas, innovative products and ambitious founders under one roof.</p>
              </div>

              <div className="bg-white/50 rounded-xl p-4 border border-black/5 hover:border-[#a80d11]/30 transition-colors">
                <h3 className="text-lg text-[#a80d11] font-black uppercase mb-1 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#a80d11]" />
                  Student Project Expo
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
                  <MapPin size={14} className="text-gray-400" /> Venue: Idea lab first Floor
                </div>
                <p className="text-black/80 font-medium text-sm leading-relaxed">A grand showcase featuring groundbreaking student projects, innovative prototypes and emerging startups from Easwari Engineering College, bringing together the brightest ideas and solutions developed by the institution’s young innovators.</p>
              </div>

              <div className="bg-white/50 rounded-xl p-4 border border-black/5 hover:border-[#a80d11]/30 transition-colors">
                <h3 className="text-lg text-[#a80d11] font-black uppercase mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#a80d11]" />
                  Global Excellence centre visit
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
                  <MapPin size={14} className="text-gray-400" /> Venue: ABB Robotics Lab
                </div>
                <p className="text-black/80 font-medium text-sm leading-relaxed">Get an exclusive opportunity to visit the ABB Robotics Global Excellence Center, where cutting-edge robotics, automation and industrial technologies come together. Experience advanced robotic solutions firsthand.</p>
              </div>

              <div className="bg-white/50 rounded-xl p-4 border border-black/5 hover:border-[#a80d11]/30 transition-colors">
                <h3 className="text-lg text-[#a80d11] font-black uppercase mb-1 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#a80d11]" />
                  Startup Dating
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
                  <MapPin size={14} className="text-gray-400" /> Venue: Hi-Tech Hall 1
                </div>
                <p className="text-black/80 font-medium text-sm leading-relaxed">A networking space bringing together investors, walk-in guests, government officials, international organizations, startup ecosystems and passionate startup enthusiasts under one roof. <br />
                  Connect with the right people, exchange ideas, explore collaborations and discover opportunities that can turn conversations into partnerships, investments and lasting impact !
                </p>
              </div>

            </div>


            <div className="mt-auto pt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={hasPass ? onClose : onGetPass}
                className={`text-white border-2 border-black/10 px-6 md:px-8 py-3 rounded-md font-black uppercase text-xs md:text-sm tracking-[0.15em] shadow-[3px_3px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.2)] hover:translate-y-[2px] transition-all ${
                  hasPass ? 'bg-green-700 hover:bg-green-800' : 'bg-black hover:bg-gray-800'
                }`}
              >
                {hasPass ? 'YOUR PASS' : 'GET YOUR PASS'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VisitorDetailsModal;
