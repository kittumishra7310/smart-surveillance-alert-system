
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DatabaseService, type User } from '@/services/databaseService';
import { initializeDatabase } from '@/services/initDatabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserFromAuthData = (authUser: any): User => {
    return {
      id: authUser.id,
      username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'User',
      email: authUser.email!,
      role: 'viewer' as const,
      created_at: new Date().toISOString(),
      last_login: null,
      status: 'active' as const
    };
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        
        // Initialize database
        await initializeDatabase();

        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user) {
          console.log('Found existing session for:', session.user.email);
          
          // Try to get user from database
          try {
            let userData = await DatabaseService.getUserByEmail(session.user.email!);
            
            if (!userData) {
              console.log('No database record found, creating temporary user object');
              userData = createUserFromAuthData(session.user);
            }
            
            if (isMounted) {
              setUser(userData);
              console.log('User set successfully:', userData.email);
            }
            
            // Try to update last login (optional)
            if (userData.id) {
              try {
                await DatabaseService.updateUserLastLogin(userData.id);
              } catch (error) {
                console.log('Could not update last login, but user is authenticated');
              }
            }
          } catch (error) {
            console.error('Error getting user data:', error);
            // Create fallback user object
            const fallbackUser = createUserFromAuthData(session.user);
            if (isMounted) {
              setUser(fallbackUser);
            }
          }
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('Auth initialization complete, loading set to false');
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user.email);
        
        try {
          let userData = await DatabaseService.getUserByEmail(session.user.email!);
          
          if (!userData) {
            console.log('Creating temporary user object for signed in user');
            userData = createUserFromAuthData(session.user);
          }
          
          setUser(userData);
          
          // Try to update last login (optional)
          if (userData.id) {
            try {
              await DatabaseService.updateUserLastLogin(userData.id);
            } catch (error) {
              console.log('Could not update last login, but user is authenticated');
            }
          }
        } catch (error) {
          console.error('Error handling sign in:', error);
          // Create fallback user
          const fallbackUser = createUserFromAuthData(session.user);
          setUser(fallbackUser);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
      
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user) {
        console.log('Login successful for:', email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Starting registration for:', email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (authError) {
        console.error('Registration error:', authError);
        return false;
      }

      if (authData.user) {
        console.log('Registration successful for:', email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  console.log('AuthProvider render - loading:', loading, 'user:', user?.email || 'none');

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
