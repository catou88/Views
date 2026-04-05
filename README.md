# Temporary Staffing Platform - StaffHub

A comprehensive React-based temporary staffing platform that connects workers with businesses seeking temporary staff.

## Features

### Public Features
- **Home Page**: Landing page with platform overview and call-to-action
- **Job Listings**: Browse all available temporary positions with filtering, sorting, and pagination
- **Job Details**: View detailed information about specific job postings
- **Authentication**: Login and registration for workers, businesses, and admins

### Worker Features
- **Dashboard**: Overview of applications, qualifications, and available jobs
- **Browse Jobs**: Search and filter job opportunities
- **Apply to Jobs**: Submit applications with cover letters
- **My Applications**: Track application status with filtering and pagination
- **Qualifications**: Submit credentials for admin verification
- **Profile**: Manage personal information and skills

### Business Features
- **Dashboard**: Overview of job postings and applications
- **Post Jobs**: Create new job listings with qualifications requirements
- **My Jobs**: Manage active and past job postings
- **Review Applications**: View and manage applications for each job
- **Negotiate Rates**: Counter-offer pay rates to applicants
- **Profile**: Update company information

### Admin Features
- **Dashboard**: System-wide statistics and overview
- **Review Qualifications**: Approve or reject worker credentials
- **User Management**: View and manage all platform users
- **System Monitoring**: Track platform activity and metrics

## Key Requirements Met

✅ **Role-Based Navigation**: Different navigation menus for workers, businesses, and admins  
✅ **State-Driven UI**: Visual indicators for job status (open/filled/expired/canceled/completed)  
✅ **Time-Sensitive Actions**: Countdown timers for job expiration and negotiation deadlines  
✅ **Pagination**: All list views support pagination  
✅ **Filtering & Sorting**: Jobs and applications can be filtered and sorted  
✅ **React Router**: Full browser navigation support without manual URL editing  
✅ **Responsive Design**: Works on desktop and mobile devices  
✅ **Clear System State**: Users always know what actions are available and why  

## Views Implemented

### Public Views
- `/` - Home page
- `/jobs` - Job listings (with pagination, filtering, sorting)
- `/jobs/:id` - Job detail page
- `/login` - Login page
- `/register` - Registration page

### Worker Views
- `/worker/dashboard` - Worker dashboard
- `/worker/applications` - My applications (with filtering, pagination)
- `/worker/qualifications` - Manage qualifications

### Business Views
- `/business/dashboard` - Business dashboard
- `/business/jobs` - My job postings (with filtering, pagination)
- `/business/post-job` - Post new job
- `/business/jobs/:id/applications` - Review applications for a specific job

### Admin Views
- `/admin/dashboard` - Admin dashboard
- `/admin/qualifications` - Review and approve qualifications (with filtering, pagination)
- `/admin/users` - User management (with search, filtering, pagination)

### Common Views
- `/profile` - User profile settings
- `*` - 404 Not Found page

## Architecture

### Components
- **Navigation**: Role-based navigation bar
- **CountdownTimer**: Real-time countdown for time-sensitive actions
- **UI Components**: Comprehensive set of reusable components (buttons, cards, forms, dialogs, etc.)

### Contexts
- **AuthContext**: Manages user authentication and role-based access

### Services
- **mockData.ts**: Mock data service with jobs, applications, qualifications, and helper functions

### State Management
- Local component state with React hooks
- Context API for global auth state
- React Router for navigation state

## Technical Stack

- **React 18.3.1**: UI framework
- **React Router 7.13.0**: Client-side routing
- **Tailwind CSS 4.x**: Styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Sonner**: Toast notifications
- **TypeScript**: Type safety (via JSX with types)

## Data Model

### Job
- ID, business info, title, description
- Location, pay rate, dates
- Required qualifications
- Status (open/filled/expired/canceled/completed)
- Expiration timestamp

### Application
- ID, job and worker references
- Status (pending/accepted/rejected/withdrawn)
- Applied date, cover letter
- Negotiation reference

### Qualification
- ID, user info, type, description
- Status (pending/approved/rejected)
- Submission and review dates

### Negotiation
- ID, job and application references
- Proposed and original pay rates
- Status and expiration

## User Experience Features

### Visual Clarity
- Color-coded status badges
- Clear action buttons
- Contextual alerts and messages
- Loading states and empty states

### State Visibility
- Job status clearly displayed
- Application status tracking
- Qualification approval status
- Countdown timers for deadlines

### Navigation
- Breadcrumb navigation
- Back buttons
- Role-specific menu items
- Consistent layout across pages

### Feedback
- Toast notifications for actions
- Confirmation dialogs
- Error messages
- Success states

## Notes

This is a frontend-only implementation using mock data. In a production environment:
- Replace mock data with API calls
- Add authentication backend
- Implement real-time updates
- Add file upload functionality
- Implement actual payment processing
- Add email notifications
- Implement proper access control
