import AddFundModal from "@/client/addFund/AddFundModal";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useThemeHook } from "@/shared/hooks/useThemeHook";
import { useState } from "react";

/*
* TODO: implement add fund component
* Add fund component will be used to add funds to the client's wallet
* this component will open the add fund modal when the client clicks on the add fund button
* @param buttonWidth - width of the add fund button
*/
const AddFundComponent = ({ buttonWidth }: { buttonWidth?: string }) => {
  const isDarkMode = useThemeHook();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex justify-end">
      <Button
        variant="no_style"
        onClick={() => setIsOpen(true)}
        className={`rounded-full font-medium transition-colors cursor-pointer ${buttonWidth ?? ""} ${isDarkMode
          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
          : "bg-emerald-700 hover:bg-emerald-800 text-white"
          }`}
      >
        Add Fund
      </Button>
      {isOpen && <AddFundModal onClose={() => setIsOpen(false)} isOpen={isOpen} />}
    </div>
  );
};

export default AddFundComponent;
