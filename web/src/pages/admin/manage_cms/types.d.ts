export interface ContactSupportFormData {
  email: string;
  phoneNumber: string;
  address: string;
  copyright: string;
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
