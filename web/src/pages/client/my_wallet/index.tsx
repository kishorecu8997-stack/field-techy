import React from "react";
import WalletComponent from "./components/WalletComponent";


/**
 * Props for components rendered within a drawer that require navigation and close actions.
 */
interface DrawerMenuProps {
  /** Callback to navigate to a different view within the drawer (e.g., 'addSkills'). */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the parent drawer or sidebar. */
  onClose: () => void;
}

/**
 * The SkillsAndTools component renders a summary of the user's skills and tools.
 * It uses data from a dummy source and provides navigation callbacks for editing.
 * @param {DrawerMenuProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered SkillsAndTools component.
 */
const MyWallet: React.FC<DrawerMenuProps> = ({
  onMenuItemClick,
}) => {
  return (
    <>      
      <div className="flex flex-col gap-4">
        <WalletComponent
          title="My Wallet"          
        />
       
      </div>
    </>
  );
};

export default MyWallet;
