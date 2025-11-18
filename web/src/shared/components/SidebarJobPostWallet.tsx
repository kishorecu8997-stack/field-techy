import useDrawerStore from "../store/useDrawerStore";
import { TalentSeekerCard } from "./TalentSeekerCard";
import { WalletCard } from "./WalletCard";

interface EarningsData {
  balance: number;
}

interface SidebarProfileProps {
  earnings: EarningsData;
}

const SidebarJobPostWallet: React.FC<SidebarProfileProps> = ({ earnings }) => {
  const { setISOpenSidebar,  isOpenSidebar, setActiveKey} = useDrawerStore();
  return (
    <div className="space-y-6">
      <TalentSeekerCard />
      <WalletCard
        earnings={earnings}
        onDrawerToggle={(key) => {
          setISOpenSidebar(!isOpenSidebar);
          setActiveKey(key);
        }}
      />
    </div>
  );
};

export default SidebarJobPostWallet;
