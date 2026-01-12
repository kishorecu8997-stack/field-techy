import { initialPaymentOptions } from "@/dummy_data/initialPaymentData";
import AddPaymentMethod from "@/shared/components/commonUI/AddPaymentMethod";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import type { SelectOption } from "@/shared/components/commonUI/inputs/type";
import PaymentMethod from "@/shared/components/commonUI/PaymentMethod";
import type { PaymentCardOption } from "@/shared/components/type";
import { validatePaymentMethods } from "@/utils/validate";
import { useState } from "react";
import { useForm } from "react-hook-form";

export interface AddFundFormData {
  cardId: string;
}

/*
 * DrawerPaymentSection
 *    - Displays a form to add payment method details
 * @returns {JSX.Element} The rendered DrawerPaymentSection component.
 */
const DrawerPaymentSection = () => {
  const formCtx = useForm<AddFundFormData>({
    defaultValues: {
      cardId: "",
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  const [paymentOptions, setPaymentOptions] = useState<PaymentCardOption[]>(
    initialPaymentOptions,
  );

  const handleSubmit = () => {
    console.log("Submitted");
  };

  const handleAddNewCard = (cardData: { cardNumber: string }) => {
    const newCard: PaymentCardOption = {
      id: `card_${Date.now()}`,
      last4: cardData.cardNumber.slice(-4),
      brand: "visa", // You might want to determine this dynamically
      name: "New Card",
    };
    setPaymentOptions((prev) => [...prev, newCard]);
    formCtx.setValue("cardId", newCard.id);
  };

  return (
    <div>
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <div className="space-y-3">
          <PaymentMethod
            name="cardId"
            label="Select Payment Method"
            required
            options={paymentOptions}
            onAddNew={handleAddNewCard}
            isOpen={isOpen}
            isShowRadio={true}
            setIsOpen={setIsOpen}
            rules={{
              validate: (v: SelectOption) => validatePaymentMethods(v),
            }}
          />
        </div>
      </FormContainer>
      <AddPaymentMethod isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default DrawerPaymentSection;
