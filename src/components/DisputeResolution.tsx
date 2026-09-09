import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Scale,
  Search,
  FileText,
  Filter,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { INITIAL_DISPUTES, DisputeRecord } from '../data/procurementCenters';
import { OnionAssessmentResult } from '../services/onionGradingEngine';

interface DisputeResolutionProps {
  prefillFromAssessment?: OnionAssessmentResult | null;
  onClearPrefill?: () => void;
}

export const DisputeResolution: React.FC<DisputeResolutionProps> = ({
  prefillFromAssessment,
  onClearPrefill,
}) => {
  const [disputes, setDisputes] = useState<DisputeRecord[]>(INITIAL_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord>(INITIAL_DISPUTES[0]);
  const [isFilingNew, setIsFilingNew] = useState<boolean>(!!prefillFromAssessment);

  // New dispute form state
  const [newLotId, setNewLotId] = useState(prefillFromAssessment?.lotId || 'LOT-MH-2026-8812');
  const [newFarmerName, setNewFarmerName] = useState(prefillFromAssessment?.farmerName || 'Balasaheb Shravan Gaikwad');
  const [newKisanId, setNewKisanId] = useState(prefillFromAssessment?.kisanId || 'MH-NSK-2026-77341');
  const [newCenter, setNewCenter] = useState(prefillFromAssessment?.procurementCenter || 'Lasalgaon APMC (Nashik)');
  const [newWeight, setNewWeight] = useState<number>(prefillFromAssessment?.lotWeightQuintals || 48.0);
  const [inspectorGrade, setInspectorGrade] = useState<'Grade Extra Class' | 'Grade I' | 'Grade II' | 'Sub-Standard / Rejected'>(
    'Grade II'
  );
  const [farmerGrade, setFarmerGrade] = useState<'Grade Extra Class' | 'Grade I' | 'Grade II'>('Grade I');
  const [disputeReason, setDisputeReason] = useState(
    'Procurement inspector manually downgraded the lot to Grade II citing neck thickness and applied ₹180/q cleaning penalty. Farmer asserts neck was field-cured for 14 days and satisfies FAQ Grade I.'
  );

  const [isAuditing, setIsAuditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Submit and run autonomous appellate audit
  const handleRunAppellateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);

    try {
      const response = await fetch('/api/resolve-dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disputeId: `DISP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          originalAssessment: prefillFromAssessment,
          inspectorSubjectiveGrade: inspectorGrade,
          farmerClaimedGrade: farmerGrade,
          disputeReason: disputeReason,
        }),
      });

      const auditData = await response.json();

      const newDisputeRecord: DisputeRecord = {
        disputeId: auditData.disputeId,
        lotId: newLotId,
        procurementCenter: newCenter,
        farmerName: newFarmerName,
        kisanId: newKisanId,
        lotWeightQuintals: newWeight,
        submissionDate: new Date().toISOString(),
        inspectorSubjectiveGrade: inspectorGrade,
        farmerClaimedGrade: farmerGrade,
        disputeReason: disputeReason,
        aiAuditedGrade: auditData.aiAuditedGrade,
        verdict: auditData.appellateVerdict,
        status: 'Resolved - Closed',
        payoutAdjustmentInr: auditData.financialImpact.totalCompensationDelta,
        explanation: auditData.explanationSummary,
        pixelEvidenceCoordinates: `Optical diameter verified at ${auditData.objectiveEvidence.measuredDiameterMm}mm. Cumulative defects: ${auditData.objectiveEvidence.measuredDefectPercent}%.`,
      };

      setDisputes([newDisputeRecord, ...disputes]);
      setSelectedDispute(newDisputeRecord);
      setIsFilingNew(false);
      if (onClearPrefill) onClearPrefill();
    } catch (err) {
      console.error('Appellate audit request error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const filteredDisputes = disputes.filter(
    (d) =>
      d.disputeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.lotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.procurementCenter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-950 flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-xs border border-amber-800/40">
            <AlertOctagon className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Autonomous Dispute Resolution & Appellate Tribunal
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Statutory Mandate
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Eliminating subjective human bias through explainable computer-vision re-audits and
              transparent compensation settlements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="file-dispute-toggle-btn"
            onClick={() => setIsFilingNew(!isFilingNew)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{isFilingNew ? 'View Active Cases' : 'File Contested Lot for Audit'}</span>
          </button>
        </div>
      </div>

      {/* New Dispute Filing Modal / Form (when active) */}
      {isFilingNew && (
        <div className="bg-white rounded-xl border-2 border-rose-500/40 p-5 sm:p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-rose-600" />
                Submit Contested Lot for Autonomous AI Re-Audit
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Appellate re-evaluates physical parameters against statutory AGMARK Gazette thresholds.
              </p>
            </div>
            <button
              onClick={() => setIsFilingNew(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleRunAppellateAudit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lot Consignment ID</label>
                <input
                  type="text"
                  required
                  value={newLotId}
                  onChange={(e) => setNewLotId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Farmer / Claimant Name</label>
                <input
                  type="text"
                  required
                  value={newFarmerName}
                  onChange={(e) => setNewFarmerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kisan ID / Aadhaar</label>
                <input
                  type="text"
                  required
                  value={newKisanId}
                  onChange={(e) => setNewKisanId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Procurement Center</label>
                <input
                  type="text"
                  required
                  value={newCenter}
                  onChange={(e) => setNewCenter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lot Weight (Quintals)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Human Inspector's Contested Grade
                </label>
                <select
                  value={inspectorGrade}
                  onChange={(e) => setInspectorGrade(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Grade II">Grade II (with ₹180 deduction)</option>
                  <option value="Sub-Standard / Rejected">Sub-Standard / Rejected</option>
                  <option value="Grade I">Grade I</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Farmer's Contested / Claimed Grade
                </label>
                <select
                  value={farmerGrade}
                  onChange={(e) => setFarmerGrade(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Grade I">Grade I (Standard 100% FAQ Rate ₹2,400)</option>
                  <option value="Grade Extra Class">Grade Extra Class (+₹150 Bonus)</option>
                  <option value="Grade II">Grade II (Contesting Outright Rejection)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Grounds for Dispute & Alleged Subjectivity
                </label>
                <textarea
                  rows={2}
                  required
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsFilingNew(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Dismiss
              </button>
              <button
                type="submit"
                disabled={isAuditing}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAuditing ? 'Auditing Against Gazette...' : 'Execute AI Appellate Arbitration'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Dispute Resolution Interface: List vs Case Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dispute Ledger */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Lot, Farmer, Mandi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap">
              {filteredDisputes.length} Cases
            </span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredDisputes.map((item) => {
              const isSelected = selectedDispute.disputeId === item.disputeId;
              const isRevised = item.verdict === 'REVISED_UPWARD';

              return (
                <div
                  key={item.disputeId}
                  onClick={() => setSelectedDispute(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/40 shadow-xs ring-1 ring-rose-400'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-500">
                      {item.disputeId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isRevised
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {item.verdict === 'REVISED_UPWARD' ? 'Grade Overturned (Upgraded)' : 'Original Upheld'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{item.farmerName}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.procurementCenter} • {item.lotWeightQuintals} Qtl
                  </p>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-rose-700 line-through font-semibold">
                      {item.inspectorSubjectiveGrade}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-emerald-700 font-bold">
                      {item.aiAuditedGrade}
                    </span>
                    {item.payoutAdjustmentInr > 0 && (
                      <span className="ml-auto font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        +₹{item.payoutAdjustmentInr.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Investigation & Appellate Evidence Dossier */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Case Header */}
            <div className="border-b border-slate-100 pb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {selectedDispute.disputeId}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Lot: {selectedDispute.lotId}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Appellate Arbitration: {selectedDispute.farmerName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedDispute.procurementCenter} | Kisan ID: {selectedDispute.kisanId}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                    selectedDispute.verdict === 'REVISED_UPWARD'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{selectedDispute.verdict.replace('_', ' ')}</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {new Date(selectedDispute.submissionDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Side-by-Side Comparison Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Human Inspector Eyeball Assessment */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Center Inspector (Manual Subjective)
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-1">
                  {selectedDispute.inspectorSubjectiveGrade}
                </h4>
                <div className="mt-2 text-slate-600 space-y-1">
                  <p>
                    <span className="font-semibold text-slate-700">Contested Claim:</span>{' '}
                    {selectedDispute.disputeReason}
                  </p>
                </div>
              </div>

              {/* AI Objective Tribunal Audit */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  AI Computer Vision Audit (Objective)
                </span>
                <h4 className="text-sm font-bold text-emerald-900 mt-1">
                  {selectedDispute.aiAuditedGrade}
                </h4>
                <div className="mt-2 text-emerald-900 space-y-1">
                  <p>
                    <span className="font-semibold text-emerald-950">Statutory Proof:</span>{' '}
                    {selectedDispute.pixelEvidenceCoordinates ||
                      'Standardized computer-vision optical sensor measurement.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Appellate Explanation & Legal Findings */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-600" />
                Arbitration Findings & AGMARK Rule Concordance
              </h4>
              <p className="text-slate-700 leading-relaxed">{selectedDispute.explanation}</p>
            </div>

            {/* Financial Settlement & Compensation Delta */}
            <div className="bg-slate-900 text-white rounded-xl p-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">
                  Financial Compensation Ledger
                </span>
                <span className="font-mono text-[10px] text-slate-400">Direct DBT Adjustment</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] block">Consignment Weight</span>
                  <span className="font-bold font-mono text-white text-xs sm:text-sm">
                    {selectedDispute.lotWeightQuintals} Quintals
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Rate Revision</span>
                  <span className="font-bold font-mono text-emerald-400 text-xs sm:text-sm">
                    {selectedDispute.payoutAdjustmentInr > 0 ? '+₹180 / Qtl' : '₹0 (Rate Validated)'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Total Farmer Settlement</span>
                  <span className="font-bold font-mono text-emerald-400 text-xs sm:text-sm">
                    {selectedDispute.payoutAdjustmentInr > 0
                      ? `+₹${selectedDispute.payoutAdjustmentInr.toLocaleString()}`
                      : 'Settled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
