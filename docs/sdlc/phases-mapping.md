# Phases Mapping

This section maps traditional SDLC phases to Scrum cycles, ensuring a structured yet agile approach for Field Techy application development.

## Initiation (Product Backlog Creation)

| Aspect | Details |
|--------|---------|
| **Scrum Equivalent** | Ongoing backlog refinement. |
| **Responsibilities** | Product Owner leads; Team provides input. |
| **Deliverables** | Prioritized Product Backlog with initiatives, epics, and user stories. |
| **Timelines** | Continuous, with grooming sessions weekly. |
| **Integration Points** | Stakeholder feedback; tools like GitHub Issues. |

## Planning (Sprint Planning)

| Aspect | Details |
|--------|---------|
| **Scrum Equivalent** | [Sprint Planning](events.md) event. |
| **Responsibilities** | Team selects and decomposes backlog items. Set start and end dates for user stories. |
| **Deliverables** | Sprint Backlog with tasks and estimates. |
| **Timelines** | 2-4 hours at sprint start. |
| **Integration Points** | Estimation tools (e.g., story points); alignment with business goals. |

## Execution (Sprint Execution)

| Aspect | Details |
|--------|---------|
| **Scrum Equivalent** | Daily work within the sprint. |
| **Responsibilities** | Development Team builds, tests, and integrates features. [Communicate blockers immediately](communication.md) as per guidelines. |
| **Deliverables** | Working Increment (e.g., deployable API or UI). |
| **Timelines** | 1-4 weeks per sprint. |
| **Integration Points** | CI/CD for automated builds; Daily Scrums for progress. |

## Review (Sprint Review)

| Aspect | Details |
|--------|---------|
| **Scrum Equivalent** | Sprint Review event. |
| **Responsibilities** | Team demos; PO evaluates against DoD. [Merge `dev` to `qa`](git-flow.md) after stakeholder demo. |
| **Deliverables** | Feedback and updated backlog. |
| **Timelines** | 1-2 hours at sprint end. |
| **Integration Points** | Stakeholder demos; defect tracking. |

## Retrospective (Sprint Retrospective)

| Aspect | Details |
|--------|---------|
| **Scrum Equivalent** | [Sprint Retrospective](events.md) event. |
| **Responsibilities** | Team reflects and plans improvements. |
| **Deliverables** | Action items for next sprint. |
| **Timelines** | 1-2 hours at sprint end. |
| **Integration Points** | Metrics from tools like Jira or GitHub. |

## Maintenance (Post-Release Support)

| Aspect | Details |
|--------|---------|
| **Scrum Equivalent** | Handled via Product Backlog (bugs as items). |
| **Responsibilities** | Team addresses issues in future sprints. After QA, PO merges `qa` to `main`; deploy `main` to staging for approval. |
| **Deliverables** | Patches and updates. |
| **Timelines** | As needed, prioritized in backlog. |
| **Integration Points** | Monitoring tools; hotfix branches in Git Flow. |

This mapping ensures SDLC rigor while embracing Scrum's flexibility for Field Techy.
