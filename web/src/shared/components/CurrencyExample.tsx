/*
import React, { useState } from 'react';
import { detectAndStoreCurrency, getCurrencyFromStorage } from '@/utils/currency';

/**
 * A simple React example demonstrating currency detection based on phone number signup.
 * This component shows:
 * - A signup input for phone number
 * - A signup button that detects and stores the currency
 * - Displaying a sample price using the detected currency symbol
 *\/
const CurrencyExample: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState(getCurrencyFromStorage());
  const [message, setMessage] = useState('');

  const handleSignup = () => {
    if (phoneNumber.trim()) {
      detectAndStoreCurrency(phoneNumber);
      const detectedSymbol = getCurrencyFromStorage();
      setCurrencySymbol(detectedSymbol);
      setMessage(`Currency detected and stored: ${detectedSymbol}`);
    } else {
      setMessage('Please enter a phone number.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Currency Detection Example</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Enter your phone number to detect and set your currency symbol.
      </p>

      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+91 1234567890 or +1 1234567890"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     dark:bg-gray-700 dark:text-white"
        />
      </div>

      <button
        onClick={handleSignup}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:ring-offset-2 transition-colors"
      >
        Detect and Store Currency
      </button>

      {message && (
        <p className="mt-4 text-sm text-green-600 dark:text-green-400">
          {message}
        </p>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Pricing Example</h3>
        <p className="text-gray-700 dark:text-gray-300">
          Sample Product Price:
          <span className="font-bold text-lg">{currencySymbol}100.00</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          The currency symbol is loaded from localStorage and will be consistent across all pages.
        </p>
      </div>
    </div>
  );
};

export default CurrencyExample;
*/
