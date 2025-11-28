import { icons } from "@/config/icons";
import { validateDescription } from "@/pages/engineer/home/validation";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


const UpdateStatus = ({ onClose }: { onClose: () => void }) => {
  const FormCtx = useForm();
  const { showPopup } = usePopupStore();

  const handleSubmit = async () => {
    console.log("Submitted");
    await showPopup({
      title: "Update Status",
      body: "Are you sure you want to update this job status?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Job status updated successfully!");
            close(true);
            onClose();
          },
        },
      ],
    });
  };
  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-end">
        <div
          className="cursor-pointer text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <icons.close className="w-6 h-6" />
        </div>
      </div>
      <div className="text-xl text-gray-900 dark:text-white font-bold text-center">
        Update Status
      </div>
      <FormContainer methods={FormCtx} onSubmit={handleSubmit}>
        <SelectField
          name="status"
          label="Status"
          required
          options={[
            { label: "In Progress", value: "in-progress" },
            { label: "Completed", value: "completed" },
          ]}
        />
        <TextareaInput
          name="remarks"
          label="Remarks"
          required
          rules={validateDescription(5, 2000, "remarks")}
        />
        <FileUpload
          name="workScreenShot"
          label="Work Screenshot"
          required
          accept=".pdf"
          maxPages={5}
          validatePDF={true}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition mt-5"
        >
          Submit
        </Button>
      </FormContainer>
    </div>
  );
};

export default UpdateStatus;