import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { Sparkles, Home, Video, Layers3 } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <SEO 
        title="404 — Page Not Found"
        description="The page you were looking for could not be found on Watermark AI Remover. Return to our free AI inpainting tools."
        canonicalPath="/404"
        noindex={true}
      />

      <div className="w-full max-w-xl text-center space-y-8 bg-[#0D1527] border border-teal-500/20 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="text-6xl font-black text-white tracking-tight">404</div>
          <h1 className="text-2xl font-extrabold text-white">Page Not Found</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you requested does not exist, was moved, or the link is broken. You can head straight back to our AI tools below.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>AI Watermark Remover</span>
          </Link>
          <Link
            to="/editor/video"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#111A2E] hover:bg-[#18243e] text-white border border-teal-500/20 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Video className="w-4 h-4 text-teal-400" />
            <span>Video Remover</span>
          </Link>
        </div>

        <div className="relative z-10 pt-4 border-t border-teal-500/10 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <Link to="/compress-image" className="hover:text-teal-400 transition-colors flex items-center gap-1">
            <Layers3 className="w-3.5 h-3.5" />
            <span>Image Compressor</span>
          </Link>
          <span>&bull;</span>
          <Link to="/pricing" className="hover:text-teal-400 transition-colors">
            Pricing
          </Link>
          <span>&bull;</span>
          <Link to="/api-docs" className="hover:text-teal-400 transition-colors">
            API Documentation
          </Link>
          <span>&bull;</span>
          <Link to="/legal?tab=terms" className="hover:text-teal-400 transition-colors">
            Terms & Privacy
          </Link>
        </div>
      </div>
    </div>
  );
};
