import React from 'react';
import { Tag } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  return (
    <div className="bg-[#0A0F1E] border-b border-white/[0.06] text-white text-xs py-2 px-4 select-none relative z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left / Center: Announcement Bar */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="font-bold text-slate-200">
            Watermark AI 3.0 — AI Watermark & Video Remover
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 font-extrabold text-[11px]">
            <Tag className="w-3 h-3" />
            <span>Grand Launch — 100% Free Access</span>
          </div>
        </div>

        {/* Right: Free Launch Quota */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-teal-500/30">
            Unlimited Free
          </span>
          <span className="text-slate-400 text-[11px]">
            Zero signup required &bull; No credit card
          </span>
        </div>

      </div>
    </div>
  );
};
