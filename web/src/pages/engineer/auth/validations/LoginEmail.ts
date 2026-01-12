import { z } from "zod";
import xss from "xss";

/**
 * Zod schema for the Login form.
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

export type LoginEmailFormData = z.infer<typeof loginSchema>;
