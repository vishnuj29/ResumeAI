import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Moon, Sun, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type Page = 'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard' | 'builder';

type NavbarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
    { label: 'AI Features', href: '#ai' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              Resume<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI</span>
            </span>
          </motion.button>

          {/* Desktop nav */}
          {currentPage === 'landing' && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 text-sm"
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Dashboard
                </motion.button>
                <motion.button
                  onClick={signOut}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Out
                </motion.button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('signup')}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </motion.button>
              </div>
            )}

            <motion.button
              className="md:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:block"
          >
            <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-4 py-6 space-y-4">
              {currentPage === 'landing' && navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <>
                    <button onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }} className="block w-full text-left py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400">Dashboard</button>
                    <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left py-2 text-red-600 font-medium hover:text-red-700">Sign Out</button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => { onNavigate('login'); setMobileOpen(false); }} className="w-full py-2.5 text-center text-gray-700 dark:text-gray-300 font-medium bg-gray-100 dark:bg-gray-800 rounded-xl">Sign In</button>
                    <button onClick={() => { onNavigate('signup'); setMobileOpen(false); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium">
                      <Sparkles className="w-4 h-4" />Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
