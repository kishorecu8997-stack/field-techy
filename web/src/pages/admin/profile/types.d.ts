export interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: File | null;
}

export interface ChangePasswordFormData {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}