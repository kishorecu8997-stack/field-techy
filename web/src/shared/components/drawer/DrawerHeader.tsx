import { IoChevronBack, IoCloseSharp } from "react-icons/io5";

type DrawerHeaderProps = {
  onClose: () => void;
  title: string;
  onBack?: (key: string) => void;
  actions?: React.ReactNode | React.ComponentType;
};

/**
 * DrawerHeader
 *
 * A small header used at the top of drawer panels. When `onBack` is supplied the
 * component renders a back arrow which calls `onBack('back')` — otherwise the
 * back arrow is omitted and the close (X) button will call `onClose`.
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
    if (typeof actions === 'function') {
      const ActionsComponent = actions as React.ComponentType;
      return <ActionsComponent />;
    }

    // Otherwise, it's a ReactNode (JSX, string, fragment, etc.)
    return actions;
  };

  return (
    <div className="flex items-center gap-3">
      {onBack ? (
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
      <div className="ml-auto flex items-center gap-2">
        {renderActions()}
      </div>
    </div>
  );
};

export default DrawerHeader;
