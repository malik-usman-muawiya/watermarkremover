import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RotateCcw, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';

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
    <div className="flex flex-col h-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-200 bg-white gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Inpainting Complete</h3>
            <p className="text-xs text-slate-500">Drag the center slider to inspect before & after clarity</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Format selector */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            {(['png', 'jpg', 'webp'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setDownloadFormat(fmt)}
                className={`px-2.5 py-1 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                  downloadFormat === fmt ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <Button
            onClick={handleDownload}
            variant="primary"
            size="sm"
            isLoading={isDownloading}
            leftIcon={<Download className="w-4 h-4" />}
            className="bg-brand-500 hover:bg-brand-600 text-white"
          >
            Download Clean HD
          </Button>

          <Button
            onClick={onReset}
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Edit Another
          </Button>
        </div>
      </div>

      {/* Comparison Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 select-none overflow-hidden bg-checkerboard">
        <div
          ref={containerRef}
          className="relative max-h-[70vh] aspect-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-300 cursor-ew-resize"
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
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                maxWidth: 'none'
              }}
              crossOrigin="anonymous"
            />
          </div>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider pointer-events-none shadow-md">
            Original (Before)
          </div>
          <div className="absolute top-4 right-4 bg-brand-500/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider pointer-events-none shadow-md">
            AI Inpainted (After)
          </div>

          {/* Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-white text-slate-800 shadow-xl flex items-center justify-center -ml-[14px] border-2 border-brand-500">
              <SlidersHorizontal className="w-3.5 h-3.5 rotate-90 text-brand-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
