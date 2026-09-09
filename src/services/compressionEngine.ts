/**
 * High-Performance Client-Side Image Compression & Resolution Reducer Engine
 * Supports JPEG, PNG, WebP, GIF format conversions and exact-KB target binary search.
 */

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  dimensions: {
    width: number;
    height: number;
  };
  originalDimensions: {
    width: number;
    height: number;
  };
}

export interface CompressOptions {
  targetKB?: number;
  quality?: number; // 0.01 to 1.0
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  maxWidth?: number;
  maxHeight?: number;
  scalePercent?: number;
}

/**
 * Loads an image from a File, Blob, or URL into an HTMLImageElement
 */
export function loadImage(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image for compression: ' + err));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}

/**
 * Helper to convert canvas to blob with specific quality
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas to blob conversion failed'));
      },
      format,
      quality
    );
  });
}

/**
 * Compresses an image with smart iterative binary search to hit an exact Target KB
 */
export async function compressImageToTargetKB(
  source: File | Blob | string,
  targetKB: number,
  options: CompressOptions = {}
): Promise<CompressionResult> {
  const img = await loadImage(source);
  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  let origSize = 0;
  if (source instanceof File || source instanceof Blob) {
    origSize = source.size;
  } else {
    // Estimate size from dataUrl or 500KB default
    origSize = Math.round(source.length * 0.75) || 500000;
  }

  const format = options.format || 'image/jpeg';
  const targetBytes = targetKB * 1024;

  // Calculate target dimensions
  let curWidth = origWidth;
  let curHeight = origHeight;

  if (options.scalePercent && options.scalePercent < 100) {
    const scale = options.scalePercent / 100;
    curWidth = Math.round(origWidth * scale);
    curHeight = Math.round(origHeight * scale);
  } else if (options.maxWidth || options.maxHeight) {
    const maxW = options.maxWidth || origWidth;
    const maxH = options.maxHeight || origHeight;
    const ratio = Math.min(maxW / origWidth, maxH / origHeight, 1);
    curWidth = Math.round(origWidth * ratio);
    curHeight = Math.round(origHeight * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = curWidth;
  canvas.height = curHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Fill white background for JPEGs to prevent black alpha transparent background
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, curWidth, curHeight);
  }
  ctx.drawImage(img, 0, 0, curWidth, curHeight);

  // Binary search for quality to match target size
  let lowQuality = 0.05;
  let highQuality = 0.98;
  let bestBlob: Blob | null = null;
  let bestDiff = Infinity;

  // Maximum 7 iterations for lightning-fast sub-second execution
  for (let i = 0; i < 7; i++) {
    const midQuality = (lowQuality + highQuality) / 2;
    const blob = await canvasToBlob(canvas, format, midQuality);

    const diff = Math.abs(blob.size - targetBytes);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestBlob = blob;
    }

    if (blob.size > targetBytes) {
      highQuality = midQuality;
    } else {
      lowQuality = midQuality;
    }

    // If within 3KB tolerance, stop early
    if (diff < 3072) break;
  }

  // If still above target KB and target is very small (e.g. 20KB or 50KB), downscale dimensions
  if (bestBlob && bestBlob.size > targetBytes && targetKB <= 100) {
    const scaleFactor = Math.sqrt(targetBytes / bestBlob.size) * 0.95;
    const scaledW = Math.max(120, Math.round(curWidth * scaleFactor));
    const scaledH = Math.max(120, Math.round(curHeight * scaleFactor));

    canvas.width = scaledW;
    canvas.height = scaledH;
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, scaledW, scaledH);
    }
    ctx.drawImage(img, 0, 0, scaledW, scaledH);

    bestBlob = await canvasToBlob(canvas, format, 0.75);
    curWidth = scaledW;
    curHeight = scaledH;
  }

  const finalBlob = bestBlob || (await canvasToBlob(canvas, format, 0.8));
  const dataUrl = URL.createObjectURL(finalBlob);
  const compressedSize = finalBlob.size;
  const savedPercent = origSize > compressedSize 
    ? Math.round(((origSize - compressedSize) / origSize) * 100) 
    : 0;

  return {
    blob: finalBlob,
    dataUrl,
    originalSize: origSize,
    compressedSize,
    savedPercent,
    dimensions: {
      width: curWidth,
      height: curHeight,
    },
    originalDimensions: {
      width: origWidth,
      height: origHeight,
    },
  };
}

/**
 * Resizes an image resolution with aspect ratio lock and custom dimensions
 */
export async function resizeImageResolution(
  source: File | Blob | string,
  options: {
    width?: number;
    height?: number;
    scalePercent?: number;
    maintainAspectRatio?: boolean;
    quality?: number;
    format?: 'image/jpeg' | 'image/png' | 'image/webp';
  }
): Promise<CompressionResult> {
  const img = await loadImage(source);
  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  let targetW = origWidth;
  let targetH = origHeight;

  if (options.scalePercent) {
    const scale = options.scalePercent / 100;
    targetW = Math.round(origWidth * scale);
    targetH = Math.round(origHeight * scale);
  } else if (options.width && options.height) {
    targetW = options.width;
    targetH = options.height;
  } else if (options.width) {
    targetW = options.width;
    targetH = options.maintainAspectRatio !== false 
      ? Math.round((origHeight / origWidth) * targetW) 
      : origHeight;
  } else if (options.height) {
    targetH = options.height;
    targetW = options.maintainAspectRatio !== false 
      ? Math.round((origWidth / origHeight) * targetH) 
      : origWidth;
  }

  targetW = Math.max(1, targetW);
  targetH = Math.max(1, targetH);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  const format = options.format || 'image/jpeg';
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const quality = options.quality || 0.85;
  const blob = await canvasToBlob(canvas, format, quality);

  let origSize = 0;
  if (source instanceof File || source instanceof Blob) {
    origSize = source.size;
  } else {
    origSize = Math.round(source.length * 0.75) || 400000;
  }

  return {
    blob,
    dataUrl: URL.createObjectURL(blob),
    originalSize: origSize,
    compressedSize: blob.size,
    savedPercent: origSize > blob.size ? Math.round(((origSize - blob.size) / origSize) * 100) : 0,
    dimensions: { width: targetW, height: targetH },
    originalDimensions: { width: origWidth, height: origHeight },
  };
}

/**
 * Format bytes to readable string (e.g. 48.2 KB, 1.4 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
