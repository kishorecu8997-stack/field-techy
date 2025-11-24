import { initialPaymentOptions } from "@/dummy_data/initialPaymentData";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import PaymentMethod from "@/shared/components/commonUI/PaymentMethod";
import TaxInformationCard from "@/shared/components/commonUI/TaxInformationCard";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { PaymentCardOption } from "../types";
import { validateConsent, validatePaymentMethods } from "../Validates";
import { CheckboxInput } from "@/shared/components/commonUI/inputs/CheckboxInput";

/**
 * @typedef {object} JobReviewPageProps
 * @property {boolean} isOpen - Controls the visibility of the "Add Payment Method" modal.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsOpen - Function to update the visibility state of the modal.
 */

/**
 * Renders the review and payment step of the job posting process.
 * @param {JobReviewPageProps} props - The props for the component.
 */
const JobReviewPage = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  /**
   * @description State to manage the list of available payment options.
   */
  const [paymentOptions, setPaymentOptions] = useState<PaymentCardOption[]>(
    initialPaymentOptions
  );

  /**
   * @description Mock cost data for display purposes. In a real application,
   * this would likely be calculated based on the job details from the form.
   */
  const jobData = {
    baseCost: 5000.0,
    tax: 500.0,
    total: 5500.0,
  };

  /**
   * @description Initializes `react-hook-form` for this component's scope.
   */
  const methods = useForm({
    defaultValues: { urgencyLevel: "", paymentMethod: "", consent: false },
  });
  const {
    register,
    setValue,
    formState: { errors },
  } = methods;

  /**
   * @description Effect hook to programmatically register the `paymentMethod` field
   * with its validation rules, as it's a custom component.
   */
  useEffect(() => {
    register("paymentMethod", {
      validate: validatePaymentMethods,
    });
  }, [register]);

  /**
   * Handles adding a new payment card.
   * It updates the list of payment options and sets the new card as the selected payment method.
   * @param {{ cardNumber: string }} cardData - The data for the new card.
   */
  const handleAddNewCard = (cardData: { cardNumber: string }) => {
    const newCard: PaymentCardOption = {
      id: `card_${Date.now()}`,
      last4: cardData.cardNumber.slice(-4),
      brand: "visa", // You might want to determine this dynamically
      name: "New Card",
    };
    setPaymentOptions((prev) => [...prev, newCard]);
    setValue("paymentMethod", newCard.id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Review Your Job Posting</h1>

      {/* Estimated Base Cost */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Estimated Base Cost
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          AED {jobData.baseCost.toFixed(2)}
        </p>
      </div>

      {/* Urgency Level */}
      <div className="mb-6">
        <SelectField
          label="Urgency Level"
          name="urgencyLevel"
          placeholder="Select Urgency Level"
          options={[
            { value: "1", label: "Option1" },
            { value: "2", label: "Option2" },
            { value: "3", label: "Option3" },
          ]}
          required
        />
      </div>

      <TaxInformationCard
        tax={jobData.tax}
        total={jobData.total}
      />

      {/* Consent Checkbox */}
      <div className="mb-6">
        <div className="flex items-start">
          <CheckboxInput
            name="consent"
            secondaryLabel="I consent to share data with another region if this job is posted
            outside my current location."
            rules={{ validate: validateConsent }}
          />          
        </div>       
      </div>

      {/* Job Approval Process */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase mb-3 text-gray-700 dark:text-gray-300">
          Job Approval Process
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Platform will auto-validate job details.</li>
          <li>• If flagged, admin will review the post manually.</li>
          <li>• Once approved, job will be listed and engineers notified.</li>
        </ul>
      </div>

      {/* Invoice & Payment */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase mb-3 text-gray-700 dark:text-gray-300">
          Invoice & Payment
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Once the job is posted, an invoice will be auto-generated and sent to
          you. Payment will follow the standard billing cycle.
        </p>
        <div className="space-y-3">
          <PaymentMethod
            name="paymentMethod"
            label="Select Payment Method"
            required
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            options={paymentOptions}
            onAddNew={handleAddNewCard}
            isShowRadio={true}
            rules={{ validate: validatePaymentMethods }}
          />
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default JobReviewPage;
