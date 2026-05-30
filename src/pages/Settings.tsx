import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Shield, Palette, Moon, Sun,
  Save, CheckCircle, Loader2, Smartphone,
  CreditCard, FileText, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

type SettingsProps = {
  onNavigate: (page: 'landing' | 'dashboard') => void;
};

export default function Settings({ onNavigate }: SettingsProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.user_metadata?.full_name || 'User'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user?.user_metadata?.full_name || ''}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Appearance',
      icon: Palette,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Sun className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">Light</span>
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Moon className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Dark</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accent Color</label>
            <div className="flex flex-wrap gap-3">
              {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-xl transition-transform hover:scale-110 ring-2 ring-gray-900 dark:ring-white"
                  style={{ backgroundColor: color, padding: '2px' }}
                >
                  <div className="w-full h-full rounded-lg" style={{ backgroundColor: color }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email notifications', desc: 'Receive emails about your resume activity' },
            { key: 'marketing', label: 'Marketing emails', desc: 'News, updates, and promotional content' },
            { key: 'updates', label: 'Product updates', desc: 'New features and improvements' },
          ].map(item => (
            <div key={item.key} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={e => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Security',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Password</p>
                <p className="text-sm text-gray-500">Last changed 30 days ago</p>
              </div>
              <button className="px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Change
              </button>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Enable
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Billing',
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium opacity-80">Current Plan</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">Free</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
            <p className="text-sm opacity-80 mb-4">5 resumes, basic AI features</p>
          </div>

          <div className="border border-blue-200 dark:border-blue-900 rounded-xl p-6 text-center">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Upgrade to Pro</h4>
            <p className="text-sm text-gray-500 mb-4">Unlock unlimited resumes, advanced AI, and premium templates</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              Upgrade Now — $9/month
            </button>
          </div>
        </div>
      ),
    },
  ];

  const [activeSection, setActiveSection] = useState(settingsSections[0].title);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">Resume<span className="text-blue-600">AI</span></span>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {settingsSections.map(section => (
            <button
              key={section.title}
              onClick={() => setActiveSection(section.title)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                activeSection === section.title
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <section.icon className="w-5 h-5" />
              {section.title}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => { signOut(); onNavigate('landing'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
          </div>
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" />Saved!</>
            ) : (
              <><Save className="w-4 h-4" />Save Changes</>
            )}
          </motion.button>
        </header>

        <div className="p-6">
          <div className="max-w-2xl">
            {settingsSections.find(s => s.title === activeSection)?.content}
          </div>
        </div>
      </main>
    </div>
  );
}
