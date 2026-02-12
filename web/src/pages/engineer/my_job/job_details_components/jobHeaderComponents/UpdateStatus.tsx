import { icons } from "@/config/icons";
import type { EngineerStatusUpdate } from "@/pages/engineer/auth/components/profile_setup/updated_profile_setup/types";
import { validateDescription } from "@/pages/engineer/home/validation";
import {
  useEngineerAddWorkLog,
  useEngineerRequestStart,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * UpdateStatus Component
 * Renders the Update Status form for the Manage Proposal page.
 * @param {UpdateStatusProps} props - Configuration props including the engineer object
 * @returns {JSX.Element} The rendered Update Status form
 * */
const UpdateStatus = ({ onClose }: { onClose: () => void }) => {
  const { jobId } = useParams<{ jobId: string }>();

  const { mutateAsync: requestStart } = useEngineerRequestStart();
  const { mutateAsync: addWorkLog } = useEngineerAddWorkLog();
  // const { mutateAsync: uploadFile } = useAppUploadProfileFile();
  // const { mutateAsync: markFileUploaded } = useAppMarkProfileFileUploaded();

  const formCtx = useForm<EngineerStatusUpdate>({
    defaultValues: {
      id: jobId ?? undefined,
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
            try {
              if (!jobId) {
                toast.error("Job ID missing");
                return;
              }

              // Handle File Upload if present
              let attachmentMetadata = undefined;
              if (data.workScreenShot && data.workScreenShot.length > 0) {
                const file = data.workScreenShot[0];
                console.log(file);

                // Replace the correct API
                // 1. Get presigned URL
                // const uploadRes = await uploadFile({
                //   body: {
                //     fileType: "WORK_SCREEN_SHOT",
                //     filename: file.name,
                //     mimeType: file.type,
                //     size: file.size,
                //   },
                //   headers: { authorization: "" },
                // });

                // if (uploadRes.uploadUrl) {
                //   // 2. Upload to S3
                //   await axios.put(uploadRes.uploadUrl, file, {
                //     headers: { "Content-Type": file.type },
                //   });

                //   // 3. Mark as uploaded
                //   await markFileUploaded({
                //     body: {
                //       fileId: Number(uploadRes.fileId),
                //     },
                //     headers: { authorization: "" },
                //   });

                //   attachmentMetadata = {
                //     filename: file.name,
                //     mimeType: file.type,
                //     size: file.size,
                //   };
                // }
              }

              // Handle Status Update
              if (data.status === "in-progress") {
                await requestStart({
                  body: { assignmentId: Number(jobId) },
                });
              } else {
                // For 'check-in', 'delayed', 'approved' -> use Work Log
                await addWorkLog({
                  body: {
                    assignmentId: Number(jobId),
                    logType: data.status,
                    details: data.remarks,
                    attachment: attachmentMetadata,
                  },
                });
              }

              toast.success("Status updated successfully");
              close(true);
              onClose();
            } catch (error) {
              console.error("Update status failed:", error);
              toast.error("Failed to update status");
              close(true); // Close popup even on error? Or keep it open? Usually close.
            }
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
            { label: "In Progress", value: "in-progress" },
            { label: "Check In", value: "check-in" },
            { label: "Delayed", value: "delayed" },
            { label: "Approved", value: "approved" },
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
          required={false}
          accept=".pdf,.jpeg,.jpg,.png"
          maxPages={5}
          validatePDF={true}
        />
        <Button
          type="submit"
          disabled={formCtx.formState.isSubmitting}
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition mt-5"
        >
          Submit
        </Button>
      </FormContainer>
    </div>
  );
};

export default UpdateStatus;
