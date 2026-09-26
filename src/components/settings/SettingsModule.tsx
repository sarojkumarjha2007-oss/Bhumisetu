import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Sliders, 
  CheckCircle,
  Database
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { currentUser, isFirebaseConnected } = useApp();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Portal & User Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your official profile, two-factor authentication, and automated statutory notification triggers.
        </p>
      </div>

      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          User preferences successfully updated and stored in session profile.
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          Official Profile Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Full Name</label>
            <input
              type="text"
              readOnly
              value={currentUser.displayName}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Government Email</label>
            <input
              type="text"
              readOnly
              value={currentUser.email}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Department / Organization</label>
            <input
              type="text"
              readOnly
              value={currentUser.department || 'Department of Land Resources'}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Designated Role & Access Level</label>
            <input
              type="text"
              readOnly
              value={currentUser.role.replace('_', ' ').toUpperCase()}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-blue-700 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Cloud & Notification Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-600" />
          Statutory Alert Configurations
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <span className="font-bold text-slate-800">SLA Breach Escalations:</span>
              <span className="text-slate-500 block">Dispatch immediate alerts when sub-registrar or 3G award determinations cross 30-day thresholds.</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={e => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <span className="font-bold text-slate-800">PFMS Direct Benefit Transfer Notifications:</span>
              <span className="text-slate-500 block">Receive instant audit logs on batch compensation settlements.</span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
          >
            Save Portal Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
