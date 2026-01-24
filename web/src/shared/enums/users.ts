export const UserRole = {
  ADMIN: "admin",
  ENGINEER: "ENGINEER",
  CLIENT: "CLIENT",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
