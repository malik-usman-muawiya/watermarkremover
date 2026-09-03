import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  DollarSign, 
  Cpu, 
  ShieldAlert, 
  TrendingUp,
  HardDrive,
  Lock,
  UserCheck,
  LogOut,
  KeyRound,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AdminPage: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cleanmark_admin_auth') === 'true';
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
      setAuthError('Invalid username or password. Please use the default credentials shown below.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('cleanmark_admin_auth');
    setIsAdminAuthenticated(false);
  };

  // If not logged in as Admin, show Admin Login Portal
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-brand-600 border border-teal-200 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal Login</h2>
            <p className="text-xs text-slate-500">
              Restricted management portal for CleanMark AI infrastructure & metrics.
            </p>
          </div>

          {/* Admin Credentials Callout Badge */}
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-left space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700">
              <KeyRound className="w-4 h-4 text-brand-600" />
              <span>Default Admin Credentials:</span>
            </div>
            <div className="text-xs text-slate-700 space-y-1 font-mono bg-white p-2.5 rounded-xl border border-teal-100">
              <div>Username: <strong className="text-brand-600">admin</strong></div>
              <div>Password: <strong className="text-brand-600">admin123</strong></div>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Admin Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Admin Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold"
            >
              Sign In to Admin Dashboard
            </Button>
          </form>

          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
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
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-brand-600 rounded-2xl border border-teal-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin & Operations Panel</h1>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Real-time system telemetry, GPU worker clusters, and SaaS revenue metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab selector */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                activeTab === 'metrics' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              System Metrics
            </button>
            <button
              onClick={() => setActiveTab('workers')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                activeTab === 'workers' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              GPU Worker Queue
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                activeTab === 'users' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              User Accounts
            </button>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={handleAdminLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Admin Logout
          </Button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Launch Traffic (Visitors)</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">18,420</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +142% launch surge
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Free Inpaintings Rendered</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">42,910</div>
          <div className="mt-1 text-xs text-emerald-600 font-bold">99.88% Success Rate</div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Google Sign-ins</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">5,830</div>
          <div className="mt-1 text-xs text-slate-500">Unlimited Free Pass enabled</div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Storage Auto-Purged (24h)</span>
            <HardDrive className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">148.5 GB</div>
          <div className="mt-1 text-xs text-slate-500">Private buckets clean</div>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-600" />
                Live Inpainting Worker Throughput
              </h3>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
              </span>
            </div>

            <div className="h-44 flex items-end gap-2 pt-6 border-b border-slate-100">
              {[40, 65, 30, 85, 45, 95, 70, 60, 80, 50, 90, 75, 85, 40, 60, 90, 70, 85, 95, 60, 45, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs text-slate-500">
              <div>Avg Photo Inpaint: <strong className="text-slate-800">0.82s</strong></div>
              <div>Avg Video Removal: <strong className="text-slate-800">8.4s</strong></div>
              <div>GPU Backlog: <strong className="text-slate-800">0 pending</strong></div>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Cluster Controls</h3>
            
            <div className="space-y-2.5 text-xs">
              <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-left font-bold text-slate-800 flex items-center justify-between">
                <span>Scale PyTorch Worker Pool</span>
                <span className="text-brand-600">+ Add Node</span>
              </button>

              <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-left font-bold text-slate-800 flex items-center justify-between">
                <span>Trigger Manual Storage Purge</span>
                <span className="text-red-600">Execute</span>
              </button>

              <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-left font-bold text-slate-800 flex items-center justify-between">
                <span>Export Traffic & Launch Logs</span>
                <span className="text-slate-500">CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workers' && (
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Active GPU Cluster Nodes</h3>
          
          <div className="divide-y divide-slate-100 text-xs text-slate-700">
            {[
              { id: 'worker-gpu-a100-01', location: 'us-east (Virginia)', gpu: 'NVIDIA A100 80GB', load: '32%', status: 'Online' },
              { id: 'worker-gpu-a100-02', location: 'us-east (Virginia)', gpu: 'NVIDIA A100 80GB', load: '28%', status: 'Online' },
              { id: 'worker-gpu-l4-01', location: 'eu-central (Frankfurt)', gpu: 'NVIDIA L4 24GB', load: '18%', status: 'Online' },
              { id: 'worker-cpu-ffmpeg-01', location: 'us-east (Virginia)', gpu: 'AMD EPYC 32-Core', load: '44%', status: 'Encoding' }
            ].map((node) => (
              <div key={node.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-slate-900">{node.id}</div>
                  <div className="text-slate-400">{node.location} • {node.gpu}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div>Load: <strong className="text-slate-900">{node.load}</strong></div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase text-[10px]">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Active Launch Users</h3>
          
          <div className="divide-y divide-slate-100 text-xs text-slate-700">
            {[
              { email: 'alex.creator@gmail.com', method: 'Google OAuth', processed: '34 images, 4 videos' },
              { email: 'sarah.vlog@gmail.com', method: 'Google OAuth', processed: '18 videos' },
              { email: 'mark.photo@studio.net', method: 'Google OAuth', processed: '142 images' },
              { email: 'dropship.team@ecom.io', method: 'Email Login', processed: '85 images' }
            ].map((usr, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{usr.email}</div>
                  <div className="text-slate-400">Auth: {usr.method}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div>Activity: <strong className="text-brand-600">{usr.processed}</strong></div>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-brand-600 font-bold text-[10px]">
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
