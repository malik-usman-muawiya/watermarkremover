# CleanMark AI — AI Watermark & Object Remover SaaS

A professional, full-stack AI media inpainting platform built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **HTML5 Canvas**.

---

## ✨ Features Included

### 1. 🎨 Interactive Image Watermark & Object Inpainter (`/editor/image`)
- **Canvas-based Brush Tool**: Dynamic sizing (5px–100px), anti-aliased soft brush masking.
- **Bounding Box Selector**: Drag & drop rectangular selection for stamps and subtitles.
- **Eraser Tool**: Destination-out mask refinement.
- **Zoom & Pan**: Full zoom control (20% to 400%) and hand/pan viewports.
- **Undo / Redo Stack**: Step-by-step history snapshots.
- **Before / After Split Slider**: Interactive curtain slider with lossless HD download.
- **Client-side Inpainting Diffusion**: Real-time browser-based edge-aware patch synthesis + API bridge.

### 2. 🎬 Video Watermark Remover (`/editor/video`)
- Video upload & scrubber with timestamp range active indicator.
- Draggable / resizable watermark region overlays.
- Multi-stage background queue simulation (Probing -> FFmpeg frame extraction -> Optical flow AI inpainting -> Audio remux -> H.264 encode).
- Download cleaned MP4 output.

### 3. 📦 High-Throughput Batch Processing (`/editor/batch`)
- Bulk image drag & drop (up to 50 photos).
- Staggered background queue processing.
- One-click ZIP download.

### 4. 📊 User Dashboard & Storage Retention (`/dashboard`)
- Real-time credit counter and usage stats.
- **24-Hour Privacy Guarantee**: Automatic expiration countdown with instant manual purge.
- History table with search, filter (Image, Video, Object), and direct download.
- REST API token generator & regeneration.

### 5. 💎 Credits & SaaS Subscriptions (`/pricing`)
- Free Tier (5 credits), Pro Creator (\$19/mo, 200 credits, 4K, video), Enterprise (\$49/mo, 1000 credits, API).
- Monthly and annual billing toggles with feature comparison matrix.
- Pay-as-you-go credit pack top-up modal.

### 6. ⚡ Developer REST API Docs (`/api-docs`)
- Interactive cURL, Python (Requests), and Node.js SDK snippets.
- Real-time response preview and schema reference.

### 7. 🛡️ Admin & Cluster Telemetry (`/admin`)
- System metrics (revenue, users, 24h job count).
- GPU worker node monitoring (NVIDIA A100 / L4 / FFmpeg CPU nodes).
- Subscriber management table.

### 8. 🔍 SEO & Legal Suite (`/seo/:slug` & `/legal`)
- Tailored SEO landing pages: `/seo/image-watermark-remover`, `/seo/video-watermark-remover`, `/seo/remove-logo-from-image`, `/seo/remove-text-from-image`, `/seo/ai-object-remover`.
- Comprehensive Terms of Service, Privacy Policy, Acceptable Use Policy, and DMCA notice.

---

## 🚀 Quick Start

### 1. Navigate to project directory
```bash
cd C:\Users\ST\.gemini\antigravity\scratch\cleanmark-ai
```

### 2. Start development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

---

## 🔌 Connecting to Backend (FastAPI / PyTorch)
The application is pre-configured to communicate with standard FastAPI endpoints:
- `POST /api/image/process`
- `POST /api/video/process`
- `GET /api/job/{id}`
- `DELETE /api/job/{id}`

See `src/services/inpaintingEngine.ts` and `src/services/api.ts` for integration hooks.
