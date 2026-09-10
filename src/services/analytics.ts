/**
 * Privacy-Conscious Anonymized Event Tracking
 * AN-001, AN-003
 * Strictly excludes image contents, filenames containing PII, or sensitive tokens.
 */

type AnalyticsEvent = 
  | { name: 'upload_started'; fileCount: number }
  | { name: 'upload_success'; fileCount: number }
  | { name: 'processing_success'; durationMs: number; regionsCount?: number }
  | { name: 'processing_error'; errorCode: string }
  | { name: 'download_clicked'; type: 'single' | 'batch'; count?: number }
  | { name: 'cta_clicked'; ctaName: string; destination: string };

class AnalyticsService {
  private enabled: boolean;

  constructor() {
    this.enabled = typeof window !== 'undefined';
  }

  public track(event: AnalyticsEvent): void {
    if (!this.enabled) return;

    try {
      // In development, log cleanly without noise
      if (import.meta.env?.DEV) {
        console.debug('[Analytics Event]', event.name, event);
      }

      // If Google Analytics (gtag) is present on window
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', event.name, event);
      }

      // If Plausible is loaded
      if (typeof (window as any).plausible === 'function') {
        (window as any).plausible(event.name, { props: event });
      }
    } catch {
      // Silent fail - analytics must never degrade user experience
    }
  }

  public trackUpload(count: number): void {
    this.track({ name: 'upload_started', fileCount: count });
  }

  public trackInpaintSuccess(durationMs: number, regionsCount?: number): void {
    this.track({ name: 'processing_success', durationMs, regionsCount });
  }

  public trackError(code: string): void {
    this.track({ name: 'processing_error', errorCode: code });
  }

  public trackDownload(type: 'single' | 'batch', count = 1): void {
    this.track({ name: 'download_clicked', type, count });
  }

  public trackCta(ctaName: string, destination: string): void {
    this.track({ name: 'cta_clicked', ctaName, destination });
  }
}

export const analytics = new AnalyticsService();
