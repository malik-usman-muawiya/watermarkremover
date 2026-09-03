import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Download, 
  Sparkles, 
  SlidersHorizontal, 
  X, 
  Edit3, 
  Copy, 
  Maximize2, 
  Smile, 
  Meh, 
  Frown, 
  Upload, 
  Check, 
  CheckCircle2,
  ChevronDown,
  Layers,
  ArrowRight,
  Video,
  Wand2,
  Maximize,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface ProcessedImageItem {
  id: string;
  name: string;
  originalUrl: string;
  cleanUrl: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  removeText: boolean;
  removeLogo: boolean;
  model: 'text' | 'logo' | 'all';
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
  const navigate = useNavigate();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userRating, setUserRating] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

    const link = document.createElement('a');
    link.href = item.cleanUrl;
    link.download = `cleanmark_ai_${item.name.replace(/\.[^/.]+$/, "")}_cleaned.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
      window.open('https://www.ranknexai.com/team', '_blank');
    }, 600);
  };

  const handleCopyImage = async () => {
    try {
      const response = await fetch(item.cleanUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      navigator.clipboard.writeText(item.cleanUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative bg-[#18181c] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl transition-all space-y-4 text-slate-200">
      
      {/* Red Outlined Close / Remove Button at Top-Right (Matching Reference) */}
      <button
        onClick={() => onRemove(item.id)}
        className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-[#1e1e24] border-2 border-red-500/80 text-red-400 hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all cursor-pointer shadow-lg z-20"
        title="Remove this image"
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
            {/* After: Cleaned Image (Bottom Layer) */}
            <img
              src={item.cleanUrl}
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
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  maxWidth: 'none'
                }}
                crossOrigin="anonymous"
              />
            </div>

            {/* Before / After Floating Badges (Matching Reference) */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-black text-slate-300 uppercase tracking-wider pointer-events-none border border-white/10">
              Before
            </div>
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-black text-slate-300 uppercase tracking-wider pointer-events-none border border-white/10">
              After
            </div>

            {/* Center Draggable Split Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)] flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#1e1e24] text-white shadow-2xl flex items-center justify-center -ml-[15px] border-2 border-white/40 group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="w-3.5 h-3.5 rotate-90 text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Cols 8-12): Controls Matching Reference Image Exactly */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Manual Edit Prompt & Button */}
          <div className="text-center space-y-2">
            <span className="text-xs text-slate-400 block font-medium">
              Result still has watermark?
            </span>
            <button
              onClick={() => onManualEdit(item)}
              className="w-full py-2 px-4 bg-[#23232a] hover:bg-[#2b2b34] text-slate-200 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Try Manual Edit</span>
            </button>
          </div>

          {/* Watermark Model Selector Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Choose Watermark Model
            </label>
            <div className="relative">
              <select
                value={item.model}
                onChange={(e) => onUpdateSettings(item.id, { model: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-[#23232a] border border-white/10 rounded-xl text-xs font-bold text-slate-200 appearance-none focus:outline-none focus:border-amber-500 cursor-pointer pr-8"
              >
                <option value="text">Text Remove - Model v2.4 (Ultra Crisp)</option>
                <option value="logo">Logo & Graphic Removal</option>
                <option value="all">Full Neural Inpaint (Text + Logo + Objects)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Primary Action Button: Download Image (Vibrant Orange Gradient) */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{isDownloading ? 'Downloading Image...' : 'Download Image'}</span>
          </button>

          {/* Success Status Indicator (Green Text from Reference) */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Watermark removed successfully</span>
          </div>

          {/* Checkboxes: Remove Text & Remove Logo */}
          <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={item.removeText}
                onChange={(e) => onUpdateSettings(item.id, { removeText: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded bg-[#23232a] border-white/20 cursor-pointer"
              />
              <span>Remove Text</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={item.removeLogo}
                onChange={(e) => onUpdateSettings(item.id, { removeLogo: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded bg-[#23232a] border-white/20 cursor-pointer"
              />
              <span>Remove Logo</span>
            </label>
          </div>

          {/* Secondary Action: Upload Next Image Button */}
          <button
            onClick={onUploadNext}
            className="w-full py-2.5 bg-[#23232a] hover:bg-[#2b2b34] text-slate-200 border border-white/10 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Upload Next Image</span>
          </button>

          {/* Utility Quick Actions Row (Matching Reference) */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <Link
              to="/editor/video"
              className="p-2 rounded-xl bg-[#23232a]/60 hover:bg-[#23232a] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-1 group"
            >
              <Video className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Convert to Video</span>
            </Link>

            <button
              onClick={() => onManualEdit(item)}
              className="p-2 rounded-xl bg-[#23232a]/60 hover:bg-[#23232a] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-1 group cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Edit with AI</span>
            </button>

            <button
              onClick={() => alert('AI Image Upscaler: Scaling to 4K Ultra-HD resolution...')}
              className="p-2 rounded-xl bg-[#23232a]/60 hover:bg-[#23232a] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-1 group cursor-pointer"
            >
              <Maximize className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
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
          className="p-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs text-amber-300 font-bold hover:border-amber-500/60 transition-all group"
        >
          <span className="text-slate-300">⚡ Want to remove watermark from hundreds of images in seconds?</span>
          <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-extrabold">
            Try Batch Mode <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

    </div>
  );
};
