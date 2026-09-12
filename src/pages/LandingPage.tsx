import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { ComparisonSlider } from '../components/editor/ComparisonSlider';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/common/SEO';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  ArrowRight, 
  Check, 
  Lock, 
  Gift, 
  ChevronRight, 
  HelpCircle,
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
    <div className="space-y-24 pb-24 bg-[#0e0e11] text-slate-100 min-h-screen selection:bg-amber-500 selection:text-black">
      <SEO
        title="Watermark AI Remover — Free AI Watermark & Object Removal Tool"
        description="Remove watermarks, logos, timestamps, and unwanted objects from images and videos with AI-powered inpainting. 100% free, no signup required for the launch."
        canonicalPath="/landing"
      />
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle background warm amber glow matching navbar logo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-amber-600/5 blur-[140px] -z-10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[250px] bg-amber-500/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

        {/* Free Launch Announcement Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-400 mb-8 shadow-lg shadow-amber-500/5 backdrop-blur-sm">
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          <span>Special Launch Celebration: 100% Free & Unlimited Usage</span>
          <ChevronRight className="w-3 h-3 text-amber-400/60" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Remove Watermarks, Logos & Objects with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 drop-shadow-[0_2px_20px_rgba(245,158,11,0.25)]">
            AI Clarity
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Clean unwanted timestamps, watermark overlays, text, photobombers, and logos from photos and video clips in full original quality.
        </p>

        {/* CTA Group */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/editor/image" onClick={handleStartCleaning}>
            <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/35 transition-all active:scale-[0.98] cursor-pointer">
              <span>Start Free Inpainting</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          </Link>
          <Link to="/editor/video">
            <button className="flex items-center gap-2 px-6 py-4 bg-[#18181c] hover:bg-[#202026] text-slate-200 hover:text-white font-bold text-base rounded-2xl border border-white/15 shadow-md transition-all hover:border-amber-500/50 cursor-pointer">
              <Video className="w-5 h-5 text-amber-400" />
              <span>Video Watermark Remover</span>
            </button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>No 5-Image Limit (Unlimited Free Launch)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>1-Click Google Sign-in</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>24h Automatic Storage Purge</span>
          </div>
        </div>

        {/* Interactive Before & After Showcase */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-2.5 bg-[#121216] border border-white/10 shadow-2xl shadow-black/80 ring-1 ring-white/5">
          <ComparisonSlider
            originalUrl={SAMPLE_IMAGES[0].originalUrl}
            resultUrl={SAMPLE_IMAGES[0].cleanUrl}
            title="Interactive Live Demo"
            onReset={() => {}}
          />
        </div>
      </section>

      {/* Feature Cards Grid (Dark Navbar Themed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold text-amber-400 tracking-widest">Enterprise Neural Architecture</h2>
          <h3 className="text-3xl sm:text-4xl font-black text-white mt-2">Precision AI Media Inpainting</h3>
          <p className="text-slate-400 text-sm mt-3">
            Trained specifically on texture synthesis, lighting coherence, and edge boundary reconstruction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-[#121216] border border-white/10 hover:border-amber-500/50 hover:bg-[#16161c] hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-extrabold text-white mb-2 group-hover:text-amber-300 transition-colors">AI Image Watermark Remover</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Draw brush masks or box areas over unwanted logos, copyright text, stamps, and photobombers with real-time inpainting.
            </p>
            <Link to="/editor/image" className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 hover:text-amber-300 group-hover:gap-2.5 transition-all">
              <span>Open Image Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-[#121216] border border-white/10 hover:border-orange-500/50 hover:bg-[#16161c] hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-extrabold text-white mb-2 group-hover:text-orange-300 transition-colors">Video Watermark Remover</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Upload MP4 or MOV clips. Clean watermark regions with optical flow temporal coherence and download the cleaned video.
            </p>
            <Link to="/editor/video" className="inline-flex items-center gap-1.5 text-xs font-black text-orange-400 hover:text-orange-300 group-hover:gap-2.5 transition-all">
              <span>Open Video Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-[#121216] border border-white/10 hover:border-amber-400/50 hover:bg-[#16161c] hover:shadow-2xl hover:shadow-amber-400/5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileStack className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-extrabold text-white mb-2 group-hover:text-amber-200 transition-colors">Bulk Batch Processing</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Clean up full folders and product catalogs at once. Download all cleaned images in one click as a ZIP archive.
            </p>
            <Link to="/editor/batch" className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 hover:text-amber-300 group-hover:gap-2.5 transition-all">
              <span>Open Batch Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section (Dark Navbar Themed) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-black text-white">Frequently Asked Questions</h3>
          <p className="text-slate-400 text-sm mt-2">Everything you need to know about Watermark AI Remover</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does Watermark AI Remover remove watermarks without blurring the image?',
              a: 'Instead of traditional simple blur or clone stamps, Watermark AI Remover uses deep convolutional inpainting diffusion neural networks to reconstruct the underlying background texture, continuity, and lighting based on surrounding pixel context.'
            },
            {
              q: 'Is Watermark AI Remover really 100% free with no 5-image limits?',
              a: 'Yes! To celebrate our grand launch, all image and video watermark removal features are 100% free and unlimited. Sign in with Google to start using all tools right away.'
            },
            {
              q: 'How does the Video Watermark Remover work?',
              a: 'You can upload any MP4, MOV, or WEBM clip, place the watermark bounding box over the logo or timestamp, and our temporal inpainting engine will clean the frames while preserving 100% of the original audio.'
            },
            {
              q: 'How long are uploaded files retained on your servers?',
              a: 'Privacy and security are our core principles. All uploaded source images, videos, and results are automatically purged from our private encrypted storage after 24 hours.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#121216] border border-white/10 rounded-2xl cursor-pointer hover:border-amber-500/40 hover:bg-[#16161c] transition-all"
              onClick={() => toggleFaq(idx)}
            >
              <div className="flex items-center justify-between font-bold text-white text-base">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span>{item.q}</span>
                </div>
                <ChevronRight className={`w-5 h-5 text-amber-400 transition-transform duration-200 ${activeFaq === idx ? 'rotate-90' : ''}`} />
              </div>
              {activeFaq === idx && (
                <p className="text-sm text-slate-300 mt-4 leading-relaxed border-t border-white/10 pt-4 animate-in fade-in">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner (Dark Card with Amber Glow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-[#18181c] via-[#15151a] to-[#18181c] border border-amber-500/30 text-white text-center shadow-2xl overflow-hidden">
          {/* Ambient warm gradient sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Clean Your Photos & Videos?
            </h3>
            <p className="text-slate-300 text-base">
              Take advantage of our limited-time free launch access. No limits, no credit card required.
            </p>
            <Link to="/editor/image">
              <button 
                onClick={handleStartCleaning}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/35 transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Claim Free Launch Access Now</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
