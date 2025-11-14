/**
 * @file Centralized type definitions for shared, reusable input components.
 *
 * This file contains TypeScript interfaces and types for common form elements
 * used throughout the application, such as text inputs, checkboxes, file uploads,
 * and more complex verified fields.
 */

import { RegisterOptions } from "react-hook-form";

declare global {
  // Optional: if you want it globally available without import
}

interface InputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email" | "number" | "date";
  /** Additional react-hook-form validation rules */
  rules?: RegisterOptions;
  /** Icon to display on the left side of input */
  leftIcon?: React.ReactNode;
  /** Custom className for the input container */
  containerClassName?: string;
  /** Custom className for the input field */
  inputClassName?: string;
  /** Show validation checkmark when valid */
  showValidationCheck?: boolean;
  /** Custom icon to show when the field is valid */
  validIcon?: React.ReactNode;
  /** Custom icon to show when the field is invalid */
  invalidIcon?: React.ReactNode;
  /** Disable input */
  disabled?: boolean;  // Added disabled prop here
}

/**
 * Props for the `CheckboxInput` component.
 */
interface CheckboxInputProps {
  name: string;
  label?: string;
  required?: boolean;
  secondaryLabel?: string;
  rules?: RegisterOptions;
}

/**
 * Props for the `ConfirmPassword` input component.
 */
interface ConfirmPasswordInputProps {
  name: string;
  passwordField: string; // The original password field to match
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
}

/**
 * Represents a country object, used in country selectors.
 */
interface Country {
  code: string;
  name: string;
  flag: string;
  validationKey?: "india" | "uk";
}

/**
 * Props for the `CountrySelect` dropdown component.
 */
interface CountrySelectProps {
  countries: Country[];
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

/**
 * Props for the `FileUpload` component.
 */
interface FileUploadProps {
  name: string;
  label?: string;
  required?: boolean;
  accept?: string;
  maxSize?: number;
  containerClassName?: string;
  placeholder?: string;
  validatePDF?: boolean;
  minPages?: number;
  maxPages?: number;
}

/**
 * Props for the `ImageUploaderField` component.
 */
export interface ImageUploadFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  rules?: RegisterOptions;
  maxSize?: number;
  accept?: string;
}

/**
 * Props for the `OTPInput` component.
 */
interface OTPInputProps {
  name: string;
  length?: number;
  required?: boolean;
  rules?: RegisterOptions;
  errorAlign?: "left" | "right" | "center";
}

/**
 * Props for the `PasswordInput` component.
 */
interface PasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
}

/**
 * Props for the `PhoneInputField` component.
 */
interface PhoneInputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  disabled?: boolean;
  inputClassName?: string;
}

/**
 * Represents a single option for a select/dropdown component.
 */
export interface SelectOption {
  value: string | number;
  label: string;
}

/**
 * Props for the `SelectField` (dropdown) component.
 */
export interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean | string;
  options: SelectOption[];
  isShowLabel?: boolean;
  rules?: RegisterOptions;
}

/**
 * Props for the `SwitchInput` (toggle) component.
 */
interface SwitchInputProps {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Props for the `TagInputField` component.
 */
interface TagInputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  maxTags?: number;
}

/**
 * Represents a single option for a tag selection component.
 */
interface TagOption {
  value: string;
  label: string;
}

/**
 * Props for the `TagSelectField` component.
 */
interface TagSelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  containerClassName?: string;
  maxTags?: number;
  options: TagOption[];
}

/**
 * Props for the `TextareaInput` component.
 */
interface TextareaInputProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  showValidationCheck?: boolean;
  minLength?: number;
  maxLength?: number;
}

/**
 * Props for the `VerifiedEmailInputField` component.
 */
export interface VerifiedEmailInputFieldProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  disabled?: boolean;
  inputClassName?: string;
  onVerifySuccess?: () => void;
  verified?: boolean;
  setVerified?: (val: boolean) => void;
}

/**
 * Props for the `VerifiedPhoneInputField` component.
 */
export interface VerifiedPhoneInputFieldProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  disabled?: boolean;
  inputClassName?: string;
  onVerifySuccess?: () => void;
  verified?: boolean;
  setVerified?: (val: boolean) => void;
}

/**
 * Defines the shape of the data for a One-Time Password (OTP) input field.
 */
export interface OTPValues {
  otp: string;
}

/**
 * Defines the props for components that display an OTP verification modal/page.
 */
interface VerifyEmailModalProps {
  header?: string;
  description?: string;
  onClose?: () => void;
  onVerifySuccess?: () => void;
  buttonText?: string;
  isSuccess?: boolean;
  name?: string;
  isClose?: boolean;
  footer?: React.ReactNode;
}