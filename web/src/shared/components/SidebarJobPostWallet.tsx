import TalentSection from "@/pages/client/post_job/PostAJobComponent/TalentSection";
import { WalletCard } from "./WalletCard";

interface EarningsData {
  balance: number;
}

interface SidebarProfileProps {
  earnings: EarningsData;
}

const SidebarJobPostWallet: React.FC<SidebarProfileProps> = () => {
  return (
    <div className="space-y-6">
      <TalentSection />
      <WalletCard earnings={{ balance: 1000 }} />
    </div>
  );
};

export default SidebarJobPostWallet;
