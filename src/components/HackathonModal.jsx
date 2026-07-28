import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, LogIn, Copy, Check, Sparkles, ArrowRight,
  Loader2, X, AlertCircle, CheckCircle2, Shield, Building2,
  GraduationCap, Mail, User, BookOpen, Hash, Share2, Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchProblemStatements,
  checkTeamNameUnique,
  createTeamInFirestore,
  findTeamByCode,
  joinTeamInFirestore,
  subscribeToTeamDetails,
  fetchUserTeamData,
  updateTeamInFirestore
} from '../services/hackathonService';

const inputCls = 'w-full border-4 border-black px-3.5 py-2.5 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 bg-white placeholder:text-gray-400';
const labelCls = 'flex items-center gap-2 font-black uppercase tracking-[0.2em] text-xs text-gray-700 mb-1.5';

const Field = ({ id, label, icon: Icon, required = false, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={id} className={labelCls}>
      {Icon && <Icon className="w-3.5 h-3.5 text-black" />}
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input id={id} {...props} className={inputCls} />
  </div>
);

const ErrorMsg = ({ msg }) => msg
  ? (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="text-red-700 bg-red-50 border-l-4 border-red-600 p-3 font-bold text-xs flex items-start gap-2 shadow-sm">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{msg}</span>
    </motion.div>
  )
  : null;

const HackathonModal = ({ isOpen, onClose, initialJoinCode = '' }) => {
  const { user } = useAuth();

  // Navigation states: 'loading' | 'choice' | 'create' | 'join' | 'success' | 'dashboard'
  const [view, setView] = useState('loading');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Loaded problem statements
  const [problemStatements, setProblemStatements] = useState([]);

  // Form states for Create Team
  const [formData, setFormData] = useState({
    teamName: '',
    college: '',
    department: '',
    problemStatement: '',
    leaderName: '',
    maxMembers: 3, // Default 3 members total (Leader + 2 members)
    memberEmails: ['', ''], // Default 2 invited member emails
  });

  // Success state after team creation
  const [createdTeam, setCreatedTeam] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // States for Join Team flow
  const [joinCodeInput, setJoinCodeInput] = useState(initialJoinCode || '');
  const [foundTeam, setFoundTeam] = useState(null);
  const [memberProfile, setMemberProfile] = useState({
    name: '',
    college: '',
    department: '',
  });
  const [needProfileCompletion, setNeedProfileCompletion] = useState(false);

  // Active Team Data (Dashboard view)
  const [activeTeamData, setActiveTeamData] = useState(null);

  // Initialize data on mount or open
  useEffect(() => {
    if (!isOpen) return;

    let unsubscribe = null;

    const init = async () => {
      setLoading(true);
      setError('');

      try {
        // Load problem statements
        const psList = await fetchProblemStatements();
        setProblemStatements(psList);

        if (psList.length > 0) {
          setFormData(prev => ({
            ...prev,
            problemStatement: prev.problemStatement || psList[0].title
          }));
        }

        if (!user) {
          setView('choice');
          setLoading(false);
          return;
        }

        // Fetch user existing team data
        const existingData = await fetchUserTeamData(user.uid);

        if (existingData) {
          setActiveTeamData(existingData);
          setView('dashboard');

          // Subscribe to real-time updates for team & members
          unsubscribe = subscribeToTeamDetails(existingData.team.id, (updated) => {
            if (updated) {
              setActiveTeamData(prev => ({
                ...prev,
                team: updated.team,
                members: updated.members
              }));
            }
          });
        } else {
          // Pre-fill user profile info if available
          const prof = await getUserProfile(user.uid);
          setFormData(prev => ({
            ...prev,
            leaderName: prof?.name || user.displayName || '',
            college: prof?.college || '',
            department: prof?.department || '',
          }));

          setMemberProfile({
            name: prof?.name || user.displayName || '',
            college: prof?.college || '',
            department: prof?.department || '',
          });

          if (initialJoinCode) {
            setJoinCodeInput(initialJoinCode);
            setView('join');
            // Auto-search the team using the initial join code
            try {
              const team = await findTeamByCode(initialJoinCode.toUpperCase());
              if (team) {
                setFoundTeam(team);
              }
            } catch (searchErr) {
              console.error('Auto-search team error:', searchErr);
            }
          } else {
            setView('choice');
          }
        }
      } catch (err) {
        console.error('Init error:', err);
        setView('choice');
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen, user, initialJoinCode]);

  // Handle Team Size Selection (2, 3, 4)
  const handleTeamSizeChange = (size) => {
    if (view === 'edit') {
      const joinedCount = activeTeamData?.team?.joinedMemberUids?.length || 1;
      if (size < joinedCount) {
        setError(`Cannot reduce team size to ${size}. There are already ${joinedCount} members joined.`);
        return;
      }
    }
    
    const numSize = Number(size); // Total members (including leader)
    const neededInvites = numSize - 1;

    setFormData(prev => {
      let updatedEmails = [...prev.memberEmails];
      if (updatedEmails.length < neededInvites) {
        while (updatedEmails.length < neededInvites) {
          updatedEmails.push('');
        }
      } else if (updatedEmails.length > neededInvites) {
        updatedEmails = updatedEmails.slice(0, neededInvites);
      }
      return {
        ...prev,
        maxMembers: numSize,
        memberEmails: updatedEmails
      };
    });
  };

  // Handle Member Email Input Change
  const handleMemberEmailChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.memberEmails];
      updated[index] = value;
      return { ...prev, memberEmails: updated };
    });
  };

  const handleEditClick = () => {
    // Populate formData with activeTeamData
    const team = activeTeamData.team;
    setFormData(prev => ({
      ...prev,
      teamName: team.teamName || '',
      college: team.college || '',
      department: team.department || '',
      problemStatement: team.problemStatement || '',
      leaderName: team.leaderName || '',
      maxMembers: team.maxMembers || 3,
      memberEmails: team.invitedEmails || [],
    }));
    setView('edit');
  };

  // Email Regex Validator
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Validate Create Team Form
  const validateCreateForm = async () => {
    setError('');

    const { teamName, college, department, problemStatement, leaderName, memberEmails, maxMembers } = formData;

    if (!teamName.trim()) return 'Team Name is required.';
    if (!college.trim()) return 'College Name is required.';
    if (!department.trim()) return 'Department is required.';
    if (!problemStatement.trim()) return 'Please select a Problem Statement.';
    if (!leaderName.trim()) return 'Team Leader Name is required.';

    // 1. Leader email check
    const leaderEmailClean = user?.email?.toLowerCase().trim();
    if (!leaderEmailClean) return 'User email is required. Please ensure you are logged in.';

    // 2. Validate member emails count
    const requiredMemberCount = maxMembers - 1;
    if (memberEmails.length !== requiredMemberCount) {
      return `Please enter email addresses for all ${requiredMemberCount} team member(s).`;
    }

    const cleanMemberEmails = memberEmails.map(e => e.trim().toLowerCase());

    // 3. Check for empty member emails
    for (let i = 0; i < cleanMemberEmails.length; i++) {
      if (!cleanMemberEmails[i]) {
        return `Member ${i + 2} Email is required.`;
      }
      if (!isValidEmail(cleanMemberEmails[i])) {
        return `Member ${i + 2} Email ("${cleanMemberEmails[i]}") is invalid.`;
      }
    }

    // 4. Leader email cannot appear again
    if (cleanMemberEmails.includes(leaderEmailClean)) {
      return `Team Leader Email (${user.email}) cannot be added again as an invited member.`;
    }

    // 5. No duplicate member emails
    const uniqueEmails = new Set(cleanMemberEmails);
    if (uniqueEmails.size !== cleanMemberEmails.length) {
      return 'Member emails must be unique. No duplicate member emails allowed.';
    }

    // 6. Unique Team Name check in Firestore
    if (!(view === 'edit' && teamName.trim().toLowerCase() === activeTeamData?.team?.teamName?.toLowerCase())) {
      const isUnique = await checkTeamNameUnique(teamName);
      if (!isUnique) {
        return `Team Name "${teamName}" is already taken. Please choose a different team name.`;
      }
    }

    return null;
  };

  // Handle Create Team Submit
  const handleCreateTeamSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in first to create a team.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const err = await validateCreateForm();
      if (err) {
        setError(err);
        setSubmitting(false);
        return;
      }

      const result = await createTeamInFirestore(user, {
        teamName: formData.teamName,
        college: formData.college,
        department: formData.department,
        problemStatement: formData.problemStatement,
        leaderName: formData.leaderName,
        leaderEmail: user.email,
        maxMembers: formData.maxMembers,
        invitedEmails: formData.memberEmails,
      });

      setCreatedTeam(result);
      setView('success');
    } catch (err) {
      console.error('Create team error:', err);
      setError(err.message || 'Failed to create team. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit Team Submit
  const handleEditTeamSubmit = async (e) => {
    e.preventDefault();
    const validationError = await validateCreateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await updateTeamInFirestore(activeTeamData.team.id, user, {
        teamName: formData.teamName,
        problemStatement: formData.problemStatement,
        maxMembers: formData.maxMembers,
        invitedEmails: formData.memberEmails,
        college: formData.college,
        department: formData.department,
        leaderName: formData.leaderName,
        leaderEmail: user.email,
      });

      // Go back to dashboard on success
      setView('dashboard');
    } catch (err) {
      console.error('Edit team error:', err);
      setError(err.message || 'Failed to update team. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Search Team by Code
  const handleSearchTeam = async (codeToSearch) => {
    const code = codeToSearch || joinCodeInput;
    if (!code || !code.trim()) {
      setError('Please enter a Team Code.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const team = await findTeamByCode(code);
      if (!team) {
        setError('No team found matching this code. Please verify and try again.');
        setFoundTeam(null);
        setSubmitting(false);
        return;
      }

      setFoundTeam(team);

      // Check if team is full
      if ((team.joinedMemberUids?.length || 0) >= team.maxMembers) {
        setError(`Team "${team.teamName}" is full (${team.joinedMemberUids.length}/${team.maxMembers} members).`);
      }

      // Check user profile completeness
      const prof = await getUserProfile(user?.uid);
      if (!prof?.name || !prof?.college || !prof?.department) {
        setNeedProfileCompletion(true);
      } else {
        setNeedProfileCompletion(false);
      }
    } catch (err) {
      console.error('Search team error:', err);
      setError(err.message || 'Error searching for team.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Join Team Confirm
  const handleJoinTeamSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to join a team.');
      return;
    }
    if (!foundTeam) return;

    if (!memberProfile.name.trim() || !memberProfile.college.trim() || !memberProfile.department.trim()) {
      setError('Please fill in all your profile details (Name, College, Department) before joining.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await joinTeamInFirestore(user, foundTeam.teamCode, {
        name: memberProfile.name.trim(),
        email: user.email,
        college: memberProfile.college.trim(),
        department: memberProfile.department.trim(),
      });

      // Refresh team data and switch view to dashboard
      const updatedData = await fetchUserTeamData(user.uid);
      setActiveTeamData(updatedData);
      setView('dashboard');
    } catch (err) {
      console.error('Join team error:', err);
      setError(err.message || 'Failed to join team.');
    } finally {
      setSubmitting(false);
    }
  };

  // Clipboard actions
  const handleCopyCode = () => {
    if (!createdTeam && !activeTeamData?.team) return;
    const code = createdTeam?.teamCode || activeTeamData?.team?.teamCode;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!createdTeam && !activeTeamData?.team) return;
    const code = createdTeam?.teamCode || activeTeamData?.team?.teamCode;
    const link = `${window.location.origin}${window.location.pathname}?joinCode=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-50 w-full max-w-2xl max-h-[90vh] bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
      >
        {/* Top Decorative Header */}
        <div className="bg-black text-white p-4 md:p-5 flex items-center justify-between shrink-0 border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-white bg-blue-600 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">Startup Peravai 2026</p>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Hackathon Team Portal</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 border-2 border-white bg-red-600 text-white flex items-center justify-center font-black hover:bg-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">

          {/* LOADING STATE */}
          {loading && (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-black" />
              <p className="font-black uppercase tracking-widest text-sm text-gray-600">Loading Hackathon Portal…</p>
            </div>
          )}

          {/* VIEW 1: CHOICE SCREEN (Join Team vs Create Team) */}
          {!loading && view === 'choice' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h4 className="text-3xl font-black uppercase tracking-tight">Join The Hackathon</h4>
                <p className="font-bold text-gray-500 text-sm max-w-md mx-auto">
                  Build your squad or join an existing team to compete for the ultimate championship!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Option 1: Create Team */}
                <button
                  onClick={() => { setError(''); setView('create'); }}
                  className="p-6 border-4 border-black bg-[#fffefa] text-left hover:bg-black hover:text-white transition-all group shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 border-4 border-black bg-blue-600 text-white flex items-center justify-center mb-4 group-hover:border-white">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <h5 className="text-2xl font-black uppercase tracking-tight mb-2">Create Team</h5>
                    <p className="font-bold text-xs opacity-75 leading-relaxed">
                      Register as Team Leader, set up your problem statement, set team size limit, and generate a Team Code for your teammates.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                    <span>Start Registration</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Option 2: Join Team */}
                <button
                  onClick={() => { setError(''); setView('join'); }}
                  className="p-6 border-4 border-black bg-[#fffefa] text-left hover:bg-black hover:text-white transition-all group shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 border-4 border-black bg-red-600 text-white flex items-center justify-center mb-4 group-hover:border-white">
                      <Users className="w-6 h-6" />
                    </div>
                    <h5 className="text-2xl font-black uppercase tracking-tight mb-2">Join Team</h5>
                    <p className="font-bold text-xs opacity-75 leading-relaxed">
                      Have a Team Code from your leader? Enter the code here to join your team instantly with your profile.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                    <span>Enter Team Code</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* VIEW 2 & 6: CREATE / EDIT TEAM FORM */}
          {!loading && (view === 'create' || view === 'edit') && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-blue-600">
                    {view === 'create' ? 'Step 1 of 2' : 'Edit Mode'}
                  </p>
                  <h4 className="text-2xl font-black uppercase tracking-tight">
                    {view === 'create' ? 'Create Team Registration' : 'Update Team Details'}
                  </h4>
                </div>
                <button
                  onClick={() => setView(view === 'create' ? 'choice' : 'dashboard')}
                  className="px-3 py-1.5 border-2 border-black font-black text-xs uppercase tracking-widest hover:bg-gray-100"
                >
                  ← Back
                </button>
              </div>

              <form onSubmit={view === 'create' ? handleCreateTeamSubmit : handleEditTeamSubmit} className="space-y-5">
                {/* Team Name */}
                <Field
                  id="teamName"
                  label="Team Name"
                  icon={Users}
                  required
                  placeholder="Your Team name"
                  value={formData.teamName}
                  onChange={e => setFormData(p => ({ ...p, teamName: e.target.value }))}
                />

                {/* College & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    id="college"
                    label="College Name"
                    icon={Building2}
                    required
                    placeholder="e.g. Easwari Engineering College"
                    value={formData.college}
                    onChange={e => setFormData(p => ({ ...p, college: e.target.value }))}
                  />
                  <Field
                    id="department"
                    label="Department"
                    icon={GraduationCap}
                    required
                    placeholder="e.g. CSE"
                    value={formData.department}
                    onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
                  />
                </div>

                {/* Problem Statement Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="problemStatement" className={labelCls}>
                    <BookOpen className="w-3.5 h-3.5 text-black" />
                    Problem Statement <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="problemStatement"
                    value={formData.problemStatement}
                    onChange={e => setFormData(p => ({ ...p, problemStatement: e.target.value }))}
                    className={`${inputCls} cursor-pointer`}
                  >
                    {problemStatements.map(ps => (
                      <option key={ps.id} value={ps.title}>
                        [{ps.category}] {ps.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Leader Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    id="leaderName"
                    label="Team Leader Name"
                    icon={User}
                    required
                    placeholder="Enter your full name"
                    value={formData.leaderName}
                    onChange={e => setFormData(p => ({ ...p, leaderName: e.target.value }))}
                  />
                  <div className="space-y-1">
                    <label htmlFor="leaderEmail" className={labelCls}>
                      <Mail className="w-3.5 h-3.5 text-black" />
                      Team Leader Email (Auto Filled)
                    </label>
                    <input
                      id="leaderEmail"
                      readOnly
                      disabled
                      value={user?.email || ''}
                      className={`${inputCls} bg-gray-100 text-gray-600 font-bold cursor-not-allowed border-dashed`}
                    />
                  </div>
                </div>

                {/* Team Size Selection (Min 2, Max 4) */}
                <div className="space-y-2 border-4 border-black p-4 bg-[#fbfbf8]">
                  <label className="font-black uppercase tracking-[0.2em] text-xs text-black block">
                    Team Size Limit (Min 2, Max 4) <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { size: 2, label: '2 Members', desc: 'Leader + 1 Member' },
                      { size: 3, label: '3 Members', desc: 'Leader + 2 Members' },
                      { size: 4, label: '4 Members', desc: 'Leader + 3 Members' },
                    ].map(opt => (
                      <button
                        type="button"
                        key={opt.size}
                        onClick={() => handleTeamSizeChange(opt.size)}
                        className={`p-3 border-4 font-black uppercase text-center transition-all ${formData.maxMembers === opt.size
                          ? 'border-black bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,0.3)]'
                          : 'border-black bg-white text-black hover:bg-gray-100'
                          }`}
                      >
                        <div className="text-sm">{opt.label}</div>
                        <div className={`text-[10px] font-bold mt-0.5 ${formData.maxMembers === opt.size ? 'text-gray-300' : 'text-gray-500'}`}>
                          {opt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Member Inputs (Ask ONLY for Emails) */}
                <div className="space-y-3 border-4 border-black p-4 bg-white">
                  <div className="flex items-center justify-between border-b-2 border-black/10 pb-2">
                    <p className="font-black uppercase tracking-widest text-xs">
                      Invited Teammate Emails ({formData.memberEmails.length} Required)
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Member names & details will auto-fetch when they join
                    </span>
                  </div>

                  {formData.memberEmails.map((emailVal, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="font-black uppercase tracking-widest text-[11px] text-gray-600 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-black" />
                        Member {idx + 2} Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={`e.g. teammate${idx + 2}@college.edu`}
                        value={emailVal}
                        onChange={e => handleMemberEmailChange(idx, e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>

                {/* Error Banner */}
                <ErrorMsg msg={error} />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.2em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {view === 'create' ? 'Creating Team & Generating Code…' : 'Saving Changes…'}
                    </>
                  ) : (
                    <>
                      {view === 'create' ? 'Create Team & Get Code' : 'Save Changes'} <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* VIEW 3: TEAM CREATED SUCCESS SCREEN */}
          {!loading && view === 'success' && createdTeam && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-black border-4 border-black text-white flex items-center justify-center mx-auto shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>

              <div>
                <p className="font-black text-xs uppercase tracking-[0.3em] text-green-600 mb-1">Registration Complete</p>
                <h4 className="text-3xl font-black uppercase tracking-tight">✔ Team Created Successfully</h4>
              </div>

              {/* Team Info Card */}
              <div className="border-4 border-black p-6 bg-[#fffefa] text-left space-y-4 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
                  <div>
                    <p className="font-black uppercase tracking-widest text-xs text-gray-400">Team Name</p>
                    <p className="font-black text-2xl uppercase tracking-tight text-black">{createdTeam.teamName}</p>
                  </div>
                  <span className="px-3 py-1 bg-black text-white font-black text-xs uppercase tracking-widest">
                    ACTIVE
                  </span>
                </div>

                {/* Team Code Display */}
                <div className="p-4 border-4 border-black bg-blue-50 text-center space-y-2">
                  <p className="font-black uppercase tracking-[0.2em] text-xs text-blue-900">Your Team Code</p>
                  <p className="font-mono font-black text-4xl tracking-wider text-black select-all">
                    {createdTeam.teamCode}
                  </p>
                  <p className="font-bold text-xs text-gray-600 uppercase tracking-widest">
                    Share this code with your teammates to let them join.
                  </p>
                </div>

                {/* Copy Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleCopyCode}
                    className="py-3 px-4 border-4 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? 'Code Copied!' : 'Copy Team Code'}
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="py-3 px-4 border-4 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
                    {copiedLink ? 'Link Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>

              <button
                onClick={async () => {
                  const existingData = await fetchUserTeamData(user.uid);
                  setActiveTeamData(existingData);
                  setView('dashboard');
                }}
                className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.2em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Go To Team Dashboard →
              </button>
            </motion.div>
          )}

          {/* VIEW 4: JOIN TEAM FORM */}
          {!loading && view === 'join' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-red-600">Join Existing Team</p>
                  <h4 className="text-2xl font-black uppercase tracking-tight">Enter Team Code</h4>
                </div>
                <button
                  onClick={() => setView('choice')}
                  className="px-3 py-1.5 border-2 border-black font-black text-xs uppercase tracking-widest hover:bg-gray-100"
                >
                  ← Back
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Field
                      id="joinCode"
                      label="Team Code"
                      icon={Hash}
                      placeholder="e.g. SPV-7KQ4P"
                      value={joinCodeInput}
                      onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                    />
                  </div>
                  <button
                    onClick={() => handleSearchTeam()}
                    disabled={submitting}
                    className="mt-6 px-6 border-4 border-black bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search Team'}
                  </button>
                </div>

                <ErrorMsg msg={error} />

                {/* Display Found Team & Member Profile Form */}
                {foundTeam && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-4 border-black p-5 bg-[#fffefa] space-y-4">
                    <div className="border-b-2 border-black/10 pb-3">
                      <p className="font-black text-xs uppercase tracking-widest text-gray-500">Team Found</p>
                      <h5 className="text-2xl font-black uppercase text-black">{foundTeam.teamName}</h5>
                      <p className="font-bold text-xs text-gray-600 mt-1">
                        Leader: <span className="font-black text-black">{foundTeam.leaderName}</span> · College: <span className="font-black text-black">{foundTeam.college}</span>
                      </p>
                      <p className="font-bold text-xs text-blue-700 mt-1">
                        Problem Statement: {foundTeam.problemStatement}
                      </p>
                    </div>

                    {/* Member Profile Confirmation/Completion */}
                    <div className="space-y-3">
                      <p className="font-black uppercase tracking-widest text-xs text-gray-700">
                        Confirm Your Profile Details (Will be added to team)
                      </p>
                      <Field
                        id="memName"
                        label="Your Full Name"
                        icon={User}
                        required
                        placeholder="Enter your name"
                        value={memberProfile.name}
                        onChange={e => setMemberProfile(p => ({ ...p, name: e.target.value }))}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field
                          id="memCollege"
                          label="Your College"
                          icon={Building2}
                          required
                          placeholder="College name"
                          value={memberProfile.college}
                          onChange={e => setMemberProfile(p => ({ ...p, college: e.target.value }))}
                        />
                        <Field
                          id="memDept"
                          label="Your Department"
                          icon={GraduationCap}
                          required
                          placeholder="Department"
                          value={memberProfile.department}
                          onChange={e => setMemberProfile(p => ({ ...p, department: e.target.value }))}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleJoinTeamSubmit}
                      disabled={submitting || (foundTeam.joinedMemberUids?.length >= foundTeam.maxMembers)}
                      className="w-full py-4 border-4 border-black bg-[#1f2022] text-white font-black uppercase tracking-[0.2em] text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Join Team →'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* VIEW 5: FULL TEAM DASHBOARD */}
          {!loading && view === 'dashboard' && activeTeamData?.team && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <div>
                  <span className="px-3 py-1 bg-green-600 text-white font-black text-xs uppercase tracking-widest border-2 border-black inline-block mb-1">
                    REGISTERED TEAM
                  </span>
                  <div className="flex items-center gap-3">
                    <h4 className="text-3xl font-black uppercase tracking-tight">{activeTeamData.team.teamName}</h4>
                    {activeTeamData.team.leaderUid === user?.uid && (
                      <button 
                        onClick={handleEditClick}
                        className="px-3 py-1 text-xs border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-black uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        Edit Team
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-xs uppercase tracking-widest text-gray-500">Team Size</p>
                  <p className="font-black text-lg text-black">
                    {activeTeamData.team.joinedMemberUids?.length || 1} / {activeTeamData.team.maxMembers} Members
                  </p>
                </div>
              </div>

              {/* Team Code Section */}
              <div className="border-4 border-black p-5 bg-blue-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black uppercase tracking-[0.2em] text-xs text-blue-950">Team Code</p>
                    <p className="font-mono font-black text-3xl tracking-wider text-black select-all">
                      {activeTeamData.team.teamCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="py-2.5 px-3 border-2 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCode ? 'Copied' : 'Copy Code'}
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="py-2.5 px-3 border-2 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <LinkIcon className="w-3.5 h-3.5" />}
                      {copiedLink ? 'Copied' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-4 border-black p-4 bg-white">
                <div>
                  <p className="font-black uppercase tracking-widest text-[11px] text-gray-400">College</p>
                  <p className="font-bold text-sm text-black">{activeTeamData.team.college}</p>
                </div>
                <div>
                  <p className="font-black uppercase tracking-widest text-[11px] text-gray-400">Department</p>
                  <p className="font-bold text-sm text-black">{activeTeamData.team.department}</p>
                </div>
                <div className="md:col-span-2 border-t-2 border-black/10 pt-3">
                  <p className="font-black uppercase tracking-widest text-[11px] text-gray-400">Problem Statement</p>
                  <p className="font-bold text-sm text-blue-900">{activeTeamData.team.problemStatement}</p>
                </div>
              </div>

              {/* Team Members List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-black uppercase tracking-wider text-sm">
                    Team Members ({activeTeamData.members.length} Joined)
                  </h5>
                </div>

                <div className="space-y-3">
                  {/* Render Joined Members */}
                  {activeTeamData.members.map((m) => (
                    <div key={m.id || m.uid} className="p-4 border-4 border-black bg-[#fffefa] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black uppercase text-base text-black">{m.name}</span>
                          {m.role === 'leader' ? (
                            <span className="px-2 py-0.5 bg-black text-white font-black text-[10px] uppercase tracking-widest">
                              TEAM LEADER
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] uppercase tracking-widest border border-blue-300">
                              JOINED MEMBER
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-xs text-gray-600">{m.email}</p>
                        <p className="font-bold text-xs text-gray-400 uppercase tracking-widest">
                          {m.college} · {m.department}
                        </p>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                    </div>
                  ))}

                  {/* Render Pending Invited Emails */}
                  {(activeTeamData.team.invitedEmails || []).map((email, idx) => {
                    // Check if this invited email has already joined in members list
                    const alreadyJoined = activeTeamData.members.some(
                      m => m.email?.toLowerCase() === email.toLowerCase()
                    );
                    if (alreadyJoined) return null;

                    return (
                      <div key={idx} className="p-4 border-4 border-dashed border-gray-400 bg-gray-50 flex items-center justify-between opacity-80">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black uppercase text-sm text-gray-700">{email}</span>
                            <span className="px-2 py-0.5 bg-yellow-200 text-yellow-900 font-bold text-[10px] uppercase tracking-widest border border-yellow-400">
                              PENDING JOIN
                            </span>
                          </div>
                          <p className="font-bold text-xs text-gray-400 mt-0.5">
                            Waiting for user to log in and enter code {activeTeamData.team.teamCode}
                          </p>
                        </div>
                        <Loader2 className="w-5 h-5 text-yellow-600 animate-spin shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
};

export default HackathonModal;
