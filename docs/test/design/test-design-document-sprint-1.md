# Test Design Document for Sprint 1

## 1. Introduction and Scope

### 1.1 Purpose of the Document
The Purpose of this **Test Design Document (TDD)** is to define the **strategy**, **objectives**, **scope**, environment, resources, and deliverables for the testing activities covering the **Engineer Web UI Implementation Part features** developed during **Sprint 1**. This document provides test viewpoints from a user story perspective to ensure comprehensive coverage and traceability.

### 1.2 Background and Context of the Project
The focuses on implementing the **authentication module** and establishing **input validation standards** for the Engineer web application. This forms the foundation for user access and data integrity throughout the application. The testing effort is essential to validate the functional correctness and UI/UX quality of these critical initial modules.

### 1.3 Objectives of Testing
The primary objectives of the testing phase are to:
* **Validate Functionality:** Ensure that all features described in the Sprint 1 user stories work correctly and meet all acceptance criteria.
* **Verify UI/UX:** Confirm that the user interface is **intuitive**, **consistent**, **responsive**, and adheres to the required design specifications.
* **Ensure Quality:** Identify and report defects, risks, and areas of non-compliance early in the development lifecycle.
* **Confirm Traceability:** Establish clear linkage between requirements (user stories), test cases, and defects.
* **Risk Mitigation:** Prioritize testing on high-risk areas including **authentication security** and **input validation** that could impact system integrity.


### 1.4 Scope (Features/Modules to be Tested)
The scope of this TDD covers comprehensive testing of the following user stories from Sprint 1:

* **Engineer Web UI Implementation: Auth module**
    * User Login, User Logout, Forgot Password, Reset Password
    * Profile Setup, Background Verification, Set Password
    * Verify Phone Number functionality
* **Web — Input Validation and UI Refinements**
    * Field-level validation across all authentication forms
    * Error messaging consistency
    * UI responsiveness across devices


### 1.5 Out of Scope (Features/Modules Not to be Tested)
The following are explicitly **out of scope** for this testing effort:

* **Performance/Load Testing:** Assessing system responsiveness under heavy load.
* **Automated Regression Testing:** While test scripts may be developed, full automation framework setup and execution of the entire regression suite.
* **Security Penetration Testing:** Deep-dive ethical hacking and vulnerability scanning beyond basic functional security checks in the Auth module.
* **Backend/API Logic:** Testing is focused solely on the **Web UI implementation** and user experience; direct testing of backend APIs or database logic is excluded.

## 2. Test Items

### 2.1 Scope (Items to be Tested)

| Module/Area | Sub-Components/Functionality |
|-------------|----------------------------|
| **Authentication (Auth) Engineer Web UI** | User Login, User Logout, Forgot Password, Reset Password, Profile Setup, Background Verification, Set Password, Verify Phone Number |
| **System Refinements** | Field-level validation across all auth forms, Error messaging consistency, UI responsiveness, Theme toggling |


## 3. Test Approach and Strategy

### 3.1 Overall Testing Strategy
| Strategy | Description | Focus Area |
|----------|-------------|------------|
| **Manual Testing** | Execution of all detailed Test Cases and Scenarios for all features, with an emphasis on Functional, UI/UX, and Integration Testing. | Comprehensive functional coverage |
| **Exploratory Testing** | Time-boxed, unscripted testing focusing on edge cases, error paths, and verifying the overall feel of the authentication flow. | Identifying unexpected defects |
| **Risk-Based Testing** | Prioritization of high-risk areas including password security, email verification, and input validation that could compromise system integrity. | High-impact system areas |

### 3.2 Types and Levels of Testing
Testing will progress through the following levels:
1.  **Unit Testing:** Testing individual components, primarily done by developers.
2.  **Application Test:** Individual components of the Auth module before integration.
3.  **Integration Testing:** Testing how different authentication screens interact (e.g., login to profile setup flow).
4.  **System Testing:** Testing the end-to-end functionality of the entire authentication system against the user stories.
5.  **Acceptance Testing (UAT):** Formal testing by the Product Owner/stakeholders to ensure the system meets the overall acceptance criteria and project's Definition of Done (DoD).

### 3.3 Type of Testing
* **Functional Testing:** Verifies that the system performs all specified functions. All authentication features: successful login, password validation, correct profile setup flow.
* **Regression Testing:** Re-tests critical path functions after every major deployment to ensure no existing functionality is broken. Core authentication flows after every deployment.
* **Usability Testing:** Focuses on ease of use, navigation, and overall user experience of the authentication flow.
* **Compatibility Testing:** Ensures correct functionality across required browsers (Chrome, Firefox, Edge) and device views (desktop, mobile).
* **Security Testing:** Basic checks focusing on access control, input sanitization, and session management in the Auth module.

### 3.4 Testing Technique
* **Black-Box Testing:** Primary technique used for all authentication features. Verifies that user actions produce the expected output without knowledge of internal code.
* **Boundary Value Analysis (BVA):** Applied to authentication fields (min/max password length, email character limits).
* **Equivalence Partitioning:** Used for validating correct/incorrect formats in authentication fields.
* **State Transition Testing:** Crucial for the Auth Module to verify correct state changes (Logged Out -> Verification -> Profile Setup -> Logged In).
* **Error Guessing:** Applied to proactively check for common issues like unexpected characters in required fields and handling of null inputs.


## 4. Test Criteria

### Test Entry Criteria (When to Start Testing)
Testing shall commence when all the following criteria are met:
* All user stories for Sprint 1 are developed and **code-complete**.
* The test environment is stable and confirmed ready for testing.
* The Test Design Document and all necessary test cases are reviewed and finalized.
* All identified test data is provisioned and accessible.
* A successful **Smoke Test** of the core authentication functionality is executed.

### Test Exit Criteria (When to Stop Testing)
Testing is complete when the following project Definition of Done (DoD) criteria are met:
* **Coverage:** All listed user stories from Sprint 1 are covered by executed test cases.
* **Defect Closure:** All **Severity 1 and 2 defects** are fixed and retested successfully. Remaining Severity 3 and 4 defects are reviewed and accepted by the Product Owner.
* **Test Pass Rate:** The overall test pass rate is **95% or higher**.
* **Quality:** The document and testing artifacts satisfy the project's DoD criteria.
* **Documentation:** A Test Summary Report is created and approved.


## 5. Test Deliverables

The following artifacts will be produced and maintained throughout the testing lifecycle:

* **Test Plan:** This document defining the strategy, scope, schedule, and resources.
* **Test Cases and Test Scripts:** Detailed, step-by-step instructions derived from the user stories, tracked in a Test Management Tool.
* **Test Data:** A structured repository of all data used to execute the test cases.
* **Test Summary Reports:** A final report summarizing the overall quality, coverage, pass/fail rates.
* **Defect Reports:** Detailed records of all identified defects, including steps to reproduce, severity, priority, and status.

## 6. Test Environment

### 6.1 Environment Setup and Configuration
The following table outlines the necessary hardware, software, network, and tools required for executing the Sprint 1 testing activities:

| Hardware | Software | Network | Tools |
| :--- | :--- | :--- | :--- |
| Standard PC/Laptop , Mobile Devices (iOS and Android)| Windows macOS| Secure HTTPS for deployment, localhost for development `http://localhost:5173/engineer/auth/login`|  GitHub - Version control and issue tracking , Browser - Chromium, Edge and Firefox |

### 6.2 Access and Permissions
The QA team must be granted the following access and permissions:

* **Application Access:** Valid credentials for multiple Engineer User Accounts to test various authentication scenarios.
* **Environment Access:** Read-only access to development environment for debugging purposes.


## 7. Test Cases and Test Scenarios:

## User Story 1: Engineer Web UI Implementation: Auth module  

[LINK - User story 1](https://github.com/praxiodev/field-techy/issues/7)

### Test Scenarios  
**Scenario 1**: Verify that a user can successfully log in using a valid email and password, and is redirected to the appropriate next step (e.g., profile setup or dashboard).  
- **Preconditions**: User is on the login page (`/engineer/auth/login`).  
- **Steps**:  
  1. Enter a valid email (e.g., `engineer@company.com`, 10–100 characters).  
  2. Enter a valid password meeting complexity rules (8–20 characters, with uppercase, lowercase, number, and special character).  
  3. Click the "Login" button.  
- **Expected Result**: System proceeds to OTP verification or next step without validation errors.  
- **Coverage**: Validates successful authentication flow.

**Scenario 2**: Verify that login fails with invalid email format and displays correct error message.  
- **Preconditions**: User is on the login page (`/engineer/auth/login`).  
- **Steps**:  
  1. Enter an invalid email (e.g., `engineer@company` – missing domain).  
  2. Enter a valid password.  
  3. Click "Login".  
- **Expected Result**: Error message appears: “Please enter a valid email address”; form submission is blocked.  
- **Coverage**: Validates email format enforcement.

**Scenario 3**: Verify that OTP verification succeeds with a valid 4-digit numeric code and fails with invalid inputs (non-numeric, wrong length).  
- **Preconditions**: User has completed login and is on the OTP screen.  
- **Steps**:  
  1. Enter valid OTP `1234` → click “Verify”.  
  2. Repeat with `abcd` (non-numeric) and `123` (too short).  
- **Expected Result**: Valid OTP proceeds; invalid inputs show “OTP must contain only digits” or “OTP must be 4 characters” and block submission.  
- **Coverage**: Validates OTP handling.

**Scenario 4**: Verify that password setup enforces complexity, length (8–20), and confirmation match.  
- **Preconditions**: User is on the Set Password or Reset Password screen.  
- **Steps**:  
  1. Enter `SecureP@ss123` in both New and Confirm fields → submit.  
  2. Repeat with mismatched passwords or 7-character password (`P@ss123`).  
- **Expected Result**: Valid input submits; invalid inputs show specific errors (e.g., “Password must be at least 8 characters”, “Password must match...”).  
- **Coverage**: Validates password policy compliance.

**Scenario 5**: Verify that logout functionality ends the session and redirects to login.  
- **Preconditions**: User is authenticated and on any protected screen.  
- **Steps**:  
  1. Open account menu → click “Logout”.  
- **Expected Result**: Session cleared; user redirected to `/engineer/auth/login`.  
- **Coverage**: Validates state transition and session management.

**Scenario 6**: Verify mobile number validation for country-specific formats (e.g., UK = 10 digits after +44).  
- **Preconditions**: User is on login or signup page with phone option.  
- **Steps**:  
  1. Select country code `+44` (UK).  
  2. Enter `7700900123` → valid.  
  3. Enter `770090012` (9 digits) → invalid.  
- **Expected Result**: Valid number accepted; invalid shows “Mobile number must be 10 digits for UK”.  
- **Coverage**: Validates international phone number rules.

## Decision Table with Detailed Explanations:

### Table Context

**What This Table Shows**: This decision table maps different testing scenarios to expected system behaviors. Each column represents a specific test situation you might encounter.

### Login Authentication

| Test Case Description             | Email ID | Password | OTP | Mobile Number | Country Code | Expected Result |
|----------------------------------|----------|----------|-----|---------------|--------------|----------------|
| All fields valid                  | Yes (10–100 chars) | Yes (8–20 chars, valid format) | Yes (1234) | Yes (10 digits) | Yes | Form submits successfully |
| Email invalid format              | No | Yes | Yes | Yes | Yes | Shows "Please enter a valid email address" error |
| Email below minimum length        | No | Yes | Yes | Yes | Yes | Shows "Email must be at least 10 characters" error |
| Email above maximum length        | No | Yes | Yes | Yes | Yes | Shows "Email cannot exceed 100 characters" error |
| Password invalid format           | Yes | No | Yes | Yes | Yes | Shows "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" error |
| Password below minimum length     | Yes | No | Yes | Yes | Yes | Shows "Password must be at least 8 characters" error |
| Password above maximum length     | Yes | No | Yes | Yes | Yes | Shows "Password cannot exceed 20 characters" error |
| OTP invalid format                | Yes | Yes | No (abcd) | Yes | Yes | Shows "OTP must contain only digits" error |
| OTP wrong length                  | Yes | Yes | No (123) | Yes | Yes | Shows "OTP must be 4 characters" error |
| Mobile number invalid (UK)        | Yes | Yes | Yes | No (9 digits) | Yes | Shows "Mobile number must be 10 digits for UK" error |
| Mobile number invalid (India)     | Yes | Yes | Yes | No (9 digits) | Yes | Shows "Mobile number must be 10 digits for India" error |




## User Story 2: Web — Input Validation and UI Refinements for Sprints 1 and 2  
[LINK - User story 2](https://github.com/praxiodev/field-techy/issues/20)

## Test Scenarios  

**Scenario 1**: Validate Signin with Email Functionality
- **Preconditions:** User is on the Signin page.  
- **Steps:**
1. Enter a valid Email ID (e.g., `"user@example.com"`).  
2. Enter a valid Password meeting complexity requirements (e.g., `"Passw0rd!"`).  
3. Optionally, check the "Remember Me" checkbox.  
4. Click the Signin button.  

- **Expected Results:** User successfully signs in. No error messages appear.  
- **Coverage:** Validates successful signin with correct email and password.



**Scenario 2**: Validate Signin with Email with Invalid Inputs
- **Preconditions:** User is on the Signin page.  
- **Steps:**
1. Enter an invalid Email ID (e.g., `"user@", "@example.com", "a".repeat(101) + "@example.com"`).  
2. Enter an invalid Password (e.g., `"password", "Passw0rd", "12345678", "Passw0rd!@#$%^&*()_+"`).  
3. Attempt to sign in.  

- **Expected Results:** Error messages appear for invalid email format/length and password complexity. Signin fails.  
- **Coverage:** Tests validation rules for Email ID (format, length) and Password (complexity, length).


**Scenario 3**: Validate OTP Verification
- **Preconditions:** User has initiated a signin process requiring OTP (e.g., `after entering mobile number or email`).  
- **Steps:**
1. Enter a valid 4-digit OTP code (e.g., `"1234"`) received via SMS/email.  
2. Submit the OTP.  

- **Expected Results:** OTP is verified successfully. User proceeds to the next step (e.g., `dashboard`).  
- **Coverage:** Validates successful OTP verification with correct 4-digit input.



**Scenario 4**: Validate Signin with Mobile Number Functionality
- **Preconditions:** User is on the Signin page and selects the mobile number option.  
- **Steps:**
1. Select a Country Code (e.g., `India +91, UK +44`).  
2. Enter a valid Mobile Number (e.g., `"9876543210" for India, "7700900000" for UK`).  
3. Click the Signin button.  

- **Expected Results:** System sends an OTP to the mobile number. User proceeds to OTP verification screen.  
- **Coverage:** Validates successful initiation of mobile-based signin with correct country code and number format.



**Scenario 5**: Validate Signup with Email Functionality
- **Preconditions:** User is on the Signup page and selects the email option.  
- **Steps:**
1. Enter a valid Email ID.  
2. Check the Terms and Conditions checkbox.  
3. Submit the form.  

- **Expected Results:** System sends a verification code to the email. User proceeds to verify the email.  
- **Coverage:** Validates successful initiation of email-based signup with required fields filled.


**Scenario 6**: Verify that First Name field rejects special characters and numbers, and enforces 2–50 character length.  
- **Preconditions**: User is on the Profile Setup → Personal Information page.  
- **Steps**:  
  1. Enter `John@Doe` → observe error: “Special characters and numbers not allowed”.  
  2. Enter `J` → observe error: “First name must be at least 2 characters”.  
  3. Enter `Johnathan Michael Smith` (50 chars) → accepted.  
- **Expected Result**: Only alphabetic inputs within length bounds are accepted; others show precise validation messages.  
- **Coverage**: Validates name field rules per acceptance criteria.

**Scenario 7**: Verify that Address field accepts only allowed characters (`/ , . - #`), rejects others, and enforces 6–50 character length.  
- **Preconditions**: User is on Profile Setup → Address section.  
- **Steps**:  
  1. Enter `123 Main St!@#` → error: disallowed characters.  
  2. Enter `123` → error: “Address must be at least 6 characters”.  
  3. Enter `123 Main Street, Apt 5, Building B` → accepted.  
- **Expected Result**: Input validation matches specification; errors are clear and actionable.  
- **Coverage**: Ensures address formatting compliance.

**Scenario 8**: Verify that postal code validation is country-aware: India = 6 numeric digits; UK = 6–8 alphanumeric with one space.  
- **Preconditions**: User is on Profile Setup with Country selected.  
- **Steps**:  
  1. Select India → enter `11A001` → error: “Postal code must be 6 numerical characters for India”.  
  2. Select UK → enter `SW1A1AA` (no space) → error: “...with 1 space allowed for UK”.  
  3. Enter valid `SW1A 1AA` → accepted.  
- **Expected Result**: Dynamic validation based on selected country.  
- **Coverage**: Validates localized postal code logic.

**Scenario 9**: Verify that profile image upload enforces format (`JPG/JPEG/PNG`) and size (`50KB–350KB`).  
- **Preconditions**: User is on Profile Setup with image upload field.  
- **Steps**:  
  1. Upload `profile.pdf` → error: “Only valid JPEG, JPG and PNG format are allowed”.  
  2. Upload `small.jpg` (45KB) → error: “Image must be at least 50KB”.  
  3. Upload `large.jpg` (355KB) → error: “Image cannot exceed 350KB”.  
  4. Upload `valid.jpg` (200KB) → accepted.  
- **Expected Result**: Strict enforcement of file constraints with user-friendly feedback.  
- **Coverage**: Validates media upload rules.

**Scenario 10**: Verify that Experience section fields (Designation, Employer) enforce format and length rules.  
- **Preconditions**: User is on Profile Setup → Experience section.  
- **Steps**:  
  1. Enter `Senior@Engineer` in Designation → error: “Only letters and spaces allowed”.
  2. Enter `ABC` in Employer → error: “Company/Employer must be at least 4 characters”.
  3. Enter `Tech Solutions Ltd.` → accepted.
- **Expected Result**: Inputs comply with business rules; invalid entries are blocked.
- **Coverage**: Validates professional information validation.

**Scenario 11**: Verify that document uploads (`Resume, Government ID, Certificate`) accept only PDFs within 50KB–350KB.
- **Preconditions**: User is on Experience or Background Verification sections.
- **Steps**:  
  1. Upload `resume.jpg` → error: “Only valid PDF format are allowed”.
  2. Upload `id_small.pdf` (45KB) → error: “File must be at least 50KB”.
  3. Upload `cert_large.pdf` (355KB) → error: “File cannot exceed 350KB”.
  4. Upload valid PDFs → accepted.
- **Expected Result**: Consistent validation across all document types.
- **Coverage**: Ensures document integrity and compliance.

## Decision Table with Detailed Explanations:

### Table Context

**What This Table Shows**: This decision table maps different testing scenarios to expected system behaviors. Each column represents a specific test situation you might encounter.


### Profile Setup – Basic Details

| Test Case Description | Profile Image Valid | First Name Valid | Last Name Valid | Mobile Number Valid | Email Valid | Country Selected| Address Valid | Postal Code Valid | Skills Selected | Service Categories Selected | Portfolio Link Valid | Amount Valid | Expected Result |
|------------------------|----------------------|-------------------|------------------|----------------------|---------------|--------------------|----------------|--------------------|------------------|------------------------------|----------------------|---------------|-----------------|
| All fields valid | Yes (200KB) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Form submits successfully |
| Profile image invalid format | No (PDF) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Only valid (`JPEG, JPG and PNG`) format are allowed" error |
| Profile image below min size | No (45KB) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Image must be at least 50KB" error |
| Profile image above max size | No (355KB) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Image cannot exceed 350KB" error |
| First name invalid format | Yes | No (John@Doe) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Special characters and numbers not allowed" error |
| First name below min length | Yes | No (J) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "First name must be at least 2 characters" error |
| First name above max length | Yes | No (>50 chars) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "First name cannot exceed 50 characters" error |
| Last name invalid format | Yes | Yes | No (Smith@Doe) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Special characters and numbers not allowed" error |
| Last name below min length | Yes | Yes | No (S) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Last name must be at least 2 characters" error |
| Mobile number empty | Yes | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Mobile number is required" error |
| Mobile number invalid format | Yes | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Mobile number must be 10 digits" error |
| Mobile number valid but not verified | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Mobile number must be verified" error |
| Email empty | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Email is required" error |
| Email invalid format | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Please enter a valid email address" error |
| Email valid but not verified | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Email must be verified" error |
| Country not selected | Yes | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes | Shows "Country must be selected" error |
| Address empty | Yes | Yes | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes | Shows "Address is required" error |
| Address too short | Yes | Yes | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes | Shows "Address must be at least 6 characters" error |
| Address contains invalid characters | Yes | Yes | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes | Shows "Only letters, spaces, numbers and special characters `/ , . - #` are allowed" error |
| Postal code invalid (India) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No (11A001) | Yes | Yes | Yes | Yes | Shows "Postal code must be 6 numerical characters for India" error |
| Postal code invalid (UK) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No (SW1A1AA) | Yes | Yes | Yes | Yes | Shows "Postal code must be 6–8 alphanumeric characters with 1 space allowed for UK" error |
| Skills not selected | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes | Shows "Skills must be selected" error |
| Service categories not selected | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No | Yes | Yes | Shows "Service categories must be selected" error |
| Portfolio link invalid format | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No (not-a-url) | Yes | Shows "Portfolio link must be a valid URL" error |
| Portfolio link below min length | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No (<10 chars) | Yes | Shows "Portfolio link must be at least 10 characters" error |
| Portfolio link above max length | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No (>200 chars) | Yes | Shows "Portfolio link cannot exceed 200 characters" error |
| Amount below minimum | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No (0) | Shows "Amount must be at least 1" error |
| Amount above maximum | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No (>99999) | Shows "Amount must not exceed 5 digit number" error |
| Multiple fields invalid | No (355KB) | No (J) | No (S) | No | No | No | No | No | No | No | No | No | Shows validation errors for all invalid fields |


### Profile Setup – Experience Details

| Test Case Description                | Current Designation | Company/Employer | Experience | Resume/CV | Expected Result |
|--------------------------------------|----------------------|------------------|------------|-----------|------------------|
| All fields valid                     | Yes (Senior Engineer)| Yes (Tech Co.)   | Yes        | Yes (200KB PDF) | Form submits successfully |
| Current designation invalid format   | No (Engineer@)       | Yes              | Yes        | Yes       | Shows "Only letters and spaces allowed" error |
| Current designation below min length| No (S)               | Yes              | Yes        | Yes       | Shows "Current designation must be at least 2 characters" error |
| Current designation above max length| No (>50 chars)       | Yes              | Yes        | Yes       | Shows "Current designation cannot exceed 50 characters" error |
| Company/employer invalid format      | Yes                  | No (Tech@Co.)    | Yes        | Yes       | Shows "Only letters, spaces, numbers and (`& - / .`) allowed" error |
| Company/employer below min length    | Yes                  | No (ABC)         | Yes        | Yes       | Shows "Company/Employer must be at least 4 characters" error |
| Resume/CV invalid format             | Yes                  | Yes              | Yes        | No (JPG)  | Shows "Only valid PDF format are allowed" error |
| Resume/CV below min size             | Yes                  | Yes              | Yes        | No (45KB) | Shows "File must be at least 50KB" error |
| Resume/CV above max size             | Yes                  | Yes              | Yes        | No (355KB)| Shows "File cannot exceed 350KB" error |

### Profile Setup – Background Verification

| Test Case Description            | Government ID | Certificate | Expected Result |
|----------------------------------|----------------|--------------|------------------|
| All fields valid                 | Yes (200KB PDF)| Yes (200KB PDF)| Form submits successfully |
| Government ID invalid format     | No (JPG)       | Yes          | Shows "Only valid PDF format are allowed" error |
| Government ID below min size     | No (45KB)      | Yes          | Shows "File must be at least 50KB" error |
| Government ID above max size     | No (355KB)     | Yes          | Shows "File cannot exceed 350KB" error |
| Certificate invalid format       | Yes            | No (JPG)     | Shows "Only valid PDF format are allowed" error |
| Certificate below min size       | Yes            | No (45KB)    | Shows "File must be at least 50KB" error |
| Certificate above max size       | Yes            | No (355KB)   | Shows "File cannot exceed 350KB" error |

## 8. Test Data

### 8.1 Data Requirements & Sources

which focuses on the Engineer Web UI Implementation: Auth module and Web — Input Validation and UI Refinements, test data must simulate realistic 
user scenarios to validate form submissions, input validation rules, and UI/UX flows. Since there is no backend integration in this phase, all test data will be manually created and 
managed as mock inputs.

The test data requirements are derived from the following sources:

- **User Stories**: Specifically, "Engineer Web UI Implementation: Auth module" and "Web — Input Validation and UI Refinements for Sprints 1 and 2".

- **Validation Rules**: Extracted from Input Field Validation.md and My-Profile-Sidebar-Input-Validation.md, which define field-specific validation rules, character limits, and required formats.

### All test data must cover:

- Positive Scenarios: Valid inputs that should successfully submit forms.
- Negative Scenarios: Invalid inputs that should trigger appropriate error messages.
- Boundary Conditions: Inputs at minimum and maximum limits defined in validation rules.
- Edge Cases: Special characters, empty fields, null values, and unexpected formats


| **Test Category**       | **Description**                                               | **Purpose**                                  |
|-------------------------|---------------------------------------------------------------|-----------------------------------------------|
| **Valid Authentication**| User with correct email/phone and password                    | Test successful login and profile setup       |
| **Invalid Email Format**| Email without `@` or missing domain                          | Test email validation                         |
| **Password Variations** | Passwords with different complexity levels                    | Test password validation rules                |
| **Mobile Number Formats**| Valid UK (10 digits) and India (10 digits) numbers           | Test mobile number validation                 |
| **Document Uploads**    | PDF files of various sizes (e.g., 50KB, 200KB, 350KB)         | Test document upload functionality            |
| **Name Field Examples** | Names with special characters, and minimum/maximum lengths    | Test name field validation                    |


### 8.2 Validation Test Data

| **Field**            | **Valid Data**                  | **Invalid Data / Edge Cases** |
|----------------------|--------------------------------|-------------------------------|
| **Email**            |` engineer@company.com  `          | engineer@company, `engineer@company.co` (min), `engineer+verylongemailaddress@company.com `(max) |
| **Password**         | SecureP@ss123                  | password, Secur3! (min), SecureP@ss1234567890 (max) |
| **Mobile Number (UK)** | +447700900123                 | 44770090012, +4477009001234 (invalid length) |
| **Mobile Number (India)** | +919876543210               | 919876543210, +91987654321 (too short) |
| **OTP**              | 1234                            | abcdef, 123 (too short), 12345 (too long) |
| **Name**             | John                            | John@Doe, J (too short), Johnathan Michael Smith (max length) |
| **Postal Code (India)** | 110001                        | ABC123, 11000 (too short), 1100012 (too long) |
| **Postal Code (UK)** | W1K 3JP                         | ABC123, W1K (too short), W1K3JPA (too long) |
| **Documents**        | 200KB PDF file                  | 50KB PDF (min), 350KB PDF (max) |
| **Profile Image**    | 200KB jpg/jpeg/png file          | 50KB jpg (min), 350KB jpg (max) |
