import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { resizeImageResolution, formatBytes, type CompressionResult } from '../services/compressionEngine';
import { SEO } from '../components/common/SEO';
import { 
  Maximize2, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  HelpCircle, 
  ChevronDown, 
  Lock, 
  Unlock,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const ResolutionReducerPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [origDims, setOrigDims] = useState<{ width: number; height: number }>({ width: 1920, height: 1080 });

  // Resizing options
  const [resizeMode, setResizeMode] = useState<'percent' | 'dimensions'>('percent');
  const [scalePercent, setScalePercent] = useState<number>(50);
  const [targetWidth, setTargetWidth] = useState<number>(960);
  const [targetHeight, setTargetHeight] = useState<number>(540);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(85);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);

    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setOrigDims({ width: w, height: h });
      setTargetWidth(Math.round(w * 0.5));
      setTargetHeight(Math.round(h * 0.5));
      executeResize(file, { width: Math.round(w * 0.5), height: Math.round(h * 0.5) });
    };
    img.src = url;
  };

  const executeResize = async (file: File, dims?: { width?: number; height?: number }) => {
    setIsProcessing(true);
    try {
      const res = await resizeImageResolution(file, {
        scalePercent: resizeMode === 'percent' ? scalePercent : undefined,
        width: resizeMode === 'dimensions' ? (dims?.width || targetWidth) : undefined,
        height: resizeMode === 'dimensions' ? (dims?.height || targetHeight) : undefined,
        maintainAspectRatio: lockAspect,
        quality: quality / 100,
        format: 'image/jpeg'
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockAspect && origDims.width > 0) {
      const ratio = origDims.height / origDims.width;
      setTargetHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockAspect && origDims.height > 0) {
      const ratio = origDims.width / origDims.height;
      setTargetWidth(Math.round(h * ratio));
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.dataUrl;
    link.download = `resized_${result.dimensions.width}x${result.dimensions.height}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.open('https://www.ranknexai.com/team', '_blank');
    }, 600);
  };

  const faqs = [
    {
      q: "What's the difference between reducing resolution and compressing size?",
      a: "Resolution refers to total pixel count (e.g. 4000x3000 to 1920x1080), while compression optimizes how the pixel data is encoded into KB storage. You can combine both for extreme file size reductions."
    },
    {
      q: 'Will my image look pixelated after reducing resolution?',
      a: 'If you reduce resolution to match your target screen (e.g. 1920x1080 for web displays), it will look sharp and pristine. Excessive reduction below 300px may cause pixelation if enlarged.'
    },
    {
      q: 'Does it keep the aspect ratio intact?',
      a: 'Yes, aspect ratio locking is enabled by default so your photos never stretch, squash, or distort.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e11] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEO
        title="Reduce Image Resolution Online Free — Resize Photos"
        description="Reduce the pixel resolution of your photos while keeping quality sharp and aspect ratio locked. Free, private, and instant in your browser."
        canonicalPath="/reduce-image-resolution"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Resolution & Dimension Scaler</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Reduce Image Resolution Online
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Scale down photo dimensions by percentage or exact pixels without cropping. Keep aspect ratio locked and visual quality sharp.
          </p>
        </div>

        {/* Interactive Resizer Box */}
        <div className="p-8 sm:p-10 bg-[#18181c] border border-white/10 rounded-3xl shadow-2xl space-y-6">
          
          {selectedFile && result ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Controls */}
              <div className="p-6 bg-[#23232a] rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-[#18181c] p-1 rounded-xl border border-white/10 text-xs font-bold">
                    <button
                      onClick={() => setResizeMode('percent')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${resizeMode === 'percent' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400'}`}
                    >
                      By Percentage (%)
                    </button>
                    <button
                      onClick={() => setResizeMode('dimensions')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${resizeMode === 'dimensions' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400'}`}
                    >
                      Exact Pixels (W x H)
                    </button>
                  </div>

                  <span className="text-xs text-slate-400">
                    Original: <strong className="text-white">{origDims.width} x {origDims.height} px</strong>
                  </span>
                </div>

                {resizeMode === 'percent' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Scale Factor:</span>
                      <span className="text-cyan-400 font-mono">{scalePercent}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[75, 50, 25, 10].map(pct => (
                        <button
                          key={pct}
                          onClick={() => {
                            setScalePercent(pct);
                            if (selectedFile) executeResize(selectedFile);
                          }}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${scalePercent === pct ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black' : 'bg-[#18181c] text-slate-300 border-white/5'}`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Width (px)</label>
                      <input
                        type="number"
                        value={targetWidth}
                        onChange={(e) => handleWidthChange(parseInt(e.target.value) || 100)}
                        className="w-28 px-3 py-1.5 bg-[#18181c] border border-white/10 rounded-xl text-xs text-cyan-400 font-bold"
                      />
                    </div>

                    <button
                      onClick={() => setLockAspect(!lockAspect)}
                      className={`p-2 rounded-xl mt-5 transition-colors border ${lockAspect ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-[#18181c] text-slate-500 border-white/10'}`}
                      title="Toggle Aspect Ratio Lock"
                      aria-label={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                    >
                      {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Height (px)</label>
                      <input
                        type="number"
                        value={targetHeight}
                        onChange={(e) => handleHeightChange(parseInt(e.target.value) || 100)}
                        className="w-28 px-3 py-1.5 bg-[#18181c] border border-white/10 rounded-xl text-xs text-cyan-400 font-bold"
                      />
                    </div>

                    <button
                      onClick={() => selectedFile && executeResize(selectedFile)}
                      className="px-4 py-2 mt-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer"
                    >
                      Apply Dimensions
                    </button>
                  </div>
                )}
              </div>

              {/* Preview & Download */}
              <div className="p-6 bg-[#23232a] rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                    <img src={result.dataUrl} alt="Resized" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-white">Resized to {result.dimensions.width} x {result.dimensions.height} px</span>
                    <div className="text-xs text-slate-400">
                      File Size: {formatBytes(result.originalSize)} &rarr; <strong className="text-emerald-400">{formatBytes(result.compressedSize)} (-{result.savedPercent}%)</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Download Resized Image</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-3 bg-[#18181c] text-slate-300 border border-white/10 text-xs font-bold rounded-xl"
                  >
                    Resize Another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-9 py-4 bg-gradient-to-r from-cyan-400 via-teal-500 to-cyan-600 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2.5 mx-auto active:scale-[0.98] cursor-pointer"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Select Image to Reduce Resolution</span>
              </button>
              <p className="text-xs text-slate-400 font-medium">
                Supports JPG, PNG, WebP up to 5000 x 5000 px &bull; Aspect ratio locked
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
                  <ChevronDown className={`w-4 h-4 text-slate-400 ${openFaq === i ? 'rotate-180 text-cyan-400' : ''}`} />
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
