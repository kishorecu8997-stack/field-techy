import { assetsConfig } from "@/assets";
import { TextareaInput } from "@/shared/components/commonUI/inputs/TextareaInput";
import { StarRating } from "@/shared/components/commonUI/StarRating";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../commonUI/Buttons";

type GiveFeedbackModalProps = {
    onClose?: (result: unknown) => void;
    title?: string;
    targetName: string;
    targetRole?: string;
    placeholder?: string;
};

type FormValues = {
    review: string;
};

type FormError = {
    rating?: string;
    review?: string;
};

/**
 * GiveFeedbackModal Component
 *
 * A unified modal dialog allowing users to submit a star rating and review.
 * Used for both client-to-engineer and engineer-to-client feedback.
 *
 * @returns {JSX.Element | null} The rendered modal component or null if not open
 */
const GiveFeedbackModal: React.FC<GiveFeedbackModalProps> = ({
    title = "Your Rating & Review",
    targetName,
    targetRole,
    placeholder = "Share your feedback...",
    onClose,
}) => {
    const [rating, setRating] = useState<number>(0);
    const [error, setError] = useState<FormError>({});

    const formMethods = useForm<FormValues>({
        defaultValues: {
            review: "",
        },
    });
    const { handleSubmit } = formMethods;

    const onFormSubmit = (data: FormValues) => {
        const errors: FormError = {};

        if (rating === 0) errors.rating = "Rating is required";

        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }

        const payload = { rating, review: (data.review || "").trim() };
        console.log("Feedback Payload:", payload);
        // Add your API call here
        onClose?.(payload);
    };

    return (
        <div className="w-full h-fit">
            <FormProvider {...formMethods}>
                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className="flex flex-col"
                >
                    {/* Logo Section */}
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
                                {targetName}{targetRole ? ` · ${targetRole}` : ""}
                            </p>
                        </div>
                    </div>

                    <div className="py-4 space-y-6">
                        <div className="flex justify-center w-full">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Can you tell more?
                            </label>
                            <TextareaInput
                                name="review"
                                placeholder={placeholder}
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
                    <div className=" border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 ">
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
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default GiveFeedbackModal;
