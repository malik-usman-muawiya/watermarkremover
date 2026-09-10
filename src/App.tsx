import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CreditsProvider } from './context/CreditsContext';
import { PromoBanner } from './components/layout/PromoBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/ui/AuthModal';
import { UpgradeModal } from './components/ui/UpgradeModal';

// Primary landing is eager for fastest LCP
import { ImageEditorPage } from './pages/ImageEditorPage';

// Code-split all other routes on demand
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const VideoEditorPage = lazy(() => import('./pages/VideoEditorPage').then(m => ({ default: m.VideoEditorPage })));
const BatchEditorPage = lazy(() => import('./pages/BatchEditorPage').then(m => ({ default: m.BatchEditorPage })));
const CompressorPage = lazy(() => import('./pages/CompressorPage').then(m => ({ default: m.CompressorPage })));
const KbLandingPage = lazy(() => import('./pages/KbLandingPage').then(m => ({ default: m.KbLandingPage })));
const PakistanFormPhotoHubPage = lazy(() => import('./pages/PakistanFormPhotoHubPage').then(m => ({ default: m.PakistanFormPhotoHubPage })));
const ResolutionReducerPage = lazy(() => import('./pages/ResolutionReducerPage').then(m => ({ default: m.ResolutionReducerPage })));
const GifCompressorPage = lazy(() => import('./pages/GifCompressorPage').then(m => ({ default: m.GifCompressorPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const ApiDocsPage = lazy(() => import('./pages/ApiDocsPage').then(m => ({ default: m.ApiDocsPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const LegalPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.LegalPage })));
const SeoLandingPage = lazy(() => import('./pages/SeoLandingPage').then(m => ({ default: m.SeoLandingPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
      <span className="text-xs font-semibold text-slate-400">Loading neural modules...</span>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CreditsProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#0e0e11] text-slate-100 selection:bg-amber-500 selection:text-black">
            {/* Top Launch Alert Continuous Marquee Ticker */}
            <PromoBanner />

            {/* Navbar */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="flex-1">
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  {/* Core AI Tools - Default Front Page is Image Watermark Remover */}
                  <Route path="/" element={<ImageEditorPage />} />
                  <Route path="/editor/image" element={<ImageEditorPage />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/editor/video" element={<VideoEditorPage />} />
                  <Route path="/editor/batch" element={<BatchEditorPage />} />

                  {/* Image Compressor Suite */}
                  <Route path="/compress-image" element={<CompressorPage />} />
                  <Route path="/compress-image-to-20kb" element={<KbLandingPage />} />
                  <Route path="/compress-image-to-50kb" element={<KbLandingPage />} />
                  <Route path="/compress-image-to-100kb" element={<KbLandingPage />} />
                  <Route path="/compress-image-to-200kb" element={<KbLandingPage />} />
                  <Route path="/compress-image-to-300kb" element={<KbLandingPage />} />
                  <Route path="/reduce-image-resolution" element={<ResolutionReducerPage />} />
                  <Route path="/pakistan-job-form-photo-size" element={<PakistanFormPhotoHubPage />} />
                  <Route path="/compress-gif" element={<GifCompressorPage />} />

                  {/* User & Admin */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/api-docs" element={<ApiDocsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/legal" element={<LegalPage />} />
                  <Route path="/seo/:slug" element={<SeoLandingPage />} />

                  {/* Custom 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>

            {/* Dark Footer */}
            <Footer />

            {/* Global Google Authentication Modal */}
            <AuthModal />

            {/* Upgrade & Top-up Modal */}
            <UpgradeModal />
          </div>
        </Router>
      </CreditsProvider>
    </AuthProvider>
  );
}

export default App;
