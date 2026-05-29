import React from 'react';
import { ResumeContent } from '../lib/supabase';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

type TemplateProps = {
  content: ResumeContent;
  accentColor: string;
  font: string;
};

// ============ MINIMAL PROFESSIONAL ============
export function MinimalTemplate({ content, accentColor }: TemplateProps) {
  const { personal, education, experience, skills, projects, certifications, languages, achievements, interests } = content;

  return (
    <div className="bg-white text-gray-900 min-h-[297mm] w-full font-sans text-[13px] leading-relaxed" id="resume-preview">
      {/* Header */}
      <div className="px-10 pt-10 pb-6 border-b-2" style={{ borderColor: accentColor }}>
        <div className="flex items-start gap-6">
          {personal.photo && (
            <img src={personal.photo} alt={personal.fullName} className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-4" style={{ borderColor: accentColor }} />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{personal.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-xs mt-2">
              {personal.email && <span className="flex items-center gap-1"><Mail size={11} />{personal.email}</span>}
              {personal.phone && <span className="flex items-center gap-1"><Phone size={11} />{personal.phone}</span>}
              {personal.location && <span className="flex items-center gap-1"><MapPin size={11} />{personal.location}</span>}
              {personal.website && <span className="flex items-center gap-1"><Globe size={11} />{personal.website}</span>}
              {personal.linkedin && <span className="flex items-center gap-1"><Linkedin size={11} />{personal.linkedin}</span>}
              {personal.github && <span className="flex items-center gap-1"><Github size={11} />{personal.github}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-6 space-y-5">
        {/* Summary */}
        {personal.summary && (
          <Section title="Professional Summary" accent={accentColor}>
            <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
          </Section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Work Experience" accent={accentColor}>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900">{exp.position}</div>
                      <div className="font-medium text-gray-700">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    </div>
                    <div className="text-xs text-gray-500 flex-shrink-0 ml-4">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && <p className="mt-1 text-gray-600 text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education" accent={accentColor}>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                      <div className="text-gray-700">{edu.institution}</div>
                    </div>
                    <div className="text-xs text-gray-500 flex-shrink-0 ml-4">
                      {edu.startDate} – {edu.endDate}
                    </div>
                  </div>
                  {edu.gpa && <div className="text-xs text-gray-500 mt-0.5">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Skills" accent={accentColor}>
            <div className="space-y-1.5">
              {skills.map(skillGroup => (
                <div key={skillGroup.id} className="flex gap-2">
                  {skillGroup.category && <span className="font-semibold text-gray-700 flex-shrink-0 w-28">{skillGroup.category}:</span>}
                  <span className="text-gray-600">{skillGroup.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects" accent={accentColor}>
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{proj.name}</span>
                    {proj.url && <ExternalLink size={11} className="text-gray-400" />}
                  </div>
                  {proj.technologies.length > 0 && (
                    <div className="text-xs text-gray-500 mt-0.5">{proj.technologies.join(' · ')}</div>
                  )}
                  {proj.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications" accent={accentColor}>
            <div className="space-y-1.5">
              {certifications.map(cert => (
                <div key={cert.id} className="flex justify-between">
                  <div>
                    <span className="font-semibold text-gray-900">{cert.name}</span>
                    {cert.issuer && <span className="text-gray-600"> · {cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="text-xs text-gray-500">{cert.date}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Section title="Languages" accent={accentColor}>
            <div className="flex flex-wrap gap-4">
              {languages.map(lang => (
                <span key={lang.id} className="text-gray-700">
                  <span className="font-semibold">{lang.language}</span>
                  {lang.proficiency && <span className="text-gray-500"> ({lang.proficiency})</span>}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <Section title="Achievements" accent={accentColor}>
            <div className="space-y-2">
              {achievements.map(ach => (
                <div key={ach.id}>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">{ach.title}</span>
                    {ach.date && <span className="text-xs text-gray-500">{ach.date}</span>}
                  </div>
                  {ach.description && <p className="text-xs text-gray-600 mt-0.5">{ach.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <Section title="Interests" accent={accentColor}>
            <p className="text-gray-600">{interests.join(' · ')}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{title}</h2>
      {children}
    </div>
  );
}

// ============ MODERN GRADIENT ============
export function ModernTemplate({ content, accentColor }: TemplateProps) {
  const { personal, education, experience, skills, projects, certifications, languages, achievements } = content;

  return (
    <div className="bg-white text-gray-900 min-h-[297mm] w-full text-[13px] leading-relaxed" id="resume-preview">
      {/* Header */}
      <div className="px-0 pt-0">
        <div style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}aa 100%)` }} className="px-10 py-8 text-white">
          <div className="flex items-center gap-6">
            {personal.photo && (
              <img src={personal.photo} alt={personal.fullName} className="w-20 h-20 rounded-full object-cover border-4 border-white/30" />
            )}
            <div>
              <h1 className="text-4xl font-extrabold text-white">{personal.fullName || 'Your Name'}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/80 text-xs mt-3">
                {personal.email && <span className="flex items-center gap-1"><Mail size={11} />{personal.email}</span>}
                {personal.phone && <span className="flex items-center gap-1"><Phone size={11} />{personal.phone}</span>}
                {personal.location && <span className="flex items-center gap-1"><MapPin size={11} />{personal.location}</span>}
                {personal.website && <span className="flex items-center gap-1"><Globe size={11} />{personal.website}</span>}
                {personal.linkedin && <span className="flex items-center gap-1"><Linkedin size={11} />{personal.linkedin}</span>}
                {personal.github && <span className="flex items-center gap-1"><Github size={11} />{personal.github}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-6 space-y-5">
        {personal.summary && (
          <ModernSection title="Summary" accent={accentColor}>
            <p className="text-gray-700">{personal.summary}</p>
          </ModernSection>
        )}

        {experience.length > 0 && (
          <ModernSection title="Experience" accent={accentColor}>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id} className="pl-4 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{exp.position}</div>
                      <div className="font-medium" style={{ color: accentColor }}>{exp.company}</div>
                    </div>
                    <span className="text-xs text-gray-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.description && <p className="mt-1 text-xs text-gray-600 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </ModernSection>
        )}

        {education.length > 0 && (
          <ModernSection title="Education" accent={accentColor}>
            {education.map(edu => (
              <div key={edu.id} className="pl-4 border-l-2 mb-3" style={{ borderColor: `${accentColor}40` }}>
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div style={{ color: accentColor }}>{edu.institution}</div>
                  </div>
                  <span className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</span>
                </div>
              </div>
            ))}
          </ModernSection>
        )}

        {skills.length > 0 && (
          <ModernSection title="Skills" accent={accentColor}>
            <div className="flex flex-wrap gap-2">
              {skills.flatMap(s => s.items).map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: accentColor }}>
                  {skill}
                </span>
              ))}
            </div>
          </ModernSection>
        )}

        {projects.length > 0 && (
          <ModernSection title="Projects" accent={accentColor}>
            <div className="grid grid-cols-2 gap-3">
              {projects.map(proj => (
                <div key={proj.id} className="p-3 rounded-lg border" style={{ borderColor: `${accentColor}30`, backgroundColor: `${accentColor}08` }}>
                  <div className="font-bold text-gray-900 text-xs">{proj.name}</div>
                  {proj.technologies.length > 0 && (
                    <div className="text-xs mt-0.5" style={{ color: accentColor }}>{proj.technologies.slice(0, 3).join(', ')}</div>
                  )}
                  {proj.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{proj.description}</p>}
                </div>
              ))}
            </div>
          </ModernSection>
        )}

        {certifications.length > 0 && (
          <ModernSection title="Certifications" accent={accentColor}>
            {certifications.map(cert => (
              <div key={cert.id} className="flex justify-between text-sm mb-1">
                <span className="font-semibold">{cert.name} <span className="text-gray-500 font-normal">· {cert.issuer}</span></span>
                <span className="text-gray-400 text-xs">{cert.date}</span>
              </div>
            ))}
          </ModernSection>
        )}

        {languages.length > 0 && (
          <ModernSection title="Languages" accent={accentColor}>
            <div className="flex flex-wrap gap-4">
              {languages.map(lang => (
                <span key={lang.id}><span className="font-semibold">{lang.language}</span>{lang.proficiency && ` (${lang.proficiency})`}</span>
              ))}
            </div>
          </ModernSection>
        )}

        {achievements.length > 0 && (
          <ModernSection title="Achievements" accent={accentColor}>
            {achievements.map(ach => (
              <div key={ach.id} className="flex gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                <div>
                  <span className="font-semibold">{ach.title}</span>
                  {ach.description && <span className="text-gray-600"> — {ach.description}</span>}
                </div>
              </div>
            ))}
          </ModernSection>
        )}
      </div>
    </div>
  );
}

function ModernSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: accent }}>{title}</h2>
        <div className="flex-1 h-px" style={{ backgroundColor: `${accent}30` }} />
      </div>
      {children}
    </div>
  );
}

// ============ DARK CREATIVE ============
export function DarkTemplate({ content, accentColor }: TemplateProps) {
  const { personal, education, experience, skills, projects, certifications, languages, achievements } = content;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-[297mm] w-full text-[13px] leading-relaxed flex" id="resume-preview">
      {/* Left sidebar */}
      <div className="w-1/3 bg-gray-950 p-6 space-y-6">
        {personal.photo && (
          <div className="flex justify-center">
            <img src={personal.photo} alt={personal.fullName} className="w-24 h-24 rounded-2xl object-cover border-2" style={{ borderColor: accentColor }} />
          </div>
        )}

        <div>
          <h1 className="text-xl font-extrabold text-white leading-tight">{personal.fullName || 'Your Name'}</h1>
          <div className="mt-3 space-y-1.5">
            {personal.email && <div className="flex items-center gap-2 text-xs text-gray-400"><Mail size={11} style={{ color: accentColor }} />{personal.email}</div>}
            {personal.phone && <div className="flex items-center gap-2 text-xs text-gray-400"><Phone size={11} style={{ color: accentColor }} />{personal.phone}</div>}
            {personal.location && <div className="flex items-center gap-2 text-xs text-gray-400"><MapPin size={11} style={{ color: accentColor }} />{personal.location}</div>}
            {personal.website && <div className="flex items-center gap-2 text-xs text-gray-400"><Globe size={11} style={{ color: accentColor }} />{personal.website}</div>}
            {personal.linkedin && <div className="flex items-center gap-2 text-xs text-gray-400"><Linkedin size={11} style={{ color: accentColor }} />{personal.linkedin}</div>}
            {personal.github && <div className="flex items-center gap-2 text-xs text-gray-400"><Github size={11} style={{ color: accentColor }} />{personal.github}</div>}
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <DarkSidebarTitle title="Skills" accent={accentColor} />
            <div className="space-y-3">
              {skills.map(group => (
                <div key={group.id}>
                  {group.category && <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">{group.category}</div>}
                  <div className="flex flex-wrap gap-1">
                    {group.items.map((skill, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: accentColor + '60', color: accentColor, backgroundColor: accentColor + '15' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <DarkSidebarTitle title="Languages" accent={accentColor} />
            <div className="space-y-1">
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between text-xs">
                  <span className="text-gray-300">{lang.language}</span>
                  <span className="text-gray-500">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <DarkSidebarTitle title="Certifications" accent={accentColor} />
            {certifications.map(cert => (
              <div key={cert.id} className="mb-2">
                <div className="text-xs font-semibold text-gray-200">{cert.name}</div>
                <div className="text-xs text-gray-500">{cert.issuer} · {cert.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right main content */}
      <div className="flex-1 p-6 space-y-5">
        {personal.summary && (
          <div>
            <DarkMainTitle title="About Me" accent={accentColor} />
            <p className="text-gray-300 text-xs leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <DarkMainTitle title="Experience" accent={accentColor} />
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white">{exp.position}</div>
                      <div className="text-sm font-medium" style={{ color: accentColor }}>{exp.company}</div>
                    </div>
                    <span className="text-xs text-gray-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.description && <p className="mt-1 text-xs text-gray-400 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <DarkMainTitle title="Education" accent={accentColor} />
            {education.map(edu => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold text-white">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div className="text-sm" style={{ color: accentColor }}>{edu.institution}</div>
                  </div>
                  <span className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <DarkMainTitle title="Projects" accent={accentColor} />
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id} className="p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                  <div className="font-bold text-white">{proj.name}</div>
                  {proj.technologies.length > 0 && (
                    <div className="text-xs mt-0.5" style={{ color: accentColor }}>{proj.technologies.join(' · ')}</div>
                  )}
                  {proj.description && <p className="text-xs text-gray-400 mt-1">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <DarkMainTitle title="Achievements" accent={accentColor} />
            {achievements.map(ach => (
              <div key={ach.id} className="flex gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                <div>
                  <span className="font-semibold text-white text-xs">{ach.title}</span>
                  {ach.description && <span className="text-gray-400 text-xs"> — {ach.description}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DarkSidebarTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-4 h-0.5 rounded" style={{ backgroundColor: accent }} />
      <h3 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: accent }}>{title}</h3>
    </div>
  );
}

function DarkMainTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">{title}</h2>
      <div className="flex-1 h-px" style={{ backgroundColor: `${accent}40` }} />
    </div>
  );
}

// ============ CORPORATE ELEGANT ============
export function CorporateTemplate({ content, accentColor }: TemplateProps) {
  const { personal, education, experience, skills, projects, certifications, languages, achievements, interests } = content;

  return (
    <div className="bg-white text-gray-900 min-h-[297mm] w-full font-sans text-[13px] leading-relaxed" id="resume-preview">
      {/* Header with elegant styling */}
      <div className="px-10 pt-10 pb-6 border-b-4" style={{ borderColor: accentColor }}>
        <div className="flex items-center gap-6">
          {personal.photo && (
            <div className="relative">
              <img src={personal.photo} alt={personal.fullName} className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 shadow-lg" style={{ borderColor: accentColor }} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: accentColor }}>
                {personal.email && <span className="absolute w-2 h-2 bg-white rounded-full animate-ping" />}
              </div>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{personal.fullName || 'Your Name'}</h1>
            <div className="h-1 w-16 rounded mt-2 mb-3" style={{ backgroundColor: accentColor }} />
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-gray-600 text-sm">
              {personal.email && <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" />{personal.email}</span>}
              {personal.phone && <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400" />{personal.phone}</span>}
              {personal.location && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" />{personal.location}</span>}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-gray-600 text-sm mt-1">
              {personal.linkedin && <span className="flex items-center gap-1.5"><Linkedin size={14} className="text-gray-400" />{personal.linkedin}</span>}
              {personal.github && <span className="flex items-center gap-1.5"><Github size={14} className="text-gray-400" />{personal.github}</span>}
              {personal.website && <span className="flex items-center gap-1.5"><Globe size={14} className="text-gray-400" />{personal.website}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-6 grid grid-cols-3 gap-8">
        {/* Left column */}
        <div className="col-span-2 space-y-5">
          {/* Summary */}
          {personal.summary && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2" style={{ color: accentColor }}>Professional Profile</h2>
              <p className="text-gray-700 leading-relaxed border-l-2 pl-3" style={{ borderColor: accentColor }}>{personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3" style={{ color: accentColor }}>Professional Experience</h2>
              <div className="space-y-4">
                {experience.map(exp => (
                  <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="font-bold text-gray-900">{exp.position}</div>
                        <div className="font-medium" style={{ color: accentColor }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    {exp.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3" style={{ color: accentColor }}>Selected Projects</h2>
              <div className="space-y-3">
                {projects.map(proj => (
                  <div key={proj.id} className="p-3 rounded-lg border" style={{ borderColor: `${accentColor}30`, backgroundColor: `${accentColor}05` }}>
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {proj.name}
                      {proj.url && <ExternalLink size={12} className="text-gray-400" />}
                    </div>
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t, i) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: accentColor }}>{t}</span>
                        ))}
                      </div>
                    )}
                    {proj.description && <p className="text-xs text-gray-600 mt-1">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3" style={{ color: accentColor }}>Education</h2>
              {education.map(edu => (
                <div key={edu.id} className="mb-3">
                  <div className="font-bold text-gray-900 text-sm">{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                  <div className="text-gray-700" style={{ color: accentColor }}>{edu.institution}</div>
                  <div className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3" style={{ color: accentColor }}>Core Competencies</h2>
              <div className="flex flex-wrap gap-2">
                {skills.flatMap(s => s.items).map((skill, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full border border-gray-200">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3" style={{ color: accentColor }}>Certifications</h2>
              {certifications.map(cert => (
                <div key={cert.id} className="mb-2">
                  <div className="font-semibold text-gray-900 text-sm">{cert.name}</div>
                  {cert.issuer && <div className="text-xs text-gray-500">{cert.issuer} · {cert.date}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3" style={{ color: accentColor }}>Languages</h2>
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-500">{lang.language}</span>
                  <span className="text-gray-400">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3" style={{ color: accentColor }}>Achievements</h2>
              {achievements.map((ach) => (
                <div key={ach.id} className="relative pl-4 mb-2">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                  <div className="font-semibold text-gray-900 text-sm">{ach.title}</div>
                  {ach.description && <div className="text-xs text-gray-500">{ach.description}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3" style={{ color: accentColor }}>Interests</h2>
              <p className="text-sm text-gray-600">{interests.join(' · ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
