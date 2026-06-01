import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, AlertCircle, Chrome } from 'lucide-react';

export default function Login({ setCurrentTab }) {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isSignUp && !fullName) {
      setError('Please provide your full name.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const res = await register(email, password, fullName);
        if (res.success) {
          // Auto login after registration
          const logRes = await login(email, password);
          if (logRes.success) {
            setCurrentTab('dashboard');
          } else {
            setError(logRes.error || 'Registration succeeded, but login failed.');
          }
        } else {
          setError(res.error || 'Registration failed');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          setCurrentTab('dashboard');
        } else {
          setError(res.error || 'Invalid credentials');
        }
      }
    } catch (e) {
      setError('An unexpected transaction error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await login('portfolio.student@iare.edu.in', 'mockpassword');
      if (res.success) {
        setCurrentTab('dashboard');
      } else {
        setError('Google SSO authentication mock failed.');
      }
    } catch (e) {
      setError('Failed during authentication mock process.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-73px)] grid-mesh dark:grid-mesh flex items-center justify-center py-12 px-6 relative bg-gray-50 dark:bg-darkBg transition-colors">
      <div className="glow-blob bg-primary/10 top-1/4 left-1/3 animate-pulse-slow" />
      
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard backdrop-blur-xl p-8 shadow-2xl relative z-10 transition hover:border-primary/10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white mb-4">
            <Sparkles size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            {isSignUp ? 'Create your platform account' : 'Sign in to your platform'}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            AI Placement Screening and Resume Matching Engine
          </p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-gray-400">FULL NAME</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Jhon Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs focus:border-primary focus:outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-gray-400">EMAIL ADDRESS</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3 text-gray-400" />
              <input
                type="email"
                placeholder="jhon.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs focus:border-primary focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-gray-400">PASSWORD</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('Demo Feature: Simply log in with any email and password.')}
                  className="text-[10px] text-primary-light hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs focus:border-primary focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Register Account' : 'Sign In')}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-white/5" />
          <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-gray-200 dark:border-white/5" />
        </div>

        {/* Google SSO Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center justify-center gap-2.5 transition"
        >
          <Chrome size={16} className="text-red-500" />
          <span>Google Accounts</span>
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-primary-light hover:underline font-bold"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
