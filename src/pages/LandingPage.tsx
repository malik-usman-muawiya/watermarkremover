import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { ComparisonSlider } from '../components/editor/ComparisonSlider';
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
  FileStack,
  Search,
  CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="space-y-24 pb-24 bg-[#070B14] text-slate-100 min-h-screen selection:bg-teal-500 selection:text-slate-950">
      <SEO
        title="AI Watermark Remover — Free Online Watermark Image & Video Remover"
        description="Best free AI watermark remover and watermark image remover. Remove watermark from image, photos, and videos online with zero blur. Instant inpainting, 100% free."
        canonicalPath="/landing"
        keywords={[
          "watermark remover",
          "ai watermark remover",
          "watermark image remover",
          "remove watermark from image",
          "remove watermark from photo",
          "remove watermark from picture",
          "photo watermark remover",
          "picture watermark remover",
          "image watermark remover",
          "free watermark remover",
          "watermark remover free",
          "watermark remover online",
          "free watermark remover online",
          "ai watermark remover online",
          "remove watermark online free",
          "erase watermark from photo",
          "erase watermark from image",
          "watermark eraser",
          "watermark cleaner",
          "remove logo from image",
          "remove text from image",
          "remove stamp from photo",
          "transparent watermark remover",
          "remove watermark without blur",
          "clean watermark ai",
          "best watermark remover",
          "best ai watermark remover",
          "video watermark remover",
          "get rid of watermark",
          "unwatermark image ai"
        ]}
      />
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle background teal glow matching RankNex theme */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-teal-600/5 blur-[140px] -z-10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[250px] bg-teal-500/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

        {/* Free Launch Announcement Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-xs font-bold text-teal-400 mb-8 shadow-lg shadow-teal-500/5 backdrop-blur-sm">
          <Gift className="w-3.5 h-3.5 text-teal-400" />
          <span>100% Free & Unlimited AI Watermark Remover</span>
          <ChevronRight className="w-3 h-3 text-teal-400/60" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
          AI Watermark Remover &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 drop-shadow-[0_2px_20px_rgba(0,201,167,0.25)]">
            Watermark Image Remover
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Remove watermark from image, photos, timestamps, logos, and video clips in seconds. Free neural inpainting technology delivers crystal-clear results with zero blur or quality loss.
        </p>

        {/* CTA Group */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/editor/image">
            <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-teal-500/20 hover:shadow-teal-500/35 transition-all active:scale-[0.98] cursor-pointer">
              <span>Remove Watermark Free</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          </Link>
          <Link to="/editor/video">
            <button className="flex items-center gap-2 px-6 py-4 bg-[#0D1527] hover:bg-[#111A2E] text-slate-200 hover:text-white font-bold text-base rounded-2xl border border-white/15 shadow-md transition-all hover:border-teal-500/50 cursor-pointer">
              <Video className="w-5 h-5 text-teal-400" />
              <span>Video Watermark Remover</span>
            </button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-teal-400" />
            <span>100% Free Online — No Sign Up Needed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-teal-400" />
            <span>AI Neural Texture Reconstruction</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-teal-400" />
            <span>100% Private In-Browser Processing</span>
          </div>
        </div>

        {/* Interactive Before & After Showcase */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-2.5 bg-[#0D1527] border border-white/10 shadow-2xl shadow-black/80 ring-1 ring-white/5">
          <ComparisonSlider
            originalUrl={SAMPLE_IMAGES[0].originalUrl}
            resultUrl={SAMPLE_IMAGES[0].cleanUrl}
            title="Interactive Live Demo"
            onReset={() => {}}
          />
        </div>
      </section>

      {/* SEO Popular Searches & Keyword Cloud */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-[#0D1527] border border-white/10 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-extrabold uppercase tracking-wider">
                <Search className="w-4 h-4" />
                <span>Trending Watermark Removal Searches</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Popular Searches for AI Watermark Removal
              </h2>
            </div>
            <span className="text-xs text-slate-400">Targeted AI inpainting models optimized for all formats</span>
          </div>

          {/* Keyword Cloud Chips */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: 'Watermark Remover', count: 'High Search Volume', link: '/editor/image' },
              { label: 'AI Watermark Remover', count: 'Zero Blur', link: '/editor/image' },
              { label: 'Watermark Image Remover', count: 'Instant PNG/JPG', link: '/editor/image' },
              { label: 'Remove Watermark from Image', count: 'Neural Inpaint', link: '/editor/image' },
              { label: 'Remove Watermark from Photo', count: 'High Quality', link: '/editor/image' },
              { label: 'Remove Watermark from Picture', count: 'Lossless', link: '/editor/image' },
              { label: 'Video Watermark Remover', count: 'Optical Flow', link: '/editor/video' },
              { label: 'Photo Watermark Remover Online', count: '100% Free', link: '/editor/image' },
              { label: 'Transparent Watermark Remover', count: 'Smart Inpaint', link: '/editor/image' },
              { label: 'Remove Watermark Without Blur', count: 'Full HD', link: '/editor/image' },
              { label: 'Erase Watermark Online Free', count: 'No Signup', link: '/editor/image' },
              { label: 'Watermark Cleaner AI', count: 'Lossless HD', link: '/editor/image' },
              { label: 'Batch Watermark Remover', count: 'Bulk Folders', link: '/editor/batch' },
              { label: 'Logo Watermark Remover', count: 'Clean Inpaint', link: '/editor/image' },
              { label: 'Photo Stamp & Date Remover', count: 'Edge Aware', link: '/editor/image' },
              { label: 'TikTok Video Watermark Remover', count: 'Full FPS', link: '/editor/video' },
              { label: 'Shutterstock Watermark Remover', count: 'Precision Eraser', link: '/editor/image' },
              { label: 'Text Watermark Remover from Photo', count: 'Deep Diffusion', link: '/editor/image' }
            ].map((kw, i) => (
              <Link
                key={i}
                to={kw.link}
                className="group flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#111A2E] hover:bg-teal-500/10 border border-teal-500/20 hover:border-teal-500/50 text-xs text-slate-300 hover:text-white transition-all shadow-xs"
              >
                <span className="font-bold group-hover:text-teal-400 transition-colors">{kw.label}</span>
                <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full font-semibold border border-teal-500/20">
                  {kw.count}
                </span>
              </Link>
            ))}
          </div>

          {/* SEO Content Text Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
            <div>
              <h3 className="font-extrabold text-white text-sm mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>AI Watermark Remover</span>
              </h3>
              <p>
                Our AI watermark remover reconstructs underlying visual textures using deep convolutional diffusion models. Clean photos, stock assets, and graphic proofs without blur.
              </p>
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Watermark Image Remover</span>
              </h3>
              <p>
                The ultimate watermark image remover tool for JPG, PNG, WEBP, and HEIC files. Removes text stamps, photographer signatures, and logo overlays in pristine resolution.
              </p>
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Video Watermark Remover</span>
              </h3>
              <p>
                Temporal coherence neural algorithms eliminate moving stamps, channel tags, and timestamps from video clips while maintaining full framerate and crystal-clear audio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (RankNex Themed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold text-teal-400 tracking-widest">Enterprise Neural Architecture</h2>
          <h3 className="text-3xl sm:text-4xl font-black text-white mt-2">Precision AI Media Inpainting</h3>
          <p className="text-slate-400 text-sm mt-3">
            Trained specifically on texture synthesis, lighting coherence, and edge boundary reconstruction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-[#0D1527] border border-white/10 hover:border-teal-500/50 hover:bg-[#111A2E] hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-extrabold text-white mb-2 group-hover:text-teal-300 transition-colors">AI Image Watermark Remover</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Draw brush masks or box areas over unwanted logos, copyright text, stamps, and photobombers with real-time inpainting.
            </p>
            <Link to="/editor/image" className="inline-flex items-center gap-1.5 text-xs font-black text-teal-400 hover:text-teal-300 group-hover:gap-2.5 transition-all">
              <span>Open Image Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-[#0D1527] border border-white/10 hover:border-cyan-500/50 hover:bg-[#111A2E] hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-extrabold text-white mb-2 group-hover:text-cyan-300 transition-colors">Video Watermark Remover</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Upload MP4 or MOV clips. Clean watermark regions with optical flow temporal coherence and download the cleaned video.
            </p>
            <Link to="/editor/video" className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-400 hover:text-cyan-300 group-hover:gap-2.5 transition-all">
              <span>Open Video Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-[#0D1527] border border-white/10 hover:border-teal-400/50 hover:bg-[#111A2E] hover:shadow-2xl hover:shadow-teal-400/5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-400/10 text-teal-300 border border-teal-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileStack className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-extrabold text-white mb-2 group-hover:text-teal-200 transition-colors">Bulk Batch Processing</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Clean up full folders and product catalogs at once. Download all cleaned images in one click as a ZIP archive.
            </p>
            <Link to="/editor/batch" className="inline-flex items-center gap-1.5 text-xs font-black text-teal-400 hover:text-teal-300 group-hover:gap-2.5 transition-all">
              <span>Open Batch Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section (RankNex Themed) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-black text-white">Frequently Asked Questions</h3>
          <p className="text-slate-400 text-sm mt-2">Everything you need to know about Watermark AI Remover</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does the AI Watermark Remover remove watermarks without blurring the image?',
              a: 'Instead of traditional simple blur or clone stamps, our AI Watermark Remover uses deep convolutional inpainting diffusion neural networks to reconstruct the underlying background texture, continuity, and lighting based on surrounding pixel context.'
            },
            {
              q: 'Is Watermark AI Remover really 100% free with no limits?',
              a: 'Yes! All image, photo, and video watermark removal features are 100% free and unlimited. No Google signup or subscription required.'
            },
            {
              q: 'Can I remove watermarks from images in bulk or batches?',
              a: 'Yes! Use our Bulk Batch Processing studio to upload dozens of watermarked images simultaneously, process them in parallel, and download them together in a high-speed ZIP package.'
            },
            {
              q: 'How does the Video Watermark Remover work?',
              a: 'You can upload any MP4, MOV, or WEBM clip, place the watermark bounding box over the logo or timestamp, and our temporal inpainting engine will clean the frames while preserving 100% of the original audio.'
            },
            {
              q: 'How long are uploaded files retained on your servers?',
              a: "They are never stored — processing runs entirely inside your own browser using WebAssembly and client GPU kernels, so photos and videos are never uploaded to an external server in the first place."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#0D1527] border border-white/10 rounded-2xl hover:border-teal-500/40 hover:bg-[#111A2E] transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                aria-expanded={activeFaq === idx}
                className="w-full flex items-center justify-between font-bold text-white text-base text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span>{item.q}</span>
                </div>
                <ChevronRight className={`w-5 h-5 text-teal-400 transition-transform duration-200 shrink-0 ${activeFaq === idx ? 'rotate-90' : ''}`} />
              </button>
              {activeFaq === idx && (
                <p className="text-sm text-slate-300 mt-4 leading-relaxed border-t border-white/10 pt-4 animate-in fade-in">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner (RankNex Card with Teal Glow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-[#0D1527] via-[#070B14] to-[#0D1527] border border-teal-500/30 text-white text-center shadow-2xl overflow-hidden">
          {/* Ambient teal gradient sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Clean Your Photos & Videos?
            </h3>
            <p className="text-slate-300 text-base">
              Experience the fastest AI watermark and image watermark remover online. 100% free with no limits or watermarks added to output.
            </p>
            <Link to="/editor/image">
              <button 
                className="px-8 py-4 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-teal-500/20 hover:shadow-teal-500/35 transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Start Removing Watermarks Now</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
