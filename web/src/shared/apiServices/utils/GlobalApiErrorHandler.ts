import { AxiosError } from "axios";

/**
 * Backend error response format
 *
 * Example:
 * {
 *   "type": "about:blank",
 *   "title": "Conflict",
 *   "status": 409,
 *   "detail": "Already in use.",
 *   "instance": "/api/v1/users/exists/testertesting070%2Bc1%40gmail.com"
 * }
 *
 * Alternative format:
 * {
 *   "message": "Invalid credentials",
 *   "failedAttempts": 1
 * }
 */
export interface ApiErrorResponse {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  message?: string;
  failedAttempts?: number;
}

/**
 * Configuration for path-based error message overrides
 */
export interface PathOverrideConfig {
  /**
   * Path keyword to match (e.g., "users/exists", "signup", "signin")
   * The handler will check if the error instance URL contains this keyword
   */
  pathKeyword: string;
  /**
   * Custom message to use for this path
   * Can be a function that receives the error response and returns a message
   */
  message: string | ((error: ApiErrorResponse) => string);
  /**
   * Optional: Only apply this override for specific status codes
   */
  statusCodes?: number[];
}

/**
 * GlobalApiErrorHandler
 *
 * Centralized error handling for API responses with support for:
 * - Path-based message overrides
 * - Status code-based default messages
 * - Extraction of messages from error response (detail, title, or fallback)
 * - Custom error handling logic
 */
export class GlobalApiErrorHandler {
  /**
   * Map of path keywords to custom error messages
   * Key: path keyword (e.g., "users/exists", "signup")
   * Value: custom message or function that returns a message
   */
  private static pathOverrides: Map<string, PathOverrideConfig> = new Map();

  /**
   * Default error messages for common HTTP status codes
   */
  private static defaultStatusMessages: Map<number, string> = new Map([
    [400, "Invalid request. Please check your inputs."],
    [401, "Unauthorized. Please check your credentials."],
    [403, "Forbidden. You are not authorized to access this resource."],
    [404, "Resource not found."],
    [409, "Resource already exists. Please try again with a different value."],
    [422, "Validation error. Please check your input data."],
    [429, "Too many requests. Please try again later."],
    [500, "Internal server error. Please try again later."],
    [502, "Bad gateway. Please try again later."],
    [503, "Service unavailable. Please try again later."],
    [504, "Gateway timeout. Please try again later."],
  ]);

  /**
   * Register a path-based error message override
   *
   * @param config - Configuration for the path override
   *
   * @example
   * ```ts
   * GlobalApiErrorHandler.registerPathOverride({
   *   pathKeyword: "users/exists",
   *   message: "This email or phone number is already registered.",
   *   statusCodes: [409]
   * });
   * ```
   *
   * @example
   * ```ts
   * GlobalApiErrorHandler.registerPathOverride({
   *   pathKeyword: "signup",
   *   message: (error) => `Registration failed: ${error.detail || "Please try again."}`,
   * });
   * ```
   */
  static registerPathOverride(config: PathOverrideConfig): void {
    this.pathOverrides.set(config.pathKeyword, config);
  }

  /**
   * Register multiple path overrides at once
   *
   * @param configs - Array of path override configurations
   */
  static registerPathOverrides(configs: PathOverrideConfig[]): void {
    configs.forEach((config) => this.registerPathOverride(config));
  }

  /**
   * Remove a path override
   *
   * @param pathKeyword - The path keyword to remove
   */
  static removePathOverride(pathKeyword: string): void {
    this.pathOverrides.delete(pathKeyword);
  }

  /**
   * Clear all path overrides
   */
  static clearPathOverrides(): void {
    this.pathOverrides.clear();
  }

  /**
   * Set a custom default message for a status code
   *
   * @param statusCode - HTTP status code
   * @param message - Default message for this status code
   */
  static setDefaultStatusMessage(statusCode: number, message: string): void {
    this.defaultStatusMessages.set(statusCode, message);
  }

  /**
   * Extract error message from API error response
   * Priority: path override > message > detail > title > status-based default > generic fallback
   *
   * @param errorResponse - The error response from the API
   * @param instancePath - The instance path from the error (for path-based overrides)
   * @returns The extracted error message
   */
  private static extractErrorMessage(
    errorResponse: ApiErrorResponse,
    instancePath?: string,
  ): string {
    const status = errorResponse.status;

    // Check for path-based override first
    if (instancePath) {
      for (const [pathKeyword, config] of this.pathOverrides.entries()) {
        if (instancePath.includes(pathKeyword)) {
          // Check if status code filter applies
          if (
            config.statusCodes &&
            status &&
            !config.statusCodes.includes(status)
          ) {
            continue;
          }

          // Apply the override
          if (typeof config.message === "function") {
            return config.message(errorResponse);
          }
          return config.message;
        }
      }
    }

    // Try to extract from error response fields
    // Priority: message > detail > title
    if (errorResponse.message) {
      return errorResponse.message;
    }

    if (errorResponse.detail) {
      return errorResponse.detail;
    }

    if (errorResponse.title) {
      return errorResponse.title;
    }

    // Fall back to status-based default message
    if (status && this.defaultStatusMessages.has(status)) {
      return this.defaultStatusMessages.get(status)!;
    }

    // Generic fallback
    return "An error occurred. Please try again later.";
  }

  /**
   * Handle API error and return a user-friendly error message
   *
   * @param error - The error object (can be AxiosError, Error, or unknown)
   * @param customFallback - Optional custom fallback message
   * @returns Error object with user-friendly message
   *
   * @example
   * ```ts
   * try {
   *   await axiosInstance.post('/api/signup', data);
   * } catch (error) {
   *   throw GlobalApiErrorHandler.handle(error);
   * }
   * ```
   */
  static handle(error: unknown, customFallback?: string): Error {
    // Handle AxiosError
    if (error instanceof AxiosError) {
      const errorResponse = error.response?.data as
        | ApiErrorResponse
        | undefined;
      const instancePath = errorResponse?.instance || error.config?.url;

      if (errorResponse) {
        const message = this.extractErrorMessage(errorResponse, instancePath);
        return new Error(message);
      }

      // Handle network errors
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        return new Error(
          "Request timeout. Please check your connection and try again.",
        );
      }

      if (error.code === "ERR_NETWORK" || !error.response) {
        return new Error(
          "Network error. Please check your connection and try again.",
        );
      }

      // Fallback for AxiosError without response data
      const status = error.response?.status;
      if (status && this.defaultStatusMessages.has(status)) {
        return new Error(this.defaultStatusMessages.get(status)!);
      }
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return error;
    }

    // Handle generic objects (e.g. from fetch/hey-api)
    if (typeof error === "object" && error !== null) {
      const errorResponse = error as ApiErrorResponse;
      if (errorResponse.message || errorResponse.detail || errorResponse.title) {
        const message = this.extractErrorMessage(errorResponse, errorResponse.instance);
        return new Error(message);
      }
    }

    // Handle unknown error types
    return new Error(
      customFallback || "An unknown error occurred. Please try again later.",
    );
  }

  /**
   * Handle API error and throw immediately
   * Useful for adapters that want to throw errors directly
   *
   * @param error - The error object (can be AxiosError, Error, or unknown)
   * @param customFallback - Optional custom fallback message
   * @throws {Error} Always throws an Error with user-friendly message
   *
   * @example
   * ```ts
   * try {
   *   return await axiosInstance.post('/api/signup', data);
   * } catch (error) {
   *   GlobalApiErrorHandler.handleAndThrow(error);
   * }
   * ```
   */
  static handleAndThrow(error: unknown, customFallback?: string): never {
    throw this.handle(error, customFallback);
  }

  /**
   * Check if an error should be treated as a valid response (not an error)
   * Useful for cases like 409 Conflict that might be expected in some contexts
   *
   * @param error - The error object
   * @param allowedStatusCodes - Array of status codes that should be treated as valid
   * @returns The error response data if it's an allowed status, null otherwise
   *
   * @example
   * ```ts
   * try {
   *   return await axiosInstance.get('/api/users/exists/email');
   * } catch (error) {
   *   const validResponse = GlobalApiErrorHandler.getValidResponse(error, [409]);
   *   if (validResponse) {
   *     return validResponse;
   *   }
   *   throw GlobalApiErrorHandler.handle(error);
   * }
   * ```
   */
  static getValidResponse<T = unknown>(
    error: unknown,
    allowedStatusCodes: number[],
  ): T | null {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status && allowedStatusCodes.includes(status)) {
        return error.response?.data as T;
      }
    }
    return null;
  }
}
