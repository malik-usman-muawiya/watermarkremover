import React, { useState } from 'react';
import { useCredits } from '../context/CreditsContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  X,
  Gift
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { openUpgradeModal } = useCredits();
  const { user, openAuthModal } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Launch Banner Callout */}
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-teal-500 via-brand-500 to-cyan-600 text-white rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">Grand Launch: 100% Free Unlimited Access</h3>
            <p className="text-xs text-teal-100">
              All plans are currently unlocked for everyone. Sign in with Google to use all tools free of charge!
            </p>
          </div>
        </div>

        <button
          onClick={() => openAuthModal('Sign in with Google to claim your free launch access')}
          className="px-6 py-2.5 bg-white text-brand-700 font-extrabold text-xs rounded-xl shadow-md hover:bg-teal-50 transition-all cursor-pointer"
        >
          Claim Free Access
        </button>
      </div>

      {/* Pricing Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-teal-50 text-brand-600 text-xs font-bold border border-teal-200">
          <Zap className="w-3.5 h-3.5" />
          <span>Future Commercial Plans Overview</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Transparent Pricing for Every Creator
        </h1>
        <p className="text-base text-slate-600">
          Currently free during launch! Standard subscriptions will be introduced as we scale.
        </p>

        {/* Billing cycle toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 bg-slate-200 rounded-full p-1 border border-slate-300 relative transition-colors focus:outline-none cursor-pointer"
          >
            <div className={`w-4 h-4 bg-brand-500 rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
            Annual Billing <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Main Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Starter Launch</h3>
            <p className="text-xs text-slate-500 mt-1">For casual photo cleanup and quick tests</p>

            <div className="my-6">
              <span className="text-4xl font-black text-slate-900">$0</span>
              <span className="text-xs text-slate-400"> / launch free</span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Unlimited AI Inpainting</strong> during launch</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standard Resolution Output (1080p)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Interactive Brush & Box Canvas tools</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Video Watermark Remover (15s–1min)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24h Automatic Privacy Auto-Purge</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-8"
            onClick={() => openAuthModal()}
          >
            Start Free Now
          </Button>
        </div>

        {/* Pro Creator Plan */}
        <div className="p-8 rounded-3xl bg-white border-2 border-brand-500 flex flex-col justify-between relative shadow-xl hover:shadow-2xl transition-all">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[11px] uppercase font-black px-4 py-1 rounded-full shadow-md">
            Most Popular
          </span>

          <div>
            <h3 className="text-xl font-bold text-slate-900">Pro Creator</h3>
            <p className="text-xs text-slate-500 mt-1">For photographers, creators, and marketers</p>

            <div className="my-6">
              <span className="text-4xl font-black text-slate-900">{billingCycle === 'yearly' ? '$15' : '$19'}</span>
              <span className="text-xs text-slate-400"> / month (Free in Launch)</span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>200 AI Credits / Mo</strong> (Unlimited now)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>4K Ultra-HD</strong> lossless image output</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Video Watermark Remover</strong> (MP4/MOV)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Batch Processing</strong> (Up to 50 items)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>High-Speed GPU Worker Priority</span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full mt-8 bg-brand-500 hover:bg-brand-600 text-white font-bold"
            onClick={() => openAuthModal()}
          >
            Claim Free Launch Pro
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Enterprise / API</h3>
            <p className="text-xs text-slate-500 mt-1">For high-volume teams and platforms</p>

            <div className="my-6">
              <span className="text-4xl font-black text-slate-900">{billingCycle === 'yearly' ? '$39' : '$49'}</span>
              <span className="text-xs text-slate-400"> / month</span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span><strong>1,000 AI Credits</strong> monthly</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span><strong>REST API Access</strong> with webhooks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Unlimited batch queue concurrency</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Direct S3 / Cloudflare R2 signed uploads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span>99.9% Uptime SLA & Priority Support</span>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full mt-8 font-bold"
            onClick={() => openAuthModal()}
          >
            Contact Enterprise
          </Button>
        </div>

      </div>

    </div>
  );
};
