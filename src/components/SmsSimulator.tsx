import React from 'react';
import { Smartphone, X, Check, CheckCircle2 } from 'lucide-react';
import { OnionAssessmentResult } from '../services/onionGradingEngine';

interface SmsSimulatorProps {
  result: OnionAssessmentResult;
  farmerName: string;
  onClose: () => void;
}

export const SmsSimulator: React.FC<SmsSimulatorProps> = ({ result, farmerName, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative w-[320px] h-[650px] bg-white rounded-[3rem] border-[12px] border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 inset-x-0 flex justify-center z-20">
          <div className="w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#075e54] text-white pt-8 pb-3 px-4 flex items-center gap-3 shrink-0 mt-[-1px]">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#075e54]" />
          </div>
          <div>
            <p className="font-bold text-[15px] leading-tight">AGMARK Gov</p>
            <p className="text-[11px] opacity-80">Official Business Account</p>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 bg-[#e5ddd5] p-4 overflow-y-auto space-y-4">
          
          <div className="flex justify-center">
            <span className="bg-[#d4eaf7] text-slate-600 text-[10px] px-2 py-1 rounded-lg">Today</span>
          </div>

          {/* Hindi Message */}
          <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[90%] relative text-slate-800 text-sm leading-relaxed">
            <p>
              नमस्कार <b>{farmerName}</b> जी, <br/>
              लॉट <b>{result.lotId}</b> का निरीक्षण सफल हुआ।
            </p>
            <p className="mt-2">
              <b>ग्रेड:</b> {result.overallGrade}<br/>
              <b>वजन:</b> {result.lotWeightQuintals} क्विंटल<br/>
              <b>तय मूल्य:</b> ₹{result.pricing.netPayableRate}/क्विंटल
            </p>
            <p className="mt-2 text-emerald-700 font-bold">
              कुल भुगतान: ₹{result.pricing.estimatedTotalPayout.toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              यह डिजिटल पावती NAFED/NCCF द्वारा प्रमाणित है।
            </p>
            <span className="text-[9px] text-slate-400 absolute bottom-1.5 right-2 flex items-center gap-1">
              Just now <Check className="w-3 h-3 text-blue-500" />
            </span>
          </div>

          {/* Marathi Message */}
          <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[90%] relative text-slate-800 text-sm leading-relaxed">
            <p>
              नमस्कार <b>{farmerName}</b>, <br/>
              तुमच्या <b>{result.lotId}</b> लॉटची तपासणी पूर्ण झाली आहे.
            </p>
            <p className="mt-2">
              <b>गुणवत्ता:</b> {result.overallGrade}<br/>
              <b>वजन:</b> {result.lotWeightQuintals} क्विंटल<br/>
              <b>दर:</b> ₹{result.pricing.netPayableRate}/क्विंटल
            </p>
            <p className="mt-2 text-emerald-700 font-bold">
              एकूण रक्कम: ₹{result.pricing.estimatedTotalPayout.toLocaleString()}
            </p>
            <span className="text-[9px] text-slate-400 absolute bottom-1.5 right-2 flex items-center gap-1">
              Just now <Check className="w-3 h-3 text-blue-500" />
            </span>
          </div>

          {/* Telugu Message */}
          <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[90%] relative text-slate-800 text-sm leading-relaxed">
            <p>
              నమస్కారం <b>{farmerName}</b> గారు, <br/>
              మీ <b>{result.lotId}</b> లాట్ తనిఖీ పూర్తయింది.
            </p>
            <p className="mt-2">
              <b>గ్రేడ్:</b> {result.overallGrade}<br/>
              <b>బరువు:</b> {result.lotWeightQuintals} క్వింటాల్<br/>
              <b>ధర:</b> ₹{result.pricing.netPayableRate}/క్వింటాల్
            </p>
            <p className="mt-2 text-emerald-700 font-bold">
              మొత్తం మొత్తం: ₹{result.pricing.estimatedTotalPayout.toLocaleString()}
            </p>
            <span className="text-[9px] text-slate-400 absolute bottom-1.5 right-2 flex items-center gap-1">
              Just now <Check className="w-3 h-3 text-blue-500" />
            </span>
          </div>

        </div>

        {/* Input Bar */}
        <div className="bg-slate-100 p-2 flex gap-2 shrink-0 border-t border-slate-200">
          <div className="flex-1 bg-white rounded-full border border-slate-300 px-4 py-2 text-slate-400 text-sm">
            Reply to AGMARK Gov...
          </div>
        </div>

      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};
