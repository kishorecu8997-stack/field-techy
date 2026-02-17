import { z } from "zod";

/**
 * Configuration schema using Zod.
 * Ensures all required configuration values are present and valid.
 */
const configSchema = z.object({
  apiUrl: z.url({ error: "Invalid API URL" }),
  tokenExpirationDuration: z
    .number()
    .positive("Token expiration duration must be positive"),
  firebase: z.object({
    apiKey: z.string().min(1, "Firebase API Key is required"),
    authDomain: z.string().min(1, "Firebase Auth Domain is required"),
    projectId: z.string().min(1, "Firebase Project ID is required"),
    storageBucket: z.string().min(1, "Firebase Storage Bucket is required"),
    messagingSenderId: z
      .string()
      .min(1, "Firebase Messaging Sender ID is required"),
    appId: z.string().min(1, "Firebase App ID is required"),
    vapidKey: z.string().min(1, "Firebase VAPID Key is required"),
  }),
});

export type AppConfig = z.infer<typeof configSchema>;
export type AppConfigKey = keyof AppConfig;

/**
 * Raw configuration object.
 * Values are sourced from environment variables or hardcoded fallbacks.
 *
 * @todo Move hardcoded values to environment variables (.env)
 */
const rawConfig: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL_NEW || import.meta.env.VITE_API_URL || "",
  tokenExpirationDuration: import.meta.env.VITE_TOKEN_EXPIRATION_DURATION
    ? Number(import.meta.env.VITE_TOKEN_EXPIRATION_DURATION)
    : 60 * 60 * 1000, // Default: 1 hour in milliseconds
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain:
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
      "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
      "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
      "YOUR_MESSAGING_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
    vapidKey: import.meta.env.VITE_VAPID_KEY || "YOUR_VAPID_KEY",
  },
};

/**
 * Parse and validate the configuration.
 * This will throw an error (and crash the app) if validation fails.
 */
let config: z.infer<typeof configSchema>;

try {
  config = configSchema.parse(rawConfig);
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    const missingFields = error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("\n");
    const errorMessage = `Configuration validation failed:\n${missingFields}`;
    console.error(errorMessage);
    alert(errorMessage); // Alert the user as requested
    throw new Error(errorMessage);
  }
  throw error;
}

export { config };
