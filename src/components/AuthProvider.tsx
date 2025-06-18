import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'viewer';
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@security.com',
    role: 'admin',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15 14:30:00'
  },
  {
    id: '2',
    username: 'viewer',
    email: 'viewer@security.com',
    role: 'viewer',
    createdAt: '2024-01-05',
    lastLogin: '2024-01-15 13:45:00'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('registeredUsers');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check registered users first
    const foundUser = registeredUsers.find(u => u.username === username);
    
    if (foundUser) {
      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password for registered users
      // except for the original demo accounts which still need specific passwords
      const isValidPassword = (foundUser.username === 'admin' && password === 'admin123') ||
                             (foundUser.username === 'viewer' && password === 'viewer123') ||
                             (foundUser.username !== 'admin' && foundUser.username !== 'viewer');
      
      if (isValidPassword) {
        const updatedUser = { ...foundUser, lastLogin: new Date().toLocaleString() };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update the user in the registered users list
        const updatedUsers = registeredUsers.map(u => 
          u.id === foundUser.id ? updatedUser : u
        );
        setRegisteredUsers(updatedUsers);
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        
        return true;
      }
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Check if username or email already exists
    const existingUser = registeredUsers.find(u => 
      u.username === username || u.email === email
    );
    
    if (existingUser) {
      return false; // User already exists
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: 'viewer', // Default role for new registrations
      createdAt: new Date().toLocaleDateString(),
      lastLogin: 'Never'
    };
    
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
