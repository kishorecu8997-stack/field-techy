export const UserRole = {
  ADMIN: "admin",
  ENGINEER: "engineer",
  CLIENT: "client",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
