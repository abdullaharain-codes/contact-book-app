import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const { register, authError, setAuthError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData,   setFormData]   = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors,     setErrors]     = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    if (authError) setAuthError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())                        errs.name     = 'Name is required';
    if (!formData.email.trim())                       errs.email    = 'Email is required';
    if (!formData.password)                           errs.password = 'Password is required';
    if (formData.password.length < 6)                 errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const result = await register(formData.name, formData.email, formData.password);
    setSubmitting(false);
    if (result.success) navigate('/', { replace: true });
  };

  const inputClass = (field) =>
    `w-full bg-[#0f172a] border ${
      errors[field] ? 'border-red-500' : 'border-[#334155]'
    } rounded-lg px-4 py-3 text-white placeholder-[#94a3b8]
    focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent
    transition-colors`;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-[#94a3b8] mt-1">Start managing your contacts</p>
        </div>

        {/* Card */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-[#334155]">

          {authError && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-400 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#94a3b8] mb-1 block">Full Name</label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="John Doe"
                className={inputClass('name')} autoComplete="name"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-[#94a3b8] mb-1 block">Email</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="you@example.com"
                className={inputClass('email')} autoComplete="email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-[#94a3b8] mb-1 block">Password</label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="Min. 6 characters"
                className={inputClass('password')} autoComplete="new-password"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-[#94a3b8] mb-1 block">Confirm Password</label>
              <input
                type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} placeholder="••••••••"
                className={inputClass('confirmPassword')} autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit" disabled={submitting}
              className="w-full bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50
                         disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg
                         transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[#94a3b8] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6366f1] hover:text-[#4f46e5] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;