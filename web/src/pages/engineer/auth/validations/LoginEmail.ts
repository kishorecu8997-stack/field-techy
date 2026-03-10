import { loginSchema as baseSchema } from "@/shared/types/auth";
import { z } from "zod";

/**
 * Zod schema for the Login form.
 * Extends the shared schema with engineer-specific fields.
 */
export const loginSchema = baseSchema.extend({
  userRole: z.enum(["engineer", "customer"]).optional(),
});

export type LoginEmailFormData = z.infer<typeof loginSchema>;
