import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Users, 
  AlertCircle,
  Building,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { LandProject } from '../../types';

export const ProjectRegistry: React.FC = () => {
  const { projects, setSelectedProjectId, setActiveTab, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filtered projects
  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchState = stateFilter === 'All' || p.state === stateFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchCat && matchState && matchStatus;
  });

  const categories = ['All', 'Highways & Expressways', 'Railways & Freight', 'Renewable Energy', 'Industrial Corridors', 'Irrigation & Water Resources'];
  const states = ['All', 'Maharashtra', 'Gujarat', 'West Bengal', 'Madhya Pradesh', 'Telangana'];
  const statuses = ['All', 'Proposal', 'Notification', 'Land Survey', 'Award', 'Compensation', 'Possession', 'R&R', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Header with Title and Add CTA */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              National Land Acquisition Project Registry
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
              {filtered.length} Projects
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete repository of central and state infrastructure land acquisition proceedings under RFCTLARR Act 2013.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('proposals')}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Acquisition Proposal</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name or district..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium"
            >
              <option value="All">All Infrastructure Sectors</option>
              {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium"
            >
              <option value="All">All States / UTs</option>
              {states.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium"
            >
              <option value="All">All Acquisition Stages</option>
              {statuses.slice(1).map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Cards List / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((proj) => (
          <div 
            key={proj.id}
            className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md group"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-bold text-slate-700">
                  {proj.id}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  proj.status === 'Completed' ? 'text-emerald-700' :
                  proj.isDelayed ? 'text-rose-700' :
                  'text-slate-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    proj.status === 'Completed' ? 'bg-emerald-600' :
                    proj.isDelayed ? 'bg-rose-600' : 'bg-blue-600'
                  }`} />
                  {proj.status}
                  {proj.isDelayed && <span className="text-[10px] text-rose-500 font-normal">(Delayed)</span>}
                </span>
              </div>

              {/* Title & Category */}
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors line-clamp-2">
                {proj.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {proj.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{proj.district}, {proj.state}</span>
              </div>

              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{proj.implementingAgency}</span>
              </div>

              {/* Progress Bars */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">Land Acquired:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {proj.landAcquiredHa} / {proj.totalLandProposedHa} Ha ({proj.acquisitionPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${proj.acquisitionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">Compensation DBT:</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      ₹{proj.compensationPaidCr} / ₹{proj.compensationAssessedCr} Cr
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-1.5 rounded-full" 
                      style={{ width: `${(proj.compensationPaidCr / (proj.compensationAssessedCr || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Affected: <strong className="text-slate-700">{proj.affectedFamilies}</strong> families
              </span>
              <button
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setActiveTab('project_details');
                }}
                className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold hover:underline"
              >
                <span>View Full File</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
