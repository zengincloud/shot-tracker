import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const username = localStorage.getItem('shot_tracker_username');
        setUser({ ...session.user, username });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const username = localStorage.getItem('shot_tracker_username');
        setUser({ ...session.user, username });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username) => {
    const email = `${username.toLowerCase().replace(/\s+/g, '')}@shottracker.app`;
    const password = `st_${username.toLowerCase().replace(/\s+/g, '')}_2024`;

    // Try signing in first, if that fails, sign up
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const result = await supabase.auth.signUp({ email, password });
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Auth error:', error.message);
      return;
    }

    localStorage.setItem('shot_tracker_username', username);
    setUser({ ...data.user, username });
  };

  const signOut = async () => {
    localStorage.removeItem('shot_tracker_username');
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signIn, signOut };
}
