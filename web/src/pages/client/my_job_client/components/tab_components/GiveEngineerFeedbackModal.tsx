import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { StarRating } from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/StarRating";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs/TextareaInput";
import { assetsConfig } from "@/assets";

type GiveEngineerFeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  engineerName: string;
  engineerRole: string;
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
 * GiveEngineerFeedbackModal Component
 *
 * Displays a modal dialog allowing clients to submit a star rating and review about the engineer
 * after all timeline items are approved.
 * Features a prominent title "Your Rating & Review" with accessible form validation.
 *
 * @returns {JSX.Element | null} The rendered modal component or null if not open
 */
const GiveEngineerFeedbackModal: React.FC<GiveEngineerFeedbackModalProps> = ({
  isOpen,
  onClose,
  engineerName,
  engineerRole,
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

  const formMethods = useForm<FormValues>({
    defaultValues: {
      review: "",
    },
  });
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

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    const payload = { rating, review: (data.review || "").trim() };
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
              className="relative z-10 w-full max-w-full sm:max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-2 sm:mx-0"
            >
              {/* Logo Section */}
              <div className="px-6 pt-8 pb-4 flex flex-col items-center">
                <div className="w-20 h-20 bg-teal-700 rounded-full flex items-center justify-center mb-6">
                  <img
                    src={assetsConfig.logos.ftLogoWhite}
                    alt="FT Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                  Your Rating & Review
                </h2>
                {/* Subtitle */}
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <p>How will you rate your overall experience with</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1">
                    {engineerName} · {engineerRole}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-6">
                {/* Star Rating */}
                <div className="flex justify-center">
                  <StarRating
                    value={rating}
                    onChange={(value) => {
                      setRating(value);
                      setError((prev) => ({ ...prev, rating: undefined }));
                    }}
                    size="lg"
                  />
                </div>
                {error.rating && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center mt-1">
                    {error.rating}
                  </p>
                )}

                {/* Review Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Can you tell more?
                  </label>
                  <TextareaInput
                    name="review"
                    placeholder="The over all experience was good and her working style is good and focused."
                    required={false}
                  />
                  {error.review && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {error.review}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="px-6"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-teal-900 hover:bg-teal-800 text-white px-6"
                >
                  Submit
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}

      {/* Success Toast */}
      {showToast && submittedPayload && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 px-5 py-4 rounded-lg shadow-lg">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-semibold text-green-600 dark:text-green-400 mb-1">
                Review Submitted Successfully
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Rating: {submittedPayload.rating}★
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                {submittedPayload.review}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiveEngineerFeedbackModal;
