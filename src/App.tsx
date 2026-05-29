import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AIAssistant from './components/AIAssistant';
import { MessageSquare } from 'lucide-react';

type Page = 'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard' | 'builder' | 'analytics' | 'settings';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>('landing');
  const [editResumeId, setEditResumeId] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);

  const navigate = (p: Page) => {
    setPage(p);
    if (p !== 'builder') setEditResumeId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditResume = (id: string) => {
    setEditResumeId(id);
    setPage('builder');
  };

  const handleBuilderNavigate = (target: 'dashboard') => {
    navigate(target);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">Loading ResumeAI...</div>
        </div>
      </div>
    );
  }

  const hideNavbar = page === 'dashboard' || page === 'builder' || page === 'analytics' || page === 'settings';
  const isAuthPage = page === 'login' || page === 'signup' || page === 'forgot-password';
  const showAIButton = user && !isAuthPage && page !== 'builder';

  return (
    <div className="min-h-screen">
      {!hideNavbar && !isAuthPage && (
        <Navbar currentPage={page} onNavigate={navigate} />
      )}

      {page === 'landing' && (
        <Landing onNavigate={(p) => {
          if ((p === 'dashboard' || p === 'builder') && !user) {
            navigate('signup');
          } else {
            navigate(p);
          }
        }} />
      )}

      {(page === 'login' || page === 'signup' || page === 'forgot-password') && (
        <Auth page={page} onNavigate={navigate} />
      )}

      {page === 'dashboard' && user && (
        <Dashboard
          onNavigate={(p) => {
            if (p === 'builder') {
              setEditResumeId(null);
              navigate('builder');
            } else {
              navigate(p);
            }
          }}
          onEditResume={handleEditResume}
        />
      )}

      {page === 'builder' && user && (
        <ResumeBuilder
          resumeId={editResumeId}
          onNavigate={handleBuilderNavigate}
        />
      )}

      {page === 'analytics' && user && (
        <Analytics onNavigate={navigate} />
      )}

      {page === 'settings' && user && (
        <Settings onNavigate={navigate} />
      )}

      {/* Redirect if not logged in */}
      {(page === 'dashboard' || page === 'builder' || page === 'analytics' || page === 'settings') && !user && (
        <Auth page="login" onNavigate={navigate} />
      )}

      {/* AI Assistant Button */}
      {showAIButton && (
        <button
          onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl flex items-center justify-center z-40 hidden md:flex hover:shadow-2xl transition-shadow"
          style={{ boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* AI Assistant Panel */}
      <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
