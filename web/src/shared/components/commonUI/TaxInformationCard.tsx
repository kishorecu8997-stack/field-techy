import React from 'react';

interface TaxInformationCardProps {
  tax: number;           // e.g., 12.5
  total: number;         // e.g., 112.5
  currencySymbol?: string; // optional, defaults to 'AED'
  taxLabel?: string;     // optional, defaults to 'Tax Information'
  totalLabel?: string;   // optional, defaults to 'Total Estimated Cost'
}

const TaxInformationCard: React.FC<TaxInformationCardProps> = ({
  tax,
  total,
  currencySymbol = 'AED',
  taxLabel = 'Tax Information',
  totalLabel = 'Total Estimated Cost',
}) => {
  return (
    <div className="mb-6 p-4 bg-emerald-800 dark:bg-emerald-900 rounded-xl text-white">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">{taxLabel}</span>
        <span className="font-medium">
          {currencySymbol} {tax.toFixed(2)}
        </span>
      </div>
      <hr className="border-gray-600 my-2" />
      <div className="flex justify-between items-center">
        <span className="text-sm">{totalLabel}</span>        
      </div>
       <div className="flex justify-between items-center">        
        <span className="text-xl font-bold">
          {currencySymbol} {total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default TaxInformationCard;