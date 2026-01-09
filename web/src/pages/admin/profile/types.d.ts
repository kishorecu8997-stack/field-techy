export interface ProfileFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profilePicture: any;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}
