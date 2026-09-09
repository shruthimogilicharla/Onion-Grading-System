import React, { useState } from 'react';
import {
  X,
  Trophy,
  Award,
  Sparkles,
  Layers,
  Scale,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Cpu,
  Zap,
} from 'lucide-react';

interface HackathonPitchModalProps {
  onClose: () => void;
  onLaunchDemoScenario: (scenarioKey: 'single_bulb' | 'batch_tray' | 'sprouted_lot' | 'rejected_mold') => void;
  onNavigateTab: (tab: 'terminal' | 'disputes' | 'calibration' | 'registry') => void;
}

export const HackathonPitchModal: React.FC<HackathonPitchModalProps> = ({
  onClose,
  onLaunchDemoScenario,
  onNavigateTab,
}) => {
  const [activePitchSection, setActivePitchSection] = useState<'overview' | 'scenarios' | 'architecture' | 'impact'>('overview');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Ministry & Hackathon Badge */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-5 sm:p-6 border-b border-rose-900/50 relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold border border-emerald-400/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  National Quality Assurance Standard • AGMARK Rules 2004
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/15">
                  Ministry of Consumer Affairs, Food & Public Distribution
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Onion AI — Automated Quality Assessment & Grading System
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Computer Vision, AGMARK Rules 2004 compliance, and transparent farmer settlement for Central Buffer Stock Procurement (NAFED & NCCF).
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-t border-white/10 pt-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActivePitchSection('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePitchSection === 'overview'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Executive Summary & Problem
            </button>
            <button
              onClick={() => setActivePitchSection('scenarios')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activePitchSection === 'scenarios'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Standard Verification Scenarios
            </button>
            <button
              onClick={() => setActivePitchSection('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePitchSection === 'architecture'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Technical Architecture & Standards
            </button>
            <button
              onClick={() => setActivePitchSection('impact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePitchSection === 'impact'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Socio-Economic & Mandi Impact
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* SECTION 1: OVERVIEW & PROBLEM STATEMENT */}
          {activePitchSection === 'overview' && (
            <div className="space-y-6">
              {/* Problem vs Solution Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4.5">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm mb-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>The Mandi Challenge (Problem Statement)</span>
                  </div>
                  <ul className="text-xs text-rose-950 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-600">•</span>
                      <span><strong>Subjective Manual Grading:</strong> APMC auctioneers visually inspect onion lots in 3–5 seconds, leading to severe grading errors and farmer dissatisfaction.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-600">•</span>
                      <span><strong>Inter-Center Price Arbitrage:</strong> The same lot graded in Lasalgaon often receives a different grade in Pimpalgaon or Yeola due to lack of standardization.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-600">•</span>
                      <span><strong>Post-Harvest Spoilage:</strong> Storing lots with latent mold (<em>Aspergillus niger</em>) or soft rot destroys entire central buffer stock warehouses.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4.5">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Our Solution (Onion AI)</span>
                  </div>
                  <ul className="text-xs text-emerald-950 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-600">•</span>
                      <span><strong>Sub-Second Computer Vision:</strong> Automatic detection of bulb count, equatorial diameter (mm), sprouting, mold, mechanical cuts, and neck thickness.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-600">•</span>
                      <span><strong>Strict AGMARK 2004 Rules:</strong> Deterministic classification into Extra Class, Grade I FAQ, Grade II, or Rejected Sub-Standard with mathematical tolerances.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-600">•</span>
                      <span><strong>Farmer Grievance & Payout:</strong> Instant MSP calculation, tamper-evident cryptographic QR certificate, and zero-paper dispute arbitration.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Key Statistics / Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Processing Time</span>
                  <span className="text-lg sm:text-xl font-black text-rose-700 font-mono">&lt; 1.5 sec</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Per inspection tray</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Inter-Center Variance</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-700 font-mono">&lt; 1.2%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Across 6 mandis</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">AGMARK Rules</span>
                  <span className="text-lg sm:text-xl font-black text-blue-700 font-mono">Gazette 2004</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">BIS IS 1619:1989</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Farmer Transparency</span>
                  <span className="text-lg sm:text-xl font-black text-amber-700 font-mono">100% Audit</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">SHA256 QR verified</span>
                </div>
              </div>

              {/* Quick Launch Call-to-Action */}
              <div className="bg-linear-to-r from-rose-900 to-slate-900 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base">Verify Automated Grading Performance</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Run standardized test consignments to inspect single bulbs, multi-tray batches, and defect detections.</p>
                </div>
                <button
                  onClick={() => setActivePitchSection('scenarios')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Zap className="w-4 h-4 text-slate-900 fill-current" />
                  <span>Explore Verification Scenarios</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: 1-CLICK DEMO SCENARIOS */}
          {activePitchSection === 'scenarios' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Click any scenario below to automatically load the photograph, trigger computer vision grading, draw accurate bounding boxes, and compute official AGMARK pricing:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Scenario 1: Single Bulb Specimen */}
                <div className="border border-slate-200 rounded-xl p-4.5 bg-white hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">Scenario 1</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">Grade Extra Class</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Single Bulb Precision Specimen</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      High-resolution inspection of an individual bulb (58mm equatorial diameter). Evaluates neck tightness (&lt;8mm), papery outer skin retention, and basal root integrity.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onLaunchDemoScenario('single_bulb');
                      onClose();
                    }}
                    className="mt-4 w-full py-2 bg-slate-900 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Run Single Bulb Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scenario 2: Multi-Bulb Batch Tray (FAQ Grade I) */}
                <div className="border border-slate-200 rounded-xl p-4.5 bg-white hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Scenario 2</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">Grade I (FAQ Compliant)</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Multi-Bulb Inspection Tray (NAFED Buffer)</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Batch of Indian red onions on a procurement tray. Demonstrates multi-object detection, size distribution histogram, and 100% MSP payout approval (₹2,400/Qtl).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onLaunchDemoScenario('batch_tray');
                      onClose();
                    }}
                    className="mt-4 w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Run Multi-Tray Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scenario 3: Sprouted Lot (Grade II) */}
                <div className="border border-slate-200 rounded-xl p-4.5 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">Scenario 3</span>
                      <span className="text-[10px] font-mono text-amber-700 font-bold">Grade II (Marginal FAQ)</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Vegetative Sprouting Defect Lot</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Identifies green shoot emergence (2.8% sprouting) and mechanical harvesting damage. Applies statutory AGMARK penalty deductions with full algorithmic explanation.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onLaunchDemoScenario('sprouted_lot');
                      onClose();
                    }}
                    className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Run Sprouted Lot Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scenario 4: Black Mold & Rot (Rejected) */}
                <div className="border border-slate-200 rounded-xl p-4.5 bg-white hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">Scenario 4</span>
                      <span className="text-[10px] font-mono text-rose-700 font-bold">Sub-Standard / Rejected</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Black Mold & Rot Lot (Dispute Flow)</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Detects severe fungal sporulation (<em>Aspergillus niger</em> &gt;12%). Triggers non-compliance rejection, protects warehouse inventory, and provides 1-click appeal to Dispute Portal.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onLaunchDemoScenario('rejected_mold');
                      onClose();
                    }}
                    className="mt-4 w-full py-2 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Run Rejection & Dispute Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: TECHNICAL ARCHITECTURE & STANDARDS */}
          {activePitchSection === 'architecture' && (
            <div className="space-y-5">
              <div className="bg-slate-900 text-slate-200 rounded-xl p-4.5 font-mono text-xs leading-relaxed border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    Onion AI System Pipeline Architecture
                  </span>
                  <span className="text-slate-500 text-[10px]">React 18 + Vite + Gemini 2.5 Vision</span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <p><span className="text-cyan-400">[1. Image Acquisition]</span> Live Camera Stream / File Upload / Clipboard (HD JPEG)</p>
                  <p><span className="text-cyan-400">[2. Optical Pre-processing]</span> Aspect calibration, letterbox prevention, contrast normalization</p>
                  <p><span className="text-cyan-400">[3. Vision Engine]</span> Gemini 2.5 Vision Multi-modal inference + Fallback Deterministic Vision Engine</p>
                  <p><span className="text-cyan-400">[4. Defect Classifier]</span> Sprout (green shoots), Mold (Aspergillus niger), Mechanical Cuts, Double Bulbs, Neck</p>
                  <p><span className="text-cyan-400">[5. AGMARK Rules 2004]</span> Strict size bracket categorization (&gt;60mm XL, 50-60mm L, 40-50mm M, 30-40mm S)</p>
                  <p><span className="text-cyan-400">[6. MSP Settlement]</span> Base ₹2,400/Qtl ± Grade deduction + Farmer Payout Sheet + QR Hash</p>
                </div>
              </div>

              {/* Regulatory Compliance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Statutory Standard</span>
                  <h5 className="font-bold text-slate-900 text-sm mt-0.5">AGMARK Rules 2004</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Grading & Marking Rules for Onions published under the Agricultural Produce (Grading & Marking) Act, 1937.
                  </p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Physical Specifications</span>
                  <h5 className="font-bold text-slate-900 text-sm mt-0.5">BIS IS 1619:1989</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Bureau of Indian Standards specifications for table onions, curing guidelines, and permissible outer scale losses.
                  </p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Procurement Body</span>
                  <h5 className="font-bold text-slate-900 text-sm mt-0.5">NAFED / NCCF Buffer</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Department of Consumer Affairs Price Stabilization Fund (PSF) buffer stock procurement criteria.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: SOCIO-ECONOMIC IMPACT */}
          {activePitchSection === 'impact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    For Indian Farmers
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>• <strong>Eliminates Trader Bias:</strong> Objective computer vision grading prevents unfair price slashing.</li>
                    <li>• <strong>Rapid Queue Clearance:</strong> Sub-second assessment prevents long mandi queues and truck demurrage charges.</li>
                    <li>• <strong>Digital Dispute Rights:</strong> Can immediately lodge formal grievance with optical photo evidence and third-party panel audit.</li>
                    <li>• <strong>Mandi Voice Readout:</strong> Audio verdict in local languages (Hindi, Marathi, English) empowers rural farmers.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    For Government & Buffer Stock
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>• <strong>Warehouse Spoilage Prevention:</strong> Eliminates lots infected with black mold, protecting ₹15,000 Cr central buffer stocks.</li>
                    <li>• <strong>Zero Inter-Center Discrepancy:</strong> Enforces calibrated grading across all mandis (Maharashtra, MP, Gujarat, Karnataka).</li>
                    <li>• <strong>Audit-Proof Procurement:</strong> Every lot is stamped with a cryptographic SHA-256 hash and printable AGMARK certificate.</li>
                  </ul>
                </div>
              </div>

              {/* Navigation shortcuts to other modules */}
              <div className="border-t border-slate-200 pt-4">
                <span className="text-xs font-bold text-slate-700 block mb-2">Explore Specialized Portals:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      onNavigateTab('disputes');
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Dispute Resolution Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </button>
                  <button
                    onClick={() => {
                      onNavigateTab('calibration');
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inter-Center Consistency Matrix</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </button>
                  <button
                    onClick={() => {
                      onNavigateTab('registry');
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Lot Registry & Cert Database</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>System Operational & Calibrated</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
