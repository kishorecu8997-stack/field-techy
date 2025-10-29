import React, { useState, useEffect } from 'react';
import { sampleWalletData } from '@/dummy_data/sampleWalletData';

interface WalletComponentProps {
  data?: WalletData;
  onAddFund?: () => void;
  onViewAllTransactions?: () => void;
}

const WalletComponent: React.FC<WalletComponentProps> = ({
  data = sampleWalletData,
  onAddFund,
  onViewAllTransactions,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check for system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Format date to display as "27 Feb, 2024 | 11:54 AM"
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Group transactions by date
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const dateKey = transaction.date.toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    
    return grouped;
  };

  // Get human readable date label (Today, Yesterday, or actual date)
  const getDateLabel = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    
    if (dateOnly.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const groupedTransactions = groupTransactionsByDate(data.transactions);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className={`w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <div className={`p-4 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h1 className="text-xl font-bold">My Wallet</h1>
        <button 
          onClick={() => alert('Close wallet')}
          className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Balance Section */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="text-center">
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Balance</p>
          <p className="text-3xl font-bold">${formatCurrency(data.currentBalance).replace('$', '')}</p>
          <button 
            onClick={onAddFund || (() => alert('Add Fund'))}
            className={`mt-4 px-6 py-2 rounded-full font-medium transition-colors ${
              isDarkMode 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            Add Fund
          </button>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button 
            onClick={onViewAllTransactions || (() => alert('View All Transactions'))}
            className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            View All
          </button>
        </div>

        {/* Transaction List */}
        {sortedDates.map(dateKey => {
          const transactionsForDate = groupedTransactions[dateKey];
          const date = new Date(dateKey);
          
          return (
            <div key={dateKey} className="mb-6">
              <div className={`text-xs uppercase font-semibold mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getDateLabel(date)}
              </div>
              
              {transactionsForDate.map(transaction => (
                <div 
                  key={transaction.id} 
                  className={`flex justify-between items-start py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex-1">
                    <div className="font-medium">{transaction.description}</div>
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(transaction.date)}
                    </div>
                    {transaction.status && (
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        transaction.status === 'processing' 
                          ? isDarkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800' 
                          : transaction.status === 'completed' 
                            ? isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800' 
                            : isDarkMode ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className={`font-medium ${
                    transaction.type === 'credit' 
                      ? isDarkMode ? 'text-green-400' : 'text-green-600' 
                      : isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount)).replace('$', '')}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WalletComponent;