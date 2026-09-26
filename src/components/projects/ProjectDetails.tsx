import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Users, 
  FileText, 
  Layers, 
  Building2, 
  ShieldCheck,
  Calendar,
  Send,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ProjectStatus } from '../../types';

export const ProjectDetails: React.FC = () => {
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    setActiveTab, 
    updateProjectStatus, 
    parcels, 
    beneficiaries, 
    documents,
    currentUser 
  } = useApp();

  const [transitionStatus, setTransitionStatus] = useState<ProjectStatus>('Compensation');
  const [transitionRemarks, setTransitionRemarks] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const project = projects.find(p => p.id === selectedProjectId) || projects[0];

  const projectParcels = parcels.filter(p => p.projectId === project.id);
  const projectBeneficiaries = beneficiaries.filter(b => b.projectId === project.id);
  const projectDocs = documents.filter(d => d.projectId === project.id);

  const STAGES: ProjectStatus[] = [
    'Proposal',
    'Scrutiny',
    'Approval',
    'Notification',
    'Land Survey',
    'Award',
    'Compensation',
    'Possession',
    'R&R',
    'Completed'
  ];

  const currentStageIndex = STAGES.indexOf(project.currentStage as ProjectStatus);

  const handleStatusChange = async () => {
    if (!transitionStatus) return;
    await updateProjectStatus(project.id, transitionStatus, transitionRemarks);
    setShowStatusModal(false);
    setTransitionRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Back Button and Overview Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('projects')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project Registry</span>
        </button>

        <div className="flex items-center gap-2">
          {currentUser.role !== 'viewer' && (
            <button
              onClick={() => {
                setTransitionStatus(project.status);
                setShowStatusModal(true);
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Transition Statutory Stage</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('gis_map')}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>View on GIS</span>
          </button>
        </div>
      </div>

      {/* Main Project Dossier Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 font-semibold mb-1">
              <span className="font-mono text-slate-800 font-bold">{project.id}</span>
              <span>·</span>
              <span>{project.category}</span>
              <span>·</span>
              <span className={`inline-flex items-center gap-1.5 font-bold ${
                project.isDelayed ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${project.isDelayed ? 'bg-rose-600' : 'bg-emerald-600'}`} />
                Current Stage: {project.status} {project.isDelayed && '(Delayed)'}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-4xl">
              {project.description}
            </p>
          </div>

          <div className="lg:text-right shrink-0">
            <div className="text-[11px] text-slate-500">Implementing Authority</div>
            <div className="font-bold text-slate-900 text-xs">{project.implementingAgency}</div>
            <div className="text-[11px] text-slate-500 mt-1">SLA Benchmark Deadline</div>
            <div className="font-mono text-xs font-bold text-slate-800">{project.slaDeadline}</div>
          </div>
        </div>

        {/* 10-Stage Statutory Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Statutory RFCTLARR Acquisition Stepper (10 Stages)
            </span>
            <span className="text-[11px] font-semibold text-blue-700">
              Stage {currentStageIndex + 1} of 10 ({project.status})
            </span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[850px] flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0"></div>

              {STAGES.map((stg, index) => {
                const isPassed = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div key={stg} className="flex flex-col items-center relative z-10 text-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100'
                        : isPassed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {isPassed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={`text-[10px] mt-1.5 font-semibold max-w-[80px] leading-tight ${
                      isCurrent ? 'text-blue-700 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {stg}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Dossier Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Total Land Proposed</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono tabular-nums tracking-tight">
            {project.totalLandProposedHa} <span className="text-xs font-semibold text-slate-500 font-sans">Ha</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Notified: {project.notifiedAreaHa} Ha</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Land Acquired (Possession)</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1 font-mono tabular-nums tracking-tight">
            {project.landAcquiredHa} <span className="text-xs font-semibold text-slate-500 font-sans">Ha</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {project.acquisitionPercentage}% Handover Achieved
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Compensation Assessed</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono tabular-nums tracking-tight">
            ₹{project.compensationAssessedCr} <span className="text-xs font-semibold text-slate-500 font-sans">Cr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Paid: ₹{project.compensationPaidCr} Cr via DBT</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Affected Families &amp; R&amp;R</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono tabular-nums tracking-tight">
            {project.affectedFamilies}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Rehabilitated: <strong className="text-purple-700">{project.rehabilitatedFamilies}</strong> ({project.displacedFamilies} displaced)
          </div>
        </div>
      </div>

      {/* Sub-Tabs / Section Details: Land Parcels & Beneficiaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cadastral Parcels Linked to this project */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Survey Parcels Linked ({projectParcels.length})</h3>
              <p className="text-[11px] text-slate-500">Cadastral plot entries from Revenue Land Records</p>
            </div>
            <button 
              onClick={() => setActiveTab('gis_map')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              GIS View <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {projectParcels.length === 0 ? (
              <div className="text-xs text-slate-500 py-6 text-center">No cadastral plots linked to this project yet.</div>
            ) : (
              projectParcels.map(p => (
                <div key={p.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">Survey No. {p.surveyNumber}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">{p.id}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Village {p.village}, Taluka {p.tehsil} • {p.areaHa} Ha ({p.landType})
                      </div>
                      <div className="text-[11px] font-medium text-slate-800 mt-1">
                        Holder: {p.ownerName}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {p.acquisitionStatus}
                      </span>
                      <div className="text-xs font-mono font-bold text-emerald-700 mt-1">
                        ₹{(p.compensationAmount / 100000).toFixed(1)} Lakh
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Documents & Gazette Repository for this project */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Statutory Documents & Gazettes ({projectDocs.length})</h3>
              <p className="text-[11px] text-slate-500">Notified declarations & survey records</p>
            </div>
            <button 
              onClick={() => setActiveTab('documents')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              View Repository <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {projectDocs.length === 0 ? (
              <div className="text-xs text-slate-500 py-6 text-center">No documents uploaded for this project yet.</div>
            ) : (
              projectDocs.map(doc => (
                <div key={doc.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {doc.fileType}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                      <p className="text-[10px] text-slate-500">{doc.category} • {doc.fileSizeMb} MB • {doc.version}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for Transitioning Status */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Statutory Stage Transition for {project.id}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select the new RFCTLARR statutory stage and record formal administrative remarks into the permanent audit trail.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Stage</label>
                <select
                  value={transitionStatus}
                  onChange={(e) => setTransitionStatus(e.target.value as ProjectStatus)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  {STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Administrative Remarks / Gazette Reference</label>
                <textarea
                  rows={3}
                  value={transitionRemarks}
                  onChange={(e) => setTransitionRemarks(e.target.value)}
                  placeholder="e.g. Gazette notification Sec 3G published in State Gazette Part II. Valuation vetted by Special Land Acquisition Officer."
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="px-4 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-bold hover:bg-blue-800"
              >
                Confirm & Record in Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
