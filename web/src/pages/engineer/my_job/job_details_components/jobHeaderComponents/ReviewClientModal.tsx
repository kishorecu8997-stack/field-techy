import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { StarRating } from "./StarRating";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs/TextareaInput";
type ReviewClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  onSubmit?: (payload: { rating: number; review: string }) => void;
};
type FormValues = {
  review: string;
};
type FormError = {
  rating?: string;
  review?: string;
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
  const [showToast, setShowToast] = useState<boolean>(false);
  const [error, setError] = useState<FormError>({});

  const [submittedPayload, setSubmittedPayload] = useState<{
    rating: number;
    review: string;
  } | null>(null);
  const TOAST_DISPLAY_DURATION_MS = 1000;

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const formMethods = useForm<FormValues>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      setRating(0);

      setTimeout(() => closeBtnRef.current?.focus(), 0);
    } else if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const onFormSubmit = (data: FormValues) => {
    const errors: FormError = {};

    if (rating === 0) errors.rating = "Rating is required";
    if (!data.review.trim()) errors.review = "Review is required";

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    const payload = { rating, review: data.review.trim() };
    onSubmit?.(payload);
    setSubmittedPayload(payload);
    setShowToast(true);

    setRating(0);
    reset();

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
          <FormProvider {...formMethods}>
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="relative z-10 w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl mx-2 sm:mx-0"
            >
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
                    setError((prev) => ({ ...prev, rating: undefined })); // clear rating error
                  }}
                  size="lg"
                  label="Your rating"
                />
                {error.rating && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {error.rating}
                  </p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your review
                  </label>
                  <TextareaInput
                    name="review"
                    placeholder={`Share your experience working with ${clientName}…`}
                  />
                  {error.review && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {error.review}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>

                <Button variant="primary" onClick={handleSubmit(onFormSubmit)}>
                  Submit Review
                </Button>
              </div>
            </form>
          </FormProvider>
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
