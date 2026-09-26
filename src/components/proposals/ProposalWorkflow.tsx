import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Building, 
  DollarSign, 
  Users, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProposalWorkflow: React.FC = () => {
  const { addProposal, setActiveTab, currentUser } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Form State across 7 Steps
  const [formData, setFormData] = useState({
    // Step 1: Project Information
    projectTitle: 'Nagpur-Goa Shaktipeeth Expressway Package 07',
    proposingAgency: 'Maharashtra State Road Development Corp (MSRDC)',
    category: 'Highways & Expressways',
    justification: 'Economic growth corridor connecting Vidarbha, Marathwada, and Western Maharashtra pilgrimage centers with modern multi-modal logistics.',
    priority: 'High' as 'High' | 'Medium' | 'Low' | 'Urgent',

    // Step 2: Land Requirement
    landRequiredHa: 485.5,
    landTypeSplit: {
      agriculturalHa: 380.0,
      forestHa: 45.5,
      governmentBarrenHa: 60.0
    },

    // Step 3: Location and Coordinates
    state: 'Maharashtra',
    district: 'Kolhapur',
    tehsil: 'Hatkanangale',
    affectedVillagesCount: 14,
    centerLat: 16.7050,
    centerLng: 74.2433,

    // Step 4: Affected Families & SIA
    estimatedFamilies: 620,
    displacedFamilies: 110,
    siaAgency: 'Gokhale Institute of Politics and Economics, Pune',

    // Step 5: Estimated Compensation
    approxCostCr: 720.0,
    solatiumRate: '100% (Double Valuation under Sec 30 RFCTLARR)',
    rehabilitationGrantCr: 45.0,

    // Step 6: Documents
    dprUploaded: true,
    cadastralMapUploaded: true,
    forestNocPending: true,

    // Submitter
    submittedBy: currentUser.displayName || 'Executive Engineer (Land), MSRDC'
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const generatedId = await addProposal({
        projectTitle: formData.projectTitle,
        proposingAgency: formData.proposingAgency,
        state: formData.state,
        district: formData.district,
        category: formData.category,
        landRequiredHa: Number(formData.landRequiredHa),
        approxCostCr: Number(formData.approxCostCr),
        affectedVillagesCount: Number(formData.affectedVillagesCount),
        estimatedFamilies: Number(formData.estimatedFamilies),
        priority: formData.priority,
        submittedBy: formData.submittedBy,
        justification: formData.justification,
        documentsCount: 4
      });

      setSubmittedId(generatedId);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    '1. Project Info',
    '2. Land Demand',
    '3. Spatial Location',
    '4. Social Impact',
    '5. Compensation',
    '6. Documents',
    '7. Review & Submit'
  ];

  if (submittedId) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-xs max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
          Proposal Registered Successfully
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-3">
          Land Acquisition Proposal Submitted
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Your proposal has entered the state scrutinizing queue with an allocated statutory reference:
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-6 font-mono text-xl font-bold text-blue-700">
          {submittedId}
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Assigned to <strong>State Revenue Commissioner / Collectorate</strong> for preliminary scrutiny within the 21-day statutory SLA window.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActiveTab('approvals')}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Go to Approval / Scrutiny Queue
          </button>
          <button
            onClick={() => {
              setSubmittedId(null);
              setCurrentStep(1);
            }}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Submit Another Proposal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Multi-Step Land Acquisition Proposal Submission
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory 7-Step requisition submission for acquiring private/government lands under RFCTLARR 2013.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200">
            Step {currentStep} of 7
          </span>
        </div>

        {/* Stepper Progress Header */}
        <div className="mt-6 grid grid-cols-7 gap-1">
          {stepsList.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;

            return (
              <div key={step} className="flex flex-col items-center text-center">
                <div className={`h-1.5 w-full rounded-full transition-all ${
                  isCompleted ? 'bg-emerald-600' : isActive ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
                <span className={`text-[10px] mt-1.5 truncate max-w-[80px] font-medium ${
                  isActive ? 'text-blue-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        {/* Step 1: Project Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 1: Infrastructure Project Fundamentals
            </h3>
            
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Project Full Title</label>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Proposing Authority / Department</label>
                <input
                  type="text"
                  value={formData.proposingAgency}
                  onChange={e => setFormData({ ...formData, proposingAgency: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Sector Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option value="Highways & Expressways">Highways & Expressways</option>
                  <option value="Railways & Freight">Railways & Freight</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Industrial Corridors">Industrial Corridors</option>
                  <option value="Irrigation & Water Resources">Irrigation & Water Resources</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Public Purpose Justification</label>
              <textarea
                rows={3}
                value={formData.justification}
                onChange={e => setFormData({ ...formData, justification: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>
          </div>
        )}

        {/* Step 2: Land Demand */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 2: Land Requirement & Classification Breakdown
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Total Net Land Required (Hectares)</label>
              <input
                type="number"
                value={formData.landRequiredHa}
                onChange={e => setFormData({ ...formData, landRequiredHa: Number(e.target.value) })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Agricultural Land (Ha)</label>
                <input
                  type="number"
                  value={formData.landTypeSplit.agriculturalHa}
                  onChange={e => setFormData({ 
                    ...formData, 
                    landTypeSplit: { ...formData.landTypeSplit, agriculturalHa: Number(e.target.value) } 
                  })}
                  className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded font-mono font-bold"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Forest / Eco Land (Ha)</label>
                <input
                  type="number"
                  value={formData.landTypeSplit.forestHa}
                  onChange={e => setFormData({ 
                    ...formData, 
                    landTypeSplit: { ...formData.landTypeSplit, forestHa: Number(e.target.value) } 
                  })}
                  className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded font-mono font-bold"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Govt / Barren Land (Ha)</label>
                <input
                  type="number"
                  value={formData.landTypeSplit.governmentBarrenHa}
                  onChange={e => setFormData({ 
                    ...formData, 
                    landTypeSplit: { ...formData.landTypeSplit, governmentBarrenHa: Number(e.target.value) } 
                  })}
                  className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location and GIS Coordinates */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 3: Administrative Location & Spatial Coordinates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">State / UT</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Taluka / Tehsil</label>
                <input
                  type="text"
                  value={formData.tehsil}
                  onChange={e => setFormData({ ...formData, tehsil: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Number of Affected Villages</label>
                <input
                  type="number"
                  value={formData.affectedVillagesCount}
                  onChange={e => setFormData({ ...formData, affectedVillagesCount: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Center Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.centerLat}
                  onChange={e => setFormData({ ...formData, centerLat: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Center Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.centerLng}
                  onChange={e => setFormData({ ...formData, centerLng: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Affected Families & SIA */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 4: Social Impact Assessment (SIA) & Affected Families
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Total Estimated Affected Families (Landholders + Livelihood)</label>
                <input
                  type="number"
                  value={formData.estimatedFamilies}
                  onChange={e => setFormData({ ...formData, estimatedFamilies: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Displaced Families (Physical Resettlement)</label>
                <input
                  type="number"
                  value={formData.displacedFamilies}
                  onChange={e => setFormData({ ...formData, displacedFamilies: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Designated Social Impact Assessment Agency</label>
              <input
                type="text"
                value={formData.siaAgency}
                onChange={e => setFormData({ ...formData, siaAgency: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>
          </div>
        )}

        {/* Step 5: Estimated Compensation */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 5: Compensation & Resettlement Budgeting (₹ Crores)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Estimated Total Financial Outlay (₹ Cr)</label>
                <input
                  type="number"
                  value={formData.approxCostCr}
                  onChange={e => setFormData({ ...formData, approxCostCr: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">R&R Infrastructure & Grant Budget (₹ Cr)</label>
                <input
                  type="number"
                  value={formData.rehabilitationGrantCr}
                  onChange={e => setFormData({ ...formData, rehabilitationGrantCr: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Applicable Statutory Solatium Rate</label>
              <input
                type="text"
                readOnly
                value={formData.solatiumRate}
                className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Step 6: Documents */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 6: Digital Document Repository & Geo-Spatial Maps
            </h3>

            <div className="space-y-3">
              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Detailed Project Report (DPR)</div>
                  <div className="text-[11px] text-slate-500">Alignment rationale and engineering survey (PDF, 18.2 MB)</div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Attached
                </span>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Geo-referenced Cadastral GIS Vector Map</div>
                  <div className="text-[11px] text-slate-500">Shapefile / KML polygon boundaries with survey numbers</div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Attached
                </span>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Administrative In-Principle Sanction</div>
                  <div className="text-[11px] text-slate-500">Order from Ministry / Department approving land requisition</div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Attached
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Review & Submit */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 7: Final Review & Submission Under RFCTLARR 2013
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Project Title:</span>
                <span className="font-bold text-slate-900">{formData.projectTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Proposing Authority:</span>
                <span className="font-semibold text-slate-900">{formData.proposingAgency}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-900">{formData.district}, {formData.state} ({formData.affectedVillagesCount} Villages)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Total Land Demand:</span>
                <span className="font-mono font-bold text-slate-900">{formData.landRequiredHa} Hectares</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Estimated Compensation:</span>
                <span className="font-mono font-bold text-emerald-700">₹{formData.approxCostCr} Crores</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Affected Families:</span>
                <span className="font-mono font-bold text-purple-700">{formData.estimatedFamilies} Families</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-start gap-2 bg-blue-50/70 p-3 rounded-lg border border-blue-200">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                By submitting this proposal, the requisitioning body certifies that minimal arable land has been requested and complies with Section 4(1) of RFCTLARR Act 2013.
              </span>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={prevStep}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              currentStep === 1 
                ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200' 
                : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              {isSubmitting ? 'Registering...' : 'Submit Land Requisition'}
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
