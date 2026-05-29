import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import {
  Save, Download, ArrowLeft, Sparkles, Plus, Trash2, ChevronDown, ChevronUp,
  Monitor, Smartphone, Palette, Type, LayoutTemplate, GripVertical,
  CheckCircle, Loader2, Eye, Edit3, RefreshCw, X, ZoomIn, ZoomOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Resume, ResumeContent, defaultResumeContent } from '../lib/supabase';
import { MinimalTemplate, ModernTemplate, DarkTemplate, CorporateTemplate } from '../components/ResumeTemplates';

type BuilderProps = {
  resumeId: string | null;
  onNavigate: (page: 'dashboard') => void;
};

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal', preview: 'bg-gray-100' },
  { id: 'modern', name: 'Modern', preview: 'bg-gradient-to-br from-blue-500 to-purple-600' },
  { id: 'corporate', name: 'Corporate', preview: 'bg-gradient-to-br from-slate-100 to-slate-200' },
  { id: 'dark', name: 'Dark', preview: 'bg-gray-900' },
];

const FONTS = [
  { id: 'inter', name: 'Inter' },
  { id: 'georgia', name: 'Georgia' },
  { id: 'roboto', name: 'Roboto' },
];

const ACCENT_COLORS = [
  '#6366f1', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777'
];

const SECTIONS = [
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Work Experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'languages', label: 'Languages' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'interests', label: 'Interests' },
];

function genId() {
  return Math.random().toString(36).slice(2);
}

function computeAtsScore(content: ResumeContent): number {
  let score = 0;
  const p = content.personal;
  if (p.fullName) score += 10;
  if (p.email) score += 10;
  if (p.phone) score += 5;
  if (p.location) score += 5;
  if (p.summary && p.summary.length > 50) score += 15;
  if (content.experience.length > 0) score += 20;
  if (content.education.length > 0) score += 10;
  if (content.skills.some(s => s.items.length > 0)) score += 15;
  if (content.projects.length > 0) score += 5;
  if (p.linkedin) score += 5;
  return Math.min(100, score);
}

// Fake AI generation
async function generateAI(type: string, context: string): Promise<string> {
  await new Promise(r => setTimeout(r, 1500));
  const summaries: Record<string, string> = {
    summary: `Results-driven professional with ${context ? `expertise in ${context}` : 'extensive experience'} and a proven track record of delivering high-impact solutions. Adept at collaborating cross-functionally to drive innovation and achieve organizational goals. Passionate about leveraging technology to solve complex problems and create measurable business value.`,
    objective: `Seeking a challenging position where I can apply my skills in ${context || 'software development'} to contribute to a forward-thinking organization while continuing to grow professionally and make meaningful contributions to team success.`,
    description: `Led development of ${context || 'key features'} resulting in 40% performance improvement. Collaborated with cross-functional teams to deliver solutions on time and within budget. Implemented best practices and mentored junior team members.`,
    skills: 'React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL, GraphQL, REST APIs, Git',
  };
  return summaries[type] || 'AI-generated content here.';
}

export default function ResumeBuilder({ resumeId, onNavigate }: BuilderProps) {
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [content, setContent] = useState<ResumeContent>(defaultResumeContent);
  const [title, setTitle] = useState('My Resume');
  const [template, setTemplate] = useState('minimal');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [font, setFont] = useState('inter');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    initResume();
  }, [resumeId]);

  const initResume = async () => {
    setLoading(true);
    if (resumeId) {
      const { data } = await supabase.from('resumes').select('*').eq('id', resumeId).maybeSingle();
      if (data) {
        const r = data as Resume;
        setResume(r);
        setContent(r.content as ResumeContent);
        setTitle(r.title);
        setTemplate(r.template);
        setAccentColor(r.accent_color);
        setFont(r.font);
      }
    }
    setLoading(false);
  };

  const saveResume = useCallback(async (currentContent: ResumeContent, currentTemplate: string, currentAccent: string, currentFont: string, currentTitle: string) => {
    if (!user) return;
    setSaving(true);
    const ats = computeAtsScore(currentContent);
    const payload = {
      user_id: user.id,
      title: currentTitle,
      template: currentTemplate,
      accent_color: currentAccent,
      font: currentFont,
      content: currentContent as unknown as Record<string, unknown>,
      ats_score: ats,
    };

    if (resume?.id) {
      await supabase.from('resumes').update(payload).eq('id', resume.id);
    } else {
      const { data } = await supabase.from('resumes').insert(payload).select().single();
      if (data) setResume(data as Resume);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [user, resume?.id]);

  const triggerAutoSave = (c: ResumeContent, t: string, a: string, f: string, ti: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveResume(c, t, a, f, ti), 2000);
  };

  const updateContent = (updater: (prev: ResumeContent) => ResumeContent) => {
    setContent(prev => {
      const next = updater(prev);
      triggerAutoSave(next, template, accentColor, font, title);
      return next;
    });
  };

  const updatePersonal = (field: string, value: string) => {
    updateContent(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const handleAI = async (type: string, context: string, onResult: (text: string) => void) => {
    setAiLoading(type);
    const text = await generateAI(type, context);
    onResult(text);
    setAiLoading(null);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      // Fallback to print
      window.print();
    }
  };

  const atsScore = computeAtsScore(content);
  const atsColor = atsScore >= 80 ? 'text-green-500' : atsScore >= 60 ? 'text-yellow-500' : 'text-red-500';
  const atsBarColor = atsScore >= 80 ? 'bg-green-500' : atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  const PreviewComponent = template === 'modern' ? ModernTemplate : template === 'dark' ? DarkTemplate : template === 'corporate' ? CorporateTemplate : MinimalTemplate;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading resume builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <input
          value={title}
          onChange={e => { setTitle(e.target.value); triggerAutoSave(content, template, accentColor, font, e.target.value); }}
          className="flex-1 max-w-xs text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-0 focus:outline-none focus:ring-0 truncate"
          placeholder="Resume title..."
        />

        <div className="ml-auto flex items-center gap-2">
          {/* ATS Score */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400">ATS</span>
            <span className={`text-sm font-bold ${atsColor}`}>{atsScore}%</span>
          </div>

          {/* Save indicator */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 px-2">
            {saving ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</>
            ) : saved ? (
              <><CheckCircle className="w-3.5 h-3.5 text-green-500" />Saved</>
            ) : (
              <><Save className="w-3.5 h-3.5" />Auto-save</>
            )}
          </div>

          {/* Mobile preview toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {showPreview ? <Edit3 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>

          <button
            onClick={() => saveResume(content, template, accentColor, font, title)}
            className="btn-secondary py-2 px-3 text-sm hidden sm:flex"
          >
            <Save className="w-4 h-4" />
            Save
          </button>

          <button onClick={handleDownloadPDF} className="btn-primary py-2 px-3 text-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div className={`w-full lg:w-[420px] flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto ${showPreview ? 'hidden lg:flex' : 'flex'}`}>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            {(['content', 'design'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'content' ? <><Edit3 className="inline w-4 h-4 mr-1" />Content</> : <><Palette className="inline w-4 h-4 mr-1" />Design</>}
              </button>
            ))}
          </div>

          {activeTab === 'design' ? (
            <DesignPanel
              template={template}
              setTemplate={t => { setTemplate(t); triggerAutoSave(content, t, accentColor, font, title); }}
              accentColor={accentColor}
              setAccentColor={c => { setAccentColor(c); triggerAutoSave(content, template, c, font, title); }}
              font={font}
              setFont={f => { setFont(f); triggerAutoSave(content, template, accentColor, f, title); }}
            />
          ) : (
            <ContentPanel
              content={content}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              updatePersonal={updatePersonal}
              updateContent={updateContent}
              expandedItems={expandedItems}
              setExpandedItems={setExpandedItems}
              aiLoading={aiLoading}
              handleAI={handleAI}
            />
          )}
        </div>

        {/* Preview panel */}
        <div className={`flex-1 flex flex-col bg-gray-100 dark:bg-gray-950 ${showPreview ? 'flex' : 'hidden lg:flex'}`}>
          {/* Preview controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Preview</span>
            <div className="flex items-center gap-2">
              {/* ATS bar */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">ATS Score</span>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${atsBarColor}`} style={{ width: `${atsScore}%` }} />
                </div>
                <span className={`text-xs font-bold ${atsColor}`}>{atsScore}%</span>
              </div>

              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 text-sm ${previewMode === 'desktop' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 text-sm ${previewMode === 'mobile' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Resume preview */}
          <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
            <div className={`transition-all duration-300 bg-white shadow-2xl rounded-lg overflow-hidden ${
              previewMode === 'mobile' ? 'w-[390px]' : 'w-full max-w-[794px]'
            }`} style={{ transform: previewMode === 'desktop' ? 'scale(0.85)' : 'scale(1)', transformOrigin: 'top center' }}>
              <PreviewComponent content={content} accentColor={accentColor} font={font} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ DESIGN PANEL ============
function DesignPanel({
  template, setTemplate, accentColor, setAccentColor, font, setFont
}: {
  template: string; setTemplate: (t: string) => void;
  accentColor: string; setAccentColor: (c: string) => void;
  font: string; setFont: (f: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      {/* Templates */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4" />Template
        </label>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                template === t.id ? 'border-primary-600 shadow-lg scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
              }`}
            >
              <div className={`h-16 ${t.preview}`} />
              <div className="py-1 text-center text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">{t.name}</div>
              {template === t.id && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />Accent Color
        </label>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              className={`w-8 h-8 rounded-full transition-transform ${accentColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-900 dark:ring-white' : 'hover:scale-110'}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={accentColor}
              onChange={e => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer opacity-0 absolute inset-0"
            />
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
              <Plus className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Type className="w-4 h-4" />Font Family
        </label>
        <div className="space-y-2">
          {FONTS.map(f => (
            <button
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm text-left transition-colors ${
                font === f.id
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                  : 'text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ CONTENT PANEL ============
function ContentPanel({
  content, activeSection, setActiveSection, updatePersonal, updateContent,
  expandedItems, setExpandedItems, aiLoading, handleAI
}: {
  content: ResumeContent;
  activeSection: string;
  setActiveSection: (s: string) => void;
  updatePersonal: (f: string, v: string) => void;
  updateContent: (updater: (prev: ResumeContent) => ResumeContent) => void;
  expandedItems: Record<string, boolean>;
  setExpandedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  aiLoading: string | null;
  handleAI: (type: string, context: string, onResult: (text: string) => void) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Section nav */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <button
          onClick={() => setActiveSection('personal')}
          className={`flex-shrink-0 px-4 py-3 text-xs font-medium transition-colors ${
            activeSection === 'personal'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-white dark:bg-gray-900'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Personal
        </button>
        {SECTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex-shrink-0 px-4 py-3 text-xs font-medium transition-colors whitespace-nowrap ${
              activeSection === s.key
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-white dark:bg-gray-900'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeSection === 'personal' && (
          <PersonalSection
            personal={content.personal}
            updatePersonal={updatePersonal}
            aiLoading={aiLoading}
            handleAI={handleAI}
          />
        )}
        {activeSection === 'education' && (
          <ListSection
            title="Education"
            items={content.education}
            onAdd={() => updateContent(prev => ({
              ...prev,
              education: [...prev.education, { id: genId(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }]
            }))}
            onRemove={id => updateContent(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }))}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            renderItem={(item: ReturnType<typeof content.education>[0], update) => (
              <div className="space-y-3">
                <InputField label="Institution" value={item.institution} onChange={v => update({ institution: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Degree" value={item.degree} onChange={v => update({ degree: v })} />
                  <InputField label="Field of Study" value={item.field} onChange={v => update({ field: v })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Start Date" value={item.startDate} onChange={v => update({ startDate: v })} placeholder="e.g. 2020" />
                  <InputField label="End Date" value={item.endDate} onChange={v => update({ endDate: v })} placeholder="e.g. 2024" />
                </div>
                <InputField label="GPA (optional)" value={item.gpa} onChange={v => update({ gpa: v })} placeholder="e.g. 3.8" />
              </div>
            )}
            updateItem={(id, patch) => updateContent(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, ...patch } : e) }))}
            getLabel={(item: ReturnType<typeof content.education>[0]) => item.institution || 'New Education'}
          />
        )}
        {activeSection === 'experience' && (
          <ExperienceSection
            experience={content.experience}
            updateContent={updateContent}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            aiLoading={aiLoading}
            handleAI={handleAI}
          />
        )}
        {activeSection === 'skills' && (
          <SkillsSection
            skills={content.skills}
            updateContent={updateContent}
            aiLoading={aiLoading}
            handleAI={handleAI}
            personalSummary={content.personal.summary}
          />
        )}
        {activeSection === 'projects' && (
          <ProjectsSection
            projects={content.projects}
            updateContent={updateContent}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            aiLoading={aiLoading}
            handleAI={handleAI}
          />
        )}
        {activeSection === 'certifications' && (
          <ListSection
            title="Certifications"
            items={content.certifications}
            onAdd={() => updateContent(prev => ({
              ...prev,
              certifications: [...prev.certifications, { id: genId(), name: '', issuer: '', date: '', url: '' }]
            }))}
            onRemove={id => updateContent(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }))}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            renderItem={(item: ReturnType<typeof content.certifications>[0], update) => (
              <div className="space-y-3">
                <InputField label="Certification Name" value={item.name} onChange={v => update({ name: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Issuer" value={item.issuer} onChange={v => update({ issuer: v })} />
                  <InputField label="Date" value={item.date} onChange={v => update({ date: v })} placeholder="e.g. 2023" />
                </div>
                <InputField label="URL (optional)" value={item.url} onChange={v => update({ url: v })} />
              </div>
            )}
            updateItem={(id, patch) => updateContent(prev => ({ ...prev, certifications: prev.certifications.map(c => c.id === id ? { ...c, ...patch } : c) }))}
            getLabel={(item: ReturnType<typeof content.certifications>[0]) => item.name || 'New Certification'}
          />
        )}
        {activeSection === 'languages' && (
          <ListSection
            title="Languages"
            items={content.languages}
            onAdd={() => updateContent(prev => ({
              ...prev,
              languages: [...prev.languages, { id: genId(), language: '', proficiency: '' }]
            }))}
            onRemove={id => updateContent(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }))}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            renderItem={(item: ReturnType<typeof content.languages>[0], update) => (
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Language" value={item.language} onChange={v => update({ language: v })} />
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Proficiency</label>
                  <select
                    value={item.proficiency}
                    onChange={e => update({ proficiency: e.target.value })}
                    className="input-field py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            updateItem={(id, patch) => updateContent(prev => ({ ...prev, languages: prev.languages.map(l => l.id === id ? { ...l, ...patch } : l) }))}
            getLabel={(item: ReturnType<typeof content.languages>[0]) => item.language || 'New Language'}
          />
        )}
        {activeSection === 'achievements' && (
          <ListSection
            title="Achievements"
            items={content.achievements}
            onAdd={() => updateContent(prev => ({
              ...prev,
              achievements: [...prev.achievements, { id: genId(), title: '', description: '', date: '' }]
            }))}
            onRemove={id => updateContent(prev => ({ ...prev, achievements: prev.achievements.filter(a => a.id !== id) }))}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            renderItem={(item: ReturnType<typeof content.achievements>[0], update) => (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Title" value={item.title} onChange={v => update({ title: v })} />
                  <InputField label="Date" value={item.date} onChange={v => update({ date: v })} placeholder="e.g. 2023" />
                </div>
                <TextareaField label="Description" value={item.description} onChange={v => update({ description: v })} rows={2} />
              </div>
            )}
            updateItem={(id, patch) => updateContent(prev => ({ ...prev, achievements: prev.achievements.map(a => a.id === id ? { ...a, ...patch } : a) }))}
            getLabel={(item: ReturnType<typeof content.achievements>[0]) => item.title || 'New Achievement'}
          />
        )}
        {activeSection === 'interests' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Interests</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Enter interests separated by commas</p>
            <textarea
              value={content.interests.join(', ')}
              onChange={e => updateContent(prev => ({ ...prev, interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              className="input-field resize-none"
              rows={4}
              placeholder="e.g. Open source, Machine learning, Photography, Hiking"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============ PERSONAL SECTION ============
function PersonalSection({
  personal, updatePersonal, aiLoading, handleAI
}: {
  personal: ResumeContent['personal'];
  updatePersonal: (f: string, v: string) => void;
  aiLoading: string | null;
  handleAI: (type: string, context: string, onResult: (text: string) => void) => void;
}) {
  return (
    <div className="space-y-4">
      <InputField label="Full Name" value={personal.fullName} onChange={v => updatePersonal('fullName', v)} placeholder="John Doe" />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Email" value={personal.email} onChange={v => updatePersonal('email', v)} placeholder="john@example.com" type="email" />
        <InputField label="Phone" value={personal.phone} onChange={v => updatePersonal('phone', v)} placeholder="+1 (555) 000-0000" />
      </div>
      <InputField label="Location" value={personal.location} onChange={v => updatePersonal('location', v)} placeholder="San Francisco, CA" />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Website" value={personal.website} onChange={v => updatePersonal('website', v)} placeholder="yoursite.com" />
        <InputField label="LinkedIn" value={personal.linkedin} onChange={v => updatePersonal('linkedin', v)} placeholder="linkedin.com/in/..." />
      </div>
      <InputField label="GitHub" value={personal.github} onChange={v => updatePersonal('github', v)} placeholder="github.com/..." />

      {/* Photo URL */}
      <InputField label="Profile Photo URL" value={personal.photo || ''} onChange={v => updatePersonal('photo', v)} placeholder="https://..." />

      {/* Summary */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Professional Summary</label>
          <AIButton
            loading={aiLoading === 'summary'}
            onClick={() => handleAI('summary', personal.fullName, text => updatePersonal('summary', text))}
          />
        </div>
        <textarea
          value={personal.summary}
          onChange={e => updatePersonal('summary', e.target.value)}
          className="input-field resize-none"
          rows={4}
          placeholder="Write a professional summary or use AI to generate one..."
        />
      </div>

      {/* Objective */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Career Objective</label>
          <AIButton
            loading={aiLoading === 'objective'}
            onClick={() => handleAI('objective', personal.fullName, text => updatePersonal('objective', text))}
          />
        </div>
        <textarea
          value={personal.objective}
          onChange={e => updatePersonal('objective', e.target.value)}
          className="input-field resize-none"
          rows={3}
          placeholder="Career objective (optional)..."
        />
      </div>
    </div>
  );
}

// ============ EXPERIENCE SECTION ============
function ExperienceSection({
  experience, updateContent, expandedItems, setExpandedItems, aiLoading, handleAI
}: {
  experience: ResumeContent['experience'];
  updateContent: (updater: (prev: ResumeContent) => ResumeContent) => void;
  expandedItems: Record<string, boolean>;
  setExpandedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  aiLoading: string | null;
  handleAI: (type: string, context: string, onResult: (text: string) => void) => void;
}) {
  const addExp = () => {
    const id = genId();
    updateContent(prev => ({
      ...prev,
      experience: [...prev.experience, { id, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }]
    }));
    setExpandedItems(prev => ({ ...prev, [id]: true }));
  };

  const update = (id: string, patch: Partial<ResumeContent['experience'][0]>) => {
    updateContent(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, ...patch } : e) }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Work Experience</h3>
        <button onClick={addExp} className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
          <Plus className="w-3.5 h-3.5" />Add
        </button>
      </div>
      <div className="space-y-3">
        {experience.map((exp) => (
          <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 cursor-pointer"
              onClick={() => setExpandedItems(prev => ({ ...prev, [exp.id]: !prev[exp.id] }))}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{exp.position || 'New Experience'}</div>
                  {exp.company && <div className="text-xs text-gray-500 dark:text-gray-400">{exp.company}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); updateContent(prev => ({ ...prev, experience: prev.experience.filter(e2 => e2.id !== exp.id) })); }} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expandedItems[exp.id] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
            {expandedItems[exp.id] && (
              <div className="p-4 space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Company" value={exp.company} onChange={v => update(exp.id, { company: v })} />
                  <InputField label="Position" value={exp.position} onChange={v => update(exp.id, { position: v })} />
                </div>
                <InputField label="Location" value={exp.location} onChange={v => update(exp.id, { location: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Start Date" value={exp.startDate} onChange={v => update(exp.id, { startDate: v })} placeholder="Jan 2022" />
                  <InputField label="End Date" value={exp.endDate} onChange={v => update(exp.id, { endDate: v })} placeholder="Present" disabled={exp.current} />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={exp.current} onChange={e => update(exp.id, { current: e.target.checked })} className="rounded" />
                  Currently working here
                </label>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Description</label>
                    <AIButton
                      loading={aiLoading === `exp-${exp.id}`}
                      onClick={() => handleAI('description', exp.position + ' at ' + exp.company, text => update(exp.id, { description: text }))}
                      label="Generate"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={e => update(exp.id, { description: e.target.value })}
                    className="input-field resize-none"
                    rows={4}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        {experience.length === 0 && (
          <EmptyState label="No work experience added yet" onAdd={addExp} />
        )}
      </div>
    </div>
  );
}

// ============ SKILLS SECTION ============
function SkillsSection({
  skills, updateContent, aiLoading, handleAI, personalSummary
}: {
  skills: ResumeContent['skills'];
  updateContent: (updater: (prev: ResumeContent) => ResumeContent) => void;
  aiLoading: string | null;
  handleAI: (type: string, context: string, onResult: (text: string) => void) => void;
  personalSummary: string;
}) {
  const [newSkill, setNewSkill] = useState<Record<string, string>>({});

  const addGroup = () => {
    updateContent(prev => ({
      ...prev,
      skills: [...prev.skills, { id: genId(), category: '', items: [] }]
    }));
  };

  const updateGroup = (id: string, patch: Partial<ResumeContent['skills'][0]>) => {
    updateContent(prev => ({ ...prev, skills: prev.skills.map(s => s.id === id ? { ...s, ...patch } : s) }));
  };

  const addSkillToGroup = (id: string, skill: string) => {
    if (!skill.trim()) return;
    updateContent(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, items: [...s.items, skill.trim()] } : s)
    }));
    setNewSkill(prev => ({ ...prev, [id]: '' }));
  };

  const removeSkillFromGroup = (groupId: string, skillIndex: number) => {
    updateContent(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === groupId ? { ...s, items: s.items.filter((_, i) => i !== skillIndex) } : s)
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Skills</h3>
        <div className="flex items-center gap-2">
          <AIButton
            loading={aiLoading === 'skills'}
            onClick={() => handleAI('skills', personalSummary, text => {
              const items = text.split(',').map(s => s.trim()).filter(Boolean);
              updateContent(prev => ({
                ...prev,
                skills: [...prev.skills, { id: genId(), category: 'Technical Skills', items }]
              }));
            })}
            label="AI Suggest"
          />
          <button onClick={addGroup} className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
            <Plus className="w-3.5 h-3.5" />Add Group
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {skills.map(group => (
          <div key={group.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                value={group.category}
                onChange={e => updateGroup(group.id, { category: e.target.value })}
                className="input-field py-1.5 text-sm flex-1"
                placeholder="Category (e.g. Technical Skills)"
              />
              <button onClick={() => updateContent(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== group.id) }))} className="p-1.5 text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {group.items.map((skill, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {skill}
                  <button onClick={() => removeSkillFromGroup(group.id, i)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newSkill[group.id] || ''}
                onChange={e => setNewSkill(prev => ({ ...prev, [group.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkillToGroup(group.id, newSkill[group.id] || ''); } }}
                className="input-field py-1.5 text-sm flex-1"
                placeholder="Add skill, press Enter"
              />
              <button
                onClick={() => addSkillToGroup(group.id, newSkill[group.id] || '')}
                className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {skills.length === 0 && <EmptyState label="No skills added yet" onAdd={addGroup} />}
      </div>
    </div>
  );
}

// ============ PROJECTS SECTION ============
function ProjectsSection({
  projects, updateContent, expandedItems, setExpandedItems, aiLoading, handleAI
}: {
  projects: ResumeContent['projects'];
  updateContent: (updater: (prev: ResumeContent) => ResumeContent) => void;
  expandedItems: Record<string, boolean>;
  setExpandedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  aiLoading: string | null;
  handleAI: (type: string, context: string, onResult: (text: string) => void) => void;
}) {
  const [newTech, setNewTech] = useState<Record<string, string>>({});

  const add = () => {
    const id = genId();
    updateContent(prev => ({
      ...prev,
      projects: [...prev.projects, { id, name: '', description: '', technologies: [], url: '', github: '' }]
    }));
    setExpandedItems(prev => ({ ...prev, [id]: true }));
  };

  const update = (id: string, patch: Partial<ResumeContent['projects'][0]>) => {
    updateContent(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, ...patch } : p) }));
  };

  const addTech = (id: string, tech: string) => {
    if (!tech.trim()) return;
    updateContent(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, technologies: [...p.technologies, tech.trim()] } : p)
    }));
    setNewTech(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Projects</h3>
        <button onClick={add} className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
          <Plus className="w-3.5 h-3.5" />Add
        </button>
      </div>
      <div className="space-y-3">
        {projects.map(proj => (
          <div key={proj.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 cursor-pointer"
              onClick={() => setExpandedItems(prev => ({ ...prev, [proj.id]: !prev[proj.id] }))}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{proj.name || 'New Project'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); updateContent(prev => ({ ...prev, projects: prev.projects.filter(p2 => p2.id !== proj.id) })); }} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expandedItems[proj.id] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
            {expandedItems[proj.id] && (
              <div className="p-4 space-y-3 animate-fade-in">
                <InputField label="Project Name" value={proj.name} onChange={v => update(proj.id, { name: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Live URL" value={proj.url} onChange={v => update(proj.id, { url: v })} />
                  <InputField label="GitHub URL" value={proj.github} onChange={v => update(proj.id, { github: v })} />
                </div>
                {/* Technologies */}
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Technologies</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {proj.technologies.map((t, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {t}
                        <button onClick={() => update(proj.id, { technologies: proj.technologies.filter((_, j) => j !== i) })}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newTech[proj.id] || ''}
                      onChange={e => setNewTech(prev => ({ ...prev, [proj.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(proj.id, newTech[proj.id] || ''); } }}
                      className="input-field py-1.5 text-sm flex-1"
                      placeholder="Add technology"
                    />
                    <button onClick={() => addTech(proj.id, newTech[proj.id] || '')} className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm hover:bg-primary-700">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Description</label>
                    <AIButton
                      loading={aiLoading === `proj-${proj.id}`}
                      onClick={() => handleAI('description', proj.name + ' using ' + proj.technologies.join(', '), text => update(proj.id, { description: text }))}
                      label="Generate"
                    />
                  </div>
                  <textarea
                    value={proj.description}
                    onChange={e => update(proj.id, { description: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Describe what you built and the impact..."
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && <EmptyState label="No projects added yet" onAdd={add} />}
      </div>
    </div>
  );
}

// ============ GENERIC LIST SECTION ============
function ListSection<T extends { id: string }>({
  title, items, onAdd, onRemove, expandedItems, setExpandedItems,
  renderItem, updateItem, getLabel
}: {
  title: string;
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  expandedItems: Record<string, boolean>;
  setExpandedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  updateItem: (id: string, patch: Partial<T>) => void;
  getLabel: (item: T) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <button onClick={onAdd} className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
          <Plus className="w-3.5 h-3.5" />Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 cursor-pointer"
              onClick={() => setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{getLabel(item)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); onRemove(item.id); }} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expandedItems[item.id] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
            {expandedItems[item.id] && (
              <div className="p-4 animate-fade-in">
                {renderItem(item, patch => updateItem(item.id, patch))}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <EmptyState label={`No ${title.toLowerCase()} added yet`} onAdd={onAdd} />}
      </div>
    </div>
  );
}

// ============ SHARED COMPONENTS ============
function InputField({
  label, value, onChange, placeholder, type = 'text', disabled = false
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="input-field py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function TextareaField({
  label, value, onChange, rows = 3
}: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field resize-none"
        rows={rows}
      />
    </div>
  );
}

function AIButton({
  loading, onClick, label = 'AI Generate'
}: {
  loading: boolean; onClick: () => void; label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-70"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
      {label}
    </button>
  );
}

function EmptyState({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{label}</p>
      <button onClick={onAdd} className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1 mx-auto">
        <Plus className="w-3.5 h-3.5" />Add one now
      </button>
    </div>
  );
}
