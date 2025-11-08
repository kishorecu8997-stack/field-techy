# Field Validation Rules

| Page | Fields | Type | Required (Yes/No) | Rule | Validation Rule | Lower Limit | Upper Limit |
|------|---------|------|------------------|------|-----------------|--------------|--------------|
| Send Proposal | Job Description | Text | Yes | Required | Only letters, spaces, numbers and special characters such as / ( ) , . - # are allowed. | 50 Chars | 2000 Chars |
| Send Proposal | Expected Pay | Number Field | Yes | Required | Only digits | Cannot be null | Cannot be more than the amount offered in the posted job. |
| Send Proposal | Pay Type | Dropdown | Yes | Required | Select Pay Type must be selected (Drop down) | 1 Selection | 1 Selection |
| Send Proposal | Attachments | File Upload | Yes | Upload work sample, Resume | Only valid PDF, corrupted file format are allowed | 50 KB size | 350 KB |
| Send Proposal | Availability | Dropdown | Yes | Availability hours | Select availability hours from the drop down list. | 1 Selection | 1 Selection |
| Send Proposal | Screening questions | Text | Yes | Required | Only letters, spaces, numbers and special characters such as / ( ) , . - # are allowed. | 50 Chars | 2000 Chars |
| Update Status | Status | Dropdown | Yes | Select Status | Select bank must be selected (Drop down) | 1 Selection | 1 Selection |
| Update Status | Remark | Text | Yes | Required | Only letters, spaces, numbers and special characters such as / ( ) , . - # are allowed. | 50 Chars | 2000 Chars |
| Update Status | Work Screenshot | Upload | Yes | Required | Allow PDF, corrupted file | 50 KB size | 350 KB size |
| Report an Issue | Select Issue Category | Dropdown | Yes | Select Issue Category | Select Issue Category must be selected (Drop down) | 1 Selection | 1 Selection |
| Report an Issue | Select Priority Level | Dropdown | Yes | Select Priority Level | Select Priority Level must be selected (Drop down) | 1 Selection | 1 Selection |
| Report an Issue | Detailed Description | Text | Yes | Required | Only letters, spaces, numbers and special characters such as / ( ) , . - # are allowed. | 50 Chars | 2000 Chars |
| Report an Issue | Attach File | Upload | Yes | Required | Allow PDF, JPG, PNG, corrupted file | 50 KB size | 350 KB size |
| Submit Work | Work submission | Radio Button | Yes | Required | Select radio button (Yes, No) | 1 Selection | 1 Selection |
| Submit Work | Work submission | Upload completed task File | Yes | Required | Allow PDF, corrupted file | 50 KB size | 350 KB size |
| Submit Work | Work submission | Technician notes (if any) | Yes | Required | Only letters, spaces, numbers and special characters such as / ( ) , . - # are allowed. | 50 Chars | 2000 Chars |
| Submit Work | Work submission | Technician signature | Yes | Required | Allow JPG, JPEG, PNG format | 5 KB size | 350 KB size |
