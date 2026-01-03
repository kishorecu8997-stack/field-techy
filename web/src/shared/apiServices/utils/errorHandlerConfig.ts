/**
 * Error handler configuration for GlobalApiErrorHandler
 *
 * This file registers path-based error message overrides for various API endpoints.
 * Import this file in your main application entry point to activate the error handling.
 *
 * @example
 * ```ts
 * // In main.tsx
 * import "./shared/apiServices/utils/errorHandlerConfig";
 * ```
 */

import { GlobalApiErrorHandler } from "./GlobalApiErrorHandler";

/**
 * Configure error handling for authentication and other API endpoints
 */
export function configureErrorHandling() {
  // Client login error handling
  // Handles error format: {"message":"Invalid credentials","failedAttempts":1}
  GlobalApiErrorHandler.registerPathOverride({
    pathKeyword: "users/clt/signin",
    message: (error) => {
      // Use the message field if available (for the new error format)
      if (error.message) {
        return error.message;
      }
      // Fallback to detail or default message
      return error.detail || "Invalid credentials. Please check your email/phone and password.";
    },
    statusCodes: [401],
  });

  // Engineer login error handling
  // Handles error format: {"message":"Invalid credentials","failedAttempts":1}
  GlobalApiErrorHandler.registerPathOverride({
    pathKeyword: "users/eng/signin",
    message: (error) => {
      // Use the message field if available (for the new error format)
      if (error.message) {
        return error.message;
      }
      // Fallback to detail or default message
      return error.detail || "Invalid credentials. Please check your email/phone and password.";
    },
    statusCodes: [401],
  });

  // OTP request error handling
  GlobalApiErrorHandler.registerPathOverride({
    pathKeyword: "signin/req/otp",
    message: (error) => {
      return error.message || error.detail || "Failed to request OTP. Please try again.";
    },
  });

  // OTP verification error handling
  GlobalApiErrorHandler.registerPathOverride({
    pathKeyword: "signin/by-otp",
    message: (error) => {
      return error.message || error.detail || "OTP verification failed. Please try again.";
    },
  });
}

// Auto-configure when this module is imported
configureErrorHandling();

