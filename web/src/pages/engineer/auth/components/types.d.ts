/**
 * @file Centralized type definitions for the authentication feature.
 *
 * This file contains TypeScript types and interfaces used across various
 * authentication-related forms and components, such as sign-in, sign-up,
 * password reset, and multi-step registration.
 */

/**
 * Defines the shape of the data for the standard email/password login form.
 */
export type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

/**
 * Defines the shape of the data for a One-Time Password (OTP) input field.
 */
export type OTPValues = {
  otp: string;
};

/**
 * Defines the props for components that display an OTP verification modal/page.
 */
export type VerifyEmailModalProps = {
  header?: string;
  description?: string;
  onClose?: () => void;
  handleNavigate?: () => void;
};

/**
 * Defines the shape of the data for the background verification step of registration.
 * Note: Properties are likely file objects, but represented as strings here.
 */
export type BackgroundVerificationData = {
  governmentId: string;
  certificate: string;
};

/**
 * Defines the shape of the data for forms that set or reset a password.
 */
export type SetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

/**
 * Defines the shape of the data for the main profile setup form.
 * Note: `resume` is likely a file object, but represented as a string here.
 */
export type ProfileSetupData = {
  name: string;
  email: string;
  address: string;
  tags: string[];
  portfolio: string;
  amount: string;
  designation: string;
  company: string;
  location: string;
  experience: string;
  resume: string;
};