import { icons } from "@/config/icons";
import type { EngineerStatusUpdate } from "@/pages/engineer/auth/components/profile_setup/updated_profile_setup/types";
import { validateDescription } from "@/pages/engineer/home/validation";
import {
  useEngineerScreenShotUpload,
  useEngineerUpdateJobStatus,
} from "@/shared/apiServices/engineer/engineerService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

/**
 * UpdateStatus Component
 * Renders the Update Status form for the Manage Proposal page.
 * @param {UpdateStatusProps} props - Configuration props including the engineer object
 * @returns {JSX.Element} The rendered Update Status form
 * */
const UpdateStatus = ({ onClose }: { onClose: () => void }) => {
  const { mutate: updateJobScreenShot } = useEngineerScreenShotUpload();
  const { mutate: updateJobStatus } = useEngineerUpdateJobStatus({
    onSuccess: (data, variable) => {
      updateJobScreenShot({
        engineerId: data.engineerId,
        documentType: "WORK_SCREEN_SHOT",
        file: variable.workScreenShot ?? null,
        metadata: {
          workScreenshotId: "a68daf89-198a-4552-a6fa-d4df0eada914",
          remarks: variable.remarks ?? null,
          id: data.id,
          engineerJobId: data.engineerId,
          activityDate: new Date().toISOString().split("T")[0],
        },
      });
      toast.success("Your status was updated");
    },

    onError: (error) => {
      console.error("Update status failed:", error);
      toast.error("Failed to update status");
    },
  });

  const formCtx = useForm<EngineerStatusUpdate>({
    defaultValues: {
      id: "616bedff-31ea-44c9-aac8-333bd72049e9",
      status: "",
      remarks: "",
      workScreenShot: null,
    },
  });

  const { showPopup } = usePopupStore();
  const handleSubmit = async (data: EngineerStatusUpdate) => {
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
            await updateJobStatus(data);
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
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <SelectField
          name="status"
          label="Status"
          required
          options={[
            { label: "In Progress", value: "inprogress" },
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
          accept=".pdf,.jpeg,.jpg,.png"
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
