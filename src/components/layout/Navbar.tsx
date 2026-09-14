import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Minimize2,
  FileCheck,
  Maximize2,
  Layers,
  Grid,
  CreditCard,
  Code2,
  Shield,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/' || path === '/editor/image') {
      return location.pathname === '/' || location.pathname === '/editor/image';
    }
    return location.pathname === path;
  };

  const isToolsActive = [
    '/pakistan-job-form-photo-size',
    '/reduce-image-resolution',
    '/pricing',
    '/api-docs',
    '/legal',
    '/admin'
  ].includes(location.pathname);

  // Close tools popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setToolsMenuOpen(false);
      }
    };
    if (toolsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toolsMenuOpen]);

  // Close tools menu on navigation
  useEffect(() => {
    setToolsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Floating Bottom Minimal Navigation Bar */}
      <nav 
        aria-label="Main navigation"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] sm:max-w-none select-none"
      >
        {/* Tools Menu Popover (Opens directly above bottom bar) */}
        {toolsMenuOpen && (
          <div 
            ref={menuRef}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-72 sm:w-80 p-3 bg-[#0A0F1E]/95 backdrop-blur-2xl border border-teal-500/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,201,167,0.15)] animate-in fade-in slide-in-from-bottom-3 duration-200 space-y-1.5 text-xs z-50"
          >
            <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/10 mb-1">
              <span className="font-extrabold uppercase tracking-widest text-[10px] text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-teal-400" />
                RankNex Studio Suite
              </span>
              <button 
                onClick={() => setToolsMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close tools menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <Link
              to="/pakistan-job-form-photo-size"
              className="flex items-center gap-2.5 p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400 shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span>Pakistan Form Photo Hub</span>
                  <span className="text-[9px] font-black bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded">NTS/CSS</span>
                </div>
                <div className="text-[11px] text-slate-400">NADRA, Passport & Govt test presets</div>
              </div>
            </Link>

            <Link
              to="/reduce-image-resolution"
              className="flex items-center gap-2.5 p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold">Reduce Image Resolution</div>
                <div className="text-[11px] text-slate-400">Scale dimensions & downsample pixels</div>
              </div>
            </Link>

            <Link
              to="/pricing"
              className="flex items-center gap-2.5 p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span>Pricing & Features</span>
                  <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">FREE</span>
                </div>
                <div className="text-[11px] text-slate-400">100% free unlimited launch access</div>
              </div>
            </Link>

            <Link
              to="/api-docs"
              className="flex items-center gap-2.5 p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400 shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold">Developer API Docs</div>
                <div className="text-[11px] text-slate-400">REST endpoints, cURL, Python & Node</div>
              </div>
            </Link>

            <Link
              to="/legal"
              className="flex items-center gap-2.5 p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold">Privacy & Security</div>
                <div className="text-[11px] text-slate-400">100% private in-browser processing</div>
              </div>
            </Link>
          </div>
        )}

        {/* The Minimal Bottom Dock Pill */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#0A0F1E]/92 backdrop-blur-2xl border border-teal-500/30 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(0,201,167,0.18)] ring-1 ring-teal-500/15">
          
          {/* Brand Home Mark */}
          <Link
            to="/"
            title="Watermark AI Remover (RankNex Theme)"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 p-1.5 shadow-md shadow-teal-500/25 hover:scale-105 active:scale-95 transition-transform shrink-0 mr-0.5 sm:mr-1"
          >
            <Sparkles className="w-full h-full text-slate-950 stroke-[2.5]" />
          </Link>

          {/* 1. Image Watermark Remover */}
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all ${
              isActive('/')
                ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-teal-500/25 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Image</span>
          </Link>

          {/* 2. Image Compressor */}
          <Link
            to="/compress-image"
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all ${
              isActive('/compress-image')
                ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-teal-500/25 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Compress</span>
          </Link>

          {/* 3. Video Watermark Remover */}
          <Link
            to="/editor/video"
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all ${
              isActive('/editor/video')
                ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-teal-500/25 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Video</span>
          </Link>

          {/* 4. Batch Inpaint */}
          <Link
            to="/editor/batch"
            className={`hidden xs:flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all ${
              isActive('/editor/batch')
                ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-teal-500/25 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Batch</span>
          </Link>

          {/* Vertical Divider */}
          <div className="w-px h-5 bg-white/15 mx-0.5" />

          {/* 5. More Tools Popover Trigger */}
          <button
            onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
            aria-label="Toggle more AI tools menu"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              toolsMenuOpen || isToolsActive
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs font-bold">Tools</span>
          </button>

        </div>
      </nav>
    </>
  );
};
