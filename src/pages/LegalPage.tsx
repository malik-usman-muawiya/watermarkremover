import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lock, Shield, ShieldCheck, FileText, Scale } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const LegalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'terms' | 'privacy' | 'acceptable-use' | 'dmca') || 'terms';
  const [tab, setTab] = useState<'terms' | 'privacy' | 'acceptable-use' | 'dmca'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEO 
        title="Terms of Service & Privacy Policy — Watermark AI Remover"
        description="Comprehensive Terms of Service, Privacy Policy, Acceptable Use, and DMCA guidelines for Watermark AI Remover. Transparent media privacy policies."
        canonicalPath="/legal"
      />
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-400">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          <span>Trust & Compliance Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Legal & Compliance Terms</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Watermark AI Remover is built with stringent privacy guarantees, transparent data handling, and responsible AI policies.
        </p>

        {/* Tab switcher */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {[
            { id: 'terms', label: 'Terms of Service', icon: Scale },
            { id: 'privacy', label: 'Privacy & Data Retention', icon: Lock },
            { id: 'acceptable-use', label: 'Acceptable Use Policy', icon: ShieldCheck },
            { id: 'dmca', label: 'DMCA & Copyright', icon: FileText },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 shadow-md font-extrabold shadow-teal-500/20'
                    : 'bg-[#0D1527] border border-teal-500/20 text-slate-300 hover:text-white hover:bg-[#111A2E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-8 bg-[#0D1527] border border-teal-500/20 rounded-3xl text-slate-300 text-sm leading-relaxed space-y-6 shadow-2xl">
        
        {tab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">1. Terms of Service</h2>
            <p>
              By accessing or using Watermark AI Remover ("the Service"), you agree to be bound by these Terms. The Service provides advanced media inpainting tools designed exclusively for media that you own, have created, or have received express written authorization to modify.
            </p>
            <h3 className="text-base font-bold text-white pt-2">2. Permitted & Authorized Use</h3>
            <p>
              You represent and warrant that any image, video, audio, or metadata processed with Watermark AI Remover does not infringe upon any third-party intellectual property rights, copyrights, trademarks, or rights of privacy. The service is provided "as is" for creative, professional, and personal productivity workflows.
            </p>
            <h3 className="text-base font-bold text-white pt-2">3. Subscription & Free Launch Access</h3>
            <p>
              During our Launch Edition, core image watermark removal features are provided 100% free of charge without mandatory subscriptions. Any future paid plan transitions will be communicated transparently with explicit opt-in confirmation.
            </p>
          </div>
        )}

        {tab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Privacy Policy & Client-Side Execution Guarantee</h2>
            <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-start gap-3">
              <Lock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-200">
                <strong className="text-teal-400">Zero Cloud Upload for Image Inpainting:</strong> Standard photo inpainting executes locally inside your browser sandbox via HTML5 Canvas. Your photos are not transmitted to remote servers.
              </div>
            </div>

            <h3 className="text-base font-bold text-white pt-2">No AI Model Training on User Data</h3>
            <p>
              We guarantee that your uploaded photos, video clips, and generated masks are NEVER used to train, retrain, or fine-tune public artificial intelligence models. Your original creative assets remain exclusively yours.
            </p>

            <h3 className="text-base font-bold text-white pt-2">Video Processing Is Also Local</h3>
            <p>
              Video watermark removal works the same way as photos: frames are decoded and re-rendered entirely inside your browser (via HTML5 Canvas and the MediaRecorder API), and the source clip is never uploaded to a server. Because nothing is ever transmitted, there is no server-side copy of your files to retain or delete. Any job history shown in your Dashboard is stored only in your browser and can be cleared at any time from that page.
            </p>
          </div>
        )}

        {tab === 'acceptable-use' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Acceptable Use & Ethical Standards</h2>
            <p>
              Watermark AI Remover actively prohibits illicit, fraudulent, or harmful activities. Users agree NEVER to use the service to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
              <li>Strip attribution or copyright notices from copyrighted stock assets without a valid commercial license.</li>
              <li>Alter official government credentials, legal documents, checks, or identity records.</li>
              <li>Generate non-consensual defamatory media, deepfakes, or abusive content.</li>
              <li>Conduct automated scraping, denial of service attacks, or malicious server disruption.</li>
            </ul>
          </div>
        )}

        {tab === 'dmca' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">DMCA & Copyright Takedown Procedure</h2>
            <p>
              Watermark AI Remover complies with the Digital Millennium Copyright Act (17 U.S.C. § 512). If you believe your copyrighted work is being hosted or infringed without authorization, please notify our designated copyright agent:
            </p>
            <div className="p-4 bg-[#111A2E] rounded-2xl border border-teal-500/10 text-xs font-mono text-slate-300">
              Email: support@watermarksairemover.com<br />
              Subject: DMCA Notice - [Media / Account Reference]<br />
              Agent: Copyright Compliance Office, Watermark AI Media Labs
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
