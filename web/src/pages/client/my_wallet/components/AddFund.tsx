import { initialPaymentOptions } from "@/dummy_data/initialPaymentData";
import AddPaymentMethod from "@/shared/components/commonUI/AddPaymentMethod";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import type { SelectOption } from "@/shared/components/commonUI/inputs/type";
import PaymentMethod from "@/shared/components/commonUI/PaymentMethod";
import type { PaymentCardOption } from "@/shared/components/type";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { validateAmount, validatePaymentMethods } from "@/utils/validate";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

/**
 * @description Defines the shape of the form data for adding funds to the wallet.
 */
export interface AddFundFormData {
  amount: string;
  cardId: string;
}

/**
 * @description A component that renders a form for adding funds to a user's wallet.
 * It includes fields for the amount and payment method selection.
 */
const AddFund = () => {
  /**
   * @description Handles the submission of the add fund form.
   * @param {AddFundFormData} data - The data from the form.
   */
  const { setActiveKey } = useDrawerStore();
  const handleSubmit = () => {
    // TODO: Replace with actual submission logic (e.g., API call)
    toast.success(`Funds added successfully`);
    setActiveKey("clientWallet");
  };

  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<AddFundFormData>({
    defaultValues: {
      amount: "",
      cardId: initialPaymentOptions[0]?.id || "",
    },
    mode: "onSubmit",
  });

  const [paymentOptions, setPaymentOptions] = useState<PaymentCardOption[]>(
    initialPaymentOptions
  );

  /**
   * @description Handles the addition of a new payment card.
   * It creates a new card object, adds it to the list of payment options,
   * and sets it as the selected card in the form.
   * @param {{ cardNumber: string }} cardData - The data for the new card, typically the card number.
   */
  const handleAddNewCard = (cardData: { cardNumber: string }) => {
    const newCard: PaymentCardOption = {
      id: `card_${Date.now()}`,
      last4: cardData.cardNumber.slice(-4),
      brand: "visa", // You might want to determine this dynamically
      name: "New Card",
    };
    setPaymentOptions((prev) => [...prev, newCard]);
    methods.setValue("cardId", newCard.id);
  };
  return (
    <>
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto px-3 space-y-3">
          <InputField
            label="Amount"
            name="amount"
            placeholder="Enter Amount e.g., $10"
            // allowedCharacters="currency"
            required
            rules={{ validate: (v: string) => validateAmount(v) }}
          />
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
        </div>

        <div className="bg-white ">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Add Fund
          </Button>
        </div>
      </FormContainer>
      <AddPaymentMethod isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default AddFund;
