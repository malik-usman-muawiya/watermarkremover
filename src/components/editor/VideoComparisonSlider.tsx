import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  RotateCcw, 
  Sparkles, 
  SlidersHorizontal, 
  Volume2, 
  VolumeX
} from 'lucide-react';
import { Button } from '../ui/Button';

interface VideoComparisonSliderProps {
  originalUrl: string;
  cleanedUrl: string;
  title?: string;
  onReset: () => void;
}

export const VideoComparisonSlider: React.FC<VideoComparisonSliderProps> = ({
  originalUrl,
  cleanedUrl,
  title = 'Cleaned_Video_Output.mp4',
  onReset
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  // Track container width outside of render (refs must not be read during
  // render) so the "before" video layer can match the container's size.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateWidth = () => setContainerWidth(el.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Video playback synchronization
  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const cleanedVideoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6);
  const [isMuted, setIsMuted] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'mp4' | 'webm' | 'mov'>('mp4');
  const [isDownloading, setIsDownloading] = useState(false);

  // Sync play / pause
  const togglePlay = () => {
    const orig = originalVideoRef.current;
    const clean = cleanedVideoRef.current;
    if (!orig || !clean) return;

    if (isPlaying) {
      orig.pause();
      clean.pause();
      setIsPlaying(false);
    } else {
      orig.play().catch(() => {});
      clean.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Sync time
  const handleTimeUpdate = () => {
    if (cleanedVideoRef.current) {
      const t = cleanedVideoRef.current.currentTime;
      setCurrentTime(t);

      if (originalVideoRef.current && Math.abs(originalVideoRef.current.currentTime - t) > 0.08) {
        originalVideoRef.current.currentTime = t;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (cleanedVideoRef.current) {
      setDuration(cleanedVideoRef.current.duration || 6);
      cleanedVideoRef.current.play().catch(() => {});
    }
    if (originalVideoRef.current) {
      originalVideoRef.current.play().catch(() => {});
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (cleanedVideoRef.current) cleanedVideoRef.current.currentTime = time;
    if (originalVideoRef.current) originalVideoRef.current.currentTime = time;
  };

  // Slider Mouse / Touch handlers
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

  // Handle Download + Redirect to https://www.ranknexai.com/team as requested by user
  const handleDownload = () => {
    setIsDownloading(true);

    // 1. Download file
    const link = document.createElement('a');
    link.href = cleanedUrl || originalUrl;
    const baseName = (title || 'Cleaned_Video_Output').replace(/\.[^/.]+$/, '');
    link.download = `cleanmark_${baseName}.${downloadFormat}`;
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

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col bg-[#13151f] rounded-3xl overflow-hidden border border-[#232738] shadow-2xl">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-[#232738] bg-[#171926] gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Inpainting Complete</h3>
            <p className="text-xs text-slate-400">Drag the center slider to inspect before & after clarity</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Format selection pills */}
          <div className="flex items-center bg-[#1e2235] rounded-xl p-1 border border-[#2d324c]">
            {(['mp4', 'webm', 'mov'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setDownloadFormat(fmt)}
                className={`px-3 py-1 text-xs font-black uppercase rounded-lg transition-colors cursor-pointer ${
                  downloadFormat === fmt 
                    ? 'bg-amber-500 text-black shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-black font-black text-xs rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Downloading HD...' : 'Download Clean HD'}</span>
          </button>

          <Button
            onClick={onReset}
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="bg-[#1e2235] text-white border-[#2d324c] hover:bg-[#282d45]"
          >
            Edit Another
          </Button>
        </div>
      </div>

      {/* Comparison Viewport with Sleek Dark Studio Stage */}
      <div className="relative p-6 sm:p-8 select-none bg-[#0a0a0f] flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative max-h-[65vh] aspect-video w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-[#2f354e] bg-black cursor-ew-resize group"
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            if (e.touches.length > 0) handleMove(e.touches[0].clientX);
          }}
        >
          {/* Bottom Layer: Cleaned Video (After) */}
          <video
            ref={cleanedVideoRef}
            src={cleanedUrl || originalUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-contain block pointer-events-none"
            loop
            playsInline
            muted={isMuted}
            crossOrigin="anonymous"
          />

          {/* Top Layer: Original Watermarked Video (Before - Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <video
              ref={originalVideoRef}
              src={originalUrl}
              className="max-h-[65vh] h-full object-contain pointer-events-none"
              style={{
                width: containerWidth ? `${containerWidth}px` : '100%',
                maxWidth: 'none'
              }}
              loop
              playsInline
              muted
              crossOrigin="anonymous"
            />
          </div>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider pointer-events-none shadow-md border border-white/20">
            ORIGINAL (BEFORE)
          </div>
          <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-black text-black uppercase tracking-wider pointer-events-none shadow-md border border-amber-300/30">
            AI INPAINTED (AFTER)
          </div>

          {/* Center Split Curtain Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center -ml-[16px] border-2 border-amber-500 hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-4 h-4 rotate-90 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Playback Scrubber & Controls */}
      <div className="px-6 pb-6 pt-2 space-y-3">
        <div className="p-4 bg-[#171926] border border-[#232738] rounded-2xl flex flex-col space-y-3 shadow-md">
          
          {/* Timeline Seekbar */}
          <input
            type="range"
            min="0"
            max={duration || 10}
            step="0.05"
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-[#232738] rounded-lg appearance-none"
          />

          <div className="flex items-center justify-between">
            {/* Play/Pause and Time */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer text-xs"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <span className="font-mono text-xs font-bold text-amber-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400 hidden sm:inline">
                Both video tracks synchronized in real-time
              </span>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#232738] transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
