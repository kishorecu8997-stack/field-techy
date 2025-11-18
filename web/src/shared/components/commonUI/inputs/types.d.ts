import { RegisterOptions } from "react-hook-form";
export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean | string;
  options: SelectOption[];
  isShowLabel?:boolean;
  rules?: RegisterOptions;
}


interface CheckboxInputProps {
  name: string;
  label?: string;
  required?: boolean;
  secondaryLabel?: string;
  /** Optional react-hook-form validation rules */
  rules?: RegisterOptions;
}

interface ConfirmPasswordInputProps {
  name: string;
  passwordField: string; // The original password field to match
  label?: string;
  placeholder?: string;
  required?: boolean;
  /** Optional react-hook-form validation rules */
  rules?: RegisterOptions;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface InputFieldProps {
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

interface OTPInputProps {
  name: string;
  length?: number;
  required?: boolean;
  rules?: RegisterOptions;
  errorAlign?: "left" | "right" | "center";
}

interface PasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  /** Optional react-hook-form validation rules */
  rules?: RegisterOptions;
}

interface PhoneInputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  disabled?: boolean;
  inputClassName?: string;
}

interface Country {
  code: string;
  name: string;
  flag: string; // Data URI for the flag image
  validationKey: "india" | "uk";
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  placeholder?: string;
  required?: boolean | string;
  options: SelectOption[];
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
  disabled ?: boolean;
}

interface CountrySelectProps {
  countries: Country[];
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

// Export the interface so it can be imported
export interface ImageUploadFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  rules?: RegisterOptions;
  maxSize?: number;
  accept?: string;
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
  disabled?: boolean; // Added disabled prop here
}

interface SwitchInputProps {
  name: string;
  label?: string;
  required?: boolean;
}

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

interface TagOption {
  value: string;
  label: string;
}

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

interface TextareaInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

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

export interface OTPValues {
  otp: string;
}

interface VerifyEmailModalProps {
  header?: string;
  description?: string;
  onClose?: () => void;
  onVerifySuccess?: () => void;
  buttonText?: string;
  isSuccess?: boolean;
  name?: string;
}
