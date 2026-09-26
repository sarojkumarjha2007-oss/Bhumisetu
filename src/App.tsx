import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavigation } from './components/layout/TopNavigation';
import { Sidebar } from './components/layout/Sidebar';
import { NationalDashboard } from './components/dashboard/NationalDashboard';
import { ProjectRegistry } from './components/projects/ProjectRegistry';
import { ProjectDetails } from './components/projects/ProjectDetails';
import { GisMapModule } from './components/gis/GisMapModule';
import { ProposalWorkflow } from './components/proposals/ProposalWorkflow';
import { ScrutinyApprovals } from './components/approvals/ScrutinyApprovals';
import { CompensationModule } from './components/compensation/CompensationModule';
import { RehabilitationModule } from './components/rr/RehabilitationModule';
import { DocumentManagement } from './components/documents/DocumentManagement';
import { AnalyticsModule } from './components/analytics/AnalyticsModule';
import { MisReports } from './components/reports/MisReports';
import { DecisionSupport } from './components/alerts/DecisionSupport';
import { AiAssistantModal } from './components/ai/AiAssistantModal';
import { FieldOfficerApp } from './components/field/FieldOfficerApp';
import { PublicTransparencyView } from './components/public/PublicTransparencyView';
import { AuditTrail } from './components/audit/AuditTrail';
import { SettingsModule } from './components/settings/SettingsModule';
import { AuthModal } from './components/auth/AuthModal';
import { Bot, HelpCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFloatingAi, setShowFloatingAi] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NationalDashboard />;
      case 'projects':
        return <ProjectRegistry />;
      case 'project_details':
        return <ProjectDetails />;
      case 'gis_map':
        return <GisMapModule />;
      case 'proposals':
        return <ProposalWorkflow />;
      case 'approvals':
        return <ScrutinyApprovals />;
      case 'compensation':
        return <CompensationModule />;
      case 'rr':
        return <RehabilitationModule />;
      case 'documents':
        return <DocumentManagement />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'reports':
        return <MisReports />;
      case 'alerts':
        return <DecisionSupport />;
      case 'ai_assistant':
        return <AiAssistantModal />;
      case 'field_officer':
        return <FieldOfficerApp />;
      case 'public_view':
        return <PublicTransparencyView />;
      case 'audit_logs':
        return <AuditTrail />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <NationalDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <TopNavigation onOpenAuthModal={() => setShowAuthModal(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-16">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Floating AI Assistant Trigger */}
      {activeTab !== 'ai_assistant' && (
        <button
          onClick={() => setActiveTab('ai_assistant')}
          className="fixed bottom-6 right-6 z-40 bg-blue-700 hover:bg-blue-800 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
          title="BhumiSetu AI Desk"
        >
          <Bot className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Ask BhumiSetu AI</span>
        </button>
      )}

      {showAuthModal && (
        <AuthModal onLoginSuccess={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
