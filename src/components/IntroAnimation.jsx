import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroAnimation = ({ phase }) => {
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      {/* Full-screen Flyer Banner — covers entire viewport */}
      <motion.div
        className="absolute inset-0 z-10"
        animate={{
          scale: (phase === 'flying' || phase === 'fog') ? 1.04 : 1,
          filter: (phase === 'flying' || phase === 'fog') ? 'blur(10px)' : 'blur(0px)'
        }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
      >
        <img
          src="/flyer-banner.png"
          alt="Startup Event Flyer"
          className="w-full h-full object-fill"
        />
      </motion.div>

      {/*
        Rocket anchor: positioned at the rocket cutout in the banner.
        left: 75% and top: 55% targets the rocket icon visible in the banner.
        Adjust these % values if the rocket doesn't align perfectly after first load.
      */}
      <div className="absolute z-20" style={{ left: '61%', top: '41%' }}>

        {/* Realistic Rocket Launch Fog — billows directly below the rocket */}
        <AnimatePresence>
          {(phase === 'fog' || phase === 'rumble') && (
            <>
              {/* Core dense fog cloud — right below the rocket nozzle */}
              <motion.div
                className="absolute rounded-full bg-white blur-2xl"
                style={{ x: '-50%', top: '10px' }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: '300px', height: '200px', opacity: 1 }}
                exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.4 } }}
                transition={{ duration: 1.2, delay: 1.0, ease: [0.2, 0, 0.4, 1] }}
              />
              {/* Left billow */}
              <motion.div
                className="absolute rounded-full bg-white blur-3xl"
                style={{ x: '-140%', top: '60px' }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: '280px', height: '180px', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, delay: 1.1, ease: [0.2, 0, 0.4, 1] }}
              />
              {/* Right billow */}
              <motion.div
                className="absolute rounded-full bg-white blur-3xl"
                style={{ x: '50%', top: '60px' }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: '280px', height: '180px', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, delay: 1.15, ease: [0.2, 0, 0.4, 1] }}
              />
              {/* Wide base spread — the ground-level fog plume */}
              <motion.div
                className="absolute rounded-full bg-white blur-[40px]"
                style={{ x: '-50%', top: '120px' }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: '600px', height: '260px', opacity: 0.95 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, delay: 1.2, ease: [0.2, 0, 0.4, 1] }}
              />
              {/* Outermost haze layer */}
              <motion.div
                className="absolute rounded-full bg-white/70 blur-[80px]"
                style={{ x: '-50%', top: '180px' }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: '900px', height: '300px', opacity: 0.85 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, delay: 1.3, ease: [0.2, 0, 0.4, 1] }}
              />
              {/* Super wide atmospheric base — fills the whole bottom area */}
              <motion.div
                className="absolute rounded-full bg-white/50 blur-[100px]"
                style={{ x: '-50%', top: '250px' }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: '1400px', height: '400px', opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.0, delay: 1.4, ease: [0.2, 0, 0.4, 1] }}
              />
            </>
          )}
        </AnimatePresence>

        {/* The rocket is rendered entirely in App.jsx to prevent crossfade ghosting */}
      </div>
    </motion.div>
  );
};

export default IntroAnimation;
