import { Button } from "@/shared/components/commonUI/Buttons";
import { CheckboxInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { TextareaInput } from "@/shared/components/commonUI/inputs/TextareaInput";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

/**
 * Cancel job offer form page displaying available balance and allowing users to select a bank and enter an amount.
 * Includes validation for numeric input and a submit button for initiating withdrawal.
 */
export default function CancelJopOffer() {
  const { setISOpenSidebar } = useDrawerStore();

  const formCtx = useForm({
    defaultValues: {
      reason: "",
      remark: "",
      isChecked: false,
    },
  });

  const handleSubmit = (data: any) => {
    console.log(data);
    toast.success("Job offer cancelled successfully!");
    setISOpenSidebar(false);
  };

  return (
    <FormContainer methods={formCtx} onSubmit={handleSubmit}>
      <div className="w-full max-w-md mx-auto p-1 bg-gray-50 rounded-lg">
        <SelectField
          name="reason"
          label="Reason"
          required
          options={[
            { value: "reason1", label: "Reason 1" },
            { value: "reason2", label: "Reason 2" },
            { value: "reason3", label: "Reason 3" },
          ]}
        />

        {/* Remark */}
        <TextareaInput
          name="remark"
          label="Remark"
          required
          rules={{
            validate: (v: string) => v.length > 0,
          }}
        />

        {/* Checkbox */}
        <div className="flex items-center mb-6">
          <CheckboxInput
            name="isChecked"
            secondaryLabel="I hereby accept the"
          />
          <span className="text-sm pl-2">
            <a href="#" className="underline font-semibold">
              Cancellation and Policy
            </a>
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-4">
          <Button className="flex-1 bg-teal-900 text-white py-3 rounded-lg font-medium">
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium"
            type="submit"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </FormContainer>
  );
}
