export type UserRole = 
  | 'national_admin' 
  | 'state_admin' 
  | 'district_officer' 
  | 'project_agency' 
  | 'field_officer' 
  | 'viewer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  state?: string;
  district?: string;
  department?: string;
  phoneNumber?: string;
  badgeNumber?: string;
}

export type ProjectStatus = 
  | 'Proposal'
  | 'Scrutiny'
  | 'Approval'
  | 'Notification'
  | 'Land Survey'
  | 'Award'
  | 'Compensation'
  | 'Possession'
  | 'R&R'
  | 'Completed'
  | 'Rejected'
  | 'Returned';

export interface LandProject {
  id: string; // e.g. "PRJ-2026-NH48"
  name: string;
  description: string;
  state: string;
  district: string;
  department: string;
  implementingAgency: string;
  category: 'Highways & Expressways' | 'Railways & Freight' | 'Renewable Energy' | 'Industrial Corridors' | 'Irrigation & Water Resources' | 'Urban Infrastructure';
  totalLandProposedHa: number;
  landAcquiredHa: number;
  acquisitionPercentage: number;
  notifiedAreaHa: number;
  compensationAssessedCr: number;
  compensationPaidCr: number;
  affectedFamilies: number;
  displacedFamilies: number;
  rehabilitatedFamilies: number;
  possessionCompletedHa: number;
  possessionPercentage: number;
  status: ProjectStatus;
  currentStage: ProjectStatus;
  slaDeadline: string; // ISO date
  submissionDate: string; // ISO date
  lastUpdated: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  isDelayed: boolean;
  delayReason?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactOfficer: {
    name: string;
    designation: string;
    phone: string;
    email: string;
  };
}

export interface LandParcel {
  id: string;
  projectId: string;
  projectName: string;
  surveyNumber: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  areaHa: number;
  landType: 'Agricultural' | 'Commercial' | 'Residential' | 'Barren' | 'Forest';
  ownerName: string;
  ownerFamilyId: string;
  ownerPhone: string;
  acquisitionStatus: 'Proposed' | 'Notified' | 'Surveyed' | 'Award Declared' | 'Acquired' | 'Possession Completed';
  compensationStatus: 'Assessment Pending' | 'Assessed' | 'Approved' | 'Payment Pending' | 'Disbursed' | 'Disputed';
  compensationAmount: number; // in INR
  rrStatus: 'Not Required' | 'Allotment Pending' | 'House Allotted' | 'Cash Resettlement' | 'Plot + Grant' | 'Completed';
  coordinates: [number, number][]; // Polygon coordinates
  center: [number, number];
  fieldVerified: boolean;
  fieldOfficerRemarks?: string;
  verificationDate?: string;
}

export interface ProposalItem {
  id: string;
  projectTitle: string;
  proposingAgency: string;
  state: string;
  district: string;
  category: string;
  landRequiredHa: number;
  approxCostCr: number;
  affectedVillagesCount: number;
  estimatedFamilies: number;
  submissionDate: string;
  slaDaysRemaining: number;
  status: 'Draft' | 'Submitted' | 'Under Scrutiny' | 'Returned' | 'Approved' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  submittedBy: string;
  assignedToScrutinizer?: string;
  justification: string;
  documentsCount: number;
  reviewRemarks?: string;
}

export interface Beneficiary {
  id: string;
  projectId: string;
  projectName: string;
  parcelId: string;
  surveyNumber: string;
  name: string;
  familyHead: string;
  familyMembersCount: number;
  village: string;
  district: string;
  state: string;
  bankAccountMasked: string;
  ifscCode: string;
  aadhaarMasked: string;
  landAreaHa: number;
  assessedAmountInr: number;
  solatiumAmountInr: number;
  totalEntitlementInr: number;
  disbursedAmountInr: number;
  status: 'Assessed' | 'Approved' | 'Payment Pending' | 'Paid' | 'Failed' | 'Disputed';
  transactionId?: string;
  paymentDate?: string;
  rrEligibility: boolean;
  rrPackageType?: 'Plot + Grant' | 'PMAY House' | 'One-Time Cash Grant';
}

export interface DocumentItem {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  category: 
    | 'Proposal'
    | 'Land Records'
    | 'Notifications'
    | 'Survey Reports'
    | 'Awards'
    | 'Compensation'
    | 'R&R Documents'
    | 'Possession Documents';
  fileType: 'PDF' | 'DWG' | 'KML' | 'XLSX' | 'JPG';
  fileSizeMb: number;
  uploadedBy: string;
  uploadDate: string;
  version: string;
  status: 'Verified' | 'Pending Verification' | 'Rejected';
  downloadUrl?: string;
  hash: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  projectId: string;
  projectName: string;
  previousStatus: string;
  newStatus: string;
  remarks: string;
  ipAddress?: string;
}

export interface SmartAlert {
  id: string;
  projectId: string;
  projectName: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  reason: string;
  metric: string;
  threshold: string;
  recommendedAction: string;
  detectedAt: string;
  category: 'Milestone Delay' | 'Compensation Backlog' | 'R&R Resistance' | 'Litigation / Injunction' | 'Survey Pending';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'deadline' | 'compensation' | 'document' | 'rr' | 'system';
  timestamp: string;
  read: boolean;
  projectId?: string;
  link?: string;
}
