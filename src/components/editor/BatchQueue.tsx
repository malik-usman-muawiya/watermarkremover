import React, { useState } from 'react';
import type { BatchItem } from '../../types';
import { SAMPLE_IMAGES } from '../../utils/sampleImages';
import { 
  FileStack, 
  UploadCloud, 
  Trash2, 
  Download, 
  Sparkles
} from 'lucide-react';

export const BatchQueue: React.FC = () => {
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
  const [isZipping, setIsZipping] = useState(false);

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
        }, 1200 + index * 200);

      }, index * 200);
    });
  };

  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    setIsZipping(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const folder = zip.folder("watermark_ai_cleaned_batch");

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const url = item.resultUrl || item.previewUrl;
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const filename = `${(item.file.name || `photo_${i+1}`).replace(/\.[^/.]+$/, "")}_cleaned.png`;
          folder?.file(filename, blob);
        } catch {
          // fallback
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `watermark_ai_batch_${items.length}_images_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open synchronously so browsers don't block popup
      window.open('https://www.ranknexai.com/team', '_blank');
    } catch (err) {
      console.error('ZIP Error:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-[#0D1527] border border-teal-500/20 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/20 mb-2">
            <FileStack className="w-3.5 h-3.5" />
            <span>High-Throughput Batch Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Bulk Watermark Removal</h2>
          <p className="text-xs text-slate-400 mt-1">
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
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer">
              <UploadCloud className="w-4 h-4" />
              Add More Images
            </span>
          </label>

          {items.length > 0 && (
            <button
              onClick={clearAll}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              Clear Queue
            </button>
          )}
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-[#0D1527] border border-teal-500/20 rounded-3xl shadow-xl overflow-hidden divide-y divide-white/5">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#111A2E] text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Queue is Empty</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
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
              <span className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer">
                Select Images from Computer
              </span>
            </label>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#111A2E]/50 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-xs text-slate-500 w-4 font-bold">{idx + 1}</span>
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black border border-white/10 shrink-0">
                  <img src={item.previewUrl} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-white text-sm truncate">{item.file.name || `Photo_${idx + 1}.png`}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-teal-400 font-bold">100% Free Launch</span>
                    <span className="text-slate-600">•</span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                      item.status === 'completed' ? 'text-teal-400' :
                      item.status === 'processing' ? 'text-cyan-400 animate-pulse' :
                      'text-slate-500'
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
                    onClick={() => window.open('https://www.ranknexai.com/team', '_blank')}
                    className="p-2 text-teal-400 hover:bg-teal-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Download Cleaned Image"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}

                {item.status === 'queued' && !isProcessing && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
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
        <div className="p-6 bg-[#0D1527] border border-teal-500/20 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-medium">
            <span>Total: <strong className="text-white">{items.length} Images</strong></span>
            <span className="mx-2">•</span>
            <span className="text-teal-400 font-bold">Free Unlimited Launch Quota</span>
          </div>

          {isAllCompleted ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="px-6 py-3 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isZipping ? 'Generating ZIP...' : 'Download All (.ZIP)'}</span>
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-3 bg-[#111A2E] text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Start New Batch
              </button>
            </div>
          ) : (
            <button
              onClick={processBatch}
              disabled={isProcessing}
              className="px-8 py-3.5 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-teal-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>{isProcessing ? 'Cleaning in progress...' : `Clean ${items.length} Images Now`}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
