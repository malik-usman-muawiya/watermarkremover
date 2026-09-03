import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useCredits } from '../../context/CreditsContext';
import { useAuth } from '../../context/AuthContext';
import { Check, Zap, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, closeUpgradeModal, upgradePlan, addCredits } = useCredits();
  const { user } = useAuth();
  const [tab, setTab] = useState<'subscription' | 'credits'>('subscription');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = (plan: 'pro' | 'business') => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradePlan(plan);
      setIsProcessing(false);
    }, 1200);
  };

  const handleBuyCredits = (amount: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      addCredits(amount);
      setIsProcessing(false);
      closeUpgradeModal();
    }, 1000);
  };

  return (
    <Modal isOpen={isUpgradeModalOpen} onClose={closeUpgradeModal} maxWidth="2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 mb-3 border border-brand-500/30">
          <Zap className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Need More Processing Power?</h2>
        <p className="text-sm text-surface-400 mt-1">
          Upgrade your plan or purchase on-demand credit packs for unlimited 4K inpainting & video removal.
        </p>

        {/* Tab switcher */}
        <div className="flex justify-center mt-6">
          <div className="p-1 bg-surface-800 rounded-xl inline-flex border border-white/10">
            <button
              onClick={() => setTab('subscription')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'subscription' ? 'bg-brand-500 text-white shadow-md' : 'text-surface-400 hover:text-white'
              }`}
            >
              Monthly Subscriptions
            </button>
            <button
              onClick={() => setTab('credits')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'credits' ? 'bg-brand-500 text-white shadow-md' : 'text-surface-400 hover:text-white'
              }`}
            >
              Pay-As-You-Go Credits
            </button>
          </div>
        </div>
      </div>

      {tab === 'subscription' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pro Plan */}
          <div className={`p-5 rounded-2xl border transition-all ${user?.plan === 'pro' ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/30' : 'border-white/10 bg-surface-850 hover:border-brand-500/40'}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">Most Popular</span>
                <h4 className="text-lg font-bold text-white mt-2">Pro Creator</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">$19</span>
                <span className="text-xs text-surface-400">/mo</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-surface-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>200 AI Credits</strong> per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full HD & 4K Output resolution</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Video Watermark Remover unlocked</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Batch processing (up to 50 files)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fast GPU priority queue</span>
              </li>
            </ul>

            <Button
              className="w-full mt-6"
              variant={user?.plan === 'pro' ? 'secondary' : 'gradient'}
              disabled={user?.plan === 'pro'}
              isLoading={isProcessing}
              onClick={() => handleSubscribe('pro')}
            >
              {user?.plan === 'pro' ? 'Current Active Plan' : 'Upgrade to Pro'}
            </Button>
          </div>

          {/* Business Plan */}
          <div className={`p-5 rounded-2xl border transition-all ${user?.plan === 'business' ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30' : 'border-white/10 bg-surface-850 hover:border-purple-500/40'}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">Studio Scale</span>
                <h4 className="text-lg font-bold text-white mt-2">Enterprise</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">$49</span>
                <span className="text-xs text-surface-400">/mo</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-surface-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>1,000 AI Credits</strong> per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>REST API Access & Webhooks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Ultra-high fidelity temporal video AI</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Dedicated GPU cluster execution</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Custom data retention SLA</span>
              </li>
            </ul>

            <Button
              className="w-full mt-6"
              variant={user?.plan === 'business' ? 'secondary' : 'primary'}
              disabled={user?.plan === 'business'}
              isLoading={isProcessing}
              onClick={() => handleSubscribe('business')}
            >
              {user?.plan === 'business' ? 'Current Active Plan' : 'Upgrade to Business'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-white/10 bg-surface-850 hover:border-brand-500/50 text-center transition-all">
            <h5 className="font-bold text-white">Starter Pack</h5>
            <div className="my-2">
              <span className="text-2xl font-black text-white">50</span>
              <span className="text-xs text-surface-400"> credits</span>
            </div>
            <p className="text-xs text-surface-400 mb-4">$0.18 per image</p>
            <Button size="sm" className="w-full" variant="outline" onClick={() => handleBuyCredits(50)}>
              Buy for $9
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-brand-500/40 bg-brand-500/10 text-center transition-all relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Save 25%</span>
            <h5 className="font-bold text-white">Power Pack</h5>
            <div className="my-2">
              <span className="text-2xl font-black text-white">200</span>
              <span className="text-xs text-surface-400"> credits</span>
            </div>
            <p className="text-xs text-surface-400 mb-4">$0.12 per image</p>
            <Button size="sm" className="w-full" variant="primary" onClick={() => handleBuyCredits(200)}>
              Buy for $24
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-surface-850 hover:border-brand-500/50 text-center transition-all">
            <h5 className="font-bold text-white">Mega Pack</h5>
            <div className="my-2">
              <span className="text-2xl font-black text-white">600</span>
              <span className="text-xs text-surface-400"> credits</span>
            </div>
            <p className="text-xs text-surface-400 mb-4">$0.09 per image</p>
            <Button size="sm" className="w-full" variant="outline" onClick={() => handleBuyCredits(600)}>
              Buy for $59
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-surface-400 gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-bit encrypted checkout. Cancel anytime.</span>
        </div>
        <div className="flex items-center gap-1">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Stripe / Cards / Apple Pay</span>
        </div>
      </div>
    </Modal>
  );
};
