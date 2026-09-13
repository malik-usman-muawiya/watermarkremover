import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import type { Job } from '../types';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { sanitizeFileName } from '../utils/fileValidation';
import { 
  History, 
  Trash2, 
  Download, 
  Clock, 
  Search, 
  Sparkles,
  Key, 
  RefreshCw, 
  Gift,
  Check
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, regenerateApiKey } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(() => ApiService.getJobs());
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const handleDeleteJob = (id: string) => {
    ApiService.deleteJob(id);
    setJobs(ApiService.getJobs());
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to permanently purge all processed files and history?')) {
      ApiService.clearAllJobs();
      setJobs([]);
    }
  };

  const handleCopyKey = () => {
    if (user?.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setApiKeyCopied(true);
      setTimeout(() => setApiKeyCopied(false), 2000);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesType = filterType === 'all' || j.type === filterType;
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO 
        title="Media Dashboard & History — Watermark AI Remover"
        description="View your inpainting history, manage temporary storage retention, and generate API credentials."
        canonicalPath="/dashboard"
        noindex={true}
      />

      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Media Dashboard</h1>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Launch Status */}
        <div className="p-5 bg-[#121216] border border-white/10 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Plan Quota</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-white">Unlimited Free</div>
            <div className="text-xs text-emerald-400 font-bold mt-1">● Grand Launch Active</div>
          </div>
          <Link to="/editor/image" className="text-xs font-bold text-amber-400 hover:text-amber-300">
            Start Cleaning &rarr;
          </Link>
        </div>

        {/* Card 2: Current Subscription Plan */}
        <div className="p-5 bg-[#121216] border border-white/10 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Account Type</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-white">Verified Session</div>
            <div className="text-xs text-slate-400 mt-1 truncate">{user?.email || 'Active guest session'}</div>
          </div>
          <Link to="/pricing" className="text-xs font-bold text-amber-400 hover:text-amber-300">
            View All Features &rarr;
          </Link>
        </div>

        {/* Card 3: Retention Privacy SLA */}
        <div className="p-5 bg-[#121216] border border-white/10 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Storage Retention</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-white">24 Hours</div>
            <div className="text-xs text-slate-400 mt-1">Auto-purge privacy guarantee</div>
          </div>
          <button 
            onClick={handleClearAll}
            className="text-xs font-bold text-red-400 hover:text-red-300 text-left cursor-pointer"
          >
            Purge All Files Now &rarr;
          </button>
        </div>

        {/* Card 4: Total Inpaintings */}
        <div className="p-5 bg-[#121216] border border-white/10 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Media Cleaned</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-white">{jobs.length} Items</div>
            <div className="text-xs text-slate-400 mt-1">Images, Objects & Videos</div>
          </div>
          <Link to="/editor/video" className="text-xs font-bold text-amber-400 hover:text-amber-300">
            Clean Video Clip &rarr;
          </Link>
        </div>

      </div>

      {/* Developer API Key Section */}
      <div className="p-6 bg-[#121216] border border-white/10 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">Developer REST API Token</h2>
            <p className="text-xs text-slate-400">Use this token to authenticate programmatic inpainting requests</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <code className="px-3.5 py-2 bg-[#18181c] border border-white/15 rounded-xl font-mono text-xs text-amber-400 font-bold">
            {user?.apiKey || 'wm_live_demo_key_789456'}
          </code>
          <button 
            onClick={handleCopyKey}
            className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            {apiKeyCopied ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{apiKeyCopied ? 'Copied!' : 'Copy Token'}</span>
          </button>
          <button
            onClick={regenerateApiKey}
            title="Regenerate API Token"
            aria-label="Regenerate API token"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Processing History & Storage Manager */}
      <div className="bg-[#121216] border border-white/10 rounded-3xl overflow-hidden shadow-lg space-y-4">
        
        {/* Table Controls */}
        <div className="p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-white text-base flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              Recent Media History
            </h2>
            <p className="text-xs text-slate-400">Files are kept in encrypted storage for 24h before automatic expiration</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#18181c] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Filter Buttons */}
            <div className="bg-[#18181c] p-1 rounded-xl border border-white/10 flex items-center text-xs">
              {['all', 'image', 'video', 'object'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-lg capitalize font-bold transition-colors cursor-pointer ${
                    filterType === t 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List / Table */}
        <div className="divide-y divide-white/10">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-medium">
              No matching processing history found.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black border border-white/10 shrink-0 relative shadow-xs">
                    <img src={job.resultUrl || job.originalUrl} alt={job.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/90 text-[9px] font-bold text-amber-400 px-1.5 py-0.2 rounded uppercase">
                      {job.type}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate max-w-xs sm:max-w-md">{job.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{job.inputSize}</span>
                      <span>•</span>
                      <span>{job.resolution || 'HD'}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Auto-purges in 22h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {job.resultUrl && (
                    <a
                      href={job.resultUrl}
                      download={`watermark_ai_${sanitizeFileName(job.title)}`}
                      className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/20 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    title="Delete permanently from storage"
                    aria-label="Delete job permanently"
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
