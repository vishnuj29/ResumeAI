import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, FileText, Sparkles, ArrowLeft, Mail, Lock, User, AlertCircle, CheckCircle, Loader2, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaGithub } from 'react-icons/fa';

type AuthPage = 'login' | 'signup' | 'forgot-password';

type AuthProps = {
  page: AuthPage;
  onNavigate: (page: 'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard') => void;
};

function PasswordStrengthMeter({ password }: { password: string }) {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-500'];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-2"
    >
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < strength ? colors[strength - 1] : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${strength <= 2 ? 'text-red-500' : strength === 3 ? 'text-yellow-600' : 'text-green-500'}`}>
        {labels[strength - 1] || 'Too weak'}
      </p>
    </motion.div>
  );
}

export default function Auth({ page, onNavigate }: AuthProps) {
  const { signIn, signUp, resetPassword, signInWithGoogle, signInWithGitHub } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (page === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message || 'Invalid email or password. Please try again.');
        } else {
          onNavigate('dashboard');
        }
      } else if (page === 'signup') {
        if (!fullName.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message || 'Failed to create account. Please try again.');
        } else {
          onNavigate('dashboard');
        }
      } else {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message || 'Failed to send reset email. Please try again.');
        } else {
          setSuccess('Password reset instructions sent to your email!');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Sparkles, text: 'AI-powered resume generation' },
    { icon: FileText, text: 'Professional ATS-friendly templates' },
    { icon: Zap, text: 'Real-time preview & editing' },
  ];

  return (
    <div className="min-h-screen relative flex">
      {/* Left panel — Visible on desktop */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        {/* Animated elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <span className="font-heading font-bold text-2xl">ResumeAI</span>
            </div>

            <h1 className="text-4xl font-bold font-heading mb-4 leading-tight">
              {page === 'login' ? "Welcome back to\nResumeAI" : page === 'signup' ? "Start your journey\nwith ResumeAI" : "Reset your\npassword"}
            </h1>

            <p className="text-white/80 text-lg mb-8">
              {page === 'login'
                ? "Sign in to continue building your career."
                : page === 'signup'
                ? "Create stunning, AI-powered resumes that get you hired."
                : "We'll help you get back to building your resume."}
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{f.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8">
              {[
                { value: '50K+', label: 'Resumes Created' },
                { value: '94%', label: 'Success Rate' },
                { value: '5*', label: 'User Rating' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Right panel — Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 ${page === 'signup' ? 'bg-gray-50 dark:bg-gray-950' : 'bg-white dark:bg-gray-900'}`}>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <motion.button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900 dark:text-white">
              Resume<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI</span>
            </span>
          </div>

          {/* Card */}
          <div className={`rounded-2xl p-8 ${page === 'signup' ? 'bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800' : ''}`}>
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                {page === 'login' ? 'Welcome back' : page === 'signup' ? 'Create your account' : 'Reset password'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                {page === 'login' ? "Sign in to continue building your career" :
                 page === 'signup' ? 'Start creating AI-powered resumes today' :
                 "We'll send you reset instructions"}
              </p>
            </div>

            {/* Error / Success */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 mb-5 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 mb-5 text-sm"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {page === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </motion.div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {page !== 'forgot-password' && (
                <>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  <AnimatePresence>
                    {page === 'signup' && password && (
                      <PasswordStrengthMeter password={password} />
                    )}
                  </AnimatePresence>
                </>
              )}

              {page === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {page === 'login' ? 'Sign In' : page === 'signup' ? 'Create Account' : 'Send Reset Email'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={async () => {
                  setError('');
                  const { error } = await signInWithGoogle();
                  if (error) setError(error.message || 'Failed to sign in with Google.');
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </motion.button>
              <motion.button
                type="button"
                onClick={async () => {
                  setError('');
                  const { error } = await signInWithGitHub();
                  if (error) setError(error.message || 'Failed to sign in with GitHub.');
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </motion.button>
            </div>

            {/* Footer link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              {page === 'login' ? (
                <>Don't have an account?{' '}
                  <button onClick={() => onNavigate('signup')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Sign up free
                  </button>
                </>
              ) : page === 'signup' ? (
                <>Already have an account?{' '}
                  <button onClick={() => onNavigate('login')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Sign in
                  </button>
                </>
              ) : (
                <>Remember your password?{' '}
                  <button onClick={() => onNavigate('login')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Terms */}
          {page === 'signup' && (
            <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
              By signing up, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
