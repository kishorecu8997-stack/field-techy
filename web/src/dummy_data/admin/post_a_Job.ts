import type { ClientFieldsTypes } from "@/pages/client/post_job/types";

export const interviewerData: ClientFieldsTypes[] = [
  {
    id: 1,
    firstName: "Ram",
    lastName: "Risi",
    email: "ramrisi@xyz.in",
    mobile: "+91 9876543210",
    startDate: new Date("2025-11-01"),
    startTime: "01:00",
  },
  {
    id: 2,
    firstName: "grish",
    lastName: "kumar",
    email: "grish@gmail.com",
    mobile: "+91 9876543210",
    startDate: new Date("2025-12-01"),
    startTime: "12:00",
  },
];

export const pointOfContactData = [
  {
    id: 1,
    firstName: "Ram",
    lastName: "Risi",
    email: "ramrisi@xyz.in",
    mobile: "+91 9876543210",
    contactType: "Primary",
  },
  {
    id: 2,
    firstName: "grish",
    lastName: "kumar",
    email: "grish@gmail.com",
    mobile: "+91 9876543210",
    contactType: "Primary",
  },
];
