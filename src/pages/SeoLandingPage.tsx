import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ComparisonSlider } from '../components/editor/ComparisonSlider';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { Button } from '../components/ui/Button';
import { Sparkles, ArrowRight, CheckCircle2, Gift } from 'lucide-react';

interface SeoConfig {
  title: string;
  badge: string;
  subtitle: string;
  sampleIdx: number;
  benefits: string[];
}

const SEO_MAP: Record<string, SeoConfig> = {
  'image-watermark-remover': {
    title: 'Free Online AI Image Watermark Remover',
    badge: 'Neural Inpainter for Images',
    subtitle: 'Erase translucent logos, camera stamps, and copyright markings in 100% full original resolution without blurring background details.',
    sampleIdx: 0,
    benefits: ['Lossless 4K export quality', 'Intelligent texture synthesis', 'Auto-delete after 24 hours']
  },
  'video-watermark-remover': {
    title: 'AI Video Watermark & Logo Remover',
    badge: 'Temporal Video Inpainting',
    subtitle: 'Remove intrusive channel overlays, watermarks, and timestamps from MP4 & MOV clips with temporal flicker stabilization.',
    sampleIdx: 1,
    benefits: ['Optical flow cross-frame coherence', '100% audio preserved', 'Fast GPU worker queues']
  },
  'remove-logo-from-image': {
    title: 'Remove Logos & Brand Stamps from Photos',
    badge: 'E-Commerce Clean Studio',
    subtitle: 'Clean up product imagery, marketplace photos, and catalog assets seamlessly with one-click brush masking.',
    sampleIdx: 2,
    benefits: ['Batch processing supported', 'Clean edge preservation', 'E-commerce ready PNG output']
  },
  'remove-text-from-image': {
    title: 'Remove Intrusive Text & Date Stamps from Pictures',
    badge: 'OCR & Text Eraser',
    subtitle: 'Restore vintage family portraits, scans, and vacation photos by erasing orange date stamps and printed text.',
    sampleIdx: 3,
    benefits: ['No trace or blur halos', 'Preserves skin and fabric textures', 'Free browser demo']
  },
  'ai-object-remover': {
    title: 'AI Object & Photobomber Remover',
    badge: 'Smart Scene Cleaner',
    subtitle: 'Erase unwanted background people, power lines, trash cans, and distractions from your landscape and travel shots.',
    sampleIdx: 1,
    benefits: ['Natural background reconstruction', 'Seamless sky and foliage blend', 'Instant split preview']
  }
};

export const SeoLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const config = (slug && SEO_MAP[slug]) || SEO_MAP['image-watermark-remover'];
  const sample = SAMPLE_IMAGES[config.sampleIdx] || SAMPLE_IMAGES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-brand-600 text-xs font-bold border border-teal-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{config.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {config.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          {config.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/editor/image">
            <button className="flex items-center gap-2 px-7 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-brand-500/20 transition-all cursor-pointer">
              <span>Try Inpainter Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link to="/pricing">
            <button className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-300 shadow-xs transition-all">
              View Features
            </button>
          </Link>
        </div>

        {/* Benefits list */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium pt-4">
          {config.benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Demo Showcase */}
      <div className="max-w-4xl mx-auto rounded-3xl p-2 bg-white border border-slate-200 shadow-xl">
        <ComparisonSlider
          originalUrl={sample.originalUrl}
          resultUrl={sample.cleanUrl}
          title={sample.title}
          onReset={() => {}}
        />
      </div>

      {/* Action CTA */}
      <div className="text-center p-12 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-xs">
        <h3 className="text-2xl font-bold text-slate-900">Clean Your Media in 3 Seconds</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No installation or technical skills required. Runs right in your browser with AI acceleration.
        </p>
        <Link to="/editor/image">
          <Button variant="primary" size="lg" className="bg-brand-500 hover:bg-brand-600 text-white font-bold">
            Open Web Studio
          </Button>
        </Link>
      </div>

    </div>
  );
};
