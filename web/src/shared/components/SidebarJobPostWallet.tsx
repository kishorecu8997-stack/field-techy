import { useDrawer } from "@/layout/RootLayout";
import { TalentSeekerCard } from "./TalentSeekerCard";
import { WalletCard } from "./WalletCard";

interface EarningsData {
  balance: number;
}

interface SidebarProfileProps {
  earnings: EarningsData;
}

const SidebarJobPostWallet: React.FC<SidebarProfileProps> = ({ earnings }) => {
  const { onDrawerToggle } = useDrawer();
  return (
    <div className="space-y-6">
      <TalentSeekerCard />
      <WalletCard earnings={earnings} onDrawerToggle={onDrawerToggle} />
    </div>
  );
};

export default SidebarJobPostWallet;