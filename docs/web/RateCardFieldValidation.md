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

| Field Name    | Label         | Required | Validation Rules (matches actual cascading logic)                                                                                                                                                           |
| ------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`hourly`**  | Hourly Rate   | Yes      | - Must be numeric<br> - Must not be zero<br> - No spaces<br> - Up to 2 decimals<br> - **First step — no relational dependencies**                                                                           |
| **`halfDay`** | Half-Day Rate | Yes      | - Must be numeric<br> - Must not be zero<br> - No spaces<br> - Up to 2 decimals<br> - **Must be ≥ Hourly × 4**<br> - Hourly must be entered first                                                           |
| **`fullDay`** | Full-Day Rate | Yes      | - Must be numeric<br> - Must not be zero<br> - No spaces<br> - Up to 2 decimals<br> - **Must be ≥ Hourly × 8**<br> - **Must be ≥ Half-Day × 2**<br> - Hourly & Half-Day must be entered first               |
| **`weekly`**  | Weekly Rate   | Yes      | - Must be numeric<br> - Must not be zero<br> - No spaces<br> - Up to 2 decimals<br> - **Must be ≥ Hourly × 8 × 5**<br> - **Must be ≥ Half-Day × 2 × 5**<br> - **Must be ≥ Full-Day × 5**<br> - All previous rates must be entered first |
| **`monthly`** | Monthly Rate  | Yes      | - Must be numeric<br> - Must not be zero<br> - No spaces<br> - Up to 2 decimals<br> - **Must be > Hourly × 3**<br> - **Must be ≥ Half-Day × 2 × 5 × 4**<br> - **Must be ≥ Full-Day × 5 × 4**<br> - **Must be ≥ Weekly × 4**<br> - All previous rates must be entered first |

---
