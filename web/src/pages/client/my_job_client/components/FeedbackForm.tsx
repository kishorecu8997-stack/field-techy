import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface FeedbackFormProps {
  onSubmit?: (rating: number, feedback: string) => void;
  onClose?: () => void;
  initialRating?: number;
}

interface IFormInput {
  feedback: string;
}

/*
 * FeedbackForm
 *    - Displays a form to submit feedback
 * @param {FeedbackFormProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered FeedbackForm component.
 */
const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  onClose,
  initialRating = 1,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const methods = useForm<IFormInput>({
    defaultValues: {
      feedback: "",
    },
    mode: "onSubmit",
  });

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleFormSubmit = async (data: IFormInput) => {
    try {
      if (onSubmit) {
        await Promise.resolve(onSubmit(rating, data.feedback));
      }
      toast.success("Feedback Submitted Successfully");
      if (onClose) {
        onClose();
      }
      methods.reset();
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleFormSubmit}
      className="flex flex-col h-full"
    >
      <div className={`flex-1 overflow-y-auto px-3 space-y-3`}>
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              onClick={() => handleStarClick(star)}
              className={`text-7xl cursor-pointer transition-colors duration-200 ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              ★
            </div>
          ))}
        </div>
        <TextareaInput
          name="feedback"
          label="Add Feedback"
          placeholder="Add your feedback here..."
          required
        />
      </div>
      <div className="bg-white">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Submit Rating
        </Button>
      </div>
    </FormContainer>
  );
};

export default FeedbackForm;
