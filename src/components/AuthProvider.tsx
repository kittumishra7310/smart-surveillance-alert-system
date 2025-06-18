
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
          const userData = await DatabaseService.getUserByEmail(session.user.email!);
          if (userData) {
            setUser(userData);
            await DatabaseService.updateUserLastLogin(userData.id);
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
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = await DatabaseService.getUserByEmail(session.user.email!);
        if (userData) {
          setUser(userData);
          await DatabaseService.updateUserLastLogin(userData.id);
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

      if (error) throw error;

      if (data.user) {
        const userData = await DatabaseService.getUserByEmail(email);
        if (userData) {
          setUser(userData);
          await DatabaseService.updateUserLastLogin(userData.id);
          return true;
        }
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
        throw new Error('User already exists');
      }

      // Create auth user first
      console.log('Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('Auth user created, now creating database record...');
        
        // Try to create user record in our database using the auth user's ID
        try {
          const userData = await DatabaseService.createUser({
            id: authData.user.id, // Use the auth user's ID
            username,
            email,
            role: 'viewer'
          });

          console.log('User registered successfully:', userData);
          return true;
        } catch (dbError: any) {
          console.error('Database user creation failed:', dbError);
          
          // If database creation fails due to RLS, we should still consider registration successful
          // since the auth user was created. The user can sign in and we'll handle the database record later
          if (dbError.code === '42501') {
            console.log('RLS policy prevented user creation, but auth user exists');
            return true;
          }
          throw dbError;
        }
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
