import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RotateCcw, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ComparisonSliderProps {
  originalUrl: string;
  resultUrl: string;
  title?: string;
  onReset: () => void;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalUrl,
  resultUrl,
  onReset
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'webp'>('png');
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

  const handleDownload = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `cleanmark_inpainted_${Date.now()}.${downloadFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0e11] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121216] gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base">Inpainting Complete</h3>
            <p className="text-xs text-slate-400">Drag the center slider to inspect before & after clarity</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Format selector */}
          <div className="flex items-center bg-[#18181c] rounded-xl p-1 border border-white/10">
            {(['png', 'jpg', 'webp'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setDownloadFormat(fmt)}
                className={`px-2.5 py-1 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                  downloadFormat === fmt ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Clean HD</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#18181c] hover:bg-[#22222a] text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-white/15 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Edit Another</span>
          </button>
        </div>
      </div>

      {/* Comparison Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 select-none overflow-hidden bg-[#0a0a0d]">
        <div
          ref={containerRef}
          className="relative max-h-[70vh] aspect-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-ew-resize"
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            if (e.touches.length > 0) handleMove(e.touches[0].clientX);
          }}
        >
          {/* After (Cleaned result) - Bottom Layer */}
          <img
            src={resultUrl}
            alt="AI Cleaned"
            className="w-auto h-auto max-h-[70vh] object-contain block pointer-events-none"
            crossOrigin="anonymous"
          />

          {/* Before (Original with watermark) - Clipped Top Layer */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={originalUrl}
              alt="Original Watermarked"
              className="max-h-[70vh] h-full object-contain pointer-events-none"
              style={{
                width: containerWidth ? `${containerWidth}px` : '100%',
                maxWidth: 'none'
              }}
              crossOrigin="anonymous"
            />
          </div>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider pointer-events-none shadow-md border border-white/15">
            Original (Before)
          </div>
          <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-950 uppercase tracking-wider pointer-events-none shadow-md border border-amber-300/40">
            AI Inpainted (After)
          </div>

          {/* Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-white text-slate-950 shadow-2xl flex items-center justify-center -ml-[15px] border-2 border-amber-500 pointer-events-auto cursor-ew-resize hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-3.5 h-3.5 rotate-90 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
