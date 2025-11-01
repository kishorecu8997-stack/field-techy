import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import PaymentMethod from "@/shared/components/commonUI/PaymentMethod";
import type { FormData as JobFormData, PaymentCardOption } from "../types";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { Button } from "@/shared/components/commonUI/Buttons";
import { initialPaymentOptions } from "@/dummy_data/initialPaymentData";

import TaxInformationCard from "@/shared/components/commonUI/TaxInformationCard";
import { validatePaymentMethod } from "../validates";

interface JobReviewPageProps {
  formData: JobFormData;
  onBack: () => void;
  onSubmit: () => void;
}

const jobData = {
  tax: 18.75,
  total: 218.75,
};

/**
 * `JobReviewPage` is a component that allows a client to review their job posting details before final submission.
 * It displays an estimated cost, allows setting an urgency level, handles payment method selection,
 * and requires consent before posting.
 *
 * @param {JobReviewPageProps} props The properties for the component.
 * @param {JobFormData} props.formData The job data collected from the previous form step.
 * @param {() => void} props.onBack A callback function to return to the job editing form.
 * @param {() => void} props.onSubmit A callback function to handle the final job submission.
 * @returns {React.ReactElement} The rendered job review page.
 */
const JobReviewPage: React.FC<JobReviewPageProps> = ({
  formData,
  onBack,
  onSubmit,
}) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<PaymentCardOption[]>(
    initialPaymentOptions
  );
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  // Mock cost data - this would likely be calculated based on formData in a real app
  const jobData = {
    baseCost: 5000.0,
    tax: 500.0,
    total: 5500.0,
  };

  const methods = useForm({
    defaultValues: { urgencyLevel: "", paymentMethod: "" },
  });
  const {
    register,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    register("paymentMethod", {
      validate: validatePaymentMethod,
    });
  }, [register]);

  useEffect(() => {
    setValue("paymentMethod", selectedCard || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [selectedCard, setValue]);

  const handleAddNewCard = (cardData: { cardNumber: string }) => {
    const newCard: PaymentCardOption = {
      id: `card_${Date.now()}`,
      last4: cardData.cardNumber.slice(-4),
      brand: "visa", // You might want to determine this dynamically
      name: "New Card",
    };
    setPaymentOptions((prev) => [...prev, newCard]);
    setSelectedCard(newCard.id);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-200"
      >
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

        {/* Tax Information Card */}
        <TaxInformationCard
          tax={jobData.tax}
          total={jobData.total}
          // Optional: customize labels or currency
          // currencySymbol="$"
          // taxLabel="VAT (5%)"
          // totalLabel="Grand Total"
        />

        {/* Consent Checkbox */}
        <div className="mb-6 flex items-start">
          <input
            type="checkbox"
            id="consent"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label
            htmlFor="consent"
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            I consent to share data with another region if this job is posted
            outside my current location.
          </label>
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
            Once the job is posted, an invoice will be auto-generated and sent
            to you. Payment will follow the standard billing cycle.
          </p>
          <div className="space-y-3">
            <PaymentMethod
              selectedId={selectedCard}
              onChange={setSelectedCard}
              onAddNew={handleAddNewCard}
            />
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>
        </div>

        {/* Pay & Post Job Button */}
        <div className="pt-6">
          <div className="flex gap-4">
            {/* <Button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Back to Edit
          </Button> */}
            <Button
              type="submit"
              variant={consentChecked && selectedCard ? "primary" : "secondary"}
              disabled={!consentChecked || !selectedCard}
              className="px-6 py-3 rounded-lg text-sm font-medium"
            >
              Pay & Post Job
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default JobReviewPage;
