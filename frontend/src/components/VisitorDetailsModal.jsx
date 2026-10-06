import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Rocket, Lightbulb, Cpu, Users, ShieldCheck, Briefcase, Coins, Zap, Building, MessageSquare, Target, Globe2, Leaf, Sparkles } from 'lucide-react';
import { Ticket } from "lucide-react";

const visitorFeatures = [
  {
    title: "GOVERNMENT & STARTUP ECOSYSTEM PAVILIONS",
    icon: Building2,
    description: "Gain direct access to leading government institutions, startup ecosystem organisations, international trade bodies and industry partners. Explore government schemes, funding avenues, incubation support, business resources, market opportunities and expert guidance to help you start, build and scale your venture."
  },
  {
    title: "STARTUP EXPO",
    icon: Rocket,
    description: "Experience a grand two-day Startup Expo featuring innovative startups from across Tamil Nadu. Discover emerging products, technologies and business ideas while exploring opportunities for collaboration, partnerships, investment and market expansion."
  },
  {
    title: "STUDENT PROJECT EXPO",
    icon: Lightbulb,
    description: "Discover flagship student projects and innovations developed by emerging engineers, creators and entrepreneurs. Explore technology-driven solutions across diverse domains and witness the ideas shaping the next generation of innovation."
  },
  {
    title: "GLOBAL EXCELLENCE CENTRE VISITS",
    icon: Cpu,
    description: "Step into the future of technology through exclusive visits to Global Excellence Centres, featuring industry-grade infrastructure and advanced capabilities across AI, Robotics, IoT, Embedded Systems, Semiconductors, Automotive, Automation, Machine Learning and Advanced Computing, with an ecosystem powered by leading global technology and engineering companies."
  },
  {
    title: "STARTUP DATING",
    icon: Users,
    description: "Step into dedicated B2B matchmaking and networking spaces designed to bring startups, investors, corporates, mentors and industry professionals together for meaningful business conversations, collaborations and partnerships."
  },
  {
    title: "IP CLINIC",
    icon: ShieldCheck,
    description: "Give your innovation the protection it deserves. Receive free expert consultation from IPR professionals and legal experts on patents, trademarks, copyrights and other forms of intellectual property protection to safeguard your ideas and innovations."
  },
  {
    title: "BUSINESS CONSULTING CLINICS",
    icon: Briefcase,
    description: "Access free consultations with leading business consulting firms from Tamil Nadu and gain practical insights into strategy, operations, finance, marketing, fundraising, growth and other critical aspects of building a successful venture."
  },
  {
    title: "INVESTOR & FUNDING OPPORTUNITIES",
    icon: Coins,
    description: "Explore the funding landscape through interactions with angel investors, venture capital firms, financial institutions and startup funding platforms. Understand different capital options and identify pathways suited to your venture."
  },
  {
    title: "TECHNOLOGY & INNOVATION SHOWCASE",
    icon: Zap,
    description: "Experience the latest developments in AI, DeepTech, emerging technologies, digital solutions and advanced engineering, while discovering innovations from technology companies, startups and industry experts."
  },
  {
    title: "CORPORATE & INDUSTRY OPPORTUNITIES",
    icon: Building,
    description: "Explore opportunities with leading companies and industry leaders across strategic partnerships, pilot programmes, procurement, business collaborations, market access and potential customer opportunities."
  },
  {
    title: "FOUNDER & MENTOR INTERACTIONS",
    icon: MessageSquare,
    description: "Hear directly from experienced founders, entrepreneurs, CXOs and industry experts. Gain practical insights, mentorship and real-world perspectives on building, growing and scaling a business."
  },
  {
    title: "PLACEMENT & CAREER OPPORTUNITIES",
    icon: Target,
    description: "Discover career pathways within the startup ecosystem through direct interactions with founders, startups and growing companies. Explore opportunities for placements, internships, live projects and future employment."
  },
  {
    title: "GLOBAL & INTERNATIONAL OPPORTUNITIES",
    icon: Globe2,
    description: "Discover pathways to international markets through global organisations, trade bodies, chambers, diplomatic missions and international ecosystem partners, opening doors to cross-border collaboration and global expansion."
  },
  {
    title: "SOCIAL IMPACT & ENTREPRENEURSHIP",
    icon: Leaf,
    description: "Explore initiatives focused on women entrepreneurship, rural innovation, sustainability, climate action and social impact, and discover opportunities to transform innovative ideas into meaningful and sustainable businesses."
  }
];

const VisitorDetailsModal = ({ isOpen, onClose, onGetPass, onShowPass, hasPass }) => {
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
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl h-[85vh] flex flex-col bg-[#f6f4ee] shadow-[12px_12px_0px_rgba(0,0,0,1)] overflow-hidden border-4 border-black"
        >
          {/* Header */}
          <div className="relative z-10 p-5 md:p-6 bg-[#a80d11] border-b-4 border-black flex items-center justify-between shrink-0">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="bg-white p-2 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <Ticket className="w-6 h-6 text-[#171717]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Visitor Pass Details</h2>
              </motion.div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              <X size={20} className="stroke-[3]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar relative bg-white">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-black leading-relaxed font-bold mb-10 border-l-4 border-[#a80d11] pl-6 py-2"
              style={{ textAlign: 'justify' }}
            >
              <span className="text-[#a80d11] font-black uppercase tracking-wide">Peravai</span> <span className="font-medium">is a vibrant space where ideas, people, and possibilities come together to create meaningful impact. With a visitor pass, you can explore diverse perspectives, experience inspiring conversations, and witness collaboration in action. More than being just an event, it is an experience that celebrates innovation, ambition, and the power of collective progress.</span>
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pb-4">
              {visitorFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                    className="group relative bg-[#f6f4ee] p-6 md:p-8 border-2 border-black transition-all hover:bg-[#fff9e6]"
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] text-[#a80d11] group-hover:scale-110 transition-transform">
                          <Icon size={24} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-black leading-tight">
                          {feature.title}
                        </h3>
                      </div>

                      <p className="text-gray-800 font-medium text-sm md:text-base leading-relaxed flex-1 mt-2">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 bg-[#f6f4ee] border-t-4 border-black shrink-0 relative z-20 flex justify-end">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={hasPass ? onShowPass : onGetPass}
              className={`py-4 px-8 border-4 border-black font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all flex items-center justify-center gap-3 w-full sm:w-auto ${hasPass
                ? 'bg-emerald-500 text-white'
                : 'bg-[#a80d11] text-white'
                }`}
            >
              {hasPass ? 'VIEW YOUR PASS' : 'GET YOUR PASS'}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VisitorDetailsModal;
