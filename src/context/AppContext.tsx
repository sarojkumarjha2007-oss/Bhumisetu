import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  LandProject, 
  LandParcel, 
  ProposalItem, 
  Beneficiary, 
  DocumentItem, 
  AuditLog, 
  SmartAlert, 
  NotificationItem 
} from '../types';
import { 
  DEMO_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_PARCELS, 
  INITIAL_PROPOSALS, 
  INITIAL_BENEFICIARIES, 
  INITIAL_DOCUMENTS, 
  INITIAL_ALERTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';
import { db } from '../lib/firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  projects: LandProject[];
  parcels: LandParcel[];
  proposals: ProposalItem[];
  beneficiaries: Beneficiary[];
  documents: DocumentItem[];
  alerts: SmartAlert[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  
  // Actions
  addProject: (project: LandProject) => Promise<void>;
  updateProjectStatus: (id: string, newStatus: LandProject['status'], remarks?: string) => Promise<void>;
  addProposal: (proposal: Omit<ProposalItem, 'id' | 'submissionDate' | 'slaDaysRemaining' | 'status'>) => Promise<string>;
  updateProposalStatus: (id: string, status: ProposalItem['status'], remarks?: string) => Promise<void>;
  updateParcelVerification: (parcelId: string, remarks: string, verified: boolean) => Promise<void>;
  disburseCompensation: (beneficiaryId: string) => Promise<void>;
  addDocument: (docItem: Omit<DocumentItem, 'id' | 'uploadDate' | 'hash'>) => Promise<void>;
  markNotificationRead: (id: string) => void;
  isFirebaseConnected: boolean;
  isSyncing: boolean;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  resetDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bhumisetu_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_USERS[0]; // Default National Admin
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Core Data States
  const [projects, setProjects] = useState<LandProject[]>(() => {
    const saved = localStorage.getItem('bhumisetu_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [parcels, setParcels] = useState<LandParcel[]>(() => {
    const saved = localStorage.getItem('bhumisetu_parcels');
    return saved ? JSON.parse(saved) : INITIAL_PARCELS;
  });

  const [proposals, setProposals] = useState<ProposalItem[]>(() => {
    const saved = localStorage.getItem('bhumisetu_proposals');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const saved = localStorage.getItem('bhumisetu_beneficiaries');
    return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('bhumisetu_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [alerts, setAlerts] = useState<SmartAlert[]>(() => {
    const saved = localStorage.getItem('bhumisetu_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('bhumisetu_auditLogs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('bhumisetu_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const resetDemoData = async () => {
    localStorage.removeItem('bhumisetu_projects');
    localStorage.removeItem('bhumisetu_parcels');
    localStorage.removeItem('bhumisetu_proposals');
    localStorage.removeItem('bhumisetu_beneficiaries');
    localStorage.removeItem('bhumisetu_documents');
    localStorage.removeItem('bhumisetu_alerts');
    localStorage.removeItem('bhumisetu_auditLogs');
    localStorage.removeItem('bhumisetu_notifications');

    setProjects(INITIAL_PROJECTS);
    setParcels(INITIAL_PARCELS);
    setProposals(INITIAL_PROPOSALS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setDocuments(INITIAL_DOCUMENTS);
    setAlerts(INITIAL_ALERTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);

    // Sync reset to Firestore
    try {
      for (const proj of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', proj.id), proj);
      }
    } catch (e) {
      console.warn('Firestore reset error:', e);
    }
  };

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('bhumisetu_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bhumisetu_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('bhumisetu_parcels', JSON.stringify(parcels));
  }, [parcels]);

  useEffect(() => {
    localStorage.setItem('bhumisetu_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('bhumisetu_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    localStorage.setItem('bhumisetu_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('bhumisetu_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('bhumisetu_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('bhumisetu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Initial Firebase Sync/Bootstrap
  useEffect(() => {
    const bootstrapFirestore = async () => {
      try {
        setIsSyncing(true);
        // Attempt to check if projects collection exists in Firestore
        const projectsRef = collection(db, 'projects');
        const snapshot = await getDocs(projectsRef);

        if (snapshot.empty) {
          // Seed initial projects into Firestore
          for (const proj of INITIAL_PROJECTS) {
            await setDoc(doc(db, 'projects', proj.id), proj);
          }
        }
        setIsFirebaseConnected(true);
      } catch (err) {
        console.warn('Firestore initial sync notice (fallback to resilient offline state):', err);
        // App continues reliably with memory/local storage state
      } finally {
        setIsSyncing(false);
      }
    };

    bootstrapFirestore();
  }, []);

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(targetUser);
  };

  const addAuditEntry = (action: string, projectId: string, projectName: string, prevStatus: string, newStatus: string, remarks: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${currentUser.displayName} (${currentUser.role.replace('_', ' ').toUpperCase()})`,
      role: currentUser.role,
      action,
      projectId,
      projectName,
      previousStatus: prevStatus,
      newStatus,
      remarks,
      ipAddress: '10.142.2.' + Math.floor(Math.random() * 200 + 1)
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Firestore async sync
    try {
      setDoc(doc(db, 'auditLogs', newLog.id), newLog).catch(() => {});
    } catch (e) { /* silent */ }
  };

  const addProject = async (project: LandProject) => {
    setProjects(prev => [project, ...prev]);
    addAuditEntry(
      'New Land Project Created',
      project.id,
      project.name,
      'None',
      project.status,
      `Project onboarded with ${project.totalLandProposedHa} Ha requested across ${project.district}, ${project.state}.`
    );
    try {
      await setDoc(doc(db, 'projects', project.id), project);
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  };

  const updateProjectStatus = async (id: string, newStatus: LandProject['status'], remarks?: string) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    const oldStatus = proj.status;

    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: newStatus,
          currentStage: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    addAuditEntry(
      `Project Status Transitioned to ${newStatus}`,
      id,
      proj.name,
      oldStatus,
      newStatus,
      remarks || `Status transitioned to ${newStatus} by authority ${currentUser.displayName}.`
    );

    // Update in Firestore
    try {
      await setDoc(doc(db, 'projects', id), { ...proj, status: newStatus, currentStage: newStatus }, { merge: true });
    } catch (e) { /* ignore */ }
  };

  const addProposal = async (proposalData: Omit<ProposalItem, 'id' | 'submissionDate' | 'slaDaysRemaining' | 'status'>): Promise<string> => {
    const newId = `PROP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newProposal: ProposalItem = {
      ...proposalData,
      id: newId,
      submissionDate: new Date().toISOString().split('T')[0],
      slaDaysRemaining: 21,
      status: 'Submitted'
    };

    setProposals(prev => [newProposal, ...prev]);

    // Also trigger notification
    const newNotification: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Land Acquisition Proposal Submitted',
      message: `${proposalData.proposingAgency} submitted Proposal ${newId} for ${proposalData.projectTitle}.`,
      type: 'approval',
      timestamp: 'Just now',
      read: false,
      projectId: newId
    };
    setNotifications(prev => [newNotification, ...prev]);

    addAuditEntry(
      'Land Acquisition Proposal Submitted',
      newId,
      proposalData.projectTitle,
      'Draft',
      'Submitted',
      `Proposal for ${proposalData.landRequiredHa} Ha submitted by ${proposalData.submittedBy}.`
    );

    try {
      await setDoc(doc(db, 'proposals', newId), newProposal);
    } catch (e) { /* ignore */ }

    return newId;
  };

  const updateProposalStatus = async (id: string, status: ProposalItem['status'], remarks?: string) => {
    const prop = proposals.find(p => p.id === id);
    if (!prop) return;

    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          reviewRemarks: remarks || p.reviewRemarks
        };
      }
      return p;
    }));

    // If approved, create corresponding Project automatically!
    if (status === 'Approved') {
      const generatedProjectId = `PRJ-2026-${id.slice(-4)}`;
      const newProj: LandProject = {
        id: generatedProjectId,
        name: prop.projectTitle,
        description: prop.justification,
        state: prop.state,
        district: prop.district,
        department: 'Infrastructure & Revenue Dept',
        implementingAgency: prop.proposingAgency,
        category: (prop.category as any) || 'Industrial Corridors',
        totalLandProposedHa: prop.landRequiredHa,
        landAcquiredHa: 0,
        acquisitionPercentage: 0,
        notifiedAreaHa: prop.landRequiredHa * 0.9,
        compensationAssessedCr: prop.approxCostCr * 0.4,
        compensationPaidCr: 0,
        affectedFamilies: prop.estimatedFamilies,
        displacedFamilies: Math.round(prop.estimatedFamilies * 0.25),
        rehabilitatedFamilies: 0,
        possessionCompletedHa: 0,
        possessionPercentage: 0,
        status: 'Notification',
        currentStage: 'Notification',
        slaDeadline: '2027-06-30',
        submissionDate: prop.submissionDate,
        lastUpdated: new Date().toISOString().split('T')[0],
        priority: prop.priority === 'Urgent' ? 'Critical' : (prop.priority as any),
        isDelayed: false,
        coordinates: { lat: 21.0, lng: 78.0 },
        contactOfficer: {
          name: prop.submittedBy,
          designation: 'Nodal Officer',
          phone: '+91 11 2309 8810',
          email: 'nodal@gov.in'
        }
      };

      setProjects(prev => [newProj, ...prev]);

      try {
        await setDoc(doc(db, 'projects', newProj.id), newProj);
      } catch (e) { /* ignore */ }
    }

    addAuditEntry(
      `Proposal Review: ${status}`,
      id,
      prop.projectTitle,
      prop.status,
      status,
      remarks || `Proposal decision updated by ${currentUser.displayName}.`
    );

    try {
      await setDoc(doc(db, 'proposals', id), { ...prop, status, reviewRemarks: remarks }, { merge: true });
    } catch (e) { /* ignore */ }
  };

  const updateParcelVerification = async (parcelId: string, remarks: string, verified: boolean) => {
    setParcels(prev => prev.map(p => {
      if (p.id === parcelId) {
        return {
          ...p,
          fieldVerified: verified,
          fieldOfficerRemarks: remarks,
          verificationDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    addAuditEntry(
      'Field Cadastral Verification Recorded',
      parcelId,
      `Parcel ${parcelId}`,
      verified ? 'Unverified' : 'Verified',
      verified ? 'Geo-Tagged & Verified' : 'Unverified',
      remarks
    );
  };

  const disburseCompensation = async (beneficiaryId: string) => {
    const ben = beneficiaries.find(b => b.id === beneficiaryId);
    if (!ben) return;

    const txnId = `TXN-DBT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toISOString().split('T')[0];

    setBeneficiaries(prev => prev.map(b => {
      if (b.id === beneficiaryId) {
        return {
          ...b,
          status: 'Paid',
          disbursedAmountInr: b.totalEntitlementInr,
          transactionId: txnId,
          paymentDate: today
        };
      }
      return b;
    }));

    // Update parent project compensation paid
    setProjects(prev => prev.map(p => {
      if (p.id === ben.projectId) {
        const addedCr = Number((ben.totalEntitlementInr / 10000000).toFixed(2));
        return {
          ...p,
          compensationPaidCr: Number((p.compensationPaidCr + addedCr).toFixed(2))
        };
      }
      return p;
    }));

    // Also synchronize corresponding Land Parcel status on the GIS Map
    setParcels(prev => prev.map(pcl => {
      if (pcl.surveyNumber === ben.surveyNumber && pcl.projectId === ben.projectId) {
        return {
          ...pcl,
          compensationStatus: 'Disbursed',
          acquisitionStatus: pcl.acquisitionStatus === 'Award Declared' ? 'Acquired' : pcl.acquisitionStatus
        };
      }
      return pcl;
    }));

    addAuditEntry(
      'Direct Benefit Transfer (DBT) Executed',
      beneficiaryId,
      ben.projectName,
      'Payment Pending',
      'Paid',
      `Credited ₹${(ben.totalEntitlementInr / 100000).toFixed(2)} Lakh to ${ben.name} via ${txnId}.`
    );
  };

  const addDocument = async (docItem: Omit<DocumentItem, 'id' | 'uploadDate' | 'hash'>) => {
    const newDoc: DocumentItem = {
      ...docItem,
      id: `DOC-2026-${Math.floor(100 + Math.random() * 900)}`,
      uploadDate: new Date().toISOString().split('T')[0],
      hash: `sha256:${Math.random().toString(36).substring(2, 15)}`
    };

    setDocuments(prev => [newDoc, ...prev]);
    addAuditEntry(
      'Repository Document Uploaded',
      newDoc.id,
      newDoc.projectName,
      'None',
      newDoc.status,
      `Uploaded ${newDoc.title} (${newDoc.category}, ${newDoc.fileType})`
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      switchRole,
      setUser: setCurrentUser,
      projects,
      parcels,
      proposals,
      beneficiaries,
      documents,
      alerts,
      auditLogs,
      notifications,
      activeTab,
      setActiveTab,
      selectedProjectId,
      setSelectedProjectId,
      addProject,
      updateProjectStatus,
      addProposal,
      updateProposalStatus,
      updateParcelVerification,
      disburseCompensation,
      addDocument,
      markNotificationRead,
      isFirebaseConnected,
      isSyncing,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
