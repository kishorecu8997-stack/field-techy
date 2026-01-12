import React from "react";
import type { PaymentTermsSectionProps } from "../types";

/**
 * Displays the payment amount and type for the job.
 */
const PaymentTermsSection: React.FC<PaymentTermsSectionProps> = ({
  amount,
  type,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
        Payment Terms
      </h3>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-teal-800 dark:text-teal-400">
          {amount}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({type})
        </span>
      </div>
    </div>
  );
};

export default PaymentTermsSection;
