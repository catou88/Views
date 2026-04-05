// Mock data for the staffing platform

export type JobStatus = 'open' | 'filled' | 'expired' | 'canceled' | 'completed';
export type ApplicationStatus = 'pending' | 'invited' | 'accepted' | 'rejected' | 'withdrawn';
export type QualificationStatus = 'pending' | 'approved' | 'rejected';
export type NegotiationStatus = 'active' | 'accepted' | 'rejected' | 'expired';
export type UserRole = 'worker' | 'business' | 'admin';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  status: 'active' | 'suspended';
  jobsPosted?: number;
  applicationsSubmitted?: number;
  qualifications?: number;
}

export interface Job {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  description: string;
  location: string;
  payRate: number;
  startDate: string;
  endDate: string;
  requiredQualifications: string[];
  status: JobStatus;
  postedDate: string;
  applicationsCount: number;
  expiresAt?: string;
}

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerEmail: string;
  status: ApplicationStatus;
  appliedDate: string;
  appliedAt: string;
  coverLetter?: string;
  negotiationId?: string;
  qualifications?: string[];
  mutualInterest?: boolean;
}

export interface Qualification {
  id: string;
  userId: string;
  userName: string;
  type: string;
  description: string;
  documentUrl?: string;
  status: QualificationStatus;
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
}

export interface Negotiation {
  id: string;
  jobId: string;
  applicationId: string;
  businessId: string;
  workerId: string;
  proposedPayRate: number;
  originalPayRate: number;
  status: NegotiationStatus;
  createdBy: 'business' | 'worker';
  createdAt: string;
  expiresAt: string;
  message?: string;
}

// Mock Jobs Data
export const mockJobs: Job[] = [
  {
    id: '1',
    businessId: 'b1',
    businessName: 'Tech Solutions Inc',
    title: 'Senior React Developer',
    description: 'Looking for an experienced React developer for a 3-month project. Must have experience with TypeScript and modern React patterns.',
    location: 'San Francisco, CA',
    payRate: 85,
    startDate: '2026-04-15',
    endDate: '2026-07-15',
    requiredQualifications: ['React Certification', 'TypeScript'],
    status: 'open',
    postedDate: '2026-03-20',
    applicationsCount: 12,
    expiresAt: '2026-04-10T23:59:59Z',
  },
  {
    id: '2',
    businessId: 'b2',
    businessName: 'Creative Agency',
    title: 'UI/UX Designer',
    description: 'Short-term contract for redesigning mobile app. Experience with Figma required.',
    location: 'New York, NY',
    payRate: 70,
    startDate: '2026-04-01',
    endDate: '2026-05-31',
    requiredQualifications: ['Design Portfolio', 'Figma'],
    status: 'open',
    postedDate: '2026-03-25',
    applicationsCount: 8,
    expiresAt: '2026-04-05T23:59:59Z',
  },
  {
    id: '3',
    businessId: 'b1',
    businessName: 'Tech Solutions Inc',
    title: 'Backend Engineer',
    description: 'Node.js backend engineer needed for API development.',
    location: 'Remote',
    payRate: 90,
    startDate: '2026-05-01',
    endDate: '2026-08-01',
    requiredQualifications: ['Node.js', 'AWS'],
    status: 'filled',
    postedDate: '2026-03-10',
    applicationsCount: 25,
  },
  {
    id: '4',
    businessId: 'b3',
    businessName: 'Healthcare Plus',
    title: 'Medical Assistant',
    description: 'Temporary medical assistant position at our downtown clinic.',
    location: 'Chicago, IL',
    payRate: 35,
    startDate: '2026-04-20',
    endDate: '2026-06-20',
    requiredQualifications: ['Medical License', 'CPR Certification'],
    status: 'open',
    postedDate: '2026-03-28',
    applicationsCount: 5,
    expiresAt: '2026-04-15T23:59:59Z',
  },
  {
    id: '5',
    businessId: 'b2',
    businessName: 'Creative Agency',
    title: 'Content Writer',
    description: 'SEO-focused content writer for marketing campaigns.',
    location: 'Remote',
    payRate: 45,
    startDate: '2026-04-05',
    endDate: '2026-06-05',
    requiredQualifications: ['Writing Portfolio'],
    status: 'expired',
    postedDate: '2026-02-15',
    applicationsCount: 30,
  },
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: 'a1',
    jobId: '1',
    workerId: 'w1',
    workerName: 'John Doe',
    workerEmail: 'john@example.com',
    status: 'pending',
    appliedDate: '2026-03-22',
    appliedAt: '2026-03-22T14:30:00Z',
    coverLetter: 'I am very interested in this position and have 5 years of React experience.',
  },
  {
    id: 'a2',
    jobId: '2',
    workerId: 'w2',
    workerName: 'Jane Smith',
    workerEmail: 'jane@example.com',
    status: 'accepted',
    appliedDate: '2026-03-26',
    appliedAt: '2026-03-26T09:45:00Z',
    negotiationId: 'n1',
  },
  {
    id: 'a3',
    jobId: '1',
    workerId: 'w3',
    workerName: 'Bob Johnson',
    workerEmail: 'bob@example.com',
    status: 'rejected',
    appliedDate: '2026-03-21',
    appliedAt: '2026-03-21T11:00:00Z',
  },
];

// Mock Qualifications
export const mockQualifications: Qualification[] = [
  {
    id: 'q1',
    userId: 'w1',
    userName: 'John Doe',
    type: 'React Certification',
    description: 'Meta React Developer Professional Certificate',
    status: 'approved',
    submittedDate: '2026-03-15',
    reviewedDate: '2026-03-17',
    reviewedBy: 'Admin',
  },
  {
    id: 'q2',
    userId: 'w2',
    userName: 'Jane Smith',
    type: 'Design Portfolio',
    description: 'Portfolio showcasing 10+ projects',
    status: 'pending',
    submittedDate: '2026-03-29',
  },
  {
    id: 'q3',
    userId: 'w4',
    userName: 'Alice Williams',
    type: 'Medical License',
    description: 'Illinois Medical License #12345',
    status: 'rejected',
    submittedDate: '2026-03-20',
    reviewedDate: '2026-03-22',
    reviewedBy: 'Admin',
  },
];

// Mock Negotiations
export const mockNegotiations: Negotiation[] = [
  {
    id: 'n1',
    jobId: '2',
    applicationId: 'a2',
    businessId: 'b2',
    workerId: 'w2',
    proposedPayRate: 75,
    originalPayRate: 70,
    status: 'active',
    createdBy: 'worker',
    createdAt: '2026-03-30T10:00:00Z',
    expiresAt: '2026-04-02T23:59:59Z',
    message: 'Based on my experience with similar projects, I believe a rate of $75/hr is more appropriate.',
  },
];

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: 'w1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'worker',
    joinDate: '2026-01-15',
    status: 'active',
    applicationsSubmitted: 12,
    qualifications: 3,
  },
  {
    id: 'w2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'worker',
    joinDate: '2026-02-20',
    status: 'active',
    applicationsSubmitted: 8,
    qualifications: 2,
  },
  {
    id: 'w3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'worker',
    joinDate: '2026-03-01',
    status: 'suspended',
    applicationsSubmitted: 5,
    qualifications: 1,
  },
  {
    id: 'w4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'worker',
    joinDate: '2026-02-28',
    status: 'active',
    applicationsSubmitted: 15,
    qualifications: 4,
  },
  {
    id: 'b1',
    name: 'Tech Solutions Inc',
    email: 'contact@techsolutions.com',
    role: 'business',
    joinDate: '2026-01-10',
    status: 'active',
    jobsPosted: 15,
  },
  {
    id: 'b2',
    name: 'Creative Agency',
    email: 'hello@creativeagency.com',
    role: 'business',
    joinDate: '2026-02-05',
    status: 'active',
    jobsPosted: 8,
  },
  {
    id: 'b3',
    name: 'Healthcare Plus',
    email: 'info@healthcareplus.com',
    role: 'business',
    joinDate: '2026-03-15',
    status: 'active',
    jobsPosted: 6,
  },
];

// Helper functions to get data
export const getJobsByStatus = (status: JobStatus): Job[] => {
  return mockJobs.filter(job => job.status === status);
};

export const getJobById = (id: string): Job | undefined => {
  return mockJobs.find(job => job.id === id);
};

export const getApplicationsByWorkerId = (workerId: string): Application[] => {
  return mockApplications.filter(app => app.workerId === workerId);
};

export const getApplicationsByJobId = (jobId: string): Application[] => {
  return mockApplications.filter(app => app.jobId === jobId);
};

export const getQualificationsByUserId = (userId: string): Qualification[] => {
  return mockQualifications.filter(qual => qual.userId === userId);
};

export const getPendingQualifications = (): Qualification[] => {
  return mockQualifications.filter(qual => qual.status === 'pending');
};

// Get all unique qualification types from jobs
export const getAvailableQualificationTypes = (): string[] => {
  const allQualifications = mockJobs.flatMap(job => job.requiredQualifications);
  return Array.from(new Set(allQualifications)).sort();
};