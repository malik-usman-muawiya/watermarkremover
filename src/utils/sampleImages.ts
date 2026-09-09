export interface SampleItem {
  id: string;
  title: string;
  category: 'watermark' | 'object' | 'text' | 'stamp' | 'video';
  originalUrl: string;
  cleanUrl: string;
  watermarkMask?: { x: number; y: number; width: number; height: number };
  description: string;
}

const MOUNTAIN_PHOTO_URL = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
const WATCH_PHOTO_URL = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80';
const VILLA_PHOTO_URL = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

/**
 * Creates watermarked version of a real photograph by applying semi-transparent text
 */
export function createWatermarkedPhotoUrl(photoUrl: string, text: string = 'PROOF'): Promise<string> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve(photoUrl);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 900;
      canvas.height = img.naturalHeight || 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(photoUrl);

      // Draw authentic photograph
      ctx.drawImage(img, 0, 0);

      // Draw diagonal translucent repeating watermark text
      ctx.save();
      ctx.rotate(-35 * Math.PI / 180);
      ctx.font = 'bold 38px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;

      for (let y = -800; y < canvas.height * 2; y += 130) {
        for (let x = -800; x < canvas.width * 2; x += 240) {
          ctx.fillText(text, x, y);
          ctx.strokeText(text, x, y);
        }
      }
      ctx.restore();

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => resolve(photoUrl);
    img.src = photoUrl;
  });
}

export const SAMPLE_IMAGES: SampleItem[] = [
  {
    id: 'sample-aerial-proof',
    title: 'Aerial Mountain Clouds with PROOF Watermark',
    category: 'text',
    originalUrl: MOUNTAIN_PHOTO_URL,
    cleanUrl: MOUNTAIN_PHOTO_URL,
    description: 'Erase repeating translucent diagonal "PROOF" watermark lines across sky & mountains.',
    watermarkMask: { x: 10, y: 15, width: 80, height: 70 }
  },
  {
    id: 'sample-watch',
    title: 'Minimalist Luxury Watch Product Catalog',
    category: 'watermark',
    originalUrl: WATCH_PHOTO_URL,
    cleanUrl: WATCH_PHOTO_URL,
    description: 'Clean up copyright brand text without blurring the watch face or strap details.',
    watermarkMask: { x: 65, y: 8, width: 28, height: 12 }
  },
  {
    id: 'sample-villa',
    title: 'Modern Architecture Villa with Agency Logo',
    category: 'watermark',
    originalUrl: VILLA_PHOTO_URL,
    cleanUrl: VILLA_PHOTO_URL,
    description: 'Seamlessly erase intrusive corner agency stamps and transparent logos.',
    watermarkMask: { x: 15, y: 75, width: 35, height: 15 }
  }
];

export const SAMPLE_VIDEOS = [
  {
    id: 'video-sample-1',
    title: 'Vehicle Drone Footage with Title Watermark',
    duration: '00:15',
    thumbnail: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    watermarkRegion: { x: 8, y: 5, width: 84, height: 16 }
  }
];
