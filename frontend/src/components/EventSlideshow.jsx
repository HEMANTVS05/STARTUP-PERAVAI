import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, Volume2, VolumeX, Maximize2, X } from 'lucide-react';
import minister from "../assets/minister1.jpeg";
import team from "../assets/team1.jpeg";
import video1 from "../assets/video_1.mp4";
import msme from "../assets/MSME.jpeg";
import awards from "../assets/awards.jpeg";

const events = [
  {
    id: 1,
    title: (
      <>
        Minister Launches <br /> <span>Startup Peravai</span>
      </>
    ),
    description: "An impactful beginning marked by the honorable minister officially launching the Peravai, setting the stage for 2 days of innovation, networking, and growth for the startup ecosystem.",
    image: minister,
  },
  {
    id: 2,
    title: "Peravai Team",
    description: "The driving force behind Startup Peravai. A dedicated team of visionaries, organizers, and volunteers working tirelessly to build a thriving ecosystem for innovation and entrepreneurship in Tamil Nadu.",
    image: team,
  },
  {
    id: 3,
    title: "MSME Minister",
    description: "Peravai team with the Hon’ble MSME Minister and StartupTN Chairman on expanding Peravai’s vision, reach, and opportunities for young entrepreneurs across Tamil Nadu.",
    image: msme,
  },
  {
    id: 4,
    title: "Social Impact Startup Awards",
    description: "We believe technology is best utilised when it addresses challenges at the grassroots. At the Peravai, we aim to recognise and honour startups that are driving meaningful change and creating lasting impact in society.",
    image: awards,
  }
];

const videos = [
  {
    id: 1,
    src: video1,
    title: "Event Teaser"
  }
  // Easily add more videos here as needed
];

// Video Lightbox Modal
const VideoModal = ({ video, onClose }) => {
  const modalVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="relative w-full max-w-5xl bg-white border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
          initial={{ scale: 0.88, y: 40 }}
          animate={{ scale: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ scale: 0.88, y: 40, opacity: 0, transition: { duration: 0.3 } }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b-4 border-black bg-white z-10">
            <div className="flex items-center gap-3">
              <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-black">{video.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 border-2 border-black bg-white hover:bg-[#a80d11] hover:text-white transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 border-2 border-black bg-black text-white hover:bg-[#a80d11] hover:border-[#a80d11] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video */}
          <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
            <video
              ref={modalVideoRef}
              src={video.src}
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              controls
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const NeoVideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const openModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && <VideoModal video={video} onClose={() => setIsModalOpen(false)} />}
      <div
        className="relative w-full h-full bg-black border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer flex-shrink-0 snap-start flex flex-col"
        onClick={togglePlay}
      >
        {/* Always-visible top bar: title left, controls right */}
        <div
          className="relative z-10 flex items-center justify-between px-3 py-2 bg-black/70 border-b-2 border-white/10 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-white font-black uppercase tracking-wider text-xs sm:text-sm">{video.title}</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1.5 bg-white border-2 border-black text-black hover:bg-[#a80d11] hover:text-white transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={openModal}
              className="p-1.5 bg-black border-2 border-white text-white hover:bg-[#a80d11] hover:border-[#a80d11] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none"
              title="Watch in larger view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video fills remaining space */}
        <video
          ref={videoRef}
          src={video.src}
          className="w-full flex-1 min-h-0 object-contain bg-black"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 top-[36px] bg-black/40 flex items-center justify-center">
            <div className="w-14 h-14 bg-[#a80d11] border-4 border-black flex items-center justify-center text-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const EventSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % events.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + events.length) % events.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 1 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
  };

  const event = events[current];

  return (
    <div className="w-full py-6 md:py-8 my-10 md:my-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 px-4 sm:px-6 lg:px-24 gap-4">
        <div>
          <p className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Featured Highlights</p>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-black tracking-tighter leading-none">
            Event<br /><span className="text-[#a80d11]">Highlights</span>
          </h2>
        </div>

        {/* Navigation Arrows for Slideshow */}
        <div className="flex gap-2 md:gap-4 pb-2 z-10">
          <button
            onClick={prev}
            className="w-10 h-10 md:w-14 md:h-14 border-4 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 md:w-14 md:h-14 border-4 border-black bg-black text-white hover:bg-[#a80d11] hover:border-[#a80d11] flex items-center justify-center transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-24 flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* Main Slideshow Container */}
        <div className="relative w-full lg:w-[65%] xl:w-[70%] aspect-[4/5] sm:aspect-[4/3] md:aspect-[21/9] lg:h-[650px] bg-gray-200 overflow-hidden border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] group flex-shrink-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              {event.image ? (
                <img
                  src={event.image}
                  alt={typeof event.title === 'string' ? event.title : 'Event Highlight'}
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ objectPosition: 'center top' }}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="w-full h-full opacity-30"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #e5e7eb 0, #e5e7eb 1px, transparent 0, transparent 50%)',
                      backgroundSize: '20px 20px'
                    }}
                  />
                  <p className="absolute font-black text-4xl text-gray-300 uppercase tracking-widest text-center px-4">Image Coming Soon</p>
                </div>
              )}

              {/* Overlay gradient at bottom to ensure text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Title and Description Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 text-white flex flex-col justify-end">
                <h3 className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-3 sm:mb-5 drop-shadow-md">
                  {event.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-200 font-bold max-w-3xl leading-relaxed uppercase tracking-wider drop-shadow-md">
                  {event.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Video Reels Section */}
        {videos.length > 0 && (
          <div
            className="w-full lg:w-[35%] xl:w-[30%] flex flex-row lg:flex-col gap-6 lg:h-[650px] overflow-x-auto lg:overflow-y-auto snap-x lg:snap-y snap-mandatory lg:pb-0 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            {videos.map(video => (
              // Mobile: same aspect ratio as the slideshow. Desktop: full height of the reel column
              <div
                key={video.id}
                className="w-full h-[520px] sm:h-[480px] md:h-[420px] lg:aspect-auto lg:w-full lg:h-full flex-shrink-0 snap-start"
              >
                <NeoVideoPlayer video={video} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default EventSlideshow;

