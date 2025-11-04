import { IoCloseSharp, IoChevronBack } from "react-icons/io5";
import React from "react";

/**
 * Props for the DrawerHeader component.
 *
 * @property onClose - Required callback invoked when the close (X) button is clicked.
 * @property title - Header title shown in the drawer. Defaults to 'title' when not provided.
 * @property onBack - Optional callback invoked when the back button is available and clicked.
 *                     Receives a string key (current implementation sends 'back').
 * @property actions - Optional array of action buttons to display instead of the close button.
 *                     Each action must have an icon, onClick handler, and ariaLabel.
 */
type DrawerHeaderProps = {
  onClose: () => void;
  title: string;
  onBack?: (key: string) => void;
  actions?: React.ReactNode;
};

/**
 * DrawerHeader
 *
 * A small header used at the top of drawer panels. When `onBack` is supplied the
 * component renders a back arrow which calls `onBack('back')` — otherwise the
 * back arrow is omitted.
 *
 * By default, it shows a close (X) button on the right. If `actions` prop is provided,
 * those action buttons are rendered instead (e.g., Download, Filter).
 *
 * The component keeps markup minimal and relies on the parent to manage drawer
 * state. Title text is required and displayed prominently.
 */
const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  onClose,
  title = "title",
  onBack,
  actions,
}) => {
  const handleBack = () => {
    if (onBack) onBack("back");
    else onClose();
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={handleBack}
          aria-label="Back"
          className="text-gray-700 hover:text-gray-900"
        >
          <IoChevronBack className="h-6 w-6 cursor-pointer" />
        </button>
      )}

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>

      {/* Action Buttons or Close Button */}
      <div className="ml-auto flex items-center gap-2">
        {actions ? (
          actions
        ) : (
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700"
          >
            <IoCloseSharp className="h-6 w-6 cursor-pointer" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DrawerHeader;
