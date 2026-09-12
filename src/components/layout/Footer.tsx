import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121216] text-white text-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#18181c] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                  WATERMARK <span className="text-amber-400">AI</span> REMOVER
                </span>
                <span className="text-[9px] text-amber-400 uppercase tracking-widest font-bold mt-0.5">
                  AI TOOLS SUITE
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed">
              The high-speed AI media processing suite for watermark removal, exact-KB image compression, resolution scaling, and video inpainting.
            </p>

            <div className="pt-2 text-xs text-slate-500">
              © 2026 Watermark AI Remover. Free Launch Edition.
            </div>
          </div>

          {/* Col 2: Image Compression Cluster */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 text-amber-400">
              IMAGE COMPRESSOR
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/compress-image" className="hover:text-white transition-colors font-bold text-slate-200">
                  Main Image Compressor
                </Link>
              </li>
              <li>
                <Link to="/compress-image-to-20kb" className="hover:text-white transition-colors">
                  Compress Image to 20KB
                </Link>
              </li>
              <li>
                <Link to="/compress-image-to-50kb" className="hover:text-white transition-colors">
                  Compress Image to 50KB
                </Link>
              </li>
              <li>
                <Link to="/compress-image-to-100kb" className="hover:text-white transition-colors">
                  Compress Image to 100KB
                </Link>
              </li>
              <li>
                <Link to="/compress-image-to-200kb" className="hover:text-white transition-colors">
                  Compress Image to 200KB
                </Link>
              </li>
              <li>
                <Link to="/compress-image-to-300kb" className="hover:text-white transition-colors">
                  Compress Image to 300KB
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Photo Utilities & Form Hubs */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 text-emerald-400">
              PORTAL HUBS & TOOLS
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/pakistan-job-form-photo-size" className="hover:text-white transition-colors font-bold text-emerald-400 flex items-center gap-1">
                  <span>🇵🇰 Pakistan Form Photo Hub</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/reduce-image-resolution" className="hover:text-white transition-colors">
                  Reduce Image Resolution
                </Link>
              </li>
              <li>
                <Link to="/compress-gif" className="hover:text-white transition-colors">
                  Animated GIF Compressor
                </Link>
              </li>
              <li>
                <Link to="/editor/batch" className="hover:text-white transition-colors">
                  Batch Multi-File Inpaint
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Watermark & Video Tools */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 text-cyan-400">
              WATERMARK REMOVERS
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/editor/image" className="hover:text-white transition-colors">
                  Image Watermark Remover
                </Link>
              </li>
              <li>
                <Link to="/editor/video" className="hover:text-white transition-colors">
                  Video Watermark Remover
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="hover:text-white transition-colors">
                  Developer REST API Docs
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Free Unlimited Launch
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Compliance */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 text-purple-400">
              PRIVACY & SECURITY
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/legal?tab=privacy" className="hover:text-white transition-colors">
                  Client-Side In-Browser Processing
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=acceptable-use" className="hover:text-white transition-colors">
                  Acceptable Use Policy
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>SOC2 & GDPR Compliant</span>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};
