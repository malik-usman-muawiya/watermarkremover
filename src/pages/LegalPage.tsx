import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'terms' | 'privacy' | 'acceptable-use' | 'dmca') || 'terms';
  const [tab, setTab] = useState<'terms' | 'privacy' | 'acceptable-use' | 'dmca'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Legal & Compliance Center</h1>
        <p className="text-xs text-slate-500">
          Watermark AI Remover is built with stringent privacy guarantees, transparent data handling, and responsible AI policies.
        </p>

        {/* Tab switcher */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {[
            { id: 'terms', label: 'Terms of Service' },
            { id: 'privacy', label: 'Privacy & Data Retention' },
            { id: 'acceptable-use', label: 'Acceptable Use Policy' },
            { id: 'dmca', label: 'DMCA & Copyright' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                tab === t.id
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-8 bg-white border border-slate-200 rounded-3xl text-slate-700 text-sm leading-relaxed space-y-6 shadow-xs">
        
        {tab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">1. Terms of Service</h2>
            <p>
              By accessing or using CleanMark AI ("the Service"), you agree to be bound by these Terms. The Service provides advanced neural inpainting tools designed exclusively for media that you own, have created, or have received express written authorization to modify.
            </p>
            <h3 className="text-base font-bold text-slate-900 pt-2">2. Permitted Use</h3>
            <p>
              You represent and warrant that any image, video, audio, or metadata uploaded to CleanMark AI does not infringe upon any third-party intellectual property rights, copyrights, trademarks, or rights of privacy.
            </p>
          </div>
        )}

        {tab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Privacy Policy & 24-Hour Auto-Purge Guarantee</h2>
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3">
              <Lock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <strong className="text-brand-700">Zero AI Training on User Media:</strong> We never use your uploaded images, videos, or masks to train public AI models. All storage is private, encrypted, and isolated.
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 pt-2">Data Retention Policy</h3>
            <p>
              All original files, binary masks, and inpainted results are stored in private encrypted buckets and automatically permanently purged after exactly <strong>24 hours</strong>. Users can trigger an instant manual purge from their dashboard at any time.
            </p>
          </div>
        )}

        {tab === 'acceptable-use' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Acceptable Use & Ethical Standards</h2>
            <p>
              CleanMark AI actively prohibits any illicit or harmful activities. Users agree NEVER to use the service to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li>Remove attribution or copyright notices from copyrighted stock assets without a valid commercial license.</li>
              <li>Alter official government credentials, legal documents, checks, or identity records.</li>
              <li>Generate non-consensual deepfakes, defamatory media, or abusive content.</li>
            </ul>
          </div>
        )}

        {tab === 'dmca' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">DMCA & Copyright Takedown Procedure</h2>
            <p>
              CleanMark AI complies with the Digital Millennium Copyright Act (17 U.S.C. § 512). If you believe your copyrighted work is being processed or hosted without authorization, please notify our designated copyright agent:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700">
              Email: copyright@cleanmark.ai<br />
              Subject: DMCA Notice - [Media / Account Reference]
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
