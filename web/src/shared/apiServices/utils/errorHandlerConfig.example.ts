/**
 * Example configuration for GlobalApiErrorHandler
 *
 * This file demonstrates how to set up path-based error message overrides.
 * You can create a similar file (errorHandlerConfig.ts) and import it in your
 * main application entry point to register custom error messages.
 *
 * @example
 * ```ts
 * // In main.tsx or App.tsx
 * import "./shared/apiServices/utils/errorHandlerConfig";
 * ```
 */

import { GlobalApiErrorHandler } from "./GlobalApiErrorHandler";

/**
 * Register path-based error message overrides
 *
 * These overrides will be checked when an error occurs, and if the error's
 * instance path contains the specified keyword, the custom message will be used.
 */
export function configureErrorHandling() {
  // Example 1: Simple path-based override with static message
  GlobalApiErrorHandler.registerPathOverride({
    pathKeyword: "users/exists",
    message: "This email or phone number is already registered.",
    statusCodes: [409], // Only apply for 409 status
  });

  // Example 2: Dynamic message using error response data
  GlobalApiErrorHandler.registerPathOverride({
    pathKeyword: "signup",
    message: (error) => {
      // Use detail if available, otherwise use a default message
      return error.detail || "Registration failed. Please try again.";
    },
  });

  // Example 3: Override for signin errors
  GlobalApiErrorHandler.registerPathOverride({
    pathKeyword: "signin",
    message: (error) => {
      if (error.status === 401) {
        return "Invalid credentials. Please check your email/phone and password.";
      }
      return error.detail || "Sign in failed. Please try again.";
    },
  });

  // Example 4: Override for OTP-related errors
  GlobalApiErrorHandler.registerPathOverride({
    pathKeyword: "otp",
    message: (error) => {
      if (error.status === 400) {
        return "Invalid OTP code. Please try again.";
      }
      if (error.status === 429) {
        return "Too many OTP requests. Please wait a moment before requesting again.";
      }
      return error.detail || "OTP verification failed. Please try again.";
    },
  });

  // Example 5: Override default status message
  GlobalApiErrorHandler.setDefaultStatusMessage(
    409,
    "This resource already exists. Please use a different value.",
  );

  // Example 6: Register multiple overrides at once
  GlobalApiErrorHandler.registerPathOverrides([
    {
      pathKeyword: "upload",
      message: "File upload failed. Please check the file size and format.",
      statusCodes: [400, 413],
    },
    {
      pathKeyword: "profile",
      message: (error) =>
        `Profile update failed: ${error.detail || "Please check your input."}`,
    },
  ]);
}

// Auto-configure when this module is imported
// Uncomment the line below if you want automatic configuration
// configureErrorHandling();
