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

## 7.1 Input Validation and UI Refinements Flow Test Cases

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

7.1.6 Test Case ID: TC_06

- **Test Scenario**: New password meets all complexity requirements  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:
    - New password: SecureP@ss123  
    - Confirm password: SecureP@ss123  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to password setup page | Password form displays with new and confirm password fields |
| 2 | Enter `SecureP@ss123` in New password field | Field accepts input without validation errors |
| 3 | Enter `SecureP@ss123` in Confirm password field | Field accepts input without validation errors |
| 4 | Click **"Save"** button | Form submits successfully |


- **Test Scenario**: New password does not match confirm password  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:
    - New password: SecureP@ss123  
    - Confirm password: SecureP@ss456  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to password setup page | Password form displays with new and confirm password fields |
| 2 | Enter `SecureP@ss123` in New password field | Field accepts input without validation errors |
| 3 | Enter `SecureP@ss456` in Confirm password field | Error message appears: "Password must match with the password in the previous field" |
| 4 | Click **"Save"** button | Form submission is blocked |

 
- **Test Scenario**: New password length below minimum limit  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:
     - New password:  P@ss1 (7 characters - below minimum)  
     - Confirm password: P@ss1  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to password setup page | Password form displays with new and confirm password fields |
| 2 | Enter `P@ss1` in New password field | Error message appears: "Password must be at least 8 characters" |
| 3 | Enter `P@ss1` in Confirm password field | Password field accepts input without validation errors |
| 4 | Click **"Save"** button | Form submission is blocked |



### 7.2.1 Profile Setup Functionality

7.2.1 Test Case ID: 01 <br>
- **Test Scenario**:First Name field rejects special characters  
- **Environment**: Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data**:  
  - First Name: John@Doe (contains special character)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Enter `John@Doe` in First Name field | Error message appears: "Special characters and numbers not allowed" |
| 3 | Check system state | Form cannot be submitted until field is corrected |


7.2.2 Test Case ID: TC_02
- **Test Scenario:** First Name field rejects input below minimum length  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **First Name:** J (1 character - below minimum)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Enter `J` in First Name field | Error message appears: "First name must be at least 2 characters" |
| 3 | Check system state | Form cannot be submitted until field is corrected |



7.2.3 Test Case ID: TC_03
- **Test Scenario:** First Name field accepts input within valid length range  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **First Name:** Johnathan (valid - 9 characters)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Enter `Johnathan` in First Name field | Field accepts input without validation errors |
| 3 | Check system state | Form can be submitted if all other fields are valid |


7.2.4 Test Case ID: TC_04
- **Test Scenario:** Address field rejects invalid special characters  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Address:** 123 Main St!@# (contains disallowed special characters)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Enter `123 Main St!@#` in Address field | Error message appears: "Only letters, spaces, numbers and ( `/ , . - #` ) allowed" |
| 3 | Check system state | Form cannot be submitted until field is corrected |

7.2.5 Test Case ID: TC_05
- **Test Scenario:** Address field rejects input below minimum length  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Address:** 123 (below minimum)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Enter `123` in Address field | Error message appears: "Address must be at least 6 characters" |
| 3 | Check system state | Form cannot be submitted until field is corrected |

7.2.6 Test Case ID: TC_06 
- **Test Scenario:** Address field accepts input within valid length range  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Address:** 123 Main Street, Apartment 5 (valid - 28 characters)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Enter address in Address field | Field accepts input without validation errors |
| 3 | Check system state | Form can be submitted if all other fields are valid |

7.2.7 Test Case ID: TC_07  
- **Test Scenario:** Indian Postal Code requires 6 numeric characters  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Country:** India  
  - **Postal Code:** 110001 (valid)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Select "India" from Country dropdown | Country field is set to India |
| 3 | Enter `110001` in Postal Code field | Field accepts input without validation errors |
| 4 | Check system state | Form can be submitted if all other fields are valid |

7.2.8 Test Case ID: TC_08  
- **Test Scenario:** Indian Postal Code rejects non-numeric characters  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Country:** India  
  - **Postal Code:** 11A001 (contains letter)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Select "India" from Country dropdown | Country field is set to India |
| 3 | Enter `11A001` in Postal Code field | Error message appears: "Postal code must be 6 numerical characters for India" |
| 4 | Check system state | Form cannot be submitted until field is corrected |

7.2.9 Test Case ID: TC_09  
- **Test Scenario:** UK Postal Code requires 6–8 alphanumeric characters with space  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Country:** UK  
  - **Postal Code:** SW1A 1AA (valid)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Select "UK" from Country dropdown | Country field is set to UK |
| 3 | Enter `SW1A 1AA` in Postal Code field | Field accepts input without validation errors |
| 4 | Check system state | Form can be submitted if all other fields are valid |

7.2.10 Test Case ID: TC_10  
- **Test Scenario:** UK Postal Code rejects invalid format  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Country:** UK  
  - **Postal Code:** SW1A1AA (no space)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Select "UK" from Country dropdown | Country field is set to UK |
| 3 | Enter `SW1A1AA` in Postal Code field | Error message appears: "Postal code must be 6–8 alphanumeric characters with 1 space allowed for UK" |
| 4 | Check system state | Form cannot be submitted until field is corrected |

7.2.11 Test Case ID: TC_11  
- **Test Scenario:** Profile image upload accepts valid file formats  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Profile Image:** profile.jpg (200KB)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Select `profile.jpg` for upload | File uploads successfully without validation errors |
| 3 | Check system state | Form can be submitted if all other fields are valid |

7.2.12 Test Case ID: TC_12  
- **Test Scenario:** Profile image upload rejects invalid file format  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Profile Image:** profile.pdf

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Select `profile.pdf` for upload | Error message appears: "Only valid JPEG, JPG and PNG format are allowed" |
| 3 | Check system state | Form cannot be submitted until valid file is selected |

7.2.13 Test Case ID: TC_13  
- **Test Scenario:** Profile image upload rejects file below minimum size  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Profile Image:** profile_small.jpg (45KB)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Select `profile_small.jpg` for upload | Error message appears: "Image must be at least 50KB" |
| 3 | Check system state | Form cannot be submitted until valid file is selected |

7.2.14 Test Case ID: TC_14  
- **Test Scenario:** Profile image upload rejects file above maximum size  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Profile Image:** profile_large.jpg (355KB)

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to profile setup page | Profile setup form displays with personal information section |
| 2 | Select `profile_large.jpg` for upload | Error message appears: "Image cannot exceed 350KB" |
| 3 | Check system state | Form cannot be submitted until valid file is selected |


### 7.3.1 Experience Details Functionality

7.3.1 Test Case ID: TC_01
- **Test Scenario:** Current Designation field rejects special characters  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Current Designation:** Senior@Engineer (contains special character)  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to experience section in profile setup | Experience form displays with designation field |
| 2 | Enter `Senior@Engineer` in Current Designation field | Error message appears: "Only letters and spaces allowed" |
| 3 | Check system state | Form cannot be submitted until field is corrected |


7.3.2 Test Case ID: TC_02
- **Test Scenario:** Current Designation field rejects input below minimum length  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Current Designation:** SE (2 characters - minimum valid)  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to experience section in profile setup | Experience form displays with designation field |
| 2 | Enter `SE` in Current Designation field | Field accepts input without validation errors |
| 3 | Check system state | Form can be submitted if all other fields are valid |


7.3.3 Test Case ID: TC_03
- **Test Scenario:** Company/Employer field rejects invalid special characters  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Company/Employer:** Tech@Company (contains disallowed special character)  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to experience section in profile setup | Experience form displays with employer field |
| 2 | Enter `Tech@Company` in Company/Employer field | Error message appears: "Only letters, spaces, numbers and `& - / .` allowed" |
| 3 | Check system state | Form cannot be submitted until field is corrected |

7.3.4 Test Case ID: TC_04
- **Test Scenario:** Company/Employer field rejects input below minimum length  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Company/Employer:** ABC (3 characters - below minimum)  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to experience section in profile setup | Experience form displays with employer field |
| 2 | Enter `ABC` in Company/Employer field | Error message appears: "Company/Employer must be at least 4 characters" |
| 3 | Check system state | Form cannot be submitted until field is corrected |


7.3.5 Test Case ID: TC_05
- **Test Scenario:** Resume/CV upload accepts valid file format  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Resume:** resume.pdf (200KB)  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to experience section in profile setup | Experience form displays with resume upload field |
| 2 | Select `resume.pdf` for upload | File uploads successfully without validation errors |
| 3 | Check system state | Form can be submitted if all other fields are valid |


7.3.6 Test Case ID: TC_06
- **Test Scenario:** Resume/CV upload rejects invalid file format  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Resume:** resume.jpg  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to experience section in profile setup | Experience form displays with resume upload field |
| 2 | Select `resume.jpg` for upload | Error message appears: "Only valid PDF format are allowed" |
| 3 | Check system state | Form cannot be submitted until valid file is selected |

7.3.7 Test Case ID: TC_07 
- **Test Scenario:** Resume/CV upload rejects file below minimum size  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Resume:** resume_small.pdf (45KB)  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to experience section in profile setup | Experience form displays with resume upload field |
| 2 | Select `resume_small.pdf` for upload | Error message appears: "File must be at least 50KB" |
| 3 | Check system state | Form cannot be submitted until valid file is selected |

7.3.8 Test Case ID: TC_08
- **Test Scenario:** Resume/CV upload rejects file above maximum size  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Resume:** resume_large.pdf (355KB)  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to experience section in profile setup | Experience form displays with resume upload field |
| 2 | Select `resume_large.pdf` for upload | Error message appears: "File cannot exceed 350KB" |
| 3 | Check system state | Form cannot be submitted until valid file is selected |



### 7.4.1 Background Verification Functionality

7.4.1 Test Case ID: TC_01
- **Test Scenario:** Government ID upload accepts valid PDF format  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Government ID:** id_card.pdf (200KB)  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to background verification section | Background verification form displays with document upload fields |
| 2 | Select `id_card.pdf` for Government ID upload | File uploads successfully without validation errors |
| 3 | Check system state | Form can be submitted if all other fields are valid |


7.4.2 Test Case ID: TC_02
- **Test Scenario:** Government ID upload rejects invalid file format  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Government ID:** id_card.jpg  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to background verification section | Background verification form displays with document upload fields |
| 2 | Select `id_card.jpg` for Government ID upload | Error message appears: "Only valid PDF format are allowed" |
| 3 | Check system state | Form cannot be submitted until valid file is selected |


7.4.3 Test Case ID: TC_03
- **Test Scenario:** Certificate upload accepts valid PDF format  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Certificate:** certificate.pdf (200KB)  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to background verification section | Background verification form displays with document upload fields |
| 2 | Select `certificate.pdf` for Certificate upload | File uploads successfully without validation errors |
| 3 | Check system state | Form can be submitted if all other fields are valid |


7.4.4 Test Case ID: TC_04
- **Test Scenario:** Certificate upload rejects invalid file format  
- **Environment:** Any browser (Chrome, Firefox, Edge) on desktop or mobile device  
- **Test Data:**  
  - **Certificate:** certificate.jpg  

| Step | Action | Expected Result |
|------|---------|----------------|
| 1 | Navigate to background verification section | Background verification form displays with document upload fields |
| 2 | Select `certificate.jpg` for Certificate upload | Error message appears: "Only valid PDF format are allowed" |
| 3 | Check system state | Form cannot be submitted until valid file is selected |


### 7.2 Test Case Design Techniques Used

### Boundary Value Analysis (BVA)
Applied to fields with defined input limits to ensure that the system behaves correctly at the boundaries of input ranges.

**Examples:**
- Testing **Full Name** field with 1, 2, 49, 50, and 51 characters.
- Testing **Address** field with 19, 20, 49, 50, and 51 characters.
- Testing **Password** with 7, 8, and 9 characters to confirm minimum length handling.
- Testing **Document upload** with file sizes of 49KB, 50KB, 349KB, 350KB, and 351KB.


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



### State Transition Testing
Used to validate the behavior of the system as it moves between different states, ensuring transitions are valid and correct actions are triggered.

**Examples (Web Auth Flow):**
- **Logout → Login Attempt → OTP Verification → Profile Setup → Login**
- Invalid transitions (e.g., skipping OTP verification) are tested to ensure the system blocks unauthorized state jumps.



### 7.3 Decision Table with Detailed Explanations:

### Table Context

**What This Table Shows**: This decision table maps different testing scenarios to expected system behaviors. Each column represents a specific test situation you might encounter.

### 7.3.1 Login Authentication

| Test Case Description | Email ID | Password | OTP | Mobile Number | Country Code | Expected Result |
|----------------------|----------|----------|-----|---------------|--------------|-----------------|
| All fields valid | Yes <br> *(10-100 chars)* | Yes <br> *(8-20 chars, valid format)* | Yes <br> *(1234)* | Yes <br> *(10 digits)* | Yes | Form submits successfully |
| Email invalid format | No | Yes | Yes | Yes | Yes | Shows "Please enter a valid email address" error |
| Email below minimum length | No | Yes | Yes | Yes | Yes | Shows "Email must be at least 10 characters" error |
| Email above maximum length | No | Yes | Yes | Yes | Yes | Shows "Email cannot exceed 100 characters" error |
| Password invalid format | Yes | No | Yes | Yes | Yes | Shows "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" error |
| Password below minimum length | Yes | No | Yes | Yes | Yes | Shows "Password must be at least 8 characters" error |
| Password above maximum length | Yes | No | Yes | Yes | Yes | Shows "Password cannot exceed 20 characters" error |
| OTP invalid format | Yes | Yes | No *(abcd)* | Yes | Yes | Shows "OTP must contain only digits" error |
| OTP wrong length | Yes | Yes | No <br> *(123)* | Yes | Yes | Shows "OTP must be 4 characters" error |
| Mobile number invalid (UK) | Yes | Yes | Yes | No *(1234567890)* | Yes | Shows "Mobile number must be 10 digits for UK" error |
| Mobile number invalid (India) | Yes | Yes | Yes | No *(123456789)* | Yes | Shows "Mobile number must be 10 digits for India" error |


### 7.3.2 Profile Setup - Basic Details

| Test Case Description                        | Profile Image       | First Name                             | Last Name        | Country | Mobile Number  | Email                                           | Address        | Postal Code | Skills | Service Categories | Portfolio Link                                            | Amount   | Expected Result                                             |
|---------------------------------------------|---------------------|----------------------------------------|------------------|---------|----------------|-------------------------------------------------|----------------|-------------|--------|--------------------|----------------------------------------------------------|---------|------------------------------------------------------------|
| All fields valid                            | Yes *(200KB)*        | Yes <br> *(John)*                              | Yes <br> *(Smith)*      | Yes <br> *(India)* | Yes <br> *(9876543210)* | Yes  | Yes <br> *(123 Main St)* | Yes <br> *(110001)* | Yes    | Yes                | Yes  | Yes <br> *(50.00)* | Form submits successfully                                   |
| Profile image invalid format               | No <br> *(pdf)*           | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | Yes     | Shows "Only valid JPEG, JPG and PNG format are allowed" error |
| Profile image below minimum size           | No <br> *(45KB)*           | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | Yes     | Shows "Image must be at least 50KB" error                  |
| Profile image above maximum size           | No <br> *(355KB)*          | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | Yes     | Shows "Image cannot exceed 350KB" error                    |
| First name invalid format                  | Yes                 | No <br> *(John@Doe)*                          | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | Yes     | Shows "Special characters and numbers not allowed" error  |
| First name below minimum length            | Yes                 | No <br> *(J)*                                 | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | Yes     | Shows "First name must be at least 2 characters" error    |
| First name above maximum length            | Yes                 | No <br> *(51+ chars)*                         | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | Yes     | Shows "First name cannot exceed 50 characters" error      |
| Last name invalid format                   | Yes                 | Yes                                    | No <br> *(Smith@Doe)*   | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | Yes     | Shows "Special characters and numbers not allowed" error  |
| Last name below minimum length             | Yes                 | Yes                                    | No <br> *(S)*           | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | Yes     | Shows "Last name must be at least 2 characters" error     |
| Postal code invalid (India)                | Yes                 | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | No <br> *(11A001)* | Yes    | Yes                | Yes                                                      | Yes     | Shows "Postal code must be 6 numerical characters for India" error |
| Postal code invalid (UK)                   | Yes                 | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | No <br> *(SW1A1AA)* | Yes   | Yes                | Yes                                                      | Yes     | Shows "Postal code must be 6-8 alphanumeric characters with 1 space allowed for UK" error |
| Skills not selected                        | Yes                 | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | No     | Yes                | Yes                                                      | Yes     | Shows "Skills must be selected" error                     |
| Service categories not selected            | Yes                 | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | No                 | Yes                                                      | Yes     | Shows "Service categories must be selected" error         |
| Portfolio link invalid format              | Yes                 | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | No <br> *(not-a-url)*                                           | Yes     | Shows "Portfolio link must be a valid URL" error          |
| Portfolio link below minimum length        | Yes                 | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | No <br> *(a)*                                                  | Yes     | Shows "Portfolio link must be at least 10 characters" error |
| Portfolio link above maximum length        | Yes                 | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | No <br> *(201+ chars)*                                          | Yes     | Shows "Portfolio link cannot exceed 200 characters" error |
| Amount below minimum                       | Yes                 | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | No <br> *(0)*   | Shows "Amount must be at least 1" error                   |
| Amount above maximum                       | Yes                 | Yes                                    | Yes              | Yes     | Yes            | Yes                                             | Yes            | Yes         | Yes    | Yes                | Yes                                                      | No <br> *(123456)* | Shows "Amount must not exceed 5 digit number" error     |




### 7.3.3 Experience Details

| Test Case Description | Current Designation          | Company/Employer            | Experience            | Resume/CV             | Expected Result                                         |
|-----------------------|------------------------------|-----------------------------|------------------------|------------------------|---------------------------------------------------------|
| All fields valid      | Yes <br> *(Senior Engineer)* | Yes <br> *(Tech Solutions)* | Yes <br> *(5 years)*  | Yes <br> *(200KB PDF)* | Form submits successfully                                |
| Current designation invalid format        | No <br> *(Engineer@)*           | Yes                        | Yes                    | Yes                    | Shows "Only letters and spaces allowed" error           |
| Current designation below minimum length  | No <br> *(SE)*                  | Yes                        | Yes                    | Yes                    | Shows "Current designation must be at least 2 characters" error |
| Current designation above maximum length  | No <br> *(51+ chars)*           | Yes                        | Yes                    | Yes                    | Shows "Current designation cannot exceed 50 characters" error |
| Company/employer invalid format           | Yes                             | No <br> *(Tech@Company)*   | Yes                    | Yes                    | Shows "Only letters, spaces, numbers and & - / . allowed" error |
| Company/employer below minimum length     | Yes                             | No <br> *(ABC)*            | Yes                    | Yes                    | Shows "Company/Employer must be at least 4 characters" error |
| Resume/CV invalid format                  | Yes                             | Yes                        | Yes                    | No <br> *(JPG)*        | Shows "Only valid PDF format are allowed" error         |
| Resume/CV below minimum size              | Yes                             | Yes                        | Yes                    | No <br> *(45KB)*       | Shows "File must be at least 50KB" error                |
| Resume/CV above maximum size              | Yes                             | Yes                        | Yes                    | No <br> *(355KB)*      | Shows "File cannot exceed 350KB" error                  |

### 7.3.4 Background Verification

| Test Case Description          | Government ID            | Certificate              | Expected Result                                 |
|-------------------------------|---------------------------|--------------------------|-------------------------------------------------|
| All fields valid              | Yes <br> *(200KB PDF)*     | Yes <br> *(200KB PDF)*    | Form submits successfully                        |
| Government ID invalid format  | No <br> *(JPG)*            | Yes                       | Shows "Only valid PDF format are allowed" error |
| Government ID below minimum size | No <br> *(45KB)*         | Yes                       | Shows "File must be at least 50KB" error        |
| Government ID above maximum size | No <br> *(355KB)*        | Yes                       | Shows "File cannot exceed 350KB" error          |
| Certificate invalid format    | Yes                        | No <br> *(JPG)*           | Shows "Only valid PDF format are allowed" error |
| Certificate below minimum size| Yes                        | No <br> *(45KB)*          | Shows "File must be at least 50KB" error        |
| Certificate above maximum size| Yes                        | No <br> *(355KB)*         | Shows "File cannot exceed 350KB" error          |


### 7.3.5 Documents Section


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
| **Email**             | `engineer@company.com`                     | `engineer@company `<br>`engineer@company.co` (min)<br>`engineer+verylongemailaddress@company.com` (max) |
| **Password**          | SecureP@ss123                            | password<br>Secur3! (min)<br>SecureP@ss1234567890 (max)            |
| **Mobile Number (UK)**| +447700900123                            | 44770090012<br>+4477009001234 (invalid length)                     |
| **Mobile Number (India)** | +919876543210                        | 919876543210<br>+91987654321 (too short)                           |
| **OTP**               | 1234                                     | abcdef<br>123 (too short)<br>12345 (too long)                      |
| **Name**              | John                                     | John@Doe<br>J (too short)<br>Johnathan Michael Smith (max length)  |
| **Postal Code (India)** | 110001                                 | ABC123<br>11000 (too short)<br>1100012 (too long)                  |
| **Postal Code (UK)**  | W1K 3JP                                  | ABC123<br>W1K (too short)<br>W1K3JPA (too long)                    |
| **Documents**         | (200KB) `PDF` file                  | 50KB PDF (min)<br>350KB PDF (max)                                  |
| **Profile Image**         | (200KB) `jpg,jpeg and png` file                  | 50KB jpg (min)<br>350KB jpg(max)                                  |

