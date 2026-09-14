import React from 'react';
import { Link } from 'react-router-dom';

export interface EditorTabBarProps {
  activeTab: 'image' | 'video' | 'batch';
}

export const EditorTabBar: React.FC<EditorTabBarProps> = ({ activeTab }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center p-1.5 bg-[#18181c] border border-white/10 rounded-full shadow-lg">
        <Link
          to="/editor/image"
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'image'
              ? 'bg-[#282830] text-white shadow-md border border-white/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Image watermark remover
        </Link>

        <Link
          to="/editor/video"
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'video'
              ? 'bg-[#282830] text-white shadow-md border border-white/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Video watermark remover</span>
          <span className="bg-teal-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">
            New
          </span>
        </Link>

        <Link
          to="/editor/batch"
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'batch'
              ? 'bg-[#282830] text-white shadow-md border border-white/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Batch multi-image inpaint
        </Link>
      </div>
    </div>
  );
};
