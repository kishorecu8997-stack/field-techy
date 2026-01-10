export interface ProfileFormData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  profilePicture: string | File;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}
