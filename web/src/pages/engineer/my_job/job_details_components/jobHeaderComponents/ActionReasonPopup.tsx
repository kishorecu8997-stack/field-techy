import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs/TextareaInput";
import { useForm } from "react-hook-form";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { icons } from "@/config/icons";

interface ActionReasonPopupProps {
  title: string;
  label: string;
  submitLabel: string;
  onSubmit: (data: { reason: string }) => Promise<void>;
  onClose: () => void; 
}
/**
 * ActionReasonPopup
 *
 * A reusable popup form component to capture a reason from the user for actions like approval or rejection.
 *
 * Features:
 * - Displays a title with a close button on the top-right
 * - Includes a textarea input for entering a reason
 * - Uses `react-hook-form` with `FormContainer` for form state and validation
 * - Submit button triggers the provided `onSubmit` callback
 * - Close button triggers the `onClose` callback
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Title displayed at the top of the popup
 * @param {string} props.label - Label for the textarea input
 * @param {string} props.submitLabel - Text displayed on the submit button
 * @param {(data: { reason: string }) => Promise<void>} props.onSubmit - Callback called on form submission
 * @param {() => void} props.onClose - Callback to close the popup
 * @returns {JSX.Element} Rendered popup form
 */
export const ActionReasonPopup = ({
  title,
  label,
  submitLabel,
  onSubmit,
  onClose,
}: ActionReasonPopupProps) => {
  const methods = useForm<{ reason: string }>({
    defaultValues: { reason: "" },
  });

  const handleFormSubmit = async (data: { reason: string }) => {
    await onSubmit(data);
  };

  return (
    <FormContainer methods={methods} onSubmit={handleFormSubmit}>
      <div className="flex justify-between items-center mb-4 pb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <div
          className="cursor-pointer text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <icons.close className="w-5 h-5" />
        </div>
      </div>
      <TextareaInput
        name="reason"
        label={label}
        placeholder={`Enter ${label.toLowerCase()}`}
        required={`${label} is required`}
      />
      <div className="flex justify-end mt-3">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </FormContainer>
  );
};
