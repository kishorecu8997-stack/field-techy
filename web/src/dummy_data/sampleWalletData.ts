import type { WalletData } from "@/pages/client/my_wallet/types";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const sampleWalletData: WalletData = {
  currentBalance: 8250.56,
  transactions: [
    {
      id: "1",
      description: "Installation Of CCTV",
      amount: 15.75,
      type: "credit",
      date: today,
    },
    {
      id: "2",
      description: "Withdraw",
      amount: 50.0,
      type: "debit",
      status: "processing",
      date: today,
    },
    {
      id: "3",
      description: "Maintenance of CCTC",
      amount: 20.65,
      type: "credit",
      date: yesterday,
    },
    {
      id: "4",
      description: "Mobile App UI/UX Designer",
      amount: 100.0,
      type: "credit",
      date: yesterday,
    },
    {
      id: "5",
      description: "Install Security System",
      amount: 20.65,
      type: "credit",
      date: yesterday,
    },
  ],
};
