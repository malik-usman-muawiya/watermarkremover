/**
 * High-Security File & MIME Validation with Magic-Byte Inspection
 * SEC-001, UX-003, CONTENT-003
 */

export interface ValidationSuccess {
  valid: true;
  file: File;
  extension: string;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface ValidationFailure {
  valid: false;
  fileName: string;
  errorCode: 'INVALID_EXTENSION' | 'INVALID_MIME' | 'INVALID_MAGIC_BYTES' | 'FILE_TOO_LARGE' | 'DIMENSIONS_EXCEEDED' | 'CORRUPT_FILE';
  errorMessage: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_DIMENSION_PX = 5000;
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

/**
 * Validates magic bytes against known signatures:
 * - PNG:  89 50 4E 47
 * - JPEG: FF D8 FF
 * - WebP: 52 49 46 46 ... 57 45 42 50 (RIFF....WEBP)
 */
async function checkMagicBytes(file: File): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      return true;
    }

    // JPEG signature: FF D8 FF
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      return true;
    }

    // WebP signature: "RIFF" at 0..3 and "WEBP" at 8..11
    if (
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Inspects dimensions and decodability of the image
 */
function verifyImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      URL.revokeObjectURL(objectUrl);
      resolve({ width: w, height: h });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Corrupt or undecodable image file.'));
    };
    img.src = objectUrl;
  });
}

/**
 * Sanitizes a download filename to prevent path traversal or unsafe characters
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 100);
}

/**
 * Main validation function for uploaded images
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  const ext = (file.name.split('.').pop() || '').toLowerCase();

  // 1. Extension check
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      fileName: file.name,
      errorCode: 'INVALID_EXTENSION',
      errorMessage: `".${ext}" is not supported. Please upload a PNG, JPG, JPEG, or WebP image.`
    };
  }

  // 2. MIME check
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()) && file.type !== '') {
    return {
      valid: false,
      fileName: file.name,
      errorCode: 'INVALID_MIME',
      errorMessage: `Invalid file format (${file.type || 'unknown'}). Supported formats: PNG, JPG, WebP.`
    };
  }

  // 3. File size check
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      fileName: file.name,
      errorCode: 'FILE_TOO_LARGE',
      errorMessage: `File size (${sizeMb} MB) exceeds maximum allowed limit of 25 MB.`
    };
  }

  // 4. Magic-byte inspection
  const hasValidSignature = await checkMagicBytes(file);
  if (!hasValidSignature) {
    return {
      valid: false,
      fileName: file.name,
      errorCode: 'INVALID_MAGIC_BYTES',
      errorMessage: 'File content signature does not match a valid image. The file may be corrupted or disguised.'
    };
  }

  // 5. Dimensions and decodability verification
  try {
    const { width, height } = await verifyImageDimensions(file);
    if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
      return {
        valid: false,
        fileName: file.name,
        errorCode: 'DIMENSIONS_EXCEEDED',
        errorMessage: `Image resolution (${width}x${height}px) exceeds the maximum limit of 5000x5000px.`
      };
    }

    return {
      valid: true,
      file,
      extension: ext,
      mimeType: file.type || 'image/' + ext,
      width,
      height
    };
  } catch (err: any) {
    return {
      valid: false,
      fileName: file.name,
      errorCode: 'CORRUPT_FILE',
      errorMessage: err.message || 'Image appears to be corrupted and cannot be rendered.'
    };
  }
}
