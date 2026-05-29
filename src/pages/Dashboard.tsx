import React, { useEffect, useState } from 'react';
import {
  Plus, FileText, TrendingUp, Clock, ChevronRight, MoreVertical,
  Trash2, Edit3, Copy, LayoutTemplate, Sparkles, Moon, Sun,
  LogOut, User, Home, Settings, Bell, Search, BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase, Resume } from '../lib/supabase';

type DashboardProps = {
  onNavigate: (page: 'landing' | 'builder' | 'login') => void;
  onEditResume: (resumeId: string) => void;
};

export default function Dashboard({ onNavigate, onEditResume }: DashboardProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('resumes')
      .select('*')
      .order('updated_at', { ascending: false });
    setResumes(data as Resume[] || []);
    setLoading(false);
  };

  const deleteResume = async (id: string) => {
    await supabase.from('resumes').delete().eq('id', id);
    setResumes(prev => prev.filter(r => r.id !== id));
    setMenuOpen(null);
  };

  const duplicateResume = async (resume: Resume) => {
    const { data } = await supabase
      .from('resumes')
      .insert({
        user_id: user!.id,
        title: `${resume.title} (Copy)`,
        template: resume.template,
        accent_color: resume.accent_color,
        font: resume.font,
        content: resume.content,
        ats_score: resume.ats_score,
      })
      .select()
      .single();
    if (data) setResumes(prev => [data as Resume, ...prev]);
    setMenuOpen(null);
  };

  const getTemplateColor = (template: string) => {
    if (template === 'dark') return 'from-gray-700 to-gray-900';
    if (template === 'modern') return 'from-primary-500 to-accent-600';
    return 'from-gray-400 to-gray-600';
  };

  const getAtsColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  };

  const stats = [
    { label: 'Total Resumes', value: resumes.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Avg ATS Score', value: resumes.length ? Math.round(resumes.reduce((a, r) => a + r.ats_score, 0) / resumes.length) + '%' : '—', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Last Updated', value: resumes[0] ? new Date(resumes[0].updated_at).toLocaleDateString() : '—', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { label: 'Templates Used', value: new Set(resumes.map(r => r.template)).size, icon: LayoutTemplate, color: 'text-accent-600', bg: 'bg-accent-100 dark:bg-accent-900/30' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              Resume<span className="gradient-text">AI</span>
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: Home, label: 'Dashboard', active: true },
            { icon: FileText, label: 'My Resumes', active: false },
            { icon: LayoutTemplate, label: 'Templates', active: false },
            { icon: BarChart3, label: 'Analytics', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          {profileOpen && (
            <div className="mt-2 space-y-1 animate-fade-in">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={() => { signOut(); onNavigate('login'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search resumes..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
              Welcome back, {displayName.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {resumes.length === 0
                ? "You haven't created any resumes yet. Start building your first one!"
                : `You have ${resumes.length} resume${resumes.length > 1 ? 's' : ''}. Keep it updated!`}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className={`inline-flex p-2 rounded-xl ${stat.bg} mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white font-heading">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Resumes section */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white font-heading">My Resumes</h2>
            <button
              onClick={() => onNavigate('builder')}
              className="btn-primary py-2 px-4 text-sm"
            >
              <Plus className="w-4 h-4" />
              New Resume
            </button>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
                  <div className="h-36 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Create your first AI-powered resume and start landing more interviews.</p>
              <button onClick={() => onNavigate('builder')} className="btn-primary">
                <Plus className="w-5 h-5" />
                Create Your First Resume
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* New resume card */}
              <button
                onClick={() => onNavigate('builder')}
                className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="font-semibold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">New Resume</span>
              </button>

              {resumes.map(resume => (
                <div
                  key={resume.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
                >
                  {/* Template preview */}
                  <div className={`h-36 bg-gradient-to-br ${getTemplateColor(resume.template)} relative flex items-center justify-center`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 w-32">
                      <div className="space-y-1.5">
                        <div className="h-3 bg-white/80 rounded w-20" />
                        <div className="h-2 bg-white/50 rounded w-14" />
                        <div className="mt-2 space-y-1">
                          <div className="h-1.5 bg-white/30 rounded w-full" />
                          <div className="h-1.5 bg-white/30 rounded w-3/4" />
                        </div>
                      </div>
                    </div>

                    {/* Menu */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === resume.id ? null : resume.id); }}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen === resume.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-10 animate-fade-in">
                          <button onClick={() => { onEditResume(resume.id); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Edit3 className="w-4 h-4" />Edit
                          </button>
                          <button onClick={() => duplicateResume(resume)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Copy className="w-4 h-4" />Duplicate
                          </button>
                          <hr className="border-gray-100 dark:border-gray-700 my-1" />
                          <button onClick={() => deleteResume(resume.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 className="w-4 h-4" />Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resume info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{resume.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{resume.template} template</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${getAtsColor(resume.ats_score)}`}>
                        {resume.ats_score}%
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => onEditResume(resume.id)}
                        className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Edit <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
