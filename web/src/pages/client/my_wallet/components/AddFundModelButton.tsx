import AddFundModal from "@/client/addFund/AddFundModal";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useThemeHook } from "@/shared/hooks/useThemeHook";
import { useState } from "react";

const AddFundModelButton = ({ buttonWidth }: { buttonWidth?: string }) => {
  const isDarkMode = useThemeHook();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex justify-end">
      <Button
        variant="no_style"
        onClick={() => setIsOpen(true)}
        className={`rounded-full font-medium transition-colors cursor-pointer ${buttonWidth ?? ""} ${
          isDarkMode
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-emerald-700 hover:bg-emerald-800 text-white"
        }`}
      >
        Add Fund
      </Button>
      {isOpen && <AddFundModal onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default AddFundModelButton;
