export interface BasicInformation {
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: File | null;
  address: string;
  skills: string;
  price: number;
  serviceCategory: string;
  portfolio: string;
}

export interface ExperienceDetails {
  resume: string;
  designation: string;
  location: string;
  employer: string;
  experience: string;
}

export interface Documents {
  governmentId: string;
  certificate: string;
};

export type EngineerFormData = BasicInformation & ExperienceDetails & Documents;