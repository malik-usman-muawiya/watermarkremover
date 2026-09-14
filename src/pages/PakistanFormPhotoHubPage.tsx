import React, { useState, useRef } from 'react';
import { compressImageToTargetKB, formatBytes, type CompressionResult } from '../services/compressionEngine';
import { SEO } from '../components/common/SEO';
import { 
  UploadCloud, 
  Download, 
  Clock, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';

interface PortalSpec {
  authority: string;
  category: 'Testing' | 'Civil Service' | 'Government' | 'University';
  maxKB: number;
  format: string;
  dimensions: string;
  bgRequirement: string;
  lastVerified: string;
  notes: string;
}

const PAKISTAN_PORTALS: PortalSpec[] = [
  {
    authority: 'NTS (National Testing Service)',
    category: 'Testing',
    maxKB: 50,
    format: 'JPG / JPEG',
    dimensions: 'Passport Size (350x450 px)',
    bgRequirement: 'White or Blue background',
    lastVerified: 'September 2026',
    notes: 'Required for NAT, GAT, and departmental job test registrations.'
  },
  {
    authority: 'FPSC / CSS Examination',
    category: 'Civil Service',
    maxKB: 30,
    format: 'JPG',
    dimensions: '140 x 180 px',
    bgRequirement: 'Plain blue background preferred',
    lastVerified: 'September 2026',
    notes: 'Strict 30KB cap for CSS Competitive Exam online profile submission.'
  },
  {
    authority: 'PPSC (Punjab Public Service Commission)',
    category: 'Civil Service',
    maxKB: 25,
    format: 'JPG / JPEG',
    dimensions: 'Passport size (Max 500x500 px)',
    bgRequirement: 'Clear facial view, light background',
    lastVerified: 'September 2026',
    notes: 'Uploads above 25KB are automatically rejected by the PPSC portal.'
  },
  {
    authority: 'NADRA e-Services / Pak-ID Portal',
    category: 'Government',
    maxKB: 350,
    format: 'JPEG / PNG',
    dimensions: '45 x 35 mm (600x600 px minimum)',
    bgRequirement: 'Plain white background only',
    lastVerified: 'September 2026',
    notes: 'For CNIC, NICOP, and Smart Card online renewals.'
  },
  {
    authority: 'Directorate General of Immigration & Passports',
    category: 'Government',
    maxKB: 50,
    format: 'JPG',
    dimensions: '2 x 2 inches / 600x600 px',
    bgRequirement: 'White background, neutral expression',
    lastVerified: 'September 2026',
    notes: 'Online Machine Readable Passport renewal photo specifications.'
  },
  {
    authority: 'NUST / FAST / LUMS University Admissions',
    category: 'University',
    maxKB: 50,
    format: 'JPG / PNG',
    dimensions: 'Passport size',
    bgRequirement: 'Blue or white background',
    lastVerified: 'September 2026',
    notes: 'Undergraduate and postgraduate online admission application portals.'
  },
  {
    authority: 'SPSC & KPPSC Commissions',
    category: 'Civil Service',
    maxKB: 50,
    format: 'JPG',
    dimensions: 'Passport size',
    bgRequirement: 'Clean passport portrait',
    lastVerified: 'September 2026',
    notes: 'Provincial recruitment portal application forms.'
  }
];

export const PakistanFormPhotoHubPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPortal, setSelectedPortal] = useState<PortalSpec>(PAKISTAN_PORTALS[0]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCompressForPortal = async (file: File, portal: PortalSpec) => {
    setIsCompressing(true);
    setSelectedPortal(portal);
    try {
      const res = await compressImageToTargetKB(file, portal.maxKB - 2, {
        format: 'image/jpeg',
      });
      setResult(res);
    } catch (err) {
      console.error('Portal compress error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.dataUrl;
    link.download = `${selectedPortal.authority.split(' ')[0]}_form_photo_${selectedPortal.maxKB}kb.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open synchronously (not inside setTimeout) so browsers still treat
    // this as part of the user's click and don't block the popup.
    window.open('https://www.ranknexai.com/team', '_blank');
  };

  const faqs = [
    {
      q: 'Why does PPSC/FPSC reject photos even when they are under 50KB?',
      a: 'PPSC has a strict 25KB ceiling, while FPSC often enforces a 30KB limit and specific 140x180 px aspect ratio. Our presets compress your photo to ~23KB in JPG format to guarantee acceptance.'
    },
    {
      q: 'What is the standard photo size for NTS job applications?',
      a: 'NTS permits photos up to 50KB in JPG format with either a blue or white background. Uploading a 40-48KB photo is ideal to avoid timeout errors.'
    },
    {
      q: 'Can I compress my CNIC scan or signature for online job forms?',
      a: 'Yes, select the 20KB or 50KB target preset to reduce signature photos and CNIC front/back copies while preserving crystal-clear readability.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEO
        title="Pakistan Job & Form Photo Size Reducer — CNIC, NTS, PPSC"
        description="Resize and compress photos to the exact KB size required for Pakistani job forms, CNIC, NTS, PPSC, and FPSC applications — free online tool."
        canonicalPath="/pakistan-job-form-photo-size"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleCompressForPortal(e.target.files[0], selectedPortal)}
      />

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <span>🇵🇰</span>
            <span>Pakistan Application Form Photo Size Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Photo Size for NTS, CSS, PMS & NADRA Forms
          </h1>

          <p className="text-sm sm:text-base text-slate-400">
            Instant 1-click photo size compressor for Pakistani competitive exams, job portals, NADRA CNIC, and university admissions.
          </p>
        </div>

        {/* Quick 1-Click Compressor Tool */}
        <div className="p-8 bg-[#0D1527] border border-teal-500/20 rounded-3xl shadow-2xl space-y-6 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Step 1: Choose Your Target Application Portal
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PAKISTAN_PORTALS.slice(0, 5).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPortal(p)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPortal.authority === p.authority
                      ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                      : 'bg-[#111A2E] text-slate-300 hover:text-white border border-teal-500/10'
                  }`}
                >
                  {p.authority.split('(')[0]} ({p.maxKB}KB)
                </button>
              ))}
            </div>
          </div>

          {result ? (
            <div className="p-6 bg-[#111A2E] rounded-2xl border border-teal-500/30 flex flex-wrap items-center justify-between gap-6 animate-in fade-in">
              <div className="flex items-center gap-4 text-left">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                  <img src={result.dataUrl} alt="Form Photo" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-sm text-white">{selectedPortal.authority} Ready</span>
                  <div className="text-xs text-teal-400 font-bold">
                    Compressed to {formatBytes(result.compressedSize)} (Max: {selectedPortal.maxKB}KB)
                  </div>
                  <div className="text-[11px] text-slate-400">{selectedPortal.dimensions}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download Form-Ready Photo</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 bg-[#0D1527] text-slate-300 border border-teal-500/20 text-xs font-bold rounded-xl"
                >
                  Upload Another
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="px-9 py-4 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 hover:opacity-95 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2.5 mx-auto active:scale-[0.98] cursor-pointer"
              >
                <UploadCloud className="w-5 h-5" />
                <span>{isCompressing ? 'Formatting photo...' : `Upload Photo for ${selectedPortal.authority.split('(')[0]}`}</span>
              </button>
              <p className="text-xs text-slate-400 font-medium">
                Auto-resizes to under <strong>{selectedPortal.maxKB}KB</strong> with correct passport dimensions
              </p>
            </div>
          )}
        </div>

        {/* Complete Portal Specifications Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">
              Official Pakistani Portals Photo Requirement Guide
            </h2>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Updated for 2026 Sessions
            </span>
          </div>

          <div className="bg-[#0D1527] border border-teal-500/20 rounded-2xl overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs text-slate-300 divide-y divide-teal-500/10">
              <thead className="bg-[#111A2E] text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Authority / Portal</th>
                  <th className="p-4">Max Size (KB)</th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4">Background</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-500/5 font-medium">
                {PAKISTAN_PORTALS.map((portal, i) => (
                  <tr key={i} className="hover:bg-[#111A2E]/50 transition-colors">
                    <td className="p-4">
                      <strong className="text-white block font-bold">{portal.authority}</strong>
                      <span className="text-[11px] text-slate-500">{portal.notes}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-teal-500/15 text-teal-400 border border-teal-500/30 rounded-lg font-black">
                        &le; {portal.maxKB} KB
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-300">{portal.dimensions}</td>
                    <td className="p-4 text-slate-400">{portal.bgRequirement}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedPortal(portal);
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 bg-teal-500/15 hover:bg-teal-500 text-teal-400 hover:text-slate-950 border border-teal-500/30 font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Compress Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Notice */}
        <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-start gap-3 text-xs text-teal-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            <strong>Important note:</strong> Examination authorities periodically update upload criteria. Always double check your specific advertisement slip before final fee submission.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-white text-center">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0D1527] border border-teal-500/20 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 text-left text-xs font-bold text-slate-200 flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 ${openFaq === i ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-xs text-slate-400 border-t border-white/5 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
