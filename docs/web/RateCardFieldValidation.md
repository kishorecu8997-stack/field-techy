# Input Validation Rules

This document outlines the input fields and their validation rules used across the **Rate Card Form** components.  
All validations are handled using **React Hook Form**.

---

## Rate Card Form Fields

| Field Name            | Label                  | Type   | Required    | Validation Rules / Notes                                  | Example Value           |
| --------------------- | ---------------------- | ------ | ----------- | --------------------------------------------------------- | ----------------------- |
| `rateType`            | Rate Card Type         | Select | Yes         | Must select one of the predefined rate types              | `masterRateCard`        |
| `clientName`          | Client Name            | Select | Conditional | Required if `rateType` = `clientSpecificRateCard`         | `client1`               |
| `projectName`         | Project Name           | Select | Conditional | Required if `rateType` = `projectSpecificRateCard`        | `project1`              |
| `clientNameOfProject` | Client Name of Project | Select | Conditional | Required if `rateType` = `projectSpecificRateCard`        | `client2`               |
| `region`              | Region                 | Select | Conditional | Required if `rateType` = `projectSpecificRateCard`        | `region1`               |
| `country`             | Country                | Select | Yes         | Must select from available country options                | `country1`              |
| `skills`              | Skills / Tiers         | Array  | Yes         | Must include at least one skill with valid tier structure | `[{ name: "Skill 1" }]` |

---

## Pricing Model Fields

| Field Name | Label         | Type   | Required | Validation Rules / Notes         |
| ---------- | ------------- | ------ | -------- | -------------------------------- |
| `hourly`   | Hourly Rate   | Number | Yes      | Must be a positive numeric value |
| `halfDay`  | Half-Day Rate | Number | Yes      | Must be a positive numeric value |
| `fullDay`  | Full-Day Rate | Number | Yes      | Must be a positive numeric value |
| `weekly`   | Weekly Rate   | Number | Yes      | Must be a positive numeric value |
| `monthly`  | Monthly Rate  | Number | Yes      | Must be a positive numeric value |
