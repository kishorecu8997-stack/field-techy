import type { TransactionInfo } from '../pages/client/my_wallet/types';


export const sampleTransactions: TransactionInfo[] = [
  {
    id: 1,
    title: 'Installation Of CCTV',
    date: '2024-02-27T11:54:00',
    amount: 15.75,
    type: 'credit',
  },
  {
    id: 2,
    title: 'Withdraw',
    date: '2024-02-26T10:30:00',
    amount: -50.0,
    type: 'debit',
    status: 'Processing',
  },
  {
    id: 3,
    title: 'Maintenance of CCTC',
    date: '2024-02-27T11:54:00',
    amount: 20.65,
    type: 'credit',
  },
  {
    id: 4,
    title: 'Mobile App UI/UX Designer',
    date: '2024-02-27T11:54:00',
    amount: 100.0,
    type: 'credit',
  },
  {
    id: 5,
    title: 'Install Security System',
    date: '2024-02-27T11:54:00',
    amount: 20.65,
    type: 'credit',
  },
];