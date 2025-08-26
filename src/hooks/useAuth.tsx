import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      console.log('App is online');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      console.log('App is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Try to get session from Supabase first
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session) {
            console.log('Session found:', session);
            setSession(session);
            setUser(session.user);
            // Store in localStorage for offline access
            localStorage.setItem('supabase-session', JSON.stringify(session));
            localStorage.setItem('supabase-user', JSON.stringify(session.user));
          } else {
            console.log('No active session found');
            // Clear any stale data
            localStorage.removeItem('supabase-session');
            localStorage.removeItem('supabase-user');
            setSession(null);
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (mounted) {
          if (session) {
            // Store session data
            localStorage.setItem('supabase-session', JSON.stringify(session));
            localStorage.setItem('supabase-user', JSON.stringify(session.user));
            setSession(session);
            setUser(session.user);
          } else {
            // Clear session data
            localStorage.removeItem('supabase-session');
            localStorage.removeItem('supabase-user');
            setSession(null);
            setUser(null);
          }
          setLoading(false);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase-session');
      localStorage.removeItem('supabase-user');
      // Clear all cached data
      localStorage.removeItem('calendar-events');
      // Clear cache if available
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, isOnline }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};