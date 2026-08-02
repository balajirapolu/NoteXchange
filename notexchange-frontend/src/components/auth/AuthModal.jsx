import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff, BookOpen, CheckCircle2 } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();
  
  const isLogin = authModalMode === 'login';
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg('Sign in successful!');
        setTimeout(closeAuthModal, 600);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        setIsSubmitting(false);
        return;
      }
      const res = await register(name, email, password);
      if (res.success) {
        setSuccessMsg('Account created successfully!');
        setTimeout(closeAuthModal, 600);
      } else {
        setErrorMsg(res.message);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 w-full max-w-md overflow-hidden relative">
        
        {/* Modal Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-navy-main p-6 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-teal-main flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-500/30">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
          <p className="text-xs text-sky-200 mt-1">
            {isLogin ? 'Sign in to access your notes' : 'Join NoteXchange academic community'}
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-main flex-shrink-0" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Balaji Rapolu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-main hover:bg-[#00796b] text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-teal-600/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {isLogin ? 'New to NoteXchange? ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode(isLogin ? 'register' : 'login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-teal-main font-bold hover:underline ml-1"
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
