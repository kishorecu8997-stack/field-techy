export interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: File | null;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}