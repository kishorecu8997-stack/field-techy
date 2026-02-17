import React, { useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

type ViewClientFeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientImage?: string;
  rating?: number;
  review?: string;
};

const ViewClientFeedbackModal: React.FC<ViewClientFeedbackModalProps> = ({
  isOpen,
  onClose,
  clientName,
  clientImage,
  rating,
  review,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    } else if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="relative">
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-2 sm:mx-0">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                View Feedback From Client
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <IoCloseSharp className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {/* Client Info */}
              <div className="flex items-start gap-4 mb-6">
                {clientImage && (
                  <img
                    src={clientImage}
                    alt={clientName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {clientName}
                  </h3>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < (rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {review || "No review provided"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewClientFeedbackModal;
