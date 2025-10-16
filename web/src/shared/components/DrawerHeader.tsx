// export default DrawerHeader
import { IoCloseSharp, IoChevronBack } from "react-icons/io5";

/**
 * Props for the DrawerHeader component.
 *
 * @property onClose - Required callback invoked when the close (X) button is clicked.
 * @property title - Header title shown in the drawer. Defaults to 'title' when not provided.
 * @property onBack - Optional callback invoked when the back button is available and clicked.
 *                     Receives a string key (current implementation sends 'back').
 */
type DrawerHeaderProps = {
  onClose: () => void;
  title: string;
  onBack?: (key: string) => void;
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
const DrawerHeader: React.FC<DrawerHeaderProps> = ({ onClose, title = "title", onBack }) => {
  /**
   * handleBack
   *
   * Decides whether to invoke the provided `onBack` callback or fallback to
   * the `onClose` handler. Current callers expect a 'back' key when using
   * `onBack` so we forward that string.
   */
  const handleBack = () => {
    if (onBack) onBack("back");
    else onClose();
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      {onBack ? (
        <button onClick={handleBack} aria-label="Back" className="text-gray-700 hover:text-gray-900">
          <IoChevronBack className="h-6 w-6 cursor-pointer" />
        </button>
      ) : null}
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 ml-auto">
        <IoCloseSharp className="h-6 w-6 cursor-pointer" />
      </button>
    </div>
  );
};

export default DrawerHeader;