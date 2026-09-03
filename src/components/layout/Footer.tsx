import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#026a7e] text-white text-sm border-t border-teal-600/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Philosophy (Matching Image 1) */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white p-0.5 shadow-md">
                <div className="w-full h-full bg-[#026a7e] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-teal-200" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                  CLEANMARK <span className="text-teal-200">AI</span>
                </span>
                <span className="text-[9px] text-teal-200 uppercase tracking-widest font-bold mt-0.5">
                  AI INPAINTING SUITE
                </span>
              </div>
            </Link>

            <p className="text-teal-100/90 text-xs leading-relaxed">
              The independent AI media inpainting platform providing high-fidelity watermark, logo, text, and object removal across global media.
            </p>

            <div className="pt-2 text-xs text-teal-200/80">
              © 2026 CleanMark AI.
            </div>
          </div>

          {/* Col 2: AI Inpainting Hubs */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 text-teal-100">
              AI INPAINTING HUBS
            </h4>
            <ul className="space-y-2.5 text-xs text-teal-100/90">
              <li>
                <Link to="/editor/image" className="hover:text-white transition-colors">
                  Image Watermark Remover
                </Link>
              </li>
              <li>
                <Link to="/editor/video" className="hover:text-white transition-colors">
                  AI Video Watermark Remover
                </Link>
              </li>
              <li>
                <Link to="/editor/image?mode=object" className="hover:text-white transition-colors">
                  AI Object & Person Eraser
                </Link>
              </li>
              <li>
                <Link to="/editor/batch" className="hover:text-white transition-colors">
                  Bulk Batch Inpainter
                </Link>
              </li>
              <li>
                <Link to="/seo/remove-logo-from-image" className="hover:text-white transition-colors font-bold text-teal-200 flex items-center gap-1">
                  <span>Product Photos & Analysis</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Features & Explanations */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 text-teal-100">
              RULES & EXPLANATIONS
            </h4>
            <ul className="space-y-2.5 text-xs text-teal-100/90">
              <li>
                <Link to="/seo/image-watermark-remover" className="hover:text-white transition-colors">
                  Lossless 4K PNG Export
                </Link>
              </li>
              <li>
                <Link to="/seo/video-watermark-remover" className="hover:text-white transition-colors">
                  Temporal Video Guide
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=privacy" className="hover:text-white transition-colors">
                  24h Privacy Auto-Purge
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=acceptable-use" className="hover:text-white transition-colors">
                  Zero AI Model Training
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=dmca" className="hover:text-white transition-colors">
                  DMCA & Copyright Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tools & Formats */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 text-teal-100">
              MEDIA FORMATS & SPECS
            </h4>
            <ul className="space-y-2.5 text-xs text-teal-100/90">
              <li>
                <Link to="/editor/video" className="hover:text-white transition-colors">
                  15s to 1min MP4 Clips
                </Link>
              </li>
              <li>
                <Link to="/editor/image" className="hover:text-white transition-colors">
                  JPG / PNG / WEBM / TIFF
                </Link>
              </li>
              <li>
                <Link to="/editor/image" className="hover:text-white transition-colors">
                  Brush & Rect Mask Canvas
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="hover:text-white transition-colors">
                  Developer REST API Specs
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Free Launch Quota Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Useful Links */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 text-teal-100">
              USEFUL LINKS
            </h4>
            <ul className="space-y-2.5 text-xs text-teal-100/90">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=privacy" className="hover:text-white transition-colors">
                  Editorial & Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="hover:text-white transition-colors">
                  Contact Editorial Desk
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  AI Workers Operational
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};
