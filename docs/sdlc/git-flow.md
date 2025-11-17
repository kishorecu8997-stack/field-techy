# Git Flow

Git Flow is a branching model for managing releases and features. In Field Techy, it supports parallel development and stable releases with a customized workflow.

## Overview
- **Main Branches:** `main` (production-ready, deployed to staging for approval), `dev` (main development), `qa` (stabilization and QA testing).
- **Supporting Branches:** `feature/`, `release/`, `hotfix/`.
- **Workflow:** Isolate work to prevent conflicts; merge via PRs with reviews. Use `qa` as the stabilization point, with back-merges to keep branches synced.
- **Releases:** Follow Semantic Versioning (e.g., v1.2.3 for major.minor.patch). Create a GitHub issue/task/user story for each release, including release notes documented in the common `docs`.

## Key Principles
- Development on `dev`.
- Stabilization and QA on `qa`.
- Production on `main` with staging deployment.
- Back-merge `main` to `dev` after releases to sync QA changes.
- Branches created from and merged appropriately.
- Branch Protection Rules: Enforce on `main`, `dev`, `qa` (require PR approvals, CI checks, no direct pushes).
- Branch Lifecycle Management: Delete merged branches automatically to keep the repo clean.

## Advanced Practices (As Team Matures)
- **Squash Merges for Features:** Merge feature branches with squash for clean history (decided by PO strategically).
- **Rebase Over Merge:** Rebase features onto `dev` for linear commits (used strategically by PO).
- **Code Freeze:** Plan freezes before sprint ends for stability, allowing only hotfixes.

## Benefits for Field Techy
- Enables sprints with feature branches.
- Supports hotfixes for production issues.
- Integrates with CI/CD for automated deployments.
- Back-merging ensures branch synchronization, a key practice for maintaining code consistency and avoiding merge issues.

See [Branching Strategy](git-flow-branching-strategy.md) and [Workflow Examples](git-flow-workflow-examples.md) for detailed strategy and examples.
