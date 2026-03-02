export interface ContactSupportFormData {
  email: string;
  phoneNumber: string;
}

export interface FaqAddFormData {
  question: string;
  answer: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface FaqAddFormData {
  question: string;
  answer: string;
  sortOrder: number;
}
