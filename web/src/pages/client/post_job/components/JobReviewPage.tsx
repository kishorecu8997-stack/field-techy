import React, { useState } from "react";
import PaymentMethodSelector, {
  type PaymentCardOption,
} from "@/shared/components/commonUI/PaymentMethodSelector";

interface JobReviewPageProps {
  onBack: () => void;
  onSubmit: () => void;
}

const paymentOptions: PaymentCardOption[] = [
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

const JobReviewPage: React.FC<JobReviewPageProps> = ({ onBack, onSubmit }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  // Mock data — in real app, this would come from form state
  const jobData = {
    baseCost: 5000.0,
    tax: 500.0,
    total: 5500.0,
    urgency: "Project Work (Standard Rate)",
    cards: [
      {
        id: "card1",
        number: "xxxx xxxx xxxx 5678",
        type: "Visa",
        name: "Mobile App UI/UX Designer",
      },
      {
        id: "card2",
        number: "xxxx xxxx xxxx 5678",
        type: "Mastercard",
        name: "Mobile App UI/UX Designer",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-200">
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
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Urgency Level<span className="text-red-500">*</span>
        </label>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <p className="text-gray-800 dark:text-gray-200">{jobData.urgency}</p>
        </div>
      </div>

      {/* Tax Information Card */}
      <div className="mb-6 p-4 bg-emerald-800 dark:bg-emerald-900 rounded-xl text-white">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Tax Information</span>
          <span className="font-medium">AED {jobData.tax.toFixed(2)}</span>
        </div>
        <hr className="border-gray-600 my-2" />
        <div className="flex justify-between items-center">
          <span className="text-sm">Total Estimated Cost</span>
          <span className="text-xl font-bold">
            AED {jobData.total.toFixed(2)}
          </span>
        </div>
      </div>

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
          Once the job is posted, an invoice will be auto-generated and sent to
          you. Payment will follow the standard billing cycle.
        </p>

        
        <div className="space-y-3">
          {/* {jobData.cards.map((card) => (
            <div
              key={card.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedCard === card.id
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => setSelectedCard(card.id)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={`https://placehold.co/40x25?text=${card.type}`}
                  alt={card.type}
                  className="w-10 h-6 object-contain"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {card.number}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {card.name}
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="paymentCard"
                value={card.id}
                checked={selectedCard === card.id}
                onChange={() => setSelectedCard(card.id)}
                className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
            </div>
          ))} */}

          {/* Add New Card */}         
          <PaymentMethodSelector
            options={paymentOptions}
            selectedId={selectedCard}
            onChange={setSelectedCard}
            onAddNew={() => console.log("Add new card")}            
          />
        </div>
      </div>

      {/* Pay & Post Job Button */}
      <div className="pt-6">
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Back to Edit
          </button>
          <button
            onClick={onSubmit}
            disabled={!consentChecked || !selectedCard}
            className={`px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors ${
              !consentChecked || !selectedCard
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-700 hover:bg-emerald-800"
            }`}
          >
            Pay & Post Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobReviewPage;
