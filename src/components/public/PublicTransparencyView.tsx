import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe2, 
  Search, 
  MapPin, 
  CheckCircle, 
  DollarSign, 
  Users, 
  Building,
  ShieldCheck,
  Eye,
  Info
} from 'lucide-react';

export const PublicTransparencyView: React.FC = () => {
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <Globe2 className="w-4 h-4 text-emerald-600" />
          <span>Proactive Public Disclosure</span>
          <span>·</span>
          <span className="text-emerald-700 font-bold">RTI Act Section 4 Compliant</span>
          <span>·</span>
          <span>Open Citizen Audit</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Citizen Public Transparency &amp; Social Audit Portal
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Open citizen access displaying macro infrastructure milestones, total state budgetary allocations, and physical land handover. Private banking credentials and personal beneficiary records are strictly masked in compliance with data privacy statutes.
        </p>
      </div>

      {/* Public Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects in your district or state..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
          />
        </div>
      </div>

      {/* Public Projects Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(proj => (
          <div key={proj.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-slate-700">
                  {proj.id}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {proj.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                {proj.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{proj.district}, {proj.state}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Executing Authority:</span>
                  <span className="font-semibold text-slate-800">{proj.implementingAgency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Land Proposed:</span>
                  <span className="font-mono font-bold text-slate-900">{proj.totalLandProposedHa} Ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Possession Handed Over:</span>
                  <span className="font-mono font-bold text-emerald-700">{proj.landAcquiredHa} Ha ({proj.acquisitionPercentage}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Compensation Disbursed:</span>
                  <span className="font-mono font-bold text-slate-900">₹{proj.compensationPaidCr} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Families Resettled:</span>
                  <span className="font-mono font-bold text-purple-700">{proj.rehabilitatedFamilies} of {proj.displacedFamilies}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>SLA Target: {proj.slaDeadline}</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Public Data Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
