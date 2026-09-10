import React, { useState } from 'react';
import { FileCheck, Search, Filter, Eye, Printer, Award, Building2 } from 'lucide-react';
import { OnionAssessmentResult } from '../services/onionGradingEngine';
import { SAMPLE_ONION_LOTS } from '../data/sampleLots';

interface LotRegistryProps {
  onSelectLotToView: (lot: any) => void;
}

export const LotRegistry: React.FC<LotRegistryProps> = ({ onSelectLotToView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');

  const mockLots = [
    {
      lotId: 'LOT-MH-2026-9104',
      farmerName: 'Vishnu Tukaram Shinde',
      kisanId: 'MH-NSK-2026-10492',
      procurementCenter: 'Lasalgaon APMC (Nashik)',
      date: '2026-09-08',
      grade: 'Grade Extra Class',
      faqStatus: 'FAQ Compliant',
      avgDiameterMm: 56.4,
      defectsPercent: 1.5,
      weightQuintals: 52.5,
      ratePerQuintal: 2550,
      totalPayout: 133875,
    },
    {
      lotId: 'LOT-MH-2026-4421',
      farmerName: 'Sopan Narhari Kute',
      kisanId: 'MH-NSK-2026-62184',
      procurementCenter: 'Pimpalgaon Baswant APMC',
      date: '2026-09-07',
      grade: 'Grade I',
      faqStatus: 'FAQ Compliant',
      avgDiameterMm: 52.8,
      defectsPercent: 3.8,
      weightQuintals: 46.0,
      ratePerQuintal: 2400,
      totalPayout: 110400,
    },
    {
      lotId: 'LOT-MH-2026-7832',
      farmerName: 'Kailas Bhikaji Gite',
      kisanId: 'MH-NSK-2026-44391',
      procurementCenter: 'Solapur Central Mandi',
      date: '2026-09-07',
      grade: 'Grade II',
      faqStatus: 'Marginal FAQ',
      avgDiameterMm: 48.2,
      defectsPercent: 8.6,
      weightQuintals: 38.0,
      ratePerQuintal: 2220,
      totalPayout: 84360,
    },
    {
      lotId: 'LOT-RJ-2026-3091',
      farmerName: 'Bhairon Singh Gurjar',
      kisanId: 'RJ-ALW-2026-55219',
      procurementCenter: 'Alwar Krishi Upaj Mandi',
      date: '2026-09-06',
      grade: 'Grade II',
      faqStatus: 'Marginal FAQ',
      avgDiameterMm: 49.5,
      defectsPercent: 7.2,
      weightQuintals: 55.0,
      ratePerQuintal: 2220,
      totalPayout: 122100,
    },
    {
      lotId: 'LOT-MP-2026-6612',
      farmerName: 'Dhanraj Mangilal Verma',
      kisanId: 'MP-IND-2026-88190',
      procurementCenter: 'Indore Mandi Complex',
      date: '2026-09-06',
      grade: 'Grade I',
      faqStatus: 'FAQ Compliant',
      avgDiameterMm: 53.1,
      defectsPercent: 4.1,
      weightQuintals: 62.0,
      ratePerQuintal: 2400,
      totalPayout: 148800,
    },
    {
      lotId: 'LOT-MH-2026-1193',
      farmerName: 'Bhausaheb Dattatraya Jadhav',
      kisanId: 'MH-NSK-2026-99214',
      procurementCenter: 'Alwar Krishi Upaj Mandi',
      date: '2026-09-05',
      grade: 'Sub-Standard / Rejected',
      faqStatus: 'Non-Compliant / Rejected',
      avgDiameterMm: 44.1,
      defectsPercent: 18.2,
      weightQuintals: 41.5,
      ratePerQuintal: 0,
      totalPayout: 0,
    },
  ];

  const filtered = mockLots.filter((item) => {
    const matchesSearch =
      item.lotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.procurementCenter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'ALL' || item.grade.includes(gradeFilter);
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-xs">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              National Central Buffer Procurement Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable ledger of certified onion lots, AGMARK classification scores, and Direct Benefit
              Transfer settlement payouts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Certified Lots</span>
            <span className="font-bold text-slate-900 text-sm">1,492 Batches</span>
          </div>

          <div className="bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
            <span className="text-emerald-700 block text-[10px] uppercase font-bold">Total Procurement</span>
            <span className="font-bold text-emerald-800 text-sm">71,840 Quintals</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Lot ID, Farmer Name, or Mandi Center..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-medium">Filter Grade:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-800 font-semibold focus:outline-none"
          >
            <option value="ALL">All Grades</option>
            <option value="Extra Class">Grade Extra Class</option>
            <option value="Grade I">Grade I (FAQ)</option>
            <option value="Grade II">Grade II</option>
            <option value="Rejected">Sub-Standard / Rejected</option>
          </select>
        </div>
      </div>

      {/* Lots Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
                <th className="py-3 px-4">Lot Consignment</th>
                <th className="py-3 px-4">Farmer / Grower</th>
                <th className="py-3 px-4">Procurement Center</th>
                <th className="py-3 px-4 text-center">AGMARK Grade</th>
                <th className="py-3 px-4 text-right">Avg Diam</th>
                <th className="py-3 px-4 text-right">Defect %</th>
                <th className="py-3 px-4 text-right">Net Weight</th>
                <th className="py-3 px-4 text-right">Settled Rate</th>
                <th className="py-3 px-4 text-right">Total Payout</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((lot) => (
                <tr key={lot.lotId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{lot.lotId}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    <div>{lot.farmerName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{lot.kisanId}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{lot.procurementCenter}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        lot.grade.includes('Extra')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : lot.grade.includes('Grade I')
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : lot.grade.includes('Grade II')
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {lot.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">{lot.avgDiameterMm} mm</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">{lot.defectsPercent}%</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {lot.weightQuintals} Qtl
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                    ₹{lot.ratePerQuintal}/q
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    {lot.totalPayout > 0 ? `₹${lot.totalPayout.toLocaleString()}` : '₹0'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onSelectLotToView(lot)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Certificate</span>
                    </button>
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
