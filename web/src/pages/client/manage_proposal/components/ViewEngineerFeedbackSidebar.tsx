import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

type EngineerFeedback = {
  id: string;
  engineerName: string;
  engineerImage?: string;
  rating: number;
  review: string;
};

type ViewEngineerFeedbackSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  feedbackList?: readonly EngineerFeedback[] | EngineerFeedback[];
};

/**
 * ViewEngineerFeedbackSidebar Component
 *
 * Displays a sidebar showing feedback received from engineers.
 * Shows engineer profiles, ratings, and review messages.
 */
const ViewEngineerFeedbackSidebar: React.FC<ViewEngineerFeedbackSidebarProps> = ({
  isOpen,
  onClose,
  feedbackList = [],
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-gray-100 dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-teal-900 dark:bg-teal-950 px-6 py-4 flex items-center justify-between border-b border-teal-800 dark:border-teal-900">
          <h2 className="text-xl font-semibold text-white">
            Feedback From Engineers
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <IoCloseSharp className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {feedbackList.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No feedback available yet.
            </p>
          ) : (
            feedbackList.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                {/* Engineer Info */}
                <div className="flex items-start gap-3 mb-3">
                  {feedback.engineerImage && (
                    <img
                      src={feedback.engineerImage}
                      alt={feedback.engineerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {feedback.engineerName}
                    </h3>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating
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
                  {feedback.review}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ViewEngineerFeedbackSidebar;
