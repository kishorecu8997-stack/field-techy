import React, { useState, useEffect } from "react";
import { StarRating } from "./StarRating";
import { Button } from "@/shared/components/commonUI/Buttons";

type ReviewClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  onSubmit?: (payload: { rating: number; review: string }) => void;
};

const ReviewClientModal: React.FC<ReviewClientModalProps> = ({
  isOpen,
  onClose,
  clientName,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setReview("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (rating === 0 && review.trim().length === 0) {
      setError("Please provide a rating and write a review.");
      return;
    }
    if (rating === 0) {
      setError("Please provide a star rating.");
      return;
    }
    if (review.trim().length === 0) {
      setError("Please write a review.");
      return;
    }
    if (review.trim().length < 10) {
      setError("Review must be at least 10 characters long.");
      return;
    }

    setError("");

    const payload = { rating, review: review.trim() };
    onSubmit?.(payload);


    setShowToast(true);

    setRating(0);
    setReview("");

    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1000); // 1000 ms = 1 second
  };

  if (!isOpen && !showToast) return null;

  return (
    <div className="relative">
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-xl shadow-xl">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Rate {clientName}
              </h3>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </Button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <StarRating
                value={rating}
                onChange={(value) => {
                  setRating(value);
                  setError("");
                }}
                size="lg"
                label="Your rating"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your review
                </label>
                <textarea
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                    setError("");
                  }}
                  placeholder="Share your experience working with this client…"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400"
                  rows={5}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 10 characters.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>

              <Button variant="primary" onClick={handleSubmit}>
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-[22rem] transition-opacity duration-300">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-semibold mb-1">Review Submitted</div>
              <div>Rating: {rating}★</div>
              <div className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-3">
                {review}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewClientModal;
