import { useEffect, useRef } from 'react';

type PopupProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

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
const Popup = ({ open, onClose, children }: PopupProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  // keep the latest onClose in a ref so the effect below doesn't need to depend on it
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };

    document.addEventListener('keydown', handleEsc);

    // preserve previous overflow value then lock scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCloseRef.current();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[rgba(61,63,66,0.6)] animate-fade-in"
      style={{ backdropFilter: 'blur(1px)' }}
      onClick={handleBackdropClick}
    >
      {/* Modal */}
      <div className="
          w-full 
          sm:max-w-md sm:rounded-lg sm:shadow-xl
          max-h-screen 
          flex flex-col
          bg-white dark:bg-gray-800
          inset-0 
          sm:inset-auto 
          fixed 
          sm:relative
          h-full 
          sm:h-auto
        ">
        {children}
      </div>
    </div>
  );
};

export default Popup;