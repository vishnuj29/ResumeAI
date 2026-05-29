import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Eye, Download, FileText,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Resume } from '../lib/supabase';

type AnalyticsProps = {
  onNavigate: (page: 'dashboard' | 'builder') => void;
};

export default function Analytics({ onNavigate }: AnalyticsProps) {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('resumes')
      .select('*')
      .order('updated_at', { ascending: false });
    setResumes((data as Resume[]) || []);
    setLoading(false);
  };

  // Fake analytics data
  const totalViews = resumes.length * 12 + Math.floor(Math.random() * 50);
  const totalDownloads = resumes.length * 3 + Math.floor(Math.random() * 20);
  const avgAtsScore = resumes.length > 0
    ? Math.round(resumes.reduce((a, r) => a + r.ats_score, 0) / resumes.length)
    : 0;
  const completionRate = resumes.length > 0
    ? Math.min(100, resumes.length * 20 + Math.floor(Math.random() * 20))
    : 0;

  const metrics = [
    {
      id: 'ats',
      title: 'ATS Score Average',
      value: `${avgAtsScore}%`,
      change: '+5%',
      trend: 'up',
      color: 'bg-green-500',
      icon: Target,
      description: 'Your resumes are optimized for applicant tracking systems',
    },
    {
      id: 'views',
      title: 'Profile Views',
      value: totalViews.toString(),
      change: '+12%',
      trend: 'up',
      color: 'bg-blue-500',
      icon: Eye,
      description: 'Total times your resume was viewed this month',
    },
    {
      id: 'downloads',
      title: 'Downloads',
      value: totalDownloads.toString(),
      change: '+8%',
      trend: 'up',
      color: 'bg-purple-500',
      icon: Download,
      description: 'Number of times your resume was downloaded',
    },
    {
      id: 'resume_completion',
      title: 'Resume Completion',
      value: `${completionRate}%`,
      change: `${completionRate >= 80 ? '+' : ''}${completionRate >= 80 ? '5' : '-10'}%`,
      trend: completionRate >= 80 ? 'up' : 'down',
      color: completionRate >= 80 ? 'bg-green-500' : 'bg-yellow-500',
      icon: FileText,
      description: 'Overall completion rate of all your resumes',
    },
  ];

  // Monthly data (fake)
  const monthlyData = [
    { month: 'Jan', views: 24, downloads: 8 },
    { month: 'Feb', views: 35, downloads: 12 },
    { month: 'Mar', views: 42, downloads: 15 },
    { month: 'Apr', views: 38, downloads: 10 },
    { month: 'May', views: 55, downloads: 18 },
    { month: 'Jun', views: totalViews, downloads: totalDownloads },
  ];

  const maxViews = Math.max(...monthlyData.map(d => d.views));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar - Same as Dashboard */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col hidden lg:flex">
        {/* Sidebar content same as Dashboard */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">Resume<span className="text-blue-600">AI</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: 'Dashboard', label: 'Dashboard', active: false },
            { icon: 'Files', label: 'My Resumes', active: false },
            { icon: 'LayoutTemplate', label: 'Templates', active: false },
            { icon: 'Sparkles', label: 'AI Assistant', active: false },
            { icon: 'Chart', label: 'Analytics', active: true },
            { icon: 'Settings', label: 'Settings', active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                item.active
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Track your resume performance</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Metrics cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl ${metric.color}`}>
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500 flex items-center gap-0.5'}`}>
                    {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : null}
                    {metric.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                <div className="text-sm text-gray-500 mt-1">{metric.title}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Views chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Profile Views</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Monthly view tracking</p>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {monthlyData.map((d, i) => (
                  <div key={d.month} className="flex items-center gap-4">
                    <span className="w-10 text-xs text-gray-500">{d.month}</span>
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.views / maxViews) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                    <span className="w-8 text-xs font-medium text-gray-700 dark:text-gray-300 text-right">{d.views}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Downloads chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Downloads</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Resume download trends</p>
                </div>
                <Download className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {monthlyData.map((d, i) => (
                  <div key={d.month} className="flex items-center gap-4">
                    <span className="w-10 text-xs text-gray-500">{d.month}</span>
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.downloads / Math.max(...monthlyData.map(x => x.downloads))) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                    <span className="w-8 text-xs font-medium text-gray-700 dark:text-gray-300 text-right">{d.downloads}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Resume performance table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Resume Performance</h3>
                <p className="text-sm text-gray-500 mt-0.5">Individual resume analytics</p>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {resumes.length > 0 ? resumes.map((resume, i) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onNavigate('builder')}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">{resume.title}</div>
                    <div className="text-sm text-gray-500">{new Date(resume.updated_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 20) + 5}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Download className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 5) + 1}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      resume.ats_score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      resume.ats_score >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      ATS {resume.ats_score}%
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No resume data yet</p>
                  <button
                    onClick={() => onNavigate('builder')}
                    className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Create your first resume
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
