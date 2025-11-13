// BankCardDetail.tsx
import React from "react";
import type { BankCardData } from "../../types";

const BankCardDetail: React.FC<BankCardData> = ({
  bankName,
  cardNumber,
  bankAddress,
  ibanNumber,
  cardHolderName,
  swiftCode,
  walletBalance,
}) => {
  return (
    <div className="w-full items-start gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
  {/* Card Detail Heading */}
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
    Card Detail
  </h3>

  {/* Three Column Layout */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Left Column */}
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Bank Name
        </div>
        <div className="font-semibold text-gray-800 dark:text-white">
          {bankName}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Card Number
        </div>
        <div className="font-semibold text-gray-800 dark:text-white">
          {cardNumber}
        </div>
      </div>
    </div>

    {/* Middle Column */}
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Bank Address
        </div>
        <div className="font-medium text-gray-800 dark:text-white leading-relaxed">
          {bankAddress}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          IBAN Number
        </div>
        <div className="font-semibold text-gray-800 dark:text-white">
          {ibanNumber}
        </div>
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Card Holder Name
        </div>
        <div className="font-semibold text-gray-800 dark:text-white">
          {cardHolderName}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Swift Code
        </div>
        <div className="font-semibold text-gray-800 dark:text-white">
          {swiftCode}
        </div>
      </div>
    </div>
  </div>
</div>
      <div className="ml-auto text-left flex-shrink-0">
        <div className="text-m text-gray-500 dark:text-gray-400 mb-1 mt-1">
          Wallet Balance: 
          <span className="font-bold text-gray-800 dark:text-white gap-1">
            { walletBalance }
          </span>
        </div>
      </div>
    </div>
  );
};

export default BankCardDetail;
