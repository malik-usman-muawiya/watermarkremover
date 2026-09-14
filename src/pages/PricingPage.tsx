import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    a: 'Yes! To celebrate our launch, all watermark removal features (image and video) are 100% free and unlimited. No credit card or Google sign-in is required.'
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16 selection:bg-teal-500 selection:text-slate-950 relative overflow-hidden">
      <SEO
        title="Pricing & Free Launch Access — Watermark AI Remover"
        description="Explore free launch access and flexible pricing plans for Watermark AI Remover. Enjoy unlimited AI watermark removal, image compression, and batch tools."
        canonicalPath="/pricing"
        keywords={[
          'watermark remover pricing',
          'free ai watermark remover',
          'watermark image remover online free',
          'cheap watermark remover',
          'unlimited watermark remover',
          'batch watermark removal free'
        ]}
        faqs={PRICING_FAQS}
      />

      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-teal-500/10 via-cyan-500/10 to-teal-600/5 blur-[140px] -z-10 rounded-full pointer-events-none" />

      {/* Launch Banner Callout */}
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-[#0D1527] via-[#111A2E] to-[#0D1527] border border-teal-500/30 text-white rounded-3xl shadow-2xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        {/* Ambient sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <Gift className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <p className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Grand Launch: 100% Free Unlimited Access</span>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-teal-500/30">
                Live Now
              </span>
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              All plans and tools are currently unlocked for everyone. Start cleaning photos immediately!
            </p>
          </div>
        </div>

        <Link
          to="/editor/image"
          className="relative z-10 px-6 py-2.5 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all"
        >
          Start Inpainting Free
        </Link>
      </div>

      {/* Pricing Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/25 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-teal-400" />
          <span>Simple, Transparent Pricing</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Transparent Plans for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-cyan-300 drop-shadow-[0_2px_15px_rgba(0,201,167,0.25)]">
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
            className="w-12 h-6 bg-[#0D1527] rounded-full p-1 border border-white/20 relative transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#070B14] cursor-pointer"
          >
            <div className={`w-4 h-4 bg-teal-400 rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
            Annual Billing{' '}
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-black px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Main Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-[#0D1527] border border-white/10 flex flex-col justify-between hover:border-teal-500/30 hover:shadow-2xl transition-all group">
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
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong className="text-white">Unlimited AI Inpainting</strong> during launch</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Standard Resolution Output (1080p)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Interactive Brush & Box Canvas tools</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Video Watermark Remover (15s–1min)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>24h Automatic Privacy Auto-Purge</span>
              </div>
            </div>
          </div>

          <Link
            to="/editor/image"
            className="w-full mt-8 py-3.5 rounded-2xl bg-[#0A0F1E] hover:bg-[#121C33] text-slate-200 hover:text-white border border-white/15 font-bold text-xs transition-all text-center block"
          >
            Start Free Now
          </Link>
        </div>

        {/* Pro Creator Plan (Highlighted / Most Popular) */}
        <div className="p-8 rounded-3xl bg-[#0D1527] border-2 border-teal-500 flex flex-col justify-between relative shadow-2xl shadow-teal-500/10 hover:shadow-teal-500/20 transition-all">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 text-[11px] uppercase font-black px-4 py-1 rounded-full shadow-lg border border-teal-300/40">
            Most Popular
          </span>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-1.5">
                <span>Pro Creator</span>
                <Sparkles className="w-4 h-4 text-teal-400" />
              </h2>
              <span className="text-[10px] font-black text-teal-400 uppercase bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1.5">For photographers, creators, and marketers</p>

            <div className="my-6">
              <span className="text-4xl font-black text-teal-400">{billingCycle === 'yearly' ? '$15' : '$19'}</span>
              <span className="text-xs text-slate-400"> / month <span className="text-teal-300 font-bold">(Free in Launch)</span></span>
            </div>

            <div className="space-y-3 text-xs text-slate-200 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong className="text-white">200 AI Credits / Mo</strong> (Unlimited now)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong className="text-white">4K Ultra-HD</strong> lossless image output</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong className="text-white">Video Watermark Remover</strong> (MP4/MOV)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong className="text-white">Batch Processing</strong> (Up to 50 items)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>High-Speed GPU Worker Priority</span>
              </div>
            </div>
          </div>

          <Link
            to="/editor/image"
            className="w-full mt-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs shadow-xl shadow-teal-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Claim Free Launch Pro</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="p-8 rounded-3xl bg-[#0D1527] border border-white/10 flex flex-col justify-between hover:border-teal-500/40 hover:shadow-2xl transition-all group">
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
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong className="text-white">1,000 AI Credits</strong> monthly</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong className="text-white">REST API Access</strong> with webhooks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Unlimited batch queue concurrency</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Direct S3 / Cloudflare R2 signed uploads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>99.9% Uptime SLA & Priority Support</span>
              </div>
            </div>
          </div>

          <Link
            to="/api-docs"
            className="w-full mt-8 py-3.5 rounded-2xl bg-[#0A0F1E] hover:bg-[#121C33] text-teal-400 hover:text-teal-300 border border-teal-500/30 font-bold text-xs transition-all text-center block"
          >
            Developer API Docs
          </Link>
        </div>

      </div>

      {/* Pricing FAQs */}
      <div className="max-w-4xl mx-auto space-y-6 pt-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">Pricing & Account FAQs</h2>
          <p className="text-xs text-slate-400">Common questions regarding plans, credits, and billing</p>
        </div>

        <div className="space-y-3">
          {PRICING_FAQS.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#0D1527] border border-white/10 rounded-2xl hover:border-teal-500/40 hover:bg-[#111A2E] transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                aria-expanded={activeFaq === idx}
                className="w-full flex items-center justify-between font-bold text-white text-sm text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-xs">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.q}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-teal-400 transition-transform duration-200 shrink-0 ${activeFaq === idx ? 'rotate-90' : ''}`} />
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
