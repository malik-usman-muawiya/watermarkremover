import React, { useState, useRef, useEffect } from 'react';
import { SAMPLE_IMAGES, createWatermarkedPhotoUrl, type SampleItem } from '../utils/sampleImages';
import { ImageCardItem, type ProcessedImageItem } from '../components/editor/ImageCardItem';
import { CanvasEditor } from '../components/editor/CanvasEditor';
import { autoRemoveImageWatermark } from '../services/inpaintingEngine';
import { ApiService } from '../services/api';
import { Link } from 'react-router-dom';
import { EditorTabBar } from '../components/layout/EditorTabBar';
import { SEO, type FAQItem } from '../components/common/SEO';
import { validateImageFile } from '../utils/fileValidation';
import { inpaintingRateLimiter } from '../utils/rateLimiter';
import { analytics } from '../services/analytics';
import { 
  Plus, 
  Sparkles, 
  X, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Sliders, 
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  Layers,
  Video,
  Wand2,
  ArrowRight
} from 'lucide-react';

const FAQ_LIST: FAQItem[] = [
  {
    question: 'How does AI watermark removal work?',
    answer: 'Our neural inpainting engine analyzes your image to detect watermark edges, text ridges, and logo contours across multiple axes. It isolates the watermark mask while strictly preserving 100% of the surrounding unmasked background, then rebuilds the covered area from the surrounding texture, lighting, and color instead of blurring or cropping it out.'
  },
  {
    question: 'Is it free to remove a watermark with this tool?',
    answer: 'Yes. Basic watermark and object removal is free to use, with no sign-up required and no artificial daily caps or degraded download resolution.'
  },
  {
    question: 'Do you keep my uploaded photos or videos?',
    answer: 'No. Processing runs entirely inside your own browser — your files are never uploaded to a server or used to train AI models. Anything you see in your Dashboard (job history) is also stored only on your own device and can be cleared at any time.'
  },
  {
    question: 'Does removing a watermark reduce image quality?',
    answer: "No. The tool rebuilds only the marked area to match the surrounding texture and color — the rest of the image stays untouched at full original resolution."
  },
  {
    question: 'Can I remove a watermark from a video, not just a photo?',
    answer: 'Yes. The same AI model processes video frame-by-frame, tracking watermarks even as they move, and works with MP4, MOV, and WebM files.'
  },
  {
    question: 'Is it legal to remove a watermark from an image?',
    answer: "It depends on who owns the image. Removing a watermark from a photo or video you own or have the rights to is fine. Removing a copyright or ownership watermark from an image that belongs to someone else — for example, a stock photo you haven't licensed — can infringe that person's copyright. When in doubt, only use this on your own content or content you've properly licensed."
  },
  {
    question: 'What file formats are supported?',
    answer: 'PNG, JPEG/JPG, and WebP for images (up to 25 MB, up to 5000 × 5000 pixels). MP4, MOV, and WebM for video (up to 100 MB).'
  },
  {
    question: 'Can I remove more than one watermark from the same image?',
    answer: 'Yes — mark each area you want removed and the AI processes all of them in the same pass. You can also use the Batch Editor to queue and clean up to 50 photos at once, then download them as a ZIP archive.'
  },
  {
    question: 'Does this work on transparent or semi-transparent watermarks?',
    answer: "Yes. The AI detects the watermark's boundary even when it's partially see-through and rebuilds the area underneath it."
  }
];

export const ImageEditorPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-Image Processed Stack
  const [items, setItems] = useState<ProcessedImageItem[]>([]);

  // Manual Edit Modal state
  const [manualEditItem, setManualEditItem] = useState<ProcessedImageItem | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Initialize with authentic high-res Mountain PROOF sample
  useEffect(() => {
    createWatermarkedPhotoUrl(SAMPLE_IMAGES[0].originalUrl, 'PROOF').then((watermarkedUrl) => {
      setItems([
        {
          id: 'item-1',
          name: 'Mountain_Aerial_Proof.jpg',
          originalUrl: watermarkedUrl,
          cleanUrl: SAMPLE_IMAGES[0].cleanUrl,
          maskUrl: watermarkedUrl,
          status: 'completed',
          removeText: true,
          removeLogo: true,
          model: 'all',
          qualityPassed: true,
          preservedPercentage: 99.6,
          regionsCount: 4,
          maskedPixelCount: 420
        }
      ]);
    });
  }, []);

  // Process and automatically inpaint multiple uploaded files with validation
  const handleProcessFiles = async (files: File[]) => {
    setUploadErrors([]);

    // 1. Rate Limiter Check
    const rateCheck = inpaintingRateLimiter.tryAcquire();
    if (!rateCheck.allowed) {
      setUploadErrors([
        `Rate limit reached. Please wait ${rateCheck.retryAfterSeconds} seconds before uploading more images.`
      ]);
      analytics.trackError('RATE_LIMIT_EXCEEDED');
      return;
    }

    // 2. Pre-flight Validation for each file
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const validation = await validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`"${file.name}": ${validation.errorMessage}`);
        analytics.trackError(validation.errorCode);
      }
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
    }

    if (validFiles.length === 0) {
      return;
    }

    analytics.trackUpload(validFiles.length);

    const newItems: ProcessedImageItem[] = validFiles.map((file, idx) => {
      const url = URL.createObjectURL(file);
      return {
        id: `img-${Date.now()}-${idx}`,
        name: file.name,
        originalUrl: url,
        cleanUrl: url,
        status: 'processing',
        removeText: true,
        removeLogo: true,
        model: 'all'
      };
    });

    // Append to card stack immediately
    setItems(prev => [...newItems, ...prev]);

    // Asynchronously perform real Localized Inpainting on each file
    for (const item of newItems) {
      const startTime = Date.now();
      try {
        const result = await autoRemoveImageWatermark(item.originalUrl, { 
          quality: 'high',
          mode: 'all',
          removeText: true,
          removeLogo: true
        });

        const duration = Date.now() - startTime;
        analytics.trackInpaintSuccess(duration, result.regionsCount);

        setItems(prev => prev.map(it => it.id === item.id ? { 
          ...it, 
          cleanUrl: result.cleanUrl, 
          maskUrl: result.maskUrl,
          regionsCount: result.regionsCount,
          qualityPassed: result.qualityPassed,
          preservedPercentage: result.preservedPercentage,
          maskedPixelCount: result.maskedPixelCount,
          status: 'completed' 
        } : it));
      } catch {
        analytics.trackError('INPAINTING_FAILED');
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'failed' } : it));
      }

      ApiService.createJob('image', item.name, item.originalUrl, 0, '2.8 MB');
    }
  };

  // Global Clipboard Paste Listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        const files: File[] = [];
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) files.push(file);
          }
        }
        if (files.length > 0) {
          handleProcessFiles(files);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

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

  const handleUploadNext = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find(it => it.id === id);
    if (item && item.originalUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.originalUrl);
    }
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all images from the queue?')) {
      items.forEach(it => {
        if (it.originalUrl.startsWith('blob:')) URL.revokeObjectURL(it.originalUrl);
      });
      setItems([]);
    }
  };

  const handleUpdateSettings = async (id: string, updates: Partial<ProcessedImageItem>) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...updates } : it));

    const targetItem = items.find(it => it.id === id);
    if (targetItem) {
      const merged = { ...targetItem, ...updates };
      try {
        const result = await autoRemoveImageWatermark(merged.originalUrl, {
          mode: merged.model,
          removeText: merged.removeText,
          removeLogo: merged.removeLogo,
          quality: 'high'
        });
        setItems(prev => prev.map(it => it.id === id ? { 
          ...it, 
          cleanUrl: result.cleanUrl, 
          maskUrl: result.maskUrl,
          regionsCount: result.regionsCount,
          qualityPassed: result.qualityPassed,
          preservedPercentage: result.preservedPercentage,
          maskedPixelCount: result.maskedPixelCount
        } : it));
      } catch (err) {
        console.error('Re-inpaint error:', err);
      }
    }
  };

  const handleManualEdit = (item: ProcessedImageItem) => {
    setManualEditItem(item);
  };

  const handleManualEditSave = (resultUrl: string) => {
    if (manualEditItem) {
      setItems(prev => prev.map(it => it.id === manualEditItem.id ? { ...it, cleanUrl: resultUrl } : it));
      setManualEditItem(null);
    }
  };

  // Global Download All Images as ZIP package (JSZip)
  // Loaded on demand — JSZip is ~900KB and only needed when the user
  // actually clicks "Download All", so it shouldn't bloat the initial
  // page bundle.
  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    setIsZipping(true);
    analytics.trackDownload('batch', items.length);

    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const folder = zip.folder("watermark_ai_cleaned_images");

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        try {
          const response = await fetch(item.cleanUrl);
          const blob = await response.blob();
          const filename = `${item.name.replace(/\.[^/.]+$/, "")}_cleaned.png`;
          folder?.file(filename, blob);
        } catch {
          folder?.file(`cleaned_image_${i + 1}.png`, item.cleanUrl.split(',')[1] || '', { base64: true });
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `watermark_ai_batch_${items.length}_images_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    // Open synchronously (not inside setTimeout) so browsers still treat
    // this as part of the user's click and don't block the popup.
    window.open('https://www.ranknexai.com/team', '_blank');

    } catch (err) {
      console.error('ZIP Error:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const loadSample = async (sample: SampleItem) => {
    const watermarkedUrl = await createWatermarkedPhotoUrl(sample.originalUrl, sample.id === 'sample-watch' ? 'SAMPLE LOGO' : 'PROOF');
    const newItem: ProcessedImageItem = {
      id: `sample-${Date.now()}`,
      name: sample.title,
      originalUrl: watermarkedUrl,
      cleanUrl: sample.cleanUrl,
      maskUrl: watermarkedUrl,
      status: 'completed',
      removeText: true,
      removeLogo: true,
      model: 'all',
      qualityPassed: true,
      preservedPercentage: 99.5,
      regionsCount: 4,
      maskedPixelCount: 450
    };
    setItems(prev => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <SEO 
        title="AI Watermark Remover — Free Online Watermark Image Remover"
        description="Free AI watermark remover to remove watermarks, logos, stamps, and text from photos and videos online with neural inpainting. 100% free, no signup required."
        canonicalPath="/"
        keywords={[
          'watermark remover',
          'ai watermark remover',
          'watermark image remover',
          'remove watermark from image',
          'free watermark remover',
          'remove watermark online',
          'photo watermark remover',
          'watermark remover free',
          'ai watermark remover online',
          'image watermark remover',
          'remove logo from image',
          'remove text from photo',
          'picture watermark remover',
          'video watermark remover',
          'erase watermark from photo',
          'ai object remover',
          'clean watermark ai',
          'watermark eraser online',
          'best watermark remover'
        ]}
        faqs={FAQ_LIST}
      />

      {/* Hidden Multi-File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 1. Centered Tool Navigation Tabs */}
        <EditorTabBar activeTab="image" />

        {/* Hero Title & Value Proposition (AUD-008, UX-001) */}
        <div className="text-center space-y-3 pt-2">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            AI Watermark Remover — <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-cyan-300 drop-shadow-[0_2px_20px_rgba(0,201,167,0.25)]">Remove Watermarks Free</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Erase watermarks, logos, timestamps, text, and unwanted objects from any photo or video — AI rebuilds the covered area from scratch instead of blurring or cropping it out, so the result looks like it was never there.
          </p>
        </div>

        {/* Validation Error Banner (SEC-001, UX-003) */}
        {uploadErrors.length > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start justify-between gap-3 text-red-300 text-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-red-200">Upload validation notice:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-red-300/90">
                  {uploadErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={() => setUploadErrors([])}
              className="p-1 text-red-400 hover:text-white rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Large Centered Upload Panel */}
        <div
          id="editor-top"
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          className={`p-10 sm:p-14 bg-[#0D1527] border-2 rounded-3xl text-center space-y-6 shadow-2xl transition-all relative overflow-hidden ${
            isDraggingOver ? 'border-teal-500 bg-teal-500/5 ring-4 ring-teal-500/20' : 'border-white/10 hover:border-teal-500/30'
          }`}
        >
          <div className="space-y-3">
            <button
              onClick={handleUploadNext}
              className="px-9 py-4 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-teal-500/25 transition-all flex items-center justify-center gap-2.5 mx-auto active:scale-[0.98] cursor-pointer"
              aria-label="Upload an image to remove watermarks"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Upload Image</span>
            </button>

            <p className="text-xs text-slate-400 font-medium">
              or drop an image, paste (Ctrl + V) or URL (select multiple images at once)
            </p>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p>Up to 5000 x 5000 px &bull; Max 25 MB</p>
            <p className="font-mono text-[11px] text-slate-400">
              png &bull; jpeg &bull; jpg &bull; webp
            </p>
          </div>

          <p className="text-[11px] text-slate-500 max-w-md mx-auto pt-2 border-t border-white/5">
            By uploading an image, you agree to our{' '}
            <Link to="/legal?tab=terms" className="text-teal-400 underline hover:text-teal-300">Terms of Use</Link>{' '}
            and{' '}
            <Link to="/legal?tab=privacy" className="text-teal-400 underline hover:text-teal-300">Privacy Policy</Link>.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Demo samples:</span>
            {SAMPLE_IMAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => loadSample(s)}
                className="px-3 py-1 bg-[#121C33] hover:bg-teal-500/20 border border-white/10 hover:border-teal-500/40 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{s.category === 'text' ? '🌄' : '⌚'}</span>
                <span>{s.title.split(' ')[0]} {s.title.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Global Batch Bar */}
        {items.length > 0 && (
          <div className="p-4 bg-[#0D1527] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-slate-200">
                {items.length} {items.length === 1 ? 'image' : 'images'} in queue
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {items.filter(i => i.status === 'completed').length}/{items.length} completed
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isZipping ? 'Generating ZIP...' : `Download All Images (${items.length} ZIP)`}</span>
              </button>

              <button
                onClick={handleUploadNext}
                className="px-4 py-2.5 bg-[#23232a] hover:bg-[#2c2c36] text-slate-200 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More</span>
              </button>

              <button
                onClick={handleClearAll}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                title="Clear All Queue"
                aria-label="Clear all queue items"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 4. Result Cards Stack */}
        <div className="space-y-8">
          {items.map((item) => (
            <ImageCardItem
              key={item.id}
              item={item}
              onRemove={handleRemoveItem}
              onManualEdit={handleManualEdit}
              onUploadNext={handleUploadNext}
              onUpdateSettings={handleUpdateSettings}
            />
          ))}
        </div>

        {/* 5. How It Works Section (AUD-008, CONTENT-001) */}
        <div className="pt-12 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Remove watermarks and unwanted objects in three straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-[#0D1527] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-black text-base border border-teal-500/20">
                1
              </div>
              <h3 className="text-base font-bold text-white">Upload Your Photo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag and drop your image, browse from your device, or paste directly with Ctrl+V. Supports PNG, JPG, JPEG, and WebP up to 25 MB.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D1527] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black text-base border border-cyan-500/20">
                2
              </div>
              <h3 className="text-base font-bold text-white">Automated AI Inpainting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our multi-axis neural engine scans for watermarks, stamps, and logos, reconstructing the background with zero blur while preserving clean pixels.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D1527] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-black text-base border border-teal-500/20">
                3
              </div>
              <h3 className="text-base font-bold text-white">Download Clean HD Result</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect the result with the interactive before/after slider and download your watermark-free image in full original resolution.
              </p>
            </div>
          </div>
        </div>

        {/* Object Remover Callout */}
        <div className="rounded-3xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent border border-teal-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-left">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Wand2 className="w-7 h-7 text-teal-400" />
          </div>
          <div className="flex-1 space-y-1.5">
            <h2 className="text-lg sm:text-xl font-black text-white">Object Remover, Not Just Watermarks</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              This isn't only a watermark tool — the same AI engine works as a full object remover. Erase people, text, clutter, or any distracting element from a photo, and it fills in the space naturally using the surrounding background.
            </p>
          </div>
          <button
            onClick={() => document.getElementById('editor-top')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98] cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>Try the Object Remover</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6. Key Features (AUD-008, CONTENT-001) */}
        <div className="pt-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Powerful Inpainting Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Engineered for photographers, creators, and media professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-5 rounded-3xl bg-[#0D1527] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Full-Resolution HD</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Retains 100% of original photo clarity and details up to 5000x5000 pixels without downsampling.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#18181c] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">100% In-Browser Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Processing occurs locally inside your browser. No files are uploaded to third-party servers.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#18181c] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Manual Brush & Box Refinement</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fine-tune inpainting results with precision brush sizes, rectangular boxes, and eraser controls.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#18181c] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Batch Queue Processing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload and process multiple images simultaneously and package results in a single ZIP download.
              </p>
            </div>
          </div>
        </div>

        {/* 7. Supported Formats & Limits (AUD-008, CONTENT-003) */}
        <div className="pt-6 p-8 bg-[#0D1527] border border-white/10 rounded-3xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Supported Media Formats & Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 bg-[#0A0F1E] border border-white/10 rounded-2xl space-y-1">
              <div className="font-bold text-teal-400">Supported Image Types</div>
              <p className="font-mono text-slate-400">PNG, JPEG, JPG, WebP</p>
            </div>
            <div className="p-4 bg-[#0A0F1E] border border-white/10 rounded-2xl space-y-1">
              <div className="font-bold text-emerald-400">Maximum File Size</div>
              <p className="text-slate-400">Up to 25 MB per image (100 MB for Video)</p>
            </div>
            <div className="p-4 bg-[#0A0F1E] border border-white/10 rounded-2xl space-y-1">
              <div className="font-bold text-cyan-400">Maximum Dimensions</div>
              <p className="text-slate-400">Up to 5000 x 5000 pixels</p>
            </div>
          </div>
        </div>

        {/* SEO Keywords & Popular Search Topics */}
        <div className="pt-6 p-8 bg-[#0D1527] border border-teal-500/20 rounded-3xl space-y-5">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>AI Watermark Remover & Photo Cleaner Suite</span>
            </h2>
            <p className="text-xs text-slate-400">
              Trusted by creators worldwide to remove watermark from image, video, and digital media with zero quality loss.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { label: 'Watermark Remover', path: '/' },
              { label: 'AI Watermark Remover', path: '/' },
              { label: 'Watermark Image Remover', path: '/' },
              { label: 'Remove Watermark from Image', path: '/seo/image-watermark-remover' },
              { label: 'Free Watermark Remover Online', path: '/' },
              { label: 'Photo Watermark Remover', path: '/' },
              { label: 'Remove Logo from Image', path: '/seo/remove-logo-from-image' },
              { label: 'Remove Text from Photo', path: '/seo/remove-text-from-image' },
              { label: 'Erase Watermark Free', path: '/' },
              { label: 'AI Object Remover', path: '/seo/ai-object-remover' },
              { label: 'Video Watermark Remover', path: '/editor/video' },
              { label: 'Clean Watermark AI', path: '/' },
              { label: 'Smart Image Compressor (20KB - 300KB)', path: '/compress-image' },
              { label: 'Pakistan Form Photo Hub', path: '/pakistan-job-form-photo-size' }
            ].map((kw, i) => (
              <Link
                key={i}
                to={kw.path}
                className="px-3.5 py-1.5 rounded-full bg-[#0A0F1E] hover:bg-teal-500/15 border border-white/10 hover:border-teal-500/40 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>{kw.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 8. Frequently Asked Questions (AUD-008, CONTENT-005, SEO-004) */}
        <div className="pt-6 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-teal-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Everything you need to know about our AI watermark removal technology.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#0D1527] border border-white/10 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4 cursor-pointer hover:text-teal-400 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 9. Related AI Media Tools Suite (AUD-009, UX-010) */}
        <div className="pt-8 space-y-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Explore More AI Media Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-[#0D1527] border border-teal-500/30 hover:border-teal-500/60 shadow-xl transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">Video Watermark Remover</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clean watermarks, logos, and timestamps from video clips with multi-stage frame inpainting.
                </p>
              </div>
              <Link 
                to="/editor/video"
                className="w-full py-2.5 bg-teal-500/15 hover:bg-teal-500 text-teal-400 hover:text-slate-950 font-extrabold text-xs rounded-xl border border-teal-500/30 transition-all text-center block cursor-pointer"
              >
                Launch Video Remover
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D1527] border border-cyan-500/30 hover:border-cyan-500/60 shadow-xl transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">Batch Multi-Image Inpaint</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bulk queue up to 50 watermarked photos and download them in a single click ZIP archive.
                </p>
              </div>
              <Link 
                to="/editor/batch"
                className="w-full py-2.5 bg-cyan-500/15 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-extrabold text-xs rounded-xl border border-cyan-500/30 transition-all text-center block cursor-pointer"
              >
                Launch Batch Editor
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D1527] border border-purple-500/30 hover:border-purple-500/60 shadow-xl transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">AI Image Compressor</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Reduce image file sizes down to exact target KB limits (20KB, 50KB, 100KB) with lossless perceptual tuning.
                </p>
              </div>
              <Link 
                to="/compress-image"
                className="w-full py-2.5 bg-purple-500/15 hover:bg-purple-500 text-purple-400 hover:text-slate-950 font-extrabold text-xs rounded-xl border border-purple-500/30 transition-all text-center block cursor-pointer"
              >
                Launch Compressor
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Manual Edit Canvas Modal */}
      {manualEditItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1527] rounded-3xl border border-teal-500/30 shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 text-slate-200">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0D1527]">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-400" />
                <h3 className="font-extrabold text-white text-base">Manual Watermark Brush & Box Tool</h3>
              </div>
              <button
                onClick={() => setManualEditItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close manual edit dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <CanvasEditor
                imageSrc={manualEditItem.originalUrl}
                onProcessSuccess={(result) => handleManualEditSave(result)}
                onCancel={() => setManualEditItem(null)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
