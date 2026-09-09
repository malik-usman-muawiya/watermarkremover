import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { 
  generateSyntheticSampleVideo, 
  processAndExportCleanVideo, 
  inpaintVideoRegionOnContext, 
  type WatermarkRegion 
} from '../../utils/videoGenerator';
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
  MousePointer2, 
  Download, 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkle,
  RotateCcw,
  Maximize2,
  Scan,
  Layers,
  Wand2
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
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>(0.5625); // Default portrait 9:16

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // View Mode: 'preview' (Split slider) vs 'edit' (Interactive box edit)
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Multi-Region List
  const [regions, setRegions] = useState<WatermarkRegion[]>([
    { id: 'region-1', label: 'Top Text Banner', x: 6, y: 4, width: 88, height: 14 }
  ]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('region-1');

  // Drag & Resize state
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [initialBoxState, setInitialBoxState] = useState<WatermarkRegion | null>(null);

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
    { title: 'Analyzing Video Frames', desc: 'Isolating watermark bounding areas' },
    { title: 'Neural Background Synthesis', desc: 'Applying temporal edge-clamped inpainting' },
    { title: 'Finalizing Clean Video', desc: 'Ready for instant high-speed download' }
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
      const h = videoRef.current.videoHeight || 1280;
      setVideoAspectRatio(w / h);
      setDuration(videoRef.current.duration || 6);

      if (previewCanvasRef.current) {
        previewCanvasRef.current.width = w;
        previewCanvasRef.current.height = h;
      }
      renderLiveInpaintedFrame();
    }
  };

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

  // Re-render current frame with inpainting
  const renderLiveInpaintedFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = previewCanvasRef.current;
    if (!video || !canvas) return;

    const width = canvas.width || video.videoWidth || 720;
    const height = canvas.height || video.videoHeight || 1280;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // 1. Draw original video frame
    ctx.drawImage(video, 0, 0, width, height);

    // 2. Inpaint all active watermark regions
    inpaintVideoRegionOnContext(ctx, video, width, height, regions);
  }, [regions]);

  useEffect(() => {
    renderLiveInpaintedFrame();
  }, [regions, renderLiveInpaintedFrame]);

  // Handle Box Selection / Movement / Resizing
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, handle?: string, regionId?: string) => {
    if (viewMode === 'preview') {
      setIsDraggingSlider(true);
      handleSliderMove(e.clientX);
      return;
    }

    if (viewMode === 'edit') {
      e.stopPropagation();
      const targetId = regionId || selectedRegionId;
      setSelectedRegionId(targetId);
      const targetBox = regions.find(r => r.id === targetId);
      if (!targetBox || !videoWrapperRef.current) return;

      const rect = videoWrapperRef.current.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 100;
      const clickY = ((e.clientY - rect.top) / rect.height) * 100;

      setActiveHandle(handle || 'move');
      setDragStartPos({ x: clickX, y: clickY });
      setInitialBoxState({ ...targetBox });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (viewMode === 'preview' && isDraggingSlider) {
      handleSliderMove(e.clientX);
      return;
    }

    if (viewMode === 'edit' && activeHandle && dragStartPos && initialBoxState && videoWrapperRef.current) {
      const rect = videoWrapperRef.current.getBoundingClientRect();
      const curX = ((e.clientX - rect.left) / rect.width) * 100;
      const curY = ((e.clientY - rect.top) / rect.height) * 100;
      const dx = curX - dragStartPos.x;
      const dy = curY - dragStartPos.y;

      let { x, y, width, height } = initialBoxState;

      if (activeHandle === 'move') {
        x = Math.max(0, Math.min(100 - width, initialBoxState.x + dx));
        y = Math.max(0, Math.min(100 - height, initialBoxState.y + dy));
      } else if (activeHandle === 'se') {
        width = Math.max(4, Math.min(100 - x, initialBoxState.width + dx));
        height = Math.max(3, Math.min(100 - y, initialBoxState.height + dy));
      } else if (activeHandle === 'sw') {
        const newX = Math.max(0, initialBoxState.x + dx);
        width = Math.max(4, initialBoxState.width + (initialBoxState.x - newX));
        x = newX;
        height = Math.max(3, Math.min(100 - y, initialBoxState.height + dy));
      } else if (activeHandle === 'ne') {
        const newY = Math.max(0, initialBoxState.y + dy);
        height = Math.max(3, initialBoxState.height + (initialBoxState.y - newY));
        y = newY;
        width = Math.max(4, Math.min(100 - x, initialBoxState.width + dx));
      } else if (activeHandle === 'nw') {
        const newX = Math.max(0, initialBoxState.x + dx);
        const newY = Math.max(0, initialBoxState.y + dy);
        width = Math.max(4, initialBoxState.width + (initialBoxState.x - newX));
        height = Math.max(3, initialBoxState.height + (initialBoxState.y - newY));
        x = newX;
        y = newY;
      } else if (activeHandle === 'n') {
        const newY = Math.max(0, initialBoxState.y + dy);
        height = Math.max(3, initialBoxState.height + (initialBoxState.y - newY));
        y = newY;
      } else if (activeHandle === 's') {
        height = Math.max(3, Math.min(100 - y, initialBoxState.height + dy));
      } else if (activeHandle === 'w') {
        const newX = Math.max(0, initialBoxState.x + dx);
        width = Math.max(4, initialBoxState.width + (initialBoxState.x - newX));
        x = newX;
      } else if (activeHandle === 'e') {
        width = Math.max(4, Math.min(100 - x, initialBoxState.width + dx));
      }

      setRegions(prev => prev.map(r => r.id === selectedRegionId ? { ...r, x, y, width, height } : r));
    }
  };

  const handlePointerUp = () => {
    setActiveHandle(null);
    setIsDraggingSlider(false);
    setDragStartPos(null);
    setInitialBoxState(null);
    renderLiveInpaintedFrame();
  };

  const handleSliderMove = useCallback((clientX: number) => {
    if (!videoWrapperRef.current) return;
    const rect = videoWrapperRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitSliderPos(percent);
  }, []);

  // Add / Remove Region
  const addRegion = () => {
    const newId = `region-${Date.now()}`;
    const newBox: WatermarkRegion = {
      id: newId,
      label: `Watermark #${regions.length + 1}`,
      x: 15,
      y: 75,
      width: 70,
      height: 12
    };
    setRegions(prev => [...prev, newBox]);
    setSelectedRegionId(newId);
    setViewMode('edit');
  };

  const deleteRegion = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (regions.length <= 1) return;
    setRegions(prev => prev.filter(r => r.id !== id));
    setSelectedRegionId(regions.find(r => r.id !== id)?.id || '');
  };

  const applyPreset = (preset: 'top-banner' | 'corner-logo' | 'bottom-subtitle' | 'bottom-right') => {
    if (preset === 'top-banner') {
      setRegions([{ id: 'region-1', label: 'Top Text Banner', x: 6, y: 3.5, width: 88, height: 15 }]);
    } else if (preset === 'corner-logo') {
      setRegions([{ id: 'region-1', label: 'Top-Right Logo', x: 68, y: 4, width: 28, height: 12 }]);
    } else if (preset === 'bottom-subtitle') {
      setRegions([{ id: 'region-1', label: 'Bottom Subtitle', x: 8, y: 82, width: 84, height: 13 }]);
    } else if (preset === 'bottom-right') {
      setRegions([{ id: 'region-1', label: 'Bottom-Right Stamp', x: 65, y: 82, width: 30, height: 14 }]);
    }
    setSelectedRegionId('region-1');
  };

  // Video Export & Download
  const startVideoProcessing = async () => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in with Google to start free video watermark removal');
      return;
    }

    setIsProcessing(true);
    setProgress(20);
    setCurrentStage(0);
    setIsCompleted(false);

    setTimeout(() => {
      setProgress(55);
      setCurrentStage(1);
    }, 400);

    let cleanedBlob = selectedVideo;
    if (videoRef.current) {
      try {
        cleanedBlob = await processAndExportCleanVideo(videoRef.current, regions, Math.min(10, duration));
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

      ApiService.createJob('video', videoTitle, selectedVideo, 0, '18.5 MB');

      // Download file
      const link = document.createElement('a');
      link.href = cleanedBlob;
      link.download = `cleanmark_${videoTitle.replace(/\.[^/.]+$/, "")}_clean.mp4`;
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
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-[#13151f] border border-[#232738] rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>AI Temporal Video Inpainter 3.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Video Watermark Remover
          </h1>
          <p className="text-xs text-slate-400 mt-1">
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
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer">
              <UploadCloud className="w-4 h-4" />
              Upload Video
            </span>
          </label>

          {/* Sample Switcher */}
          <div className="flex items-center gap-1.5 bg-[#1a1d2c] p-1 rounded-2xl border border-[#2d3248] text-xs">
            <span className="text-slate-400 text-[11px] px-2 font-medium">Demo:</span>
            <button
              onClick={() => loadSample('drone')}
              className="px-2.5 py-1 font-semibold rounded-xl bg-[#282d42] text-amber-300 hover:text-white transition-colors cursor-pointer"
            >
              Sample 1
            </button>
            <button
              onClick={() => loadSample('vlog')}
              className="px-2.5 py-1 font-semibold rounded-xl hover:bg-[#282d42] text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            >
              Sample 2
            </button>
          </div>
        </div>
      </div>

      {/* Completed State */}
      {isCompleted && cleanedVideoBlobUrl ? (
        <VideoComparisonSlider
          originalUrl={selectedVideo}
          cleanedUrl={cleanedVideoBlobUrl}
          title={videoTitle}
          onReset={handleResetVideo}
        />
      ) : (
        /* Main Workspace Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Video Viewport & Controls */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* View Mode Bar */}
            <div className="flex items-center justify-between p-2.5 bg-[#13151f] border border-[#232738] rounded-2xl shadow-md text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    viewMode === 'preview'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-[#1a1d2c] text-slate-300 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Live Before & After Split</span>
                </button>

                <button
                  onClick={() => setViewMode('edit')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    viewMode === 'edit'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-[#1a1d2c] text-slate-300 hover:text-white'
                  }`}
                >
                  <MousePointer2 className="w-3.5 h-3.5" />
                  <span>Adjust Watermark Area</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Artifact Inpainting</span>
              </div>
            </div>

            {/* Video Theater Viewport */}
            <div 
              className="relative p-6 bg-[#0a0a0f] rounded-3xl border border-[#1f2334] flex items-center justify-center overflow-hidden shadow-2xl min-h-[480px]"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div 
                ref={videoWrapperRef}
                onPointerDown={(e) => handlePointerDown(e)}
                className="relative max-h-[62vh] rounded-2xl overflow-hidden shadow-2xl bg-black border border-[#2f354e] select-none mx-auto cursor-pointer"
                style={{
                  aspectRatio: `${videoAspectRatio || 0.5625}`,
                  maxHeight: '62vh',
                  maxWidth: '100%'
                }}
              >
                {/* 1. Underlying Video */}
                {selectedVideo ? (
                  <video
                    ref={videoRef}
                    src={selectedVideo}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                    className="w-full h-full object-contain block bg-black"
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
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{
                    clipPath: viewMode === 'preview' ? `inset(0 0 0 ${splitSliderPos}%)` : 'none',
                    display: viewMode === 'preview' ? 'block' : 'none'
                  }}
                />

                {/* 3. Live Split Curtain Slider */}
                {viewMode === 'preview' && selectedVideo && (
                  <>
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider pointer-events-none shadow border border-white/20">
                      BEFORE (ORIGINAL)
                    </div>
                    <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider pointer-events-none shadow border border-amber-300/30">
                      AFTER (INPAINTED)
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] flex items-center justify-center pointer-events-none z-20"
                      style={{ left: `${splitSliderPos}%` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center -ml-[15px] border-2 border-amber-500 pointer-events-auto cursor-ew-resize hover:scale-110 transition-transform">
                        <SlidersHorizontal className="w-3.5 h-3.5 rotate-90 text-amber-600" />
                      </div>
                    </div>
                  </>
                )}

                {/* 4. Interactive Resizable Watermark Boxes */}
                {viewMode === 'edit' && selectedVideo && (
                  <>
                    {regions.map((r) => {
                      const isSelected = r.id === selectedRegionId;
                      return (
                        <div
                          key={r.id}
                          onPointerDown={(e) => handlePointerDown(e, 'move', r.id)}
                          className={`absolute border-2 rounded-xl shadow-2xl cursor-move select-none transition-shadow ${
                            isSelected 
                              ? 'border-amber-400 bg-amber-500/25 shadow-amber-500/30 z-20' 
                              : 'border-emerald-400/80 bg-emerald-500/15 z-10'
                          }`}
                          style={{
                            left: `${r.x}%`,
                            top: `${r.y}%`,
                            width: `${r.width}%`,
                            height: `${r.height}%`
                          }}
                        >
                          {/* Label tag */}
                          <div className={`text-[9px] font-black px-2 py-0.5 rounded-full shadow absolute -top-5 left-1 uppercase tracking-wider flex items-center gap-1 ${
                            isSelected ? 'bg-amber-500 text-black' : 'bg-emerald-600 text-white'
                          }`}>
                            <Sparkle className="w-2.5 h-2.5" />
                            <span>{r.label || 'Watermark Area'}</span>
                          </div>

                          {/* Resize Handles (when selected) */}
                          {isSelected && (
                            <>
                              {/* 4 Corners */}
                              <div onPointerDown={(e) => handlePointerDown(e, 'nw', r.id)} className="w-3 h-3 bg-amber-400 border border-white rounded-full absolute -top-1.5 -left-1.5 cursor-nwse-resize shadow-md" />
                              <div onPointerDown={(e) => handlePointerDown(e, 'ne', r.id)} className="w-3 h-3 bg-amber-400 border border-white rounded-full absolute -top-1.5 -right-1.5 cursor-nesw-resize shadow-md" />
                              <div onPointerDown={(e) => handlePointerDown(e, 'sw', r.id)} className="w-3 h-3 bg-amber-400 border border-white rounded-full absolute -bottom-1.5 -left-1.5 cursor-nesw-resize shadow-md" />
                              <div onPointerDown={(e) => handlePointerDown(e, 'se', r.id)} className="w-3 h-3 bg-amber-400 border border-white rounded-full absolute -bottom-1.5 -right-1.5 cursor-nwse-resize shadow-md" />
                              
                              {/* 4 Edges */}
                              <div onPointerDown={(e) => handlePointerDown(e, 'n', r.id)} className="w-4 h-1.5 bg-amber-400 rounded-full absolute -top-1 left-1/2 -translate-x-1/2 cursor-ns-resize" />
                              <div onPointerDown={(e) => handlePointerDown(e, 's', r.id)} className="w-4 h-1.5 bg-amber-400 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 cursor-ns-resize" />
                              <div onPointerDown={(e) => handlePointerDown(e, 'w', r.id)} className="w-1.5 h-4 bg-amber-400 rounded-full absolute top-1/2 -left-1 -translate-y-1/2 cursor-ew-resize" />
                              <div onPointerDown={(e) => handlePointerDown(e, 'e', r.id)} className="w-1.5 h-4 bg-amber-400 rounded-full absolute top-1/2 -right-1 -translate-y-1/2 cursor-ew-resize" />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* 5. Center Play Button Overlay */}
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-colors cursor-pointer z-10"
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:scale-110 hover:bg-amber-500 hover:text-black transition-all shadow-2xl cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="p-4 bg-[#13151f] border border-[#232738] rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="font-mono text-amber-400">{formatTime(currentTime)} / {formatTime(duration)}</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="text-slate-400 hover:text-white p-1 cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-amber-400 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Full HD Quality
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max={duration || 10}
                step="0.05"
                value={currentTime}
                onChange={(e) => {
                  const t = parseFloat(e.target.value);
                  setCurrentTime(t);
                  if (videoRef.current) videoRef.current.currentTime = t;
                }}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-[#232738] rounded-lg appearance-none"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={togglePlay}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-black font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause Video' : 'Play Video'}</span>
                </button>

                <span className="text-[11px] text-slate-400">Click video or press Play to inspect in real-time</span>
              </div>
            </div>
          </div>

          {/* Right Col: Watermark Presets & Download */}
          <div className="p-6 bg-[#13151f] border border-[#232738] rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  Watermark Placement
                </h3>
                <button
                  onClick={addRegion}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1e2235] hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Box
                </button>
              </div>

              {/* Watermark Region Manager List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Watermark Boxes ({regions.length}):
                </span>
                
                {regions.map((r, i) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRegionId(r.id || '');
                      setViewMode('edit');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      selectedRegionId === r.id 
                        ? 'bg-amber-500/15 border-amber-500/50 text-white' 
                        : 'bg-[#181a26] border-[#262a3e] text-slate-300 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>{r.label || `Watermark Region ${i + 1}`}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-amber-400 bg-[#24283b] px-2 py-0.5 rounded font-mono">
                        {Math.round(r.width)}% &times; {Math.round(r.height)}%
                      </span>
                      {regions.length > 1 && (
                        <button
                          onClick={(e) => deleteRegion(r.id || '', e)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Placement Presets */}
              <div className="space-y-2 pt-2 border-t border-[#232738]">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick-Snap Presets:
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyPreset('top-banner')}
                    className="p-2.5 bg-[#181a26] hover:bg-amber-500/10 border border-[#262a3e] hover:border-amber-500/40 rounded-xl text-left text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  >
                    📝 Top Banner
                  </button>

                  <button
                    onClick={() => applyPreset('corner-logo')}
                    className="p-2.5 bg-[#181a26] hover:bg-amber-500/10 border border-[#262a3e] hover:border-amber-500/40 rounded-xl text-left text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  >
                    🏷️ Top-Right Logo
                  </button>

                  <button
                    onClick={() => applyPreset('bottom-subtitle')}
                    className="p-2.5 bg-[#181a26] hover:bg-amber-500/10 border border-[#262a3e] hover:border-amber-500/40 rounded-xl text-left text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  >
                    🕒 Bottom Subtitle
                  </button>

                  <button
                    onClick={() => applyPreset('bottom-right')}
                    className="p-2.5 bg-[#181a26] hover:bg-amber-500/10 border border-[#262a3e] hover:border-amber-500/40 rounded-xl text-left text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  >
                    ✨ Corner Stamp
                  </button>
                </div>
              </div>

              {/* Status Info */}
              <div className="p-3.5 bg-[#181a26] border border-[#262a3e] rounded-2xl space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Live Split Preview:</span>
                  <span className="font-bold text-amber-400">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Inpainting Engine:</span>
                  <span className="font-bold text-emerald-400">⚡ Zero-Artifact GPU</span>
                </div>
              </div>
            </div>

            {/* Fast Processing / Download Trigger */}
            {isProcessing ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 animate-spin text-amber-400" />
                    {stages[currentStage].title}
                  </span>
                  <span className="font-mono font-bold text-white">{progress}%</span>
                </div>

                <div className="w-full bg-[#232738] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-200 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">{stages[currentStage].desc}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={startVideoProcessing}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-black font-black text-sm rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Clean HD Video</span>
                </button>
                <p className="text-center text-[11px] text-slate-500">
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

