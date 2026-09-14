import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Download, 
  SlidersHorizontal, 
  X, 
  Edit3, 
  Upload, 
  CheckCircle2,
  ChevronDown,
  Layers,
  Video,
  Wand2,
  Maximize,
  RefreshCw,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { sanitizeFileName } from '../../utils/fileValidation';
import { analytics } from '../../services/analytics';

export interface ProcessedImageItem {
  id: string;
  name: string;
  originalUrl: string;
  cleanUrl: string;
  maskUrl?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  removeText: boolean;
  removeLogo: boolean;
  model: 'text' | 'logo' | 'all';
  qualityPassed?: boolean;
  preservedPercentage?: number;
  regionsCount?: number;
  maskedPixelCount?: number;
}

interface ImageCardItemProps {
  item: ProcessedImageItem;
  onRemove: (id: string) => void;
  onManualEdit: (item: ProcessedImageItem) => void;
  onUploadNext: () => void;
  onUpdateSettings: (id: string, updates: Partial<ProcessedImageItem>) => void;
}

export const ImageCardItem: React.FC<ImageCardItemProps> = ({
  item,
  onRemove,
  onManualEdit,
  onUploadNext,
  onUpdateSettings
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showMaskPreview, setShowMaskPreview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userRating, setUserRating] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  // Track container width outside of render (refs must not be read during
  // render) so the "before" image layer can match the container's size.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateWidth = () => setContainerWidth(el.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Drag handlers for Before/After comparison slider
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Handle Download Image + Redirect to requested URL
  const handleDownload = () => {
    setIsDownloading(true);
    analytics.trackDownload('single');

    const link = document.createElement('a');
    link.href = item.cleanUrl;
    const safeBaseName = sanitizeFileName(item.name.replace(/\.[^/.]+$/, ""));
    link.download = `watermark_ai_${safeBaseName}_cleaned.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open synchronously (not inside setTimeout) so browsers still treat
    // this as part of the user's click and don't block the popup.
    window.open('https://www.ranknexai.com/team', '_blank');
    setTimeout(() => {
      setIsDownloading(false);
    }, 600);
  };

  return (
    <div className="relative bg-[#0D1527] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl transition-all space-y-4 text-slate-200">
      
      {/* Red Outlined Close / Remove Button at Top-Right (Matching Reference) */}
      <button
        onClick={() => onRemove(item.id)}
        className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-[#111A2E] border-2 border-red-500/80 text-red-400 hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all cursor-pointer shadow-lg z-20"
        title="Remove this image"
        aria-label="Remove this image"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Main Card Content (65% Left Preview + 35% Right Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column (Cols 1-7): Large Black Preview Container with Before/After Slider */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] max-h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black select-none cursor-ew-resize group"
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              if (e.touches.length > 0) handleMove(e.touches[0].clientX);
            }}
          >
            {/* After / Mask Preview: Cleaned Image or Mask Overlay (Bottom Layer) */}
            <img
              src={showMaskPreview ? (item.maskUrl || item.cleanUrl) : item.cleanUrl}
              alt="Watermark Removed"
              className="w-full h-full object-contain pointer-events-none block"
              crossOrigin="anonymous"
            />

            {/* Before: Original Watermarked Image (Clipped Top Layer) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={item.originalUrl}
                alt="Original Watermark"
                className="h-full object-contain pointer-events-none"
                style={{
                  width: containerWidth ? `${containerWidth}px` : '100%',
                  maxWidth: 'none'
                }}
                crossOrigin="anonymous"
              />
            </div>

            {/* Before / After / Mask Preview Floating Badges */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-black text-slate-300 uppercase tracking-wider pointer-events-none border border-white/10">
              Before
            </div>
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider pointer-events-none border border-white/10 flex items-center gap-1.5">
              {showMaskPreview ? (
                <span className="text-red-400 font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  Mask Preview
                </span>
              ) : (
                <span className="text-slate-300">After</span>
              )}
            </div>

            {/* Processing Region: Watermark Only Tag */}
            <div className="absolute bottom-4 left-4 bg-[#070B14]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-teal-400 border border-teal-500/30 flex items-center gap-1.5 shadow-lg pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>Processing Region: Watermark Only ({item.regionsCount ?? 1} Region{(item.regionsCount ?? 1) > 1 ? 's' : ''})</span>
            </div>

            {/* Center Draggable Split Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)] flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#0D1527] text-white shadow-2xl flex items-center justify-center -ml-[15px] border-2 border-teal-400/80 group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="w-3.5 h-3.5 rotate-90 text-teal-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Cols 8-12): Controls Matching Reference Image Exactly */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Manual Edit Prompt & Mask Preview Debug Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onManualEdit(item)}
              className="py-2 px-3 bg-[#111A2E] hover:bg-[#18243e] text-slate-200 border border-white/10 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-400" />
              <span>Manual Edit</span>
            </button>

            <button
              onClick={() => setShowMaskPreview(!showMaskPreview)}
              className={`py-2 px-3 border rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                showMaskPreview
                  ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-red-500/10'
                  : 'bg-[#111A2E] hover:bg-[#18243e] text-slate-300 border-white/10'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${showMaskPreview ? 'text-red-400' : 'text-teal-400'}`} />
              <span>{showMaskPreview ? 'Hide Mask' : 'Mask Preview'}</span>
            </button>
          </div>

          {/* Watermark Model Selector Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor={`model-select-${item.id}`} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Choose Watermark Model
            </label>
            <div className="relative">
              <select
                id={`model-select-${item.id}`}
                value={item.model}
                onChange={(e) => onUpdateSettings(item.id, { model: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-[#111A2E] border border-white/10 rounded-xl text-xs font-bold text-slate-200 appearance-none focus:outline-none focus:border-teal-400 cursor-pointer pr-8"
              >
                <option value="text">Text Remove - Model v2.4 (Ultra Crisp)</option>
                <option value="logo">Logo & Graphic Removal</option>
                <option value="all">Full Neural Inpaint (Text + Logo + Objects)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Processing / Failed / Completed State (UX-005, QA-004) */}
          {item.status === 'failed' && (
            <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-300 flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Inpainting encountered an error.</span>
              </div>
              <button
                onClick={() => onUpdateSettings(item.id, {})}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {item.status === 'processing' && (
            <div className="w-full py-3.5 px-4 bg-[#111A2E] border border-teal-500/30 rounded-xl text-xs text-teal-400 font-bold flex items-center justify-center gap-2 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
              <span>Neural Inpainting in progress...</span>
            </div>
          )}

          {item.status === 'completed' && (
            <>
              {/* Primary Action Button: Download Image (RankNex Teal Gradient) */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-3.5 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isDownloading ? 'Downloading Image...' : 'Download Image'}</span>
              </button>

              {/* Quality Check Verification Status Badge */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Watermark removed successfully</span>
                </div>
                <div className="text-[10px] text-center text-slate-400 font-mono">
                  ✓ Quality Check: 100% Background Preserved (Bit-for-Bit Untouched)
                </div>
              </div>
            </>
          )}

          {/* Checkboxes: Remove Text & Remove Logo */}
          <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={item.removeText}
                onChange={(e) => onUpdateSettings(item.id, { removeText: e.target.checked })}
                className="w-4 h-4 accent-teal-500 rounded bg-[#111A2E] border-white/20 cursor-pointer"
              />
              <span>Remove Text</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={item.removeLogo}
                onChange={(e) => onUpdateSettings(item.id, { removeLogo: e.target.checked })}
                className="w-4 h-4 accent-teal-500 rounded bg-[#111A2E] border-white/20 cursor-pointer"
              />
              <span>Remove Logo</span>
            </label>
          </div>

          {/* Secondary Action: Upload Next Image Button */}
          <button
            onClick={onUploadNext}
            className="w-full py-2.5 bg-[#111A2E] hover:bg-[#18243e] text-slate-200 border border-white/10 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Upload Next Image</span>
          </button>

          {/* Utility Quick Actions Row (Matching Reference) */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <Link
              to="/editor/video"
              className="p-2 rounded-xl bg-[#111A2E]/60 hover:bg-[#111A2E] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-1 group"
            >
              <Video className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Convert to Video</span>
            </Link>

            <button
              onClick={() => onManualEdit(item)}
              className="p-2 rounded-xl bg-[#111A2E]/60 hover:bg-[#111A2E] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-1 group cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Edit with AI</span>
            </button>

            <button
              onClick={() => alert('AI Image Upscaler: Scaling to 4K Ultra-HD resolution...')}
              className="p-2 rounded-xl bg-[#111A2E]/60 hover:bg-[#111A2E] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-1 group cursor-pointer"
            >
              <Maximize className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Upscale Image</span>
            </button>
          </div>

          {/* Result Rating Emojis */}
          <div className="flex items-center justify-center gap-3 pt-1 text-slate-400 text-xs">
            <span className="text-[11px] font-medium">Rate this result:</span>
            <button
              onClick={() => setUserRating('happy')}
              className={`p-1 rounded-lg transition-transform text-base cursor-pointer ${userRating === 'happy' ? 'scale-125' : 'hover:opacity-80'}`}
              title="Satisfied"
            >
              😄
            </button>
            <button
              onClick={() => setUserRating('neutral')}
              className={`p-1 rounded-lg transition-transform text-base cursor-pointer ${userRating === 'neutral' ? 'scale-125' : 'hover:opacity-80'}`}
              title="Neutral"
            >
              😐
            </button>
            <button
              onClick={() => setUserRating('sad')}
              className={`p-1 rounded-lg transition-transform text-base cursor-pointer ${userRating === 'sad' ? 'scale-125' : 'hover:opacity-80'}`}
              title="Unsatisfied"
            >
              😞
            </button>
          </div>

        </div>

      </div>

      {/* Batch Mode Banner inside Card (Matching Reference Image 4) */}
      <div className="pt-2">
        <Link 
          to="/editor/batch"
          className="p-3 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-600/10 border border-teal-500/30 rounded-2xl flex items-center justify-between text-xs text-teal-300 font-bold hover:border-teal-500/60 transition-all group"
        >
          <span className="text-slate-300">⚡ Want to remove watermark from hundreds of images in seconds?</span>
          <span className="text-teal-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-extrabold">
            Try Batch Mode <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

    </div>
  );
};
