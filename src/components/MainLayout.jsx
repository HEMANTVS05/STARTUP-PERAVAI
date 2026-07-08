import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import EventSlideshow from './EventSlideshow';

const EventCard = ({ title, date, color, textColor, border, rotate }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: 0 }}
    className={`p-8 ${color} ${textColor} ${border} noise-bg flex flex-col justify-between h-64 transform ${rotate} cursor-pointer transition-all duration-300 shadow-[10px_10px_0px_rgba(0,0,0,1)] hover:shadow-[15px_15px_0px_rgba(0,0,0,1)]`}
  >
    <div>
      <h4 className="text-3xl font-black uppercase mb-2 leading-tight">{title}</h4>
      <p className="font-bold opacity-80 uppercase tracking-widest">{date}</p>
    </div>
    <div className="flex justify-between items-end">
      <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
        <Star className="w-6 h-6" fill="currentColor" />
      </div>
      <span className="font-black text-xl uppercase underline decoration-4 underline-offset-4">Join Now</span>
    </div>
  </motion.div>
);

const MainLayout = () => {
  return (
    <div className="w-full min-h-screen pt-12 pb-32 px-6 lg:px-24">

      {/* Header / Navbar */}
      <nav className="flex justify-between items-center mb-24 border-b-4 border-black pb-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase text-blue-600 tracking-tighter">
          Startup<br />Peravai.
        </h1>
        <div className="hidden lg:flex gap-12 text-sm font-black text-gray-500 uppercase tracking-widest">
          <a href="#" className="hover:text-black transition-colors">Insights</a>
          <a href="#" className="hover:text-black transition-colors">Events</a>
          <a href="#" className="hover:text-black transition-colors">Speakers</a>
          <a href="#" className="hover:text-black transition-colors">Mission</a>
        </div>
      </nav>

      {/* Hero Headline */}
      <div className="text-center mb-32 relative z-10">
        <h2 className="text-[#1f2022] text-[5rem] md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85]">
          HEMA ilana. <br /> EDHUVUMEY ila.
        </h2>
      </div>

      {/* Events Slideshow — replaces shapes section */}
      <EventSlideshow />

      {/* Events Template Section */}
      <div className="mt-48 relative z-10">
        <div className="flex justify-between items-end mb-16 border-b-8 border-black pb-8">
          <h2 className="text-6xl md:text-8xl font-black uppercase text-black tracking-tighter leading-none">
            Upcoming <br /> <span className="text-blue-600">Events.</span>
          </h2>
          <p className="text-2xl font-bold uppercase tracking-widest text-gray-500 hidden md:block">Scroll for more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
          <EventCard
            title="Pitch Fest 2026"
            date="Oct 15 - 10:00 AM"
            color="bg-blue-600"
            textColor="text-white"
            border="border-0"
            rotate="-rotate-2"
          />
          <EventCard
            title="Investor Meetup"
            date="Oct 16 - 02:00 PM"
            color="bg-[#1f2022]"
            textColor="text-white"
            border="border-0"
            rotate="rotate-3"
          />
          <EventCard
            title="Startup Hackathon"
            date="Oct 17 - 09:00 AM"
            color="bg-transparent"
            textColor="text-black"
            border="border-8 border-black"
            rotate="-rotate-1"
          />
          <EventCard
            title="Networking Gala"
            date="Oct 18 - 07:00 PM"
            color="bg-yellow-400"
            textColor="text-black"
            border="border-0"
            rotate="rotate-2"
          />
        </div>
      </div>

    </div>
  );
};

export default MainLayout;
