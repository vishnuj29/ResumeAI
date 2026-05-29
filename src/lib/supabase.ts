import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ResumeContent = {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    summary: string;
    objective: string;
    photo?: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
    description: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url: string;
    github: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
  }>;
  interests: string[];
};

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  template: string;
  accent_color: string;
  font: string;
  content: ResumeContent;
  ats_score: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export const defaultResumeContent: ResumeContent = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
    objective: '',
    photo: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
  interests: [],
};
