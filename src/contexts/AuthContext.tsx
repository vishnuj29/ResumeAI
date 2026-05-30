/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithGitHub: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Defensive guards: some deployments may produce a supabase client
    // that does not expose the full auth API (or envs were missing at build time).
    try {
      const auth = (supabase as any).auth;
      if (auth && typeof auth.getSession === 'function') {
        auth.getSession().then(({ data: { session } }: any) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }).catch((error: any) => {
          console.error('Auth error:', error);
          setLoading(false);
        });

        if (typeof auth.onAuthStateChange === 'function') {
          const { data: { subscription } } = auth.onAuthStateChange((_event: any, session: any) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          });
          return () => subscription?.unsubscribe?.();
        }
      } else {
        console.error('Supabase auth API unavailable. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY were provided at build time and that @supabase/supabase-js is the expected version.');
        setLoading(false);
      }
    } catch (e) {
      // Catch any unexpected shape errors and avoid crashing the app
      // eslint-disable-next-line no-console
      console.error('Unexpected auth initialization error:', e);
      setLoading(false);
    }
    return undefined;
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithGoogle, signInWithGitHub, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
