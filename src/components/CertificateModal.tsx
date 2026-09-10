import React from 'react';
import { X, Printer, Receipt } from 'lucide-react';
import { OnionAssessmentResult } from '../services/onionGradingEngine';

interface CertificateModalProps {
  result: OnionAssessmentResult;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ result, onClose }) => {
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `AGMARK_Receipt_${result.lotId}`;
    window.print();
    document.title = originalTitle;
  };

  const receiptNumber = `RCPT-${result.lotId.replace(/[^0-9]/g, '') || '2026'}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const isSprouted = result.defectMetrics.sproutingPercent > 0;
  const isSingleOnion = result.countDetected === 1;

  // Assume single onion weighs about 0.001 quintals (100 grams) if it's just one
  const specificOnionWeight = isSingleOnion ? 0.001 : result.lotWeightQuintals;
  const specificOnionPrice = (result.pricing.netPayableRate * specificOnionWeight).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 font-mono text-slate-800">
        
        {/* Top Controls */}
        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold flex items-center gap-1.5 text-slate-600">
            <Receipt className="w-4 h-4" /> Receipt View
          </span>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 transition-colors">
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-certificate" className="p-6 text-sm bg-white print:p-0 print:shadow-none print:w-auto">
          {/* Header */}
          <div className="text-center border-b border-dashed border-slate-400 pb-4 mb-4">
            <h2 className="font-bold text-lg uppercase tracking-widest">ONION AI</h2>
            <h3 className="text-xs font-bold mt-1">Kisan Mandi (కిసాన్ మండి)</h3>
            <p className="text-[10px] text-slate-500 mt-1">{result.procurementCenter}</p>
            <p className="text-[10px] text-slate-500">Date: {new Date(result.timestamp).toLocaleDateString()}</p>
            <p className="text-[10px] text-slate-500">Receipt No: {receiptNumber}</p>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4 text-xs">
            <div className="flex justify-between">
              <span>Lot ID (లాట్ ID):</span>
              <span className="font-bold">{result.lotId}</span>
            </div>
            <div className="flex justify-between">
              <span>Farmer (రైతు):</span>
              <span className="font-bold truncate max-w-[140px] text-right">{result.farmerName || 'Registered'}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity (పరిమాణం):</span>
              <span className="font-bold">{isSingleOnion ? '1 Onion' : `${result.lotWeightQuintals} Qtl`}</span>
            </div>
          </div>

          <div className="border-t border-b border-dashed border-slate-400 py-3 mb-4 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold">Avg Size (పరిమాణం):</span>
              <span className="text-sm font-black">{result.avgDiameterMm} mm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">Grade (గ్రేడ్):</span>
              <span className="text-sm font-black px-2 py-0.5 bg-slate-100 border border-slate-800 rounded">{result.overallGrade}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold">Sprouted (మొలకలు):</span>
              {isSprouted ? (
                <span className="text-rose-600 font-bold px-1 border border-rose-600">YES (అవును)</span>
              ) : (
                <span className="text-emerald-600 font-bold px-1 border border-emerald-600">NO (లేదు)</span>
              )}
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-slate-300">
              <span className="font-bold text-slate-700">Health (ఆరోగ్యం):</span>
              {(result.defectMetrics.rottingOrMoldPercent > 0 || result.defectMetrics.totalDefectPercent > 10) ? (
                <span className="text-rose-600 font-bold px-1.5 py-0.5 bg-rose-50 border border-rose-600 rounded">SPOILED / BLACK (చెడిపోయిన)</span>
              ) : (
                <span className="text-emerald-600 font-bold px-1.5 py-0.5 bg-emerald-50 border border-emerald-600 rounded">GOOD (మంచిది)</span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-1 mb-6 text-xs">
            <div className="flex justify-between">
              <span>Base Rate (Qtl):</span>
              <span>₹{result.pricing.baseMspRate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Adjustment:</span>
              <span>{result.pricing.gradePremiumOrPenalty >= 0 ? '+' : ''}₹{result.pricing.gradePremiumOrPenalty.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-slate-200">
              <span>Net Rate (Qtl):</span>
              <span>₹{result.pricing.netPayableRate.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-end mt-4 pt-4 border-t-2 border-slate-800">
              <span className="font-bold text-sm">TOTAL (మొత్తం):</span>
              <span className="font-black text-xl">₹{specificOnionPrice}</span>
            </div>
            {isSingleOnion && (
              <p className="text-[9px] text-right text-slate-500 mt-1">*Pricing for 1 individual onion (~100g)</p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-slate-500 border-t border-dashed border-slate-400 pt-4">
            <p className="font-bold mb-1">Quality Inspected by AI</p>
            <p className="break-all">{result.cryptographicHash}</p>
            <p className="mt-2 text-slate-400">*** Thank You (ధన్యవాదాలు) ***</p>
          </div>
        </div>
      </div>
    </div>
  );
};

