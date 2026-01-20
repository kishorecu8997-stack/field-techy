# API Documentation - January 20, 2026

This document provides detailed information about the newly added API hooks for **Client Registration** and **Engineer Registration** using TanStack Query with OpenAPI generated SDK functions.

---

## Table of Contents

1. [Overview](#overview)
2. [Client Registration API](#client-registration-api)
   - [useRegisterClient Hook](#useregisterclient-hook)
   - [Request Body Schema](#client-request-body-schema)
   - [Response Schema](#client-response-schema)
   - [Usage Example](#client-usage-example)
3. [Engineer Registration API](#engineer-registration-api)
   - [useRegisterEngineer Hook](#useregisterengineer-hook)
   - [Request Body Schema](#engineer-request-body-schema)
   - [Response Schema](#engineer-response-schema)
   - [Usage Example](#engineer-usage-example)
4. [Error Handling](#error-handling)
5. [Type Definitions](#type-definitions)

---

## Overview

These APIs leverage **TanStack Query (React Query)** for state management and caching, wrapping the auto-generated OpenAPI SDK functions. They provide:

- ✅ Automatic cache invalidation on success
- ✅ Type-safe request/response handling
- ✅ Built-in loading and error states
- ✅ Configurable success/error callbacks

**Base URL Configuration:**
```typescript
const apiClient = createClient({
  baseUrl: import.meta.env.VITE_API_URL_NEW || "http://localhost:3000",
});
```

---

## Client Registration API

### `useRegisterClient` Hook

A TanStack Query mutation hook for registering new client accounts.

**Location:** `web/src/shared/apiServices/client/clientService.ts`

**API Endpoint:** `POST /auth/client/register`

#### Function Signature

```typescript
export function useRegisterClient(options?: {
  onSuccess?: (data: AppRegisterClientResponse) => void;
  onError?: (error: unknown) => void;
}): UseMutationResult<AppRegisterClientResponse, unknown, RegisterClientBody>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `object` | No | Configuration options for the mutation |
| `options.onSuccess` | `(data: AppRegisterClientResponse) => void` | No | Callback function executed on successful registration |
| `options.onError` | `(error: unknown) => void` | No | Callback function executed on registration failure |

---

### Client Request Body Schema

The `RegisterClientBody` type supports two client types: **Home** and **Corporate**.

#### Home Client Registration

```typescript
interface HomeClientBody {
  name: string;           // Required: Full name of the client
  phoneNumber: string;    // Required: Phone number with country code
  email: string;          // Required: Valid email address
  password: string;       // Required: Account password
  clientType: 'home';     // Required: Must be 'home'
  countryId?: number;     // Optional: Country lookup ID
  stateId?: number;       // Optional: State lookup ID
  cityId?: number;        // Optional: City lookup ID
  postalCode?: string;    // Optional: Postal/ZIP code
}
```

#### Corporate Client Registration

```typescript
interface CorporateClientBody {
  name: string;           // Required: Full name of contact person
  phoneNumber: string;    // Required: Phone number with country code
  email: string;          // Required: Valid email address
  password: string;       // Required: Account password
  clientType: 'corporate'; // Required: Must be 'corporate'
  countryId?: number;     // Optional: Country lookup ID
  stateId?: number;       // Optional: State lookup ID
  cityId?: number;        // Optional: City lookup ID
  postalCode?: string;    // Optional: Postal/ZIP code
  companyName: string;    // Required for corporate: Company name
  personName: string;     // Required for corporate: Contact person name
  address: string;        // Required for corporate: Business address
  industryId?: number;    // Optional: Industry lookup ID
  documentType?: string;  // Optional: Type of business document (e.g., VAT)
  documentNumber?: string; // Optional: Business document number
}
```

---

### Client Response Schema

```typescript
interface AppRegisterClientResponse {
  token: string;  // JWT authentication token
}
```

---

### Client Usage Example

```tsx
import { useRegisterClient, type RegisterClientBody } from '@/shared/apiServices/client/clientService';
import { useToast } from '@/shared/hooks/useToast';
import { useNavigate } from 'react-router-dom';

function ClientRegistrationForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const registerClientMutation = useRegisterClient({
    onSuccess: (data) => {
      // Store the JWT token
      localStorage.setItem('token', data.token);
      
      // Show success message
      showToast({
        type: 'success',
        message: 'Registration successful!',
      });
      
      // Navigate to dashboard
      navigate('/client/dashboard');
    },
    onError: (error) => {
      showToast({
        type: 'error',
        message: 'Registration failed. Please try again.',
      });
      console.error('Registration error:', error);
    },
  });

  const handleSubmit = (formData: RegisterClientBody) => {
    // Example for Home client
    const homeClientData: RegisterClientBody = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
      clientType: 'home',
      countryId: formData.countryId,
      stateId: formData.stateId,
      cityId: formData.cityId,
      postalCode: formData.postalCode,
    };

    registerClientMutation.mutate(homeClientData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={registerClientMutation.isPending}
      >
        {registerClientMutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

---

## Engineer Registration API

### `useRegisterEngineer` Hook

A TanStack Query mutation hook for registering new engineer accounts.

**Location:** `web/src/shared/apiServices/engineer/engineerService.ts`

**API Endpoint:** `POST /auth/engineer/register`

#### Function Signature

```typescript
export function useRegisterEngineer(options?: {
  onSuccess?: (data: AppRegisterEngineerResponse) => void;
  onError?: (error: unknown) => void;
}): UseMutationResult<AppRegisterEngineerResponse, unknown, RegisterEngineerBody>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `object` | No | Configuration options for the mutation |
| `options.onSuccess` | `(data: AppRegisterEngineerResponse) => void` | No | Callback function executed on successful registration |
| `options.onError` | `(error: unknown) => void` | No | Callback function executed on registration failure |

---

### Engineer Request Body Schema

```typescript
interface RegisterEngineerBody {
  name: string;               // Required: Full name of the engineer
  phoneNumber: string;        // Required: Phone number with country code
  email: string;              // Required: Valid email address
  password: string;           // Required: Account password
  address?: string;           // Optional: Residential address
  countryId?: number;         // Optional: Country lookup ID
  stateId?: number;           // Optional: State lookup ID
  cityId?: number;            // Optional: City lookup ID
  postalCode?: string;        // Optional: Postal/ZIP code
  skills?: Array<number>;     // Optional: Array of skill lookup IDs
  serviceCategoryId?: number; // Optional: Service category lookup ID
  hourlyRate?: number;        // Optional: Hourly rate in currency units
  portfolioLink?: string;     // Optional: URL to portfolio (can be empty string)
  currentDesignation?: string; // Optional: Current job title
  employer?: string;          // Optional: Current employer name
  yearsOfExperience?: number; // Optional: Years of professional experience
}
```

---

### Engineer Response Schema

```typescript
interface AppRegisterEngineerResponse {
  token: string;  // JWT authentication token
}
```

---

### Engineer Usage Example

```tsx
import { useRegisterEngineer, type RegisterEngineerBody } from '@/shared/apiServices/engineer/engineerService';
import { useToast } from '@/shared/hooks/useToast';
import { useNavigate } from 'react-router-dom';

function EngineerRegistrationForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const registerEngineerMutation = useRegisterEngineer({
    onSuccess: (data) => {
      // Store the JWT token
      localStorage.setItem('token', data.token);
      
      // Show success message
      showToast({
        type: 'success',
        message: 'Engineer registration successful!',
      });
      
      // Navigate to engineer dashboard
      navigate('/engineer/dashboard');
    },
    onError: (error) => {
      showToast({
        type: 'error',
        message: 'Registration failed. Please try again.',
      });
      console.error('Registration error:', error);
    },
  });

  const handleSubmit = (formData: RegisterEngineerBody) => {
    const engineerData: RegisterEngineerBody = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      countryId: formData.countryId,
      stateId: formData.stateId,
      cityId: formData.cityId,
      postalCode: formData.postalCode,
      skills: formData.skills,
      serviceCategoryId: formData.serviceCategoryId,
      hourlyRate: formData.hourlyRate,
      portfolioLink: formData.portfolioLink || '',
      currentDesignation: formData.currentDesignation,
      employer: formData.employer,
      yearsOfExperience: formData.yearsOfExperience,
    };

    registerEngineerMutation.mutate(engineerData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={registerEngineerMutation.isPending}
      >
        {registerEngineerMutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

---

## Error Handling

Both registration APIs return consistent error responses:

### Error Response Schema

```typescript
interface RegistrationError {
  error: string;  // Error message describing the failure
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Successful registration |
| `400` | Bad Request - Invalid input data |
| `401` | Unauthorized - Authentication failed |
| `500` | Internal Server Error - Server-side failure |

### Error Handling Example

```typescript
const registerMutation = useRegisterClient({
  onError: (error: unknown) => {
    // Type guard for API error response
    if (error && typeof error === 'object' && 'error' in error) {
      const apiError = error as { error: string };
      showToast({
        type: 'error',
        message: apiError.error,
      });
    } else {
      showToast({
        type: 'error',
        message: 'An unexpected error occurred',
      });
    }
  },
});
```

---

## Type Definitions

### Import Statements

```typescript
// Client Registration Types
import { 
  useRegisterClient, 
  type RegisterClientBody 
} from '@/shared/apiServices/client/clientService';

import type { 
  AppRegisterClientData, 
  AppRegisterClientResponse, 
  AppRegisterClientErrors 
} from '@/api';

// Engineer Registration Types
import { 
  useRegisterEngineer, 
  type RegisterEngineerBody 
} from '@/shared/apiServices/engineer/engineerService';

import type { 
  AppRegisterEngineerData, 
  AppRegisterEngineerResponse, 
  AppRegisterEngineerErrors 
} from '@/api';
```

### Mutation Return Type Reference

Both hooks return a `UseMutationResult` with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `mutate` | `(body: RegisterBody) => void` | Function to trigger the mutation |
| `mutateAsync` | `(body: RegisterBody) => Promise<Response>` | Async version returning a promise |
| `isPending` | `boolean` | `true` while mutation is in progress |
| `isSuccess` | `boolean` | `true` if mutation completed successfully |
| `isError` | `boolean` | `true` if mutation failed |
| `data` | `Response \| undefined` | Response data on success |
| `error` | `unknown` | Error object on failure |
| `reset` | `() => void` | Reset mutation state |

---

## Related Files

| File | Description |
|------|-------------|
| `web/src/shared/apiServices/client/clientService.ts` | Client API service hooks |
| `web/src/shared/apiServices/engineer/engineerService.ts` | Engineer API service hooks |
| `web/src/api/sdk.gen.ts` | Auto-generated OpenAPI SDK functions |
| `web/src/api/types.gen.ts` | Auto-generated TypeScript types |
| `web/src/api/client.ts` | API client configuration |

---

## Notes

1. **Cache Invalidation**: Both mutations automatically invalidate their respective query caches on success.
2. **Token Storage**: The returned JWT token should be stored securely (e.g., localStorage, httpOnly cookie) for subsequent authenticated requests.
3. **Field Validation**: Ensure all required fields are validated on the frontend before calling the mutation.
4. **Lookup IDs**: The `countryId`, `stateId`, `cityId`, `skills`, `serviceCategoryId`, and `industryId` fields reference lookup tables accessible via the `/lookup` endpoint.

---

*Documentation generated on: January 20, 2026*
