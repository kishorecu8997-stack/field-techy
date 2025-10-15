# Test Design Document for Sprint 1 and 2

## **1\. Introduction and Scope**

### 1.1 Purpose of the Document:

The **Purpose** of this Test Design Document (TDD) is to define the strategy, objectives, scope, environment, resources, and deliverables for the testing activities covering the **Engineer Web UI Implementation Part** features developed during **Sprint 1 and Sprint 2**.

### 1.2 Background and Context of the Project:

The project involves the implementation and refinement of the core user interface for the **Engineer** role, focusing on key areas such as authentication, job management, and user account settings. This testing effort is essential to validate the functional correctness and UI/UX quality of the new web application modules.

### 1.3 Objectives of Testing:

The primary objectives of the testing phase are to:

1. **Validate Functionality:** Ensure that all features described in the listed user stories (Auth, Job, My Account modules) work correctly and meet all acceptance criteria.  
2. **Verify UI/UX:** Confirm that the user interface is intuitive, consistent, responsive, and adheres to the required design specifications.  
3. **Ensure Quality:** Identify and report defects, risks, and areas of non-compliance early in the development lifecycle.  
4. **Confirm Traceability:** Establish clear linkage between requirements (user stories), test cases, and defects.

### 1.4 Scope (Features/Modules to be Tested):

The scope of this TDD covers comprehensive testing of the following **seven user stories** from Sprint 1 and 2:

* Engineer Web UI Implementation: **Auth module**  
* Engineer Web UI Implementation: **Job module \- Part 1 & 2**  
* Web — **Input Validation and UI Refinements** for Sprints 1 and 2  
* Engineer Web UI Implementation: **My Account Module \- Part 1, 2, & 3**

This includes **System Testing** (end-to-end user flows) and **Integration Testing** (data flow between modules) for the core web application.

### 1.5 Out of Scope (Features/Modules Not to be Tested):

The following are explicitly **out of scope** for this testing effort:

* **Performance/Load Testing:** Assessing system responsiveness under heavy load.  
* **Automated Regression Testing:** While test scripts may be developed, full automation framework setup and execution of the entire regression suite are not the primary focus of these sprints.  
* **Security Penetration Testing:** Deep-dive ethical hacking and vulnerability scanning beyond basic functional security checks in the Auth module.  
* **Backend/API Logic:** Testing is focused solely on the **Web UI implementation** and user experience; direct testing of backend APIs or database logic is excluded.

## **2\. Test Items:**

### 2.1 Scope (Items to be Tested):

| Module | Features | Testable Features |
| :---: | ----- | ----- |
| Authentication (Auth) | Engineer Web UI Implementation: **Auth module** | User Login, User Logout, Forgot Password, Reset Password |
| Job Management | Engineer Web UI Implementation: **Job module \- Part 1 & 2** | Job Listing/View, Job Search/Filtering (by status, date, type), Application Flow, Job Detail Display, Role-based Access to Job management features. |
| My Account | Engineer Web UI Implementation: **My Account Module \- Part 1, 2, & 3** | My Profile Viewing/Editing(Personal information,Education,Skills\&Tool,Experience,Work Preference,Documents) |
| System Refinements | Web — **Input Validation and UI Refinements** for Sprints 1 and 2 | Field-level validation across all forms, Error messaging consistency, UI responsiveness |

## **3\. Test Approach and Strategy:**

### 3.1 Overall Testing Strategy:

| Strategy Component | Focus / Methodology |
| :---: | ----- |
| Manual Testing | Execution of all detailed **Test Cases and Scenarios** for all features, with an emphasis on **Functional**, **UI/UX**, and **Integration Testing**. |
| Exploratory Testing | Time-boxed, unscripted testing focusing, It will focus on **edge cases**, **error paths**, and verifying the overall *feel* of the application. |

### 3.2 Types and Levels of Testing:

* **Unit Testing:** Testing individual components, primarily done by developers.  
    
* *Application Test:* (Individual components of the **Auth**, **Job**, and **My Account** modules before integration.)  
    
* **Integration Testing:** Testing how different modules interact  
    
* *Application Test:* (Data flow and communication between the **Auth, Job, and My Account**.)  
    
* **System Testing:** Testing the end-to-end functionality of the entire system against the user stories.  
    
* *Application Test:* (Execution of all **user flows** for login, job search, and profile updates under realistic conditions.)  
    
* **Acceptance Testing (UAT):** Formal testing by the Product Owner/stakeholders to ensure the system meets the overall acceptance criteria and project's Definition of Done (DoD).

       
### 3.3 Type of Testing:

* **Functional Testing:** Verifies that the system performs all specified functions. All features: successful login, correct job filtering, valid data entry in profile fields.  
    
* **Regression Testing:** Re-tests critical path functions after every major deployment to ensure no existing functionality is broken. Core, critical path functions like **Login/Logout** and **Job Viewing** after every major deployment.  
    
* **Usability Testing:** Focuses on ease of use, navigation, and overall user experience. Overall application flow and adherence to the **UI Refinements** user story.  
    
* **Compatibility Testing:** Ensures correct functionality across required browsers (Chrome, Firefox, Edge) and device views (desktop/mobile).  
    
* **Security Testing:** Basic checks focusing on access control, input sanitization, and session management, particularly in the **Auth module**.

### 3.4 Testing Technique:

* **Black-Box Testing:** Focuses on inputs and outputs without knowing internal code. Application Test:**Primary technique** used for all modules (**Auth, Job, My Account**). It verifies that user actions (e.g., clicking a button, submitting a form) produce the expected output.  
    
    
* **Boundary Value Analysis (BVA):** Applied to the **Auth Module** (min/max password length) and **My Account Module** (character limits on profile fields).  
    
* **Equivalence Partitioning:** Used for the Job Module search filters (testing one valid status filter represents all valid statuses) and for validating correct/incorrect formats in the Input Validation story. 
    
* **State Transition Testing:** Crucial for the **Auth Module** to verify correct state changes (Logged In, Session Expired) and secure transitions.  
    
* **Error Guessing:** Applied across **All Modules** to proactively check for common issues like unexpected characters in required fields (per **Input Validation**) and handling of null inputs.

## **4\. Test Criteria:**

Test Entry Criteria (When to Start Testing):

* All user stories for Sprint 1 and 2 are **developed and code-complete**.  
* The test environment is **stable** and confirmed ready for testing.  
* The Test Design Document and all necessary test cases are **reviewed and finalized**.  
* All identified test data is **provisioned and accessible**.  
* A **successful Smoke Test** of the core application is executed.


Test Exit Criteria (When to Stop Testing):

Testing is complete when the following project Definition of Done (DoD) criteria are met:

* **Coverage:** All listed user stories from Sprint 1 and 2 are **covered by executed test cases**.  
* **Defect Closure:** **All Severity 1 and 2 defects are fixed** and retested successfully. Remaining Severity 3 and 4 defects are reviewed and accepted by the Product Owner.  
* **Test Pass Rate:** The overall **test pass rate is 95% or higher**.  
* **Quality:** The document and testing artifacts satisfy the **project's DoD criteria**.  
* **Document:** A **Test Summary Report** is created and approved.


## **5\. Test Deliverable:**

The following artifacts will be produced and maintained throughout the testing lifecycle:

1. **Test Plan:** This document (the TDD) or a separate formal Test Plan defining the strategy, scope, schedule, and resources.  
2. **Test Cases and Test Scripts:** Detailed, step-by-step instructions derived from the user stories, tracked in a Test Management Tool.  
3. **Test Data:** A structured repository of all data used to execute the test cases.  
4. **Test Summary Reports:** A final report summarizing the overall quality, coverage, pass/fail rates.  
5. **Defect Reports:** Detailed records of all identified defects, including steps to reproduce, severity, priority, and status, tracked in the Defect Tracking Tool (e.g.,GitHub Issues).

## **6\. Test Environment:**
### 6.1 Environment Setup and Configuration:

| Hardware              | Software                                 |      Network                                                                                             | Tools                                     |
| --------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Standard PC/Laptop          | Windows      | Secure HTTPS for deployment, localhost for development `http://localhost:5173/engineer/auth` | GitHub-Centralized version control and collaboration platform for storing, managing, and tracking code, documentation, and issues. Used for code reviews, pull requests, and maintaining project branches (main, dev, feature). |


### 6.2 Access and Permissions:

QA team must be granted the following access and permissions to adequately test all user story flows:

* **Application Access (Engineer Role):** Valid credentials for multiple **Engineer User Accounts** are required to:  
    * Test the **Auth module** for valid login, invalid credentials scenarios.  
    * Test the **Job Module** features (search, view, etc.) under the expected role permissions.  
    * Test the **My Account Module** for profile viewing and updating permissions.

## **7\. Test Cases and Scenarios**

This section outlines the approach to designing, structuring, and linking the specific test cases and scenarios to ensure complete coverage of the features in Sprint 1 and 2\.

### 7.1 Description or References to Specific Test Cases and Scenarios:

Test scenarios will cover **Positive Flows** (e.g., successful login), **Negative Flows** (e.g., invalid input), **Boundary/Edge Cases** for validation, and comprehensive checks of **CRUD** (Create, Read, Update, Delete) operations where applicable (e.g., Job and My Account modules).

### 7.2 Test Case Design Techniques Used:

Test cases will be created using:

* **Boundary Value Analysis (BVA):** Applied to fields with defined limits (e.g., testing character counts at the minimum, maximum, and near-boundary values).  
* **Equivalence Partitioning:** Used to group inputs into representative classes for testing (e.g., testing with a single valid email instead of all possible valid emails).  
* **State Transition Testing:** Used for the **Auth module** to verify correct transitions between user states (Logged In, Logged Out).

### 7.3 Mapping to Requirements (Traceability):

| Context | Modules | Test Scenarios |
|--------------------|-----------------|-------------------------|
| Input Validation & UI Refinements | All Forms | Validation rules, responsive checks, accessibility |
| Auth Module | Sign Up, Login, Profile Setup, passwords | Auth flow, validation, UI states |
| Job Module | Dashboard, Search, Job Details | Data rendering, tab switching, popups |
| My Account Module | Profile, Settings, Earnings | Modal interactions, Sidebar nav, withdrawal logic |

### 7.4  Sample Test Cases Format:

The standard format for all test cases will include the following fields to ensure clarity and reproducibility:

| Field | Description |
|-------|-------------|
| TC ID | Unique Identifier (e.g., TC-AUTH-001) |
| User Story ID | Reference (e.g., US-Auth) |
| Title | Short description |
| Pre-conditions | Required state before test |
| Test Steps | Step-by-step actions |
| Test Data | From mock JSON or manual input |
| Expected Result | Outcome if successful |
| Actual Result | What happened |
| Priority | High / Medium / Low |
| Status | Pass / Fail / Blocked |

### 7.5  Decision Table:

This decision table outlines key validation and UI behavior scenarios across modules (Auth, Job, My Account).

| **Condition**                                                             | **Email Valid** | **Password Valid** | **Required Fields Filled** | **Theme Toggle** | **Routing Valid** | **Dummy Data Loaded** | **Expected Outcome**                                  |
|---------------------------------------------------------------------------|------------------|---------------------|-----------------------------|-------------------|--------------------|------------------------|--------------------------------------------------------|
| All fields valid and filled                                               | Yes              | Yes                 | Yes                         | Yes               | Yes                | Yes                    | Form submits successfully                              |
| Email invalid                                                             | No               | Yes                 | Yes                         | Yes               | Yes                | Yes                    | Show email format error                                |
| Password too short                                                        | Yes              | No                  | Yes                         | Yes               | Yes                | Yes                    | Show password length error                             |
| Required fields missing                                                   | Yes              | Yes                 | No                          | Yes               | Yes                | Yes                    | Show required field error                              |
| Theme toggle clicked                                                      | N/A               | N/A                   | N/A                         | Yes               | N/A                | N/A                    | Theme switches correctly                               |
| Navigation link clicked                                                   |N/A               | N/A                   | N/A                           |N/A                 | Yes                | N/A                     | Correct page loads                                     |
| Dummy data file missing                                                   | N/A             | N/A                   | N/A                           | N/A                 | N/A                  | No                     | Component fails to load or shows fallback              |
| Dummy data loaded but not marked with TODO                                |N/A                | N/A                    | N/A                           |N/A                 | N/A                 | Yes                    | QA flags missing TODO comment                          |
| Modal popup triggered (e.g., Update Status, Report Issue)                |N/A                | N/A                    | N/A                           | N/A                 | Yes                | Yes                    | Modal opens with correct content                       |                             |
| Accessibility tested (ARIA, keyboard nav)                                 | N/A                | N/A                   | N/A                            | N/A                | N/A                | N/A                   | All elements accessible                                |




## **8\. Test Data**

Since there's no backend, all testing will be done manually using example inputs to simulate different user scenarios.

### 8.1 Data Requirements & Sources

| **Data Set Name**       | **Description**                                                              | **Usage**                                             |
|--------------------------|------------------------------------------------------------------------------|--------------------------------------------------------|
| **Empty Profile**        | User with no data filled in (blank profile, no education or experience).     | Test blank form states and "Add" actions.              |
| **Full Profile**         | User with all fields filled (long names, multiple jobs, high earnings).      | Test layout with lots of data (overflow, scrolling).   |
| **Job Status Examples**  | Jobs in different stages: Applied, In Progress, Not Applied.                 | Test job filters and job details screen.               |
| **Input Test Values**    | Sample text inputs: long strings, special characters, etc.                   | Test form validation and error handling.               |

