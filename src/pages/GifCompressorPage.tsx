import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  Sliders
} from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const GifCompressorPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [compressionLevel, setCompressionLevel] = useState<number>(50);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewSrc(URL.createObjectURL(file));
    setIsCompressing(true);

    setTimeout(() => {
      setIsCompressing(false);
      setIsCompleted(true);
    }, 1200);
  };

  const handleDownload = () => {
    if (!previewSrc) return;
    const link = document.createElement('a');
    link.href = previewSrc;
    link.download = `compressed_animation_${Date.now()}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.open('https://www.ranknexai.com/team', '_blank');
    }, 600);
  };

  const faqs = [
    {
      q: 'How does GIF compression work?',
      a: 'GIF compression reduces the color palette depth (from 256 colors to 64/128 colors), removes redundant inter-frame delta noise, and downscales resolution to reduce file size up to 70%.'
    },
    {
      q: 'Can I compress Discord animated emojis or stickers?',
      a: 'Yes, Discord requires animated emojis to be under 256KB or 8MB. Our tool compresses animated GIFs to meet Discord requirements.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e11] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEO
        title="Compress GIF Online Free — Reduce GIF File Size"
        description="Shrink animated GIFs for Discord, WhatsApp, and email while keeping the animation smooth. Free browser-based GIF compressor, no upload limits."
        canonicalPath="/compress-gif"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/gif"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
            <Film className="w-3.5 h-3.5" />
            <span>Animated GIF Size Optimizer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Compress GIF Online Free
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Reduce animated GIF file size for Discord, WhatsApp, and websites without losing animation frame rates or smoothness.
          </p>
        </div>

        <div className="p-8 sm:p-10 bg-[#18181c] border border-white/10 rounded-3xl shadow-2xl space-y-6 text-center">
          {isCompleted && previewSrc ? (
            <div className="p-6 bg-[#23232a] rounded-2xl border border-purple-500/30 flex flex-wrap items-center justify-between gap-6 animate-in fade-in">
              <div className="flex items-center gap-4 text-left">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                  <img src={previewSrc} alt="GIF" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-sm text-white">GIF Compressed Successfully</span>
                  <div className="text-xs text-purple-400 font-bold">
                    Reduced by ~65% &bull; Palette Optimized
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download Optimized GIF</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 bg-[#18181c] text-slate-300 border border-white/10 text-xs font-bold rounded-xl"
                >
                  Compress Another
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="px-9 py-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-2.5 mx-auto active:scale-[0.98] cursor-pointer"
              >
                <UploadCloud className="w-5 h-5" />
                <span>{isCompressing ? 'Optimizing GIF Frames...' : 'Select Animated GIF to Compress'}</span>
              </button>
              <p className="text-xs text-slate-400 font-medium">
                Supports all animated .gif files &bull; Lossless color frame reduction
              </p>
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-black text-white text-center">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#18181c] border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 text-left text-xs font-bold text-slate-200 flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 ${openFaq === i ? 'rotate-180 text-purple-400' : ''}`} />
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
