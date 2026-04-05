# Temporary Staffing Platform - Implementation Plan

## Overview
This document outlines the complete implementation plan for requirements 6-9 of the temporary staffing platform.

## Current Status ✅

### Already Implemented:
1. ✅ **User Management** - Admin can suspend/unsuspend users
2. ✅ **Business Verification** - Admin can verify/unverify businesses
3. ✅ **Position Type Management** - Admin can create/update/hide position types
4. ✅ **Worker Qualification Approval** - Admin can approve worker qualifications for position types
5. ✅ **Job Listings with Status** - Workers see "Applied" badges for jobs they've applied to
6. ✅ **Qualification Last Updated** - Shows timestamp when qualifications are modified
7. ✅ **Job Posting by Businesses** - Businesses can create job postings
8. ✅ **Job Discovery** - Workers can browse jobs with filters/sorting/pagination

## Requirements 6-9: To Be Implemented

### 6. Business Profiles and Job Posting ⚠️

#### Business Profile Management
- [ ] Create Business Profile Edit page
- [ ] Allow businesses to update: name, description, industry, location, contact info
- [ ] Display business profiles publicly viewable by workers

#### Job Posting Constraints
- [ ] **Auto-Expiry Logic**: Job automatically expires if insufficient time for negotiation before start
  - Calculate: `jobStartTime - now() < negotiationWindow`
  - Mark as "expired" if true
- [ ] **Max Future Start Time**: Default 1 week (configurable in system settings)
  - Validate on job creation: `jobStartTime <= now() + maxFutureStartWindow`
- [ ] **Cannot Delete/Modify After Filled**: Block edits when `job.status === 'filled'`
  - Exception: Allow "Report No-Show" button
- [ ] **Cannot Delete During Active Negotiation**: Check if `job.activeNegotiationId !== null`
- [ ] **Hide Non-Available Jobs**: Filter out jobs with status: completed, filled, canceled, expired

#### Implementation Files:
- `/src/app/pages/business/Profile.tsx` (new file)
- `/src/app/pages/business/PostJob.tsx` (update with constraints)
- `/src/app/pages/business/Jobs.tsx` (update with edit restrictions)

---

### 7. Availability and Discovery ⚠️

#### Worker Availability Status
- [ ] Add availability toggle to Worker Dashboard
- [ ] States: `available` | `unavailable`
- [ ] Store in localStorage: `{ userId, availabilityStatus, lastActivity }`

#### Discoverability Rules
Worker is discoverable if ALL conditions met:
1. [ ] Account is activated (`user.status === 'active'`)
2. [ ] Account not suspended (`user.suspended === false`)
3. [ ] Qualified for job (`worker.approvedQualifications.includes(job.positionType)`)
4. [ ] Availability set to available (`worker.availabilityStatus === 'available'`)
5. [ ] Active within inactivity window (default 5 minutes)
   - Track: `lastActivity` timestamp
   - Check: `now() - lastActivity < inactivityWindow`
6. [ ] No conflicting job commitment
   - Check: No accepted job with overlapping work time

#### Auto-Availability Triggers
Worker automatically set to "available" when:
- [ ] Manually toggles status to available
- [ ] Expresses interest in a job posting
- [ ] Negotiation ends (regardless of outcome)

#### Inactivity Tracking
- [ ] Track user activity (page views, clicks)
- [ ] Update `lastActivity` timestamp in localStorage
- [ ] Default inactivity window: 5 minutes (configurable)
- [ ] Auto-set unavailable if inactive > window

#### Browse Jobs (Regardless of Availability)
- [ ] Workers can browse all qualified jobs even if unavailable
- [ ] Show travel distance/ETA (already implemented)
- [ ] Filtering, sorting, pagination (already implemented)

#### Implementation Files:
- `/src/app/contexts/AvailabilityContext.tsx` (new file)
- `/src/app/hooks/useActivity.ts` (new file)
- `/src/app/pages/worker/Dashboard.tsx` (add availability toggle)
- `/src/app/components/AvailabilityToggle.tsx` (new component)

---

### 8. Expressing Interest 🔴

#### Worker Expresses Interest
- [ ] "Express Interest" button on job detail page
- [ ] Available to workers qualified for the job
- [ ] Works regardless of availability status
- [ ] Non-exclusive action (doesn't lock worker)
- [ ] Store in localStorage: `{ workerId, jobId, timestamp, status: 'pending' }`

#### Business Expresses Interest
- [ ] View available workers by position type
- [ ] "Express Interest" button on worker profiles
- [ ] Filter: only show available + qualified workers
- [ ] Non-exclusive action (doesn't lock business)
- [ ] Store in localStorage: `{ businessId, workerId, jobId, timestamp, status: 'pending' }`

#### Mutual Interest Display
- [ ] Show "Interests Received" section for workers
- [ ] Show "Your Interests" section for businesses
- [ ] Each party can see the other's interest
- [ ] "Accept Interest" / "Decline Interest" buttons

#### Negotiation Initiation Rules
Can initiate negotiation when:
1. [ ] Mutual interest exists (both parties expressed interest)
2. [ ] Neither party in ongoing negotiation
   - Check: `worker.activeNegotiationId === null`
   - Check: `job.activeNegotiationId === null`
3. [ ] If condition fails, show error + estimated wait time

#### Implementation Files:
- `/src/app/pages/worker/Interests.tsx` (new file)
- `/src/app/pages/business/Candidates.tsx` (update to show workers)
- `/src/app/components/InterestButton.tsx` (new component)
- `/src/app/services/interestService.ts` (new service)

---

### 9. Negotiation System 🔴

#### Exclusive Negotiation Window
- [ ] Default: 15 minutes (configurable in system settings)
- [ ] Start countdown timer when negotiation begins
- [ ] Display remaining time prominently

#### Negotiation Restrictions
During active negotiation:
- [ ] Worker cannot initiate/receive other negotiations
- [ ] Job cannot be negotiated with other candidates
- [ ] System enforces: max 1 active negotiation per user/job
- [ ] Store: `{ negotiationId, workerId, jobId, businessId, startTime, status }`

#### Negotiation Actions
- [ ] **Accept** button (both parties)
- [ ] **Reject** button (both parties)
- [ ] Show acceptance status for each party

#### Business Modifies Job
- [ ] Allow business to edit job during negotiation
- [ ] On edit: reset acceptance status for both parties
- [ ] Show notification: "Job details updated - please review again"

#### Negotiation Outcomes
1. [ ] **Both Accept**: Job marked as 'filled', negotiation status = 'accepted'
2. [ ] **Either Rejects**: Negotiation ends immediately, status = 'rejected'
3. [ ] **Timeout**: Negotiation auto-ends when timer reaches 0, status = 'expired'

#### Post-Negotiation
- [ ] Worker automatically returned to "available" status after failed negotiation
- [ ] Remove `activeNegotiationId` from worker and job
- [ ] Log negotiation history in localStorage

#### Implementation Files:
- `/src/app/pages/Negotiation.tsx` (update existing)
- `/src/app/components/NegotiationTimer.tsx` (new component)
- `/src/app/services/negotiationService.ts` (new service)
- `/src/app/hooks/useNegotiation.ts` (new hook)

---

## System Configuration Updates

Update `/src/app/pages/admin/SystemConfig.tsx`:

```typescript
interface SystemConfig {
  negotiationWindow: number;        // 15 minutes (was 48 hours)
  inactivityWindow: number;          // 5 minutes (new)
  maxFutureJobStart: number;         // 1 week = 168 hours (new)
  // ... existing settings
}
```

---

## Data Structures

### LocalStorage Keys

#### Worker Availability
```typescript
interface WorkerAvailability {
  userId: string;
  status: 'available' | 'unavailable';
  lastActivity: string; // ISO timestamp
}
// Key: 'workerAvailabilities'
```

#### Interest Expressions
```typescript
interface Interest {
  id: string;
  workerId: string;
  jobId: string;
  businessId: string;
  expressedBy: 'worker' | 'business';
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}
// Key: 'interests'
```

#### Active Negotiations
```typescript
interface Negotiation {
  id: string;
  workerId: string;
  jobId: string;
  businessId: string;
  startTime: string;
  endTime: string; // startTime + negotiationWindow
  workerAccepted: boolean;
  businessAccepted: boolean;
  status: 'active' | 'accepted' | 'rejected' | 'expired';
}
// Key: 'negotiations'
```

---

## UI Components to Create

1. **AvailabilityToggle** - Switch for workers to toggle availability
2. **InterestButton** - Express/withdraw interest button
3. **InterestCard** - Display received interests
4. **NegotiationTimer** - Countdown timer for negotiation window
5. **NegotiationPanel** - Accept/Reject buttons with status indicators
6. **WorkerDiscovery** - List of available workers for businesses

---

## Testing Checklist

### Availability
- [ ] Toggle availability on/off
- [ ] Auto-unavailable after 5 min inactivity
- [ ] Auto-available after expressing interest
- [ ] Auto-available after negotiation ends

### Interest Expression
- [ ] Worker can express interest in qualified jobs
- [ ] Business can express interest in available workers
- [ ] Mutual interest enables negotiation
- [ ] Non-exclusive (multiple interests allowed)

### Negotiation
- [ ] Timer counts down from 15 minutes
- [ ] Both parties can accept/reject
- [ ] Job modification resets acceptances
- [ ] Both accept = job filled
- [ ] Either reject or timeout = negotiation ends
- [ ] Worker returns to available after failed negotiation
- [ ] Only 1 active negotiation per user/job

### Job Posting
- [ ] Cannot post job starting > 1 week in future
- [ ] Job auto-expires if insufficient time before start
- [ ] Cannot delete/edit filled jobs
- [ ] Cannot delete jobs in active negotiation
- [ ] Can report no-show on filled jobs

---

## Priority Implementation Order

1. **Phase 1: Availability System** (Critical Foundation)
   - Worker availability toggle
   - Activity tracking
   - Inactivity detection

2. **Phase 2: Interest Expression** (Core Feature)
   - Worker express interest
   - Business express interest
   - Mutual interest detection

3. **Phase 3: Negotiation System** (Complex Feature)
   - Negotiation initiation
   - Timer countdown
   - Accept/reject logic
   - Job modification handling

4. **Phase 4: Job Constraints** (Business Logic)
   - Auto-expiry
   - Max future start
   - Edit restrictions

5. **Phase 5: Business Profile** (Enhancement)
   - Profile editing
   - Public profile view

---

## Notes

- All timestamps should use ISO 8601 format
- Use localStorage for MVP; transition to backend API later
- System settings should be configurable by admin
- All timers should be visible with clear countdowns
- Status indicators should be color-coded and intuitive
- Error messages should be clear and actionable
