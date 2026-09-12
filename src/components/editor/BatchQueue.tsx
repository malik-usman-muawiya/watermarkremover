import React, { useState } from 'react';
import type { BatchItem } from '../../types';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { SAMPLE_IMAGES } from '../../utils/sampleImages';
import { 
  FileStack, 
  UploadCloud, 
  Trash2, 
  Download, 
  Sparkles
} from 'lucide-react';

export const BatchQueue: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [items, setItems] = useState<BatchItem[]>([
    {
      id: 'batch-1',
      file: new File([], 'Product_Catalog_01.jpg'),
      previewUrl: SAMPLE_IMAGES[0].originalUrl,
      status: 'queued',
      progress: 0
    },
    {
      id: 'batch-2',
      file: new File([], 'Product_Catalog_02.jpg'),
      previewUrl: SAMPLE_IMAGES[1].originalUrl,
      status: 'queued',
      progress: 0
    },
    {
      id: 'batch-3',
      file: new File([], 'Product_Catalog_03.jpg'),
      previewUrl: SAMPLE_IMAGES[2].originalUrl,
      status: 'queued',
      progress: 0
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newItems: BatchItem[] = Array.from(e.target.files).map((f, i) => ({
        id: `batch-${Date.now()}-${i}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        status: 'queued',
        progress: 0
      }));
      setItems(prev => [...prev, ...newItems]);
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    setIsAllCompleted(false);
  };

  const processBatch = () => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in with Google to start free batch watermark inpainting');
      return;
    }

    setIsProcessing(true);
    setIsAllCompleted(false);

    let completedCount = 0;
    items.forEach((item, index) => {
      setTimeout(() => {
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'processing', progress: 35 } : it));

        setTimeout(() => {
          setItems(prev => prev.map(it => it.id === item.id ? { 
            ...it, 
            status: 'completed', 
            progress: 100, 
            resultUrl: it.previewUrl 
          } : it));

          completedCount++;
          if (completedCount === items.length) {
            setIsProcessing(false);
            setIsAllCompleted(true);
          }
        }, 1600 + index * 300);

      }, index * 250);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold border border-purple-200 mb-2">
            <FileStack className="w-3.5 h-3.5" />
            <span>High-Throughput Batch Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Bulk Watermark Removal</h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload up to 50 product photos or catalog images and clean them all at once.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all cursor-pointer">
              <UploadCloud className="w-4 h-4" />
              Add More Images
            </span>
          </label>

          {items.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={clearAll}
              disabled={isProcessing}
            >
              Clear Queue
            </Button>
          )}
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden divide-y divide-slate-100">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">Queue is Empty</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              Select multiple files or folders to start bulk cleaning.
            </p>
            <label className="cursor-pointer inline-block">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <span className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all cursor-pointer">
                Select Images from Computer
              </span>
            </label>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-xs text-slate-400 w-4 font-bold">{idx + 1}</span>
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img src={item.previewUrl} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-slate-800 text-sm truncate">{item.file.name || `Photo_${idx + 1}.png`}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-emerald-600 font-bold">100% Free Launch</span>
                    <span className="text-slate-300">•</span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                      item.status === 'completed' ? 'text-emerald-600' :
                      item.status === 'processing' ? 'text-brand-600 animate-pulse' :
                      'text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {item.status === 'completed' && (
                  <a
                    href={item.previewUrl}
                    download={`cleaned_${item.file.name || 'image.png'}`}
                    className="p-2 text-brand-600 hover:bg-teal-50 rounded-xl transition-colors"
                    title="Download Cleaned Image"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}

                {item.status === 'queued' && !isProcessing && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    aria-label="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Batch Processing Controls */}
      {items.length > 0 && (
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            <span>Total: <strong className="text-slate-900">{items.length} Images</strong></span>
            <span className="mx-2">•</span>
            <span className="text-emerald-600 font-bold">Free Unlimited Launch Quota</span>
          </div>

          {isAllCompleted ? (
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => alert('Downloading all cleaned images as a .ZIP archive...')}
              >
                Download All (.ZIP)
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={clearAll}
              >
                Start New Batch
              </Button>
            </div>
          ) : (
            <Button
              onClick={processBatch}
              isLoading={isProcessing}
              disabled={isProcessing}
              variant="primary"
              size="lg"
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 shadow-md shadow-brand-500/25"
              leftIcon={<Sparkles className="w-5 h-5" />}
            >
              Clean {items.length} Images Now
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
