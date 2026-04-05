import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ActivateAccount } from './pages/ActivateAccount';
import { JobListings } from './pages/JobListings';
import { JobDetail } from './pages/JobDetail';
import { Profile } from './pages/Profile';
import { Businesses } from './pages/Businesses';
import { BusinessProfile } from './pages/BusinessProfile';
import { Negotiation } from './pages/Negotiation';
import { NotFound } from './pages/NotFound';

// Worker pages
import { WorkerDashboard } from './pages/worker/Dashboard';
import { WorkerApplications } from './pages/worker/Applications';
import { WorkerQualifications } from './pages/worker/Qualifications';
import { WorkerInvitations } from './pages/worker/Invitations';
import { WorkerCommitments } from './pages/worker/Commitments';

// Business pages
import { BusinessDashboard } from './pages/business/Dashboard';
import { BusinessJobs } from './pages/business/Jobs';
import { PostJob } from './pages/business/PostJob';
import { JobApplications } from './pages/business/JobApplications';
import { BusinessCandidates } from './pages/business/Candidates';
import { BusinessCandidateDetail } from './pages/business/CandidateDetail';
import { BusinessProfile as BusinessProfileEdit } from './pages/business/BusinessProfile';
import { BusinessApplications } from './pages/business/BusinessApplications';
import { ManageJob } from './pages/business/ManageJob';

// Admin pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminQualifications } from './pages/admin/Qualifications';
import { AdminUsers } from './pages/admin/Users';
import { AdminBusinesses } from './pages/admin/Businesses';
import { AdminPositionTypes } from './pages/admin/PositionTypes';
import { AdminSystemConfig } from './pages/admin/SystemConfig';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
      {
        path: 'forgot-password',
        Component: ForgotPassword,
      },
      {
        path: 'reset-password',
        Component: ResetPassword,
      },
      {
        path: 'activate',
        Component: ActivateAccount,
      },
      {
        path: 'jobs',
        Component: JobListings,
      },
      {
        path: 'jobs/:id',
        Component: JobDetail,
      },
      {
        path: 'businesses',
        Component: Businesses,
      },
      {
        path: 'businesses/:id',
        Component: BusinessProfile,
      },
      {
        path: 'profile',
        Component: Profile,
      },
      {
        path: 'negotiation',
        Component: Negotiation,
      },
      // Worker routes
      {
        path: 'worker/dashboard',
        Component: WorkerDashboard,
      },
      {
        path: 'worker/applications',
        Component: WorkerApplications,
      },
      {
        path: 'worker/qualifications',
        Component: WorkerQualifications,
      },
      {
        path: 'worker/invitations',
        Component: WorkerInvitations,
      },
      {
        path: 'worker/commitments',
        Component: WorkerCommitments,
      },
      {
        path: 'worker/negotiations',
        Component: Negotiation,
      },
      // Business routes
      {
        path: 'business/dashboard',
        Component: BusinessDashboard,
      },
      {
        path: 'business/jobs',
        Component: BusinessJobs,
      },
      {
        path: 'business/post-job',
        Component: PostJob,
      },
      {
        path: 'business/jobs/:id/applications',
        Component: JobApplications,
      },
      {
        path: 'business/jobs/:id/candidates',
        Component: BusinessCandidates,
      },
      {
        path: 'business/jobs/:id/candidates/:candidateId',
        Component: BusinessCandidateDetail,
      },
      {
        path: 'business/applications',
        Component: BusinessApplications,
      },
      {
        path: 'business/negotiations',
        Component: Negotiation,
      },
      {
        path: 'business/profile',
        Component: BusinessProfileEdit,
      },
      {
        path: 'business/manage-job/:id',
        Component: ManageJob,
      },
      // Admin routes
      {
        path: 'admin/dashboard',
        Component: AdminDashboard,
      },
      {
        path: 'admin/qualifications',
        Component: AdminQualifications,
      },
      {
        path: 'admin/users',
        Component: AdminUsers,
      },
      {
        path: 'admin/businesses',
        Component: AdminBusinesses,
      },
      {
        path: 'admin/position-types',
        Component: AdminPositionTypes,
      },
      {
        path: 'admin/system-config',
        Component: AdminSystemConfig,
      },
      // 404 catch-all
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);