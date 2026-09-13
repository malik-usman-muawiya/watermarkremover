import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Code2, 
  Key, 
  Copy, 
  Check, 
  Terminal, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const ApiDocsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'node'>('python');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const apiKey = user?.apiKey || 'wm_live_894f2910ba749320e8';

  const codeSnippets = {
    python: `import requests

API_KEY = "${apiKey}"
API_URL = "https://api.watermarkai.com/v1/image/process"

# Upload source image and mask for inpainting
files = {
    'image': open('watermarked_photo.jpg', 'rb'),
    'mask': open('mask_overlay.png', 'rb')
}

headers = {
    'Authorization': f'Bearer {API_KEY}'
}

response = requests.post(API_URL, headers=headers, files=files)
job = response.json()

print(f"Inpainting Job Created: {job['job_id']}")
print(f"Download Clean URL: {job['result_url']}")`,

    node: `import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

const form = new FormData();
form.append('image', fs.createReadStream('watermarked_photo.jpg'));
form.append('mask', fs.createReadStream('mask_overlay.png'));

const response = await fetch('https://api.watermarkai.com/v1/image/process', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    ...form.getHeaders()
  },
  body: form
});

const data = await response.json();
console.log('Processed Result:', data.result_url);`,

    curl: `curl -X POST https://api.watermarkai.com/v1/image/process \\
  -H "Authorization: Bearer ${apiKey}" \\
  -F "image=@watermarked_photo.jpg" \\
  -F "mask=@mask_overlay.png"`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEO
        title="Developer API Documentation — Watermark AI Remover"
        description="Integrate AI watermark removal and inpainting into your workflow. Complete REST API endpoints, cURL, Python, and Node.js examples."
        canonicalPath="/api-docs"
      />

      
      {/* Header Banner */}
      <div className="relative p-8 sm:p-10 bg-[#121216] border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Glow effect */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer REST API v1.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Watermark AI Remover <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">API & SDK</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Integrate automated AI watermark & object inpainting directly into your application, media pipeline, or e-commerce workflow with our high-concurrency neural REST API.
          </p>

          {/* API Key Box */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#18181c] border border-white/15 rounded-2xl font-mono text-xs text-amber-400 font-bold shadow-inner">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Your Key: {apiKey}</span>
              <button 
                onClick={handleCopyKey}
                className="ml-2 text-slate-400 hover:text-white cursor-pointer transition-colors p-1"
                title="Copy API Key"
                aria-label="Copy API key"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-xs text-slate-400">
              Pass in header: <code className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-200 font-mono">Authorization: Bearer {'<token>'}</code>
            </span>
          </div>
        </div>
      </div>

      {/* Code Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Code Snippet */}
        <div className="bg-[#121216] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#18181c] border-b border-white/10">
            <div className="flex items-center gap-2">
              {(['python', 'node', 'curl'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
                    selectedLang === lang 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-400 px-3 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed bg-[#0b0b0e]">
            {codeSnippets[selectedLang]}
          </pre>
        </div>

        {/* Right: API Response & Schema */}
        <div className="space-y-6">
          <div className="p-6 bg-[#121216] border border-white/10 rounded-3xl shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Example 200 OK Response</span>
            </h2>

            <pre className="p-4 bg-[#0b0b0e] rounded-2xl border border-white/10 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`{
  "status": "completed",
  "job_id": "job_inp_84920194",
  "result_url": "https://storage.watermarkai.com/outputs/clean_photo_8492.png",
  "processing_time_ms": 780,
  "resolution": "4096x2160",
  "confidence_score": 0.998,
  "credits_remaining": "unlimited_launch"
}`}
            </pre>
          </div>

          <div className="p-6 bg-[#121216] border border-white/10 rounded-3xl shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Rate Limits & Concurrency</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard accounts support up to <strong className="text-amber-400 font-bold">120 requests / min</strong>. Enterprise accounts support private GPU clusters scaling to over <strong className="text-amber-400 font-bold">2,500 requests / min</strong> with dedicated SLAs.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>99.99% Uptime with automated fallback failover</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
