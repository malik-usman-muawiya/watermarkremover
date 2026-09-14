import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const AuthPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email, name);
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <SEO 
        title="Sign In — Watermark AI Remover"
        description="Sign in or register for Watermark AI Remover to access your inpainting history and developer API credentials."
        canonicalPath="/auth"
        noindex={true}
      />
      <div className="w-full max-w-md bg-[#0D1527] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 mb-2 border border-teal-500/20 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isRegister ? 'Join Watermark AI Remover' : 'Sign In to Studio'}
          </h1>
          <p className="text-xs text-slate-400">
            {isRegister 
              ? 'Enjoy 100% Free & Unlimited AI Watermark & Video Inpainting'
              : 'Sign in to access your media studio and processing history'
            }
          </p>
        </div>

        {/* Free Launch Callout */}
        <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-teal-300 font-bold">
          <Gift className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Launch Promotion: Unlimited free access enabled!</span>
        </div>

        {/* Google 1-Click Button */}

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-500 font-semibold uppercase">Or with email</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label htmlFor="auth-name" className="text-xs font-bold text-slate-300">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111A2E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="auth-email" className="text-xs font-bold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                type="email"
                required
                placeholder="creator@watermarksairemover.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#111A2E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="auth-password" className="text-xs font-bold text-slate-300">Password</label>
              {!isRegister && (
                <button type="button" className="text-[11px] text-teal-400 hover:underline">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#111A2E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : (isRegister ? 'Claim Free Launch Access' : 'Sign In with Email')}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </form>

        <div className="border-t border-white/10 pt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-white transition-colors font-medium cursor-pointer"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register free"}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted authentication session</span>
        </div>

      </div>
    </div>
  );
};
