import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Search, 
  Bell, 
  CheckCircle2, 
  UserCheck, 
  LogOut, 
  ShieldAlert, 
  ChevronDown,
  Layers,
  Sparkles,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { DEMO_USERS } from '../../data/initialData';
import { UserRole } from '../../types';

export const TopNavigation: React.FC<{ onOpenAuthModal?: () => void }> = ({ onOpenAuthModal }) => {
  const { 
    currentUser, 
    switchRole, 
    notifications, 
    markNotificationRead,
    setActiveTab,
    isFirebaseConnected,
    isSyncing,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    projects,
    setSelectedProjectId
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; type: string }[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const matched = projects
      .filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase()) || p.district.toLowerCase().includes(q.toLowerCase()))
      .map(p => ({ id: p.id, name: p.name, type: 'Project' }));
    setSearchResults(matched.slice(0, 5));
  };

  const roleLabels: Record<UserRole, { title: string; color: string; bg: string }> = {
    national_admin: { title: 'Central Ministry / National Admin', color: 'text-indigo-800', bg: 'bg-indigo-50 border-indigo-200' },
    state_admin: { title: 'State Admin (Revenue Sec)', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' },
    district_officer: { title: 'District Authority (Collector / SLAO)', color: 'text-blue-800', bg: 'bg-blue-50 border-blue-200' },
    project_agency: { title: 'Implementing Agency (NHAI/DFCCIL)', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
    field_officer: { title: 'Field Officer (Surveyor / Amin)', color: 'text-purple-800', bg: 'bg-purple-50 border-purple-200' },
    viewer: { title: 'Public Transparency Viewer', color: 'text-slate-800', bg: 'bg-slate-100 border-slate-300' }
  };

  const currentRoleConfig = roleLabels[currentUser.role] || roleLabels.national_admin;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm w-full">
      {/* Gov Official Header Band */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1 text-xs flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            SIH 2026 PROTOTYPE / DEMO (PS 26016)
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">Department of Land Resources (DoLR), MoRD</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            {isSyncing ? 'Syncing Cloud DB...' : (isFirebaseConnected ? 'Firestore Connected' : 'Offline Storage')}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <button 
            onClick={onOpenAuthModal}
            className="hover:text-white underline font-semibold text-[10px]"
          >
            Login / Demo Switcher
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Mobile menu button + Logo and Titles */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            title="Toggle Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 text-left group"
          >
            <img 
              src="/src/assets/images/gov_india_emblem_1790406961533.jpg" 
              alt="National Emblem Seal" 
              className="w-10 h-10 rounded-lg object-contain bg-white p-0.5 border border-slate-200 shadow-xs group-hover:border-blue-600 transition-colors"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  BhumiSetu
                </span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                  भूमिसेतु राष्ट्रीय पोर्टल
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Department of Land Resources (DoLR), Ministry of Rural Development, GoI
              </p>
            </div>
          </button>
        </div>

        {/* Global Search & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative hidden lg:block w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search survey no, project, or parcel..." 
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
            />
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">Quick Matches</div>
                {searchResults.map(res => (
                  <div
                    key={res.id}
                    onClick={() => {
                      setSelectedProjectId(res.id);
                      setActiveTab('project_details');
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="p-2 rounded hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{res.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{res.id}</div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{res.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${currentRoleConfig.bg} ${currentRoleConfig.color}`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-500 font-normal uppercase leading-tight">Switch Persona</div>
                <div className="truncate max-w-[170px]">{currentUser.displayName.split(' ')[0]} ({currentUser.role.split('_')[0]})</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50">
                <div className="p-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">Select Demo Persona (Role)</div>
                  <div className="text-[11px] text-slate-500">Switching tests RBAC permissions & tailored dashboards.</div>
                </div>
                <div className="py-1 max-h-80 overflow-y-auto space-y-1">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.role}
                      onClick={() => {
                        switchRole(user.role);
                        setShowRoleMenu(false);
                        // Redirect field officer to field view or keep
                        if (user.role === 'field_officer') {
                          setActiveTab('field_officer');
                        } else if (user.role === 'viewer') {
                          setActiveTab('public_view');
                        }
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                        currentUser.role === user.role ? 'bg-blue-50 text-blue-900 border border-blue-200 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-700 font-bold text-xs mt-0.5">
                        {user.displayName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{user.displayName}</span>
                          {currentUser.role === user.role && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                        <div className="text-[11px] text-slate-500 capitalize">{user.role.replace('_', ' ')}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.department}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50">
                <div className="p-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Notifications & Alerts</h3>
                    <p className="text-[11px] text-slate-500">Real-time alerts on SLA, approvals & DBT</p>
                  </div>
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.projectId) {
                          if (n.projectId.startsWith('PRJ-')) {
                            setSelectedProjectId(n.projectId);
                            setActiveTab('project_details');
                          } else if (n.projectId.startsWith('PROP-')) {
                            setActiveTab('approvals');
                          }
                        }
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Quick Login / Persona Button */}
            <button
              onClick={onOpenAuthModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Open Demo Login Modal"
            >
              <LogOut className="w-3.5 h-3.5 rotate-180" />
              <span>Login / Roles</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

