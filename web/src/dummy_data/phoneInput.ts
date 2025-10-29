/**
 * @file Centralized constants for phone input components.
 *
 * This file contains shared data structures, such as the list of supported
 * countries, to ensure consistency across different phone input fields.
 */

import type { Country } from "@/shared/components/commonUI/inputs/type";

export const PHONE_COUNTRIES: Country[] = [
  {
    code: "+91",
    name: "India",
    flag: "https://flagcdn.com/w40/in.png",
    validationKey: "india",
  },
  {
    code: "+44",
    name: "UK",
    flag: "https://flagcdn.com/w40/gb.png",
    validationKey: "uk",
  },
];
