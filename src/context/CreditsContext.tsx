import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface CreditsContextType {
  credits: number;
  maxCredits: number;
  isUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  upgradePlan: (plan: 'free' | 'pro' | 'business') => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserPlan, updateUserCredits } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const credits = user ? user.credits : 5;
  const maxCredits = user ? user.maxCredits : 10;

  const deductCredits = (amount: number): boolean => {
    if (credits < amount) {
      setIsUpgradeModalOpen(true);
      return false;
    }
    if (user) {
      // Persist via the auth context instead of mutating the user
      // object returned from the hook directly (that object is React
      // state — mutating it in place can leave the UI out of sync).
      updateUserCredits(user.credits - amount, user.maxCredits);
    }
    return true;
  };

  const addCredits = (amount: number) => {
    if (user) {
      updateUserCredits(user.credits + amount, user.maxCredits + amount);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const upgradePlan = (plan: 'free' | 'pro' | 'business') => {
    updateUserPlan(plan);
    setIsUpgradeModalOpen(false);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  return (
    <CreditsContext.Provider value={{
      credits,
      maxCredits,
      isUpgradeModalOpen,
      openUpgradeModal: () => setIsUpgradeModalOpen(true),
      closeUpgradeModal: () => setIsUpgradeModalOpen(false),
      deductCredits,
      addCredits,
      upgradePlan
    }}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) throw new Error('useCredits must be used within a CreditsProvider');
  return context;
};
