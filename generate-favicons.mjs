import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const publicDir = 'C:\\Users\\ST\\.gemini\\antigravity\\scratch\\watermarkremover\\public';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1329" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="40%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#00c9a7" />
    </linearGradient>
  </defs>

  <!-- High-contrast rounded squircle base -->
  <rect x="20" y="20" width="472" height="472" rx="124" fill="url(#bgGrad)" stroke="#22d3ee" stroke-width="14" stroke-opacity="0.45" />

  <!-- Subtle inner radial glow -->
  <circle cx="256" cy="256" r="160" fill="#22d3ee" fill-opacity="0.08" />

  <!-- Lucide Wand2 Inpainting Magic Wand in exact #22d3ee -->
  <g transform="translate(106, 106) scale(12.5)" stroke="url(#cyanGrad)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" fill="#22d3ee" fill-opacity="0.22" />
    <path d="m14 7 3 3" />
    <path d="M5 6v4" />
    <path d="M19 14v4" />
    <path d="M10 2v2" />
    <path d="M7 8H3" />
    <path d="M21 16h-4" />
    <path d="M11 3H9" />
  </g>
</svg>`;

// Write favicon.svg
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
console.log('Saved favicon.svg');

// Create HTML template to capture with Chrome
const htmlTemplate = (size) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: transparent; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; overflow: hidden; }
  svg { width: ${size}px; height: ${size}px; display: block; }
</style>
</head>
<body>
${svgContent}
</body>
</html>`;

const tempHtmlPath = path.join(publicDir, 'temp_icon.html');

// Sizes to generate
const sizes = [
  { name: 'favicon-512x512.png', size: 512 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'favicon-48x48.png', size: 48 }, // Google Search primary target!
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 }
];

for (const { name, size } of sizes) {
  fs.writeFileSync(tempHtmlPath, htmlTemplate(size), 'utf8');
  const outPath = path.join(publicDir, name);
  const cmd = `"${chromePath}" --headless --disable-gpu --default-background-color=00000000 --force-device-scale-factor=1 --window-size=${size},${size} --screenshot="${outPath}" "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;
  execSync(cmd);
  console.log(`Generated ${name} (${size}x${size})`);
}

// Clean up temp html
fs.unlinkSync(tempHtmlPath);
console.log('Done generating PNGs');
