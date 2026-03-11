import { z } from "zod";
import xss from "xss";

/**
 * Shared Zod schema for the Login form.
 * Contains common fields used by both client and engineer portals.
 */
export const loginSchema = z.object({
  email: z
    .email({ error: "Invalid email address" })
    .transform((arg) => xss(arg)),
  password: z
    .string()
    .min(1, "Password is required")
    .transform((arg) => xss(arg)),
  rememberMe: z.boolean().optional(),
});

/**
 * Shared type for Login form data.
 */
export type LoginEmailFormData = z.infer<typeof loginSchema>;
