import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, ChevronDown } from 'lucide-react';

export default function EventDateShowcase() {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const handleGoogleCalendar = (e) => {
    e.stopPropagation();
    const gCalUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Easwari+Startup+Peravai+2026&dates=20261030T033000Z/20261031T133000Z&details=Tamil+Nadu's+Biggest+Student+Startup+Summit.+2-Day+Mega+Conclave+at+Easwari+Engineering+College.&location=Easwari+Engineering+College%2C+Ramapuram%2C+Chennai";
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
    setShowCalendarMenu(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#calendar-dropdown-container')) {
        setShowCalendarMenu(false);
      }
    };
    if (showCalendarMenu) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showCalendarMenu]);

  return (
    <div className="mt-5 md:mt-7 w-full relative z-30 select-none">
      {/* ── Sleek Short Neo-Brutalist Event Date Bar (overflow-visible so dropdown is never clipped) ── */}
      <div className="relative border-4 border-black bg-[#fffcf4] shadow-[6px_6px_0px_#1f2022]">
        
        {/* Top Gradient Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#a80d11] via-[#d82221] 45%, #0b2140 55%, to-[#0f50e3]" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3.5 sm:gap-4 px-4 sm:px-6 md:px-8 py-3.5 md:py-4">
          
          {/* ── Left: Static 2-Day Tag & BOLD "TWO DAYS OF IMPACT" ── */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap justify-center md:justify-start">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#1f2022] text-white border-2 border-black shadow-[2px_2px_0px_#000] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              <span>2-Day Summit</span>
            </div>

            <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-[#1f2022] whitespace-nowrap">
              Two Days of Impact
            </span>
          </div>

          {/* ── Center: The Dates (30th & 31st October) ── */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Day 1 Pill */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-white border-2 border-black shadow-[3px_3px_0px_#a80d11]">
              <span className="px-1.5 py-0.5 bg-[#a80d11] text-white font-black text-[9px] uppercase tracking-wider">
                DAY 1
              </span>
              <span className="font-black text-lg sm:text-2xl text-[#1f2022] tracking-tight leading-none">
                30<span className="text-xs uppercase text-[#a80d11]">TH</span>
              </span>
            </div>

            <span className="font-black text-sm sm:text-base text-gray-400">&</span>

            {/* Day 2 Pill */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-white border-2 border-black shadow-[3px_3px_0px_#0f50e3]">
              <span className="px-1.5 py-0.5 bg-[#0b2140] text-white font-black text-[9px] uppercase tracking-wider">
                DAY 2
              </span>
              <span className="font-black text-lg sm:text-2xl text-[#1f2022] tracking-tight leading-none">
                31<span className="text-xs uppercase text-[#0f50e3]">ST</span>
              </span>
            </div>

            {/* Month & Year badge */}
            <div className="flex flex-col text-left pl-1">
              <span className="font-black text-base sm:text-xl uppercase tracking-wider text-[#1f2022] leading-none">
                OCTOBER
              </span>
              <span className="font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-500 leading-tight">
                2026 • CHENNAI
              </span>
            </div>
          </div>

          {/* ── Right: Save Date Button with Unclipped Google Calendar Dropdown ── */}
          <div className="shrink-0 relative" id="calendar-dropdown-container">
            <button
              type="button"
              onClick={() => setShowCalendarMenu(!showCalendarMenu)}
              className="px-3.5 py-2 bg-[#1f2022] hover:bg-black text-white border-2 border-black font-black uppercase tracking-[0.14em] text-[11px] sm:text-xs shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-yellow-400" />
              <span>Save Date</span>
              <ChevronDown className={`w-3 h-3 text-gray-300 transition-transform duration-200 ${showCalendarMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Calendar Dropdown (Google Calendar Alone) */}
            <AnimatePresence>
              {showCalendarMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 bottom-full mb-2 w-56 bg-[#fffcf4] border-3 border-black shadow-[5px_5px_0px_#000] p-1.5 z-50 text-left"
                >
                  <div className="px-2 py-1 mb-1 border-b border-black/10">
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Add To Calendar</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleCalendar}
                    className="w-full flex items-center justify-between p-2 text-xs font-black uppercase tracking-wider hover:bg-red-50 text-[#1f2022] hover:text-[#a80d11] transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 group-hover:scale-125 transition-transform"></span>
                      <span>Google Calendar</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#a80d11]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
