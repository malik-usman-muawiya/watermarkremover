import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Check, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  Gift,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

import { SEO } from '../components/common/SEO';

const PRICING_FAQS = [
  {
    q: 'Is Watermark AI Remover really free during the launch?',
    a: 'Yes! To celebrate our launch, all watermark removal features (image and video) are 100% free and unlimited. No credit card is required.'
  },
  {
    q: 'Will my free credits expire?',
    a: 'During the launch window, there are no strict quotas or credit limits. You can process single images, bulk folders, and video clips freely.'
  },
  {
    q: 'Can I cancel or switch subscription plans at any time?',
    a: 'Yes, once paid commercial plans are officially enabled, you can upgrade, downgrade, or cancel your monthly or yearly plan anytime directly from your dashboard.'
  }
];

export const PricingPage: React.FC = () => {
  const { openAuthModal } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16 selection:bg-amber-500 selection:text-black relative overflow-hidden">
      <SEO
        title="Pricing Plans — Watermark AI Remover"
        description="Explore affordable pricing plans for Watermark AI Remover. Enjoy unlimited AI watermark removal, image compression, and batch tools."
        canonicalPath="/pricing"
        faqs={PRICING_FAQS}
      />

      
      {/* Subtle warm ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-amber-600/5 blur-[140px] -z-10 rounded-full pointer-events-none" />

      {/* Launch Banner Callout */}
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-[#18181c] via-[#1c1d25] to-[#18181c] border border-amber-500/30 text-white rounded-3xl shadow-2xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        {/* Ambient sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <Gift className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Grand Launch: 100% Free Unlimited Access</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Now
              </span>
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              All plans are currently unlocked for everyone. Sign in with Google to use all tools free of charge!
            </p>
          </div>
        </div>

        <button
          onClick={() => openAuthModal('Sign in with Google to claim your free launch access')}
          className="relative z-10 px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          Claim Free Access
        </button>
      </div>

      {/* Pricing Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/25 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Simple, Transparent Pricing</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Transparent Pricing for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)]">
            Every Creator
          </span>
        </h1>
        
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          100% free during our launch celebration! Standard subscription tiers are shown below for future commercial scaling.
        </p>

        {/* Billing cycle toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            role="switch"
            aria-checked={billingCycle === 'yearly'}
            aria-label="Toggle annual billing"
            className="w-12 h-6 bg-[#18181c] rounded-full p-1 border border-white/20 relative transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0e0e11] cursor-pointer"
          >
            <div className={`w-4 h-4 bg-amber-500 rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
            Annual Billing{' '}
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Main Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-[#121216] border border-white/10 flex flex-col justify-between hover:border-white/20 hover:shadow-2xl transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Starter Launch</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                Free Forever
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">For casual photo cleanup and quick tests</p>

            <div className="my-6">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-xs text-slate-400"> / launch free</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-white">Unlimited AI Inpainting</strong> during launch</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Standard Resolution Output (1080p)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Interactive Brush & Box Canvas tools</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Video Watermark Remover (15s–1min)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24h Automatic Privacy Auto-Purge</span>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-8 py-3.5 rounded-2xl bg-[#18181c] hover:bg-[#202028] text-slate-200 hover:text-white border border-white/15 font-bold text-xs transition-all cursor-pointer"
            onClick={() => openAuthModal()}
          >
            Start Free Now
          </button>
        </div>

        {/* Pro Creator Plan (Highlighted / Most Popular) */}
        <div className="p-8 rounded-3xl bg-[#14151e] border-2 border-amber-500 flex flex-col justify-between relative shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] uppercase font-black px-4 py-1 rounded-full shadow-lg border border-amber-300/40">
            Most Popular
          </span>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-1.5">
                <span>Pro Creator</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <span className="text-[10px] font-black text-amber-400 uppercase bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1.5">For photographers, creators, and marketers</p>

            <div className="my-6">
              <span className="text-4xl font-black text-amber-400">{billingCycle === 'yearly' ? '$15' : '$19'}</span>
              <span className="text-xs text-slate-400"> / month <span className="text-emerald-400 font-bold">(Free in Launch)</span></span>
            </div>

            <div className="space-y-3 text-xs text-slate-200 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">200 AI Credits / Mo</strong> (Unlimited now)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">4K Ultra-HD</strong> lossless image output</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">Video Watermark Remover</strong> (MP4/MOV)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">Batch Processing</strong> (Up to 50 items)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>High-Speed GPU Worker Priority</span>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-xs shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            onClick={() => openAuthModal()}
          >
            <span>Claim Free Launch Pro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="p-8 rounded-3xl bg-[#121216] border border-white/10 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-2xl transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Enterprise / API</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                Commercial
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">For high-volume teams and platforms</p>

            <div className="my-6">
              <span className="text-4xl font-black text-white">{billingCycle === 'yearly' ? '$39' : '$49'}</span>
              <span className="text-xs text-slate-400"> / month</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">1,000 AI Credits</strong> monthly</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">REST API Access</strong> with webhooks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Unlimited batch queue concurrency</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Direct S3 / Cloudflare R2 signed uploads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>99.9% Uptime SLA & Priority Support</span>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-8 py-3.5 rounded-2xl bg-[#18181c] hover:bg-[#202028] text-amber-400 hover:text-amber-300 border border-amber-500/30 font-bold text-xs transition-all cursor-pointer"
            onClick={() => openAuthModal()}
          >
            Contact Enterprise
          </button>
        </div>

      </div>

      {/* Pricing FAQs */}
      <div className="max-w-4xl mx-auto space-y-6 pt-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">Pricing & Account FAQs</h2>
          <p className="text-xs text-slate-400">Common questions regarding plans, credits, and billing</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Is Watermark AI Remover really free during the launch?',
              a: 'Yes! To celebrate our launch, all watermark removal features (image and video) are 100% free and unlimited. No credit card is required.'
            },
            {
              q: 'Will my free credits expire?',
              a: 'During the launch window, there are no strict quotas or credit limits. You can process single images, bulk folders, and video clips freely.'
            },
            {
              q: 'Can I cancel or switch subscription plans at any time?',
              a: 'Yes, once paid commercial plans are officially enabled, you can upgrade, downgrade, or cancel your monthly or yearly plan anytime directly from your dashboard.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#121216] border border-white/10 rounded-2xl hover:border-amber-500/40 hover:bg-[#16161c] transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                aria-expanded={activeFaq === idx}
                className="w-full flex items-center justify-between font-bold text-white text-sm text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xs">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.q}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-amber-400 transition-transform duration-200 shrink-0 ${activeFaq === idx ? 'rotate-90' : ''}`} />
              </button>
              {activeFaq === idx && (
                <p className="text-xs text-slate-300 mt-3 leading-relaxed border-t border-white/10 pt-3 animate-in fade-in">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
