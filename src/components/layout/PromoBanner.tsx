import React from 'react';
import { Tag } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  return (
    <div className="bg-[#121216] border-b border-white/10 text-white text-xs py-2 px-4 select-none relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left / Center: Announcement Bar */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="text-base">🚀</span>
          <span className="font-bold text-slate-200">
            Watermark 3.0 - Launch Offer - 30% off on Annual Plans
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-extrabold text-[11px]">
            <Tag className="w-3 h-3" />
            <span>Discount Code - OFF30</span>
          </div>
        </div>

        {/* Right: Free Launch Quota */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-500/30">
            100% Free Launch
          </span>
          <span className="text-slate-400 text-[11px]">
            Unlimited batch inpainting enabled
          </span>
        </div>

      </div>
    </div>
  );
};
