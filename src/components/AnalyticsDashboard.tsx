import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, PieChart, Activity, MapPin, IndianRupee } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            Price Analyses & Analytics Dashboard
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl text-sm sm:text-base">
            Real-time procurement metrics, market prices by area, and defect trends.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-slate-700">Live Sync Active</span>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Procured Today</p>
          <p className="text-3xl font-black text-slate-900">1,248 <span className="text-sm text-slate-500 font-normal">Quintals</span></p>
          <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +12% vs yesterday
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Grade 1 & Extra Class</p>
          <p className="text-3xl font-black text-emerald-600">82%</p>
          <p className="mt-2 text-xs text-slate-500 font-medium">Prime Buffer Quality</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Statutory Rejections</p>
          <p className="text-3xl font-black text-rose-600">4.1%</p>
          <p className="mt-2 text-xs text-slate-500 font-medium">Mainly Black Mold (&gt;1%)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Base Price Paid</p>
          <p className="text-3xl font-black text-indigo-700">₹2,380</p>
          <p className="mt-2 text-xs text-slate-500 font-medium">Net after Grade II deductions</p>
        </div>
      </div>

      {/* Market Prices Section */}
      <div className="mb-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-600" /> Market Prices Across Different Areas (₹ / Quintal)
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-700">Lasalgaon, MH</h4>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-xs text-slate-500">Extra Class</p>
                <p className="text-lg font-bold text-emerald-700">₹2,550</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Grade II</p>
                <p className="text-sm font-medium text-amber-600">₹2,200</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-700">Pimpalgaon, MH</h4>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-xs text-slate-500">Extra Class</p>
                <p className="text-lg font-bold text-emerald-700">₹2,480</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Grade II</p>
                <p className="text-sm font-medium text-amber-600">₹2,150</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-700">Yeola, MH</h4>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-xs text-slate-500">Extra Class</p>
                <p className="text-lg font-bold text-emerald-700">₹2,450</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Grade II</p>
                <p className="text-sm font-medium text-amber-600">₹2,100</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-700">Nashik City, MH</h4>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-xs text-slate-500">Extra Class</p>
                <p className="text-lg font-bold text-emerald-700">₹2,600</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Grade II</p>
                <p className="text-sm font-medium text-amber-600">₹2,300</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Grade Distribution Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-500" /> Grade Distribution
            </h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-slate-700">Extra Class (&gt;60mm)</span>
                <span className="text-slate-500">18% (224 q)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-emerald-700">Grade I (50-60mm)</span>
                <span className="text-slate-500">64% (798 q)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-amber-600">Grade II (40-50mm)</span>
                <span className="text-slate-500">14% (174 q)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-3 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-rose-600">Sub-Standard (&lt;40mm)</span>
                <span className="text-slate-500">4% (52 q)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-rose-500 h-3 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Defect Trends */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Size Variations
            </h3>
          </div>

          <div className="flex items-end h-48 gap-4 px-2">
            
            <div className="flex-1 flex flex-col items-center justify-end group">
              <div className="w-full bg-indigo-200 rounded-t-md transition-all group-hover:bg-indigo-300 relative flex justify-center" style={{ height: '85%' }}>
                <span className="absolute -top-6 text-xs font-bold text-slate-600">8.5%</span>
              </div>
              <div className="h-10 mt-2 text-[10px] sm:text-xs text-center font-medium text-slate-500 leading-tight">Too<br/>Large</div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-end group">
              <div className="w-full bg-emerald-200 rounded-t-md transition-all group-hover:bg-emerald-300 relative flex justify-center" style={{ height: '62%' }}>
                <span className="absolute -top-6 text-xs font-bold text-slate-600">6.2%</span>
              </div>
              <div className="h-10 mt-2 text-[10px] sm:text-xs text-center font-medium text-slate-500 leading-tight">Slight<br/>Var.</div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-end group">
              <div className="w-full bg-amber-200 rounded-t-md transition-all group-hover:bg-amber-300 relative flex justify-center" style={{ height: '45%' }}>
                <span className="absolute -top-6 text-xs font-bold text-slate-600">4.5%</span>
              </div>
              <div className="h-10 mt-2 text-[10px] sm:text-xs text-center font-medium text-slate-500 leading-tight">Slightly<br/>Small</div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-end group">
              <div className="w-full bg-orange-200 rounded-t-md transition-all group-hover:bg-orange-300 relative flex justify-center" style={{ height: '38%' }}>
                <span className="absolute -top-6 text-xs font-bold text-slate-600">3.8%</span>
              </div>
              <div className="h-10 mt-2 text-[10px] sm:text-xs text-center font-medium text-slate-500 leading-tight">Small</div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-end group">
              <div className="w-full bg-rose-300 rounded-t-md transition-all group-hover:bg-rose-400 relative flex justify-center" style={{ height: '11%' }}>
                <span className="absolute -top-6 text-xs font-bold text-slate-600">1.1%</span>
              </div>
              <div className="h-10 mt-2 text-[10px] sm:text-xs text-center font-medium text-slate-500 leading-tight">Under<br/>Size</div>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
};

