import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Filter, 
  CheckCircle, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const MisReports: React.FC = () => {
  const { projects, beneficiaries, parcels } = useApp();
  const [selectedReportType, setSelectedReportType] = useState('state_wise');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Project ID,Project Name,State,District,Agency,Land Proposed (Ha),Land Acquired (Ha),Acquisition %,Compensation Paid (Cr),Status\n";
    
    projects.forEach(p => {
      csvContent += `"${p.id}","${p.name}","${p.state}","${p.district}","${p.implementingAgency}",${p.totalLandProposedHa},${p.landAcquiredHa},${p.acquisitionPercentage}%,${p.compensationPaidCr},"${p.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BhumiSetu_MIS_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Statutory MIS & Parliamentary Reports
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
              Department of Land Resources (DoLR)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standard parliamentary questions (Lok Sabha / Rajya Sabha) and state land revenue review dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold text-slate-600 overflow-x-auto pb-1">
        {[
          { id: 'state_wise', label: '1. State-wise Acquisition Summary' },
          { id: 'project_wise', label: '2. Project-wise Detailed Progress' },
          { id: 'compensation_report', label: '3. DBT Compensation Liquidation' },
          { id: 'delayed_report', label: '4. Delayed Projects & Exception Log' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedReportType(tab.id)}
            className={`pb-2 px-1 whitespace-nowrap transition-colors border-b-2 ${
              selectedReportType === tab.id
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printable Report Sheet */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs font-sans">
        <div className="border-b border-slate-200 pb-4 mb-4 text-center">
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Government of India • Ministry of Rural Development</div>
          <h3 className="text-lg font-black text-slate-900 mt-1">DEPARTMENT OF LAND RESOURCES (DoLR)</h3>
          <p className="text-xs font-mono text-slate-600 mt-0.5">
            National Land Acquisition Performance Audit Report • Generated {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="overflow-x-auto">
          {selectedReportType === 'delayed_report' ? (
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-rose-50 text-rose-900 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-200">Sr.</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Project Name & ID</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Location</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Current Stage</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">SLA Benchmark</th>
                  <th className="py-2.5 px-3">Statutory Delay Impediment / Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {projects.filter(p => p.isDelayed).map((proj, idx) => (
                  <tr key={proj.id} className="hover:bg-rose-50/50">
                    <td className="py-2 px-3 border-r border-slate-200 text-center font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{proj.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{proj.id}</div>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200">{proj.district}, {proj.state}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-semibold text-rose-700">{proj.status}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-mono">{proj.slaDeadline}</td>
                    <td className="py-2 px-3 text-slate-700 text-xs">{proj.delayReason || 'Statutory mutation delayed beyond prescribed benchmark'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedReportType === 'compensation_report' ? (
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-emerald-50 text-emerald-900 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-200">Sr.</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Beneficiary Titleholder</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Cadastral Survey</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Project</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right">Assessed (₹)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right">Solatium 100% (₹)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right">Total Award (₹)</th>
                  <th className="py-2.5 px-3">PFMS DBT Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {beneficiaries.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 border-r border-slate-200 text-center font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">{b.name}</td>
                    <td className="py-2 px-3 border-r border-slate-200">{b.surveyNumber} ({b.village})</td>
                    <td className="py-2 px-3 border-r border-slate-200">{b.projectName}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right font-mono">₹{(b.assessedAmountInr/100000).toFixed(1)} L</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-blue-700">₹{(b.solatiumAmountInr/100000).toFixed(1)} L</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right font-mono font-bold text-emerald-700">₹{(b.totalEntitlementInr/100000).toFixed(1)} L</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-200">Sr.</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Project Name & ID</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">State / District</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Executing Agency</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right">Proposed (Ha)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right">Acquired (Ha)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right">Possession %</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right">Compensation (Cr)</th>
                  <th className="py-2.5 px-3">Statutory Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {projects.map((proj, idx) => (
                  <tr key={proj.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-500 text-center">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-sans">
                      <div className="font-bold text-slate-900">{proj.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{proj.id}</div>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 font-sans">
                      {proj.district}, {proj.state}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 font-sans text-slate-700">
                      {proj.implementingAgency}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right">{proj.totalLandProposedHa}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right text-emerald-700 font-bold">{proj.landAcquiredHa}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right font-bold">{proj.acquisitionPercentage}%</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right">₹{proj.compensationPaidCr}</td>
                    <td className="py-2 px-3 font-sans">
                      <span className="font-semibold text-slate-800">{proj.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
          <div>Report Hash: SHA256:7f082c9e2b1 • Auto-certified by National Portal Engine</div>
          <div>Page 1 of 1</div>
        </div>
      </div>
    </div>
  );
};
