import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { PopupProps } from "./type";

/**
 * Popup Component
 *
 * A modal dialog with a backdrop that appears when `open` is true.
 * Supports closing by clicking outside the content or pressing the `Escape` key.
 *
 * @component
 * @example
 * ```tsx
 * <Popup open={isOpen} onClose={() => setIsOpen(false)}>
 *   <p>This is the popup content.</p>
 * </Popup>
 * ```
 *
 * @remarks
 * - Locks body scroll when open.
 * - Automatically cleans up event listeners on unmount or when closed.
 *
 * @param props - {@link PopupProps} The properties for configuring the popup.
 * @returns {JSX.Element} The rendered popup element when open.
 */
const Popup = ({
  open,
  onClose,
  children,
  inputClassName = "sm:max-w-md sm:rounded-lg sm:shadow-xl w-full max-h-screen flex flex-col bg-white dark:bg-gray-800 inset-0 sm:inset-auto fixed sm:relative h-full sm:h-auto",
}: PopupProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(61,63,66,0.6)] animate-fade-in"
      style={{ backdropFilter: "blur(1px)" }}
      onClick={handleBackdropClick}
    >
      {/* Modal */}
      <div
        className={`${inputClassName}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Popup;
