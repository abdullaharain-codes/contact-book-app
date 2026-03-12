import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useContacts from '../../hooks/useContacts';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { validateEmail, validatePhone } from '../../utils/helpers';

// ── Shared input styles ────────────────────────────────────
const inputBase = `w-full bg-[#0f172a] border rounded-lg px-3 py-2 text-white
  placeholder-[#94a3b8] focus:outline-none focus:ring-2
  focus:ring-[#6366f1] focus:border-transparent transition-colors min-h-[44px]`;

const inputNormal = `${inputBase} border-[#334155]`;
const inputError  = `${inputBase} border-red-500`;
const labelClass  = 'text-sm font-medium text-[#94a3b8] mb-1 block';

// ── Icons ──────────────────────────────────────────────────
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

// ── Toggle Switch ──────────────────────────────────────────
const ToggleSwitch = ({ checked, onChange }) => (
  <div
    className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
      checked ? 'bg-[#6366f1]' : 'bg-[#334155]'
    }`}
    onClick={() => onChange(!checked)}
  >
    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full
      transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </div>
);

// ── ContactModal ───────────────────────────────────────────
const ContactModal = ({
  isOpen,
  onClose,
  mode = 'add',
  contact = null,
  initialGroup = null,
}) => {
  const { addContact, editContact, loading: contextLoading } = useContacts();

  const defaultForm = {
    first_name:  '',
    last_name:   '',
    email:       '',
    phone:       '',
    company:     '',
    job_title:   '',
    group:       'other',
    address:     '',
    notes:       '',
    is_favorite: false,
  };

  const [formData,       setFormData]       = useState(defaultForm);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors,         setErrors]         = useState({});
  const [submitting,     setSubmitting]     = useState(false);
  const [submitError,    setSubmitError]    = useState('');
  const fileInputRef = useRef(null);

  // Pre-fill / reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setSubmitError('');

    if (mode === 'edit' && contact) {
      setFormData({
        first_name:  contact.first_name  || '',
        last_name:   contact.last_name   || '',
        email:       contact.email       || '',
        phone:       contact.phone       || '',
        company:     contact.company     || '',
        job_title:   contact.job_title   || '',
        group:       contact.group       || 'other',
        address:     contact.address     || '',
        notes:       contact.notes       || '',
        is_favorite: contact.is_favorite || false,
      });
      setProfilePreview(null);
      setProfilePicture(null);
    } else {
      setFormData({ ...defaultForm, group: initialGroup || 'other' });
      setProfilePreview(null);
      setProfilePicture(null);
    }
  }, [isOpen, mode, contact, initialGroup]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicture(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!formData.first_name.trim()) errs.first_name = 'First name is required';
    if (formData.email && !validateEmail(formData.email)) errs.email = 'Invalid email format';
    if (formData.phone && !validatePhone(formData.phone)) errs.phone = 'Invalid phone format';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (profilePicture) data.append('profile_picture', profilePicture);

      if (mode === 'add') {
        await addContact(data);
      } else {
        await editContact(contact.id, data);
      }
      onClose();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.error || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Avatar preview: show local base64 if new file, else existing filename
  const avatarName = `${formData.first_name} ${formData.last_name}`.trim();

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-[#1e293b] rounded-t-2xl md:rounded-2xl w-full max-w-2xl
                   max-h-[92vh] md:max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="sticky top-0 bg-[#1e293b] border-b border-[#334155]
                        px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-10">
          <h2 className="text-lg md:text-xl font-semibold text-white">
            {mode === 'add' ? 'Add New Contact' : 'Edit Contact'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white transition-colors
                       min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">

          {/* ── Profile Picture ── */}
          <div className="flex flex-col items-center">
            {profilePreview ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#6366f1]">
                <img src={profilePreview} alt="preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <Avatar name={avatarName} profilePicture={contact?.profile_picture} size="lg" />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
              className="hidden"
            />
            <Button
              type="button" variant="ghost" size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 min-h-[44px]"
            >
              <UploadIcon />
              <span className="ml-2">Upload Photo</span>
            </Button>
            {profilePicture && (
              <p className="text-xs text-[#94a3b8] mt-1 truncate max-w-xs">{profilePicture.name}</p>
            )}
          </div>

          {/* ── Submit error ── */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
              {submitError}
            </div>
          )}

          {/* ── Basic Info Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

            <div>
              <label className={labelClass}>First Name *</label>
              <input
                type="text" name="first_name" value={formData.first_name}
                onChange={handleInputChange} placeholder="John"
                className={errors.first_name ? inputError : inputNormal}
              />
              {errors.first_name && (
                <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text" name="last_name" value={formData.last_name}
                onChange={handleInputChange} placeholder="Doe"
                className={inputNormal}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleInputChange} placeholder="john@example.com"
                className={errors.email ? inputError : inputNormal}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={handleInputChange} placeholder="+1 234 567 8900"
                className={errors.phone ? inputError : inputNormal}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Company</label>
              <input
                type="text" name="company" value={formData.company}
                onChange={handleInputChange} placeholder="Acme Inc."
                className={inputNormal}
              />
            </div>

            <div>
              <label className={labelClass}>Job Title</label>
              <input
                type="text" name="job_title" value={formData.job_title}
                onChange={handleInputChange} placeholder="Software Engineer"
                className={inputNormal}
              />
            </div>

          </div>

          {/* ── Additional Info ── */}
          <div className="space-y-3 md:space-y-4">

            <div>
              <label className={labelClass}>Group</label>
              <select
                name="group" value={formData.group} onChange={handleInputChange}
                className={inputNormal}
              >
                <option value="other">Other</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
                <option value="work">Work</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <textarea
                name="address" value={formData.address}
                onChange={handleInputChange} rows="2"
                placeholder="123 Main St, City, State"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2
                           text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2
                           focus:ring-[#6366f1] focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                name="notes" value={formData.notes}
                onChange={handleInputChange} rows="3"
                placeholder="Additional notes about this contact..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2
                           text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2
                           focus:ring-[#6366f1] focus:border-transparent transition-colors"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="text-sm font-medium text-[#94a3b8]">Mark as Favorite</label>
              <ToggleSwitch
                checked={formData.is_favorite}
                onChange={(val) => setFormData(prev => ({ ...prev, is_favorite: val }))}
              />
            </div>

          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#334155]">
            <Button
              type="button" variant="ghost" onClick={onClose}
              disabled={submitting} className="w-full sm:w-auto min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              type="submit" variant="primary"
              loading={submitting || contextLoading}
              disabled={submitting}
              className="w-full sm:w-auto min-h-[44px]"
            >
              {mode === 'add' ? 'Add Contact' : 'Save Changes'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

ContactModal.propTypes = {
  isOpen:       PropTypes.bool.isRequired,
  onClose:      PropTypes.func.isRequired,
  mode:         PropTypes.oneOf(['add', 'edit']),
  contact:      PropTypes.object,
  initialGroup: PropTypes.string,
};

export default ContactModal;