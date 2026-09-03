import React from 'react';
import type { ToolMode } from '../../types';
import { Button } from '../ui/Button';
import { 
  Paintbrush, 
  Square, 
  Eraser, 
  Hand, 
  Undo2, 
  Redo2, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Sparkles
} from 'lucide-react';

interface EditorToolbarProps {
  tool: ToolMode;
  setTool: (tool: ToolMode) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearMask: () => void;
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  onResetZoom: () => void;
  onProcess: () => void;
  isProcessing: boolean;
  hasMask: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  tool,
  setTool,
  brushSize,
  setBrushSize,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearMask,
  zoom,
  setZoom,
  onResetZoom,
  onProcess,
  isProcessing,
  hasMask
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border-b border-slate-200 rounded-t-3xl shadow-xs">
      {/* Tool select buttons */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setTool('brush')}
          title="Brush Mask Tool (B)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tool === 'brush' 
              ? 'bg-brand-500 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Brush</span>
        </button>

        <button
          onClick={() => setTool('box')}
          title="Rectangle Box Selector (R)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tool === 'box' 
              ? 'bg-brand-500 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          <span>Box Area</span>
        </button>

        <button
          onClick={() => setTool('eraser')}
          title="Eraser Tool (E)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tool === 'eraser' 
              ? 'bg-brand-500 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Eraser</span>
        </button>

        <button
          onClick={() => setTool('pan')}
          title="Hand / Pan Tool (H)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tool === 'pan' 
              ? 'bg-brand-500 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
          <span>Pan</span>
        </button>
      </div>

      {/* Brush Size Slider */}
      {(tool === 'brush' || tool === 'eraser') && (
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-semibold">Size:</span>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 accent-brand-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />
          <div className="w-6 text-right font-mono font-bold text-brand-600">{brushSize}px</div>
        </div>
      )}

      {/* Undo, Redo, Clear Mask */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onClearMask}
          disabled={!hasMask}
          title="Clear Mask Selection"
          className="p-2 text-red-500 hover:text-red-700 disabled:opacity-30 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
        <button
          onClick={() => setZoom(z => Math.max(0.2, z - 0.2))}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono px-1 text-slate-700 font-bold text-[11px]">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(z => Math.min(4, z + 0.2))}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onResetZoom}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg ml-0.5 cursor-pointer"
          title="Fit View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Process AI Action Button */}
      <Button
        onClick={onProcess}
        disabled={!hasMask || isProcessing}
        isLoading={isProcessing}
        variant="primary"
        size="sm"
        className="bg-brand-500 hover:bg-brand-600 font-bold text-white shadow-md shadow-brand-500/20"
        leftIcon={<Sparkles className="w-4 h-4" />}
      >
        Remove Watermark
      </Button>
    </div>
  );
};
