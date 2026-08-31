import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

const VisitorDetailsModal = ({ isOpen, onClose }) => {
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
          className="relative w-full max-w-lg bg-[#f5e9c8] rounded-2xl shadow-2xl overflow-hidden border border-black/10"
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
          <div className="p-6 md:p-8">
            <p className="text-black/90 leading-relaxed font-medium mb-6 " style={{ textAlign: 'justify' }}>
              <i><span style={{ color: '#a80d11', fontWeight: 'bold' }}>Peravai</span> <b>is a vibrant space where ideas, people, and possibilities come together to create meaningful impact. With a visitor pass, you can explore diverse perspectives, experience inspiring conversations, and witness collaboration in action. More than being just an event, it is an experience that celebrates innovation, ambition, and the power of collective progress.</b></i>
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#a80d11] mt-0.5 shrink-0" size={20} />
                <span className="text-black/90 font-bold">Access the Incubation Pavilions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#a80d11] mt-0.5 shrink-0" size={20} />
                <span className="text-black/90 font-bold">Visit the Startup Exhibition</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#a80d11] mt-0.5 shrink-0" size={20} />
                <span className="text-black/90 font-bold">Experience Student Innovation</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#a80d11] mt-0.5 shrink-0" size={20} />
                <span className="text-black/90 font-bold">Explore the Global Excellence Centres</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#a80d11] mt-0.5 shrink-0" size={20} />
                <span className="text-black/90 font-bold">Network at Startup Dating</span>
              </li>
            </ul>

            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="bg-black text-white px-6 py-2.5 rounded-md font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors"
              >
                GOT IT
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VisitorDetailsModal;
