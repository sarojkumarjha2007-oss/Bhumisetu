import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Users, 
  Building, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  HeartHandshake, 
  MapPin,
  Sparkles
} from 'lucide-react';

export const RehabilitationModule: React.FC = () => {
  const { projects } = useApp();

  const totalAffected = projects.reduce((acc, p) => acc + p.affectedFamilies, 0);
  const totalDisplaced = projects.reduce((acc, p) => acc + p.displacedFamilies, 0);
  const totalRehab = projects.reduce((acc, p) => acc + p.rehabilitatedFamilies, 0);
  const overallPercentage = ((totalRehab / (totalDisplaced || 1)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Rehabilitation & Resettlement (R&R) Monitoring Deck
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
              RFCTLARR Second Schedule Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking physical rehabilitation colonies, alternative homestead allotments, skill employment, and subsistence grants.
          </p>
        </div>
      </div>

      {/* R&R Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Affected Families</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {totalAffected.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Landholders & agrarian dependents</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Displaced Families</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {totalDisplaced.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requiring physical relocation</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Families Resettled</div>
          <div className="text-2xl font-black text-purple-700 mt-1 font-mono">
            {totalRehab.toLocaleString()}
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            {overallPercentage}% Rehabilitation Rate
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Houses Constructed (PMAY-G/U)</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
            580 Units
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 4 model resettlement colonies</div>
        </div>
      </div>

      {/* Project-wise R&R Performance */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Infrastructure Project-wise R&R Colony & Handover Progress
        </h3>

        <div className="space-y-4">
          {projects.map((proj) => {
            const pct = ((proj.rehabilitatedFamilies / (proj.displacedFamilies || 1)) * 100).toFixed(0);
            return (
              <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                    <span className="text-[11px] text-slate-500 ml-2">({proj.district}, {proj.state})</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-800">
                    <span className="text-purple-700">{proj.rehabilitatedFamilies}</span> / {proj.displacedFamilies} Displaced Families ({pct}%)
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-3">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400">Model Colony:</span> <span className="font-semibold text-slate-800">Navagam Resettlement</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Amenities:</span> <span className="font-semibold text-slate-800">Piped Water & Solar Grid</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Job Assistance:</span> <span className="font-semibold text-emerald-700">142 Trained</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Subsistence Grant:</span> <span className="font-semibold text-slate-800">₹36,000 / family paid</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
