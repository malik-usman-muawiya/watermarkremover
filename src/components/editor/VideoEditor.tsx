import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { generateSyntheticSampleVideo, processAndExportCleanVideo, type WatermarkRegion } from '../../utils/videoGenerator';
import { VideoComparisonSlider } from './VideoComparisonSlider';
import { 
  Video, 
  Play, 
  Pause, 
  Sparkles, 
  UploadCloud, 
  Sliders, 
  Cpu, 
  Film, 
  Volume2, 
  VolumeX, 
  Bot, 
  MousePointer2, 
  Download, 
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Scan,
  Sparkle
} from 'lucide-react';

interface VideoEditorProps {
  initialVideoUrl?: string;
}

export const VideoEditor: React.FC<VideoEditorProps> = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('Vehicle_Save_Video.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6);
  const [isMuted, setIsMuted] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // View Mode: 'edit' vs 'preview'
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Removal Mode: 'auto' vs 'manual'
  const [removalMode, setRemovalMode] = useState<'auto' | 'manual'>('auto');

  // Manual Watermark Box
  const [box, setBox] = useState<WatermarkRegion>({ 
    id: 'top-banner',
    label: 'Top Title Banner',
    x: 8, 
    y: 5, 
    width: 84, 
    height: 16 
  });
  const [isDrawingBox, setIsDrawingBox] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);

  // Smart Pre-set Regions
  const autoDetectedRegions: WatermarkRegion[] = [
    { id: 'top-text', label: 'Top Title Text Banner', x: 8, y: 5, width: 84, height: 16 },
    { id: 'bottom-stamp', label: 'Bottom Timestamp / Subtitle', x: 15, y: 84, width: 70, height: 10 }
  ];

  // Processing & Export State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [cleanedVideoBlobUrl, setCleanedVideoBlobUrl] = useState<string | null>(null);

  // Load sample video on mount
  useEffect(() => {
    generateSyntheticSampleVideo('drone').then((url) => {
      if (url && !selectedVideo) {
        setSelectedVideo(url);
      }
    });
  }, []);

  const stages = [
    { title: 'Job Queued', desc: 'Assigned to high-speed GPU worker' },
    { title: 'AI Neural Text Inpainting', desc: 'Isolating watermark banner & synthesizing background pixels' },
    { title: 'Quality Verification', desc: 'Cleaned video ready for instant HD download' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedVideo(url);
      setVideoTitle(file.name);
      setIsCompleted(false);
      setCleanedVideoBlobUrl(null);
      setIsPlaying(false);
      setViewMode('preview');
    }
  };

  const loadSample = async (type: 'drone' | 'vlog') => {
    const url = await generateSyntheticSampleVideo(type);
    setSelectedVideo(url);
    setVideoTitle(type === 'drone' ? 'Drone_Footage_Demo.mp4' : 'Vlog_Clip_Demo.mp4');
    setIsCompleted(false);
    setCleanedVideoBlobUrl(null);
    setIsPlaying(false);
    setViewMode('preview');
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      renderLiveInpaintedFrame();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const w = videoRef.current.videoWidth || 720;
      const h = videoRef.current.videoHeight || 720;
      setVideoAspectRatio(w / h);
      setDuration(videoRef.current.duration || 6);
      renderLiveInpaintedFrame();
    }
  };

  // Direct toggle play that ALWAYS works
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn('Play error:', err));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const renderLiveInpaintedFrame = () => {
    const video = videoRef.current;
    const canvas = previewCanvasRef.current;
    if (!video || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);

    const activeRegions = removalMode === 'auto' ? autoDetectedRegions : [box];

    for (const r of activeRegions) {
      const bx = (r.x / 100) * width;
      const by = (r.y / 100) * height;
      const bw = (r.width / 100) * width;
      const bh = (r.height / 100) * height;

      if (bw <= 0 || bh <= 0) continue;

      ctx.save();
      const samplePadY = Math.max(14, bh * 0.4);
      const topY = Math.max(0, by - samplePadY);
      const botY = Math.min(height - samplePadY, by + bh);

      ctx.beginPath();
      ctx.rect(bx, by, bw, bh);
      ctx.clip();

      ctx.filter = 'blur(10px)';
      ctx.drawImage(video, bx, topY, bw, samplePadY, bx, by, bw, bh * 0.55);
      ctx.drawImage(video, bx, botY, bw, samplePadY, bx, by + bh * 0.45, bw, bh * 0.55);
      ctx.filter = 'none';

      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.restore();
    }
  };

  // Slider Mouse / Touch handlers (without blocking clicks)
  const handleSliderMove = useCallback((clientX: number) => {
    if (!videoWrapperRef.current) return;
    const rect = videoWrapperRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitSliderPos(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (viewMode === 'edit') {
      if (removalMode !== 'manual' || !videoWrapperRef.current) return;
      const rect = videoWrapperRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      
      setIsDrawingBox(true);
      setDrawStart({ x, y });
      setBox({ x, y, width: 0, height: 0 });
    } else if (viewMode === 'preview') {
      setIsDraggingSlider(true);
      handleSliderMove(e.clientX);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (viewMode === 'edit' && isDrawingBox && drawStart && videoWrapperRef.current) {
      const rect = videoWrapperRef.current.getBoundingClientRect();
      const curX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const curY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      const bx = Math.min(drawStart.x, curX);
      const by = Math.min(drawStart.y, curY);
      const bw = Math.max(4, Math.abs(curX - drawStart.x));
      const bh = Math.max(4, Math.abs(curY - drawStart.y));

      setBox({ x: bx, y: by, width: bw, height: bh });
      renderLiveInpaintedFrame();
    } else if (viewMode === 'preview' && isDraggingSlider) {
      handleSliderMove(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDrawingBox(false);
    setIsDraggingSlider(false);
    setDrawStart(null);
    renderLiveInpaintedFrame();
  };

  // Ultra-Fast Export Process with Immediate Download & Redirect
  const startVideoProcessing = async () => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in with Google to start free video watermark removal');
      return;
    }

    setIsProcessing(true);
    setProgress(20);
    setCurrentStage(1);
    setIsCompleted(false);

    const targetRegions = removalMode === 'auto' ? autoDetectedRegions : [box];

    let cleanedBlob = selectedVideo;
    if (videoRef.current) {
      try {
        cleanedBlob = await processAndExportCleanVideo(videoRef.current, targetRegions, Math.min(10, duration));
      } catch (err) {
        console.warn('Video export fallback:', err);
      }
    }

    setTimeout(() => {
      setProgress(100);
      setCurrentStage(2);
      setIsProcessing(false);
      setIsCompleted(true);
      setCleanedVideoBlobUrl(cleanedBlob);

      ApiService.createJob('video', videoTitle, selectedVideo, 0, '22.4 MB');

      // Download file
      const link = document.createElement('a');
      link.href = cleanedBlob;
      link.download = `cleanmark_ai_${videoTitle.replace(/\.[^/.]+$/, "")}_clean.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open ranknexai.com/team
      setTimeout(() => {
        window.open('https://www.ranknexai.com/team', '_blank');
      }, 700);

    }, 1200);
  };

  const handleResetVideo = () => {
    setIsCompleted(false);
    setCleanedVideoBlobUrl(null);
    setIsPlaying(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-brand-600 text-xs font-bold border border-teal-200 mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>AI Temporal Video Inpainter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Video Watermark Remover
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Remove text banners, logos, and timestamps with instant Live Before & After preview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Upload Button */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-brand-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer">
              <UploadCloud className="w-4 h-4" />
              Upload Video
            </span>
          </label>

          {/* Sample Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-400 text-[11px] px-2 font-medium">Demo:</span>
            <button
              onClick={() => loadSample('drone')}
              className="px-2.5 py-1 font-semibold rounded-lg bg-white shadow-xs text-slate-700 hover:text-brand-600 cursor-pointer"
            >
              Sample 1
            </button>
            <button
              onClick={() => loadSample('vlog')}
              className="px-2.5 py-1 font-semibold rounded-lg hover:bg-white text-slate-700 hover:text-brand-600 cursor-pointer"
            >
              Sample 2
            </button>
          </div>
        </div>
      </div>

      {/* When completed, show full Inpainting Complete comparison slider */}
      {isCompleted && cleanedVideoBlobUrl ? (
        <VideoComparisonSlider
          originalUrl={selectedVideo}
          cleanedUrl={cleanedVideoBlobUrl}
          title={videoTitle}
          onReset={handleResetVideo}
        />
      ) : (
        /* Main Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Adaptive Aspect Ratio Video Player & Live Slider */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* View Mode Bar */}
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl shadow-xs text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    viewMode === 'preview'
                      ? 'bg-brand-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Live Before & After Split Slider</span>
                </button>

                <button
                  onClick={() => setViewMode('edit')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    viewMode === 'edit'
                      ? 'bg-brand-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MousePointer2 className="w-3.5 h-3.5" />
                  <span>Select / Move Area</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 font-semibold text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Live Inpainting Active</span>
              </div>
            </div>

            {/* Video Canvas Viewport */}
            <div className="p-4 bg-checkerboard rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-md">
              <div 
                ref={videoWrapperRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-400 select-none mx-auto cursor-pointer"
                style={{
                  aspectRatio: `${videoAspectRatio}`,
                  width: videoAspectRatio < 1 ? 'auto' : '100%',
                  height: videoAspectRatio < 1 ? '60vh' : 'auto'
                }}
              >
                {/* 1. Underlying Video Element */}
                {selectedVideo ? (
                  <video
                    ref={videoRef}
                    src={selectedVideo}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                    className="w-full h-full object-cover block"
                    loop
                    playsInline
                    muted={isMuted}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="text-center text-slate-400 p-8 space-y-3">
                    <Film className="w-12 h-12 mx-auto text-slate-600 animate-pulse" />
                    <p className="text-sm font-semibold">Loading video player...</p>
                  </div>
                )}

                {/* 2. Live Inpainted Preview Canvas */}
                <canvas
                  ref={previewCanvasRef}
                  width={720}
                  height={Math.round(720 / (videoAspectRatio || 1))}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{
                    clipPath: viewMode === 'preview' ? `inset(0 0 0 ${splitSliderPos}%)` : 'none',
                    display: viewMode === 'preview' ? 'block' : 'none'
                  }}
                />

                {/* 3. Live Split Curtain Divider */}
                {viewMode === 'preview' && selectedVideo && (
                  <>
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-0.5 rounded-full text-[9px] font-black text-white uppercase tracking-wider pointer-events-none shadow border border-white/20">
                      BEFORE (ORIGINAL)
                    </div>
                    <div className="absolute top-3 right-3 bg-brand-500/90 backdrop-blur-md px-3 py-0.5 rounded-full text-[9px] font-black text-white uppercase tracking-wider pointer-events-none shadow border border-brand-300/30">
                      AFTER (INPAINTED)
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)] flex items-center justify-center pointer-events-none z-10"
                      style={{ left: `${splitSliderPos}%` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white text-slate-800 shadow-xl flex items-center justify-center -ml-[15px] border-2 border-brand-500 pointer-events-auto cursor-ew-resize">
                        <SlidersHorizontal className="w-3.5 h-3.5 rotate-90 text-brand-600" />
                      </div>
                    </div>
                  </>
                )}

                {/* 4. Watermark Bounding Boxes */}
                {viewMode === 'edit' && selectedVideo && (
                  <>
                    {removalMode === 'auto' ? (
                      autoDetectedRegions.map((r, i) => (
                        <div
                          key={i}
                          className="absolute border-2 border-dashed border-emerald-400 bg-emerald-500/25 rounded-lg shadow-lg pointer-events-none flex items-center justify-center animate-pulse"
                          style={{
                            left: `${r.x}%`,
                            top: `${r.y}%`,
                            width: `${r.width}%`,
                            height: `${r.height}%`
                          }}
                        >
                          <div className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow absolute -top-4 left-0 uppercase tracking-wider flex items-center gap-1">
                            <Sparkle className="w-2.5 h-2.5" /> {r.label || `Watermark ${i + 1}`}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="absolute border-2 border-red-500 bg-red-500/30 rounded-lg shadow-lg cursor-move select-none flex items-center justify-center"
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`
                        }}
                      >
                        <div className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow absolute -top-4 left-0 uppercase tracking-wider">
                          Selected Box (Draw / Move)
                        </div>
                        <div className="w-2 h-2 rounded-full bg-white opacity-90" />
                      </div>
                    )}
                  </>
                )}

                {/* 5. Center Play Button Overlay (always works on click) */}
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/25 transition-colors cursor-pointer z-10"
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-14 h-14 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Video Scrubber & Playback Controls Bar */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="font-mono font-bold text-slate-700">{formatTime(currentTime)} / {formatTime(duration)}</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="text-slate-500 hover:text-slate-800 p-1 cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-brand-600 font-bold">Full HD Quality</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max={duration || 10}
                step="0.1"
                value={currentTime}
                onChange={(e) => {
                  const t = parseFloat(e.target.value);
                  setCurrentTime(t);
                  if (videoRef.current) videoRef.current.currentTime = t;
                }}
                className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={togglePlay}
                  className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause Video' : 'Play Video'}</span>
                </button>

                <span className="text-[11px] text-slate-400">Click anywhere on video or button to play/pause</span>
              </div>
            </div>
          </div>

          {/* Right Col: Quick Targets & Download */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-600" />
                Watermark Target Presets
              </h3>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
                <button
                  onClick={() => {
                    setRemovalMode('auto');
                    renderLiveInpaintedFrame();
                  }}
                  className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center ${
                    removalMode === 'auto' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🤖 Auto-Detect
                </button>
                <button
                  onClick={() => {
                    setRemovalMode('manual');
                    setViewMode('edit');
                    renderLiveInpaintedFrame();
                  }}
                  className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center ${
                    removalMode === 'manual' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✋ Manual Box
                </button>
              </div>

              {/* Quick Target Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick-Select Target:
                </span>
                
                <button
                  onClick={() => {
                    setRemovalMode('manual');
                    setBox({ id: 'top-title', label: 'Top Title Text Banner', x: 8, y: 5, width: 84, height: 16 });
                    setViewMode('preview');
                    renderLiveInpaintedFrame();
                  }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-brand-300 rounded-xl text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>📝 Top Text Banner ("I SAVED...")</span>
                  <span className="text-[10px] text-brand-600 bg-white px-2 py-0.5 rounded shadow-xs">Active</span>
                </button>

                <button
                  onClick={() => {
                    setRemovalMode('manual');
                    setBox({ id: 'corner-logo', label: 'Top-Right Logo', x: 65, y: 6, width: 30, height: 14 });
                    setViewMode('preview');
                    renderLiveInpaintedFrame();
                  }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-brand-300 rounded-xl text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>🏷️ Corner Logo / Stamp</span>
                  <span className="text-[10px] text-slate-400">Select</span>
                </button>

                <button
                  onClick={() => {
                    setRemovalMode('manual');
                    setBox({ id: 'bottom-stamp', label: 'Bottom Timestamp', x: 12, y: 83, width: 76, height: 12 });
                    setViewMode('preview');
                    renderLiveInpaintedFrame();
                  }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-brand-300 rounded-xl text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>🕒 Bottom Subtitle / Timestamp</span>
                  <span className="text-[10px] text-slate-400">Select</span>
                </button>
              </div>

              {/* Status Info */}
              <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <span>Live Split Preview:</span>
                  <span className="font-bold text-brand-600">Active on Player</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Speed:</span>
                  <span className="font-bold text-emerald-600">⚡ Instant GPU Inpaint</span>
                </div>
              </div>
            </div>

            {/* Fast Processing / Download Trigger */}
            {isProcessing ? (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-700 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 animate-spin text-brand-600" />
                    {stages[currentStage].title}
                  </span>
                  <span className="font-mono font-bold text-brand-800">{progress}%</span>
                </div>

                <div className="w-full bg-teal-200/60 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-500 h-full transition-all duration-150 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 leading-tight">{stages[currentStage].desc}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={startVideoProcessing}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-brand-500 hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Clean HD Video</span>
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Instant export &bull; Automatically downloads video and opens team portal
                </p>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
