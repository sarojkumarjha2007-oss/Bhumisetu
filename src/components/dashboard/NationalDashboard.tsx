import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Layers, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  MapPin, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Filter,
  DollarSign
} from 'lucide-react';

export const NationalDashboard: React.FC = () => {
  const { projects, alerts, proposals, setActiveTab, setSelectedProjectId, currentUser } = useApp();
  const [stateFilter, setStateFilter] = useState<string>('All States');

  // Filter projects by selected state if not All States
  const filteredProjects = stateFilter === 'All States'
    ? projects
    : projects.filter(p => p.state.toLowerCase() === stateFilter.toLowerCase());

  // Metrics computation
  const totalProjects = filteredProjects.length;
  const totalLandProposed = filteredProjects.reduce((acc, p) => acc + p.totalLandProposedHa, 0);
  const totalLandAcquired = filteredProjects.reduce((acc, p) => acc + p.landAcquiredHa, 0);
  const acquisitionPercentage = totalLandProposed > 0 ? ((totalLandAcquired / totalLandProposed) * 100).toFixed(1) : '0';
  
  const totalNotifiedArea = filteredProjects.reduce((acc, p) => acc + p.notifiedAreaHa, 0);
  const totalCompensationAssessed = filteredProjects.reduce((acc, p) => acc + p.compensationAssessedCr, 0);
  const totalCompensationPaid = filteredProjects.reduce((acc, p) => acc + p.compensationPaidCr, 0);
  const compensationDisbursalPercentage = totalCompensationAssessed > 0 ? ((totalCompensationPaid / totalCompensationAssessed) * 100).toFixed(1) : '0';

  const totalAffectedFamilies = filteredProjects.reduce((acc, p) => acc + p.affectedFamilies, 0);
  const totalDisplacedFamilies = filteredProjects.reduce((acc, p) => acc + p.displacedFamilies, 0);
  const totalRehabilitated = filteredProjects.reduce((acc, p) => acc + p.rehabilitatedFamilies, 0);
  const totalPossessionCompleted = filteredProjects.reduce((acc, p) => acc + p.possessionCompletedHa, 0);

  const delayedProjects = filteredProjects.filter(p => p.isDelayed);
  const criticalAlerts = alerts.filter(a => a.riskLevel === 'Critical' || a.riskLevel === 'High');

  return (
    <div className="space-y-6">
      {/* Top Banner / Gov Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="flex-1 p-6 z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span>National Portal</span>
                <span>·</span>
                <span className="text-blue-700 font-bold">PM GatiShakti &amp; BharatNet Multi-Modal Grid</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">RFCTLARR 2013</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                National Land Acquisition &amp; Spatial Decision Matrix
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                Centralized monitoring system for infrastructure land parcels across 36 States &amp; UTs. Live synchronization of statutory Section 3A/4 gazettes, cadastral vector polygons, and Direct Benefit Transfer (DBT) accounts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>State Corridor:</span>
                <select 
                  value={stateFilter} 
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option>All States</option>
                  <option>Maharashtra</option>
                  <option>Gujarat</option>
                  <option>West Bengal</option>
                  <option>Madhya Pradesh</option>
                  <option>Telangana</option>
                </select>
              </div>

              <button
                onClick={() => setActiveTab('proposals')}
                className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <span>+ Requisition New Land Parcel</span>
              </button>

              <button
                onClick={() => setActiveTab('gis_map')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Open National Cadastral GIS</span>
              </button>
            </div>
          </div>

          <div className="hidden md:block w-64 lg:w-80 relative shrink-0 overflow-hidden border-t md:border-t-0 md:border-l border-slate-200">
            <img 
              src="/src/assets/images/national_corridor_aerial_1790406976262.jpg" 
              alt="National Infrastructure Corridor NH-48 Aerial"
              className="w-full h-full object-cover min-h-[140px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-4 text-white">
              <div className="text-[11px] leading-tight font-medium">
                <div className="font-bold flex items-center gap-1.5 text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  NH-48 Expressway Corridor
                </div>
                <div className="text-slate-300 text-[10px] mt-0.5">PM GatiShakti Multi-Modal Grid Survey</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Attention Banner if any */}
      {delayedProjects.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-amber-900">
                Action Required: {delayedProjects.length} Projects with Statutory Milestone Delays Detected
              </span>
              <p className="text-amber-800 text-[11px]">
                {delayedProjects.map(p => p.name).join(' • ')} have crossed the acceptable timeline for land mutation or award declaration.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('alerts')}
            className="text-amber-900 font-bold hover:underline flex items-center gap-1 whitespace-nowrap ml-4"
          >
            Review Decision Support <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Core Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Projects</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums tracking-tight">{totalProjects}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-emerald-700 font-bold">5 Priority</span>
            <span>·</span>
            <span>1 Completed</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Land Proposed</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums tracking-tight">
            {totalLandProposed.toLocaleString()} <span className="text-xs font-semibold text-slate-500 font-sans">Ha</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Notified: <span className="text-slate-800 font-semibold">{totalNotifiedArea.toFixed(1)} Ha</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Land Acquired</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2 font-mono tabular-nums tracking-tight">
            {totalLandAcquired.toFixed(1)} <span className="text-xs font-semibold text-slate-500 font-sans">Ha</span>
          </div>
          <div className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
            <span>{acquisitionPercentage}% Possession Handed</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Compensation Paid</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums tracking-tight">
            ₹{totalCompensationPaid.toFixed(1)} <span className="text-xs font-semibold text-slate-500 font-sans">Cr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Of ₹{totalCompensationAssessed.toFixed(1)} Cr ({compensationDisbursalPercentage}%)
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors col-span-2 md:col-span-4 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Affected Families</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums tracking-tight">
            {totalAffectedFamilies.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Rehabilitated: <strong className="text-purple-700">{totalRehabilitated}</strong> ({((totalRehabilitated / (totalDisplacedFamilies || 1)) * 100).toFixed(0)}%)
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State-wise Land Acquisition Chart Bar */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">State-wise Acquisition Progress (Hectares)</h3>
              <p className="text-[11px] text-slate-500">Proposed vs Acquired across priority economic corridors</p>
            </div>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              Full Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { state: 'Madhya Pradesh (Rewa Solar)', proposed: 1250, acquired: 1210, color: 'bg-emerald-500' },
              { state: 'Gujarat (Dholera SIR)', proposed: 890, acquired: 645, color: 'bg-blue-600' },
              { state: 'West Bengal (EDFC Dankuni)', proposed: 520, acquired: 312, color: 'bg-amber-500' },
              { state: 'Telangana (Kaleshwaram)', proposed: 410, acquired: 215, color: 'bg-rose-500' },
              { state: 'Maharashtra (NH-48 Corridor)', proposed: 340.5, acquired: 275.8, color: 'bg-indigo-600' },
            ].map((item) => {
              const pct = ((item.acquired / item.proposed) * 100).toFixed(1);
              return (
                <div key={item.state} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.state}</span>
                    <span className="text-slate-500 font-mono">
                      <strong className="text-slate-900">{item.acquired} Ha</strong> / {item.proposed} Ha ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${item.color}`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats Ticker */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50 rounded-lg p-2.5">
              <div className="text-xs font-semibold text-slate-500">Possession Completed</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">{totalPossessionCompleted.toFixed(1)} Ha</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5">
              <div className="text-xs font-semibold text-slate-500">Pending Awards</div>
              <div className="text-base font-bold text-amber-700 mt-0.5">₹{(totalCompensationAssessed - totalCompensationPaid).toFixed(1)} Cr</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5">
              <div className="text-xs font-semibold text-slate-500">Pending Approvals</div>
              <div className="text-base font-bold text-blue-700 mt-0.5">{proposals.filter(p => p.status === 'Submitted' || p.status === 'Under Scrutiny').length} Cases</div>
            </div>
          </div>
        </div>

        {/* Stage Funnel / Stepper Overview */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Statutory Acquisition Lifecycle</h3>
              <span className="text-[10px] uppercase font-bold text-slate-500">RFCTLARR 2013</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              Real-time distribution of projects across the 10 statutory lifecycle stages.
            </p>

            <div className="space-y-2 text-xs">
              {[
                { stage: '1. Proposal & SIA', count: proposals.length, color: 'text-indigo-600', dot: 'bg-indigo-600' },
                { stage: '2. Scrutiny & Approval', count: 1, color: 'text-blue-600', dot: 'bg-blue-600' },
                { stage: '3. Section 3A/4 Notification', count: 1, color: 'text-cyan-600', dot: 'bg-cyan-600' },
                { stage: '4. Cadastral Survey & 3D', count: 1, color: 'text-amber-600', dot: 'bg-amber-600' },
                { stage: '5. Section 3G Award & Solatium', count: 1, color: 'text-orange-600', dot: 'bg-orange-600' },
                { stage: '6. DBT Compensation', count: 1, color: 'text-rose-600', dot: 'bg-rose-600' },
                { stage: '7. Possession & Handover', count: 1, color: 'text-purple-600', dot: 'bg-purple-600' },
                { stage: '8. R&R Resettlement Colony', count: 1, color: 'text-emerald-600', dot: 'bg-emerald-600' },
                { stage: '9. Completed & Commissioned', count: 1, color: 'text-teal-600', dot: 'bg-teal-600' }
              ].map((item) => (
                <div key={item.stage} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.dot}`}></span>
                    <span className="font-medium text-slate-800">{item.stage}</span>
                  </div>
                  <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('gis_map')}
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            Open Interactive GIS Parcel Map
          </button>
        </div>
      </div>

      {/* Active Projects Table Snapshot */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">National Priority Land Acquisition Projects</h3>
            <p className="text-xs text-slate-500">Real-time status across infrastructure ministries</p>
          </div>
          <button 
            onClick={() => setActiveTab('projects')}
            className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1"
          >
            View All Projects in Registry <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Project ID & Title</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Agency</th>
                <th className="py-3 px-4">Land (Ha)</th>
                <th className="py-3 px-4">Acquired %</th>
                <th className="py-3 px-4">Compensation</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{proj.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{proj.id} • {proj.category}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{proj.district}</div>
                    <div className="text-[11px] text-slate-500">{proj.state}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800">{proj.implementingAgency}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <span className="font-bold text-slate-900">{proj.landAcquiredHa}</span>
                    <span className="text-slate-400 font-normal"> / {proj.totalLandProposedHa}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${
                            proj.acquisitionPercentage >= 75 ? 'bg-emerald-600' :
                            proj.acquisitionPercentage >= 40 ? 'bg-blue-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${proj.acquisitionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-900 font-mono tabular-nums text-xs">{proj.acquisitionPercentage}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <div className="font-bold text-emerald-700">₹{proj.compensationPaidCr} Cr</div>
                    <div className="text-[10px] text-slate-400 font-sans">Assessed: ₹{proj.compensationAssessedCr} Cr</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      proj.status === 'Completed' ? 'text-emerald-700' :
                      proj.isDelayed ? 'text-rose-700' :
                      'text-slate-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        proj.status === 'Completed' ? 'bg-emerald-600' :
                        proj.isDelayed ? 'bg-rose-600' :
                        'bg-blue-600'
                      }`}></span>
                      <span>{proj.status}</span>
                      {proj.isDelayed && <span className="text-[10px] text-rose-500">(Delayed)</span>}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setActiveTab('project_details');
                      }}
                      className="text-xs bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-slate-300 transition-colors shadow-2xs"
                    >
                      Open File
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
