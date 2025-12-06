import type { TransactionInfo } from '../pages/client/my_wallet/types';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const sampleTransactions: TransactionInfo[] = [
  {
    id: 1,
    title: 'Installation Of CCTV',
    date: today.toISOString(),
    amount: 15.75,
    type: 'credit',
  },
  {
    id: 2,
    title: 'Withdraw',
    date: today.toISOString(),
    amount: -50.0,
    type: 'debit',
    status: 'processing',
  },
  {
    id: 3,
    title: 'Maintenance of CCTC',
    date: yesterday.toISOString(),
    amount: 20.65,
    type: 'credit',
  },
  {
    id: 4,
    title: 'Mobile App UI/UX Designer',
    date: yesterday.toISOString(),
    amount: 100.0,
    type: 'credit',
  },
  {
    id: 5,
    title: 'Install Security System',
    date: yesterday.toISOString(),
    amount: 20.65,
    type: 'credit',
  },
];