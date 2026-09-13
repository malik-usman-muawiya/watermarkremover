export const SITE_CONFIG = {
  name: 'Watermark AI Remover',
  shortName: 'WatermarkAI',
  description: 'Free AI Watermark & Object Remover. Remove watermarks, logos, timestamps, text, and unwanted objects from images and videos with pixel-exact AI inpainting.',
  url: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) || 'https://watermarkairemover.com',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/WatermarkAIRemover',
    github: 'https://github.com/cleanmark-ai'
  },
  supportEmail: 'support@watermarkairemover.com',
  author: 'Watermark AI Media Labs',
  limits: {
    maxImageSizeMB: 25,
    maxImageDimension: 5000,
    maxVideoSizeMB: 100,
    supportedImageFormats: ['PNG', 'JPEG', 'JPG', 'WebP'],
    supportedVideoFormats: ['MP4', 'MOV', 'WebM']
  }
};
