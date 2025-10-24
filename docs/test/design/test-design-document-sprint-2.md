# Test Design Document for Sprint 2

## 1. Introduction and Scope

### 1.1 Purpose of the Document
This Test Design Document (TDD) defines the strategy, objectives, scope, environment, and deliverables for testing the **My Account Module (Parts 1 & 2)** and **Job Module (Part 1)** features developed in **Sprint 2**. It ensures comprehensive test coverage and traceability for all user stories, focusing on UI/UX compliance, navigation flows, and form validation.

### 1.2 Background and Context
Sprint 2 implements:
- My Account Module: Profile management, education, skills, tools, work preferences  
- Job Module: Search, details, and status flows  

These modules are critical for user data management and job engagement. Testing validates:
- Pixel-perfect UI adherence  
- Responsive layout  
- Theme consistency (Dark/Light)  
- Form interaction logic using dummy data

### 1.3 Objectives of Testing
- **Validate UI/UX Compliance:** Confirm all screens match Figma designs pixel-perfectly across all breakpoints (mobile, tablet, desktop)
- **Verify Navigation Flows:** Ensure seamless transitions between My Account sidebar → profile pages → job details, including conditional form states
- **Test Form Logic:** Validate dynamic form behavior (`react-hook-form`), error messaging, and dummy data rendering
- **Confirm Theme Consistency:** Ensure Dark/Light theme toggles work uniformly across all pages
- **Risk Mitigation:** Focus testing on high-impact areas:
  - Data persistence during form edits (Add/Edit components)
  - Theme-related visual defects

### 1.4 Scope (Features/Modules to be Tested)
The scope of this TDD covers comprehensive testing of the following user stories from Sprint 2:
#### My Account Module
* Sidebar navigation  
* Logout popup  
* Profile pages (Personal Info, Education, Skills, Tools, Experience, Work Preference, Documents)  
* Add/Edit modals  

#### Job Module
* My Jobs list
* Search Results
* Job Details (Not Applied / Applied / In Progress views)

#### System Refinements
* Dark/Light theme toggling  
* Responsive layouts (mobile, tablet, desktop)  
* Form validation (`react-hook-form`)  
* Dummy data rendering

### 1.5 Out of Scope (Features/Modules Not to be Tested)

The following are explicitly **out of scope** for this testing effort:

* **Performance/Load Testing:** Assessing system responsiveness under heavy load.
* **Automated Regression Testing:** While test scripts may be developed, full automation framework setup and execution of the entire regression suite.
* **Security Penetration Testing:** Deep-dive ethical hacking and vulnerability scanning beyond basic functional security checks in the Auth module.
* **Backend/API Logic:** Testing is focused solely on the **Web UI implementation** and user experience; direct testing of backend APIs or database logic is excluded.


## 2. Test Items

### 2.1 Scope (Items to be Tested)
| **Category** | **Test Items** |
|--------------|----------------|
| **My Account** | Sidebar navigation, Logout popup, Personal Info (edit/save), Education, Skills, Tools, Experience (Add/Edit modals), Work Preference, Documents |
| **Job Module** | My Jobs list, Search Results, Job Details (3 status views), Filter/Sort functionality |
| **Cross-Cutting** | Dark/Light theme consistency, Responsive behavior (all breakpoints), Dummy data rendering |


## 3. Test Approach and Strategy

### 3.1 Overall Testing Strategy
- **Manual Functional Testing:**  Execute UI flows, form interactions, and navigation paths. Verify pixel-perfect Figma compliance.  
- **Exploratory Testing:**  Explore navigation paths (e.g., My Profile → Education → Add), edge cases, and theme switching.  
- **Visual Regression:**  Compare UI screens with Figma using browser dev tools for layout consistency.

### 3.2 Types and Levels of Testing
| **Level** | **Purpose** |
|------------|-------------|
| **Unit Testing** | Component-level validation (e.g., input fields, buttons) |
| **Application Testing** | Page-level checks (e.g., Job Details view) |
| **Integration Testing** | Navigation flow validation (e.g., My Jobs → Job Details → Search Results) |
| **System Testing** | End-to-end validation of My Account & Job modules |
| **UAT** | Product Owner sign-off for Figma adherence |

### 3.3 Type of Testing
- **UI Validation Testing**: Pixel-perfect comparison with Figma designs  
- **Navigation Testing**: Sidebar and route transitions  
- **Form State Testing**: Add/Edit modal states, Save/Cancel behavior  
- **Theme Testing**: Verify Dark/Light styling consistency  

### 3.4 Testing Techniques
- **Black-Box Testing**: Validate outputs without inspecting code.  
- **State Transition Testing**: Test form flows (View → Edit → Save → View).  
- **Boundary Value Analysis**: Validate input limits (e.g., education name length).  
- **Error Guessing**: Proactively identify issues such as:  
  - Missing dummy data in Add/Edit modals  
  - Theme inconsistencies in modals  
  - Navigation breaks during theme toggle  


## 4. Test Criteria

### Test Entry Criteria (When to Start Testing)
Testing shall commence when all the following criteria are met:
* All user stories for Sprint 2 are developed and **code-complete**.
* The test environment is stable and confirmed ready for testing.
* The Test Design Document and all necessary test cases are reviewed and finalized.
* All identified test data is provisioned and accessible.
* A successful **Smoke Test** of the core authentication functionality is executed.

### Test Exit Criteria (When to Stop Testing)
Testing is complete when the following project Definition of Done (DoD) criteria are met:
* **Coverage:** All listed user stories from Sprint 2 are covered by executed test cases.
* **Defect Closure:** All **Severity 1 and 2 defects** are fixed and retested successfully. Remaining Severity 3 and 4 defects are reviewed and accepted by the Product Owner.
* **Test Pass Rate:** The overall test pass rate is **95% or higher**.
* **Quality:** The document and testing artifacts satisfy the project's DoD criteria.
* **Documentation:** A Test Summary Report is created and approved.



## 5. Test Deliverables

| **Deliverable** | **Description** |
|------------------|-----------------|
| **Test Cases** | Step-by-step validation of UI screens, form modals, and navigation paths |
| **Test Data** | Dummy JSON datasets validated with `// TODO` placeholders |
| **Defect Reports** | Categorized by severity (UI, Navigation, Form Logic, Theme) |
| **Test Summary Report** | Includes Figma compliance, responsiveness validation, theme audit results |

## 6. Test Environment

### 6.1 Environment Setup and Configuration
The following table outlines the necessary hardware, software, network, and tools required for executing the Sprint 2 testing activities:

| Hardware | Software | Network | Tools |
| :--- | :--- | :--- | :--- |
| Standard PC/Laptop, Mobile Devices (iOS and Android) | Windows, macOS | Secure HTTPS for deployment, localhost for development `http://localhost:5173/engineer/auth/login`, `http://localhost:5173/engineer` | GitHub for version control and issue tracking, Browser - Chromium, Edge, Firefox |


### 6.2 Access Requirements

- Application: Engineer user accounts pre-loaded with dummy data  
- Environment Access: Read-only access to development environment for debugging purposes.  

## 7. Test Cases and Test Scenarios:

## User story 1: Engineer Web UI Implementation: My Account Module - Part 1

[LINK - User story 1](https://github.com/praxiodev/field-techy/issues/10)

## Test Scenarios

**Scenario 1**: Verify My Account Sidebar Opens Correctly

- **Preconditions:** User’s profile picture/icon is visible in the top-right corner of the screen.
- **Steps:**
  1. Click on the user’s profile icon/avatar in the top-right corner of the screen.  
  2. Observe the sidebar that appears on the right side of the page.

- **Expected Results:**
  * Sidebar titled **“My Account”** opens with user profile info:
    - **Name:** Nick Wilson  
    - **Role:** Software Engineer  
    - **Ratings and Reviews** displayed
  * Sidebar contains the following menu items:
    - My Profile  
    - My Jobs  
    - My Earning  
    - Saved Jobs  
    - Settings  
    - Logout
  * All links are clickable and styled consistently.  
  * Sidebar does not overlap or obscure critical content on the main page.
- **Coverage:**
  - Validates correct rendering and accessibility of the **My Account Sidebar** after login.


**Scenario 2**: Validate Logout Confirmation Popup Appears

**Preconditions:** User is logged in and Profile Sidebar is open.
- **Steps:**
  1. Click **“Logout”** in the Profile Sidebar.

- **Expected Results:**
  * A modal popup appears with:  
    - **Message:** “Are you sure you want to log out of your Field Techy account?”  
    - **Buttons:** *Cancel* and *Logout*  
  * User remains logged in until explicit confirmation.
- **Coverage:**
  - Ensures accidental logout is prevented (**UX safety rule**).

**Scenario 3**: Validate Cancel Action in Logout Popup

- **Preconditions:** Logout confirmation popup is visible.
- **Steps:**
  1. Click the **“Cancel”** button in the popup.

- **Expected Results:**
  * Popup closes immediately.  
  * User stays on the current page and remains authenticated.  
  * Profile Sidebar may remain open or close (per design) — but **no logout occurs**.
- **Coverage:**
  - Validates safe dismissal of the logout action.


**Scenario 4**: Validate Successful Logout via Confirmation

- **Preconditions:** Logout confirmation popup is visible.
- **Steps:**
  1. Click the **“Logout”** button inside the popup.

- **Expected Results:**
  * User is logged out of the session.  
  * Redirected to the login page or public home page.  
  * All protected routes (e.g., `/engineer/my-jobs`) are no longer accessible without re-login.
- **Coverage:**
  - Validates complete logout flow and session termination.


## Decision Table with Detailed Explanation

### Table Context

**What This Table Shows**: This decision table maps different testing scenarios to expected system behaviors. Each column represents a specific test situation you might encounter.


| **Menu Item Clicked** | **Click My Profile** | **Click My Jobs** | **Click My Earning** | **Click Saved Jobs** | **Click Settings** | **Click Logout** |
|------------------------|----------------------|-------------------|----------------------|----------------------|--------------------|------------------|
| My Profile        | Yes                  | No                | No                   | No                   | No                 | No               |
| My Jobs          | No                   | Yes               | No                   | No                   | No                 | No               |
| My Earning        | No                   | No                | Yes                  | No                   | No                 | No               |
| Saved Jobs         | No                   | No                | No                   | Yes                  | No                 | No               |
| Settings          | No                   | No                | No                   | No                   | Yes                | No               |
| Logout            | No                   | No                | No                   | No                   | No                 | Yes              |



## User Story 2: Engineer Web UI Implementation: My Account Module - Part 2

[LINK - User story 2](https://github.com/praxiodev/field-techy/issues/11)

## Test Scenarios 

**Scenario 1:** Validate Personal Information Fields

- **Preconditions:** User is on the Profile Sidebar → Personal Information page.  
- **Steps:**
1. Enter a valid Full Name (e.g., `"John Doe"`) meeting criteria (alphabets, spaces, 2–50 chars, no leading/trailing spaces).  
2. Select a Country Code from the dropdown.  
3. Enter a valid Mobile Number (e.g., `"1234567890"`).  
4. Enter a valid Email ID (e.g., `"user@example.com"`).  
5. Enter a valid Address (e.g., `"123 Main St, Apt #5"`).  
6. Submit the form.  

- **Expected Results:** Form submits successfully. All fields display as valid. No error messages appear.  
- **Coverage:** Validates correct input for all required Personal Information fields.

**Scenario 2:** Validate Full Name Field with Invalid Inputs

- **Preconditions:** User is on the Profile Sidebar → Personal Information page.  
- **Steps:**
1. Enter invalid Full Name inputs (e.g., `"John123", " John ", "J", "A".repeat(51)`).  
2. Attempt to submit the form or trigger validation.  

- **Expected Results:** Error messages appear (e.g., `"Only alphabets and spaces allowed", "No leading/trailing spaces", "Minimum 2 characters", "Maximum 50 characters")`. Form does not submit.  
- **Coverage:** Tests Full Name validation rules (alphanumeric restriction, space rules, length limits).

**Scenario 3:** Validate Mobile Number Field with Invalid Inputs

- **Preconditions:** User is on the Profile Sidebar → Personal Information page.  
- **Steps:**
1. Enter invalid Mobile Numbers (e.g., `"123456789", "12345678901", "abc123def", "+441234567890"`).  
2. Attempt to submit the form or trigger validation.  

- **Expected Results:** Error message: "Mobile number must be exactly 10 digits". Form does not submit.  
- **Coverage:** Tests mobile number rules (exactly 10 digits for UK/India).

**Scenario 4:** Validate Email ID Field with Invalid Inputs

- **Preconditions:** User is on the Profile Sidebar → Personal Information page.  
- **Steps:**
1. Enter invalid Email IDs (e.g., `"user@", "@example.com", "user.example.com", "a".repeat(101) + "@example.com"`).  
2. Attempt to submit the form or trigger validation.  

- **Expected Results:** Error message appears for invalid format or length. Form does not submit.  
- **Coverage:** Tests Email ID rules (format, length 10–100 characters).

**Scenario 5:** Validate Address Field with Invalid Inputs

- **Preconditions:** User is on the Profile Sidebar → Personal Information page.  
- **Steps:**
1. Enter invalid addresses (e.g., `"123!", "A".repeat(19), "A".repeat(51),`).  
2. Attempt to submit the form or trigger validation.  

- **Expected Results:** Error message appears for invalid characters or length. Form does not submit.  
- **Coverage:** Tests Address rules (allowed characters, length limits).

**Scenario 6:** Validate Education Section Add Functionality

- **Preconditions:** User is on Profile Sidebar → Education page. Clicks "+ Add Education".  
- **Steps:**
1. Select valid Education Level, Course, University, Major Subject.  
2. Enter valid Passing Year (e.g., `"2020"`).  
3. Submit the Add Education form.  

- **Expected Results:** New education entry is added successfully and displayed in Card View. No errors.  
- **Coverage:** Validates addition of education record with required fields.

**Scenario 7:** Validate Education Section Edit Functionality

- **Preconditions:** User has at least one education entry. Clicks "Edit".  
- **Steps:**
1. Modify any field (e.g., `Passing Year to "2025"`).  
2. Ensure all required fields remain valid.  
3. Submit Edit Education form.  

- **Expected Results:** Education entry updates successfully in Card View.  
- **Coverage:** Validates editing of an existing education record.


**Scenario 8:** Validate Education Section Delete Functionality

- **Preconditions:** User has at least one education entry.  
- **Steps:**
1. Click "Delete" on an education entry.  
2. Confirm deletion if prompted.  

- **Expected Results:** Education entry is removed from Card View.  
- **Coverage:** Validates deletion functionality.


**Scenario 9:** Validate Skills and Tools Section Add/Edit Functionality

- **Preconditions:** User is on Profile Sidebar → Skills and Tools page. Clicks "+ Add Skill"/"+ Add Tools".  
- **Steps:**
1. Select 1–15 skills/tools from dropdown (multi-select).  
2. Submit the form.  

- **Expected Results:** Skills/tools are added and displayed as chips in Card View.  
- **Coverage:** Validates adding/updating skills/tools within 1–15 selection limit.



**Scenario 10:** Validate Experience Section Add Functionality

- **Preconditions:** User is on Profile Sidebar → Experience page. Clicks "+ Add Experience".  
- **Steps:**
1. Select valid Designation, Work Location Type, Employment Type.  
2. Enter Employer name (e.g., `"Tech Corp"`).  
3. Select Start Date (e.g., `"2020-01-01"`). Optionally, End Date (e.g., `"2023-12-31"`).  
4. Submit Add Experience form.  

- **Expected Results:** New experience entry is added successfully in Card View.  
- **Coverage:** Validates addition of experience record with required fields.

**Scenario 11:** Validate Experience Section Edit Functionality

- **Preconditions:** User has at least one experience entry. Clicks "Edit".  
- **Steps:**
1. Modify any field (e.g., `Employer to "New Tech Corp"`).  
2. Ensure required fields remain valid.  
3. Submit Edit Experience form.  

**Expected Results:** Experience entry updates successfully in Card View.  
**Coverage:** Validates editing of an existing experience record.

**Scenario 12:** Validate Portfolio Link Field with Valid Inputs

- **Preconditions:** User is on Profile Sidebar → Work Preference page.  
- **Steps:**
1. Enter valid Portfolio Links (e.g., `GitHub, LinkedIn, root domain personal website`).  
2. Submit form.  

- **Expected Results:** Form submits successfully; links accepted. No errors.  
- **Coverage:** Validates valid portfolio link formats.

**Scenario 13:** Validate Portfolio Link Field with Invalid Inputs

- **Preconditions:** User is on Profile Sidebar → Work Preference page.  
- **Steps:**
1. Enter invalid Portfolio Links (e.g. `"not-a-link", "http://invalid", "https://www.example.com/page"`).  
2. Attempt to submit form or trigger validation.  

- **Expected Results:** Error message appears; form does not submit.  
-**Coverage:** Tests portfolio link format rules (specific patterns, root domain requirement).

**Scenario 14:** Validate Hourly/Fixed Rate Field with Valid Inputs

- **Preconditions:** User is on Profile Sidebar → Work Preference page.  
- **Steps:**
1. Enter valid Hourly/Fixed Rate (e.g., `"15.55", "100.00", "1.00", "999.99"`).  
2. Submit form.  

- **Expected Results:** Form submits successfully; rate accepted. No errors.  
- **Coverage:** Validates rate values (positive, up to 5 digits before decimal, 2 after).

**Scenario 15:** Validate Hourly/Fixed Rate Field with Invalid Inputs

- **Preconditions:** User is on Profile Sidebar → Work Preference page.  
- **Steps:**
1. Enter invalid Hourly/Fixed Rate (e.g., `"0", "-10.50", "1000.00", "15.555", "abc", ""`).  
2. Attempt to submit form or trigger validation.  

- **Expected Results:** Error message appears; form does not submit.  
- **Coverage:** Tests rate rules (positive, digit limits).

**Scenario 16:** Validate Documents Upload with Valid File

- **Preconditions:** User is on Profile Sidebar → Documents page.  
- **Steps:**
1. Select valid PDF file (e.g., `"resume.pdf", 100KB`).  
2. Upload file.  

- **Expected Results:** File uploads successfully; confirmation appears; file listed.  
- **Coverage:** Validates successful PDF upload within size limits.

**Scenario 17:** Validate Documents Upload with Invalid File
- **Preconditions:** User is on Profile Sidebar → Documents page.  
- **Steps:**
1. Select invalid file type (e.g., `"image.jpg", "document.doc") OR PDF exceeding size limit (e.g., 400KB`).  
2. Attempt to upload file.  

- **Expected Results:** Error message appears; upload fails.  
- **Coverage:** Tests document rules (PDF format, 50–350KB size limits).


## Decision Table with Detailed Explanation

### Table Context

**What This Table Shows**: This decision table maps different testing scenarios to expected system behaviors. Each column represents a specific test situation you might encounter.

### Profile Information

| **Test Case Description** | **Condition 1 (Input Type / Format)** | **Condition 2 (Length / Range)** | **Condition 3 (Special Rules)** | **Expected Result** |
|----------------------------|--------------------------------------|----------------------------------|----------------------------------|----------------------|
| Valid Full Name | Alphabets and spaces only | 2–50 characters | No leading/trailing spaces; max 10 spaces between words | Form accepts input; no error shown |
| Full Name with numbers or symbols | Contains digits or special characters (e.g., @, #, 1) | Any | N/A | Error: "Only alphabets and spaces allowed." |
| Full Name too short | Alphabets and spaces only | < 2 characters | N/A | Error: "Minimum 2 characters required." |
| Full Name too long | Alphabets and spaces only | > 50 characters | N/A | Error: "Maximum 50 characters allowed." |
| Full Name with leading/trailing spaces | Alphabets and spaces only | 2–50 characters | Has leading/trailing spaces | Error: "No leading or trailing spaces allowed." |
| Full Name with excessive internal spaces | Alphabets and spaces only | 2–50 characters | > 10 spaces between words | Error: "Maximum 10 spaces between words allowed." |
| Valid Country Code selection | Selected from dropdown | N/A | N/A | Form accepts selection; no error shown |
| No Country Code selected | Not selected | N/A | N/A | Error: "Country code is required." |
| Valid Mobile Number | Digits only | Exactly 10 digits | N/A | Form accepts input; no error shown |
| Mobile Number with letters/symbols | Contains non-digit characters | Any | N/A | Error: "Mobile number must contain only digits." |
| Mobile Number too short | Digits only | < 10 digits | N/A | Error: "Mobile number must be exactly 10 digits." |
| Mobile Number too long | Digits only | > 10 digits | N/A | Error: "Mobile number must be exactly 10 digits." |
| Valid Email ID | Valid email format (e.g., `user@domain.com`) | 10–100 characters | N/A | System sends verification code; no error shown |
| Invalid Email format | Missing @, domain, or malformed | Any | N/A | Error: "Please enter a valid email address." |
| Email too short | Valid format | < 10 characters | N/A | Error: "Email address must be at least 10 characters." |
| Email too long | Valid format | > 100 characters | N/A | Error: "Email address cannot exceed 100 characters." |
| Valid Address | Letters, numbers, spaces, and `/ , . - #` only | 20–50 characters | N/A | Form accepts input; no error shown |
| Address with invalid characters | Contains `$`, `%`, `<`, `>`, etc. | Any | N/A | Error: "Only letters, numbers, spaces, and `/ , . - #` are allowed." |
| Address too short | Valid characters only | < 20 characters | N/A | Error: "Address must be at least 20 characters." |
| Address too long | Valid characters only | > 50 characters | N/A | Error: "Address cannot exceed 50 characters." |


### Education Information

| **Test Case Description** | **Condition 1 (Input Type / Format)** | **Condition 2 (Length / Range)** | **Condition 3 (Special Rules)** | **Expected Result** |
|----------------------------|--------------------------------------|----------------------------------|----------------------------------|----------------------|
| Valid Education Level selection | Selected from dropdown | N/A | N/A | Form accepts selection; no error shown |
| No Education Level selected | Not selected | N/A | N/A | Error: "Education level is required." |
| Valid Course selection | Selected from dropdown | N/A | N/A | Form accepts selection; no error shown |
| No Course selected | Not selected | N/A | N/A | Error: "Course is required." |
| Valid University selection | Selected from dropdown | N/A | N/A | Form accepts selection; no error shown |
| No University selected | Not selected | N/A | N/A | Error: "University is required." |
| Valid Major Subject selection | Selected from dropdown | N/A | N/A | Form accepts selection; no error shown |
| No Major Subject selected | Not selected | N/A | N/A | Error: "Major subject is required." |
| Valid Passing Year | 4-digit number | 1970–2025 | Exactly 4 characters | Form accepts input; no error shown |
| Passing Year with letters | Contains non-digit characters | Any | N/A | Error: "Passing year must contain only digits." |
| Passing Year not 4 digits | Digits only | Not 4 characters | N/A | Error: "Passing year must be a 4-digit number." |
| Passing Year before 1970 | Digits only | 4 digits | Year < 1970 | Error: "Passing year must be between 1970 and 2025." |
| Passing Year after 2025 | Digits only | 4 digits | Year > 2025 | Error: "Passing year must be between 1970 and 2025." |

### Skills & Tools

| **Test Case Description** | **Condition 1 (Input Type / Format)** | **Condition 2 (Length / Range)** | **Expected Result** |
|----------------------------|--------------------------------------|----------------------------------|----------------------|
| Valid Skill selection | Multi-select from dropdown | 1–15 selections | Skills displayed as chips; no error shown |
| No Skill selected | 0 selections | N/A | Error: "At least one skill is required." |
| Too many Skills selected | Multi-select | > 15 selections | Error: "You can select a maximum of 15 skills." |
| Valid Tool selection | Multi-select from dropdown | 1–15 selections | Tools displayed as chips; no error shown |
| No Tool selected | 0 selections | N/A | Error: "At least one tool is required." |
| Too many Tools selected | Multi-select | > 15 selections | Error: "You can select a maximum of 15 tools." |



### Experience Details

| **Test Case Description** | **Condition 1 (Input Type / Format)** | **Condition 2 (Length / Range)** | **Expected Result** |
|----------------------------|--------------------------------------|----------------------------------|----------------------|
| Valid Designation selection | Selected from dropdown | N/A | Form accepts selection; no error shown |
| No Designation selected | Not selected | N/A | Error: "Designation is required." |
| Valid Employer name | Letters, numbers, spaces, &, -, /, . only | 4–50 characters | Form accepts input; no error shown |
| Employer with invalid characters | Contains $, %, <, >, etc. | Any | Error: "Employer name can only contain letters, numbers, spaces, and & - / ." |
| Employer too short | Valid characters only | < 4 characters | Error: "Employer name must be at least 4 characters." |
| Employer too long | Valid characters only | > 50 characters | Error: "Employer name cannot exceed 50 characters." |
| Valid Work Location Type | Selected from dropdown | N/A | Form accepts selection; no error shown |
| No Work Location Type selected | Not selected | N/A | Error: "Work location type is required." |
| Valid Employment Type | Selected from dropdown | N/A | Form accepts selection; no error shown |
| No Employment Type selected | Not selected | N/A | Error: "Employment type is required." |
| Valid Start Date | Date selected | 1970–2025 | Form accepts input; no error shown |
| No Start Date selected | Not selected | N/A | Error: "Start date is required." |
| Start Date before 1970 | Valid date | Before 1970 | Error: "Start date must be on or after 1970." |
| Start Date after 2025 | Valid date | After 2025 | Error: "Start date must be on or before 2025." |
| Valid/blank End Date | Date selected or blank | 1970–2025 (if provided or optional) | Form accepts input; no error shown |
| End Date before 1970 | Valid date | Before 1970 | Error: "End date must be on or after 1970." |
| End Date after 2025 | Valid date | After 2025 | Error: "End date must be on or before 2025." |



### Work Preference & Portfolio

| **Test Case Description** | **Condition 1 (Input Type / Format)** | **Condition 2 (Length / Range)** | **Condition 3 (Special Rules)** | **Expected Result** |
|----------------------------|--------------------------------------|----------------------------------|----------------------------------|----------------------|
| Valid Portfolio Link | Matches GitHub, LinkedIn, or root website URL | N/A | Must be profile/home page (e.g., `https://github.com/johndoe`) | Form accepts input; no error shown |
| Invalid Portfolio Link | Invalid format or subpage (e.g., `https://example.com/page`) | N/A | N/A | Error: "Please enter a valid portfolio link (GitHub, LinkedIn, or Personal website URL)." |
| Valid Preferred Work Type | Selected from dropdown | N/A | N/A | Form accepts selection; no error shown |
| No Preferred Work Type selected | Not selected | N/A | N/A | Error: "Preferred work type is required." |
| Valid Services Category | Selected from dropdown | N/A | N/A | Form accepts selection; no error shown |
| No Services Category selected | Not selected | N/A | N/A | Error: "Service category is required." |
| Valid Hourly/Fixed Rate | Positive decimal | 1–5 digits before decimal; up to 2 after | Value > 0 | Form accepts input; no error shown |
| Rate ≤ 0 or non-numeric | Zero, negative, or text | N/A | N/A | Error: "Rate must be greater than 0." |
| Rate too large | Positive number | > 5 digits before decimal | N/A | Error: "Rate cannot exceed 5 digits before the decimal point." |
| Rate with too many decimals | Positive number | > 2 decimal places | N/A | Error: "Rate can have a maximum of 2 decimal places." |


### Document Upload

| **Test Case Description** | **Condition 1 (Input Type / Format)** | **Condition 2 (Length / Range)** | **Expected Result** |
|----------------------------|--------------------------------------|----------------------------------|----------------------|
| Valid Document Upload | PDF file | 50–350 KB | Upload successful; file listed |
| Invalid Document Type | Non-PDF (e.g., .jpg, .doc) | Any | Error: "Only PDF files are allowed." |
| Document too small | PDF file | < 50 KB | Error: "File size must be at least 50 KB." |
| Document too large | PDF file | > 350 KB | Error: "File size cannot exceed 350 KB." |



## User Story 3: Engineer Web UI Implementation: Job module - Part 1

[LINK - User story 3](https://github.com/praxiodev/field-techy/issues/8)

## 7.1.1 Job/ My Job Test Scenarios 

**Scenario 1**: Verify Page Loads Successfully and Header Displays Correctly

- **Preconditions:**
  - User is logged in as an engineer.
  - User navigates to `http://192.168.1.106:5173/engineer/my-jobs`.
- **Steps:**
  1. Open the browser and navigate to the URL.  
  2. Wait for the page to fully load.  
  3. Check the page title and header section.  
  4. Verify breadcrumb navigation.

- **Expected Results:**
  * Page loads without error or blank screen.  
  * Main heading **“My Jobs”** is displayed prominently.  
  * Breadcrumb navigation shows **“Home / My Jobs”**.
- **Coverage:**
  - **Functional:** Page load success.  
  - **UI:** Header text and breadcrumb visibility.

**Scenario 2**: Verify Job Filter Tabs Are Visible and Clickable

- **Preconditions:**
  - Page is successfully loaded.  
  - Job data is present (as per provided content).
- **Steps:**
  1. Locate the filter tabs below the “My Jobs” heading.  
  2. Confirm presence of: “All Jobs”, “Applied”, “Today”, “In Progress”, “Completed”.  
  3. Click each tab one by one and observe if UI responds (e.g., highlights active tab).

- **Expected Results:**
  * All five filter tabs are visible and styled correctly.  
  * Each tab is clickable and changes visual state (e.g., background color) when selected.  
  * No JavaScript errors occur on click.
- **Coverage:**
  - **Functional:** Tab interactivity.  
  - **UI:** Visibility and state change of filter buttons.

**Scenario 3**: Verify Job Card Displays Correct Basic Information

- **Preconditions:** Page is loaded with job listings.
- **Steps:**
  1. Select the first job card titled **“Mobile App UI/UX Designer and..”**.  
  2. Verify all key fields are displayed:
     - Job Title  
     - Client Name  
     - Start Date & Time  
     - Duration (“Time”)  
     - Location with map icon  
     - Pay amount with money bag icon  
     - Job Type badge (“On Site” or “Remote”)

- **Expected Results:**
  * All fields match expected values:  
    - **Title:** “Mobile App UI/UX Designer and..”  
    - **Client:** “SafeHomes Inc.”  
    - **Start Date:** “May 28, 2025, 10:00 AM”  
    - **Time:** “8 Hours of Jobs”  
    - **Location:** “San Francisco, CA” + map icon  
    - **Pay:** “$400” + money bag icon  
    - **Job Type:** “On Site” or “Remote” (based on card)
- **Coverage:**
  - **Data:** Accuracy of job details per card.  
  - **UI:** Icon display and text formatting.

**Scenario 4**: Verify Sorting Dropdown Default State and Options

- **Preconditions:**
  - Page is loaded.  
  - Job cards are displayed.
- **Steps:**
  1. Locate the **“Sort by: Newest”** dropdown near the top right of job listings.  
  2. Verify default selection is “Newest”.  
  3. Click the dropdown to reveal sorting options (if any beyond “Newest”).

- **Expected Results:**
  * Dropdown is visible and labeled **“Sort by: Newest”**.  
  * When clicked, it displays available sort options (e.g., Oldest, Highest Pay, etc.) — if implemented.  
  * Selection does not break layout or cause JavaScript errors.
- **Coverage:**
  - **Functional:** Dropdown interaction.  
  - **UI:** Display and behavior of sorting control.


**Scenario 5**: Verify Sidebar Profile Section Displays Accurately

- **Preconditions:**
  - Page is loaded.  
  - User profile data is available.
- **Steps:**
  1. Observe the right sidebar panel.  
  2. Verify presence of:
     - Engineer’s name (**“Michel Brown”**)  
     - Role (**“Software Engineer”**)  
     - Phone number (**“+91 74582405XX”**)  
     - **“Complete Now”** button  
     - Profile Score bar with percentage (e.g., “39%”)

- **Expected Results:**
  * All profile elements are displayed correctly.  
  * Profile Score bar visually represents the percentage.  
  * **“Complete Now”** button is clickable and styled appropriately.
- **Coverage:**
  - **Data:** Profile accuracy.  
  - **UI:** Layout and component rendering in sidebar.

**Scenario 6**: Verify Earnings Summary Panel Displays Correctly

- **Preconditions:**
  - Page is loaded.  
  - Earning data is available.
- **Steps:**
  1. In the right sidebar, locate the **“My Earning”** section.  
  2. Verify:
     - Section title **“My Earning”**  
     - Label **“Current Balance”**  
     - Amount displayed (e.g., **“$8,250.56”**)  
     - **“View all”** link/button  
     - **“Bank Details”** and **“Withdraw”** buttons

- **Expected Results:**
  * All elements are present and properly labeled.  
  * Balance amount is formatted correctly with a currency symbol.  
  * Buttons are styled and clickable (no JS errors on hover/click).
- **Coverage:**
  - **Data:** Earning balance accuracy.  
  - **UI:** Button and label visibility, formatting.

**Scenario 7**: Verify Filter Tabs Dynamically Update Job Listings

- **Preconditions:**
  - Page is loaded with multiple jobs having different statuses (assumed from screenshot context).  
  - Status badges like “In-Progress”, “Applied”, “Completed” are present on job cards.

- **Steps:**
  1. Click **“Applied”** tab and observe which job cards remain visible.  
  2. Repeat for **“In Progress”** and **“Completed”** tabs.  
  3. Click **“All Jobs”** to reset view.

- **Expected Results:**
  * When **“Applied”** is clicked → Only jobs with “Applied” status are shown.  
  * When **“In Progress”** is clicked → Only jobs with “In-Progress” status are shown.  
  * When **“Completed”** is clicked → Only jobs with “Completed” status are shown.  
  * **“All Jobs”** restores full list.
- **Coverage:**
  - **Functional:** Filtering logic works dynamically.  
  - **Data:** Status-based filtering accuracy.  
  - **UI:** List updates without page reload.


**Scenario 8**: Verify Consistency Across All Job Cards

- **Preconditions:** Page is loaded with at least 6 job cards (as per content).
- **Steps:**
  1. Scroll through all job cards.  
  2. For each card, verify:
     - All fields are consistently displayed (Title, Client, Start Date, Time, Location, Pay, Job Type).  
     - Icons (map, money bag) appear next to correct fields.  
     - No missing or malformed data.

- **Expected Results:**
  * Every job card follows the same structure and contains all required fields.  
  * No card has empty/null values where data is expected.  
  * Icons are aligned and rendered correctly across all cards.
- **Coverage:**
  - **Data:** Consistency across all records.  
  - **UI:** Uniform layout and styling of job cards.

**Scenario 9**: Verify Job Type Badge Reflects Correct Work Mode

- **Preconditions:** Page is loaded with mixed job types (“On Site” and “Remote”).
- **Steps:**
  1. Identify job cards labeled **“On Site”** and **“Remote”**.  
  2. Confirm that the badge appears in the top-right corner of each card.  
  3. Validate badge text matches actual job type (e.g., “On Site” for physical jobs, “Remote” for virtual).

- **Expected Results:**
  * Badge is clearly visible and legible.  
  * Text matches the job’s work mode.  
  * Badge styling (color, shape) is consistent with the design system.
- **Coverage:**
  - **Data:** Job type accuracy.  
  - **UI:** Badge placement and visual style.


**Scenario 10**: Verify Location and Pay Fields Include Correct Icons

- **Preconditions:** Page is loaded with job cards.
- **Steps:**
  1. For any job card, check:
     - Location field has **map pin icon** before “San Francisco, CA”.  
     - Pay field has **money bag icon** before “$400”.

- **Expected Results:**
  * Icons are displayed next to respective fields.  
  * Icons are rendered correctly (not broken images).  
  * Icons are positioned consistently across all job cards.
- **Coverage:**
  - **UI:** Icon integration and positioning.  
  - **Data:** Field-label-icon association.


## Decision Table with Detailed Explanation

### Table Context

**What This Table Shows**: This decision table maps different testing scenarios to expected system behaviors. Each column represents a specific test situation you might encounter.


| Test Case Description                        | My Jobs (All Jobs) | Search Result | Applied (/jobs-details/applied) | In Progress (/jobs-details/in-progress) | Completed (/jobs-details/completed) | Expected Result |
|----------------------------------------------------|------------------|---------------|---------------------------------|----------------------------------------|------------------------------------|----------------|
| Job cards show status badges                        | No               | No            | No                              | No                                     | No                                 | No explicit status badges shown in raw data |
| Icons displayed                                     | Yes              | Yes           | Yes                             | Yes                                    | Yes                                | Icons appear consistently next to their respective fields |
| Active tab or button state displayed               | No               | No            | No                              | No                                     | No                                 | No active tab/button state shown in content |
| Job card structure consistency                     | Yes              | Yes           | Yes                             | Yes                                    | Assumed                            | Job cards show consistent structure with client, date, time, location, pay, and job type badge |
| Location / Search Job                               | No               | Yes           | No                              | No                                     | No                                 | Location and Search Result are displayed correctly; duplication may occur in Search Result UI |
| “Application Sent” message                          | No               | No            | Yes                             | No                                     | No                                 | Displayed only on Applied job details page |
| Active job actions (Update Log, Submit Work)       | No               | No            | No                              | No                                     | No                                 | Active job buttons only visible during live session; not in raw data |
| Job Completed indicator                             | No               | No            | No                              | No                                     | Cannot verify                      | Completion indicator assumed for Completed jobs but content not provided |
| Timeline (dates & tasks) displayed                  | Yes              | Yes           | Yes                             | Yes                                    | Yes                                | Timeline always displayed across all states |
| File & image attachments                            | Yes              | Yes           | Yes                             | Yes                                    | Yes                                | Attachments are visible and clickable if available |
| Profile sidebar with user info and earnings        | N/A              | N/A           | N/A                             | N/A                                    | N/A                               | Sidebar content not provided. 


## 7.1.2 Job/Search result Test Scenario:

**Scenario 1**: Verify Job Search Functionality and Display of Search Results

- **Preconditions:**
  - The user is logged in as an engineer.
  - The user is on the job search page (e.g., `homepage or dedicated search page with “Search Job” and “Location” input fields`).
- **Steps:**
  1. Enter a job keyword (e.g., `“UI/UX Designer”`) in the “Search Job” field.  
  2. Enter a location (e.g., “New York, USA”) in the “Location” field.  
  3. Click the “Search” button.  
  4. Observe the redirected URL: `http://192.168.1.106:5173/engineer/search-result`.  
  5. Verify the page displays a count of jobs found (e.g., `“141 jobs found”)`.  
  6. Check that job cards match the searched keyword and location.  
  7. Validate structure and content of each job card:  
     - *Job Title*  
     - *Client Name*  
     - *Time* (“8 Hours of Jobs”)  
     - *Posted Time* (“2h ago”, “30min ago”)  
     - *Job Description Snippet*  
     - *Location with map icon*  
     - *Pay with money bag icon*
- **Expected Results:**
  * User is successfully redirected to the Search Result page with a valid URL.  
  * Page displays a clear count of matching jobs (e.g., `“140 jobs found”`).  
  * All displayed job cards:  
    * Contain titles relevant to the search keyword (e.g., `“Mobile App UI/UX Designer”`).  
    * Show correct client name (`“TechNova Co”`).  
    * Display consistent “Time” value (`“8 Hours of Jobs”`).  
    * Show accurate relative time posted (`“2h ago”, “30min ago”`).  
    * Include a short, relevant job description.  
    * Show location matching or related to the searched location (e.g., `“New York, USA” or “San Francisco, USA” if location filter is not strict`).  
    * Display correct pay amount with currency (e.g., `“$5000”, “$4000”`) and money bag icon.  
    * Location is shown with map point icon.  
    * No broken images, layout shifts, or console errors.

- **Coverage:**
  - *Functional:* Search input handling, redirection, filtering logic, result rendering.  
  - *Data:* Accuracy of job title, client, time, posted time, location, pay, description.  
  - *UI/UX:* Consistent card layout, icon rendering, job count visibility.

## Decision Table with Detailed Explanation

### Table Context

**What This Table Shows**: This decision table maps different testing scenarios to expected system behaviors. Each column represents a specific test situation you might encounter.


| Test Case Description                                         | Input (Search Jobs)                | Input (Location)                 | Expected Result(s) |
|-------------------------------------------------------------------|--------------------------------|---------------------------------|------------------|
| Verify search returns jobs matching both keyword and location     | UI/UX                          | New York, USA                   | “Mobile App UI/UX Designer” displayed, Client: TechNova Co, Location: “New York, USA” (appears twice due to UI bug), Pay: $5000, Time: “8 Hours of Jobs”, Posted: “2h ago”. |
| Verify search returns multiple jobs for same location with different titles | Designer                       | San Francisco, USA              | Displays “Senior Product Designer” and “Looking for a talented graphic designer”, both show Client: TechNova Co, Location: San Francisco, USA, Pay: $4000, Posted: 30min ago. |
| Verify search finds job in a different city with relevant keyword | Web Designer                   | Austin, USA                     | Displays “Junior Web Designer”, Client: TechNova Co, Location: Austin, USA, Pay: $4000, Posted: 30min ago. |
| Verify all job cards include required fields and icons            | Designer (any valid keyword)   | San Francisco, USA (any valid location) | Each job card shows Job title, Client: TechNova Co, Time: “8 Hours of Jobs”, Posted time (e.g., “30min ago”), Job description snippet, Map icon before location, Money bag icon before pay. |
| Verify job count reflects total results                            | Any search returning results   | Any                             | Page displays “140 jobs found” and count matches backend data even if only partial results visible. |
| Verify duplicated location text is displayed as rendered (known UI issue) | UI/UX                          | New York, USA                   | Location appears as “New York, USA New York, USA”, Pay and icons duplicated (“$5000 $5000”), known UI rendering bug. |
| Verify consistent client name across all results                 | Any                   | Any                             | All job cards display Client: TechNova Co. |
| Verify consistent job duration across all results                | Any                   | Any                             | All job cards display “8 Hours of Jobs” with clock icon. |

## 7.1.3 Job/Job Details Test Scenario:

**Scenario 1**: Verify Job Details Page for `“Applied”` Status Shows Application Confirmation

- **Preconditions:**
  - User is logged in.  
  - User has applied to a job (Job ID #4521454).
- **Steps:**
  1. Navigate to the Applied job details URL.  
  2. Verify breadcrumb: “Home / Jobs #4521454”.  
  3. Confirm job title: “Mobile App UI/UX Designer and Product Designer”.  
  4. Check that `“Application Sent”` is displayed prominently below the client name.  
  5. Validate the following details:  
     - *“8 Hours of Jobs”* with clock icon  
     - *Client:* “TechNova Co”  
     - *Full “Job information” timeline* (same as In Progress)  
     - *File and image attachments*  
     - *Payment:* “$200.00 Fixed Price” with price tag icon  

- **Expected Results:**
  * “Application Sent” message is clearly visible.  
  * All other job details (timeline, files, payment) match the **In Progress** version.  
  * No “Apply Now” button is present
- **Coverage:**
  - *Functional:* Post-application state  
  - *Data:* Confirmation message and job metadata  
  - *UI:* Status message placement and clarity


**Scenario 2**: Verify `“Not Applied”` Job Details Page Displays Correct Information

- **Preconditions:**
  - User is logged in as an engineer.  
  - User navigates to a job they have not yet applied to (e.g., Job ID #4521454).  
  - The system has job data available (as shown in the screenshot).
- **Steps:**
  1. Navigate to the **Not Applied** job details page.  
  2. Verify the page title is **“Job Details”** with breadcrumb: *“Home / Jobs / #4521454”*.  
  3. Confirm the main job card displays:  
     - **Job Title:** “Mobile App UI/UX Designer and Product Designer”  
     - **Duration:** “8 Hours of Jobs” with clock icon  
     - **Client:** “TechNova Co”  
     - **Job Type Badge:** “On Site” (top right)  
     - **Action Button:** “Send Proposal” (light green button)  
  4. Validate the presence of tabs:  
     - “Job Information”  
     - “Requirement”  
     - “SPOC Details”  
     - “Other”  
     - “Proposal’s Terms & Conditions”  
  5. Under the **“Job Information”** section, verify the following timeline points:  
     - Created on **10-Feb-2024, 09:00 AM**  
     - Tentative Start on: **12-Feb-2024**  
     - Review feedback by **15-Feb-2024**  
     - Implementation phase begins on **16-Feb-2024**  
     - Launch project on **01-Mar-2024**  
  6. Check **file attachments:**  
     - “File Documents.doc” 
     - “Image Document.jpg”  
  7. Confirm **Payment Terms** section:  
     - Amount: “$200.00”  
     - Type: “Fixed Price” with price tag icon  

- **Expected Results:**
  * Page loads successfully with correct title and breadcrumb.  
  * Main job card shows accurate title, duration, client, and “On Site” badge.  
  * “Send Proposal” button is visible and styled correctly (light green, clickable).  
  * All tabs are present and selectable.  
  * Job timeline is displayed clearly with all key dates and tasks.    
  * Payment section clearly displays “$200.00 Fixed Price” with currency symbol and label.
- **Coverage:**
  - *Functional:* Page rendering, tab navigation, proposal button interaction  
  - *Data:* Accuracy of job title, client, timeline, files, payment  
  - *UI/UX:* Layout consistency, icon usage, button styling, breadcrumb  
  - *State Logic:* Confirms this is a pre-application state — no “Application Sent” or “In Progress” indicators


**Scenario 3**: Verify `“In Progress”` Job Details Page Displays Active Job Actions and Full Timeline

- **Preconditions:**
  - User is logged in as an engineer.  
  - User has an active job with status **“In Progress”** (e.g., Job ID #4521454).  
  - The system has job data available (as shown in the screenshot).

- **Steps:**
  1. Navigate to the **In Progress** job details page.  
  2. Verify the page title is **“Job Details”** with breadcrumb: *“Home / Jobs / #4521454”*.  
  3. Confirm the main job card displays:  
     - **Job Title:** “Mobile App UI/UX Designer and Product Designer”  
     - **Duration:** “8 Hours of Jobs” with clock icon  
     - **Client:** “TechNova Co”  
     - **Job Type Badge:** “On Site” (top right)  
     - **Action Buttons:** “Update Log” (light green) and “Submit Work” (white)  
  4. Validate the presence of tabs:  
     - “Logs”  
     - “Work Submissions”  
     - “Job Information”  
     - “Requirement”  
     - “SPOC Details”  
     - “Other”  
     - “Proposal’s Terms & Conditions”  
  5. Under the **“Job Information”** section, verify the following timeline points:  
     - Created on **10-Feb-2024, 09:00 AM**  
     - Tentative Start on: **12-Feb-2024**  
     - Review feedback by **15-Feb-2024**  
     - Implementation phase begins on **16-Feb-2024**  
     - Launch project on **01-Mar-2024**  
  6. Check **file attachments:**  
     - “File Documents.doc”  
     - “Image Document.jpg”  
  7. Confirm **Payment Terms** section:  
     - Amount: “$200.00”  
     - Type: “Fixed Price” with price tag icon  

- **Expected Results:**
  * Page loads successfully with correct title and breadcrumb.  
  * Main job card shows accurate title, duration, client, and “On Site” badge.  
  * “Update Log” and “Submit Work” buttons are visible and styled correctly — indicating active job state.  
  * All tabs are present and selectable.  
  * Job timeline is displayed clearly with all key dates and tasks.   
  * Payment section clearly displays “$200.00 Fixed Price” with currency symbol and label.  
  * No “Application Sent” or “Send Proposal” message/button is present.  

- **Coverage:**
  - *Functional:* Active job actions (Update Log, Submit Work), tab navigation  
  - *Data:* Accuracy of job title, client, timeline, files, payment  
  - *UI/UX:* Layout consistency, button styling, icon usage, breadcrumb  
  - *State Logic:* Confirms this is an active assignment — no pre-application or post-application confusion


**Scenario 4**: Verify `“Job Completed”` Job Details Page Displays Final Status and Historical Information

- **Preconditions:**
  - User is logged in as an engineer.  
  - User has a job with status **“Completed”** (e.g., Job ID #4521454).  
  - The system has job data available (as shown in the screenshot).

- **Steps:**
  1. Navigate to the **Job Completed** details page.  
  2. Verify the page title is **“Job Details”** with breadcrumb: *“Home / Jobs / #4521454”*.  
  3. Confirm the main job card displays:  
     - **Job Title:** “Mobile App UI/UX Designer and Product Designer”  
     - **Duration:** “8 Hours of Jobs” with clock icon  
     - **Client:** “TechNova Co”  
     - **Job Type Badge:** “On Site” (top right)  
     - **Status Indicator:** “Job Completed” (green checkmark + text) — positioned next to “On Site” badge  
  4. Validate the presence of tabs:  
     - “Logs”  
     - “Work Submissions”  
     - “Job Information”  
     - “Requirement”  
     - “SPOC Details”  
     - “Other”  
     - “Proposal’s Terms & Conditions”  
  5. Under the **“Job Information”** section, verify the following timeline points:  
     - Created on **10-Feb-2024, 09:00 AM**  
     - Tentative Start on: **12-Feb-2024**  
     - Review feedback by **15-Feb-2024**  
     - Implementation phase begins on **16-Feb-2024**  
     - Launch project on **01-Mar-2024**  
  6. Check **file attachments:**  
     - “File Documents.doc” 
     - “Image Document.jpg”  
  7. Confirm **Payment Terms** section:  
     - Amount: “$200.00”  
     - Type: “Fixed Price” with price tag icon  

- **Expected Results:**
  * Page loads successfully with correct title and breadcrumb.  
  * Main job card shows accurate title, duration, client, and “On Site” badge.  
  * “Job Completed” status indicator is clearly visible and styled appropriately — confirming final state.  
  * All tabs are present and selectable (even if read-only for completed jobs).  
  * Job timeline is displayed clearly with all key dates and tasks.  
  * Payment section clearly displays “$200.00 Fixed Price” with currency symbol and label.  
  * No “Update Log”, “Submit Work”, or “Send Proposal” buttons are present — only historical view.  

- **Coverage:**
  - *Functional:* Post-completion job view, tab navigation  
  - *Data:* Accuracy of job title, client, timeline, files, payment  
  - *UI/UX:* Layout consistency, status indicator visibility, icon usage, breadcrumb  
  - *State Logic:* Confirms this is a finalized job — no active actions possible


## Decision Table with Detailed Explanation

### Table Context

**What This Table Shows**: This decision table maps different testing scenarios to expected system behaviors. Each column represents a specific test situation you might encounter.

| Test case Description                        | Not Applied | Applied | In Progress | Completed | Expected Result |
|----------------------------------------|------------|--------|------------|-----------|----------------|
| Page shows “Send Proposal” button       | Yes        | No     | No         | No        | Visible only before applying |
| Page shows “Application Sent” message   | No         | Yes    | No         | No        | Visible only after applying |
| Page shows “Update Log” button          | No         | No     | Yes        | No        | Visible only during active work |
| Page shows “Submit Work” button         | No         | No     | Yes        | No        | Visible only during active work |
| Page shows “Job Completed” status indicator | No      | No     | No         | Yes       | Visible only in final state |
| “Logs” and “Work Submissions” tabs visible | No      | No     | Yes        | Yes       | Visible once job is accepted or active |
| Job timeline (dates & tasks) displayed | Yes        | Yes    | Yes        | Yes       | Always displayed across all states |
| File & image attachments visible        | Yes        | Yes    | Yes        | Yes       | Always displayed across all states |
| Payment Terms = “$200.00 Fixed Price”  | Yes        | Yes    | Yes        | Yes       | Always displayed across all states |
| Client = “TechNova Co”                  | Yes        | Yes    | Yes        | Yes       | Always displayed across all states |
| Job Title = “Mobile App UI/UX Designer and Product Designer” | Yes | Yes | Yes | Yes | Always displayed across all states |
| Page allows user to apply again         | Yes        | No     | No         | No        | Only allowed before applying |


## 8. Test Data

### 8.1 Data Requirements & Sources

The test data for Sprint 2 focuses on validating the **Engineer Web UI Implementation: Job Module - Part 1** and **My Account Module (Parts 1 & 2)**. Since there is no backend integration in this phase, all test data is structured as mock JSON files with clear `// TODO` markers for future API integration. The test data is designed to validate UI/UX compliance, navigation flows, form validation rules, and responsive behavior across all breakpoints.

The test data requirements are derived from the following sources:

- **User Stories**: Specifically, "Engineer Web UI Implementation: Job module - Part 1", "Engineer Web UI Implementation: My Account Module - Part 1", and "Engineer Web UI Implementation: My Account Module - Part 2".
- **Figma Design Specifications**: Pixel-perfect UI/UX requirements for all screens.
- **Validation Rules**: Form field requirements defined in the implementation documentation for education, skills, experience, and job search components.
- **Theme Guidelines**: Light/dark mode specifications for consistent visual presentation.

All test data must cover:

- **Positive Scenarios**: Valid inputs and navigation paths that should successfully complete user flows.
- **Negative Scenarios**: Invalid inputs that should trigger appropriate error messages and prevent form submission.
- **Boundary Conditions**: Inputs at minimum and maximum limits defined in validation rules.
- **Edge Cases**: Special characters, empty fields, null values, theme transitions during critical flows, and responsive layout breaks.
- **State Transitions**: Testing of modal states (View → Edit → Save → View) and job status flows.


| Test Category                 | Description                                                                                  | Purpose                                                                                   |
|-------------------------------|----------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Profile Navigation Scenarios   | Complete and incomplete profile states, sidebar navigation paths                             | Validate all navigation flows between My Account sections and proper UI state transitions |
| Form Validation Cases          | Valid/invalid inputs for all form fields (education, skills, work preferences)              | Test input constraints, error messaging, and form submission logic                        |                                  |
| Theme Consistency Checks       | Light mode vs. dark mode comparison for all components                                       | Verify visual consistency when toggling between light and dark themes                      |
| Job Status Flows               | Job details for "Not Applied", "Applied", and "In Progress" states                           | Validate conditional UI rendering based on job application status                          |
| Add/Edit Modal States          | New entry creation, editing existing entries, cancel operations                              | Test dynamic form behavior and state management of reusable modal components               |
| Document Upload Scenarios      | Valid PDFs (50KB, 250KB, 500KB), invalid file types, oversized files                         | Validate document upload functionality and error handling                                   |
| Search Filter Combinations     | Various combinations of location, job type, experience level filters                          | Test job search functionality and result filtering logic                                   |
| Special Character Handling     | Names, schools, and companies with special characters (e.g., C++, React.js)                  | Verify proper rendering and validation of special characters in all fields                 |
| Empty State Cases              | No education entries, no skills, no jobs in search results                                     | Validate proper UI presentation when no data is available                                   |


### 8.2 Validation Test Data

| Field                 | Valid Data                               | Invalid / Edge Cases                                                                 |
|-----------------------|-----------------------------------------|------------------------------------------------------------------------------------|
| First Name            | Alex                                     | Alex@, A (too short), A".repeat(101) (101 chars - exceeds max)                     |
| Last Name             | Morgan                                   | Morgan#, M (too short), M".repeat(101) (101 chars - exceeds max)                   |
| Email                 | `alex.morgan@engineer.com `                | alex.morgan@engineer (no domain), `alex+verylongemailaddress@engineer.com` (100+ chars), " " (empty) |
| Phone                 | +1 (555) 123-4567                        | 555-123 (invalid format), +1(555)1234567 (missing spaces), +1 555 123 456 (9 digits) |
| Date of Birth         | 1990-05-15                               | 2025-10-15 (future date), 1990/05/15 (wrong format), "" (empty)                   |
| School Name           | Stanford University                       | "A".repeat(101) (101 chars), " " (empty), " " (whitespace only)                   |
| Degree                | B.S. Computer Science                     | "A".repeat(101) (101 chars), " " (empty), "B.S." (too short)                       |
| Start Date            | 2010-09-01                                | 2025-09-01 (future date), 2010/09/01 (wrong format), "" (empty)                    |
| End Date              | 2014-05-15                                | 2009-05-15 (before start date), 2025-05-15 (future date), "Present" (valid current job) |
| Job Title             | Senior Frontend Engineer                  | "A".repeat(101) (101 chars), " " (empty), "Frontend/Engineer" (special char)       |
| Company Name          | Tech Innovations Inc.                     | "A".repeat(101) (101 chars), " " (empty), "Tech&Innovations" (special char)       |
| Location              | San Francisco, CA                         | " " (empty), "SF" (too short), "A".repeat(101) (101 chars)                          |
| Salary Range          | $100,000 - $125,000                       | "$100,000" (incomplete format), "100k-125k" (wrong format), "" (empty)             |
| Skill Name            | JavaScript                                | "A".repeat(51) (51 chars), " " (empty), "C++" (valid special char), "JS, React" (multiple entries) |
| Employment Type       | Full-time, Contract                        | "Part Time" (invalid format), "" (empty), 5 (non-text)                              |
| Work Hours            | 40+                                        | 30 (below min), 60+ (valid), "" (empty)                                            |
| Document Upload       | 2.5MB PDF (resume.pdf)                     | 5.5MB PDF (exceeds limit), image.jpg (wrong type), "" (empty)                       |
| Search Jobs Filter        | "Frontend Developer"                       | "A".repeat(101) (101 chars), " " (empty), "React & TypeScript" (special chars)     |
| Location Filter       | San Francisco, Remote                       | "SF", "" (empty), "A".repeat(51) (51 chars)                                        |
| Job Type Filter       | Full-time, Contract                         | "Part-time", "" (empty), "Full Time" (format mismatch)                               |
| Experience Filter     | Senior                                      | "Lead", "" (empty), "5+ years" (format mismatch)                                     |

