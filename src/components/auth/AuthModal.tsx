import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/initialData';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { UserRole } from '../../types';

export const AuthModal: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { switchRole, currentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('national_admin');
  const [password, setPassword] = useState('GovPortal@2026');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    onLoginSuccess();
  };

  const handleDirectRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    switchRole(role);
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl border border-slate-200">
        {/* Emblem & Title */}
        <div className="text-center mb-6">
          <img 
            src="/src/assets/images/gov_india_emblem_1790406961533.jpg" 
            alt="National Emblem Seal" 
            className="w-16 h-16 rounded-xl object-contain mx-auto border border-slate-200 shadow-sm p-1 bg-white"
          />
          <h2 className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
            BhumiSetu · भूमिसेतु
          </h2>
          <p className="text-xs text-slate-500 font-semibold tracking-wide mt-0.5">
            National Land Acquisition &amp; Management System
          </p>
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
            Department of Land Resources (DoLR), MoRD · SIH 2026
          </div>
        </div>

        {/* Quick Demo Persona Fast-Login Buttons */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold text-slate-700 block">
            Select Demo Persona (Instant Role Testing):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_USERS.map((user) => (
              <button
                key={user.role}
                onClick={() => handleDirectRoleSelect(user.role)}
                className={`p-2.5 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${
                  selectedRole === user.role
                    ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="truncate font-semibold">{user.displayName.split(',')[0]}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{user.role.replace('_', ' ')}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Form Fallback */}
        <form onSubmit={handleLogin} className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Demo Credentials (Preset)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={DEMO_USERS.find(u => u.role === selectedRole)?.email}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono"
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-40 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md transition-colors"
          >
            Enter BhumiSetu National Platform
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          Ministry of Rural Development • Department of Land Resources (DoLR) • Sandbox Mode
        </p>
      </div>
    </div>
  );
};
