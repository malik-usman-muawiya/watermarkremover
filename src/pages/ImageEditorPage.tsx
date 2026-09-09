import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { SAMPLE_IMAGES, createWatermarkedPhotoUrl, type SampleItem } from '../utils/sampleImages';
import { ImageCardItem, type ProcessedImageItem } from '../components/editor/ImageCardItem';
import { CanvasEditor } from '../components/editor/CanvasEditor';
import { autoRemoveImageWatermark } from '../services/inpaintingEngine';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  UploadCloud, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Layers, 
  Gift, 
  X, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Maximize2,
  Lock,
  Layers3,
  Cpu
} from 'lucide-react';

export const ImageEditorPage: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Tool Tab
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'pdf'>('image');

  // Multi-Image Processed Stack
  const [items, setItems] = useState<ProcessedImageItem[]>([]);

  // Manual Edit Modal state
  const [manualEditItem, setManualEditItem] = useState<ProcessedImageItem | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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
          model: 'text',
          qualityPassed: true,
          preservedPercentage: 99.6,
          regionsCount: 1,
          maskedPixelCount: 420
        }
      ]);
    });
  }, []);

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

  // Process and automatically inpaint multiple uploaded files (Accepts 5+ images simultaneously)
  const handleProcessFiles = async (files: File[]) => {
    const newItems: ProcessedImageItem[] = files.map((file, idx) => {
      const url = URL.createObjectURL(file);
      return {
        id: `img-${Date.now()}-${idx}`,
        name: file.name,
        originalUrl: url,
        cleanUrl: url,
        status: 'processing',
        removeText: true,
        removeLogo: true,
        model: 'text'
      };
    });

    // Append to card stack immediately
    setItems(prev => [...newItems, ...prev]);

    // Asynchronously perform real Localized Inpainting on each file
    for (const item of newItems) {
      try {
        const result = await autoRemoveImageWatermark(item.originalUrl, { quality: 'high' });
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
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'completed' } : it));
      }

      ApiService.createJob('image', item.name, item.originalUrl, 0, '2.8 MB');
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

  const handleUploadNext = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all images from the queue?')) {
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
  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder("cleanmark_ai_cleaned_images");

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
      link.download = `cleanmark_ai_batch_${items.length}_images_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open ranknexai.com/team
      setTimeout(() => {
        window.open('https://www.ranknexai.com/team', '_blank');
      }, 700);

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
      model: 'text',
      qualityPassed: true,
      preservedPercentage: 99.5,
      regionsCount: 1,
      maskedPixelCount: 450
    };
    setItems(prev => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Hidden Multi-File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,.heic,.png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 1. Centered Tool Navigation Tabs */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center p-1.5 bg-[#18181c] border border-white/10 rounded-full shadow-lg">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-[#282830] text-white shadow-md border border-white/15'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Image watermark remover
            </button>

            <Link
              to="/editor/video"
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <span>Video watermark remover</span>
              <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full">
                New
              </span>
            </Link>

            <button
              onClick={() => alert('PDF Watermark Remover module is coming soon!')}
              className="px-5 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              PDF watermark remover
            </button>
          </div>
        </div>

        {/* 2. Large Centered Upload Panel */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          className={`p-10 sm:p-14 bg-[#18181c] border-2 rounded-3xl text-center space-y-6 shadow-2xl transition-all relative overflow-hidden ${
            isDraggingOver ? 'border-amber-500 bg-amber-500/5 ring-4 ring-amber-500/20' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="space-y-3">
            <button
              onClick={handleUploadNext}
              className="px-9 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2.5 mx-auto active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Upload Image</span>
            </button>

            <p className="text-xs text-slate-400 font-medium">
              or drop an image, paste (Ctrl + V) or URL (select 5+ images at once)
            </p>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p>Up to 5000 x 5000 px</p>
            <p className="font-mono text-[11px] text-slate-400">
              png &bull; jpeg &bull; jpg &bull; webp &bull; heic
            </p>
          </div>

          <p className="text-[11px] text-slate-500 max-w-md mx-auto pt-2 border-t border-white/5">
            By uploading an image, you agree to our{' '}
            <Link to="/legal?tab=terms" className="text-amber-400 underline hover:text-amber-300">Terms of Use</Link>{' '}
            and{' '}
            <Link to="/legal?tab=privacy" className="text-amber-400 underline hover:text-amber-300">Privacy Policy</Link>.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Demo samples:</span>
            {SAMPLE_IMAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => loadSample(s)}
                className="px-3 py-1 bg-[#23232a] hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{s.category === 'text' ? '🌄' : '⌚'}</span>
                <span>{s.title.split(' ')[0]} {s.title.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Global Batch Bar */}
        {items.length > 0 && (
          <div className="p-4 bg-[#18181c] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-slate-200">
                {items.length} {items.length === 1 ? 'image' : 'images'} uploaded
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
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
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

        {/* 5. Bottom Showcase: "Try Our Other Products" */}
        <div className="pt-12 space-y-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Try Our Other Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-[#18181c] border border-cyan-500/30 hover:border-cyan-500/60 shadow-xl transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-white">AI Image Upscaler</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upscale media in an AI image upscaling tool that lets you enlarge & enhance your images for FREE.
                </p>
              </div>
              <button 
                onClick={() => alert('AI Image Upscaler module is active!')}
                className="w-full py-2.5 bg-cyan-500/15 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-extrabold text-xs rounded-xl border border-cyan-500/30 transition-all cursor-pointer"
              >
                Try now for free
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-[#18181c] border border-amber-500/30 hover:border-amber-500/60 shadow-xl transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-white">AI Watermark Remover</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  WatermarkRemover.io is an AI watermark remover tool that lets you remove watermarks from images for FREE.
                </p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-extrabold text-xs rounded-xl border border-amber-500/30 transition-all cursor-pointer"
              >
                Try now for free
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-[#18181c] border border-purple-500/30 hover:border-purple-500/60 shadow-xl transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Layers3 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-white">AI Image Compressor</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Quickly reduce the size of your images using intelligent compression techniques for FREE.
                </p>
              </div>
              <Link 
                to="/compress-image"
                className="w-full py-2.5 bg-purple-500/15 hover:bg-purple-500 text-purple-400 hover:text-slate-950 font-extrabold text-xs rounded-xl border border-purple-500/30 transition-all text-center block"
              >
                Try now for free
              </Link>
            </div>
          </div>
        </div>

        {/* 6. Curated Products */}
        <div className="pt-6 space-y-6 text-center">
          <h3 className="text-xl font-black text-white">Curated Products</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-[#18181c] border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🖤</span> Fynd Kaily
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  An AI-driven solution that elevates e-commerce, empowering you to gain instant insights with unrivaled speed and efficiency.
                </p>
              </div>
              <button 
                onClick={() => window.open('https://www.ranknexai.com/team', '_blank')}
                className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all self-start cursor-pointer"
              >
                Try now for free
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-[#18181c] border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>⚡</span> Fynd Baltic
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  An all-in-one e-commerce platform to automate e-commerce workflows with 100+ app integrations.
                </p>
              </div>
              <button 
                onClick={() => window.open('https://www.ranknexai.com/team', '_blank')}
                className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-all self-start cursor-pointer"
              >
                Try now for free
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Manual Edit Canvas Modal */}
      {manualEditItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#18181c] rounded-3xl border border-white/15 shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 text-slate-200">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#18181c]">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-white text-base">Manual Watermark Brush & Box Tool</h3>
              </div>
              <button
                onClick={() => setManualEditItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
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
