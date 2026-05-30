import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

const MISSING_ENV_MESSAGE =
  'Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n' +
  'On Vercel set these in Project → Settings → Environment Variables (Production) and redeploy.\n' +
  'Locally you can add them to a .env file or pass them into the build environment.';

let _supabase: any;
if (!supabaseUrl || !supabaseAnonKey) {
  // Log a clear message so it appears in Vercel logs / browser console
  // and provide a proxy that throws with a helpful message when used.
  // This avoids an opaque "supabaseUrl is required" uncaught error.
  // The app will still fail gracefully when attempting to access Supabase functionality.
  // eslint-disable-next-line no-console
  console.error(MISSING_ENV_MESSAGE);

  const createMissingProxy = (): any => {
    const thrower = () => {
      throw new Error(MISSING_ENV_MESSAGE);
    };
    return new Proxy(thrower, {
      get() {
        return createMissingProxy();
      },
      apply() {
        throw new Error(MISSING_ENV_MESSAGE);
      },
    });
  };

  _supabase = createMissingProxy();
} else {
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = _supabase;

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
