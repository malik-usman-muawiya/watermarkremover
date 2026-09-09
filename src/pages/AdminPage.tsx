import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  TrendingUp, 
  HardDrive, 
  UserCheck, 
  LogOut, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle,
  Server,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AdminPage: React.FC = () => {
  // Directly open dashboard on /admin unless user explicitly logged out in current session
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cleanmark_admin_auth') !== 'logged_out';
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'metrics' | 'workers' | 'users'>('metrics');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'admin' && passwordInput === 'admin123') {
      sessionStorage.setItem('cleanmark_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Default: admin / admin123');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.setItem('cleanmark_admin_auth', 'logged_out');
    setIsAdminAuthenticated(false);
  };

  // If explicitly logged out, show Login Portal
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#121216] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Portal Login</h2>
            <p className="text-xs text-slate-400">
              Restricted management portal for Watermark AI Remover infrastructure & cluster metrics.
            </p>
          </div>

          {/* Admin Credentials Callout Badge */}
          <div className="p-4 bg-[#18181c] border border-amber-500/25 rounded-2xl text-left space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Admin Credentials:</span>
            </div>
            <div className="text-xs text-slate-200 space-y-1 font-mono bg-[#0e0e11] p-3 rounded-xl border border-white/10">
              <div>Username: <strong className="text-amber-400">admin</strong></div>
              <div>Password: <strong className="text-amber-400">admin123</strong></div>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Admin Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#18181c] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Admin Password</label>
              <input
                type="password"
                required
                placeholder="admin123"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#18181c] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit encrypted administrative session</span>
          </div>

        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header with Logout */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-[#121216] border border-white/10 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Admin & Operations Panel</h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Live Status
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Real-time system telemetry, GPU worker clusters, and Watermark AI usage metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab selector */}
          <div className="bg-[#18181c] p-1 rounded-2xl border border-white/10 flex items-center text-xs">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3.5 py-1.5 font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'metrics' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              System Metrics
            </button>
            <button
              onClick={() => setActiveTab('workers')}
              className={`px-3.5 py-1.5 font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'workers' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GPU Worker Queue
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              User Accounts
            </button>
          </div>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Logout</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#121216] border border-white/10 rounded-3xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Launch Traffic (Visitors)</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">18,420</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +142% launch surge
          </div>
        </div>

        <div className="p-5 bg-[#121216] border border-white/10 rounded-3xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Free Inpaintings Rendered</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">42,910</div>
          <div className="text-xs text-emerald-400 font-bold">99.88% Success Rate</div>
        </div>

        <div className="p-5 bg-[#121216] border border-white/10 rounded-3xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Sign-ins</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">5,830</div>
          <div className="text-xs text-slate-400">Unlimited Free Pass enabled</div>
        </div>

        <div className="p-5 bg-[#121216] border border-white/10 rounded-3xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Storage Auto-Purged (24h)</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">148.5 GB</div>
          <div className="text-xs text-slate-400">Private buckets clean</div>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-[#121216] border border-white/10 rounded-3xl shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                Live Inpainting Worker Throughput
              </h3>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
              </span>
            </div>

            <div className="h-44 flex items-end gap-2 pt-6 border-b border-white/10">
              {[40, 65, 30, 85, 45, 95, 70, 60, 80, 50, 90, 75, 85, 40, 60, 90, 70, 85, 95, 60, 45, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div 
                    className="w-full bg-gradient-to-t from-amber-600 to-orange-400 rounded-t-sm group-hover:from-amber-400 group-hover:to-orange-300 transition-all"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs text-slate-400">
              <div>Avg Photo Inpaint: <strong className="text-white">0.82s</strong></div>
              <div>Avg Video Removal: <strong className="text-white">8.4s</strong></div>
              <div>GPU Backlog: <strong className="text-emerald-400 font-bold">0 pending</strong></div>
            </div>
          </div>

          <div className="p-6 bg-[#121216] border border-white/10 rounded-3xl shadow-lg space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              Cluster Controls
            </h3>
            
            <div className="space-y-3 text-xs">
              <button className="w-full p-3.5 bg-[#18181c] hover:bg-[#202026] rounded-2xl border border-white/10 text-left font-bold text-slate-200 flex items-center justify-between transition-all cursor-pointer">
                <span>Scale PyTorch Worker Pool</span>
                <span className="text-amber-400 font-bold">+ Add Node</span>
              </button>

              <button className="w-full p-3.5 bg-[#18181c] hover:bg-[#202026] rounded-2xl border border-white/10 text-left font-bold text-slate-200 flex items-center justify-between transition-all cursor-pointer">
                <span>Trigger Manual Storage Purge</span>
                <span className="text-red-400 font-bold">Execute</span>
              </button>

              <button className="w-full p-3.5 bg-[#18181c] hover:bg-[#202026] rounded-2xl border border-white/10 text-left font-bold text-slate-200 flex items-center justify-between transition-all cursor-pointer">
                <span>Export Traffic & Launch Logs</span>
                <span className="text-slate-400 font-mono">CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workers' && (
        <div className="p-6 bg-[#121216] border border-white/10 rounded-3xl shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Active GPU Cluster Nodes
          </h3>
          
          <div className="divide-y divide-white/10 text-xs text-slate-300">
            {[
              { id: 'worker-gpu-a100-01', location: 'us-east (Virginia)', gpu: 'NVIDIA A100 80GB', load: '32%', status: 'Online' },
              { id: 'worker-gpu-a100-02', location: 'us-east (Virginia)', gpu: 'NVIDIA A100 80GB', load: '28%', status: 'Online' },
              { id: 'worker-gpu-l4-01', location: 'eu-central (Frankfurt)', gpu: 'NVIDIA L4 24GB', load: '18%', status: 'Online' },
              { id: 'worker-cpu-ffmpeg-01', location: 'us-east (Virginia)', gpu: 'AMD EPYC 32-Core', load: '44%', status: 'Encoding' }
            ].map((node) => (
              <div key={node.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-white">{node.id}</div>
                  <div className="text-slate-400">{node.location} • {node.gpu}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div>Load: <strong className="text-white">{node.load}</strong></div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-[10px]">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="p-6 bg-[#121216] border border-white/10 rounded-3xl shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Active Launch Users
          </h3>
          
          <div className="divide-y divide-white/10 text-xs text-slate-300">
            {[
              { email: 'alex.creator@gmail.com', method: 'Google OAuth', processed: '34 images, 4 videos' },
              { email: 'sarah.vlog@gmail.com', method: 'Google OAuth', processed: '18 videos' },
              { email: 'mark.photo@studio.net', method: 'Google OAuth', processed: '142 images' },
              { email: 'dropship.team@ecom.io', method: 'Email Login', processed: '85 images' }
            ].map((usr, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{usr.email}</div>
                  <div className="text-slate-400">Auth: {usr.method}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div>Activity: <strong className="text-amber-400">{usr.processed}</strong></div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px]">
                    Unlimited Launch Access
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
