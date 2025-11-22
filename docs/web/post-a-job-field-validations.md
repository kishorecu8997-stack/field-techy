# Post a Job Field Validations

This document outlines all the field validations implemented in the Post a Job form components for each job type: Dedicated Service, Scheduled Service, and Dispatch Service.

## Common Fields (All Job Types)

### Basic Information Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Project Name | Only for Dedicated Service | Uses `validateName` function: No leading/trailing spaces, no consecutive spaces, alphabetic characters and single spaces only, max 10 spaces, 2-50 characters |
| Job Name | Yes | Uses `validateName` function: No leading/trailing spaces, no consecutive spaces, alphabetic characters and single spaces only, max 10 spaces, 2-50 characters |
| Job Title | Yes | Uses `validateName` function: No leading/trailing spaces, no consecutive spaces, alphabetic characters and single spaces only, max 10 spaces, 2-50 characters |

### Location Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Location Type | Yes | Must select either "remote" or "onsite" |

### Requirements Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Experience Level | Yes | Must select from predefined experience level options |
| Number of Persons Required | No | Input mode: Number |
| Skills | Yes | Must select at least one skill from the available options |
| Tools | Yes | Must select at least one tool from the available options |
| Task | Yes (only for Scheduled and Dispatch Service types) | Must select from predefined task options |
| Safety Wears | No | Optional selection from safety wear options |
| Description | Yes | Uses `validateDescription` function: 5-2000 characters, no leading/trailing spaces, no consecutive spaces, no XSS content |

### Language Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Primary Language | Yes | Must select from available language options, cannot be same as Secondary Language |
| Secondary Language | Yes | Must select from available language options, cannot be same as Primary Language |

### Other Details Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Additional Details | Yes | Uses `validateDescription` function: 50-2000 characters, no leading/trailing spaces, no consecutive spaces, no XSS content |
| Additional Attachments | No | Accepts only .pdf, .jpg, .png file formats |

## Dedicated Service Fields

### Dedicated Service Scheduling Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Tentative Start Date | Yes | Date must not be in the past, must be before Tentative End Date |
| Tentative End Date | Yes | Date must not be in the past, must be after Tentative Start Date |
| Application End Date | Yes | Date must not be in the past, must be before Tentative Start Date |
| Application End Time | Yes | No specific validation beyond required field |
| Job Duration | Yes | Calculated from Tentative Start and End Dates |

### Backfill Engineer Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Backfill Engineer | No | Options: "Required" or "Not Required" |

### Budget Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Estimated Budget | Yes | Uses `validateAmount` function: 2-5 digits, digits only, no spaces |

## Scheduled Service Fields

### Scheduled Service Scheduling Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Job Occurrence Type | Yes | Must select either "repeat" or "custom" |
| Repeated By | Yes (for repeat occurrence) | Must select from options (everyWeek, everyMonth, everyYear) |
| Start Date | Yes (for repeat occurrence) | Must not be in the past, must be before End Date |
| Start Time | Yes (for repeat occurrence) | Required and must be before End Time |
| End Time | Yes (for repeat occurrence) | Required and must be after Start Time |
| Repeat On (Date of month) | Yes (for monthly repeat) | Required selection from ordinal list (1st to 31st) |
| Repeat Year | Yes (for yearly repeat) | Required selection from month list |
| Job Occurrence End Type | Yes | Must select either "onDate" or "afterDate" |
| Job Occurrence End Date | Yes (for "onDate" type) | Required and must not be in the past |
| After (Number of Occurrences) | Yes (for "afterDate" type) | Required number input |
| Custom Start Date | Yes (for custom occurrence) | Must not be in the past, must be before End Date |
| Custom Start Time | Yes (for custom occurrence) | Must be before End Time |
| Custom End Date | Yes (for custom occurrence) | Must not be in the past, must be after Start Date |
| Custom End Time | Yes (for custom occurrence) | Must be after Start Time |

## Dispatch Service Fields

### Dispatch Service Scheduling Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Start Date | Yes | Must not be in the past, must be before End Date |
| Start Time | Yes | Must be before End Time |
| End Date | Yes | Must not be in the past, must be after Start Date |
| End Time | Yes | Must be after Start Time |
| Estimated Duration | Yes | No specific validation beyond required field |

### Template Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Save As Template | No | Checkbox field |
| Template Name | Yes (when Save As Template is checked) | No specific validation beyond required field |

## Client Interview Fields

### Client Information Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| First Name | Yes | Uses `validateName` function: No leading/trailing spaces, no consecutive spaces, alphabetic characters and single spaces only, max 10 spaces, 2-50 characters |
| Last Name | Yes | Uses `validateName` function: No leading/trailing spaces, no consecutive spaces, alphabetic characters and single spaces only, max 10 spaces, 2-50 characters |
| Email | Yes | Uses `validateEmail` function: Standard email format validation |
| Phone | Yes | Uses `validatePhone` function: Phone number format validation |

### Interview Schedule Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| Start Date | Yes | Date picker with required field validation |
| Start Time | Yes | Time picker with required field validation |

## Point of Contact Fields

### Contact Information Fields

| Field Name | Required | Validation Rules |
|------------|----------|------------------|
| First Name | Yes | Uses `validateName` function: No leading/trailing spaces, no consecutive spaces, alphabetic characters and single spaces only, max 10 spaces, 2-50 characters |
| Last Name | Yes | Uses `validateName` function: No leading/trailing spaces, no consecutive spaces, alphabetic characters and single spaces only, max 10 spaces, 2-50 characters |
| Email | Yes | Uses `validateEmail` function: Standard email format validation |
| Phone | Yes | Uses `validatePhone` function: Phone number format validation |
| Contact Type | Yes | Required selection from available options |