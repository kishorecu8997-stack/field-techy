# GlobalApiErrorHandler

A centralized error handling system for API responses with support for path-based message overrides and flexible error message extraction.

## Features

- **Path-based overrides**: Custom error messages based on API endpoint paths
- **Status code defaults**: Pre-configured messages for common HTTP status codes
- **Flexible message extraction**: Automatically extracts messages from `detail`, `title`, or falls back to defaults
- **Type-safe**: Full TypeScript support with proper error response types
- **Extensible**: Easy to add custom overrides and status code messages

## Backend Error Response Format

The handler expects errors in the following format (all fields are optional):

```json
{
  "type": "about:blank",
  "title": "Conflict",
  "status": 409,
  "detail": "Already in use.",
  "instance": "/api/v1/users/exists/testertesting070%2Bc1%40gmail.com"
}
```

## Basic Usage

### In Adapters

Replace your existing error handling with the global handler:

```typescript
import { GlobalApiErrorHandler } from "../utils";

export class MyAdapter {
  static async someMethod() {
    try {
      const response = await axiosInstance.post("/api/endpoint", data);
      return response.data;
    } catch (error) {
      // This will extract the best message and throw it
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
}
```

### Getting Error Messages (Without Throwing)

If you need to handle the error yourself:

```typescript
try {
  await axiosInstance.post("/api/endpoint", data);
} catch (error) {
  const errorMessage = GlobalApiErrorHandler.handle(error);
  // errorMessage is an Error object with a user-friendly message
  console.error(errorMessage.message);
}
```

## Path-Based Overrides

Register custom error messages for specific API endpoints:

```typescript
import { GlobalApiErrorHandler } from "./GlobalApiErrorHandler";

// Simple static message
GlobalApiErrorHandler.registerPathOverride({
  pathKeyword: "users/exists",
  message: "This email or phone number is already registered.",
  statusCodes: [409], // Optional: only apply for specific status codes
});

// Dynamic message using error response
GlobalApiErrorHandler.registerPathOverride({
  pathKeyword: "signup",
  message: (error) => {
    return error.detail || "Registration failed. Please try again.";
  },
});

// Register multiple at once
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
```

## Message Priority

The handler extracts error messages in the following priority order:

1. **Path-based override** (if instance path matches a registered keyword)
2. **Error response `detail`** field
3. **Error response `title`** field
4. **Status code default message** (from pre-configured defaults)
5. **Generic fallback** message

## Default Status Code Messages

Pre-configured messages for common HTTP status codes:

- `400`: "Invalid request. Please check your inputs."
- `401`: "Unauthorized. Please check your credentials."
- `403`: "Forbidden. You are not authorized to access this resource."
- `404`: "Resource not found."
- `409`: "Resource already exists. Please try again with a different value."
- `422`: "Validation error. Please check your input data."
- `429`: "Too many requests. Please try again later."
- `500`: "Internal server error. Please try again later."
- `502`: "Bad gateway. Please try again later."
- `503`: "Service unavailable. Please try again later."
- `504`: "Gateway timeout. Please try again later."

### Customizing Default Messages

```typescript
GlobalApiErrorHandler.setDefaultStatusMessage(
  409,
  "This resource already exists. Please use a different value.",
);
```

## Handling Valid Error Responses

Some endpoints may return error status codes (like 409) as valid responses. Use `getValidResponse` to handle these cases:

```typescript
import { GlobalApiErrorHandler } from "../utils";

export class UserAdapter {
  static async exists(emailOrPhone: string) {
    try {
      const response = await axiosInstance.get(
        `/api/users/exists/${emailOrPhone}`,
      );
      return response.data;
    } catch (error) {
      // 409 is a valid response for this endpoint (email/phone already exists)
      const validResponse = GlobalApiErrorHandler.getValidResponse(
        error,
        [409],
      );
      if (validResponse) {
        return validResponse;
      }
      // For other errors, throw with proper message
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
}
```

## Configuration

Create a configuration file (e.g., `errorHandlerConfig.ts`) and import it in your main application entry point:

```typescript
// errorHandlerConfig.ts
import { GlobalApiErrorHandler } from "./GlobalApiErrorHandler";

export function configureErrorHandling() {
  GlobalApiErrorHandler.registerPathOverride({
    pathKeyword: "users/exists",
    message: "This email or phone number is already registered.",
    statusCodes: [409],
  });

  // ... more overrides
}

// Auto-configure when imported
configureErrorHandling();
```

```typescript
// main.tsx
import "./shared/apiServices/utils/errorHandlerConfig";
// ... rest of your app
```

## API Reference

### `GlobalApiErrorHandler.handle(error, customFallback?)`

Handles an error and returns an Error object with a user-friendly message.

**Parameters:**

- `error`: The error object (AxiosError, Error, or unknown)
- `customFallback`: Optional custom fallback message

**Returns:** `Error` object with user-friendly message

### `GlobalApiErrorHandler.handleAndThrow(error, customFallback?)`

Handles an error and throws it immediately. Useful for adapters.

**Parameters:**

- `error`: The error object (AxiosError, Error, or unknown)
- `customFallback`: Optional custom fallback message

**Throws:** Always throws an Error with user-friendly message

### `GlobalApiErrorHandler.getValidResponse<T>(error, allowedStatusCodes)`

Checks if an error should be treated as a valid response.

**Parameters:**

- `error`: The error object
- `allowedStatusCodes`: Array of status codes that should be treated as valid

**Returns:** The error response data if it's an allowed status, `null` otherwise

### `GlobalApiErrorHandler.registerPathOverride(config)`

Register a path-based error message override.

**Parameters:**

- `config`: PathOverrideConfig object with pathKeyword, message, and optional statusCodes

### `GlobalApiErrorHandler.registerPathOverrides(configs)`

Register multiple path overrides at once.

**Parameters:**

- `configs`: Array of PathOverrideConfig objects

### `GlobalApiErrorHandler.setDefaultStatusMessage(statusCode, message)`

Set a custom default message for a status code.

**Parameters:**

- `statusCode`: HTTP status code
- `message`: Default message for this status code

### `GlobalApiErrorHandler.removePathOverride(pathKeyword)`

Remove a path override.

**Parameters:**

- `pathKeyword`: The path keyword to remove

### `GlobalApiErrorHandler.clearPathOverrides()`

Clear all path overrides.

## Migration Guide

### Before (Old Pattern)

```typescript
export class ClientAdapter {
  private static handleApiError(error: unknown): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error("Unauthorized. Please check your credentials.");
      }
      // ... more status codes
    }
    throw new Error("An unknown error occurred.");
  }

  static async signup(data: ClientData) {
    try {
      const response = await axiosInstance.post(
        CLIENT_ROUTER_PATHS.SIGNUP,
        data,
      );
      return response.data;
    } catch (error) {
      ClientAdapter.handleApiError(error);
    }
  }
}
```

### After (New Pattern)

```typescript
import { GlobalApiErrorHandler } from "../utils";

export class ClientAdapter {
  static async signup(data: ClientData) {
    try {
      const response = await axiosInstance.post(
        CLIENT_ROUTER_PATHS.SIGNUP,
        data,
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
}
```

## Examples

See `errorHandlerConfig.example.ts` for comprehensive examples of setting up path-based overrides.
