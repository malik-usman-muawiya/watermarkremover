import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Code2, 
  Key, 
  Copy, 
  Check, 
  Terminal, 
  Gift
} from 'lucide-react';

export const ApiDocsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'node'>('python');
  const [copiedCode, setCopiedCode] = useState(false);

  const apiKey = user?.apiKey || 'cmk_live_xxxxxxxxxxxxxxxxxxxx';

  const codeSnippets = {
    python: `import requests

API_KEY = "${apiKey}"
API_URL = "https://api.cleanmark.ai/v1/image/process"

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

const response = await fetch('https://api.cleanmark.ai/v1/image/process', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    ...form.getHeaders()
  },
  body: form
});

const data = await response.json();
console.log('Processed Result:', data.result_url);`,

    curl: `curl -X POST https://api.cleanmark.ai/v1/image/process \\
  -H "Authorization: Bearer ${apiKey}" \\
  -F "image=@watermarked_photo.jpg" \\
  -F "mask=@mask_overlay.png"`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-brand-600 text-xs font-bold border border-teal-200">
          <Code2 className="w-3.5 h-3.5" />
          <span>Developer REST API v1.0</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          CleanMark AI API Reference & SDK
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Integrate automated AI watermark & object inpainting directly into your application, media pipeline, or e-commerce workflow with our scalable REST API.
        </p>

        {/* API Key Box */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-brand-700 font-bold">
            <Key className="w-4 h-4 text-slate-400" />
            <span>Your Key: {apiKey}</span>
          </div>
          <span className="text-xs text-slate-500">Pass in the <code>Authorization: Bearer</code> header</span>
        </div>
      </div>

      {/* Code Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Code Snippet */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/80 border-b border-slate-700">
            <div className="flex items-center gap-1.5">
              {(['python', 'node', 'curl'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                    selectedLang === lang ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed bg-slate-950">
            {codeSnippets[selectedLang]}
          </pre>
        </div>

        {/* Right: API Response & Schema */}
        <div className="space-y-4">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              Example 200 OK Response
            </h4>

            <pre className="p-4 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
{`{
  "status": "completed",
  "job_id": "job_inp_84920194",
  "result_url": "https://storage.cleanmark.ai/outputs/clean_photo_8492.png",
  "processing_time_ms": 1140,
  "credits_remaining": "unlimited_launch",
  "expires_at": "2026-09-02T13:10:00Z"
}`}
            </pre>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Rate Limits & Concurrency</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard plans allow <strong>60 requests / minute</strong>. Enterprise plans support dedicated GPU worker pools up to <strong>1,000 req/min</strong>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
