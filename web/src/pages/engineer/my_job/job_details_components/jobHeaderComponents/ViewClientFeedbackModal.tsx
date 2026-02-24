import { Button } from "@/shared/components/commonUI/Buttons";
import React from "react";
import { FaStar } from "react-icons/fa";
import { IoCloseSharp, IoPersonCircleOutline } from "react-icons/io5";

type ViewClientFeedbackModalProps = {
  onClose: () => void;
  clientName: string;
  clientImage?: string;
  rating?: number | string;
  review?: string;
};

/**
 * View Client Feedback Modal
 *
 * This component is used to display the feedback given by the client to the engineer.
 *
 * @param param0
 * @returns
 */

const ViewClientFeedbackModal: React.FC<ViewClientFeedbackModalProps> = ({
  onClose,
  clientName,
  clientImage,
  rating,
  review,
}) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          View Feedback From Client
        </h2>
        <Button
          type="button"
          variant="no_style"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          aria-label="Close"
        >
          <IoCloseSharp className="w-6 h-6" />
        </Button>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-start gap-4 mb-6">
          {clientImage ? (
            <img
              src={clientImage}
              alt=""
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <IoPersonCircleOutline
              aria-hidden="true"
              className="w-14 h-14 text-gray-400 dark:text-gray-500"
            />
          )}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {clientName}
            </h3>
            <div
              className="flex items-center gap-1"
              role="img"
              aria-label={`Rated ${rating || 0} out of 5 stars`}
            >
              {(() => {
                const safeRating = Math.max(
                  0,
                  Math.min(5, Math.round(Number(rating) || 0)),
                );
                return Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    aria-hidden="true"
                    className={`w-4 h-4 ${
                      i < safeRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-500"
                    }`}
                  />
                ));
              })()}
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
