import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Map, 
  FilePlus2, 
  CheckSquare, 
  Banknote, 
  Home, 
  FileText, 
  BarChart3, 
  FileSpreadsheet, 
  AlertTriangle, 
  Bot, 
  History, 
  Smartphone, 
  Globe2, 
  Settings,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    alerts, 
    proposals,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    resetDemoData
  } = useApp();

  const pendingApprovalsCount = proposals.filter(p => p.status === 'Under Scrutiny' || p.status === 'Submitted').length;
  const criticalAlertsCount = alerts.filter(a => a.riskLevel === 'Critical' || a.riskLevel === 'High').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'projects', label: 'Projects Registry', icon: FolderKanban, badge: null },
    { id: 'gis_map', label: 'Land Parcel GIS', icon: Map, badge: 'Live GIS' },
    { id: 'proposals', label: 'Proposal Workflow', icon: FilePlus2, badge: null },
    { id: 'approvals', label: 'Scrutiny & Approvals', icon: CheckSquare, badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : null },
    { id: 'compensation', label: 'Compensation & DBT', icon: Banknote, badge: null },
    { id: 'rr', label: 'Rehabilitation (R&R)', icon: Home, badge: null },
    { id: 'documents', label: 'Documents & Gazettes', icon: FileText, badge: null },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3, badge: null },
    { id: 'reports', label: 'MIS Reports & Export', icon: FileSpreadsheet, badge: null },
    { id: 'alerts', label: 'Decision Support & Alerts', icon: AlertTriangle, badge: criticalAlertsCount > 0 ? `${criticalAlertsCount}!` : null, badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'field_officer', label: 'Field Officer App', icon: Smartphone, badge: 'Mobile' },
    { id: 'public_view', label: 'Public Transparency', icon: Globe2, badge: null },
    { id: 'ai_assistant', label: 'BhumiSetu AI Desk', icon: Bot, badge: 'AI' },
    { id: 'audit_logs', label: 'Audit Trail', icon: History, badge: null },
    { id: 'settings', label: 'Portal Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 md:static w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-80px)] border-r border-slate-800 transition-transform duration-200 ease-in-out ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Current User Role Card */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-sm">
              {currentUser.displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{currentUser.displayName}</div>
              <div className="text-[11px] text-blue-400 capitalize truncate font-mono">
                {currentUser.role.replace('_', ' ')}
              </div>
              {currentUser.district && (
                <div className="text-[10px] text-slate-400 truncate">
                  {currentUser.district}, {currentUser.state}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Modules
          </div>
          {menuItems.slice(0, 11).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Specialized Views & AI
          </div>
          {menuItems.slice(11).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Prototype Footer Note & Reset */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH 2026 Sandbox</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all land projects, parcels and DBT compensations to default sample demo state?')) {
                  resetDemoData();
                }
              }}
              className="text-[10px] text-slate-400 hover:text-white underline"
            >
              Reset Data
            </button>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
            Production demonstration prototype. All landowner data is synthetic.
          </div>
        </div>
      </aside>
    </>
  );
};
