export const UserRole = {
  ADMIN: "ADMIN",
  ENGINEER: "ENGINEER",
  CLIENT: "CLIENT",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
