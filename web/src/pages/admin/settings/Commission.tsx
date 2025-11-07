import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { SettingsFormData } from "./types";
import { CommissionValidation } from "@/utils/validate";

/**
 * Commission settings page component.
 * Renders a simple form to set the commission percentage/value.
 * Uses react-hook-form for form state and validation, and shows a toast
 * on successful submit.
 *
 * @component
 * @returns {JSX.Element} The Commission settings form.
 */
export default function Commission() {
  /**
   * React Hook Form methods for managing the commission form state.
   */
  const methods = useForm<SettingsFormData>({
    defaultValues: {
      commission: "",
    },
  });

  /**
   * Handle form submit. Displays a success toast when the commission is saved.
   * @returns {void}
   */
  const handleSubmit = () => {
    // console.log("Profile Submitted");
    toast.success("Added Successfully!");
  };

  return (
    <div>
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-6 px-2 pb-4 w-full"
      >
        <div className="flex-1 w-1/2">
          <InputField
            placeholder="Commission"
            name="commission"
            label="Set Commission"
            required
            rules={{ validate: (v: string) => CommissionValidation(v) }}
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}
