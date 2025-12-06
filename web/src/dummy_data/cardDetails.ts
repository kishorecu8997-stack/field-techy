import type { PaymentCardOption } from "@/shared/components/commonUI/PaymentMethod";

export interface Card {
  id: string;
  number: string;
  type: string;
  title: string;
  icon: string;
}

export const cards: Card[] = [
  {
    id: "1",
    number: "xxxx xxxx xxxx 5678",
    type: "V",
    title: "Mobile App UI/UX Designer",
    icon: "V",
  },
  {
    id: "2",
    number: "xxxx xxxx xxxx 5678",
    type: "M",
    title: "Mobile App UI/UX Designer",
    icon: "M",
  },
];

export const initialPaymentOptions: PaymentCardOption[] = [
  {
    id: "card_1",
    last4: "5678",
    brand: "visa",
    name: "Mobile App UI/UX Designer",
  },
  {
    id: "card_2",
    last4: "1234",
    brand: "mastercard",
    name: "Frontend Developer",
  },
];
