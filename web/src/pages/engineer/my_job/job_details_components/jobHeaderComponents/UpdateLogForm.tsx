import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import type { ProgressUpdate, UpdateLogFormFields } from "../../types.d";
import { toast } from "react-toastify";
import {
  UPDATE_LOG_DEFAULTS,
  UPDATE_LOG_LABELS,
  UPDATE_LOG_MESSAGES,
} from "@/constants/updateLogConstants";
import { useEngineerAddWorkLog } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { getJobLogs } from "@/api";
import { getJobLogsQueryKey } from "@/api/@tanstack/react-query.gen";
import { apiClient } from "@/shared/apiServices/apiClient";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateLogFormProps {
  onClose: () => void;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  assignmentId?: number;
}
/**
 * UpdateLogForm component for submitting job update logs.
 * Includes title, notes, and optional file attachments.
 * Shows a confirmation popup before submitting the update.
 * Sends multiple progress updates with different statuses for UI display.
 * Uses react-hook-form for form handling and validation.
 */
const UpdateLogForm = ({ onClose, assignmentId }: UpdateLogFormProps) => {
  const formCtx = useForm<UpdateLogFormFields>({
    defaultValues: UPDATE_LOG_DEFAULTS,
  });
  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();

  // Mutation for adding work log
  const { mutateAsync: addWorkLog } = useEngineerAddWorkLog({
    assignmentId,
    onSuccess: async () => {
      toast.success("Log submitted successfully!");
      // Force refetch the job logs to update timeline immediately
      if (assignmentId) {
        try {
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId },
          });
          const exactQueryKey = getJobLogsQueryKey({ path: { assignmentId } });
          queryClient.setQueryData(exactQueryKey, response.data);
        } catch (error) {
          console.error("Failed to refetch timeline:", error);
          queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
        }
      }
      onClose();
    },
    onError: (error) => {
      console.error("Failed to submit log:", error);
      toast.error("Failed to submit log. Please try again.");
    },
  });

  const handleSubmit = async (data: UpdateLogFormFields) => {
    await showPopup({
      title: UPDATE_LOG_LABELS.title,
      body: UPDATE_LOG_MESSAGES.modalBody,
      actionButtons: [
        {
          label: UPDATE_LOG_LABELS.modalCancel,
          value: null,
          variant: "outline",
        },
        {
          label: UPDATE_LOG_LABELS.modalSubmit,
          value: "submit",
          variant: "primary",
          action: async (close) => {
            // Call the real API to submit the work log
            if (assignmentId) {
              const attachment = data.attachments?.[0];
              
              // Prepare attachment metadata if file exists
              const attachmentMeta = attachment
                ? {
                    filename: attachment.name,
                    size: attachment.size,
                    mimeType: attachment.type,
                  }
                : undefined;

              // Prepare request body - only include attachment if file exists
              // Prepare request body - only include attachment if file exists
              // Note: Backend API may not support title yet, but we send it anyway
              const requestBody: any = {
                assignmentId,
                logType: "progress_update",
                title: data.title,
                details: data.notes,
              };

              // Only add attachment if file exists
              if (attachmentMeta) {
                requestBody.attachment = attachmentMeta;
              }

              // Call the API to submit work log and get response with upload URL
              const response = await addWorkLog({
                body: requestBody,
              });

              // Upload file to S3 if URL is provided in response
              if (attachment && response.attachmentUrl) {
                await fetch(response.attachmentUrl, {
                  method: "PUT",
                  body: attachment,
                  headers: { "Content-Type": attachment.type },
                });
              }
            } else {
              toast.error("No assignment found. Cannot submit log.");
            }
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col p-6 gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">
          {UPDATE_LOG_LABELS.title}
        </h2>
        <span className="text-sm text-gray-500">
          {UPDATE_LOG_LABELS.jobIdLabel} {UPDATE_LOG_LABELS.jobId}
        </span>
      </div>
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <div className="mb-2">
          <InputField
            name="title"
            label={UPDATE_LOG_LABELS.titleLabel}
            required
            placeholder={UPDATE_LOG_LABELS.titlePlaceholder}
            rules={{ required: UPDATE_LOG_LABELS.titleRequiredMessage }}
          />
        </div>
        <div className="mb-2">
          <TextareaInput
            name="notes"
            label={UPDATE_LOG_LABELS.notesLabel}
            required
            placeholder={UPDATE_LOG_LABELS.notesPlaceholder}
            rules={{ required: UPDATE_LOG_LABELS.notesRequiredMessage }}
          />
        </div>
        <FileUpload
          name="attachments"
          label={UPDATE_LOG_LABELS.attachmentLabel}
          accept=".pdf,.jpeg,.jpg,.png"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            className="px-4"
            onClick={onClose}
            type="button"
          >
            {UPDATE_LOG_LABELS.cancel}
          </Button>
          <Button
            className="bg-teal-800 hover:bg-teal-900 text-white px-5"
            type="submit"
          >
            {UPDATE_LOG_LABELS.submit}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default UpdateLogForm;
