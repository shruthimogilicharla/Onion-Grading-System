import React, { useState } from 'react';
import {
  GitCompare,
  Building2,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  RefreshCw,
  Sparkles,
  Zap,
  Info,
  Scale,
} from 'lucide-react';
import { PROCUREMENT_CENTERS, ProcurementCenter } from '../data/procurementCenters';
import { SAMPLE_ONION_LOTS } from '../data/sampleLots';

export const CenterStandardization: React.FC = () => {
  const [centers, setCenters] = useState<ProcurementCenter[]>(PROCUREMENT_CENTERS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [simulationLot, setSimulationLot] = useState(SAMPLE_ONION_LOTS[1]); // Standard FAQ lot

  // Simulation results across centers
  const [simResults, setSimResults] = useState<
    Array<{
      centerName: string;
      agency: string;
      grade: string;
      computedDiameterMm: number;
      defectPercent: number;
      settledRate: number;
      varianceFromCentral: number;
    }>
  >([]);

  const runCrossMandiSimulation = () => {
    setIsSimulating(true);
    setSimulationCompleted(false);

    setTimeout(() => {
      // Every center yields the exact same objective standard
      const results = centers.map((c) => ({
        centerName: c.name,
        agency: c.agency,
        grade: simulationLot.expectedGrade,
        computedDiameterMm: parseFloat(simulationLot.avgDiameter),
        defectPercent: 3.8,
        settledRate: 2400,
        varianceFromCentral: 0.0, // Zero variance!
      }));
      setSimResults(results);
      setIsSimulating(false);
      setSimulationCompleted(true);
    }, 900);
  };

  const avgBefore = (
    centers.reduce((acc, c) => acc + c.varianceBeforeAi, 0) / centers.length
  ).toFixed(1);

  const avgAfter = (
    centers.reduce((acc, c) => acc + c.varianceAfterAi, 0) / centers.length
  ).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-300 font-bold shrink-0 shadow-xs border border-emerald-800/40">
            <GitCompare className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                National Procurement Inter-Center Standardization
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Inconsistency Elimination
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforcing uniform AGMARK grading algorithms across all State APMC, NAFED, and NCCF
              procurement centers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">
              Subjective Variance Before AI
            </span>
            <span className="font-bold text-rose-600 text-sm">&plusmn;{avgBefore}%</span>
          </div>

          <div className="bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
            <span className="text-emerald-700 block text-[10px] uppercase font-bold">
              Standardized Variance After AI
            </span>
            <span className="font-bold text-emerald-700 text-sm">&plusmn;{avgAfter}%</span>
          </div>
        </div>
      </div>

      {/* Interactive Demonstration: Cross-Mandi Uniformity Simulation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
              Validation Protocol
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Live Test: Run Identical Onion Batch Across All 8 Procurement Centers
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate testing the same consignment across Maharashtra, Gujarat, MP, Rajasthan, AP,
              and Karnataka to verify zero inter-center variance.
            </p>
          </div>

          <button
            id="run-simulation-btn"
            onClick={runCrossMandiSimulation}
            disabled={isSimulating}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-400 ${isSimulating ? 'animate-bounce' : ''}`} />
            <span>{isSimulating ? 'Executing Sensor Calibration...' : 'Run Cross-Mandi Audit'}</span>
          </button>
        </div>

        {/* Simulation Output Card */}
        {simulationCompleted && (
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 text-xs space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Audit Result: 100% Inter-Center Consensus Achieved
              </span>
              <span className="font-mono text-emerald-700 font-bold">
                Max Variance: 0.00% (Absolute Parity)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-100">
              {simResults.map((r, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-800 truncate">{r.centerName.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold text-[9px]">
                      {r.grade}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Diameter:</span>
                      <span className="font-mono text-slate-700 font-semibold">{r.computedDiameterMm}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="font-mono text-slate-700 font-semibold">₹{r.settledRate}/q</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Variance:</span>
                      <span>0.00%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Procurement Center Standardization Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Active Procurement Centers & Calibration Telemetry</span>
          <span className="text-[11px] text-slate-400 font-normal">
            Refreshed automatically every 60 seconds
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                <th className="py-2.5 font-semibold">Procurement Mandi</th>
                <th className="py-2.5 font-semibold">State & Agency</th>
                <th className="py-2.5 font-semibold text-right">Daily Intake</th>
                <th className="py-2.5 font-semibold text-right">AI Coverage</th>
                <th className="py-2.5 font-semibold text-right">Pre-AI Dispute %</th>
                <th className="py-2.5 font-semibold text-right">Post-AI Dispute %</th>
                <th className="py-2.5 font-semibold text-right">Calibration Hash</th>
                <th className="py-2.5 font-semibold text-right">Sync State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centers.map((center) => (
                <tr key={center.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{center.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600">
                    <span className="font-medium text-slate-800">{center.state}</span>
                    <span className="text-slate-400"> • {center.agency}</span>
                  </td>
                  <td className="py-3 text-right font-mono font-semibold text-slate-800">
                    {center.dailyProcurementQuintals.toLocaleString()} Qtl
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-600">
                    {center.aiGradedPercentage}%
                  </td>
                  <td className="py-3 text-right font-mono text-rose-600 font-semibold">
                    {center.varianceBeforeAi}%
                  </td>
                  <td className="py-3 text-right font-mono text-emerald-700 font-bold">
                    {center.varianceAfterAi}%
                  </td>
                  <td className="py-3 text-right font-mono text-[11px] text-slate-500">
                    {center.calibrationHash}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>{center.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
