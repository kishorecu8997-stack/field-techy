# My Profile Sidebar Specification

## Personal Information

| Field           | Input Type | Required | Rule                  | Validation Rule                                                                                                               | Lower Limit     | Upper Limit     |
|-----------------|------------|----------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------|------------------|------------------|
| Full Name       | Text       | Yes      | Alphabets only        | Alphabets (Capital & Small) only are allowed with spaces (max 10) between the words. (No leading/trailing spaces allowed)     | 2 Characters     | 50 Characters    |
| Country code    | Dropdown   | Yes      | Select country Code   | Select country code from the dropdown list                                                                                    | N/A              | N/A              |
| Mobile number   | Number     | Yes      | Mobile No. Verification | UK: 11 digits, India: 10 digits                                                                                              | 10 Characters    | 11 Characters    |
| Email ID        | Text       | Yes      | Email verification    | Confirm user email address by sending a verification code                                                                     | 10 Characters    | 100 Characters   |
| Address         | Text       | Yes      | Flexible input        | Only letters, spaces, numbers, and special characters such as `/ , . - #` are allowed                                         | 20 Characters    | 50 Characters    |

---

## Education

### Overview

| Field             | Input Type    | Required | Rule                     | Validation Rule              | Lower Limit | Upper Limit |
|-------------------|---------------|----------|--------------------------|------------------------------|-------------|-------------|
| Card View         | Card          | Yes      | Display education details| Card View                    | N/A         | N/A         |
| + Add Education   | Link button   | Yes      | Open Add Education sidebar | Open Add Education sidebar | N/A         | N/A         |
| Edit Button       | Button        | Yes      | Open Edit Education sidebar | Open Edit Education sidebar | N/A         | N/A         |
| Delete Button     | Button        | Yes      | Delete the Education details | Delete the Education details | N/A         | N/A         |

### Add Education

| Field            | Input Type | Required | Rule                    | Validation Rule                                      | Lower Limit   | Upper Limit   |
|------------------|------------|----------|-------------------------|------------------------------------------------------|---------------|---------------|
| Education Level  | Dropdown   | Yes      | Education level required| Educational Level must be selected (Dropdown)        | 1 Selection   | 1 Selection   |
| Course           | Dropdown   | Yes      | Course required         | Course must be selected (Dropdown)                   | 1 Selection   | 1 Selection   |
| University       | Dropdown   | Yes      | University required     | University must be selected (Dropdown)               | 1 Selection   | 1 Selection   |
| Major Subject    | Dropdown   | Yes      | Major Subject required  | Major Subject must be selected (Dropdown)            | 1 Selection   | 1 Selection   |
| Passing Year     | Text       | Yes      | Passing Year Validation | Year between 1970–2025; 4-digit number               | 4 Characters  | 4 Characters  |

### Edit Education

| Field            | Input Type | Required | Rule                    | Validation Rule                                      | Lower Limit   | Upper Limit   |
|------------------|------------|----------|-------------------------|------------------------------------------------------|---------------|---------------|
| Education Level  | Dropdown   | Yes      | Education level required| Educational Level must be selected (Dropdown)        | 1 Selection   | 1 Selection   |
| Course           | Dropdown   | Yes      | Course required         | Course must be selected (Dropdown)                   | 1 Selection   | 1 Selection   |
| University       | Dropdown   | Yes      | University required     | University must be selected (Dropdown)               | 1 Selection   | 1 Selection   |
| Major Subject    | Dropdown   | Yes      | Major Subject required  | Major Subject must be selected (Dropdown)            | 1 Selection   | 1 Selection   |
| Passing Year     | Text       | Yes      | Passing Year Validation | Year between 1970–2025; digits only                  | 4 Characters  | 4 Characters  |

---

## Skills and Tools

### Overview

| Field             | Input Type    | Required | Rule                        | Validation Rule                | Lower Limit | Upper Limit |
|-------------------|---------------|----------|-----------------------------|--------------------------------|-------------|-------------|
| Card View         | Card          | Yes      | Display Add/Edit Skills     | Display Skills and Tools details | N/A         | N/A         |
| + Add Skill       | Link button   | Yes      | Open Add Skill sidebar      | Open Add Skill sidebar         | N/A         | N/A         |
| + Add Tools       | Link button   | Yes      | Open Add Tools sidebar      | Multi-select Tools             | N/A         | N/A         |

### Add Skills

| Field             | Input Type | Required | Rule               | Validation Rule     | Lower Limit   | Upper Limit    |
|-------------------|------------|----------|--------------------|---------------------|---------------|----------------|
| Select Skill name | Dropdown   | Yes      | Skills name select | Multi-select Skills | 1 Selection   | 10 Selections  |

### Edit Skills

| Field             | Input Type | Required | Rule               | Validation Rule     | Lower Limit   | Upper Limit    |
|-------------------|------------|----------|--------------------|---------------------|---------------|----------------|
| Select Skill name | Dropdown   | Yes      | Skills name select | Multi-select Skills | 1 Selection   | 10 Selections  |

### Add Tools

| Field             | Input Type | Required | Rule              | Validation Rule                         | Lower Limit   | Upper Limit    |
|-------------------|------------|----------|-------------------|-----------------------------------------|---------------|----------------|
| Select Tool name  | Dropdown   | Yes      | Tool name select  | Select tool; displays as chips          | 1 Selection   | 10 Selections  |

### Edit Tools

| Field             | Input Type | Required | Rule              | Validation Rule                         | Lower Limit   | Upper Limit    |
|-------------------|------------|----------|-------------------|-----------------------------------------|---------------|----------------|
| Select Tool name  | Dropdown   | Yes      | Tool name select  | Select tool; displays as chips          | 1 Selection   | 10 Selections  |
| + Add Experience  | Link button| Yes      | Open Add Experience sidebar | Open Add Experience sidebar    | N/A           | N/A            |

---

## Experience

### Add Experiences

| Field               | Input Type   | Required | Rule                     | Validation Rule                                                                 | Lower Limit         | Upper Limit         |
|---------------------|--------------|----------|--------------------------|---------------------------------------------------------------------------------|---------------------|---------------------|
| Designation         | Dropdown     | Yes      | Designation select       | Designation must be selected (Dropdown)                                         | 1 Selection         | 1 Selection         |
| Employer            | Text         | Yes      | Enter the Employer       | Only letters, numbers, single spaces, and `/ & - .`                             | 4 Characters        | 50 Characters       |
| Work Location Type  | Dropdown     | Yes      | Work Location Type select| Work Location Type must be selected (Dropdown)                                  | 1 Selection         | 1 Selection         |
| Employment Type     | Dropdown     | Yes      | Employment Type select   | Employment Type must be selected (Dropdown)                                     | 1 Selection         | 1 Selection         |
| Start Date          | Date Picker  | Yes      | Select Date              | Date between 1970 and current year                                              | Select any one date | Select any one date |
| End Date            | Date Picker  | No       | Select Date              | Optional                                                                        | N/A                 | N/A                 |

### Edit Experiences

| Field               | Input Type   | Required | Rule                     | Validation Rule                                                                 | Lower Limit         | Upper Limit         |
|---------------------|--------------|----------|--------------------------|---------------------------------------------------------------------------------|---------------------|---------------------|
| Designation         | Dropdown     | Yes      | Designation select       | Designation must be selected (Dropdown)                                         | 1 Selection         | 1 Selection         |
| Employer            | Text         | Yes      | Enter the Employer       | Only letters, spaces, numbers, and special characters (`& - / .`)               | 4 Characters        | 50 Characters       |
| Work Location Type  | Dropdown     | Yes      | Work Location Type select| Work Location Type must be selected (Dropdown)                                  | 1 Selection         | 1 Selection         |
| Employment Type     | Dropdown     | Yes      | Employment Type select   | Employment Type must be selected (Dropdown)                                     | 1 Selection         | 1 Selection         |
| Start Date          | Date Picker  | Yes      | Select Date              | Date between 1970 and current year                                              | Select any one date | Select any one date |
| End Date            | Date Picker  | No       | Select Date              | —                                                                               | N/A                 | N/A                 |
| Edit Button         | Button       | Yes      | Open Edit Experience sidebar | Open Edit Experience sidebar                                               | N/A                 | N/A                 |

---

## Work Preference

| Field                        | Input Type | Required | Rule                    | Validation Rule                                               | Lower Limit                    | Upper Limit                    |
|------------------------------|------------|----------|-------------------------|---------------------------------------------------------------|--------------------------------|--------------------------------|
| Portfolio Link               | Text       | No       | Portfolio Link          | Enter the Portfolio Link (To be clarified)                    | —                              | —                              |
| Preferred Work Type          | Dropdown   | Yes      | Preferred Work Type     | Select specific work type from dropdown                       | 1 Selection                    | 1 Selection                    |
| Services Categories          | Dropdown   | Yes      | Services Categories     | Select specific service category from dropdown                | 1 Selection                    | 1 Selection                    |
| Hourly/Fixed Rate Preference | Number     | Yes      | Hourly Rate             | Enter Hourly/Fixed Rate (Number only; value > 0)              | 1 digit (value > 0)            | 5 digits (value > 0)           |

---

## Documents

| Field      | Input Type   | Required | Rule               | Validation Rule                | Lower Limit       | Upper Limit       |
|------------|--------------|----------|--------------------|--------------------------------|--------------------|--------------------|
| Documents  | File Upload  | Yes      | Edit & Delete docs | Only valid PDF format allowed  | 50 KB per upload   | 350 KB per upload  |