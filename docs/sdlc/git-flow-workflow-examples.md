# Workflow Examples

Examples of Git Flow in action for Field Techy.

## Feature Development
1. Branch: `git checkout -b 123-client-portal-auth dev`
2. Develop: Implement and test.
3. PR: Merge to `dev` after review (Copilot + 2 peers).

## Sprint Completion and Stabilization
1. Demo: Show to stakeholders.
2. Merge: `dev` to `qa` for stabilization and QA.
3. Test: On `qa` branch.

## Release to Production
1. Approval: PO approves after QA.
2. Merge: `qa` to `main`.
3. Back-merge: `main` to `dev` to sync any QA changes.
4. Deploy: `main` to staging for final approval.
5. Create: `release/v1.0` from `main` if needed.

## Release Branch Creation
1. After merging `qa` to `main`, create `release/v1.0` from `main` for versioning.

## Hotfix
1. Branch: `git checkout -b hotfix/456-login-bug main`
2. Fix: Apply patch.
3. Merge: To `main`, `qa`, and `dev`.

## Hotfix on Release Branch
1. Branch: `git checkout -b hotfix/456-login-bug release/v1.0`
2. Fix: Apply patch on the release branch.
3. Merge: To `release/v1.0`, then to `main`, `qa`, and `dev` if applicable.

These examples ensure smooth releases with `qa` as the stabilization point and release branches for version control.
