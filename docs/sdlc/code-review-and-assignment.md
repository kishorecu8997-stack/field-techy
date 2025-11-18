# Code Review and Assignment

Code reviews ensure quality and knowledge sharing. The single assignee principle prevents confusion in Field Techy development.

## Single Assignee Principle
- Each task or user story has one primary assignee for accountability.
- Assignee handles implementation, testing, and documentation.
- Reduces overlaps; escalates blockers to Scrum Master.

## Code Review Process

| Aspect | Details |
|--------|---------|
| **Pull Requests (PRs)** | Created for all changes; include description, screenshots, and linked issues. |
| **Reviewers** | Copilot and two peer developers for general code. For QA-related code/documents, Copilot and [PO](roles.md). |
| **Criteria** | Code follows standards (e.g., linting, tests); no major bugs; aligns with [DoD](artifacts.md). |
| **Approval** | Merge only after approval; self-reviews not allowed. |
| **Timeline** | Reviews within 24 hours; urgent fixes expedited. Morning sessions are used for code reviews; requests may move to the next day. |
| **Accountability** | PR assignee (same as user story assignee unless PO assigns otherwise) is accountable for getting the PR reviewed properly and merged. QA must escalate to PO if not reviewed/approved/merged within two days. If escalation does not occur in time, the incident will be identified by PO in retrospective, and both incidents (delay and missed escalation) will be escalated by PO. |

## Integration with CI/CD
- PRs trigger automated checks (build, tests, security scans).
- No merge if checks fail.
- Post-merge, deploy to staging for further QA.

## Best Practices
- Use constructive feedback; focus on code, not person.
- Document decisions in PR comments.
- For Field Techy, reviews cover application components for consistency.

This process fosters collaboration and maintains code quality.
