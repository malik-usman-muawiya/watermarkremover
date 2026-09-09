import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CreditsProvider } from './context/CreditsContext';
import { PromoBanner } from './components/layout/PromoBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/ui/AuthModal';
import { UpgradeModal } from './components/ui/UpgradeModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ImageEditorPage } from './pages/ImageEditorPage';
import { VideoEditorPage } from './pages/VideoEditorPage';
import { BatchEditorPage } from './pages/BatchEditorPage';
import { CompressorPage } from './pages/CompressorPage';
import { KbLandingPage } from './pages/KbLandingPage';
import { PakistanFormPhotoHubPage } from './pages/PakistanFormPhotoHubPage';
import { ResolutionReducerPage } from './pages/ResolutionReducerPage';
import { GifCompressorPage } from './pages/GifCompressorPage';
import { DashboardPage } from './pages/DashboardPage';
import { PricingPage } from './pages/PricingPage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { LegalPage } from './pages/LegalPage';
import { SeoLandingPage } from './pages/SeoLandingPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
              <Routes>
                {/* Core AI Tools */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/editor/image" element={<ImageEditorPage />} />
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
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
