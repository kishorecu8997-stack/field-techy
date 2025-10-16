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
| :--- | :--- |
| **Authentication (Auth) Engineer Web UI** | User Login, User Logout, Forgot Password, Reset Password, Profile Setup, Background Verification, Set Password, Verify Phone Number |
| **System Refinements** | Field-level validation across all auth forms, Error messaging consistency, UI responsiveness, Theme toggling |


## 3. Test Approach and Strategy

### 3.1 Overall Testing Strategy

| Strategy | Description | Focus Area |
| :--- | :--- | :--- |
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
| Standard PC/Laptop <br> Mobile Devices (iOS and Android)| Windows macOS| Secure HTTPS for deployment, localhost for development `http://localhost:5173/engineer/auth`|  GitHub - Version control and issue tracking <br> Browser - Chromium, Edge and Firefox |

### 6.2 Access and Permissions
The QA team must be granted the following access and permissions:

* **Application Access:** Valid credentials for multiple Engineer User Accounts to test various authentication scenarios.
* **Environment Access:** Read-only access to development environment for debugging purposes.

## 7. Test Cases and Test Scenarios:

These test cases provide the detailed, step-by-step instructions for execution and are the single source of truth for test validation.

### 7.1 Web Auth Module Flow Test Cases

### 7.1.1 User Login Functionality

7.1.1 Test Case ID: TC_01

- **Test Scenario**: Valid email format is accepted in login form  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - Email: `engineer@company.com`  
  - Password: SecureP@ss123  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1    | Navigate to login page at `http://localhost:5173/engineer/auth/login` | Login form displays with email and password fields |
| 2    | Enter valid email `engineer@company.com` in email field | Email field accepts input without validation errors |
| 3    | Enter valid password `Sec@1234` in password field | Password field accepts input without validation errors |
| 4    | Click "Login" button | System proceeds to next step (profile setup or dashboard) |

7.1.2 Test Case ID: TC_02
- **Test Scenario**: Invalid email format triggers appropriate error message  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - Email: engineer@company (missing domain)  
  - Password: SecureP@ss123  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1    | Navigate to login page at `http://localhost:5173/engineer/auth/login` | Login form displays with email and password fields |
| 2    | Enter invalid email `engineer@company` in email field | Error message appears under email field: "Please enter a valid email address" |
| 3    | Enter valid password `Sec@1234` in password field | Password field accepts input without validation errors |
| 4    | Click "Login" button | Form submission is blocked, page does not navigate away |

7.1.3 Test Case ID: TC_03
- **Test Scenario**: Password at minimum length (8 characters) is accepted  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - Email: `engineer@company.com`
  - Password: Secur3! (7 characters - should fail)  
  - Password: Secure3! (8 characters - should pass)  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1    | Navigate to login page at `http://localhost:5173/engineer/auth/login` | Login form displays with email and password fields |
| 2    | Enter valid email `engineer@company.com` in email field | Email field accepts input without validation errors |
| 3    | Enter password `Secur3!` (7 characters) in password field | Error message appears: "Password must be at least 8 characters" |
| 4    | Clear password field and enter `Secure3!` (8 characters) | Password field accepts input without validation errors |
| 5    | Click "Login" button | System proceeds to next step if other fields are valid |

7.1.4 Test Case ID: TC_04
- **Test Scenario**: UK mobile number format (10 digits) is accepted for login  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - Country code: +44 (UK)  
  - Mobile number: 7700900123 (10 digits after country code = 10 total)  
  - Password: SecureP@ss123  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1    | Navigate to login page at `http://localhost:5173/engineer/auth/login` | Login form displays with phone number option |
| 2    | Select country code `+44` from dropdown | Country code selected successfully |
| 3    | Enter mobile number `7700900123` in phone field | Phone field accepts input without validation errors |
| 4    | Enter valid password `SecureP@ss123` in password field | Password field accepts input without validation errors |
| 5    | Click "Login" button | System proceeds to next step (profile setup or dashboard) |

7.1.5 Test Case ID: TC_05
- **Test Scenario**: OTP verification with valid 4-digit code succeeds  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - OTP: 1234 (valid 4-digit code)  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1    | Complete login process to reach OTP verification screen | OTP verification screen displays with 4-digit input field |
| 2    | Enter OTP `1234` in the OTP field | OTP field accepts input without validation errors |
| 3    | Click "Verify" button | System accepts OTP and proceeds to next step |


#### Test Scenario: OTP verification with invalid format fails  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - OTP: abcd (non-numeric characters)  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1    | Complete login process to reach OTP verification screen | OTP verification screen displays with 4-digit input field |
| 2    | Enter OTP `abcd` in the OTP field | Error message appears: "OTP must contain only digits" |
| 3    | Click "Verify" button | Form submission is blocked |
| 4    | Check system state | User remains unauthenticated, no session token is set |

## 7.2 Input Validation and UI Flow Test Cases

### 7.2.1 Profile Setup - Personal Information Validation

7.2.1 Test Case ID: TC_01
- **Test Scenario**: Full Name field accepts alphabets only with spaces (max 50 characters)

- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - Full Name: John Smith (valid)  
  - Full Name: John@Doe (invalid - contains special character)  
  - Full Name: J (invalid - below minimum)  
  - Full Name: Johnathan Michael Smith (valid - maximum length)  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Enter `John Smith` in Full Name field | Field accepts input without validation errors |
| 3 | Enter `John@Doe` in Full Name field | Error message appears: "Only alphabets and spaces allowed" |
| 4 | Enter `J` in Full Name field | Error message appears: "Name must be at least 2 characters" |
| 5 | Enter `Johnathan Michael Smith` in Full Name field | Field accepts input without validation errors |
| 6 | Click "Save" button | Form submits successfully if all fields are valid |


7.2.2 Test Case ID: TC_02
- **Test Scenario**: Address field accepts letters, spaces, numbers and special characters (`/` ,`,`, `.` ,`-`, `#`) with 20–50 character limit

- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - Address: 123 Main St, Suite #5 (valid)  
  - Address: 123 Main St!@# (invalid - contains disallowed special characters)  
  - Address: 123 Main St (valid - minimum length)  
  - Address: 123 Main Street, Apartment 5, Building B, City Center (valid - maximum length)  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Enter `123 Main St, Suite #5` in Address field | Field accepts input without validation errors |
| 3 | Enter `123 Main St!@#` in Address field | Error message appears: "Only letters, spaces, numbers and (`/` ,`,`, `.` ,`-`, `#`) allowed" |
| 4 | Enter `123 Main St` in Address field | Field accepts input without validation errors |
| 5 | Enter `123 Main Street, Apartment 5, Building B, City Center` in Address field | Field accepts input without validation errors |
| 6 | Click "Save" button | Form submits successfully if all fields are valid |


### 7.2.2 Education Section Validation

7.2.2 Test Case ID: TC_01
- **Test Scenario**: Passing Year field accepts 4-digit numbers between 1970 and current year (2025)

- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - Passing Year: 1970 (valid - minimum)  
  - Passing Year: 2025 (valid - maximum)  
  - Passing Year: 1969 (invalid - below minimum)  
  - Passing Year: 2026 (invalid - above maximum)  
  - Passing Year: abcd (invalid - non-numeric)  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1 | Navigate to education section in profile setup | Education form displays with passing year field |
| 2 | Enter `1970` in Passing Year field | Field accepts input without validation errors |
| 3 | Enter `2025` in Passing Year field | Field accepts input without validation errors |
| 4 | Enter `1969` in Passing Year field | Error message appears: "Passing year must be between 1970 and 2025" |
| 5 | Enter `2026` in Passing Year field | Error message appears: "Passing year must be between 1970 and 2025" |
| 6 | Enter `abcd` in Passing Year field | Error message appears: "Passing year must contain only digits" |
| 7 | Click "Save" button | Form submits successfully if all fields are valid |



### 7.2.3 Experience Section Validation

7.2.3 Test Case ID: TC_01
- **Test Scenario**: Employer field accepts letters, spaces, numbers and special characters (& - / .) with 4–50 character limit

- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - Employer: Tech Company Inc. (valid)  
  - Employer: Tech@Company (invalid - contains disallowed special character)  
  - Employer: ABC (invalid - below minimum)  
  - Employer: Technology Solutions Company Limited (valid - maximum length)  

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1 | Navigate to experience section in profile setup | Experience form displays with employer field |
| 2 | Enter `Tech Company Inc.` in Employer field | Field accepts input without validation errors |
| 3 | Enter `Tech@Company` in Employer field | Error message appears: "Only letters, spaces, numbers and & - / . allowed" |
| 4 | Enter `ABC` in Employer field | Error message appears: "Employer name must be at least 4 characters" |
| 5 | Enter `Technology Solutions Company Limited` in Employer field | Field accepts input without validation errors |
| 6 | Click "Save" button | Form submits successfully if all fields are valid |



### 7.2.4 Document Upload and Image Validation

7.2.4 Test Case ID: TC_01
- **Test Scenario**: Document and Image upload accepts only PDF,JPG,JPEG and PNG files with 50KB–350KB size limit

- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - Valid file: `document.pdf` (200KB)
  - Valid image: `image.jpg` (200KB)
  - Invalid file type: `image.pdf`
  - Invalid file size: `small.pdf` (45KB)  
  - Invalid file size: `large.pdf` (355KB)  
  - Invalid image size: `small.jpeg` (45KB)  
  - Invalid image size: `large.png` (355KB) 

| Step | Action | Expected Outcome |
| ---- | ------ | ---------------- |
| 1 | Navigate to Documents section in profile setup | Documents form displays with file upload field |
| 2 | Select `document1.pdf` (200KB) for upload | File uploads successfully without validation errors |
| 3 | Select `document.jpg` for upload | Error message appears: "Only PDF files are allowed" |
| 4 | Select `document.pdf` (45KB) for upload | Error message appears: "File size must be at least 50KB" |
| 5 | Select `documentlarge.pdf` (355KB) for upload | Error message appears: "File size must be no more than 350KB" |
| 6 | Click "Next" button | Form submits successfully if all fields are valid |
| 1 | Navigate to image section in Basic details | Images form displays with profile picture upload field |
| 2 | Select `image.jpg` (200KB) for upload | Image uploads successfully without validation errors |
| 3 | Select `image1.pdf` for upload | Error message appears: "Only JPG,JPEG and PNG  are allowed" |
| 4 | Select `image1.jpeg` (45KB) for upload | Error message appears: "File size must be at least 50KB" |
| 5 | Select `image1.png` (355KB) for upload | Error message appears: "File size must be no more than 350KB" |
| 6 | Click "Next" button | Form submits successfully if all fields are valid |





## 7.3 Test Case Design Techniques Used

### Boundary Value Analysis (BVA)
Applied to fields with defined input limits to ensure that the system behaves correctly at the boundaries of input ranges.

**Examples:**
- Testing **Full Name** field with 1, 2, 49, 50, and 51 characters.
- Testing **Address** field with 19, 20, 49, 50, and 51 characters.
- Testing **Password** with 7, 8, and 9 characters to confirm minimum length handling.
- Testing **Document upload** with file sizes of 49KB, 50KB, 349KB, 350KB, and 351KB.

---

### Equivalence Partitioning
Divides input data into valid and invalid partitions to reduce the number of test cases while ensuring good coverage.

**Examples:**
- Testing email field with:
  - One valid format (e.g., `user@example.com`)
  - One invalid format (e.g., `user@domain`)
- Testing mobile numbers with:
  - Valid UK number (`+44 7700900123`)
  - Invalid numbers (too short, too long, or non-numeric)
- Testing document upload and image upload:
  - **Document upload**: One valid (`pdf`)
  - One invalid file type (e.g., `jpg`)
   - **Image upload**: One valid (`jpg`,`jpeg` and `png`)
  - One invalid file type (e.g., `pdf`)


---

### State Transition Testing
Used to validate the behavior of the system as it moves between different states, ensuring transitions are valid and correct actions are triggered.

**Examples (Web Auth Flow):**
- **Logout → Login Attempt → OTP Verification → Profile Setup → Login**
- Invalid transitions (e.g., skipping OTP verification) are tested to ensure the system blocks unauthorized state jumps.



## 7.4 Decision Table with Detailed Explanations:

### Table Context
**What This Table Shows**: This decision table maps different testing scenarios to expected system behaviors. Each column represents a specific test situation you might encounter.

### 1. Profile Setup – Basic Details


| Test Case Description             | Profile Image | First Name | Last Name | Country | State | City | Address | Postal Code | Skills | Service Categories | Portfolio Link | Amount | Expected Result                                                           |
|----------------------------------|----------------|-------------|------------|---------|--------|------|---------|--------------|--------|---------------------|----------------|--------|-----------------------------------------------------------------------------|
| All fields valid                 | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Form submits successfully                                                 |
| Profile image invalid format     | No             | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Shows "Only `.jpg`,`.png` and `.jpeg` files are allowed" error                                |
| Profile image below minimum size | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Shows "Image must be at least 50KB" error                                |
| Profile image above maximum size | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Shows "Image cannot exceed 350KB" error                                  |
| First name invalid format        | Yes            | No          | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Shows "Special characters and numbers not allowed" error                 |
| First name below minimum length  | Yes            | No          | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Shows "First name must be at least 2 characters" error                   |
| First name above maximum length  | Yes            | No          | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Shows "First name cannot exceed 50 characters" error                     |
| Last name invalid format         | Yes            | Yes         | No         | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Shows "Special characters and numbers not allowed" error                 |
| Last name below minimum length   | Yes            | Yes         | No         | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Shows "Last name must be at least 2 characters" error                    |
| Last name above maximum length   | Yes            | Yes         | No         | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | Yes    | Shows "Last name cannot exceed 50 characters" error                      |
| Postal code invalid (India)      | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | No           | Yes    | Yes                 | Yes            | Yes    | Shows "Postal code must be 6 numerical characters for India" error       |
| Postal code invalid (UK)         | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | No           | Yes    | Yes                 | Yes            | Yes    | Shows "Postal code must be 6-8 alphanumeric characters with 1 space allowed for UK" error |
| Skills not selected              | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | No     | Yes                 | Yes            | Yes    | Shows "Skills must be selected" error                                    |
| Service categories not selected  | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | No                  | Yes            | Yes    | Shows "Service categories must be selected" error                        |
| Portfolio link invalid format    | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | No             | Yes    | Shows "Portfolio link must be a valid URL" error                         |
| Amount below minimum (1)        | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | No     | Shows "Amount must be at least 1" error                                 |
| Amount above maximum (5) and decimal(2)     | Yes            | Yes         | Yes        | Yes     | Yes    | Yes  | Yes     | Yes          | Yes    | Yes                 | Yes            | No     | Shows "Amount must not exceed 5 digits" error (eg:12345.87)                              |

### 2. Profile Setup – Experience Details



| Test Case Description                          | Current Designation | Company/Employer | Start Date | End Date | Expected Result                                                                 |
|-------------------------------------------------|----------------------|------------------|-------------|----------|----------------------------------------------------------------------------------|
| All fields valid                                | Yes                  | Yes              | Yes         | Yes      | Form submits successfully                                                        |
| Current designation invalid format              | No                   | Yes              | Yes         | Yes      | Shows "Only letters and spaces allowed" error                                    |
| Current designation below minimum length        | No                   | Yes              | Yes         | Yes      | Shows "Current designation must be at least 2 characters" error                  |
| Current designation above maximum length        | No                   | Yes              | Yes         | Yes      | Shows "Current designation cannot exceed 50 characters" error                    |
| Company/employer invalid format                 | Yes                  | No               | Yes         | Yes      | Shows "Only letters, spaces, numbers and special character (`&`,`-`,`/`,`.`) allowed" error |
| Company/employer below minimum length           | Yes                  | No               | Yes         |          | Shows "Company/Employer must be at least 2 characters" error                     |


### 3. Personal Information Section

| Test Case Description                       | Full Name | Country Code | Mobile Number | Email | Address | Postal Code | Expected Result                                                                 |
|--------------------------------------------|-----------|---------------|----------------|-------|---------|--------------|----------------------------------------------------------------------------------|
| All fields valid                            | Yes       | Yes           | Yes            | Yes   | Yes     | Yes          | Form submits successfully                                                        |
| Full Name invalid format                    | No        | Yes           | Yes            | Yes   | Yes     | Yes          | Shows "Only alphabets and spaces allowed" error                                 |
| Full Name below minimum length              | No        | Yes           | Yes            | Yes   | Yes     | Yes          | Shows "Name must be at least 2 characters" error                                |
| Full Name above maximum length              | No        | Yes           | Yes            | Yes   | Yes     | Yes          | Shows "Name cannot exceed 50 characters" error                                  |
| Country code not selected                   | Yes       | No            | Yes            | Yes   | Yes     | Yes          | Shows "Country code must be selected" error                                     |
| Mobile number invalid format (UK)           | Yes       | Yes           | No             | Yes   | Yes     | Yes          | Shows "Mobile number must be 10 digits for UK" error                            |
| Mobile number invalid format (India)        | Yes       | Yes           | No             | Yes   | Yes     | Yes          | Shows "Mobile number must be 10 digits for India" error                         |
| Email invalid format                        | Yes       | Yes           | Yes            | No    | Yes     | Yes          | Shows "Please enter a valid email address" error                                |
| Email below minimum length                  | Yes       | Yes           | Yes            | No    | Yes     | Yes          | Shows "Email must be at least 10 characters" error                              |
| Email above maximum length                  | Yes       | Yes           | Yes            | No    | Yes     | Yes          | Shows "Email cannot exceed 100 characters" error                                |
| Address invalid format                      | Yes       | Yes           | Yes            | Yes   | No      | Yes          | Shows "Only letters, spaces, numbers and (`/`,`,`,`.`,`-`,`#`) allowed" error               |
| Address below minimum length                | Yes       | Yes           | Yes            | Yes   | No      | Yes          | Shows "Address must be at least 20 characters" error                            |
| Address above maximum length                | Yes       | Yes           | Yes            | Yes   | No      | Yes          | Shows "Address cannot exceed 50 characters" error                               |
| Postal Code invalid (India)                 | Yes       | Yes           | Yes            | Yes   | Yes     | No           | Shows "Postal code must be 6 numerical characters for India" error              |
| Postal Code invalid (UK)                    | Yes       | Yes           | Yes            | Yes   | Yes     | No           | Shows "Postal code must be 6-8 alphanumeric characters with 1 space allowed for UK" error |

### 4. Education Section



| Test Case Description             | Education Level | Course | University | Major Subject | Passing Year | Expected Result                                                             |
|----------------------------------|------------------|--------|------------|----------------|----------------|-------------------------------------------------------------------------------|
| All fields valid                 | Yes              | Yes    | Yes        | Yes            | Yes            | Form submits successfully                                                     |
| Education level not selected     | No               | Yes    | Yes        | Yes            | Yes            | Shows "Education level must be selected" error                               |
| Course not selected              | Yes              | No     | Yes        | Yes            | Yes            | Shows "Course must be selected" error                                        |
| University not selected          | Yes              | Yes    | No         | Yes            | Yes            | Shows "University must be selected" error                                    |
| Major subject not selected       | Yes              | Yes    | Yes        | No             | Yes            | Shows "Major subject must be selected" error                                 |
| Passing year invalid format      | Yes              | Yes    | Yes        | Yes            | No             | Shows "Passing year must contain only digits" error                          |
| Passing year below minimum (1970)| Yes              | Yes    | Yes        | Yes            | No             | Shows "Passing year must be between 1970 and 2025" error                     |
| Passing year above maximum (2025)| Yes              | Yes    | Yes        | Yes            | No             | Shows "Passing year must be between 1970 and 2025" error                     |
| Passing year not 4 digits        | Yes              | Yes    | Yes        | Yes            | No             | Shows "Passing year must be 4 digits" error                                  |

### 5. Skills and Tools Section



| Test Case Description          | Skills Selected | Skill Limit Valid | Tools Selected | Tool Limit Valid | Expected Result                                                  |
|-------------------------------|------------------|--------------------|------------------|--------------------|------------------------------------------------------------------|
| All fields valid              | Yes              | Yes                | Yes              | Yes                | Form submits successfully                                        |
| No skills selected            | No               | N/A                | Yes              | Yes                | Shows "At least one skill must be selected" error                |
| More than 10 skills selected  | Yes              | No                 | Yes              | Yes                | Shows "Maximum 10 skills allowed" error                          |
| No tools selected             | Yes              | Yes                | No               | N/A                | Shows "At least one tool must be selected" error                 |
| More than 10 tools selected   | Yes              | Yes                | Yes              | No                 | Shows "Maximum 10 tools allowed" error                           |


### 6. Experience Section


| Test Case Description            | Designation | Employer | Work Location Type | Employment Type | Start Date | End Date | Expected Result                                                                 |
|----------------------------------|-------------|----------|---------------------|------------------|-------------|-----------|----------------------------------------------------------------------------------|
| All fields valid                 | Yes         | Yes      | Yes                 | Yes              | Yes         | Yes       | Form submits successfully                                                        |
| Designation not selected         | No          | Yes      | Yes                 | Yes              | Yes         | Yes       | Shows "Designation must be selected" error                                      |
| Employer invalid format          | Yes         | No       | Yes                 | Yes              | Yes         | Yes       | Shows "Employer may contain only letters, numbers, single spaces, and `/`,`&`,`-`,`.`" error |
| Employer below minimum length    | Yes         | No       | Yes                 | Yes              | Yes         | Yes       | Shows "Employer name must be at least 4 characters" error                       |
| Employer above maximum length    | Yes         | No       | Yes                 | Yes              | Yes         | Yes       | Shows "Employer name cannot exceed 50 characters" error                         |
| Work location type not selected  | Yes         | Yes      | No                  | Yes              | Yes         | Yes       | Shows "Work location type must be selected" error                               |
| Employment type not selected     | Yes         | Yes      | Yes                 | No               | Yes         | Yes       | Shows "Employment type must be selected" error                                  |
| Start date before 1970           | Yes         | Yes      | Yes                 | Yes              | No          | Yes       | Shows "Start date must be between 1970 and current year" error                  |
| Start date after current year    | Yes         | Yes      | Yes                 | Yes              | No          | Yes       | Shows "Start date must be between 1970 and current year" error                  |
| End date before 1970             | Yes         | Yes      | Yes                 | Yes              | Yes         | No        | Shows "End date must be between 1970 and current year" error                    |
| End date after current year      | Yes         | Yes      | Yes                 | Yes              | Yes         | No        | Shows "End date must be between 1970 and current year" error                    |

### 7. Work Preference Section


| Test Case Description                | Portfolio Link | Preferred Work Type | Service Categories | Hourly Rate | Expected Result                                                        |
|-------------------------------------|----------------|----------------------|---------------------|--------------|------------------------------------------------------------------------|
| All fields valid                    | Yes            | Yes                  | Yes                 | Yes          | Form submits successfully                                              |
| Portfolio link invalid format       | No             | Yes                  | Yes                 | Yes          | Shows "Portfolio link must be a valid URL" error                       |
| Portfolio link below minimum length | No             | Yes                  | Yes                 | Yes          | Shows "Portfolio link must be at least 10 characters" error            |
| Portfolio link above maximum length | No             | Yes                  | Yes                 | Yes          | Shows "Portfolio link cannot exceed 200 characters" error              |
| Preferred work type not selected    | Yes            | No                   | Yes                 | Yes          | Shows "Preferred work type must be selected" error                     |
| Services categories not selected    | Yes            | Yes                  | No                  | Yes          | Shows "Services category must be selected" error                       |
| Hourly rate below minimum (1)       | Yes            | Yes                  | Yes                 | No           | Shows "Hourly rate must be greater than 0" error                       |
| Hourly rate above maximum (12345.24)   | Yes            | Yes                  | Yes                 | No           | Shows "Hourly rate must not exceed 5 digit number" error                        |

### 8. Documents Section


| Test Case Description            | File Format Valid | File Size Valid | Expected Result                                   |
|----------------------------------|--------------------|------------------|----------------------------------------------------|
| All fields valid                 | Yes                | Yes              | Form submits successfully                          |
| Invalid file format (not PDF)    | No                 | Yes              | Shows "Only PDF files are allowed" error           |
| File size below minimum (50KB)   | Yes                | No               | Shows "File must be at least 50KB" error           |
| File size above maximum (350KB)  | Yes                | No               | Shows "File cannot exceed 350KB" error             |

## 8. Test Data

### 8.1 Data Requirements & Sources

which focuses on the Engineer Web UI Implementation: Auth module and Web — Input Validation and UI Refinements, test data must simulate realistic 
user scenarios to validate form submissions, input validation rules, and UI/UX flows. Since there is no backend integration in this phase, all test data will be manually created and 
managed as mock inputs.

The test data requirements are derived from the following sources:

**User Stories**: Specifically, "Engineer Web UI Implementation: Auth module" and "Web — Input Validation and UI Refinements for Sprints 1 and 2".<br>

**Validation Rules**: Extracted from Input Field Validation.md and My-Profile-Sidebar-Input-Validation.md, which define field-specific validation rules, character limits, and required formats.

### All test data must cover:

Positive Scenarios: Valid inputs that should successfully submit forms.<br>
Negative Scenarios: Invalid inputs that should trigger appropriate error messages.<br>
Boundary Conditions: Inputs at minimum and maximum limits defined in validation rules.<br>
Edge Cases: Special characters, empty fields, null values, and unexpected formats<br>


| **Test Category**       | **Description**                                               | **Purpose**                                  |
|-------------------------|---------------------------------------------------------------|-----------------------------------------------|
| **Valid Authentication**| User with correct email/phone and password                    | Test successful login and profile setup       |
| **Invalid Email Format**| Email without `@` or missing domain                          | Test email validation                         |
| **Password Variations** | Passwords with different complexity levels                    | Test password validation rules                |
| **Mobile Number Formats**| Valid UK (10 digits) and India (10 digits) numbers           | Test mobile number validation                 |
| **Document Uploads**    | PDF files of various sizes (e.g., 50KB, 200KB, 350KB)         | Test document upload functionality            |
| **Name Field Examples** | Names with special characters, and minimum/maximum lengths    | Test name field validation                    |


### 8.2 Validation Test Data

| **Field**            | **Valid Data**                          | **Invalid Data / Edge Cases**                                       |
|-----------------------|------------------------------------------|--------------------------------------------------------------------|
| **Email**             | `engineer@company.com`                     | engineer@company<br>`engineer@company.co` (min)<br>`engineer+verylongemailaddress@company.com` (max) |
| **Password**          | SecureP@ss123                            | password<br>Secur3! (min)<br>SecureP@ss1234567890 (max)            |
| **Mobile Number (UK)**| +447700900123                            | 44770090012<br>+4477009001234 (invalid length)                     |
| **Mobile Number (India)** | +919876543210                        | 919876543210<br>+91987654321 (too short)                           |
| **OTP**               | 1234                                     | abcdef<br>123 (too short)<br>12345 (too long)                      |
| **Name**              | John                                     | John@Doe<br>J (too short)<br>Johnathan Michael Smith (max length)  |
| **Postal Code (India)** | 110001                                 | ABC123<br>11000 (too short)<br>1100012 (too long)                  |
| **Postal Code (UK)**  | W1K 3JP                                  | ABC123<br>W1K (too short)<br>W1K3JPA (too long)                    |
| **Documents**         | (200KB) `PDF` file                  | 50KB PDF (min)<br>350KB PDF (max)                                  |
| **Profile Image**         | (200KB) `jpg,jpeg and png` file                  | 50KB jpg (min)<br>350KB jpg(max)                                  |

