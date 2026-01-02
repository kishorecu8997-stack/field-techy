import React, { useState, useEffect, useRef } from "react";
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
  const [submittedPayload, setSubmittedPayload] = useState<{
    rating: number;
    review: string;
  } | null>(null);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const TOAST_DISPLAY_DURATION_MS = 1000;
  const MIN_REVIEW_LENGTH = 10;

  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      setRating(0);
      setReview("");
      setError("");

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
    if (rating === 0) {
      setError("Please provide a star rating.");
      return;
    }
    if (review.trim().length === 0) {
      setError("Please write a review.");
      return;
    }
    if (review.trim().length < MIN_REVIEW_LENGTH) {
      setError(`Review must be at least ${MIN_REVIEW_LENGTH} characters long.`);
      return;
    }

    setError("");

    const payload = { rating, review: review.trim() };
    onSubmit?.(payload);

    setSubmittedPayload(payload);

    setShowToast(true);
    setRating(0);
    setReview("");

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

          <div className="relative z-10 w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl mx-2 sm:mx-0 ">
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
                  Minimum {MIN_REVIEW_LENGTH} characters.
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
