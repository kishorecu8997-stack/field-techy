import type { PaymentCardOption } from "@/shared/components/type";

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
