import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ToolMode, Point, Rect } from '../../types';
import { EditorToolbar } from './EditorToolbar';
import { performClientInpainting } from '../../services/inpaintingEngine';
import { useAuth } from '../../context/AuthContext';

interface CanvasEditorProps {
  imageSrc: string;
  initialMask?: Rect;
  onProcessSuccess: (resultUrl: string, originalUrl: string) => void;
  onCancel?: () => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  imageSrc,
  initialMask,
  onProcessSuccess
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  // Canvas Refs
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tool state
  const [tool, setTool] = useState<ToolMode>('brush');
  const [brushSize, setBrushSize] = useState<number>(30);
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });

  // Drawing & Interaction state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });
  const [boxStart, setBoxStart] = useState<Point | null>(null);
  const [currentBox, setCurrentBox] = useState<Rect | null>(null);
  const [hasMask, setHasMask] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Undo / Redo history
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Original image dimensions
  const [imgDim, setImgDim] = useState<{ width: number; height: number }>({ width: 800, height: 600 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Save current mask state to history
  const saveMaskSnapshot = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, imgData];
    });
    setHistoryIndex(prev => prev + 1);
    setHasMask(true);
  }, [historyIndex]);

  // Load Image onto imageCanvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgDim({ width: img.width, height: img.height });
      const imgCanvas = imageCanvasRef.current;
      const maskCanvas = maskCanvasRef.current;

      if (imgCanvas && maskCanvas) {
        imgCanvas.width = img.width;
        imgCanvas.height = img.height;
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;

        const imgCtx = imgCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');

        if (imgCtx) {
          imgCtx.clearRect(0, 0, img.width, img.height);
          imgCtx.drawImage(img, 0, 0);
        }

        if (maskCtx) {
          maskCtx.clearRect(0, 0, img.width, img.height);
          
          if (initialMask) {
            const rx = (initialMask.x / 100) * img.width;
            const ry = (initialMask.y / 100) * img.height;
            const rw = (initialMask.width / 100) * img.width;
            const rh = (initialMask.height / 100) * img.height;

            maskCtx.fillStyle = 'rgba(239, 68, 68, 0.7)';
            maskCtx.fillRect(rx, ry, rw, rh);
            setHasMask(true);
          }
        }

        if (maskCtx) {
          const initData = maskCtx.getImageData(0, 0, img.width, img.height);
          setHistory([initData]);
          setHistoryIndex(0);
        }

        setImageLoaded(true);
      }
    };
    img.src = imageSrc;
  }, [imageSrc, initialMask]);

  const getCanvasCoords = (clientX: number, clientY: number): Point => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!imageLoaded) return;

    if (tool === 'pan' || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!maskCtx) return;

    setIsDrawing(true);

    if (tool === 'brush' || tool === 'eraser') {
      maskCtx.beginPath();
      maskCtx.lineCap = 'round';
      maskCtx.lineJoin = 'round';
      maskCtx.lineWidth = brushSize * (imgDim.width / (maskCanvasRef.current?.getBoundingClientRect().width || imgDim.width));

      if (tool === 'eraser') {
        maskCtx.globalCompositeOperation = 'destination-out';
      } else {
        maskCtx.globalCompositeOperation = 'source-over';
        maskCtx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      }

      maskCtx.moveTo(x, y);
      maskCtx.lineTo(x, y);
      maskCtx.stroke();
    } else if (tool === 'box') {
      setBoxStart({ x, y });
      setCurrentBox({ x, y, width: 0, height: 0 });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (!isDrawing) return;

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!maskCtx) return;

    if (tool === 'brush' || tool === 'eraser') {
      maskCtx.lineTo(x, y);
      maskCtx.stroke();
    } else if (tool === 'box' && boxStart) {
      const bx = Math.min(boxStart.x, x);
      const by = Math.min(boxStart.y, y);
      const bw = Math.abs(x - boxStart.x);
      const bh = Math.abs(y - boxStart.y);
      setCurrentBox({ x: bx, y: by, width: bw, height: bh });
    }
  };

  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (!isDrawing) return;
    setIsDrawing(false);

    const maskCanvas = maskCanvasRef.current;
    const maskCtx = maskCanvas?.getContext('2d');
    if (maskCtx && tool === 'box' && currentBox && boxStart) {
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.fillStyle = 'rgba(239, 68, 68, 0.7)';
      maskCtx.fillRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      setBoxStart(null);
      setCurrentBox(null);
    }

    saveMaskSnapshot();
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const maskCtx = maskCanvasRef.current?.getContext('2d');
      if (maskCtx) {
        maskCtx.putImageData(history[nextIndex], 0, 0);
        setHistoryIndex(nextIndex);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const maskCtx = maskCanvasRef.current?.getContext('2d');
      if (maskCtx) {
        maskCtx.putImageData(history[nextIndex], 0, 0);
        setHistoryIndex(nextIndex);
      }
    }
  };

  const handleClearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      saveMaskSnapshot();
      setHasMask(false);
    }
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleProcessInpainting = async () => {
    const imgCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!imgCanvas || !maskCanvas) return;

    // Check authentication requirement
    if (!isAuthenticated) {
      openAuthModal('Please sign in with Google to start free watermark removal');
      return;
    }

    setIsProcessing(true);

    try {
      const resultDataUrl = await performClientInpainting(imgCanvas, maskCanvas, { quality: 'high' });
      const originalDataUrl = imgCanvas.toDataURL('image/png');

      setTimeout(() => {
        setIsProcessing(false);
        onProcessSuccess(resultDataUrl, originalDataUrl);
      }, 900);
    } catch (err) {
      console.error('Inpainting error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Top Toolbar */}
      <EditorToolbar
        tool={tool}
        setTool={setTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearMask={handleClearMask}
        zoom={zoom}
        setZoom={setZoom}
        onResetZoom={handleResetZoom}
        onProcess={handleProcessInpainting}
        isProcessing={isProcessing}
        hasMask={hasMask}
      />

      {/* Main Canvas Viewport */}
      <div 
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center p-4 sm:p-8 select-none overflow-hidden bg-checkerboard cursor-crosshair"
      >
        <div
          className="relative max-h-[70vh] aspect-auto shadow-2xl transition-transform duration-75"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Base Image Canvas */}
          <canvas
            ref={imageCanvasRef}
            className="block max-h-[70vh] w-auto h-auto rounded-xl shadow-md pointer-events-none"
          />

          {/* Mask Drawing Canvas */}
          <canvas
            ref={maskCanvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`absolute inset-0 w-full h-full rounded-xl touch-none ${
              tool === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
            }`}
          />

          {/* Real-time Box Drawing Overlay */}
          {tool === 'box' && currentBox && (
            <div
              className="absolute border-2 border-dashed border-white bg-red-500/30 pointer-events-none"
              style={{
                left: `${(currentBox.x / imgDim.width) * 100}%`,
                top: `${(currentBox.y / imgDim.height) * 100}%`,
                width: `${(currentBox.width / imgDim.width) * 100}%`,
                height: `${(currentBox.height / imgDim.height) * 100}%`,
              }}
            />
          )}
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-in fade-in duration-200">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-teal-200 border-t-brand-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-teal-300 font-bold text-xs">
                AI
              </div>
            </div>
            <h4 className="text-lg font-extrabold text-white tracking-tight">AI Diffusion Inpainting...</h4>
            <p className="text-xs text-teal-100 mt-1">Synthesizing background texture & edge continuity</p>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-4">
          <span>Resolution: <strong className="text-slate-800">{imgDim.width} x {imgDim.height}</strong></span>
          <span className="text-emerald-600 font-bold">100% Free Launch Quota</span>
        </div>
        <div className="hidden sm:block">
          <span>Hint: Paint over logos, watermarks, or photobombers with the brush or drag a box area.</span>
        </div>
      </div>
    </div>
  );
};
