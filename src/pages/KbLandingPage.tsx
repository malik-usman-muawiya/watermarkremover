import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { compressImageToTargetKB, formatBytes, type CompressionResult } from '../services/compressionEngine';
import { SEO } from '../components/common/SEO';
import { 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  ChevronDown, 
  FileCheck,
  AlertTriangle
} from 'lucide-react';

interface KbConfig {
  targetKB: number;
  title: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  useCases: string[];
  recommendedDimensions: string;
  whyLimit: string;
  troubleshooting: {
    problem: string;
    solution: string;
  }[];
  faqs: { q: string; a: string }[];
}

const KB_MAP: Record<number, KbConfig> = {
  20: {
    targetKB: 20,
    title: 'Compress Image to 20KB',
    metaTitle: 'Compress Image to 20KB Online Free – Exact Photo Size Reducer',
    metaDesc: 'Reduce your photo and signature to 20KB for strict upload portals and document verification forms. 100% free, no signup.',
    h1: 'Compress Image to 20KB Online Free',
    intro: 'Strict government portals, signature forms, and passport applications often impose a maximum limit of 20KB. Our smart quantization engine reduces your photo to exact 20KB while preserving legible signatures and faces.',
    useCases: [
      'Digital signature uploads for online job portals',
      'Government exam registrations with strict 20KB cap',
      'Thumbnail icons and low-bandwidth mobile applications'
    ],
    recommendedDimensions: '150 x 150 px or 200 x 200 px (Passport signature)',
    whyLimit: 'Legacy government servers with large applicant volumes require sub-20KB images to prevent server bandwidth overload.',
    troubleshooting: [
      {
        problem: 'Image is pixelated or blurry at 20KB',
        solution: 'Crop unwanted background margins so the face or signature fills 80% of the frame before compressing.'
      },
      {
        problem: 'File size is still slightly above 20KB',
        solution: 'Switch the output format to JPG and enable 50% dimension scaling.'
      }
    ],
    faqs: [
      {
        q: 'How can I compress an image to 20KB without blur?',
        a: 'Our tool crops redundant border metadata and applies adaptive lossy JPEG quantization so details remain legible even at 20KB.'
      },
      {
        q: 'Can I compress my signature to 20KB?',
        a: 'Yes, upload a photo or scan of your signature on white paper, select 20KB, and download the compressed JPG immediately.'
      }
    ]
  },
  50: {
    targetKB: 50,
    title: 'Compress Image to 50KB',
    metaTitle: 'Compress Image to 50KB Online Free – Exact Size Photo Compressor',
    metaDesc: 'Reduce your photo to 50KB for forms, applications, and admissions. Free, fast, no signup required.',
    h1: 'Compress Image to 50KB — Free Online Tool',
    intro: '50KB is the most common upload limit used worldwide for job applications, university admissions, and online visa forms. Our tool compresses large 5MB+ photos to under 50KB in milliseconds.',
    useCases: [
      'NTS, CSS, PMS, and public service commission portals',
      'University admission forms (NUST, FAST, LUMS, PU)',
      'Job application portal resumes and candidate photos'
    ],
    recommendedDimensions: '350 x 450 px (Standard 35x45mm passport ratio)',
    whyLimit: 'A 50KB limit strikes the optimal balance between high facial recognition clarity and instant page loading speeds for admissions servers.',
    troubleshooting: [
      {
        problem: 'Portal says "File size exceeds 50KB"',
        solution: 'Our tool ensures your file is compressed to ~48KB so it never triggers the 50KB maximum error.'
      },
      {
        problem: 'Photo colors look washed out',
        solution: 'Make sure your image uses sRGB color space and choose JPG output.'
      }
    ],
    faqs: [
      {
        q: 'Why do job forms require exactly 50KB photos?',
        a: '50KB allows thousands of applicants to submit photos without crashing backend verification databases while keeping facial features distinct.'
      },
      {
        q: 'Can I compress multiple photos to 50KB at once?',
        a: 'Yes! Select 5 or more photos and our tool will compress all of them to under 50KB in one batch.'
      }
    ]
  },
  100: {
    targetKB: 100,
    title: 'Compress Image to 100KB',
    metaTitle: 'Compress Image to 100KB Online Free – High Quality Photo Reducer',
    metaDesc: 'Reduce image file size to 100KB without quality loss. Perfect for website banners, profile pictures, and admissions.',
    h1: 'Compress Image to 100KB — Fast & High Quality',
    intro: 'When you need crystal-clear sharpness for professional resumes, web portfolio headshots, or WhatsApp profile pictures, a 100KB target delivers outstanding visual quality with lightweight storage.',
    useCases: [
      'Professional LinkedIn & portfolio headshots',
      'E-commerce product catalog thumbnail images',
      'Email attachments and newsletter imagery'
    ],
    recommendedDimensions: '800 x 800 px or 600 x 800 px',
    whyLimit: '100KB ensures sub-second page load times for modern websites and Google Core Web Vitals compliance.',
    troubleshooting: [
      {
        problem: 'Image is larger than 100KB',
        solution: 'Select the 100KB preset button and click Compress to automatically optimize.'
      }
    ],
    faqs: [
      {
        q: 'Is 100KB good for web images?',
        a: 'Yes, 100KB is the industry-standard target for responsive website images, providing crisp display on Retina and 4K screens.'
      }
    ]
  },
  200: {
    targetKB: 200,
    title: 'Compress Image to 200KB',
    metaTitle: 'Compress Image to 200KB Online – HD Photo Optimizer',
    metaDesc: 'Optimize HD photos to 200KB. Keep maximum colors and details for print, web, and social media.',
    h1: 'Compress Image to 200KB Online Free',
    intro: 'Compress high-resolution camera photos down to 200KB while maintaining full HD colors, skin tones, and rich landscape textures.',
    useCases: [
      'Blog post featured images and editorial photography',
      'Real estate listing galleries',
      'Social media banners and advertising creatives'
    ],
    recommendedDimensions: '1200 x 800 px or 1920 x 1080 px',
    whyLimit: '200KB allows high-resolution photos to load smoothly across mobile 4G networks.',
    troubleshooting: [],
    faqs: [
      {
        q: 'Will 200KB reduce my photo resolution?',
        a: 'No, full 1080p and 1440p resolutions can easily fit within 200KB using smart WebP or JPG compression.'
      }
    ]
  },
  300: {
    targetKB: 300,
    title: 'Compress Image to 300KB',
    metaTitle: 'Compress Image to 300KB – Quality-First Image Compressor',
    metaDesc: 'Compress photos to 300KB with zero noticeable quality difference. Free online photo size reducer.',
    h1: 'Compress Image to 300KB — Quality-First Compression',
    intro: 'For photographers and designers who refuse to compromise on visual fidelity, the 300KB target provides virtually lossless output.',
    useCases: [
      'Full-width website hero headers and banners',
      'Graphic design assets and digital art portfolios',
      'High-res photo sharing via email'
    ],
    recommendedDimensions: '1920 x 1080 px or 2560 x 1440 px',
    whyLimit: '300KB is recommended for top hero images to satisfy Google PageSpeed criteria without visible compression artifacts.',
    troubleshooting: [],
    faqs: [
      {
        q: 'How much quality is lost at 300KB?',
        a: 'Virtually zero perceptible quality loss for standard web display sizes.'
      }
    ]
  }
};

export const KbLandingPage: React.FC = () => {
  const { kb } = useParams<{ kb?: string }>();
  const targetNumber = parseInt(kb || '50') || 50;
  const config = KB_MAP[targetNumber] || KB_MAP[50];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleFile = async (file: File) => {
    setIsCompressing(true);
    try {
      const res = await compressImageToTargetKB(file, config.targetKB, { format: 'image/jpeg' });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.dataUrl;
    link.download = `compressed_${config.targetKB}kb_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.open('https://www.ranknexai.com/team', '_blank');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEO
        title={config.metaTitle}
        description={config.metaDesc}
        canonicalPath={`/compress-image-to-${config.targetKB}kb`}
        faqs={config.faqs}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Target Size: {config.targetKB} KB Exact</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {config.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            {config.intro}
          </p>
        </div>

        {/* Interactive Compressor Box (Placed directly near top) */}
        <div className="p-8 sm:p-10 bg-[#18181c] border border-white/10 rounded-3xl shadow-2xl space-y-6 text-center">
          
          {result ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 bg-[#23232a] rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                    <img src={result.dataUrl} alt="Compressed" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left space-y-1">
                    <span className="font-bold text-sm text-white">Compression Complete</span>
                    <div className="text-xs text-slate-400">
                      Original: <strong className="text-slate-200">{formatBytes(result.originalSize)}</strong> &rarr; Target: <strong className="text-emerald-400">{formatBytes(result.compressedSize)}</strong>
                    </div>
                    <div className="text-xs text-emerald-400 font-bold">
                      Saved {result.savedPercent}% &bull; {result.dimensions.width}x{result.dimensions.height}px
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Download {config.targetKB}KB Image</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-3 bg-[#18181c] hover:bg-[#282830] text-slate-300 border border-white/10 text-xs font-bold rounded-xl transition-all"
                  >
                    Compress Another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="px-9 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2.5 mx-auto active:scale-[0.98] cursor-pointer"
              >
                <UploadCloud className="w-5 h-5" />
                <span>{isCompressing ? 'Compressing to ' + config.targetKB + 'KB...' : 'Select Photo to Compress to ' + config.targetKB + 'KB'}</span>
              </button>
              <p className="text-xs text-slate-400 font-medium">
                Supports JPG, PNG, WebP up to 5000x5000px &bull; Free instant reduction
              </p>
            </div>
          )}

        </div>

        {/* Why 50KB Limit & Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-6 bg-[#18181c] border border-white/10 rounded-2xl space-y-3">
            <h3 className="font-extrabold text-white text-base">Why is the {config.targetKB}KB Limit Used?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {config.whyLimit}
            </p>
            <div className="pt-2 border-t border-white/5">
              <span className="text-xs text-slate-500 font-bold block mb-1">Recommended Dimensions:</span>
              <code className="text-xs text-amber-400 font-mono">{config.recommendedDimensions}</code>
            </div>
          </div>

          <div className="p-6 bg-[#18181c] border border-white/10 rounded-2xl space-y-3">
            <h3 className="font-extrabold text-white text-base">Top Use Cases for {config.targetKB}KB:</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              {config.useCases.map((uc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Troubleshooting (if present) */}
        {config.troubleshooting.length > 0 && (
          <div className="p-6 bg-[#18181c] border border-white/10 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Troubleshooting {config.targetKB}KB Compression
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {config.troubleshooting.map((tb, i) => (
                <div key={i} className="p-4 bg-[#23232a] rounded-xl border border-white/5 space-y-1.5">
                  <strong className="text-slate-200 block">{tb.problem}</strong>
                  <p className="text-slate-400">{tb.solution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Targets Matrix */}
        <div className="space-y-3 pt-4">
          <h3 className="font-extrabold text-white text-base">Related Size Targets</h3>
          <div className="flex flex-wrap gap-2">
            {[20, 50, 100, 200, 300].map((k) => (
              <Link
                key={k}
                to={`/compress-image-to-${k}kb`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  k === config.targetKB
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-[#18181c] hover:bg-[#23232a] text-slate-300 border border-white/10'
                }`}
              >
                Compress to {k}KB &rarr;
              </Link>
            ))}
            <Link
              to="/reduce-image-resolution"
              className="px-4 py-2 bg-[#18181c] hover:bg-[#23232a] text-slate-300 border border-white/10 rounded-xl text-xs font-bold"
            >
              Reduce Resolution &rarr;
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-black text-white text-center">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {config.faqs.map((faq, i) => (
              <div key={i} className="bg-[#18181c] border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 text-left text-xs font-bold text-slate-200 flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 ${openFaq === i ? 'rotate-180 text-amber-400' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-xs text-slate-400 border-t border-white/5 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
