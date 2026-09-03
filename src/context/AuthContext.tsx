import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PlanType } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUserPlan: (plan: PlanType) => void;
  regenerateApiKey: () => string;
}

const DEFAULT_GOOGLE_USER: User = {
  id: 'usr_google_10293',
  name: 'Alex Vance',
  email: 'alex.creator@gmail.com',
  plan: 'pro',
  credits: 9999,
  maxCredits: 9999,
  apiKey: 'cmk_live_9f823a10b48c772e564d12903ab84',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  createdAt: '2026-01-15T10:00:00Z'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cleanmark_auth_user');
    return saved ? JSON.parse(saved) : null; // Start as guest until login or Google sign-in
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('Sign in to remove watermarks for free');

  useEffect(() => {
    if (user) {
      localStorage.setItem('cleanmark_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cleanmark_auth_user');
    }
  }, [user]);

  const openAuthModal = (reason = 'Please sign in with Google to start free watermark & object removal') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = (
    email = 'creator.user@gmail.com',
    name = 'Google Creator',
    avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  ) => {
    const newUser: User = {
      id: `usr_google_${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      avatar,
      plan: 'pro',
      credits: 9999,
      maxCredits: 9999,
      apiKey: `cmk_live_g_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const login = (email: string, name = 'Creator User') => {
    const newUser: User = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: name || email.split('@')[0],
      email,
      plan: 'pro',
      credits: 9999,
      maxCredits: 9999,
      apiKey: `cmk_live_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserPlan = (plan: PlanType) => {
    if (!user) return;
    setUser({
      ...user,
      plan,
      maxCredits: 9999,
      credits: 9999
    });
  };

  const regenerateApiKey = () => {
    const newKey = `cmk_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 12)}`;
    if (user) {
      setUser({ ...user, apiKey: newKey });
    }
    return newKey;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAuthModalOpen,
      authModalReason,
      openAuthModal,
      closeAuthModal,
      loginWithGoogle,
      login,
      logout,
      updateUserPlan,
      regenerateApiKey
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
