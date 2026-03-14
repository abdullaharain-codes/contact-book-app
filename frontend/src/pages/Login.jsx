import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const { login, authError, setAuthError } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [formData,   setFormData]   = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors,     setErrors]     = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    if (authError) setAuthError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim())    errs.email    = 'Email is required';
    if (!formData.password.trim()) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const result = await login(formData.email, formData.password);
    setSubmitting(false);
    if (result.success) navigate(from, { replace: true });
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-[#94a3b8] mt-1">Sign in to your contact book</p>
        </div>

        {/* Card */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-[#334155]">

          {/* Auth error */}
          {authError && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-400 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#94a3b8] mb-1 block">
                Email
              </label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="you@example.com"
                className={inputClass('email')} autoComplete="email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-[#94a3b8] mb-1 block">
                Password
              </label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="••••••••"
                className={inputClass('password')} autoComplete="current-password"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
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
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[#94a3b8] text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#6366f1] hover:text-[#4f46e5] font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;