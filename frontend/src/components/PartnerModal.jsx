import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Handshake, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const PARTNER_ROLES = [
  "Sponsor",
  "Product Showcase / Brand Display",
  "Investor",
  "Ecosystem Partner",
  "Startup Enabler",
  "Corporate Partner",
  "Incubator / Accelerator",
  "Mentor / Industry Expert",
  "Government / Institutional Partner",
  "Media / Content Partner",
  "Community / Student Organisation",
  "Other"
];

const inputCls = "w-full border-4 border-black px-4 py-3 font-bold text-sm focus:outline-none focus:ring-0 focus:border-blue-600 bg-white placeholder:text-gray-400 transition-colors";
const labelCls = "block font-black uppercase tracking-[0.15em] text-xs text-gray-700 mb-1.5";

const Field = ({ id, label, required = false, isTextArea, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={id} className={labelCls}>
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {isTextArea ? (
      <textarea id={id} {...props} className={`${inputCls} min-h-[120px] resize-y`} />
    ) : (
      <input id={id} {...props} className={inputCls} />
    )}
  </div>
);

const PartnerModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    role: 'Sponsor',
    name: '',
    organization: '',
    designation: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name.trim() || !formData.organization.trim() || !formData.email.trim() || !formData.phone.trim()) {
        throw new Error('Please fill out all required fields.');
      }

      await api.post('/api/partners', formData);

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        role: 'Sponsor',
        name: '',
        organization: '',
        designation: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        message: ''
      });
      setError('');
    }, 300);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={resetAndClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-50 w-full max-w-2xl max-h-[90vh] bg-[#fffdfa] border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-black text-white p-4 md:p-5 flex items-center justify-between shrink-0 border-b-4 border-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-white bg-black-600 flex items-center justify-center font-black">
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-black-400">Collaboration</p>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Partner with Us</h3>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="w-10 h-10 border-2 border-white bg-red-600 text-white flex items-center justify-center font-black hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-20 h-20 mx-auto bg-green-500 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">THANKS FOR REACHING OUT!</h3>
                  <p className="text-gray-600 font-medium leading-relaxed max-w-md mx-auto">
                    Our team has received your details and will get in touch with you soon.<br /><br />
                    <span className="font-bold text-black px-2 py-1">On average, we respond within 2–3 hours.</span>
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 text-red-700 font-bold text-sm">
                    {error}
                  </div>
                )}

                <Field
                  id="name"
                  name="name"
                  label="Your Name"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <div className="space-y-1">
                  <label htmlFor="role" className={labelCls}>Join us as <span className="text-red-600">*</span></label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className={`${inputCls} cursor-pointer`}
                  >
                    {PARTNER_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    id="organization"
                    name="organization"
                    label="Organization"
                    required
                    placeholder="Company Name"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                  <Field
                    id="designation"
                    name="designation"
                    label="Designation"
                    placeholder="Your Designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    required
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Field
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    required
                    placeholder="Your Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <Field
                    id="location"
                    name="location"
                    label="Location"
                    placeholder="City"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <Field
                  id="website"
                  name="website"
                  label="Website / LinkedIn"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={handleChange}
                />

                <Field
                  id="message"
                  name="message"
                  isTextArea
                  label="Explain in detail, How would you like to collaborate with Startup Peravai"
                  placeholder="Share your thoughts and ideas..."
                  value={formData.message}
                  onChange={handleChange}
                />

                <div className="pt-4 border-t-4 border-black/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-6 py-3 font-black text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-sm border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PartnerModal;
