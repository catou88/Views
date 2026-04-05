import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'worker' | 'business' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileComplete?: boolean;
  isActivated?: boolean;
  isVerified?: boolean; // For business accounts
  isSuspended?: boolean; // For admin suspension
  available?: boolean; // For worker availability
  lastActivity?: string; // For tracking inactivity
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    // Check if user exists in registered users
    const registeredUsersData = localStorage.getItem('registeredUsers');
    if (!registeredUsersData) {
      throw new Error('No account found with this email. Please create an account first.');
    }

    const registeredUsers = JSON.parse(registeredUsersData);
    const userAccount = registeredUsers[email];
    
    if (!userAccount) {
      throw new Error('No account found with this email. Please create an account first.');
    }

    // Verify password
    if (userAccount.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }
    
    const mockUser: User = {
      id: userAccount.id,
      email,
      name: userAccount.name,
      role: userAccount.role,
      profileComplete: userAccount.profileComplete || false,
      isActivated: userAccount.isActivated || false,
      isVerified: userAccount.isVerified || false,
      isSuspended: userAccount.isSuspended || false,
      available: userAccount.available || false,
      lastActivity: userAccount.lastActivity || '',
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    // Mock registration - in real app, this would call an API
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Check if user already exists
    const registeredUsersData = localStorage.getItem('registeredUsers');
    const registeredUsers = registeredUsersData ? JSON.parse(registeredUsersData) : {};
    
    if (registeredUsers[email]) {
      throw new Error('An account with this email already exists. Please login instead.');
    }

    // Store the complete user account data
    const userId = Math.random().toString(36).substr(2, 9);
    registeredUsers[email] = {
      id: userId,
      password,
      name,
      role,
      profileComplete: false,
      isActivated: false,
      isVerified: false,
      isSuspended: false,
      available: false,
      lastActivity: '',
    };
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Don't automatically log the user in - they need to log in manually
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};