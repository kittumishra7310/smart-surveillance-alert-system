
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

  useEffect(() => {
    // Initialize database on app start
    initializeDatabase();

    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Try to get user from database, create if doesn't exist
          let userData = await DatabaseService.getUserByEmail(session.user.email!);
          if (!userData && session.user.user_metadata?.username) {
            // Create user record if it doesn't exist but auth user does
            try {
              userData = await DatabaseService.createUser({
                username: session.user.user_metadata.username,
                email: session.user.email!,
                role: 'viewer'
              });
            } catch (error) {
              console.log('Could not create user record, but auth user exists');
              // Create a temporary user object for the session
              userData = {
                id: session.user.id,
                username: session.user.user_metadata?.username || 'User',
                email: session.user.email!,
                role: 'viewer' as const,
                created_at: new Date().toISOString(),
                last_login: null,
                status: 'active' as const
              };
            }
          }
          
          if (userData) {
            setUser(userData);
            if (userData.id) {
              await DatabaseService.updateUserLastLogin(userData.id);
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Try to get user from database, create if doesn't exist
        let userData = await DatabaseService.getUserByEmail(session.user.email!);
        if (!userData && session.user.user_metadata?.username) {
          // Create user record if it doesn't exist but auth user does
          try {
            userData = await DatabaseService.createUser({
              username: session.user.user_metadata.username,
              email: session.user.email!,
              role: 'viewer'
            });
          } catch (error) {
            console.log('Could not create user record, but auth user exists');
            // Create a temporary user object for the session
            userData = {
              id: session.user.id,
              username: session.user.user_metadata?.username || 'User',
              email: session.user.email!,
              role: 'viewer' as const,
              created_at: new Date().toISOString(),
              last_login: null,
              status: 'active' as const
            };
          }
        }
        
        if (userData) {
          setUser(userData);
          if (userData.id) {
            await DatabaseService.updateUserLastLogin(userData.id);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user) {
        // Try to get user from database, create if doesn't exist
        let userData = await DatabaseService.getUserByEmail(email);
        if (!userData) {
          // If no database record exists, create a temporary user object
          userData = {
            id: data.user.id,
            username: data.user.user_metadata?.username || email.split('@')[0],
            email: email,
            role: 'viewer' as const,
            created_at: new Date().toISOString(),
            last_login: null,
            status: 'active' as const
          };
        }
        
        setUser(userData);
        if (userData.id) {
          try {
            await DatabaseService.updateUserLastLogin(userData.id);
          } catch (error) {
            console.log('Could not update last login, but login successful');
          }
        }
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
      console.log('Starting registration process...');
      
      // Check if user already exists in our database
      const existingUser = await DatabaseService.getUserByEmail(email);
      if (existingUser) {
        console.error('User already exists in database');
        return false;
      }

      // Create auth user with metadata
      console.log('Creating auth user...');
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
        console.error('Auth signup error:', authError);
        return false;
      }

      if (authData.user) {
        console.log('Auth user created successfully');
        
        // Try to create user record in our database
        try {
          const userData = await DatabaseService.createUser({
            username,
            email,
            role: 'viewer'
          });
          console.log('User registered successfully:', userData);
        } catch (dbError: any) {
          console.log('Database user creation failed, but auth user created:', dbError);
          // This is OK - the user can still sign in after email confirmation
        }

        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
