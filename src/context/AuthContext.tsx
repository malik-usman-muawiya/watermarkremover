import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PlanType } from '../types';

const DEFAULT_USER: User = {
  id: 'usr_guest_creator',
  name: 'Creator',
  email: 'creator@watermarksairemover.com',
  avatar: '',
  plan: 'pro',
  credits: 9999,
  maxCredits: 9999,
  apiKey: 'wm_live_894f2910ba749320e8',
  createdAt: new Date().toISOString()
};

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
  updateUserCredits: (credits: number, maxCredits: number) => void;
  regenerateApiKey: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cleanmark_auth_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [isAuthModalOpen] = useState(false);
  const [authModalReason] = useState('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('cleanmark_auth_user', JSON.stringify(user));
    }
  }, [user]);

  // Auth modal is deactivated per user instruction (no Google sign-in barrier)
  const openAuthModal = () => {};
  const closeAuthModal = () => {};

  const loginWithGoogle = () => {
    setUser(DEFAULT_USER);
  };

  const login = (email: string, name = 'Creator') => {
    const newUser: User = {
      ...DEFAULT_USER,
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: name || email.split('@')[0],
      email
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(DEFAULT_USER);
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

  const updateUserCredits = (credits: number, maxCredits: number) => {
    if (!user) return;
    setUser({
      ...user,
      credits,
      maxCredits
    });
  };

  const regenerateApiKey = () => {
    const newKey = `wm_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 12)}`;
    if (user) {
      setUser({ ...user, apiKey: newKey });
    }
    return newKey;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: true, // Always free and unblocked
      isAuthModalOpen,
      authModalReason,
      openAuthModal,
      closeAuthModal,
      loginWithGoogle,
      login,
      logout,
      updateUserPlan,
      updateUserCredits,
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
