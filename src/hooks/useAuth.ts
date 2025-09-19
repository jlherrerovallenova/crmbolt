import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Create temporary user profile if not found in users table
        const tempUser: UserProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.email?.split('@')[0] || 'Usuario',
          role: 'client' // Default role
        };
        setUser(tempUser);
      } else {
        if (data) {
          setUser(data);
        } else {
          // Create a temporary user profile based on auth user
          const tempUser: UserProfile = {
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.email?.split('@')[0] || 'Usuario',
            role: 'client' // Default role
          };
          setUser(tempUser);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Create temporary user profile on error
      const tempUser: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.email?.split('@')[0] || 'Usuario',
        role: 'client'
      };
      setUser(tempUser);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}