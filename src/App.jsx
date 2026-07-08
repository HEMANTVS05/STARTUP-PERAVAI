import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroAnimation from './components/IntroAnimation';
import MainLayout from './components/MainLayout';
import { Rocket } from 'lucide-react';

function App() {
  const [phase, setPhase] = useState('intro'); // 'intro', 'rumble', 'fog', 'flying', 'main'

  // Calculate initial coordinates synchronously to avoid sliding from default center position
  const [coords, setCoords] = useState(() => {
    if (typeof window !== 'undefined') {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      return {
        startX: vw * 0.61,
        startY: vh * 0.41,
        endX: vw * 0.26,
        endY: vh * 0.13
      };
    }
    return { startX: '50vw', startY: '50vh', endX: '26vw', endY: '13vh' };
  });

  useEffect(() => {
    const updateCoords = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      setCoords({
        startX: vw * 0.61,
        startY: vh * 0.41,
        endX: vw * 0.26,
        endY: vh * 0.13
      });
    };
    updateCoords();
    window.addEventListener('resize', updateCoords);

    // 0.5s: Start engine rumble & play sound
    const rumbleTimer = setTimeout(() => {
      setPhase('rumble');
      // Play launch sound
      const audio = new Audio('https://actions.google.com/sounds/v1/water/air_release.ogg');
      audio.volume = 0.5;
      audio.play().catch(() => console.log('Audio autoplay blocked'));
    }, 500);

    // 2.5s: Fog bursts out
    const fogTimer = setTimeout(() => {
      setPhase('fog');
    }, 2000);

    // 3.5s: Rocket leaves the text and flies to the main layout
    const flyTimer = setTimeout(() => {
      setPhase('flying');
    }, 3500);

    // 7.5s: Flight finishes
    const mainTimer = setTimeout(() => {
      setPhase('main');
    }, 7500);

    return () => {
      clearTimeout(rumbleTimer);
      clearTimeout(fogTimer);
      clearTimeout(flyTimer);
      clearTimeout(mainTimer);
      window.removeEventListener('resize', updateCoords);
    };
  }, []);

  return (
    <div className={`relative w-full min-h-screen bg-grid-pattern overflow-x-hidden ${phase !== 'main' ? 'overflow-y-hidden h-screen' : ''}`}>

      {/* Intro Flyer Animation (The Landing Page) */}
      <AnimatePresence>
        {phase !== 'main' && phase !== 'flying' && (
          <IntroAnimation phase={phase} />
        )}
      </AnimatePresence>

      {/* Main Website Layout */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: (phase === 'main' || phase === 'flying') ? 1 : 0, y: (phase === 'main' || phase === 'flying') ? 0 : 50 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
        className="relative z-10"
      >
        <MainLayout />
      </motion.div>

      {/* SINGLE PERSISTENT GLOBAL ROCKET */}
      <motion.div
        className="absolute inset-0 z-50 pointer-events-none"
      >
        <motion.div
          initial={{ top: coords.startY || '50vh', left: coords.startX || '50vw', rotate: 0, scale: 0.8 }}
          animate={
            (phase === 'intro' || phase === 'fog')
              ? { top: coords.startY, left: coords.startX, rotate: 0, scale: 0.8 }
              : phase === 'rumble'
                ? {
                  top: coords.startY, left: coords.startX, rotate: 0, scale: 0.8,
                  x: ['-50%', '-53%', '-47%', '-50%', '-48%', '-52%', '-50%'],
                  y: ['-50%', '-47%', '-53%', '-48%', '-52%', '-49%', '-50%']
                }
                : { top: coords.endY, left: coords.endX, rotate: 0, scale: 1.5 } // Flies to main page, points perfectly up/right!
          }
          transition={
            phase === 'rumble'
              ? { x: { repeat: Infinity, duration: 0.1 }, y: { repeat: Infinity, duration: 0.1 } }
              : { duration: 3.0, ease: [0.3, 0.0, 0.2, 1] }
          }
          className="absolute flex flex-col items-center justify-center"
          style={{ x: '-50%', y: '-40%' }}
        >
          <Rocket className={`w-10 h-10 md:w-14 md:h-14 relative z-10 transition-colors duration-[1500ms] ${phase === 'main' || phase === 'flying' ? 'text-[#1f2022]' : 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)]'}`} />
        </motion.div>
      </motion.div>

    </div>
  );
}

export default App;
