import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  Search, 
  ShieldCheck, 
  Clock, 
  User, 
  FileText,
  Filter
} from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = auditLogs.filter(log =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Statutory Administrative Audit Ledger & Provenance
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
              Immutable Log
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete provenance log recording every status transition, award sanction, DBT trigger, and cadastral spot verification.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, officer name or remarks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Log ID & Timestamp</th>
                <th className="py-3 px-4">Authorized Officer & Role</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Project File</th>
                <th className="py-3 px-4">Stage Transition</th>
                <th className="py-3 px-4">Administrative Remarks</th>
                <th className="py-3 px-4 text-right">IP Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-900">{log.id}</div>
                    <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{log.user}</div>
                    <div className="text-[10px] text-blue-600 font-semibold uppercase">{log.role}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900 line-clamp-1">{log.projectName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.projectId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] text-slate-500">
                      {log.previousStatus} → <strong className="text-emerald-700">{log.newStatus}</strong>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs text-[11px]">
                    {log.remarks}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-slate-400 text-right">
                    {log.ipAddress || '10.142.1.20'}
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
