import React, { useRef } from "react";
import { FaStar } from "react-icons/fa";
import { IoCloseSharp, IoPersonCircleOutline } from "react-icons/io5";

type ViewClientFeedbackModalProps = {
  onClose: () => void;
  clientName: string;
  clientImage?: string;
  rating?: number;
  review?: string;
};

const ViewClientFeedbackModal: React.FC<ViewClientFeedbackModalProps> = ({
  onClose,
  clientName,
  clientImage,
  rating,
  review,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
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

      <div className="px-6 py-6">
        <div className="flex items-start gap-4 mb-6">
          {clientImage ? (
            <img
              src={clientImage}
              alt={clientName}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <IoPersonCircleOutline className="w-14 h-14 text-gray-400 dark:text-gray-600" />
          )}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {clientName}
            </h3>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-4 h-4 ${i < (rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {review || "No review provided"}
        </p>
      </div>
    </div>
  );
};

export default ViewClientFeedbackModal;
