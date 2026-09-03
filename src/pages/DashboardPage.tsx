import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditsContext';
import { ApiService } from '../services/api';
import type { Job } from '../types';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  History, 
  Trash2, 
  Download, 
  Clock, 
  Search, 
  Sparkles,
  Zap,
  Key,
  RefreshCw,
  Gift
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, regenerateApiKey } = useAuth();
  const { openUpgradeModal } = useCredits();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  useEffect(() => {
    setJobs(ApiService.getJobs());
  }, []);

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
      
      {/* Top Stats Overview (Light theme cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Launch Status */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Plan Quota</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-brand-600 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-slate-900">Unlimited Free</div>
            <div className="text-xs text-emerald-600 font-bold mt-1">● Grand Launch Active</div>
          </div>
          <Link to="/editor/image" className="text-xs font-bold text-brand-600 hover:text-brand-700">
            Start Cleaning &rarr;
          </Link>
        </div>

        {/* Card 2: Current Subscription Plan */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Account Type</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-slate-900">Google Verified</div>
            <div className="text-xs text-slate-500 mt-1">{user?.email || 'Active session'}</div>
          </div>
          <Link to="/pricing" className="text-xs font-bold text-brand-600 hover:text-brand-700">
            View All Features &rarr;
          </Link>
        </div>

        {/* Card 3: Retention Privacy SLA */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Storage Retention</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-slate-900">24 Hours</div>
            <div className="text-xs text-slate-500 mt-1">Auto-purge privacy guarantee</div>
          </div>
          <button 
            onClick={handleClearAll}
            className="text-xs font-bold text-red-600 hover:text-red-700 text-left cursor-pointer"
          >
            Purge All Files Now &rarr;
          </button>
        </div>

        {/* Card 4: Total Inpaintings */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Media Cleaned</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-slate-900">{jobs.length} Items</div>
            <div className="text-xs text-slate-500 mt-1">Images, Objects & Videos</div>
          </div>
          <Link to="/editor/video" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
            Clean Video Clip &rarr;
          </Link>
        </div>

      </div>

      {/* Developer API Key Section */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-50 text-brand-600 border border-teal-200">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Developer REST API Token</h4>
            <p className="text-xs text-slate-500">Use this token to authenticate programmatic inpainting requests</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <code className="px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono text-xs text-brand-700 font-bold">
            {user?.apiKey || 'cmk_live_demo_key_789456'}
          </code>
          <Button size="sm" variant="secondary" onClick={handleCopyKey}>
            {apiKeyCopied ? 'Copied!' : 'Copy Token'}
          </Button>
          <button
            onClick={regenerateApiKey}
            title="Regenerate API Token"
            className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Processing History & Storage Manager */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs space-y-4">
        
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <History className="w-4 h-4 text-brand-600" />
              Recent Media History
            </h3>
            <p className="text-xs text-slate-500">Files are kept in encrypted storage for 24h before automatic expiration</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs">
              {['all', 'image', 'video', 'object'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-lg capitalize font-bold transition-colors cursor-pointer ${
                    filterType === t ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List / Table */}
        <div className="divide-y divide-slate-100">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-medium">
              No matching processing history found.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 relative shadow-xs">
                    <img src={job.resultUrl || job.originalUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 bg-slate-900/90 text-[9px] font-bold text-white px-1.5 py-0.2 rounded uppercase">
                      {job.type}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">{job.title}</h5>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>{job.inputSize}</span>
                      <span>•</span>
                      <span>{job.resolution || 'HD'}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Auto-purges in 22h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {job.resultUrl && (
                    <a
                      href={job.resultUrl}
                      download={`cleaned_${job.title}`}
                      className="px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl border border-brand-200 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-600" />
                      <span>Download</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    title="Delete permanently from storage"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
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
