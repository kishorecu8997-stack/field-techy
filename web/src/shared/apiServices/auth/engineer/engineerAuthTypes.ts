export interface EngineerSignUpData {
  id?: string;
  phoneNumber?: string;
  email?: string;
  password?: string | null;
  fullName?: string;
  confirmPassword?: string;
  // Add other fields as needed, mirroring ClientSignUpData or specific to Engineer
}
