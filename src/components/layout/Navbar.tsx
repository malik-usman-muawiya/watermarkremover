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
  Zap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo (Matching Image 1 clean design) */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-teal-500 to-cyan-400 p-0.5 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-600 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-900 tracking-tight leading-none flex items-center gap-1">
                CLEANMARK <span className="text-brand-600">AI</span>
              </span>
              <span className="text-[10px] text-brand-600 uppercase tracking-widest font-extrabold mt-0.5">
                IMAGE &bull; VIDEO &bull; OBJECTS
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links (Pill Style from Image 1) */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <Link
            to="/"
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
              isActive('/') 
                ? 'bg-teal-50 text-brand-600 border border-teal-200 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </Link>

          {/* AI Tools Dropdown */}
          <div className="relative" onMouseLeave={() => setToolsDropdownOpen(false)}>
            <button
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className={`flex items-center gap-1 px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
                location.pathname.startsWith('/editor')
                  ? 'bg-teal-50 text-brand-600 border border-teal-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>AI Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  to="/editor/image"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-teal-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Image Watermark Remover</div>
                    <div className="text-xs text-slate-500">Brush & box AI inpainting</div>
                  </div>
                </Link>

                <Link
                  to="/editor/video"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Video Watermark Remover</div>
                    <div className="text-xs text-slate-500">Upload 15s–1min video clips</div>
                  </div>
                </Link>

                <Link
                  to="/editor/batch"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <FileStack className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Batch Processing</div>
                    <div className="text-xs text-slate-500">Process multiple photos at once</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/editor/video"
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
              isActive('/editor/video') 
                ? 'bg-teal-50 text-brand-600 border border-teal-200 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Video Remover
          </Link>

          <Link
            to="/pricing"
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
              isActive('/pricing') 
                ? 'bg-teal-50 text-brand-600 border border-teal-200 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Pricing
          </Link>

          <Link
            to="/api-docs"
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
              isActive('/api-docs') 
                ? 'bg-teal-50 text-brand-600 border border-teal-200 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            API
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
                isActive('/dashboard') 
                  ? 'bg-teal-50 text-brand-600 border border-teal-200 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Side Tools & Auth (Inspired by Image 1) */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search Bar Pill (Matching Image 1) */}
          <div className="hidden xl:flex items-center relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools... Ctrl+K"
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-slate-200 rounded-full w-44 focus:w-56 transition-all focus:outline-none focus:border-brand-500 text-slate-700"
            />
          </div>

          {/* 100% Free Launch Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold shadow-xs">
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">100% Free Launch</span>
            <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded font-black uppercase">
              Free
            </span>
          </div>

          {/* User Profile or Google Sign In */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-xs text-white uppercase overflow-hidden border border-brand-200">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="font-bold text-sm text-slate-800 truncate">{user?.name}</div>
                    <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Unlimited Free Launch User
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-teal-50 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Dashboard & History</span>
                  </Link>

                  <Link
                    to="/editor/image"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-teal-50 rounded-xl transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span>Image Studio</span>
                  </Link>

                  <Link
                    to="/editor/video"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-teal-50 rounded-xl transition-colors"
                  >
                    <Video className="w-4 h-4 text-slate-400" />
                    <span>Video Remover</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
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
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-full shadow-md shadow-brand-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              {/* Google G Logo inside button */}
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <span>Sign In with Google</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:text-brand-600 rounded-lg hover:bg-teal-50 font-semibold text-sm"
            >
              <span>Home</span>
            </Link>

            <Link
              to="/editor/image"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:text-brand-600 rounded-lg hover:bg-teal-50 font-semibold text-sm"
            >
              <ImageIcon className="w-4 h-4 text-brand-600" />
              <span>Image Watermark Remover</span>
            </Link>

            <Link
              to="/editor/video"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:text-brand-600 rounded-lg hover:bg-teal-50 font-semibold text-sm"
            >
              <Video className="w-4 h-4 text-indigo-600" />
              <span>Video Watermark Remover</span>
            </Link>

            <Link
              to="/editor/batch"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:text-brand-600 rounded-lg hover:bg-teal-50 font-semibold text-sm"
            >
              <FileStack className="w-4 h-4 text-purple-600" />
              <span>Batch Processing</span>
            </Link>

            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:text-brand-600 rounded-lg hover:bg-teal-50 font-semibold text-sm"
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Pricing</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
