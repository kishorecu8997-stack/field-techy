# API Documentation - January 20, 2026

This document provides detailed information about the newly added API hooks for **Client Registration**, **Engineer Registration**, and **OTP Verification** using TanStack Query with OpenAPI generated SDK functions.

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
4. [OTP Verification APIs](#otp-verification-apis)
   - [useSendOtp Hook](#usesendotp-hook)
   - [useVerifyOtp Hook](#useverifyotp-hook)
   - [OTP Request/Response Schemas](#otp-requestresponse-schemas)
   - [OTP Usage Example](#otp-usage-example)
5. [Error Handling](#error-handling)
6. [Type Definitions](#type-definitions)

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
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
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
import { useClientRegistrationStore } from '@/shared/store/useClientRegistrationStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ClientRegistrationForm() {
  const navigate = useNavigate();
  const { setToken, markStepCompleted } = useClientRegistrationStore();
  
  const registerClientMutation = useRegisterClient({
    onSuccess: (result) => {
      console.log("Signup successful:", result);
      
      // Store the JWT token for OTP verification
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
        setToken(result.token);  // Store in registration store for OTP APIs
      }
      
      toast.success("Registration successful!");
      markStepCompleted(4);
      navigate('/client/auth/verification');  // Navigate to OTP verification
    },
    onError: (error) => {
      toast.error("Registration failed. Please try again.");
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
import { useEngineerRegistrationStore } from '@/shared/store/useEngineerRegistrationStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function EngineerRegistrationForm() {
  const navigate = useNavigate();
  const { setToken, markStepCompleted } = useEngineerRegistrationStore();
  
  const registerEngineerMutation = useRegisterEngineer({
    onSuccess: (result) => {
      console.log("Signup successful:", result);
      
      // Store the JWT token for OTP verification
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
        setToken(result.token);  // Store in registration store for OTP APIs
      }
      
      toast.success("Registration successful!");
      markStepCompleted(3);
      navigate('/engineer/auth/verification');  // Navigate to OTP verification
    },
    onError: (error) => {
      toast.error("Registration failed. Please try again.");
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

## OTP Verification APIs

These APIs are used to send and verify OTP codes for email and phone number verification after registration.

### `useSendOtp` Hook

A TanStack Query mutation hook for sending OTP codes to the user's email or phone.

**Location:** `web/src/shared/apiServices/engineer/engineerService.ts`

**API Endpoint:** `POST /auth/otp/send`

#### Function Signature

```typescript
export function useSendOtp(options?: {
  onSuccess?: (data: AppSendOtpResponse) => void;
  onError?: (error: unknown) => void;
}): UseMutationResult<AppSendOtpResponse, unknown, { type: SendOtpType; token: string }>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `object` | No | Configuration options for the mutation |
| `options.onSuccess` | `(data: AppSendOtpResponse) => void` | No | Callback function executed when OTP is sent successfully |
| `options.onError` | `(error: unknown) => void` | No | Callback function executed on failure |

#### Mutation Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `'email' \| 'phone'` | Yes | Type of OTP to send |
| `token` | `string` | Yes | JWT token from registration response |

---

### `useVerifyOtp` Hook

A TanStack Query mutation hook for verifying OTP codes entered by the user.

**Location:** `web/src/shared/apiServices/engineer/engineerService.ts`

**API Endpoint:** `POST /auth/otp/verify`

#### Function Signature

```typescript
export function useVerifyOtp(options?: {
  onSuccess?: (data: AppVerifyOtpResponse) => void;
  onError?: (error: unknown) => void;
}): UseMutationResult<AppVerifyOtpResponse, unknown, { type: SendOtpType; code: string; token: string }>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `object` | No | Configuration options for the mutation |
| `options.onSuccess` | `(data: AppVerifyOtpResponse) => void` | No | Callback function executed when OTP is verified successfully |
| `options.onError` | `(error: unknown) => void` | No | Callback function executed on failure |

#### Mutation Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `'email' \| 'phone'` | Yes | Type of OTP being verified |
| `code` | `string` | Yes | OTP code entered by the user |
| `token` | `string` | Yes | JWT token from registration response |

---

### OTP Request/Response Schemas

#### Send OTP Request Body

```typescript
interface SendOtpRequest {
  type: 'email' | 'phone';  // Type of verification
}

// Headers (required)
{
  authorization: `Bearer ${token}`  // JWT from registration
}
```

#### Verify OTP Request Body

```typescript
interface VerifyOtpRequest {
  type: 'email' | 'phone';  // Type of verification
  code: string;             // OTP code entered by user
}

// Headers (required)
{
  authorization: `Bearer ${token}`  // JWT from registration
}
```

#### OTP Response Schemas

```typescript
// Send OTP Response
interface AppSendOtpResponse {
  message: string;  // Success message (e.g., "OTP sent successfully")
}

// Verify OTP Response
interface AppVerifyOtpResponse {
  message: string;  // Success message (e.g., "OTP verified successfully")
}
```

---

### OTP Usage Example

```tsx
import { useState, useEffect } from 'react';
import { 
  useSendOtp, 
  useVerifyOtp, 
  type SendOtpType 
} from '@/shared/apiServices/engineer/engineerService';
import { useEngineerRegistrationStore } from '@/shared/store/useEngineerRegistrationStore';
import { toast } from 'react-toastify';

interface VerificationCardProps {
  type: 'email' | 'phone';
  contact: string;
  isVerified: boolean;
  onVerifySuccess: () => void;
  token: string | null;
}

function VerificationCard({ 
  type, 
  contact, 
  isVerified, 
  onVerifySuccess, 
  token 
}: VerificationCardProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Initialize OTP hooks
  const { mutateAsync: sendOtp, isPending: isSending } = useSendOtp();
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSendOtp = async () => {
    if (!token) {
      toast.error('Authorization token not found. Please register again.');
      return;
    }

    try {
      const otpType: SendOtpType = type;
      await sendOtp({ type: otpType, token });
      toast.success(`OTP sent to ${type === 'email' ? 'email' : 'mobile'}`);
      setIsOtpSent(true);
      setTimeLeft(60);  // 60 second cooldown
    } catch (error) {
      toast.error(`Failed to send ${type === 'email' ? 'email' : 'mobile'} OTP`);
    }
  };

  const handleVerifyOtp = async () => {
    if (!token) {
      toast.error('Authorization token not found. Please register again.');
      return;
    }

    try {
      const otpType: SendOtpType = type;
      await verifyOtp({ type: otpType, code: otpCode, token });
      toast.success(`${type === 'email' ? 'Email' : 'Mobile number'} verified successfully`);
      onVerifySuccess();
    } catch (error) {
      toast.error(`Invalid ${type === 'email' ? 'Email' : 'Mobile'} OTP`);
    }
  };

  const isPending = isSending || isVerifying;

  if (isVerified) {
    return <div className="text-green-500">✓ Verified</div>;
  }

  return (
    <div className="verification-card">
      <h3>{type === 'email' ? 'Email' : 'Mobile'} Verification</h3>
      <p>{contact}</p>
      
      {!isOtpSent ? (
        <button onClick={handleSendOtp} disabled={isPending}>
          {isSending ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
          />
          
          <div className="timer">
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : (
              <button onClick={handleSendOtp} disabled={isPending}>
                Resend
              </button>
            )}
          </div>
          
          <button onClick={handleVerifyOtp} disabled={isPending || !otpCode}>
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
        </>
      )}
    </div>
  );
}

// Usage in parent component
function ContactVerification() {
  const { email, phone, token } = useEngineerRegistrationStore();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  return (
    <div>
      <VerificationCard
        type="email"
        contact={email}
        isVerified={isEmailVerified}
        onVerifySuccess={() => setIsEmailVerified(true)}
        token={token}
      />
      
      <VerificationCard
        type="phone"
        contact={phone}
        isVerified={isPhoneVerified}
        onVerifySuccess={() => setIsPhoneVerified(true)}
        token={token}
      />
    </div>
  );
}
```

---

## Error Handling

All APIs return consistent error responses:

### Error Response Schema

```typescript
interface ApiError {
  error: string;  // Error message describing the failure
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Successful operation |
| `400` | Bad Request - Invalid input data |
| `401` | Unauthorized - Invalid or missing JWT token |
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

// OTP Types
import {
  useSendOtp,
  useVerifyOtp,
  type SendOtpType
} from '@/shared/apiServices/engineer/engineerService';

import type {
  AppSendOtpData,
  AppSendOtpResponse,
  AppSendOtpErrors,
  AppVerifyOtpData,
  AppVerifyOtpResponse,
  AppVerifyOtpErrors
} from '@/api';
```

### Mutation Return Type Reference

All hooks return a `UseMutationResult` with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `mutate` | `(body: InputBody) => void` | Function to trigger the mutation |
| `mutateAsync` | `(body: InputBody) => Promise<Response>` | Async version returning a promise |
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
| `web/src/shared/apiServices/engineer/engineerService.ts` | Engineer API service hooks (includes OTP hooks) |
| `web/src/api/sdk.gen.ts` | Auto-generated OpenAPI SDK functions |
| `web/src/api/types.gen.ts` | Auto-generated TypeScript types |
| `web/src/api/client.ts` | API client configuration |
| `web/src/shared/store/useEngineerRegistrationStore.ts` | Engineer registration state (includes JWT token) |
| `web/src/pages/engineer/auth/components/profile_setup/updated_profile_setup/ContactVerification.tsx` | OTP verification UI component |

---

## Notes

1. **Cache Invalidation**: Registration mutations automatically invalidate their respective query caches on success.
2. **Token Storage**: The JWT token from registration should be stored in the registration store (for OTP verification) and/or localStorage (for authenticated requests).
3. **OTP Flow**: Send OTP → User enters code → Verify OTP. The JWT token from registration is required for both operations.
4. **Token Persistence**: The engineer registration store persists the JWT token to localStorage for use during the verification flow.
5. **Field Validation**: Ensure all required fields are validated on the frontend before calling mutations.
6. **Lookup IDs**: The `countryId`, `stateId`, `cityId`, `skills`, `serviceCategoryId`, and `industryId` fields reference lookup tables accessible via the `/lookup` endpoint.

---

*Documentation generated on: January 20, 2026*

