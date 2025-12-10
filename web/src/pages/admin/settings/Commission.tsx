import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { SettingsFormData } from "./types";
import { CommissionValidation } from "@/utils/validate";
import { usePopupStore } from "@/shared/store/popupStore";

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
  const methods = useForm<SettingsFormData>({
    defaultValues: {
      commission: "",
    },
  });

  /**
   * Handle form submit. Displays a success toast when the commission is saved.
   * @returns {void}
   */

  const { showPopup } = usePopupStore();

  const handleSaveConfirmation = async (data: SettingsFormData) => {
    await showPopup({
      title: "Add Commission",
      body: "Are you sure you want to save this details?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          action: async (close) => {
            console.log("Deleting job:", data);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Commission added successfully!");
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = () => {
    handleSaveConfirmation(methods.getValues());
  };

  return (
    <div>
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-2 px-2 pb-4 w-full"
      >
        <div className="flex-1 w-1/2">
          <InputField
            placeholder="Commission"
            name="commission"
            label="Set Commission(%)"
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
