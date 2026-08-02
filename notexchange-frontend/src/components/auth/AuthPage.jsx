import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  FileText,
  Star,
  GraduationCap
} from 'lucide-react';

export const AuthPage = ({ initialMode = 'login', onBackToHome }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg('Login successful! Redirecting...');
        setTimeout(() => {
          if (onBackToHome) onBackToHome();
        }, 600);
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
        setTimeout(() => {
          if (onBackToHome) onBackToHome();
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-navy-main font-sans">
      
      {/* LEFT SIDE PANEL - Solid Navy Blue Hero Section (As shown in sample design image) */}
      <div className="lg:w-1/2 bg-navy-main relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white min-h-[400px] lg:min-h-screen">
        
        {/* Subtle Decorative Background Shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-main/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-main flex items-center justify-center shadow-lg shadow-teal-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">NoteXchange Portal</h2>
              <p className="text-xs text-sky-200 font-medium">Academic Notes & Knowledge Hub</p>
            </div>
          </div>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="text-xs text-sky-200 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to App
            </button>
          )}
        </div>

        {/* Hero Central Typography */}
        <div className="relative z-10 my-auto py-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Exchange Your <br />
            <span className="text-teal-main">Notes</span> With Ease
          </h1>
          <p className="mt-6 text-sm sm:text-base text-sky-100/80 max-w-lg leading-relaxed">
            A complete collaborative platform for students and educators to share verified study materials, semester handouts, and peer ratings — all in one sleek workspace.
          </p>

          {/* 4 Feature Cards at bottom left (Matches exact 2x2 layout in sample UI) */}
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-lg">
            <div className="bg-navy-card/80 backdrop-blur-md p-4 rounded-xl border border-sky-500/20">
              <span className="text-[11px] font-semibold text-sky-300 block uppercase tracking-wider">Notes</span>
              <span className="text-sm font-bold text-white mt-0.5 block flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-main" /> PDF Sharing
              </span>
            </div>
            
            <div className="bg-navy-card/80 backdrop-blur-md p-4 rounded-xl border border-sky-500/20">
              <span className="text-[11px] font-semibold text-sky-300 block uppercase tracking-wider">Subjects</span>
              <span className="text-sm font-bold text-white mt-0.5 block flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-teal-main" /> All Semesters
              </span>
            </div>

            <div className="bg-navy-card/80 backdrop-blur-md p-4 rounded-xl border border-sky-500/20">
              <span className="text-[11px] font-semibold text-sky-300 block uppercase tracking-wider">Ratings</span>
              <span className="text-sm font-bold text-white mt-0.5 block flex items-center gap-1.5">
                <Star className="w-4 h-4 text-teal-main fill-teal-main" /> Peer Verified
              </span>
            </div>

            <div className="bg-navy-card/80 backdrop-blur-md p-4 rounded-xl border border-sky-500/20">
              <span className="text-[11px] font-semibold text-sky-300 block uppercase tracking-wider">Community</span>
              <span className="text-sm font-bold text-white mt-0.5 block flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-main" /> Free & Open
              </span>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 text-xs text-sky-300/70">
          © 2026 NoteXchange Academic Systems. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE PANEL - White Form Container (Matches exact UI from sample images) */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header Title */}
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-3xl font-extrabold text-navy-main tracking-tight">
              {isLogin ? 'Welcome back' : 'Create Account'}
            </h2>
            <p className="text-sm text-slate-500">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Join NoteXchange today and start sharing notes'}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-fade-in">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-teal-main flex-shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            
            {/* Register Full Name Field */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name (e.g. Balaji Rapolu)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email (e.g. user@example.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={isLogin ? "Enter your password" : "Min 6 characters"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Main Full-Width Teal Action Button (Exact style from sample UI image) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-teal-main hover:bg-[#00796b] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer Mode Switcher Link (Exact match with sample image) */}
          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {isLogin ? 'New to NoteXchange? ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
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
