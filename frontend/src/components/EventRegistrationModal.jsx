import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowRight, Loader2, CheckCircle2, User,
  Users, Building2, GraduationCap, BookOpen, Lightbulb,
  Globe, Tag, AlertCircle, Briefcase, Heart, Mic, Coffee,
  Film, Target, Zap
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import RazorpayCheckoutButton from './RazorpayCheckoutButton';
import confetti from 'canvas-confetti';

// ── Shared UI ─────────────────────────────────────────────────────────────────
const inputCls =
  'w-full border-4 border-black px-3.5 py-2.5 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 bg-white placeholder:text-gray-400';
const labelCls =
  'flex items-center gap-2 font-black uppercase tracking-[0.2em] text-xs text-gray-700 mb-1.5';

const Field = ({ id, label, icon: Icon, required = false, ...props }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className={labelCls}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input id={id} {...props} className={inputCls} />
  </div>
);

const SelectField = ({ id, label, icon: Icon, options = [], required = false, value, onChange }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className={labelCls}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select
      id={id}
      value={value || ''}
      onChange={onChange}
      className={`${inputCls} appearance-none cursor-pointer`}
    >
      <option value="">Select {label}</option>
      {options.map((opt) =>
        typeof opt === 'string' ? (
          <option key={opt} value={opt}>{opt}</option>
        ) : (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )
      )}
    </select>
  </div>
);

const TextAreaField = ({ id, label, icon: Icon, required = false, rows = 3, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className={labelCls}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <textarea
      id={id}
      value={value || ''}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full border-4 border-black px-3.5 py-2.5 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 bg-white placeholder:text-gray-400 resize-none"
    />
  </div>
);

// ── Per-event form fields ─────────────────────────────────────────────────────
const renderEventForm = (eventId, formData, setField) => {
  const f = (key) => setField(key);
  const v = (key) => formData[key] || '';

  switch (eventId) {
    case 'shark-tank':
      return (
        <>
          <Field id="er-teamName" label="Team / Startup Name" icon={Users} required
            placeholder="e.g. TechNova Ventures" value={v('teamName')} onChange={f('teamName')} />
          <SelectField id="er-stage" label="Startup Stage" icon={Tag} required
            options={['Idea Stage', 'MVP / Prototype', 'Early Revenue', 'Growth Stage']}
            value={v('stage')} onChange={f('stage')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field id="er-teamSize" label="Team Size" icon={Users} required type="number"
              placeholder="e.g. 3" min="1" max="6" value={v('teamSize')} onChange={f('teamSize')} />
            <Field id="er-investmentNeed" label="Funding Needed (₹)" icon={Briefcase}
              placeholder="e.g. 50L" value={v('investmentNeed')} onChange={f('investmentNeed')} />
          </div>
          <Field id="er-pitchDeckUrl" label="Pitch Deck Link (optional)" icon={Globe}
            placeholder="Google Drive / Notion URL" value={v('pitchDeckUrl')} onChange={f('pitchDeckUrl')} />
          <TextAreaField id="er-productBrief" label="Product / Service Brief" icon={Lightbulb} required rows={3}
            placeholder="Describe your product or service in 2–3 sentences"
            value={v('productBrief')} onChange={f('productBrief')} />
        </>
      );

    case 'phoenix-protocol':
      return (
        <>
          <Field id="er-teamName" label="Team Name" icon={Users} required
            placeholder="e.g. The Revivalists" value={v('teamName')} onChange={f('teamName')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field id="er-college" label="College" icon={Building2} required
              placeholder="e.g. Easwari EC" value={v('college')} onChange={f('college')} />
            <SelectField id="er-teamSize" label="Team Size" icon={Users} required
              options={['2 Members', '3 Members', '4 Members']}
              value={v('teamSize')} onChange={f('teamSize')} />
          </div>
          <Field id="er-brandToRevive" label="Brand to Revive" icon={Tag} required
            placeholder="e.g. Kingfisher Airlines, Kodak..." value={v('brandToRevive')} onChange={f('brandToRevive')} />
          <TextAreaField id="er-strategyBrief" label="Revival Strategy (Brief)" icon={Lightbulb} rows={3}
            placeholder="What went wrong? How will you bring it back?"
            value={v('strategyBrief')} onChange={f('strategyBrief')} />
        </>
      );

    case 'illogical-marketing':
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field id="er-college" label="College" icon={Building2} required
              placeholder="e.g. Easwari EC" value={v('college')} onChange={f('college')} />
            <Field id="er-department" label="Department" icon={GraduationCap}
              placeholder="e.g. CSE, ECE" value={v('department')} onChange={f('department')} />
          </div>
          <Field id="er-objectToMarket" label="Object to Market" icon={Tag} required
            placeholder="e.g. A brick, a cloud, a spoon..." value={v('objectToMarket')} onChange={f('objectToMarket')} />
          <TextAreaField id="er-marketingAngle" label="Your Marketing Angle" icon={Lightbulb} rows={2}
            placeholder="How will you market this illogical object?"
            value={v('marketingAngle')} onChange={f('marketingAngle')} />
        </>
      );

    case 'junk-to-genius':
      return (
        <>
          <Field id="er-teamName" label="Team Name" icon={Users} required
            placeholder="e.g. Waste Warriors" value={v('teamName')} onChange={f('teamName')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field id="er-college" label="College" icon={Building2} required
              placeholder="e.g. Easwari EC" value={v('college')} onChange={f('college')} />
            <SelectField id="er-teamSize" label="Team Size" icon={Users} required
              options={['2 Members', '3 Members', '4 Members', '5 Members']}
              value={v('teamSize')} onChange={f('teamSize')} />
          </div>
          <SelectField id="er-sdgFocus" label="UN SDG Focus Area" icon={Target} required
            options={[
              'Good Health & Well-being', 'Quality Education', 'Clean Energy',
              'Decent Work & Growth', 'Industry & Innovation', 'Sustainable Cities',
              'Responsible Consumption', 'Climate Action', 'Life Below Water', 'Life on Land',
            ]}
            value={v('sdgFocus')} onChange={f('sdgFocus')} />
          <TextAreaField id="er-materialList" label="Waste Materials to Use" icon={BookOpen} rows={2}
            placeholder="List the waste items you plan to use..."
            value={v('materialList')} onChange={f('materialList')} />
        </>
      );

    case 'reel-making':
      return (
        <>
          <Field id="er-teamName" label="Team Name" icon={Users} required
            placeholder="e.g. Frame Creators" value={v('teamName')} onChange={f('teamName')} />
          <SelectField id="er-teamSize" label="Team Size" icon={Users} required
            options={['1 (Solo)', '2 Members', '3 Members']}
            value={v('teamSize')} onChange={f('teamSize')} />
          <SelectField id="er-platform" label="Reel Platform" icon={Film} required
            options={['Instagram', 'YouTube', 'LinkedIn']}
            value={v('platform')} onChange={f('platform')} />
          <Field id="er-reelTheme" label="Reel Theme" icon={Tag} required
            placeholder="e.g. Startup Journey, Innovation..."
            value={v('reelTheme')} onChange={f('reelTheme')} />
          <Field id="er-submissionLink" label="Submission Link (if ready)" icon={Globe}
            placeholder="YouTube / Drive / Instagram link"
            value={v('submissionLink')} onChange={f('submissionLink')} />
        </>
      );

    case 'stall-expo':
      return (
        <>
          <Field id="er-stallName" label="Company / Club Name" icon={Building2} required
            placeholder="e.g. TechNova Solutions" value={v('stallName')} onChange={f('stallName')} />
          <SelectField id="er-stallCategory" label="Stall Category" icon={Tag} required
            options={['Startup', 'Sponsor', 'College Club', 'NGO', 'Government Body', 'Other']}
            value={v('stallCategory')} onChange={f('stallCategory')} />
          <Field id="er-contactPerson" label="Contact Person" icon={User} required
            placeholder="Full name" value={v('contactPerson')} onChange={f('contactPerson')} />
          <Field id="er-website" label="Website / Social Link" icon={Globe}
            placeholder="https://yourwebsite.com" value={v('website')} onChange={f('website')} />
          <TextAreaField id="er-stallBrief" label="What will you showcase?" icon={Lightbulb} rows={2}
            placeholder="Describe what you'll display at your stall"
            value={v('stallBrief')} onChange={f('stallBrief')} />
        </>
      );

    case 'student-project-expo':
      return (
        <>
          <Field id="er-projectName" label="Project Name" icon={Lightbulb} required
            placeholder="e.g. Smart Waste Sorter" value={v('projectName')} onChange={f('projectName')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field id="er-college" label="College" icon={Building2} required
              placeholder="e.g. Easwari EC" value={v('college')} onChange={f('college')} />
            <SelectField id="er-teamSize" label="Team Size" icon={Users} required
              options={['1 (Solo)', '2 Members', '3 Members', '4 Members']}
              value={v('teamSize')} onChange={f('teamSize')} />
          </div>
          <SelectField id="er-domain" label="Project Domain" icon={Tag} required
            options={['AI / ML', 'IoT / Hardware', 'Healthcare', 'AgriTech', 'EdTech', 'FinTech', 'GreenTech', 'SocialTech', 'Other']}
            value={v('domain')} onChange={f('domain')} />
          <TextAreaField id="er-projectBrief" label="Project Description" icon={BookOpen} required rows={3}
            placeholder="What problem does it solve? How does it work?"
            value={v('projectBrief')} onChange={f('projectBrief')} />
        </>
      );

    case 'panel-discussions':
      return (
        <>
          <Field id="er-college" label="College / Organization" icon={Building2} required
            placeholder="e.g. Easwari EC / TCS" value={v('college')} onChange={f('college')} />
          <SelectField id="er-role" label="Your Role" icon={Briefcase} required
            options={['Student', 'Faculty', 'Working Professional', 'Entrepreneur', 'Investor']}
            value={v('role')} onChange={f('role')} />
          <SelectField id="er-topicPreference" label="Discussion Topic Preference" icon={Mic} required
            options={[
              'Future of AI in Startups', 'Funding Ecosystem in India', 'Social Innovation',
              'Women in Entrepreneurship', 'Student to Founder Journey', 'Climate Tech Opportunities',
            ]}
            value={v('topicPreference')} onChange={f('topicPreference')} />
        </>
      );

    case 'keynote-speeches':
      return (
        <>
          <Field id="er-college" label="College / Organization" icon={Building2} required
            placeholder="e.g. Easwari EC" value={v('college')} onChange={f('college')} />
          <SelectField id="er-attendeeType" label="Attending As" icon={User} required
            options={['Student', 'Faculty', 'Industry Professional', 'Investor', 'Media']}
            value={v('attendeeType')} onChange={f('attendeeType')} />
        </>
      );

    case 'live-podcast':
      return (
        <>
          <Field id="er-organization" label="College / Organization" icon={Building2} required
            placeholder="e.g. Easwari EC / Your Company" value={v('organization')} onChange={f('organization')} />
          <SelectField id="er-topicInterest" label="Podcast Topic Interest" icon={Mic} required
            options={['Startup Funding', 'Product Building', 'Marketing & Growth', 'Tech Innovation', 'Leadership', 'Social Impact']}
            value={v('topicInterest')} onChange={f('topicInterest')} />
        </>
      );

    case 'pavilions':
      return (
        <>
          <Field id="er-organization" label="College / Organization" icon={Building2}
            placeholder="e.g. Easwari EC" value={v('organization')} onChange={f('organization')} />
          <SelectField id="er-interest" label="Area of Interest" icon={Tag} required
            options={['StartupTN Schemes', 'MSME Support', 'IPR & Patents', 'Incubation Programs', 'Funding Opportunities', 'General Inquiry']}
            value={v('interest')} onChange={f('interest')} />
        </>
      );

    case 'social-impact-awards':
      return (
        <>
          <Field id="er-startupName" label="Startup Name" icon={Building2} required
            placeholder="e.g. GreenPath Solutions" value={v('startupName')} onChange={f('startupName')} />
          <SelectField id="er-impactArea" label="Impact Area" icon={Heart} required
            options={['Environment', 'Education', 'Healthcare', 'Agriculture', 'Women Empowerment', 'Rural Development', 'Disability Inclusion', 'Other']}
            value={v('impactArea')} onChange={f('impactArea')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField id="er-stage" label="Startup Stage" icon={Tag} required
              options={['Idea Stage', 'MVP', 'Early Revenue', 'Scaling']}
              value={v('stage')} onChange={f('stage')} />
            <Field id="er-teamSize" label="Team Size" icon={Users} type="number"
              placeholder="e.g. 3" min="1" value={v('teamSize')} onChange={f('teamSize')} />
          </div>
          <TextAreaField id="er-impactBrief" label="Social Impact Description" icon={Lightbulb} required rows={3}
            placeholder="Describe your social impact and what makes your startup unique"
            value={v('impactBrief')} onChange={f('impactBrief')} />
        </>
      );

    case 'sponsor-promotions':
      return (
        <>
          <Field id="er-companyName" label="Company Name" icon={Building2} required
            placeholder="e.g. TechNova Ltd." value={v('companyName')} onChange={f('companyName')} />
          <Field id="er-productToLaunch" label="Product / Service to Launch" icon={Tag} required
            placeholder="e.g. AI-powered CRM Tool" value={v('productToLaunch')} onChange={f('productToLaunch')} />
          <Field id="er-contactPerson" label="Contact Person" icon={User} required
            placeholder="Full name" value={v('contactPerson')} onChange={f('contactPerson')} />
          <Field id="er-website" label="Company Website" icon={Globe}
            placeholder="https://yourwebsite.com" value={v('website')} onChange={f('website')} />
        </>
      );

    case 'valedictory':
      return (
        <>
          <Field id="er-organization" label="College / Organization" icon={Building2} required
            placeholder="e.g. Easwari EC" value={v('organization')} onChange={f('organization')} />
          <SelectField id="er-attendeeRole" label="Attending As" icon={User} required
            options={['Hackathon Participant', 'Shark Tank Participant', 'Faculty', 'Guest', 'Media']}
            value={v('attendeeRole')} onChange={f('attendeeRole')} />
        </>
      );

    case 'easwari-startups-launch':
      return (
        <>
          <Field id="er-startupName" label="Startup Name" icon={Building2} required
            placeholder="e.g. Your Startup" value={v('startupName')} onChange={f('startupName')} />
          <Field id="er-college" label="College" icon={GraduationCap} required
            placeholder="e.g. Easwari Engineering College" value={v('college')} onChange={f('college')} />
          <SelectField id="er-incubationStage" label="Incubation Stage" icon={Tag} required
            options={['Idea', 'Pre-Incubation', 'Incubation', 'Graduated']}
            value={v('incubationStage')} onChange={f('incubationStage')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field id="er-teamSize" label="Team Size" icon={Users} type="number"
              placeholder="e.g. 3" min="1" value={v('teamSize')} onChange={f('teamSize')} />
            <Field id="er-domain" label="Domain" icon={Briefcase}
              placeholder="e.g. HealthTech" value={v('domain')} onChange={f('domain')} />
          </div>
        </>
      );

    case 'standup':
      return (
        <>
          <Field id="er-college" label="College / Organization" icon={Building2} required
            placeholder="e.g. Easwari EC" value={v('college')} onChange={f('college')} />
          <TextAreaField id="er-ideaBrief" label="Your Startup Idea (2 sentences max)" icon={Lightbulb} required rows={3}
            placeholder="What's your startup idea? What problem does it solve?"
            value={v('ideaBrief')} onChange={f('ideaBrief')} />
        </>
      );

    case 'design-thinking-bootcamp':
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field id="er-college" label="College" icon={Building2} required
              placeholder="e.g. Easwari EC" value={v('college')} onChange={f('college')} />
            <SelectField id="er-year" label="Year" icon={GraduationCap} required
              options={['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG / MBA', 'Faculty']}
              value={v('year')} onChange={f('year')} />
          </div>
          <SelectField id="er-problemDomain" label="Problem Domain of Interest" icon={Target} required
            options={['Healthcare', 'Education', 'Environment', 'Agriculture', 'Smart Cities', 'Social Inclusion', 'FinTech', 'Other']}
            value={v('problemDomain')} onChange={f('problemDomain')} />
        </>
      );

    case 'startup-dating':
      return (
        <>
          <Field id="er-organization" label="College / Company" icon={Building2} required
            placeholder="e.g. Easwari EC" value={v('organization')} onChange={f('organization')} />
          <TextAreaField id="er-problemStatement" label="Problem Statement (1 sentence)" icon={Target} required rows={2}
            placeholder="e.g. Small businesses struggle to track inventory efficiently"
            value={v('problemStatement')} onChange={f('problemStatement')} />
          <TextAreaField id="er-solutionIdea" label="Solution Idea (1 sentence)" icon={Lightbulb} required rows={2}
            placeholder="e.g. A mobile app that auto-tracks inventory using barcode scanning"
            value={v('solutionIdea')} onChange={f('solutionIdea')} />
          <SelectField id="er-stageOfIdea" label="Stage of Idea" icon={Zap}
            options={['Just an idea', 'Validated concept', 'Working on MVP', 'Have a prototype']}
            value={v('stageOfIdea')} onChange={f('stageOfIdea')} />
        </>
      );

    case 'incubation-hub-pavilions':
      return (
        <>
          <Field id="er-organization" label="College / Organization" icon={Building2} required
            placeholder="e.g. Easwari EC" value={v('organization')} onChange={f('organization')} />
          <SelectField id="er-interest" label="Area of Interest" icon={Tag} required
            options={['Incubation Programs', 'Mentorship Access', 'Funding Guidance', 'IP & Legal Support', 'Industry Connect', 'General Inquiry']}
            value={v('interest')} onChange={f('interest')} />
        </>
      );

    case 'one-to-one-mentorship':
      return (
        <>
          <Field id="er-organization" label="College / Organization" icon={Building2} required
            placeholder="e.g. Easwari EC" value={v('organization')} onChange={f('organization')} />
          <SelectField id="er-startupStage" label="Your Stage" icon={Tag} required
            options={['Just an idea', 'Validated concept', 'MVP / Prototype', 'Early Revenue', 'Growing']}
            value={v('startupStage')} onChange={f('startupStage')} />
          <SelectField id="er-focusArea" label="Mentorship Focus Area" icon={Target} required
            options={['Technology / Product', 'Marketing & Growth', 'Finance & Funding', 'Legal & IP', 'Business Strategy', 'Sales']}
            value={v('focusArea')} onChange={f('focusArea')} />
        </>
      );

    case 'fireside-chat':
      return (
        <>
          <Field id="er-organization" label="College / Organization" icon={Building2} required
            placeholder="e.g. Easwari EC" value={v('organization')} onChange={f('organization')} />
          <SelectField id="er-topicInterest" label="Topic of Interest" icon={Coffee} required
            options={['Startup Journey', 'Fundraising & VC', 'Product Strategy', 'Leadership & Culture', 'Women in Tech', 'Social Entrepreneurship']}
            value={v('topicInterest')} onChange={f('topicInterest')} />
        </>
      );

    default:
      return (
        <Field id="er-organization" label="College / Organization" icon={Building2} required
          placeholder="e.g. Easwari EC" value={v('organization')} onChange={f('organization')} />
      );
  }
};

// ── Validation: required field keys per event ─────────────────────────────────
const getRequiredFields = (eventId) => {
  const map = {
    'shark-tank':              ['teamName', 'stage', 'teamSize', 'productBrief'],
    'phoenix-protocol':        ['teamName', 'college', 'teamSize', 'brandToRevive'],
    'illogical-marketing':     ['college', 'objectToMarket'],
    'junk-to-genius':          ['teamName', 'college', 'teamSize', 'sdgFocus'],
    'reel-making':             ['teamName', 'teamSize', 'platform', 'reelTheme'],
    'stall-expo':              ['stallName', 'stallCategory', 'contactPerson'],
    'student-project-expo':    ['projectName', 'college', 'teamSize', 'domain', 'projectBrief'],
    'panel-discussions':       ['college', 'role', 'topicPreference'],
    'keynote-speeches':        ['college', 'attendeeType'],
    'live-podcast':            ['organization', 'topicInterest'],
    'pavilions':               ['interest'],
    'social-impact-awards':    ['startupName', 'impactArea', 'stage', 'impactBrief'],
    'sponsor-promotions':      ['companyName', 'productToLaunch', 'contactPerson'],
    'valedictory':             ['organization', 'attendeeRole'],
    'easwari-startups-launch': ['startupName', 'college', 'incubationStage'],
    'standup':                 ['college', 'ideaBrief'],
    'design-thinking-bootcamp':['college', 'year', 'problemDomain'],
    'startup-dating':          ['organization', 'problemStatement', 'solutionIdea'],
    'incubation-hub-pavilions':['organization', 'interest'],
    'one-to-one-mentorship':   ['organization', 'startupStage', 'focusArea'],
    'fireside-chat':           ['organization', 'topicInterest'],
  };
  return map[eventId] || [];
};

// ── Category accent colours ───────────────────────────────────────────────────
const categoryColors = {
  Technical:   { bg: '#dbeafe', border: '#1d4ed8', text: '#1d4ed8' },
  Submission:  { bg: '#f3e8ff', border: '#7c3aed', text: '#7c3aed' },
  Expo:        { bg: '#ffedd5', border: '#ea580c', text: '#ea580c' },
  Expert:      { bg: '#d1fae5', border: '#059669', text: '#059669' },
  'Main Stage':{ bg: '#fef9c3', border: '#ca8a04', text: '#92400e' },
  Workshop:    { bg: '#e0f2fe', border: '#0284c7', text: '#0284c7' },
  Mentorship:  { bg: '#ffe4e6', border: '#be123c', text: '#be123c' },
};

// ── Success screen ────────────────────────────────────────────────────────────
const SuccessScreen = ({ event, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-6 space-y-6"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 0.1 }}
      className="w-20 h-20 bg-black border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.3)] flex items-center justify-center mx-auto"
    >
      <CheckCircle2 className="w-10 h-10 text-white" />
    </motion.div>
    <div>
      <p className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-1">You're In!</p>
      <h3 className="text-2xl font-black uppercase tracking-tight">{event.name}</h3>
      <p className="font-bold text-sm text-gray-500 mt-1">Registration Confirmed</p>
    </div>
    <div className="border-4 border-black p-4 text-left space-y-1" style={{ background: '#f8f8f5' }}>
      <p className="font-black uppercase tracking-widest text-xs text-gray-400">Event</p>
      <p className="font-black text-lg uppercase">{event.name}</p>
      <p className="font-bold text-xs text-gray-500 uppercase tracking-wider">
        {event.venue} · {event.day}
      </p>
    </div>
    <button
      onClick={onClose}
      className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
    >
      Done →
    </button>
  </motion.div>
);

// ── Already registered screen ─────────────────────────────────────────────────
const AlreadyRegisteredScreen = ({ event, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-5">
    <div className="w-20 h-20 bg-green-600 border-4 border-black flex items-center justify-center mx-auto">
      <CheckCircle2 className="w-10 h-10 text-white" />
    </div>
    <div>
      <p className="font-black uppercase tracking-widest text-xs text-gray-400 mb-1">Already Registered</p>
      <h3 className="text-2xl font-black uppercase">{event.name}</h3>
      <p className="font-bold text-sm text-gray-500 mt-1">You've already signed up for this event!</p>
    </div>
    <button
      onClick={onClose}
      className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
    >
      Close →
    </button>
  </motion.div>
);

// ── Main component ────────────────────────────────────────────────────────────
const EventRegistrationModal = ({ event, onClose }) => {
  const { user, registration } = useAuth();
  const [formData, setFormData]           = useState({});
  const [submitting, setSubmitting]       = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [alreadyRegistered, setAlready]   = useState(false);
  const [error, setError]                 = useState('');
  const [checking, setChecking]           = useState(true);
  // 'info' | 'payment' | 'paid-success' | 'form'
  const [paymentStep, setPaymentStep]     = useState('info');

  const getEventAmount = (eventId) => {
    switch (eventId) {
      case 'hackathon':               return 1200;
      case 'shark-tank':              return 700;
      case 'phoenix-protocol':        return 500;
      case 'junk-to-genius':          return 500;
      case 'illogical-marketing':     return 150;
      case 'design-thinking-bootcamp':return 300;
      default:                        return 0;
    }
  };

  const amountRequired = getEventAmount(event?.id);

  const setField = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  // Check duplicate registration
  useEffect(() => {
    if (!user || !event) return;
    const check = async () => {
      try {
        await api.get(`/api/events/${event.id}/my-registration`);
        setAlready(true);
      } catch { /* 404 = not yet registered */ }
      setChecking(false);
    };
    check();
    // Default to 'form' directly if no amount needed
    if (amountRequired === 0) setPaymentStep('form');
  }, [user, event]);

  const fireConfetti = () => {
    // Left cannon
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { x: 0, y: 0.6 },
      colors: ['#a80d11', '#d82221', '#0b2140', '#f59e0b', '#fff'],
    });
    // Right cannon
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { x: 1, y: 0.6 },
      colors: ['#a80d11', '#d82221', '#0b2140', '#f59e0b', '#fff'],
    });
    // Center burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#a80d11', '#fbbf24', '#fff', '#0f50e3'],
      });
    }, 250);
  };

  const handlePaymentSuccess = () => {
    fireConfetti();
    setPaymentStep('paid-success');
  };

  const validate = () => {
    const required = getRequiredFields(event.id);
    for (const field of required) {
      if (!formData[field] || !String(formData[field]).trim()) {
        return 'Please fill in all required fields.';
      }
    }
    return '';
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setSubmitting(true);
    try {
      await api.post(`/api/events/${event.id}/register`, {
        eventName:       event.name,
        eventCategory:   event.category,
        registrantName:  registration?.name  || '',
        registrantEmail: registration?.email || user?.email || '',
        passType:        registration?.passType || '',
        ...formData,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };

  const catStyle = categoryColors[event?.category] || { bg: '#f3f4f6', border: '#1f2022', text: '#1f2022' };
  const userName  = registration?.name  || user?.displayName || user?.email || 'Attendee';
  const userEmail = registration?.email || user?.email || '';

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[79]"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[80] w-full max-w-xl max-h-[90vh] flex flex-col border-4 border-black shadow-[14px_14px_0px_rgba(0,0,0,1)] bg-[#fffefa]"
      >
        {/* Gradient top bar */}
        <div
          className="h-3 shrink-0"
          style={{ background: 'linear-gradient(to right, #a80d11, #d82221 45%, #0b2140 55%, #0f50e3)' }}
        />

        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {checking ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : alreadyRegistered ? (
            <AlreadyRegisteredScreen event={event} onClose={onClose} />
          ) : submitted ? (
            <SuccessScreen event={event} onClose={onClose} />
          ) : (
            <>
              {/* Header — always visible */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span
                    className="inline-block px-2 py-0.5 font-black text-xs uppercase tracking-widest border-2 mb-2"
                    style={{ background: catStyle.bg, borderColor: catStyle.border, color: catStyle.text }}
                  >
                    {event.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
                    {event.name}
                  </h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors mt-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ── STEP 1: INFO CARD (always shown first if amount > 0) ── */}
              {paymentStep === 'info' && amountRequired > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  {/* User info card */}
                  <div className="border-4 border-black p-4 bg-[#f0f9ff] flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0b2140] border-2 border-black flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-black uppercase tracking-[0.2em] text-xs text-[#0b2140] mb-0.5">Registering As</p>
                      <p className="font-black text-base text-black">{userName}</p>
                      <p className="font-bold text-xs text-gray-500">{userEmail}</p>
                    </div>
                  </div>

                  {/* Amount card */}
                  <div className="border-4 border-black p-6 bg-[#fff5f5] text-center">
                    <p className="font-black uppercase tracking-[0.25em] text-xs text-gray-500 mb-2">Registration Fee</p>
                    <p className="font-black text-5xl text-[#a80d11] mb-1">₹{amountRequired}</p>
                    <p className="font-bold text-xs text-gray-500 uppercase tracking-wider">{event.name}</p>
                  </div>

                  <p className="text-center text-xs font-bold text-gray-500">
                    Complete your payment to unlock the event registration form.
                  </p>

                  {/* Buttons */}
                  <button
                    onClick={() => setPaymentStep('payment')}
                    className="w-full py-4 border-4 border-black bg-[#a80d11] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    Continue to Payment <ArrowRight className="w-5 h-5" />
                  </button>
                  <button onClick={onClose} className="w-full py-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                    Cancel
                  </button>
                </motion.div>
              )}

              {/* ── STEP 2: RAZORPAY BUTTON ── */}
              {paymentStep === 'payment' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 text-center">
                  <div className="border-4 border-black p-5 bg-[#fff5f5]">
                    <p className="font-black uppercase tracking-[0.25em] text-xs text-gray-500 mb-2">Amount</p>
                    <p className="font-black text-4xl text-[#a80d11]">₹{amountRequired}</p>
                    <p className="font-bold text-xs text-gray-400 mt-1">{event.name}</p>
                  </div>
                  <div className="border-4 border-black p-4 bg-[#f0f9ff] flex items-center gap-3">
                    <User className="w-5 h-5 text-[#0b2140] shrink-0" />
                    <div className="text-left">
                      <p className="font-black text-sm">{userName}</p>
                      <p className="font-bold text-xs text-gray-500">{userEmail}</p>
                    </div>
                  </div>
                  <div className="flex justify-center pt-2">
                    <RazorpayCheckoutButton
                      amount={amountRequired * 100}
                      currency="INR"
                      prefillName={userName}
                      prefillEmail={userEmail}
                      prefillContact={registration?.phone || ''}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                  <button
                    onClick={() => setPaymentStep('info')}
                    className="w-full py-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                  >
                    ← Back
                  </button>
                </motion.div>
              )}

              {/* ── STEP 3: PAYMENT SUCCESS + CONFETTI ── */}
              {paymentStep === 'paid-success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-5 py-4"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-24 h-24 mx-auto bg-green-500 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <p className="font-black text-xs uppercase tracking-[0.3em] text-green-600 mb-1">🎉 Payment Successful!</p>
                    <h3 className="text-xl font-black uppercase tracking-tight">{event.name}</h3>
                    <p className="font-bold text-sm text-gray-600 mt-2 max-w-xs mx-auto">
                      Payment has been done successfully for registration.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="border-4 border-green-500 p-4 bg-green-50 text-left"
                  >
                    <p className="font-black uppercase tracking-widest text-xs text-green-700 mb-1">Paid By</p>
                    <p className="font-black text-sm">{userName}</p>
                    <p className="font-bold text-xs text-gray-500">{userEmail}</p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => setPaymentStep('form')}
                    className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.15em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    Register for {event.name} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* ── STEP 4: REGISTRATION FORM ── */}
              {paymentStep === 'form' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {/* Info chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 border-2 border-black bg-white font-black text-xs uppercase tracking-widest">{event.day}</span>
                    <span className="px-3 py-1 border-2 border-black bg-yellow-400 font-black text-xs uppercase tracking-widest">{event.venue}</span>
                  </div>

                  {/* Registering-as banner */}
                  <div className="border-4 border-black bg-[#f0f9ff] p-3 flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 border-2 border-black flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="font-black uppercase tracking-widest text-xs text-blue-900">Registering as</p>
                      <p className="font-bold text-sm text-blue-800">{userName}{userEmail ? ` · ${userEmail}` : ''}</p>
                    </div>
                  </div>

                  <div className="border-b-4 border-black" />

                  <div className="space-y-4">
                    {renderEventForm(event.id, formData, setField)}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-red-700 bg-red-50 border-l-4 border-red-600 p-3 font-bold text-xs flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="mt-6 w-full flex items-center justify-center gap-3 py-4 border-4 border-black font-black uppercase tracking-[0.15em] text-sm bg-[#1f2022] text-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Registering...</>
                      : <>Register for {event.name} <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventRegistrationModal;
