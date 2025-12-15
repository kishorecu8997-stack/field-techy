export interface basicDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phone: string;
  address: string;
  country: string;
  postalCode: string;
  skills: string[];
  portfolio?: string;
  amount: string;
  designation: string;
  company: string;
  location: string;
  experience: string;
  password: string;
  confirmPassword: string;
}

export interface documents {
  resume?: File;
  governmentId?: File;
  certificate?: File;
}

export interface setPassword {
  mobileOTP?: string;
  emailOTP?: string;
}

export interface completeRegistrationData {
  basicDetails: basicDetails;
  documents: documents;
  setPassword: setPassword;
}
