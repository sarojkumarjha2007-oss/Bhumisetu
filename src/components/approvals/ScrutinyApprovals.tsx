import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Clock, 
  MapPin, 
  FileText, 
  AlertCircle,
  Building,
  ShieldCheck,
  ChevronRight,
  Eye
} from 'lucide-react';
import { ProposalItem } from '../../types';

export const ScrutinyApprovals: React.FC = () => {
  const { proposals, updateProposalStatus, currentUser } = useApp();
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);
  const [actionModalType, setActionModalType] = useState<'Approve' | 'Return' | 'Reject' | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');

  const handleAction = async () => {
    if (!selectedProposal || !actionModalType) return;
    
    let targetStatus: ProposalItem['status'] = 'Approved';
    if (actionModalType === 'Return') targetStatus = 'Returned';
    if (actionModalType === 'Reject') targetStatus = 'Rejected';

    await updateProposalStatus(selectedProposal.id, targetStatus, reviewRemarks);
    setActionModalType(null);
    setSelectedProposal(null);
    setReviewRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              State & District Scrutiny Queue
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {proposals.filter(p => p.status === 'Submitted' || p.status === 'Under Scrutiny').length} Pending Scrutiny
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Statutory scrutiny of preliminary land requisitions, SIA social assessments, and Collectorate vetting.
          </p>
        </div>
      </div>

      {/* Scrutiny Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Proposal Reference</th>
                <th className="py-3 px-4">Proposing Body</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Land (Ha)</th>
                <th className="py-3 px-4">Est. Cost</th>
                <th className="py-3 px-4">SLA Deadline</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Scrutiny Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {proposals.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{prop.projectTitle}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{prop.id} • {prop.category}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {prop.proposingAgency}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{prop.district}</div>
                    <div className="text-[11px] text-slate-500">{prop.state} ({prop.affectedVillagesCount} Villages)</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {prop.landRequiredHa} Ha
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    ₹{prop.approxCostCr} Cr
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 font-mono font-semibold text-[11px] px-2 py-0.5 rounded ${
                      prop.slaDaysRemaining < 5 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {prop.slaDaysRemaining} Days left
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      prop.status === 'Approved' ? 'text-emerald-700' :
                      prop.status === 'Under Scrutiny' ? 'text-blue-700' :
                      prop.status === 'Returned' ? 'text-amber-700' :
                      prop.status === 'Rejected' ? 'text-rose-700' :
                      'text-slate-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        prop.status === 'Approved' ? 'bg-emerald-600' :
                        prop.status === 'Under Scrutiny' ? 'bg-blue-600' :
                        prop.status === 'Returned' ? 'bg-amber-500' :
                        prop.status === 'Rejected' ? 'bg-rose-600' :
                        'bg-slate-400'
                      }`} />
                      {prop.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedProposal(prop)}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg border border-blue-200 text-xs transition-colors"
                    >
                      Inspect File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposal Inspection Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  {selectedProposal.id}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedProposal.projectTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  Submitted by {selectedProposal.proposingAgency} on {selectedProposal.submissionDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Dossier Specs */}
            <div className="my-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500">Location:</span>
                  <div className="font-bold text-slate-900">{selectedProposal.district}, {selectedProposal.state}</div>
                </div>
                <div>
                  <span className="text-slate-500">Land Requisitioned:</span>
                  <div className="font-bold text-slate-900 font-mono">{selectedProposal.landRequiredHa} Hectares</div>
                </div>
                <div>
                  <span className="text-slate-500">Estimated Cost:</span>
                  <div className="font-bold text-emerald-700 font-mono">₹{selectedProposal.approxCostCr} Crores</div>
                </div>
                <div>
                  <span className="text-slate-500">Affected Families:</span>
                  <div className="font-bold text-slate-900 font-mono">{selectedProposal.estimatedFamilies} Families</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Public Purpose Justification</h4>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedProposal.justification}
                </p>
              </div>

              {selectedProposal.reviewRemarks && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Previous Scrutiny Remarks</h4>
                  <p className="text-slate-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 italic">
                    "{selectedProposal.reviewRemarks}"
                  </p>
                </div>
              )}
            </div>

            {/* Scrutiny Decision Buttons */}
            {currentUser.role !== 'viewer' && selectedProposal.status !== 'Approved' && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setActionModalType('Reject')}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                >
                  Reject Proposal
                </button>
                <button
                  onClick={() => setActionModalType('Return')}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold transition-colors"
                >
                  Return for Rectification
                </button>
                <button
                  onClick={() => setActionModalType('Approve')}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Sanction & Issue 4(1) Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Action Modal */}
      {actionModalType && selectedProposal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Confirm Action: {actionModalType} Proposal {selectedProposal.id}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {actionModalType === 'Approve' && 'Sanctioning this proposal will automatically instantiate a live infrastructure project under Preliminary Notification.'}
              {actionModalType === 'Return' && 'The requisitioning agency will be instructed to rectify alignment/documentation deficiencies.'}
              {actionModalType === 'Reject' && 'Formal statutory rejection order will be published and logged into the audit ledger.'}
            </p>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Official Administrative Order Remarks
              </label>
              <textarea
                rows={3}
                value={reviewRemarks}
                onChange={e => setReviewRemarks(e.target.value)}
                placeholder="Enter mandatory scrutiny remarks / notification order number..."
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setActionModalType(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className={`px-4 py-1.5 rounded-lg text-white text-xs font-bold ${
                  actionModalType === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  actionModalType === 'Return' ? 'bg-amber-600 hover:bg-amber-700' :
                  'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {actionModalType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
