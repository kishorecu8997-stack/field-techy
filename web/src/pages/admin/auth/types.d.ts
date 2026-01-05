export type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type ForgotPasswordFormData = {
  email: string;
};

export type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export type VerifyOtpFormData = {
  otp: string;
  password: string;
  email: string;
};