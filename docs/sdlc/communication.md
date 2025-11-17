# Team Communication

Effective communication is key in Field Techy. Use GitHub for formal tracking and WhatsApp/Sprint meetings for quick updates.

## Communication Processes

To ensure effective collaboration and timely resolution in Field Techy:

1. **Issue Creation and Tracking:**
   - Identify user stories, bugs, or tasks and create a GitHub Issue immediately using the provided title and body templates.
   - Assign the issue to the appropriate team member and apply relevant labels (e.g., sprint number, priority).
   - Use GitHub Comments for discussions, clarifications, or blockers. Tag relevant team members (e.g., @product_owner for escalations).
   - Update issue status regularly and close upon completion, linking to related PRs.

2. **Code Review and Merging:**
   - After implementing changes, create a Pull Request linked to the relevant issue using the title and body templates.
   - Assign reviewers and ensure the checklist is completed.
   - Use PR Review comments for feedback. Address suggestions and re-request reviews as needed.
   - Merge only after approval and passing checks. Update related issues.

3. **Daily Coordination:**
   - Post daily updates in the WhatsApp group before sprint meetings, including completed tasks, plans, and blockers with GitHub issue IDs.
   - Use the PR follow-up template to remind reviewers.
   - Reserve WhatsApp for quick syncs; move detailed discussions to GitHub.

4. **Sprint Meetings:**
   - Hold meetings as scheduled (e.g., weekly) using the agenda template.
   - Review progress, discuss blockers, plan next steps, and conduct KPT retrospectives.
   - Document outcomes in GitHub Issues or meeting notes.

5. **Escalation:**
   - If issues remain unresolved, follow the escalation process outlined in `escalation.md`.

## GitHub Issues
- **Purpose:** Track user stories, bugs, tasks.
- **Title Template:**
  ```
  [Feature/Bug/Task] [Very Short Description]
  ```
- **Body Template:**
  ```
  ### User Story

  As a **[User Role]**, I want **[Goal]** so that **[Benefit]**.

  ---

  ##### Description

  [Detail the requirements, assumptions, and any other relevant information.]

  ##### [More sections as required]

  [Detail of the section.]

  ---

  ### Acceptance Criteria

  - [Criterion 1]
  - [Criterion 2]

  ---

  #### References

  - [Link to related documents, designs, etc.]

  ```

## GitHub Comments
- **Purpose:** Discuss issues or PRs.
- **Template for Blockers:**
  ```
  To: @product_owner
  CC: @team_members

  ---

  [Describe the issue/blocker]

  ---

  Thank you and best regards
  ```
- **Note:** Ensure all details are documented in GitHub and informed in the WhatsApp group. If unresolved by the next sprint meeting, mention the GitHub link and WhatsApp thread.

## Pull Requests (PRs)
- **Purpose:** Propose code changes.
- **Title Template:**
  ```
  [Issue ID] [Very Short Description]
  ```
- **Body Template:**
  ```
  **Description:**
  - **Changes:** [What was changed]
  - **Testing:** [How tested]
  - **Related Issues:** Closes #[Issue ID]

  **Checklist:**
  - [ ] Code reviewed
  - [ ] Tests pass
  - [ ] Docs updated
  - [ ] [Other points from code reviewer checklist]
  ```

## PR Reviews
- **Purpose:** Ensure quality.
- **Template for Comments:**
  ```
  **Type:** [Question/Comment/Suggestion]
  **File:** [File path]
  **Line:** [Line number]
  **Comment:** [Feedback]
  ```

## WhatsApp Group
- **Purpose:** Quick updates, blockers, and coordination.
- **Daily Updates:** Post updates before sprint meetings or as agreed with SM to keep meetings brief and focused. Use concise format with GitHub issue IDs for traceability.
- **Template for Daily Updates:**
  ```
  *Completed Today:*
    - Brief description of task + issue ID (e.g., "Implemented login in auth module - #456").
  *Planned for Tomorrow:*
    - Brief description + issue ID (e.g., "Implement user profile updates - #789").
  *Blockers/Notes:*
    - Any issues (e.g., "Waiting on review for #456").
  ```
- **PR Follow-up Template:**
  ```
  📋 PR Follow-up: #[PR ID] pending review. @reviewers, please review. CC: @product_owner
  ```
- **General Template for Messages:**
  ```
  [Emoji] [Update]: [Brief message]
  e.g., 🚧 Blocker: API down, working on fix.
  ```

## Sprint Meetings
- **Purpose:** Formal discussions.
- **Agenda Template:**
  ```
  **Sprint Meeting Agenda**
  - Review progress
  - Discuss blockers
  - Plan next steps
  - KPT Retrospective
  ```
