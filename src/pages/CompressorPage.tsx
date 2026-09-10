import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';
import { SEO } from '../components/common/SEO';
import { 
  compressImageToTargetKB, 
  formatBytes, 
  type CompressionResult 
} from '../services/compressionEngine';
import { 
  Sparkles, 
  Download, 
  Trash2, 
  Sliders, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  ChevronDown
} from 'lucide-react';

interface CompressItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  previewUrl: string;
  status: 'compressing' | 'completed' | 'error';
  result?: CompressionResult;
}

export const CompressorPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [targetKB, setTargetKB] = useState<number>(50);
  const [isCustomKB, setIsCustomKB] = useState(false);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  // Queue
  const [items, setItems] = useState<CompressItem[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Open FAQ accordions
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Pre-set KB options
  const kbPresets = [20, 50, 100, 200, 300];

  // Process files
  const handleProcessFiles = async (files: File[]) => {
    const newItems: CompressItem[] = files.map((file, idx) => ({
      id: `comp-${Date.now()}-${idx}`,
      file,
      name: file.name,
      originalSize: file.size,
      previewUrl: URL.createObjectURL(file),
      status: 'compressing',
    }));

    setItems(prev => [...newItems, ...prev]);

    for (const item of newItems) {
      try {
        const res = await compressImageToTargetKB(item.file, targetKB, {
          format: outputFormat,
          scalePercent: scalePercent < 100 ? scalePercent : undefined,
        });

        setItems(prev => prev.map(it => it.id === item.id ? {
          ...it,
          status: 'completed',
          result: res,
        } : it));
      } catch (err) {
        console.error('Compression error:', err);
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'error' } : it));
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Re-compress when target KB changes
  const handleRecompressAll = async (newKB: number) => {
    setTargetKB(newKB);
    if (items.length === 0) return;

    setItems(prev => prev.map(it => ({ ...it, status: 'compressing' })));

    for (const item of items) {
      try {
        const res = await compressImageToTargetKB(item.file, newKB, {
          format: outputFormat,
          scalePercent: scalePercent < 100 ? scalePercent : undefined,
        });
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'completed', result: res } : it));
      } catch {
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'error' } : it));
      }
    }
  };

  // Individual Download + Redirect
  const handleDownloadItem = (item: CompressItem) => {
    if (!item.result) return;
    const link = document.createElement('a');
    link.href = item.result.dataUrl;
    link.download = `compressed_${item.name.replace(/\.[^/.]+$/, "")}_${targetKB}kb.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.open('https://www.ranknexai.com/team', '_blank');
    }, 600);
  };

  // Batch Download as ZIP
  const handleDownloadAllZip = async () => {
    const completedItems = items.filter(i => i.status === 'completed' && i.result);
    if (completedItems.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder("compressed_images");

      for (let i = 0; i < completedItems.length; i++) {
        const item = completedItems[i];
        if (item.result) {
          const filename = `compressed_${item.name.replace(/\.[^/.]+$/, "")}_${targetKB}kb.jpg`;
          folder?.file(filename, item.result.blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `compressed_${completedItems.length}_images_${targetKB}kb_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.open('https://www.ranknexai.com/team', '_blank');
      }, 700);
    } catch (err) {
      console.error('ZIP error:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const clearAll = () => {
    if (confirm('Clear all images from the compressor queue?')) {
      setItems([]);
    }
  };

  const faqs = [
    {
      q: 'Is this an image quality decreaser or does it keep quality intact?',
      a: 'Smart compression uses advanced mathematical quantization to reduce file size while preserving high visual clarity. Our engine selectively compresses invisible color data so the image looks sharp to the human eye while meeting strict KB limits.'
    },
    {
      q: 'Can I compress an image without losing quality?',
      a: 'Lossless compression reduces file size by 15%–30% without changing a single pixel. However, hitting very small target sizes like 20KB or 50KB from a 5MB photo requires intelligent lossy quantization and dimension scaling.'
    },
    {
      q: 'How to compress an image to exact 50KB for online forms?',
      a: 'Simply upload your photo, select the 50KB target preset button, and our binary search engine will automatically compress your image to under 50KB in milliseconds, ready for job portals and admission forms.'
    },
    {
      q: 'Does this tool support GIF compression?',
      a: 'Yes! For animated GIFs, you can visit our dedicated GIF Compressor at /compress-gif to optimize frame rates, palette depth, and file size.'
    },
    {
      q: 'Are my uploaded photos safe and private?',
      a: '100% yes. All image compression runs directly inside your web browser using HTML5 Canvas & WebAssembly. Your photos are never uploaded to public servers or stored.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e11] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEO
        title="Smart Image Compressor — Reduce File Size Free"
        description="Compress JPG, PNG, and WebP images to exact target KB or percentage without visible loss. 100% private client-side processing."
        canonicalPath="/compressor"
        faqs={faqs}
      />
      
      {/* Hidden Multi-File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,.heic,.png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Main Tool Container */}
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header / Value Proposition */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Smart Compression Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Free Online Image Compressor
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Compress JPG, PNG & WebP images to exact KB targets. Reduce photo size instantly for forms, websites, and WhatsApp with maximum visual clarity.
          </p>
        </div>

        {/* Compression Settings Controls Bar */}
        <div className="p-6 bg-[#18181c] border border-white/10 rounded-3xl shadow-xl space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                Select Target File Size (KB):
              </span>
              <p className="text-[11px] text-slate-500">Pick an exact KB target for job forms, passport photos or email</p>
            </div>

            {/* Target KB Presets */}
            <div className="flex flex-wrap items-center gap-2">
              {kbPresets.map((kb) => (
                <button
                  key={kb}
                  onClick={() => { setIsCustomKB(false); handleRecompressAll(kb); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    targetKB === kb && !isCustomKB
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                      : 'bg-[#23232a] text-slate-300 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  {kb} KB
                </button>
              ))}

              <button
                onClick={() => setIsCustomKB(true)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isCustomKB
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md'
                    : 'bg-[#23232a] text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                Custom KB
              </button>
            </div>
          </div>

          {/* Custom KB Input Slider */}
          {isCustomKB && (
            <div className="p-4 bg-[#23232a] rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-200">Custom Target:</span>
                <input
                  type="number"
                  min="5"
                  max="2000"
                  value={targetKB}
                  onChange={(e) => handleRecompressAll(parseInt(e.target.value) || 50)}
                  className="w-24 px-3 py-1.5 bg-[#18181c] border border-amber-500/50 rounded-xl text-xs font-black text-amber-400 focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-400">KB</span>
              </div>

              <input
                type="range"
                min="10"
                max="500"
                value={targetKB}
                onChange={(e) => handleRecompressAll(parseInt(e.target.value))}
                className="w-full sm:w-64 accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          {/* Secondary Resolution & Format Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1.5">Output Format:</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#23232a] border border-white/10 rounded-xl text-xs font-bold text-slate-200 cursor-pointer"
              >
                <option value="image/jpeg">JPG / JPEG (Best for Photos & Forms)</option>
                <option value="image/webp">WebP (Modern Next-Gen Web)</option>
                <option value="image/png">PNG (Lossless Graphics)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1.5">Scale Resolution:</label>
              <select
                value={scalePercent}
                onChange={(e) => setScalePercent(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-[#23232a] border border-white/10 rounded-xl text-xs font-bold text-slate-200 cursor-pointer"
              >
                <option value="100">100% Original Dimensions</option>
                <option value="75">75% Medium Downscale</option>
                <option value="50">50% Half Dimensions (Faster Upload)</option>
                <option value="25">25% Small Thumbnail</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <Link
                to="/pakistan-job-form-photo-size"
                className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>🇵🇰 Pakistan Form Photo Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Upload Box Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          className={`p-10 sm:p-14 bg-[#18181c] border-2 rounded-3xl text-center space-y-5 shadow-2xl transition-all relative overflow-hidden ${
            isDraggingOver ? 'border-amber-500 bg-amber-500/5 ring-4 ring-amber-500/20' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="space-y-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-9 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2.5 mx-auto active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Upload Images to Compress</span>
            </button>

            <p className="text-xs text-slate-400 font-medium">
              or drop images here, paste (Ctrl + V) &bull; Select 5+ images at once
            </p>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Supports JPG &bull; PNG &bull; WebP &bull; HEIC up to 5000 x 5000 px
          </div>
        </div>

        {/* Batch Queue & Results List */}
        {items.length > 0 && (
          <div className="space-y-4 animate-in fade-in">
            {/* Global Summary Bar */}
            <div className="p-4 bg-[#18181c] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-slate-200">
                  {items.length} {items.length === 1 ? 'image' : 'images'} in queue
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Target: {targetKB} KB
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadAllZip}
                  disabled={isZipping}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>{isZipping ? 'Packaging ZIP...' : `Download All (${items.length} ZIP)`}</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-[#23232a] hover:bg-[#2c2c36] text-slate-200 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>

                <button
                  onClick={clearAll}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  title="Clear Queue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Individual Item Cards */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-[#18181c] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                      <img src={item.result?.dataUrl || item.previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <h4 className="font-bold text-sm text-slate-200 truncate max-w-xs sm:max-w-md">{item.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-400">Original: <strong className="text-slate-300">{formatBytes(item.originalSize)}</strong></span>
                        <span className="text-slate-600">&rarr;</span>
                        {item.status === 'completed' && item.result ? (
                          <>
                            <span className="text-emerald-400 font-bold">
                              Compressed: {formatBytes(item.result.compressedSize)}
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                              -{item.result.savedPercent}%
                            </span>
                            <span className="text-slate-500 text-[11px]">
                              ({item.result.dimensions.width}x{item.result.dimensions.height}px)
                            </span>
                          </>
                        ) : (
                          <span className="text-amber-400 animate-pulse font-semibold">Compressing to {targetKB}KB...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadItem(item)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-950" />
                        <span>Download</span>
                      </button>
                    )}

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Use-Case Presets Hub Grid */}
        <div className="pt-8 space-y-4">
          <h3 className="text-lg font-black text-white">Popular Target Size Presets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/compress-image-to-20kb"
              className="p-4 rounded-2xl bg-[#18181c] border border-white/10 hover:border-amber-500/50 transition-all space-y-1 group"
            >
              <div className="font-extrabold text-sm text-white group-hover:text-amber-400">Compress to 20KB</div>
              <p className="text-[11px] text-slate-400">Strict signature & document portals</p>
            </Link>

            <Link
              to="/compress-image-to-50kb"
              className="p-4 rounded-2xl bg-[#18181c] border border-white/10 hover:border-amber-500/50 transition-all space-y-1 group"
            >
              <div className="font-extrabold text-sm text-white group-hover:text-amber-400">Compress to 50KB</div>
              <p className="text-[11px] text-slate-400">Standard job forms & admissions</p>
            </Link>

            <Link
              to="/compress-image-to-100kb"
              className="p-4 rounded-2xl bg-[#18181c] border border-white/10 hover:border-amber-500/50 transition-all space-y-1 group"
            >
              <div className="font-extrabold text-sm text-white group-hover:text-amber-400">Compress to 100KB</div>
              <p className="text-[11px] text-slate-400">High quality web profile photos</p>
            </Link>

            <Link
              to="/reduce-image-resolution"
              className="p-4 rounded-2xl bg-[#18181c] border border-white/10 hover:border-amber-500/50 transition-all space-y-1 group"
            >
              <div className="font-extrabold text-sm text-white group-hover:text-amber-400">Reduce Resolution</div>
              <p className="text-[11px] text-slate-400">Scale width, height & dimensions</p>
            </Link>
          </div>
        </div>

        {/* Step-by-Step How It Works Section */}
        <div className="p-8 bg-[#18181c] border border-white/10 rounded-3xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            How to Compress Images Online in 3 Simple Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-5 rounded-2xl bg-[#23232a] space-y-2 border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                1
              </div>
              <h4 className="font-extrabold text-white">Upload Your Photos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag and drop single or multiple JPG, PNG, or WebP images into the upload box or select files from your phone or PC.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#23232a] space-y-2 border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                2
              </div>
              <h4 className="font-extrabold text-white">Pick Target KB or Quality</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select 20KB, 50KB, 100KB, 200KB or set a custom target. Our smart engine optimizes resolution and quality automatically.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#23232a] space-y-2 border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                3
              </div>
              <h4 className="font-extrabold text-white">Download Compressed Image</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Preview your reduction savings (e.g. -90%) and download your optimized photo individually or as a complete batch ZIP.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section (AEO/GEO Structured) */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-black text-white text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#18181c] border border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-slate-200 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-amber-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in">
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
