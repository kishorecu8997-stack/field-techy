import { IoChevronBack, IoCloseSharp } from "react-icons/io5";

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
  /** show back button explicitly */
  showBack?: boolean;
  /** Back handler invoked when back is clicked; if omitted, back will call onClose() */
  onBack?: () => void;
  actions?: React.ReactNode | React.ComponentType;
};

/**
 * DrawerHeader
 *
 * A small header used at the top of drawer panels. The `showBack` prop controls
 * whether the back arrow is rendered. When the back arrow is clicked, `onBack`
 * is invoked if provided; otherwise it falls back to `onClose()`.
 *
 * The component keeps markup minimal and relies on the parent to manage drawer
 * state. Title text is required and displayed prominently.
 */
const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  onClose,
  title = "title",
  showBack = false,
  onBack,
  actions,
}) => {
  const handleBack = () => {
    if (onBack) onBack();
    else onClose();
  };

  const renderActions = () => {
    if (!actions) {
      return (
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
        >
          <IoCloseSharp className="h-6 w-6" />
        </button>
      );
    }

    // If actions is a function → treat as component
    if (typeof actions === "function") {
      const ActionsComponent = actions as React.ComponentType;
      return <ActionsComponent />;
    }

    // Otherwise, it's a ReactNode (JSX, string, fragment, etc.)
    return actions;
  };

  return (
    <div className="flex items-center gap-3">
      {showBack ? (
        <button
          onClick={handleBack}
          aria-label="Back"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors"
        >
          <IoChevronBack className="h-6 w-6" />
        </button>
      ) : null}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1 truncate">
        {title}
      </h2>
      <div className="ml-auto flex items-center gap-2">{renderActions()}</div>
    </div>
  );
};

export default DrawerHeader;
