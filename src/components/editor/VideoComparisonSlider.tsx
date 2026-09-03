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
    link.download = `cleanmark_video_${Date.now()}.${downloadFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Redirect to requested team website
    setTimeout(() => {
      setIsDownloading(false);
      window.open('https://www.ranknexai.com/team', '_blank');
    }, 600);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-200 bg-white gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Inpainting Complete</h3>
            <p className="text-xs text-slate-500">Drag the center slider to inspect before & after clarity</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Format selection pills */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            {(['mp4', 'webm', 'mov'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setDownloadFormat(fmt)}
                className={`px-3 py-1 text-xs font-black uppercase rounded-lg transition-colors cursor-pointer ${
                  downloadFormat === fmt 
                    ? 'bg-brand-500 text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-brand-500 hover:opacity-95 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-orange-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Downloading HD...' : 'Download Clean HD'}</span>
          </button>

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

      {/* Comparison Viewport with Checkerboard Background */}
      <div className="relative p-6 sm:p-8 select-none bg-checkerboard flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative max-h-[65vh] aspect-video w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-300 bg-black cursor-ew-resize group"
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
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                maxWidth: 'none'
              }}
              loop
              playsInline
              muted
              crossOrigin="anonymous"
            />
          </div>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider pointer-events-none shadow-md border border-white/20">
            ORIGINAL (BEFORE)
          </div>
          <div className="absolute top-4 right-4 bg-brand-500/90 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider pointer-events-none shadow-md border border-brand-300/30">
            AI INPAINTED (AFTER)
          </div>

          {/* Center Split Curtain Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-white text-slate-800 shadow-2xl flex items-center justify-center -ml-[16px] border-2 border-brand-500">
              <SlidersHorizontal className="w-4 h-4 rotate-90 text-brand-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Playback Scrubber & Controls */}
      <div className="px-6 pb-6 pt-2 space-y-3">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col space-y-3 shadow-xs">
          
          {/* Timeline Seekbar */}
          <input
            type="range"
            min="0"
            max={duration || 10}
            step="0.05"
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />

          <div className="flex items-center justify-between">
            {/* Play/Pause and Time */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-xl bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <span className="font-mono text-xs font-bold text-slate-700">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-500 hidden sm:inline">
                Both video tracks synchronized in real-time
              </span>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
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
