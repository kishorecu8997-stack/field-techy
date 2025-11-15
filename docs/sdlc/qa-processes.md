# QA Processes

QA is integral to Scrum, ensuring quality in Field Techy features across application components. Testing occurs throughout the sprint.

## Testing Types

| Type | Description |
|------|-------------|
| **Unit Testing** | Tests individual components (e.g., API functions). |
| **Integration Testing** | Verifies interactions between modules (e.g., frontend-backend). |
| **Acceptance Testing** | Validates against user stories (e.g., end-to-end job posting flow). |
| **Regression Testing** | Ensures new changes don't break existing features. |

## QA in Scrum Events

| Event | QA Role |
|-------|---------|
| **Sprint Planning** | QA estimates testing effort for backlog items. Ensures single assignee principle with PO. See [Code Review and Assignment](code-review-and-assignment.md). |
| **Daily Scrum** | QA reports on test progress and blockers. |
| **Sprint Review** | QA demonstrates tested features. |
| **Retrospective** | QA suggests improvements, like better automation. Identifies and escalates missed PR timelines or escalations. See [Escalation](escalation.md). |
| **Code Reviews** | QA ensures PRs are reviewed, approved, and merged within 2 days; [escalates delays to PO](escalation.md). |

## Test Design and Reporting per Sprint

| Aspect | Details |
|--------|---------|
| **Design** | Create test cases based on user stories, including edge cases (e.g., invalid inputs for forms). |
| **Execution** | Run tests daily; log results in tools like TestRail or GitHub. |
| **Reporting** | End-of-sprint report with pass/fail rates, defects, and coverage metrics. |
| **Defect Handling** | Log as backlog items; prioritize fixes in future sprints. |

## Tools and Best Practices
- Use automated tools (e.g., Jest for unit tests, Selenium for UI).
- Aim for 80%+ test coverage.
- QA collaborates with developers for shift-left testing.

In Field Techy, QA ensures reliable features for clients and engineers, reducing post-release issues.
