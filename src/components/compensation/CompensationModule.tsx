import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Banknote, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  ArrowUpRight, 
  ShieldCheck,
  CreditCard,
  Send,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CompensationModule: React.FC = () => {
  const { beneficiaries, disburseCompensation, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filtered = beneficiaries.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.surveyNumber.includes(searchTerm) ||
                        b.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAssessed = beneficiaries.reduce((acc, b) => acc + b.totalEntitlementInr, 0);
  const totalPaid = beneficiaries.reduce((acc, b) => acc + b.disbursedAmountInr, 0);
  const pendingAmount = totalAssessed - totalPaid;

  const handleDisbursement = async (benId: string) => {
    setProcessingId(benId);
    try {
      await disburseCompensation(benId);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Direct Benefit Transfer</span>
            <span>·</span>
            <span className="text-emerald-700 font-bold">Public Financial Management System (PFMS)</span>
            <span>·</span>
            <span className="text-blue-700 font-semibold">100% Solatium Statutory Ledger</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            PFMS Electronic Compensation &amp; Beneficiary Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Automated double valuation formula under Section 30 of RFCTLARR Act 2013. Direct account transfers to authenticated Aadhaar-linked savings accounts with institutional audit hashes.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="text-xs font-semibold text-slate-500">Total Compensation Assessed</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1.5 font-mono tabular-nums tracking-tight">
            ₹{(totalAssessed / 10000000).toFixed(2)} <span className="text-xs font-semibold text-slate-500 font-sans">Cr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across {beneficiaries.length} verified titleholders</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="text-xs font-semibold text-slate-500">Total Disbursed (Paid)</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1.5 font-mono tabular-nums tracking-tight">
            ₹{(totalPaid / 10000000).toFixed(2)} <span className="text-xs font-semibold text-slate-500 font-sans">Cr</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {((totalPaid / (totalAssessed || 1)) * 100).toFixed(1)}% Liquidation Achieved
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="text-xs font-semibold text-slate-500">Pending DBT Liquidation</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1.5 font-mono tabular-nums tracking-tight">
            ₹{(pendingAmount / 10000000).toFixed(2)} <span className="text-xs font-semibold text-slate-500 font-sans">Cr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">In Treasury SLA clearance queue</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="text-xs font-semibold text-slate-500">Solatium Multiplier Factor</div>
          <div className="text-xl font-extrabold text-blue-700 mt-1.5 font-mono">
            100% Solatium (2.0×)
          </div>
          <div className="text-[11px] text-slate-500 mt-1">RFCTLARR 2013 First Schedule</div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search beneficiary, survey no or village..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Payment Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800"
            >
              <option value="All">All ({beneficiaries.length})</option>
              <option value="Paid">Disbursed / Paid</option>
              <option value="Payment Pending">Payment Pending</option>
              <option value="Disputed">Disputed / Injunction</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Beneficiary & Titleholder</th>
                <th className="py-3 px-4">Cadastral Plot</th>
                <th className="py-3 px-4">PFMS Bank & IFSC</th>
                <th className="py-3 px-4">Market Value</th>
                <th className="py-3 px-4">100% Solatium</th>
                <th className="py-3 px-4">Total Entitlement</th>
                <th className="py-3 px-4">DBT Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{b.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Aadhaar: {b.aadhaarMasked}</div>
                    <div className="text-[10px] text-slate-500">{b.projectName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">Survey {b.surveyNumber}</div>
                    <div className="text-[11px] text-slate-500">{b.village}, {b.district} ({b.landAreaHa} Ha)</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="text-slate-800">{b.bankAccountMasked}</div>
                    <div className="text-[10px] text-slate-400">{b.ifscCode}</div>
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums">
                    ₹{(b.assessedAmountInr / 100000).toFixed(1)} L
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-blue-700">
                    + ₹{(b.solatiumAmountInr / 100000).toFixed(1)} L
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums font-bold text-slate-900">
                    ₹{(b.totalEntitlementInr / 100000).toFixed(1)} Lakh
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      b.status === 'Paid' ? 'text-emerald-700' :
                      b.status === 'Payment Pending' ? 'text-amber-700' :
                      b.status === 'Disputed' ? 'text-rose-700' :
                      'text-slate-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        b.status === 'Paid' ? 'bg-emerald-600' :
                        b.status === 'Payment Pending' ? 'bg-amber-500' :
                        b.status === 'Disputed' ? 'bg-rose-600' :
                        'bg-slate-400'
                      }`} />
                      {b.status}
                    </span>
                    {b.transactionId && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{b.transactionId}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {b.status === 'Payment Pending' && currentUser.role !== 'viewer' ? (
                      <button
                        onClick={() => handleDisbursement(b.id)}
                        disabled={processingId === b.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Send className="w-3 h-3" />
                        {processingId === b.id ? 'Releasing...' : 'Release DBT'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {b.status === 'Paid' ? `Paid ${b.paymentDate}` : 'Under Review'}
                      </span>
                    )}
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
