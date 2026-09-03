export interface SampleItem {
  id: string;
  title: string;
  category: 'watermark' | 'object' | 'text' | 'stamp' | 'video';
  originalUrl: string;
  cleanUrl: string;
  watermarkMask?: { x: number; y: number; width: number; height: number };
  description: string;
}

// Generate an image with diagonal "PROOF" watermark baked into canvas
function createProofWatermarkImage(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw mountain / aerial sky background
  const grad = ctx.createLinearGradient(0, 0, 0, 800);
  grad.addColorStop(0, '#0284c7'); // sky blue
  grad.addColorStop(0.3, '#38bdf8');
  grad.addColorStop(0.5, '#e0f2fe'); // clouds
  grad.addColorStop(0.65, '#1e3a8a'); // mountain peaks
  grad.addColorStop(0.8, '#0f766e');
  grad.addColorStop(1, '#064e3b'); // valley
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 800);

  // Mountain ridges
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(0, 550);
  ctx.lineTo(150, 420);
  ctx.lineTo(300, 520);
  ctx.lineTo(450, 380);
  ctx.lineTo(600, 490);
  ctx.lineTo(600, 800);
  ctx.lineTo(0, 800);
  ctx.fill();

  // Snow caps
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(150, 420);
  ctx.lineTo(120, 460);
  ctx.lineTo(180, 460);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(450, 380);
  ctx.lineTo(410, 430);
  ctx.lineTo(490, 430);
  ctx.fill();

  // Fluffy clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(80 + i * 90, 240 + Math.sin(i) * 30, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw repeating diagonal "PROOF PROOF PROOF" watermark text
  ctx.save();
  ctx.rotate(-35 * Math.PI / 180);
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1;

  for (let y = -400; y < 1200; y += 110) {
    for (let x = -600; x < 1000; x += 220) {
      ctx.fillText('PROOF', x, y);
      ctx.strokeText('PROOF', x, y);
    }
  }
  ctx.restore();

  return canvas.toDataURL('image/png');
}

// Generate the corresponding 100% pristine clean version without ANY watermark
function createCleanMountainImage(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Same sky background without watermark
  const grad = ctx.createLinearGradient(0, 0, 0, 800);
  grad.addColorStop(0, '#0284c7');
  grad.addColorStop(0.3, '#38bdf8');
  grad.addColorStop(0.5, '#e0f2fe');
  grad.addColorStop(0.65, '#1e3a8a');
  grad.addColorStop(0.8, '#0f766e');
  grad.addColorStop(1, '#064e3b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 800);

  // Mountain ridges
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(0, 550);
  ctx.lineTo(150, 420);
  ctx.lineTo(300, 520);
  ctx.lineTo(450, 380);
  ctx.lineTo(600, 490);
  ctx.lineTo(600, 800);
  ctx.lineTo(0, 800);
  ctx.fill();

  // Snow caps
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(150, 420);
  ctx.lineTo(120, 460);
  ctx.lineTo(180, 460);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(450, 380);
  ctx.lineTo(410, 430);
  ctx.lineTo(490, 430);
  ctx.fill();

  // Fluffy clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(80 + i * 90, 240 + Math.sin(i) * 30, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/png');
}

// Generate Watch with watermark
function createWatchWatermarkImage(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Minimal gray background
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 700, 500);

  // Watch Strap
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(200, 100, 300, 70);
  ctx.fillRect(200, 330, 300, 70);

  // Watch Dial
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(350, 250, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 12;
  ctx.stroke();

  // Hands
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(350, 250);
  ctx.lineTo(350, 190);
  ctx.moveTo(350, 250);
  ctx.lineTo(390, 270);
  ctx.stroke();

  // Watermark text stamp across the top right
  ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
  ctx.fillRect(470, 40, 180, 45);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('SAMPLE LOGO', 500, 68);

  return canvas.toDataURL('image/png');
}

function createCleanWatchImage(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 700, 500);

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(200, 100, 300, 70);
  ctx.fillRect(200, 330, 300, 70);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(350, 250, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 12;
  ctx.stroke();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(350, 250);
  ctx.lineTo(350, 190);
  ctx.moveTo(350, 250);
  ctx.lineTo(390, 270);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

// Pre-computed sample items with 100% verified Before and After visual difference
export const SAMPLE_IMAGES: SampleItem[] = [
  {
    id: 'sample-aerial-proof',
    title: 'Aerial Mountain Clouds with PROOF Watermark',
    category: 'text',
    originalUrl: typeof document !== 'undefined' ? createProofWatermarkImage() : '',
    cleanUrl: typeof document !== 'undefined' ? createCleanMountainImage() : '',
    description: 'Erase repeating translucent diagonal "PROOF" watermark lines across sky & mountains.',
    watermarkMask: { x: 10, y: 15, width: 80, height: 70 }
  },
  {
    id: 'sample-watch',
    title: 'Minimalist Luxury Watch Product Catalog',
    category: 'watermark',
    originalUrl: typeof document !== 'undefined' ? createWatchWatermarkImage() : '',
    cleanUrl: typeof document !== 'undefined' ? createCleanWatchImage() : '',
    description: 'Clean up copyright brand text without blurring the watch face or strap details.',
    watermarkMask: { x: 65, y: 8, width: 28, height: 12 }
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
