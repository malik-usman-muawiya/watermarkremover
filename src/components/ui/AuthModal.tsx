import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { Sparkles, ShieldCheck, Mail, Lock, ArrowRight, X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalReason, loginWithGoogle, login } = useAuth();
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      setIsLoading(false);
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      login(email, email.split('@')[0]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} maxWidth="md">
      <div className="text-center space-y-4">
        {/* Header Icon & Title */}
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">Sign In to Continue</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {authModalReason}
          </p>
        </div>

        {/* Free Launch Offer Banner */}
        <div className="p-3.5 bg-[#121216] border border-amber-500/30 rounded-2xl text-left flex items-start gap-3">
          <span className="text-lg">🎉</span>
          <div className="text-xs text-slate-300">
            <strong className="text-amber-400 block font-bold">Grand Launch Celebration!</strong>
            All AI watermark & video inpainting features are currently <span className="font-bold text-emerald-400">100% Free & Unlimited</span>. Sign in with Google to start right away!
          </div>
        </div>

        {/* Google One-Click Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#202028] hover:bg-[#282834] text-white font-semibold text-sm rounded-xl border border-white/15 shadow-sm hover:shadow transition-all active:scale-[0.99] cursor-pointer"
          >
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-xs text-slate-500 font-medium uppercase">Or with email</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {!showEmailInput ? (
            <button
              onClick={() => setShowEmailInput(true)}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline"
            >
              Sign in with Email & Password
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3 animate-in fade-in duration-200">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121216] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Continue
              </button>
            </form>
          )}
        </div>

        {/* Security footer */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>No credit card required. Free instant access.</span>
        </div>
      </div>
    </Modal>
  );
};
