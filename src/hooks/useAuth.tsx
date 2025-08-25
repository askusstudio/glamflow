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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        // Store auth data in localStorage for persistence
        if (session) {
          localStorage.setItem('supabase-session', JSON.stringify(session));
          localStorage.setItem('supabase-user', JSON.stringify(session.user));
        } else {
          localStorage.removeItem('supabase-session');
          localStorage.removeItem('supabase-user');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        // First try to get session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // Fallback to localStorage if Supabase fails
          const savedSession = localStorage.getItem('supabase-session');
          const savedUser = localStorage.getItem('supabase-user');
          
          if (savedSession && savedUser) {
            const parsedSession = JSON.parse(savedSession);
            const parsedUser = JSON.parse(savedUser);
            
            // Check if saved session is still valid
            if (parsedSession.expires_at && new Date(parsedSession.expires_at * 1000) > new Date()) {
              setSession(parsedSession);
              setUser(parsedUser);
            }
          }
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
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