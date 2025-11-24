import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { CheckboxInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { TextareaInput } from "@/shared/components/commonUI/inputs/TextareaInput";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Cancel job offer form page displaying available balance and allowing users to select a bank and enter an amount.
 * Includes validation for numeric input and a submit button for initiating withdrawal.
 */
export default function CancelJopOffer() {
  const { setISOpenSidebar, setActiveKey } = useDrawerStore();
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();

  const formCtx = useForm({
    defaultValues: {
      reason: "",
      remark: "",
      isChecked: false,
    },
  });

  const handleSubmit = async () => {
    await showPopup({
      title: "Decline Job",
      body: "Are you sure you want to decline this job offer?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes, decline",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Job offer declined successfully");
            close(true);
            setActiveKey("cancelOffer");
            setISOpenSidebar(false);
            navigate(absoluteUrls.engineer.home.my_jobs, { replace: true });
          },
        },
      ],
    });
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
          <Button
            variant="secondary"
            className="flex-1  py-3 rounded-lg font-medium"
            onClick={()=> setISOpenSidebar(false)}  
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1 py-3 rounded-lg font-medium"
            type="submit"
          >
            Decline
          </Button>
        </div>
      </div>
    </FormContainer>
  );
}
