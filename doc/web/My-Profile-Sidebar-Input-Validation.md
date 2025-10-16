# My Profile Sidebar Form Fields Specification

| Page | Fields | Input Type | Required (Yes/No) | Rule | Validation Rule | Lower Limit | Upper Limit |
|------|--------|------------|-------------------|------|------------------|-------------|-------------|
| Profile Sidebar/Personal Information | Full Name | Text | Yes | Albhabets only | Alhabets (Capital & Small) only are allowed with spaces (max 10) between the words. (No leading and trailing spaces are allowed) | 2 Characters | 50 Characters |
| Profile Sidebar/Personal Information | Country code | Dropdown | Yes | Select country Code | Select country code from the Drop down list | N/A | N/A |
| Profile Sidebar/Personal Information | Mobile number | Number | Yes | Mobile No. Verification | UK accept 10 numbers and India accept 10 numbers | 10 Characters | 10 Characters |
| Profile Sidebar/Personal Information | Email ID | Text | Yes | Email verification | Confirm user email address by sending code to it and asking the user to verify the same code. | 10 Characters | 100 Characters |
| Profile Sidebar/Personal Information | Address | Text | Yes | Allow flexible input with character limit | Only letters, spaces, numbers and special characters such as / , . - # are allowed. | 20 Characters | 50 Characters |
| Profile Sidebar/Education | Card View | Card | Yes | Display education details | Card View | N/A | N/A |
| Profile Sidebar/Education | + Add Education | Link button | Yes | Open Add Education sidebar | Open Add Education sidebar | N/A | N/A |
| Profile Sidebar/Add Education | Education Level | Dropdown | Yes | Education level required | Eductional Level must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/Add Education | Course | Dropdown | Yes | Course required | Course must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/Add Education | University | Dropdown | Yes | University required | University must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/Add Education | Major Subject | Dropdown | Yes | Major Subject required | Major Subject must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/Add Education | Passing Year | Text | Yes | Passing Year Validation | Passing year Start year -1970 End year -Current year(2025) 4 - digit number | 4 Characters | 4 Characters |
| Profile Sidebar/Education | Edit Button | Button | Yes | Open Edit Education sidebar | Open Edit Education sidebar | N/A | N/A |
| Profile Sidebar/Edit Education | Education Level | Dropdown | Yes | Education level required | Eductional Level must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/Edit Education | Course | Dropdown | Yes | Course required | Course must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/Edit Education | University | Dropdown | Yes | University required | University must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/Edit Education | Major Subject | Dropdown | Yes | Major Subject required | Major Subject must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/Edit Education | Passing Year | Text | Yes | Passing Year Validation | Passing year Start year -1970 End year -Current year(2025) -Only digits | 4 Characters | 4 Characters |
| Profile Sidebar/Education | Delete Button | Button | Yes | Delete the Education details | Delete the Education details | N/A | N/A |
| Profile Sidebar/Skills and Tools | Card View | Card | Yes | Display Add /Edit Skills | Display Skills and Tools details | N/A | N/A |
| Profile Sidebar/Add & Edit Tools | + Add Skill | Link button | Yes | Open Add Skill sidebar | Open Add Skill sidebar | N/A | N/A |
| Profile Sidebar/Add Skills | Select Skill name | Dropdown | Yes | skills name select | Multi select Skills | 1 Selection | 10 Selection |
| Profile Sidebar/Edit Skills | Select Skill name | Dropdown | Yes | skills name select | Multi select Skills | 1 Selection | 10 Selection |
| Profile Sidebar/Add & Edit Tools | Card View | Card | Yes | Display Add/Edit Tools details | Multi select Tools | N/A | N/A |
| Profile Sidebar/Add & Edit Tools | + Add Tools | Link button | Yes | Open Add Tools sidebar | Multi select Tools | N/A | N/A |
| Profile Sidebar/ Add Tools | Select Tool name | Dropdown | Yes | Tool name select | Select The tool the tool display as chips | 1 Selection | 10 Selection |
| Profile Sidebar/ Edit Tools | Select Tool name | Dropdown | Yes | Tool name select | Select The tool the tool display as chips | 1 Selection | 10 Selection |
| Profile Sidebar/Experience | Card View | Card | Yes | Display Experience details | Card View | N/A | N/A |
| Profile Sidebar/Experience | + Add Experience | Link button | Yes | Open Add Experience sidebar | Open Add Experience sidebar | N/A | N/A |
| Profile Sidebar/ Add Experiences | Designation | Dropdown | Yes | Designation select | Designation must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/ Add Experiences | Employer | Text | Yes | Enter the Employer | Employer may contain only letters, numbers, single spaces, and / & - . | 4 Characters | 50 Characters |
| Profile Sidebar/ Add Experiences | Work Location Type | Dropdown | Yes | Work Location Type select | Work Location Type must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/ Add Experiences | Employment Type | Dropdown | Yes | Employment Type select | Employment Type must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/ Add Experiences | Start Date | Date Picker | Yes | Select Date | Select date 1970 to current year date | Select any one date | Select any one date |
| Profile Sidebar/ Add Experiences | End Date | Date Picker | No | Select Date | Optional | N/A | N/A |
| Profile Sidebar/Experience | Edit Button | Button | Yes | Open Edit Experience sidebar | Open Edit Experience sidebar | N/A | N/A |
| Profile Sidebar/ Edit Experiences | Designation | Dropdown | Yes | Designation select | Designation must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/ Edit Experiences | Employer | Text | Yes | Enter the Employer | Only letters, spaces, numbers and special character (& - / .) | 4 Characters | 50 Characters |
| Profile Sidebar/ Edit Experiences | Work Location Type | Dropdown | Yes | Work Location Type select | Work Location Type must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/ Edit Experiences | Employment Type | Dropdown | Yes | Employment Type select | Employment Type must be selected(Drop down) | 1 Selection | 1 Selection |
| Profile Sidebar/ Edit Experiences | Start Date | Date Picker | Yes | Select Date | Select date 1970 to current year date | Select any one date | Select any one date |
| Profile Sidebar/ Edit Experiences | End Date | Date Picker | No | Select Date |  | N/A | N/A |
| Profile Sidebar/Work Preference | Portfolio Link | Text | Yes | Portfolio Link | Enter the Portfolio Link Portfolio Link, allow users to add links to GitHub, LinkedIn, or a personal website. | One profile web address | One profile web address |
| Profile Sidebar/Work Preference | Preferred Work Type | Dropdown | Yes | Preferred Work Type | Select The specific work type from the dropdown list | 1 Selection | 1 Selection |
| Profile Sidebar/Work Preference | Services Categories | Dropdown | Yes | Services Categories | Select The specific service category from the dropdown list | 1 Selection | 1 Selection |
| Profile Sidebar/Work Preference | Hourly/Fixed Rate Preference | Number | Yes | Hourly Rate | Enter the Hourly/Fixed Rate(Number only) | 1 number (Value should be > 0) | 5 number (Value should be > 0) |
| Profile Sidebar/Documents | Documents | File Upload | Yes | Edit & Delete docs | Only valid PDF format are allowed | 50 KB per upload | 350 KB per upload |