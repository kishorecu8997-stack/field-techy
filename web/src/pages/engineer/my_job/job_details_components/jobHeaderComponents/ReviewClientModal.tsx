import React, { useState, useEffect, useRef } from "react";
import { StarRating } from "./StarRating";
import { Button } from "@/shared/components/commonUI/Buttons";

type ReviewClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  onSubmit?: (payload: { rating: number; review: string }) => void;
};

/**
 * ReviewClientModal Component
 *
 * Displays a modal dialog allowing users to submit a star rating and written review for a client.
 * Includes validation logic from `utils/reviewValidation.ts` and accessibility features.
 *
 * @component
 * @param {ReviewClientModalProps} props - Props for the ReviewClientModal component.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {string} props.clientName - Name of the client being reviewed.
 * @param {(payload: { rating: number; review: string }) => void} [props.onSubmit] - Optional callback when review is submitted.
 *

* @returns {JSX.Element | null} The rendered modal component or null if not open.
 *
 * @example
 * <ReviewClientModal
 *   isOpen={true}
 *   onClose={() => setIsReviewOpen(false)}
 *   clientName="John Doe"
 *   onSubmit={(payload) => console.log(payload)}
 * />
 */

const ReviewClientModal: React.FC<ReviewClientModalProps> = ({
  isOpen,
  onClose,
  clientName,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [submittedPayload, setSubmittedPayload] = useState<{
    rating: number;
    review: string;
  } | null>(null);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const TOAST_DISPLAY_DURATION_MS = 1000;

  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      setRating(0);
      setReview("");
      setError(null);

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

  const handleSubmit = () => {
    const payload = { rating, review: review.trim() };
    onSubmit?.(payload);
    setSubmittedPayload(payload);
    setShowToast(true);

    setRating(0);
    setReview("");
    setError(null);

    setTimeout(() => {
      setShowToast(false);
      setSubmittedPayload(null);
      onClose();
    }, TOAST_DISPLAY_DURATION_MS);
  };

  if (!isOpen && !showToast) return null;

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

          <div className="relative z-10 w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl mx-2 sm:mx-0">
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
                  setError(null);
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
                  onChange={(e) => setReview(e.target.value)}
                  placeholder={`Share your experience working with ${clientName}…`}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400"
                  rows={4}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
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
      {showToast && submittedPayload && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center sm:justify-end gap-3">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-semibold mb-1">Review Submitted</div>
              <div>Rating: {submittedPayload.rating}★</div>
              <div className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-3">
                {submittedPayload.review}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewClientModal;
