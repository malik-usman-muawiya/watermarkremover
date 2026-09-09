import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCredits } from '../../context/CreditsContext';
import { Button } from '../ui/Button';
import { 
  Sparkles, 
  Layers, 
  Video, 
  Image as ImageIcon, 
  FileStack, 
  CreditCard, 
  Code2, 
  Menu, 
  X, 
  ChevronDown, 
  User as UserIcon, 
  LogOut, 
  Search,
  Gift,
  Zap,
  Minimize2,
  FileCheck,
  Maximize2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#121216]/95 backdrop-blur-md transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#18181c] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-white tracking-tight leading-none flex items-center gap-1">
                CLEANMARK <span className="text-amber-400">AI</span>
              </span>
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-extrabold mt-0.5">
                WATERMARK &bull; COMPRESS &bull; VIDEO
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <Link
            to="/"
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              isActive('/') 
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>

          {/* AI Tools Dropdown */}
          <div className="relative" onMouseLeave={() => setToolsDropdownOpen(false)}>
            <button
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                location.pathname.startsWith('/editor') || location.pathname.startsWith('/compress') || location.pathname.startsWith('/reduce')
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>AI Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 p-2 bg-[#18181c] border border-white/15 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                <Link
                  to="/editor/image"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Image Watermark Remover</div>
                    <div className="text-[11px] text-slate-400">Brush & box AI inpainting</div>
                  </div>
                </Link>

                <Link
                  to="/compress-image"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Minimize2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Image Compressor</span>
                      <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 rounded">NEW</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Compress to 20KB, 50KB, 100KB</div>
                  </div>
                </Link>

                <Link
                  to="/editor/video"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Video Watermark Remover</div>
                    <div className="text-[11px] text-slate-400">Upload video clips & inpaint</div>
                  </div>
                </Link>

                <Link
                  to="/pakistan-job-form-photo-size"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Pakistan Form Photo Hub</div>
                    <div className="text-[11px] text-slate-400">NTS, CSS, PMS, NADRA presets</div>
                  </div>
                </Link>

                <Link
                  to="/reduce-image-resolution"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Reduce Resolution</div>
                    <div className="text-[11px] text-slate-400">Scale dimensions & pixels</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/compress-image"
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              isActive('/compress-image') 
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Compress Image
          </Link>

          <Link
            to="/editor/video"
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              isActive('/editor/video') 
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Video Remover
          </Link>

          <Link
            to="/pricing"
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              isActive('/pricing') 
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Pricing
          </Link>

          <Link
            to="/api-docs"
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              isActive('/api-docs') 
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            API
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                isActive('/dashboard') 
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Side Tools & Auth */}
        <div className="flex items-center gap-3">
          
          {/* 100% Free Launch Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold shadow-xs">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">100% Free Launch</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-black uppercase">
              Free
            </span>
          </div>

          {/* User Profile or Google Sign In */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 border border-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-xs text-slate-950 uppercase overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 p-2 bg-[#18181c] border border-white/15 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <div className="font-bold text-sm text-white truncate">{user?.name}</div>
                    <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>My Dashboard & History</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-slate-950 text-xs font-black rounded-full shadow-md shadow-orange-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Sign In with Google</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#18181c] px-4 py-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <Link
            to="/editor/image"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-slate-200 hover:text-amber-400 rounded-lg font-bold text-xs"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Image Watermark Remover</span>
          </Link>

          <Link
            to="/compress-image"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-slate-200 hover:text-amber-400 rounded-lg font-bold text-xs"
          >
            <Minimize2 className="w-4 h-4 text-emerald-400" />
            <span>Image Compressor (20KB - 300KB)</span>
          </Link>

          <Link
            to="/pakistan-job-form-photo-size"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-slate-200 hover:text-amber-400 rounded-lg font-bold text-xs"
          >
            <FileCheck className="w-4 h-4 text-teal-400" />
            <span>Pakistan Form Photo Hub (NTS, CSS, PMS)</span>
          </Link>

          <Link
            to="/editor/video"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-slate-200 hover:text-amber-400 rounded-lg font-bold text-xs"
          >
            <Video className="w-4 h-4 text-indigo-400" />
            <span>Video Watermark Remover</span>
          </Link>
        </div>
      )}
    </header>
  );
};
