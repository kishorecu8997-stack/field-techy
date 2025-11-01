import type { WalletData, Transaction } from '@/pages/client/my_wallet/types';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const sampleWalletData: WalletData = {
  currentBalance: 8250.56,
  transactions: [
    {
      id: '1',
      description: 'Installation Of CCTV',
      amount: 15.75,
      type: 'credit',
      date: new Date('2025-10-31T11:54:00'),
    },
    {
      id: '2',
      description: 'Withdraw',
      amount: 50.00,
      type: 'debit',
      status: 'processing',
      date: new Date('2025-11-01T10:30:00'),
    },
    {
      id: '3',
      description: 'Maintenance of CCTC',
      amount: 20.65,
      type: 'credit',
      date: new Date('2025-11-01T11:54:00'),
    },
    {
      id: '4',
      description: 'Mobile App UI/UX Designer',
      amount: 100.00,
      type: 'credit',
      date: new Date('2024-02-27T11:54:00'),
    },
    {
      id: '5',
      description: 'Install Security System',
      amount: 20.65,
      type: 'credit',
      date: new Date('2024-02-27T11:54:00'),
    },
  ],
};