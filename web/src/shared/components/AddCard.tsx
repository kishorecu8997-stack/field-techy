import React from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer } from './commonUI/inputs/FormContainer';

interface AddCardProps {
  onClose: () => void;
  onAddCard: (cardData: CardFormData) => void;
}

export interface CardFormData {
  cardNumber: string;
  expDate: string;
  cvv: string;
  country: string;
  address: string;
}

const AddCard: React.FC<AddCardProps> = ({ onClose, onAddCard }) => {
  const methods = useForm<CardFormData>({
    defaultValues: {
      cardNumber: '',
      expDate: '',
      cvv: '',
      country: 'UAE',
      address: '',
    },
  });

  const { register, handleSubmit, formState: { errors } } = methods;

  const onSubmit = (data: CardFormData) => {
    onAddCard(data);
  };

  // Country options with flags
  const countries = [
    { code: 'UAE', name: 'Dubai', flag: '🇦🇪' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  ];

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add Card</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <FormContainer methods={methods} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Card number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="9999 9999 9999 9999"
              className={`w-full px-4 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
              {...register('cardNumber', {
                required: 'Card number is required.',
                pattern: {
                  value: /^\d{13,19}$/,
                  message: 'Card number must be 13 to 19 digits.',
                },
              })}
            />
            {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber.message}</p>}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exp. date
              </label>
              <input
                type="text"
                id="expDate"
                name="expDate"
                placeholder="MM/YY"
                className={`w-full px-4 py-2 border ${errors.expDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                {...register('expDate', {
                  required: 'Expiry date is required.',
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                    message: 'Invalid date format. Use MM/YY.',
                  },
                  validate: value => {
                    const match = value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
                    if (!match) return true;
                    const [, month, year] = match;
                    const expiryDate = new Date(Number(`20${year}`), Number(month));
                    const now = new Date();
                    now.setMonth(now.getMonth() - 1);
                    return expiryDate >= now || 'Card has expired.';
                  },
                })}
              />
              {errors.expDate && <p className="mt-1 text-xs text-red-500">{errors.expDate.message}</p>}
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="Enter CVV"
                className={`w-full px-4 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                {...register('cvv', {
                  required: 'CVV is required.',
                  pattern: {
                    value: /^\d{3,4}$/,
                    message: 'CVV must be 3 or 4 digits.',
                  },
                })}
              />
              {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv.message}</p>}
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            <select
              id="country"
              name="country"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              {...register('country', { required: 'Country is required.' })}
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter Address"
              className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
              {...register('address', { required: 'Address is required.' })}
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Add Card
          </button>
        </FormContainer>
      </div>
    </div>
  );
};

export default AddCard;