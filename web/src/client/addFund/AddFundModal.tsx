import React from "react";
import Popup from "@/shared/components/Popup";
import AddFundForm from "./AddFundForm";

interface AddFundModalProps {
  onClose: () => void;
}

const AddFundModal: React.FC<AddFundModalProps> = ({ onClose }) => {
  return (
    <Popup
      open={true}
      onClose={onClose}
      inputClassName="bg-white dark:text-gray-300 dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-md relative"
    >
      {/* optional close button placed at top-right */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        &times;
      </button>
      <AddFundForm onClose={onClose} />
    </Popup>
  );
};

export default AddFundModal;
