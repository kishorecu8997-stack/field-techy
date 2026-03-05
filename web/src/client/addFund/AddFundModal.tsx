import React from "react";
import Popup from "@/shared/components/Popup";
import AddFundForm from "./AddFundForm";
import { Button } from "@/shared/components/commonUI/Buttons";

interface AddFundModalProps {
  onClose: () => void;
  isOpen: boolean;
}

/*
* TODO: implement add fund modal
* Add fund modal will be used to add funds to the client's wallet
* this modal will open when the client clicks on the add fund button
* @param onClose - callback function to close the modal
* @param isOpen - boolean to open the modal
*/
const AddFundModal: React.FC<AddFundModalProps> = ({ onClose, isOpen }) => {
  return (
    <Popup
      open={isOpen}
      onClose={onClose}
      inputClassName="bg-white dark:text-gray-300 dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-md relative"
    >
      {/* optional close button placed at top-right */}
      <Button
        type="button"
        onClick={onClose}
        aria-label="Close"
        variant="no_style"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        &times;
      </Button>
      <AddFundForm onClose={onClose} />
    </Popup>
  );
};

export default AddFundModal;
