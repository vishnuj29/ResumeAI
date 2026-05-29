import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Download, Eye, Zap, Shield, Palette, Globe, ChevronDown,
  ChevronUp, Star, ArrowRight, CheckCircle, FileText, Brain, Layout,
  TrendingUp, Clock, Users, Play, Wand2, LayoutDashboard, BarChart3,
  Target, PenTool, Lightbulb, MessageSquare, Send, Bot, RefreshCw,
  MousePointer2, FileDown, Settings, Copy, Layers, Monitor, Moon, Sun
} from 'lucide-react';

type LandingProps = {
  onNavigate: (page: 'login' | 'signup' | 'builder' | 'dashboard') => void;
};

const features = [
  {
    icon: Wand2,
    title: 'AI Resume Generator',
    description: 'Generate entire resumes from scratch with advanced AI. Just describe your career background and let AI create professional content.',
    gradient: 'from-blue-500 to-cyan-500',
    badge: 'Popular',
  },
  {
    icon: Shield,
    title: 'ATS-Friendly Templates',
    description: 'Every template is optimized to pass Applicant Tracking Systems, ensuring your resume reaches human recruiters.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Eye,
    title: 'Real-Time Preview',
    description: 'See your resume update instantly as you type. No more switching between edit and preview modes.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: FileDown,
    title: 'One-Click PDF Export',
    description: 'Download your resume as a perfectly formatted, print-ready PDF with a single click.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: BarChart3,
    title: 'Resume Analytics',
    description: 'Track views, downloads, and ATS scores. Get insights on how to improve your resume.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Palette,
    title: 'Dark Mode & Themes',
    description: 'Choose from beautiful themes, accent colors, and fonts. Customize every detail.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: MousePointer2,
    title: 'Drag-and-Drop Editor',
    description: 'Reorder sections with intuitive drag-and-drop. Build your resume your way.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Lightbulb,
    title: 'Smart AI Suggestions',
    description: 'Get real-time suggestions to improve your content as you type. Never miss an opportunity.',
    gradient: 'from-amber-500 to-orange-500',
    badge: 'New',
  },
];

const templates = [
  {
    id: 'minimal',
    name: 'Minimal Professional',
    description: 'Clean, structured layout perfect for corporate roles',
    badge: 'Most Popular',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    preview: (
      <div className="bg-white rounded-lg p-4 text-left shadow-sm transform scale-90">
        <div className="border-b-2 border-gray-900 pb-2 mb-3">
          <div className="h-4 w-32 bg-gray-900 rounded mb-1" />
          <div className="h-2 w-24 bg-gray-400 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-20 bg-gray-300 rounded" />
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-gray-200 rounded" />
            <div className="h-1.5 w-4/5 bg-gray-200 rounded" />
          </div>
          <div className="h-2 w-20 bg-gray-300 rounded mt-2" />
          <div className="flex gap-1">
            {['Python', 'React', 'Node'].map(s => (
              <div key={s} className="h-1.5 w-10 bg-gray-800 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'modern',
    name: 'Creative Gradient',
    description: 'Bold design with vibrant accents for creative roles',
    badge: 'Trending',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    preview: (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm transform scale-90">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div className="h-4 w-28 bg-white/80 rounded mb-1" />
          <div className="h-2 w-20 bg-white/50 rounded" />
        </div>
        <div className="p-3 space-y-2">
          <div className="h-2 w-16 bg-blue-600 rounded" />
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-gray-200 rounded" />
            <div className="h-1.5 w-4/5 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {['Design', 'UI/UX', 'Figma'].map(s => (
              <div key={s} className="h-1.5 w-10 bg-blue-200 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'corporate',
    name: 'Corporate Elegant',
    description: 'Sophisticated design for executive positions',
    badge: 'Executive',
    badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    preview: (
      <div className="bg-white rounded-lg p-4 text-left shadow-sm transform scale-90 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-slate-800" />
          <div className="flex-1">
            <div className="h-3 w-20 bg-slate-800 rounded mb-1" />
            <div className="h-2 w-16 bg-slate-400 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-20 bg-slate-300 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'dark',
    name: 'Dark Resume',
    description: 'Striking dark theme that stands out from the crowd',
    badge: 'Premium',
    badgeColor: 'bg-gray-800 text-gray-100 dark:bg-gray-700 dark:text-gray-200',
    preview: (
      <div className="bg-gray-900 rounded-lg p-4 text-left shadow-sm transform scale-90">
        <div className="border-b border-blue-500 pb-2 mb-3">
          <div className="h-4 w-28 bg-white rounded mb-1" />
          <div className="h-2 w-20 bg-blue-400 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-16 bg-blue-500 rounded" />
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-gray-700 rounded" />
            <div className="h-1.5 w-4/5 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    ),
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Choose a Template',
    description: 'Select from our professionally designed, ATS-optimized resume templates.',
    icon: Layout,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    step: 2,
    title: 'Fill Your Details',
    description: 'Enter your personal info, experience, education, and skills with AI assistance.',
    icon: PenTool,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    step: 3,
    title: 'Download & Apply',
    description: 'Export your polished resume as PDF and start landing interviews.',
    icon: Download,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
];

const aiFeatures = [
  {
    title: 'Professional Summary Generator',
    description: 'Creates compelling career summaries tailored to your target role and industry.',
  },
  {
    title: 'Career Objective Writer',
    description: 'Generates focused objectives that align with specific job requirements.',
  },
  {
    title: 'Skill Suggestions',
    description: 'Recommends relevant skills based on your experience and target positions.',
  },
  {
    title: 'Project Descriptions',
    description: 'Transforms your project details into impactful, results-driven narratives.',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    review: 'ResumeAI helped me land my dream job at Google. The AI-generated summary was incredibly professional and the ATS optimization is real — I went from 0 callbacks to 5 in a week!',
    stars: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager at Stripe',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    review: 'The live preview feature is a game-changer. I could see my resume update in real-time and the templates are absolutely stunning. Got hired in 3 weeks!',
    stars: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Data Scientist at Meta',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    review: "I was skeptical about AI-generated content but the results were impressive. It captured my experience perfectly and the dark template made my resume memorable.",
    stars: 5,
  },
  {
    name: 'David Kim',
    role: 'UX Designer at Apple',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    review: 'The creative template options helped me stand out in design portfolios. The AI suggestions for my project descriptions were incredibly helpful.',
    stars: 5,
  },
];

const faqs = [
  {
    q: 'Is ResumeAI really free to use?',
    a: 'Yes! Our core features including AI generation, multiple templates, and PDF export are completely free. We offer premium plans for advanced features like unlimited resumes, priority AI, and advanced analytics.',
  },
  {
    q: 'How does the AI content generation work?',
    a: 'Our AI analyzes your skills, experience, and target role to generate tailored professional summaries, project descriptions, and career objectives that resonate with recruiters and pass ATS systems.',
  },
  {
    q: 'Are the templates really ATS-friendly?',
    a: 'Absolutely. All templates are designed to pass Applicant Tracking Systems. We avoid complex layouts, tables, and formatting that confuse ATS parsers while maintaining visual appeal.',
  },
  {
    q: 'Can I export my resume as a PDF?',
    a: 'Yes, you can download your resume as a print-ready, high-quality PDF with one click. The PDF maintains perfect formatting across all devices and printers.',
  },
  {
    q: 'How many resumes can I create?',
    a: 'Free users can create up to 5 resumes. Premium subscribers get unlimited resumes with advanced customization, priority AI processing, and detailed analytics.',
  },
  {
    q: 'Is my data secure?',
    a: 'We take privacy seriously. All data is encrypted at rest and in transit. We never share your personal information or resume data with third parties.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-600 dark:text-gray-400">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function AIChatDemo() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const demoQueries = [
    'Generate a summary for a Senior React Developer',
    'Suggest skills for a Full Stack Engineer',
    'Write a project description for an e-commerce platform',
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1000));

    const response = 'Experienced React Developer with 5+ years building scalable web applications. Expert in modern JavaScript frameworks, state management, and performance optimization. Led development of user-facing features serving 2M+ monthly users.';
    setMessages(prev => [...prev, { role: 'ai', content: response }]);

    let i = 0;
    setCurrentText('');
    const typeInterval = setInterval(() => {
      if (i < response.length) {
        setCurrentText(prev => prev + response[i]);
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setCurrentText('');
      }
    }, 15);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 flex items-center gap-2">
        <Bot className="w-5 h-5 text-white" />
        <span className="text-white font-semibold">AI Assistant</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/80 text-xs">Online</span>
        </div>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md rounded-bl-md'
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && currentText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-md max-w-[80%]">
              <p className="text-sm text-gray-800 dark:text-gray-200">{currentText}<span className="animate-pulse">|</span></p>
            </div>
          </motion.div>
        )}
        {isTyping && !currentText && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-md">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
          {demoQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask AI for help..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isTyping}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Top bar */}
      <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">ResumeAI Dashboard</span>
      </div>
      {/* Dashboard content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-16 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-2 space-y-2">
          {[LayoutDashboard, FileText, Layers, BarChart3, Settings].map((Icon, i) => (
            <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
              <Icon className="w-5 h-5" />
            </div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-4 w-32 bg-gray-900 dark:bg-white rounded" />
              <div className="h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600" />
          </div>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[{ c: '5', l: 'Resumes' }, { c: '92%', l: 'ATS Avg' }, { c: '12', l: 'Downloads' }, { c: '3', l: 'Templates' }].map((s, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{s.c}</div>
                <div className="text-xs text-gray-500">{s.l}</div>
              </div>
            ))}
          </div>
          {/* Resume cards */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-500" />
                <div className="p-3">
                  <div className="h-3 w-20 bg-gray-900 dark:bg-white rounded mb-1" />
                  <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.08),transparent_50%)]" />

        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            x: [0, -30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-48 h-48 bg-pink-400/15 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              AI-Powered Resume Builder
            </motion.div>

            <motion.h1
              className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] text-balance mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Build{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Professional
              </span>
              {' '}AI Resumes in Minutes
            </motion.h1>

            <motion.p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Create stunning, ATS-optimized resumes with AI-generated content, live preview, and beautiful templates. Land your dream job faster.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => onNavigate('builder')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5" />
                Create Resume Free
              </motion.button>
              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </motion.div>

            <motion.div className="flex flex-wrap items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { label: 'Resumes Created', value: <AnimatedCounter value={50000} suffix="+" /> },
                { label: 'Success Rate', value: <AnimatedCounter value={94} suffix="%" /> },
                { label: 'Countries', value: <AnimatedCounter value={120} suffix="+" /> },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Dashboard mockup */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <DashboardPreview />
            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl px-4 py-2 border border-gray-100 dark:border-gray-700"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">ATS Score</div>
                  <div className="font-bold text-green-600">92%</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl px-4 py-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI Generated</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Trusted by professionals at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
            {['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'].map(company => (
              <span key={company} className="text-xl font-bold text-gray-400 dark:text-gray-600">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Features</span>
            <h2 className="section-title mt-2">Everything You Need to Get Hired</h2>
            <p className="section-subtitle">Powerful tools designed to help you create the perfect resume and stand out from the competition.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-transparent shadow-sm hover:shadow-2xl transition-all duration-300 cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
              >
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" style={{ background: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${f.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{f.title}</h3>
                  {f.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium">{f.badge}</span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">How It Works</span>
            <h2 className="section-title mt-2">Build Your Resume in 3 Simple Steps</h2>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hidden md:block" />

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mb-6 relative z-10`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </motion.div>
                    <div className="text-sm font-bold text-blue-500 mb-2">Step {step.step}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Templates</span>
            <h2 className="section-title mt-2">Beautiful Templates for Every Role</h2>
            <p className="section-subtitle">Choose from professionally designed templates, each optimized for ATS and visual impact.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((tpl, i) => (
              <motion.div
                key={tpl.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 min-h-[180px] flex items-center justify-center overflow-hidden">
                  <motion.div
                    className="w-full max-w-[180px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    {tpl.preview}
                  </motion.div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{tpl.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${tpl.badgeColor}`}>{tpl.badge}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{tpl.description}</p>
                  <motion.button
                    onClick={() => onNavigate('builder')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Use Template
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">AI Features</span>
              <h2 className="section-title mt-2 mb-6">Powered by Advanced AI</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Our AI understands your career context and generates content that resonates with recruiters. From professional summaries to skill suggestions, everything is tailored to your experience.
              </p>
              <div className="space-y-4">
                {aiFeatures.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{f.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{f.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <AIChatDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Testimonials</span>
            <h2 className="section-title mt-2">Loved by Job Seekers Worldwide</h2>
            <p className="section-subtitle">Join thousands of professionals who landed their dream jobs with ResumeAI.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed italic text-sm">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Land Your Dream Job?
          </motion.h2>
          <motion.p
            className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join 50,000+ professionals who used ResumeAI to get hired faster. Start building your perfect resume today — it's free.
          </motion.p>
          <motion.button
            onClick={() => onNavigate('builder')}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-blue-600 font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-6 h-6" />
            Start Building for Free
            <ArrowRight className="w-6 h-6" />
          </motion.button>
          <p className="mt-4 text-white/60 text-sm">No credit card required</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">FAQ</span>
            <h2 className="section-title mt-2">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-heading font-bold text-lg text-white">Resume<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span></span>
              </div>
              <p className="text-sm leading-relaxed mb-4">The AI-powered resume builder that helps you land your dream job faster. Create stunning, ATS-optimized resumes in minutes.</p>
              <div className="flex gap-4">
                {['twitter', 'linkedin', 'github', 'instagram'].map(social => (
                  <a key={social} href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-gray-500 rounded" />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Templates', 'Pricing', 'AI Assistant', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'] },
              { title: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Security', 'Status'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2024 ResumeAI. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
