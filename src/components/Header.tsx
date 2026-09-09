import React from 'react';
import { ShieldCheck, Scale, AlertOctagon, GitCompare, FileCheck, Building2, CheckCircle2, Trophy, Sparkles, BarChart3 } from 'lucide-react';
import { PROCUREMENT_CENTERS, ProcurementCenter } from '../data/procurementCenters';

interface HeaderProps {
  activeTab: 'terminal' | 'disputes' | 'calibration' | 'registry' | 'analytics';
  onTabChange: (tab: 'terminal' | 'disputes' | 'calibration' | 'registry' | 'analytics') => void;
  selectedCenter: ProcurementCenter;
  onSelectCenter: (center: ProcurementCenter) => void;
  onOpenHackathonModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  selectedCenter,
  onSelectCenter,
  onOpenHackathonModal,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      {/* Top Ministry Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold tracking-wide border border-emerald-800/60">
              GOVERNMENT OF INDIA
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Ministry of Consumer Affairs, Food & Public Distribution
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              Department of Consumer Affairs (NAFED / NCCF Central Buffer)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-mono text-[11px] bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Automated Optical Quality Assurance
            </span>
            <span className="text-slate-400 text-[11px] hidden lg:inline">
              AGMARK Gazette 2004 v4.2 Standard
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation & Mandi Context */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & System Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-amber-700 via-rose-700 to-red-800 flex items-center justify-center text-white font-bold shadow-md shadow-rose-900/20 shrink-0">
            <Scale className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                Onion AI
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                Procurement Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized Quality Assessment & Objective Dispute Resolution
            </p>
          </div>
        </div>

        {/* Center Calibration Switcher & System Specifications Button */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-system-specs-modal"
            onClick={onOpenHackathonModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-xs transition-all cursor-pointer border border-slate-700 active:scale-95"
            title="System Specifications, Architecture & Regulatory Standards"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-300" />
            <span className="tracking-tight">System Specifications</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium leading-none">
                Active Center
              </span>
              <select
                id="procurement-center-select"
                value={selectedCenter.id}
                onChange={(e) => {
                  const c = PROCUREMENT_CENTERS.find((item) => item.id === e.target.value);
                  if (c) onSelectCenter(c);
                }}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-4"
              >
                {PROCUREMENT_CENTERS.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name} ({center.agency})
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200 text-emerald-700 font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Calibrated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100">
        <button
          id="nav-tab-terminal"
          onClick={() => onTabChange('terminal')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'terminal'
              ? 'border-rose-600 text-rose-700 bg-rose-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>AI Grading & Inspection</span>
        </button>

        <button
          id="nav-tab-disputes"
          onClick={() => onTabChange('disputes')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'disputes'
              ? 'border-rose-600 text-rose-700 bg-rose-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Dispute Resolution Portal</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
            3 Active
          </span>
        </button>

        <button
          id="nav-tab-calibration"
          onClick={() => onTabChange('calibration')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'calibration'
              ? 'border-rose-600 text-rose-700 bg-rose-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>Inter-Center Consistency</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
            0.9% Var
          </span>
        </button>

        <button
          id="nav-tab-analytics"
          onClick={() => onTabChange('analytics')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'analytics'
              ? 'border-rose-600 text-rose-700 bg-rose-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Trends</span>
        </button>

        <button
          id="nav-tab-registry"
          onClick={() => onTabChange('registry')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'registry'
              ? 'border-rose-600 text-rose-700 bg-rose-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Lot Registry & Certificates</span>
        </button>
      </div>
    </header>
  );
};
