export type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type OTPValues = {
  otp: string;
};

export type VerifyEmailModalProps = {
  header?: string;
  description?: string;
  onClose?: () => void;
  handleNavigate?: () => void;
};

export type BackgroundVerificationData = {
  governmentId: string;
  certificate: string;
};

export type SetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

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
