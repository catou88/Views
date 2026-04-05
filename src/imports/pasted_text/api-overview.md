Overview
You will create a REST API that supports the following functionalities:

1. Use Types
The system supports three types of accounts:

Regular users: dental professionals looking for temporary work.
Businesses: dental clinics or offices posting short-term job opportunities.
Administrators (admins): staff members who manually verify businesses and user qualification; manage supported position types; and handle exceptional cases. For simplicity, all admins have the same privileges.
When the word "user" is used alone, it implies either a regular user or a business.

2. Registration and Authentication
Regular users and businesses can register for accounts.
Users must activate their account prior to their first log-in.
Users can log in and log out of the system.
Users can update their account information.
Users can reset their password without being logged in.
3. Role-Based Access Control
The system distinguishes between regular users, businesses, and administrators.
Access to API endpoints is restricted based on the role of the authenticated user.
Regular users and businesses may only access and modify resources they own or are authorized to view.
4. Administrative Management
Administrators can suspend and unsuspend users.
Administrators can verify business accounts, which allows them to create job postings.
Administrators can create, update, and hide position types.
Administrators can approve which position types a regular user is qualified to perform.
5. Position Types and Qualifications
The platform supports a dynamic set of position types defined by administrators.
Each job posting is associated with exactly one position type.
Regular users may only participate in jobs for position types they have been approved for.
Qualification details beyond position type matching are intentionally not modeled in the system.
6. Business Profiles and Job Posting
Businesses can create and manage a business profile.
Verified businesses can create job postings to advertise short-term staffing needs.
Each job posting includes a position type, salary range, and work time window, i.e., proposed start and end time.
A posting automatically expires if there is not enough time left to complete a full negotiation window before the job starts.
A posting cannot have a start time that is too far into the future (a system-wide setting; defaults to 1 week).
Business users can update or delete their own job postings, subject to constraints
A posting cannot be deleted or modified after the job has been filled.
Except to report the other party as no-show.
A posting cannot be deleted while involved in an active negotiation.
Jobs that are completed, filled, canceled, or expired are not available for matching.
7. Availability and Discovery
Regular users may indicate that they are open to work by setting their availability status to available.
A regular user is considered discoverable by businesses (specifically, for their job postings) if all of the following conditions are met:
Their account is activated.
Their account is not suspended.
They are qualified for the job posting.
Their availability status is set to available.
They have been active within a system-defined inactivity window 
They are not committed to another job whose working hours conflict with this job.
A regular user’s is automatically made available whenever they:
Explicitly set their availability status to available.
A regular user is automatically made available whenever they:
express interest in a job posting, or
have just ended a negotiation, regardless of outcome.
Regular users who have been inactive for longer than the inactivity window (a system-wide setting: defaults to 5 minutes) are treated as unavailable and are not discoverable by businesses.
Regular users can browse open job postings near them for which they are qualified for, regardless of their availability status.
Search results include an estimated travel distance and travel time (ETA), computed using a simplified location model.
They also include other fields such as salary range and creation time (of the job posting).
Search results can be sorted, filtered, and must be paginated, i.e., broken into pages.
8. Expressing Interest
Regular users may express interest in job postings they are qualified for, regardless of their availability status.
Business users may express interest in available regular users who match a given position type.
Expressing interest is a non-exclusive action and does not lock either party.
When one party expresses interest, the other party is able to see and respond to that interest.
A negotiation can be initiated by both parties when they mutually express interest AND neither parties are involved in an ongoing negotiation.
In the latter scenario, the party that initiated shall receive an error message accompanied with the estimated wait time.
9. Negotiation
Each negotiation has a fixed exclusive negotiation window (a system-wide setting; defaults to 15 minutes).
During this window:
neither party may initiate or receive other negotiation requests,
the associated job cannot be negotiated with other candidates.
The system enforces that a user or job may participate in at most one active negotiation at a time.
Either party may accept or reject a negotiation during the exclusive window.
The business is allowed to modify the job posting during the negotiation, but doing so resets the negotiation state, i.e., any prior acceptance by either party is undone.
If both parties accept, the job is marked as filled and the negotiation completes successfully.
If either party rejects, the negotiation ends immediately.
If the negotiation window expires without agreement, the negotiation ends automatically.
When a negotiation ends without agreement, the regular user is automatically returned to the available state.
10. Filled Jobs and Commitments
When a job becomes filled, the negotiation is completed successfully and the job is no longer available for browsing or matching.
A filled job represents a confirmed work commitment between exactly one regular user and one business.
The system does not allow a job to have more than one successful negotiation.
A regular user who has a filled job is considered committed for the duration of the job’s scheduled time window.
While committed, the regular user is not considered available during the working hours of the job, even if their available status is set.
In other words, if a different job posting has time conflict with a regular user's commitment (e.g., the job is 3pm to 9pm, and the regular user is committed to 12pm to 6pm), then that regular user should not appear in the candidate search result.
Once the job’s scheduled end time has passed, the commitment is considered complete.
During the scheduled work period of a filled job (i.e., between the job’s start time and end time), the business user may mark the regular user as a no-show.
When a no-show is reported:
the job is canceled.
the regular user involved is immediately suspended by the system.
Limitations
To keep the assignment focused, the following features and behaviours are out of scope and do not need to be implemented:

Dispute handling and appeals: the system does not provide automated dispute resolution, appeal workflows, evidence review, or strike systems. Handling disputes (including abuse of the no-show mechanism) is assumed to be performed manually by contacting the administrator, e.g., by phone.
Communication after a job is filled: the system does not support communication between the regular user and business after a job has been filled. In particular, there is no post-job chat, follow-up coordination, or scheduling communication. 
Cancellation of filled job: the system does not (currently) support canceling a commitment. We assume the parties involved will reach an agreement without involving the platform.
Record of negotiation: the system does not record or guarantee delivery of chat messages exchanged during negotiation.
Payments and financial processing: the system does not mediate, facilitate, or enforce payment between businesses and regular users. This includes payment processing, deposits, refunds, invoices, subscriptions, payroll, taxation, insurance, and any money transfer functionality.