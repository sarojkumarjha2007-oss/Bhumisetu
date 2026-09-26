import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Download, 
  Filter, 
  Layers, 
  Calendar,
  CheckCircle2,
  Clock,
  Building
} from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const { projects } = useApp();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedState, setSelectedState] = useState('All');

  // Compute stats
  const totalProposed = projects.reduce((acc, p) => acc + p.totalLandProposedHa, 0);
  const totalAcquired = projects.reduce((acc, p) => acc + p.landAcquiredHa, 0);
  const totalAssessed = projects.reduce((acc, p) => acc + p.compensationAssessedCr, 0);
  const totalPaid = projects.reduce((acc, p) => acc + p.compensationPaidCr, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              National Land Analytics & Multi-Sector Performance Trends
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Department of Land Resources (DoLR)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Predictive acquisition velocity, compensation DBT absorption rate, and statutory RFCTLARR turnaround times.
          </p>
        </div>

        <button
          onClick={() => {
            let csv = "Project ID,Project Name,State,District,Category,Proposed Ha,Acquired Ha,Acquisition %,Compensation Paid Cr,Status\n";
            projects.forEach(p => {
              csv += `"${p.id}","${p.name}","${p.state}","${p.district}","${p.category}",${p.totalLandProposedHa},${p.landAcquiredHa},${p.acquisitionPercentage}%,${p.compensationPaidCr},"${p.status}"\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BhumiSetu_Analytics_Dossier_${selectedYear}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Dossier</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Financial Year:</span>
          <select 
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-800"
          >
            <option value="2026">FY 2025-26 (Current)</option>
            <option value="2025">FY 2024-25</option>
            <option value="2024">FY 2023-24</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">State / Corridor:</span>
          <select 
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-800"
          >
            <option value="All">All States (Pan-India)</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Gujarat">Gujarat</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Telangana">Telangana</option>
          </select>
        </div>
      </div>

      {/* Grid of Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Land Acquisition Velocity (Hectares) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Acquisition Velocity (Hectares)</h3>
              <p className="text-[11px] text-slate-500">Physical possession handed over to implementing agencies</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              +18.4% YoY
            </span>
          </div>

          {/* Bar Chart Simulation */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-200">
            {[
              { month: 'Apr', ha: 140, max: 350 },
              { month: 'May', ha: 210, max: 350 },
              { month: 'Jun', ha: 185, max: 350 },
              { month: 'Jul', ha: 290, max: 350 },
              { month: 'Aug', ha: 320, max: 350 },
              { month: 'Sep', ha: 345, max: 350 },
            ].map(item => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-blue-700 font-bold">
                  {item.ha}
                </span>
                <div 
                  className="w-full bg-blue-600 group-hover:bg-blue-700 rounded-t-md transition-all"
                  style={{ height: `${(item.ha / item.max) * 100}%` }}
                />
                <span className="text-[11px] font-semibold text-slate-600">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 text-center">
            Average Monthly Turnover: <strong>248.3 Hectares / Month</strong>
          </div>
        </div>

        {/* Compensation Assessed vs Paid DBT Comparison */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Compensation Assessed vs Disbursed</h3>
              <p className="text-[11px] text-slate-500">Financial absorption through PFMS Aadhaar gateway</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              80.1% Absorption
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Total Statutory Assessment (₹ Cr)</span>
                <span className="font-mono text-slate-900 font-bold">₹{totalAssessed.toFixed(1)} Cr</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-slate-400 h-3 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Electronic DBT Disbursed (₹ Cr)</span>
                <span className="font-mono text-emerald-700 font-bold">₹{totalPaid.toFixed(1)} Cr</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div 
                  className="bg-emerald-600 h-3 rounded-full" 
                  style={{ width: `${(totalPaid / totalAssessed) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Treasury / Judicial Escrow Pending (₹ Cr)</span>
                <span className="font-mono text-amber-600 font-bold">₹{(totalAssessed - totalPaid).toFixed(1)} Cr</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div 
                  className="bg-amber-500 h-3 rounded-full" 
                  style={{ width: `${((totalAssessed - totalPaid) / totalAssessed) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-slate-500 text-[10px]">Avg Turnaround Time</span>
              <div className="font-bold text-slate-800 mt-0.5">14.2 Days (3G to DBT)</div>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-slate-500 text-[10px]">Aadhaar Auth Rate</span>
              <div className="font-bold text-emerald-700 mt-0.5">99.4% Verified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
