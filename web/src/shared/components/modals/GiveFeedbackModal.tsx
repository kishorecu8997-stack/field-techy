import { assetsConfig } from "@/assets";
import { useCreateRateAndReviewAssignment } from "@/shared/apiServices/commonOpenApiService";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import { TextareaInput } from "@/shared/components/commonUI/inputs/TextareaInput";
import { StarRating } from "@/shared/components/commonUI/StarRating";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../commonUI/Buttons";
import { FormContainer } from "../commonUI/inputs/FormContainer";

type GiveFeedbackModalProps = {
  onClose?: (result: unknown) => void;
  title?: string;
  targetName: string;
  targetRole?: string;
  placeholder?: string;
  assignmentId?: number;
  regionId?: number;
};

type FormValues = {
  review: string;
  rating: number;
};

/**
 * GiveFeedbackModal Component
 *
 * A unified modal dialog allowing users to submit a star rating and review.
 * Used for both client-to-engineer and engineer-to-client feedback.
 */
const GiveFeedbackModal: React.FC<GiveFeedbackModalProps> = ({
  title = "Your Rating & Review",
  targetName,
  targetRole,
  placeholder = "Share your feedback...",
  onClose,
  assignmentId,
  regionId,
}) => {

  // const [searchParams] = useSearchParams();
  // const regionId = searchParams.get("regionId");

  const { mutate: submitFeedback, isPending } =
    useCreateRateAndReviewAssignment({
      onSuccess: () => {
        toast.success("Feedback submitted successfully!");
        onClose?.(true);
      },
      onError: (error: unknown) => {
        toast.error(
          GlobalApiErrorHandler.handle(error, "Failed to submit feedback")
            .message,
        );
      },
    });

  const formCtx = useForm<FormValues>({
    defaultValues: {
      review: "",
      rating: 0,
    },
  });

  const {
    control,
    formState: { errors },
  } = formCtx;

  const handleSubmit = (data: FormValues) => {
    if (assignmentId === null || assignmentId === undefined) {
      toast.error("Assignment ID is missing");
      return;
    }

    submitFeedback({
      body: {
        assignmentId,
        rating: data.rating,
        review: (data.review || "").trim(),
        regionId,
      },
    });
  };

  return (
    <div className="w-full h-fit px-2">
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <div className="pt-4 pb-4 flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-700 rounded-full flex items-center justify-center mb-4">
            <img
              src={assetsConfig.logos.ftLogoWhite}
              alt="FT Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-1">
            {title}
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <p>How will you rate your overall experience with</p>
            <p className="font-semibold text-gray-900 dark:text-white mt-1">
              {targetName}
              {targetRole ? ` · ${targetRole}` : ""}
            </p>
          </div>
        </div>

        <div className="py-4 space-y-6">
          <div className="flex flex-col items-center w-full">
            <Controller
              control={control}
              name="rating"
              rules={{
                required: "Rating is required",
                min: { value: 1, message: "Rating is required" },
              }}
              render={({ field }) => (
                <StarRating
                  value={field.value}
                  onChange={field.onChange}
                  size="lg"
                />
              )}
            />
            {errors.rating && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center mt-2">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Can you tell more?
            </label>
            <TextareaInput
              name="review"
              placeholder={placeholder}
              required={false}
            />
            {errors.review && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.review.message}
              </p>
            )}
          </div>
        </div>

        <div className="border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="px-6"
            onClick={() => onClose?.(null)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-teal-900 hover:bg-teal-800 text-white px-6"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default GiveFeedbackModal;
