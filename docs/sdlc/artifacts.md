# Artifacts

Scrum artifacts provide transparency and opportunities for inspection/adaptation. For Field Techy, they track progress on APIs, web portals, and other application components.

## Product Backlog
- **Description:** A living list of all potential work, ordered by priority.
- **Contents:** Initiatives, epics, user stories, bugs, and enhancements for Field Techy (e.g., "As a client, I want to post jobs").
- **Management:** Maintained by the Product Owner; refined in backlog grooming sessions.
- **Purpose:** Ensures the team focuses on high-value items.

## Sprint Backlog
- **Description:** A subset of the Product Backlog selected for the current sprint.
- **Contents:** User stories decomposed into tasks (e.g., "Implement API endpoint for job creation").
- **Ownership:** Created and owned by the Development Team.
- **Updates:** Adjusted during the sprint via Daily Scrums.

## Increment
- **Description:** The sum of all completed Product Backlog items at the end of a sprint.
- **Criteria:** Must meet the Definition of Done (DoD), including tested, documented, and releasable code.
- **Examples in Field Techy:** A working API for engineer profiles or a deployable web dashboard.
- **Purpose:** Delivers value incrementally, allowing early feedback.

## Work Item Hierarchy

| Level | Description |
|-------|-------------|
| **Initiatives** | High-level goals (e.g., "Improve client onboarding"). |
| **Epics** | Large bodies of work broken into user stories (e.g., "Client Portal Enhancements"). |
| **User Stories** | Detailed requirements with acceptance criteria (e.g., "User can filter engineers by skills"). |

## User Stories

| Aspect | Details |
|--------|---------|
| **Description** | Detailed requirements with acceptance criteria (e.g., "User can filter engineers by skills"). |
| **Status Progression** | - **Backlog:** Initial state; items are refined but not prioritized for sprint.<br>- **Ready:** Groomed, estimated, and prioritized; ready for sprint selection.<br>- **In Progress:** Work started; start date set during sprint planning or before this status.<br>- **In Review:** Code complete, undergoing review; end date set initially during planning, but PO can update for unforeseen issues/blockers.<br>- **Done:** Meets DoD; closed after deployment. |
| **Date Management** | Start and end dates set during sprint planning. PO adjusts end date for blockers during "In Progress". No clear prior indication of failure to meet the end date highlights the need for escalation. |

## Definition of Done (DoD)

| Criteria | Description |
|----------|-------------|
| Code reviewed and merged | Approved by reviewers. |
| Unit and integration tests passed | All tests successful. |
| Documentation updated | Relevant docs revised. |
| No critical bugs | Only minor issues allowed. |
| Acceptance criteria for the user story are met | All requirements satisfied. |
| Deployed to staging and approved | PO approval after staging deployment. |

Artifacts are inspected in [events](events.md) like Sprint Reviews and Retrospectives to drive improvements.
