# Branching Strategy

This outlines the Git Flow branching strategy for Field Techy.

## Branch Types

| Type | Description |
|------|-------------|
| **Feature Branches** | `{issue-id}-{short-description}` (e.g., `123-client-portal-auth`) from `dev`; for user stories. |
| **QA/Stabilization** | `qa` branch; used as the stabilization point after merging from `dev` at sprint end. |
| **Release Branches** | `release/v1.0` from `main`; for version-specific releases or patches. |
| **Hotfix Branches** | `hotfix/456-login-bug` from `release/v1.0`; for urgent fixes on release branches. |

## Workflow Steps

| Step | Description |
|------|-------------|
| 1 | Create feature branch from `dev`. |
| 2 | Develop, commit, and PR to `dev` with reviews. |
| 3 | At sprint end, demo and merge `dev` to `qa` for stabilization. |
| 4 | After QA and PO approval, merge `qa` to `main`; create release branch from `main` if needed for versioning. |
| 5 | Back-merge `main` to `dev` to ensure QA changes/fixes are available in development. |
| 6 | For hotfixes, branch from the relevant release branch, fix, and merge back. |
| 7 | Delete feature branches after merge. |

## Naming Conventions

| Type | Example | Pattern |
|------|---------|---------|
| Features | `123-client-portal-auth` | `{issue-id}-{short-description}` |
| Releases | `release/v1.0` | `release/{version}` |
| Hotfixes | `hotfix/456-login-bug` | `hotfix/{issue-id}-{short-description}` |

Using `qa` as the primary stabilization point simplifies the flow, with release branches optional for complex releases. This ensures clean history and parallel work. This setup allows release branches from `main` for version management, with hotfixes applied on them for targeted patches. Back-merging `main` to `dev` after releases is a best practice to synchronize branches, ensuring QA fixes and hotfixes are available in development and preventing divergence. Good teams adopt this to maintain consistency and reduce conflicts. Follow Branch Protection Rules on key branches and manage branch lifecycles by deleting merged branches.
