import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { ComparisonSlider } from '../components/editor/ComparisonSlider';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  ArrowRight, 
  Check, 
  Lock, 
  Gift, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle,
  Zap,
  Star,
  FileStack
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleStartCleaning = () => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in with Google to start 100% free watermark removal');
    }
  };

  return (
    <div className="space-y-24 pb-20 bg-[#f8fafc]">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/10 blur-[130px] -z-10 rounded-full pointer-events-none" />

        {/* Free Launch Announcement Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-brand-700 mb-8 shadow-xs">
          <Gift className="w-3.5 h-3.5 text-brand-600" />
          <span>Special Launch Celebration: 100% Free & Unlimited Usage</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Remove Watermarks, Logos & Objects with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-500 to-cyan-600">AI Clarity</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Clean unwanted timestamps, watermark overlays, text, photobombers, and logos from photos and 15s–1min video clips in full original quality.
        </p>

        {/* CTA Group */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/editor/image" onClick={handleStartCleaning}>
            <button className="flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all active:scale-[0.98] cursor-pointer">
              <span>Start Free Inpainting</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <Link to="/editor/video">
            <button className="flex items-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base rounded-2xl border border-slate-300 shadow-sm transition-all hover:border-brand-500">
              <Video className="w-5 h-5 text-indigo-600" />
              <span>Video Watermark Remover</span>
            </button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>No 5-Image Limit (Unlimited Free Launch)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>1-Click Google Sign-in</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-brand-600" />
            <span>24h Automatic Storage Purge</span>
          </div>
        </div>

        {/* Interactive Before & After Showcase */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-2 bg-white border border-slate-200 shadow-xl">
          <ComparisonSlider
            originalUrl={SAMPLE_IMAGES[0].originalUrl}
            resultUrl={SAMPLE_IMAGES[0].cleanUrl}
            title="Interactive Live Demo"
            onReset={() => {}}
          />
        </div>
      </section>

      {/* Feature Cards Grid (Clean White / Light Teal) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold text-brand-600 tracking-widest">Enterprise Neural Architecture</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">Precision AI Media Inpainting</h3>
          <p className="text-slate-600 text-sm mt-3">
            Trained specifically on texture synthesis, lighting coherence, and edge boundary reconstruction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-brand-500 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">AI Image Watermark Remover</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Draw brush masks or box areas over unwanted logos, copyright text, stamps, and photobombers with real-time inpainting.
            </p>
            <Link to="/editor/image" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700">
              Open Image Studio <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Video Watermark Remover</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Easily upload 15s to 1min MP4 or MOV clips. Clean watermark regions with optical flow temporal coherence and download the cleaned video.
            </p>
            <Link to="/editor/video" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              Open Video Studio <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileStack className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Bulk Batch Processing</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Clean up full folders and product catalogs at once. Download all cleaned images in one click as a ZIP archive.
            </p>
            <Link to="/editor/batch" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700">
              Open Batch Studio <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section (Matching Image 1 Card Style) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
          <p className="text-slate-500 text-sm mt-2">Everything you need to know about CleanMark AI</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does CleanMark AI remove watermarks without blurring the image?',
              a: 'Instead of traditional simple blur or clone stamps, CleanMark AI uses deep convolutional inpainting diffusion neural networks to reconstruct the underlying background texture, continuity, and lighting based on surrounding pixel context.'
            },
            {
              q: 'Is CleanMark AI really 100% free with no 5-image limits?',
              a: 'Yes! To celebrate our grand launch, all image and video watermark removal features are 100% free and unlimited. Sign in with Google to start using all tools right away.'
            },
            {
              q: 'How does the Video Watermark Remover work?',
              a: 'You can upload any 15s to 1min MP4, MOV, or WEBM clip, place the watermark bounding box over the logo or timestamp, and our temporal inpainting engine will clean the frames while preserving 100% of the original audio.'
            },
            {
              q: 'How long are uploaded files retained on your servers?',
              a: 'Privacy and security are our core principles. All uploaded source images, videos, and results are automatically purged from our private encrypted storage after 24 hours.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-brand-500/60 hover:shadow-sm transition-all"
              onClick={() => toggleFaq(idx)}
            >
              <div className="flex items-center justify-between font-bold text-slate-800 text-base">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-teal-50 text-brand-600 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span>{item.q}</span>
                </div>
                <ChevronRight className={`w-5 h-5 text-brand-600 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
              </div>
              {activeFaq === idx && (
                <p className="text-sm text-slate-600 mt-4 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-teal-700 via-brand-600 to-[#026a7e] text-white text-center shadow-xl overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Clean Your Photos & Videos?
            </h3>
            <p className="text-teal-100 text-base">
              Take advantage of our limited-time free launch access. No limits, no credit card required.
            </p>
            <Link to="/editor/image">
              <button 
                onClick={handleStartCleaning}
                className="px-8 py-4 bg-white hover:bg-teal-50 text-brand-700 font-extrabold text-base rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span>Claim Free Launch Access Now</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
