import type { GetUserRatingAndReviewsResponse } from "@/api";
import { Button } from "@/shared/components/commonUI/Buttons";
import React from "react";
import { FaStar } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

type ViewClientFeedbackModalProps = {
  onClose: () => void;
  reviews: GetUserRatingAndReviewsResponse;
  className?: string;
  label: string;
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
  className = "w-full",
  reviews,
  label,
}) => {
  return (
    <div className={className}>
      <div className="py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 dark:from-teal-400 dark:to-teal-200 bg-clip-text text-transparent">
          {label}
        </h2>
        <Button
          type="button"
          variant="no_style"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <IoCloseSharp className="w-6 h-6" />
        </Button>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-4">
        {!reviews || reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FaStar className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No feedback available yet
            </p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div
              key={index}
              className="group relative p-5 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-teal-500/30 dark:hover:border-teal-500/30 transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(20,184,166,0.1)] overflow-hidden"
            >
              {/* Quote icon watermark */}
              <div className="absolute -top-2 right-4 text-7xl text-teal-500/5 dark:text-teal-400/5 font-serif leading-none select-none pointer-events-none group-hover:scale-110 group-hover:text-teal-500/10 transition-transform duration-500">
                &quot;
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="relative shrink-0">
                  {review?.reviewerProfilePictureUrl ? (
                    <>
                      <img
                        src={review.reviewerProfilePictureUrl}
                        alt={review.reviewerName || "Reviewer"}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const nextEl = (e.target as HTMLImageElement)
                            .nextElementSibling;
                          if (nextEl) nextEl.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden w-12 h-12 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/50 dark:to-teal-800/50 flex flex-col items-center justify-center text-teal-700 dark:text-teal-300 font-bold tracking-wider ring-2 ring-white dark:ring-gray-800 shadow-sm text-lg">
                        {review?.reviewerName?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                    </>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/50 dark:to-teal-800/50 flex flex-col items-center justify-center text-teal-700 dark:text-teal-300 font-bold tracking-wider ring-2 ring-white dark:ring-gray-800 shadow-sm text-lg">
                      {review?.reviewerName?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {review.reviewerName || "Anonymous Client"}
                    </h3>

                    <div
                      className="flex items-center gap-1 shrink-0"
                      role="img"
                      aria-label={`Rated ${review.rating || 0} out of 5 stars`}
                    >
                      {(() => {
                        const safeRating = Math.max(
                          0,
                          Math.min(5, Math.round(Number(review.rating) || 0)),
                        );
                        return Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            aria-hidden="true"
                            className={`w-3.5 h-3.5 ${
                              i < safeRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-200 dark:text-gray-600"
                            } transition-transform duration-300 group-hover:scale-110`}
                            style={{ transitionDelay: `${i * 50}ms` }}
                          />
                        ));
                      })()}
                    </div>
                  </div>

                  <div className="relative">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-2 border-teal-500/30 pl-3">
                      {review.review || "No review provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewClientFeedbackModal;
