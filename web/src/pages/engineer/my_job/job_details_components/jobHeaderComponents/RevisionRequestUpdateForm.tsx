import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { formatDateTime } from "@/utils/formatDateTime";
import type {
  RevisionRequestUpdateFormProps,
  RevisionUpdateFields,
} from "../../types.d";
import {
  REVISION_UPDATE_DEFAULTS,
  REVISION_UPDATE_LABELS,
  REVISION_UPDATE_MESSAGES,
  REVISION_UPDATE_STATUS,
  REVISION_UPDATE_COLORS,
} from "@/constants/revisionUpdateConstants";
import {
  useEngineerSubmitRevision,
  useMarkWorkLogFileUploaded,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { getJobLogs } from "@/api";
import { getJobLogsQueryKey } from "@/api/@tanstack/react-query.gen";
import { apiClient } from "@/shared/apiServices/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

/**
 * Revision request/update form for engineers to send notes and optional attachments.
 * Uses react-hook-form with shared inputs for validation and file uploads.
 * Shows a confirmation popup before emitting progress updates to the timeline.
 * Calls the API to submit revision when assignmentId, logId, and revisionId are provided.
 * Emits waiting/approved status updates with timestamps and accent colors.
 * Surfaces success toast and supports optional onClose callback to dismiss.
 */
const RevisionRequestUpdateForm = ({
  onClose,
  onAddProgressUpdate,
  assignmentId,
  logId,
  revisionId,
}: RevisionRequestUpdateFormProps) => {
  const formCtx = useForm<RevisionUpdateFields>({
    defaultValues: REVISION_UPDATE_DEFAULTS,
  });

  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();
  const regionId = useUserSessionStore.getState().session?.regionId;


  const refetchTimeline = async () => {
    if (!assignmentId) return;
    try {
      const response = await getJobLogs({
        client: apiClient,
        path: { assignmentId },
        query: { regionId }
      });
      const exactQueryKey = getJobLogsQueryKey({ path: { assignmentId } });
      queryClient.setQueryData(exactQueryKey, response.data);
    } catch (error) {
      console.error("Failed to refetch timeline:", error);
      queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
    }
  };

  // Mutation for submitting revision
  const { mutateAsync: submitRevision } = useEngineerSubmitRevision({
    assignmentId,
    onError: (error) => {
      console.error("Failed to submit revision:", error);
      toast.error("Failed to submit revision. Please try again.");
    },
  });

  // Mutation for marking worklog file as uploaded
  const { mutateAsync: markFileUploaded } = useMarkWorkLogFileUploaded({
    onError: (error) => {
      console.error("Failed to mark file as uploaded:", error);
    },
  });

  const handleSubmit = async (_data: RevisionUpdateFields) => {
    void _data;
    await showPopup({
      title: REVISION_UPDATE_LABELS.title,
      body: REVISION_UPDATE_MESSAGES.modalBody,
      actionButtons: [
        {
          label: REVISION_UPDATE_LABELS.modalCancel,
          value: null,
          variant: "outline",
        },
        {
          label: REVISION_UPDATE_LABELS.modalSubmit,
          value: "submit",
          variant: "primary",
          action: async (close) => {
            const attachment = formCtx.getValues().attachments?.[0];
            const attachmentName = attachment?.name;
            const notes = formCtx.getValues().notes;

            // Call the API if we have all required IDs
            if (assignmentId && logId && revisionId) {
              try {
                // Submit revision and get response with upload URL
                const response = await submitRevision({
                  body: {
                    assignmentId,
                    logId,
                    revisionId,
                    content: notes,
                    regionId,
                    attachment: attachment
                      ? {
                        filename: attachment.name,
                        size: attachment.size,
                        mimeType: attachment.type,
                      }
                      : undefined,
                  },
                });

                // Upload file to S3 if upload URL is provided in response
                if (attachment && response.attachmentUploadUrl) {
                  await fetch(response.attachmentUploadUrl, {
                    method: "PUT",
                    body: attachment,
                    headers: { "Content-Type": attachment.type },
                  });

                  // Mark file as uploaded in the database
                  await markFileUploaded({
                    body: {
                      assignmentId,
                      target: "revision",
                      revisionId: response.revisionId || revisionId,
                      logId,
                    },
                  });
                }

                await refetchTimeline();
                toast.success("Revision submitted successfully!");
              } catch (error) {
                console.error("Failed to submit revision:", error);
                toast.error("Failed to submit revision. Please try again.");
              }
            } else {
              // Fallback to local state update if no API data available
              toast.success(REVISION_UPDATE_MESSAGES.submitSuccess);
              onAddProgressUpdate?.({
                title: REVISION_UPDATE_LABELS.title,
                description: notes,
                attachmentName,
                timestamp: formatDateTime(),
                statusText: REVISION_UPDATE_STATUS.approved,
                statusColor: REVISION_UPDATE_COLORS.approved,
                accentColor: REVISION_UPDATE_COLORS.accent,
              });
              onAddProgressUpdate?.({
                title: REVISION_UPDATE_LABELS.title,
                description: notes,
                attachmentName,
                timestamp: formatDateTime(),
                statusText: REVISION_UPDATE_STATUS.waiting,
                statusColor: REVISION_UPDATE_COLORS.waiting,
                accentColor: REVISION_UPDATE_COLORS.accent,
              });
            }
            close(true);
            onClose();
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col p-6 gap-4">
      <h2 className="text-xl font-semibold text-gray-900">
        {REVISION_UPDATE_LABELS.title}
      </h2>
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <div className="mb-2">
          <TextareaInput
            name="notes"
            label={REVISION_UPDATE_LABELS.notesLabel}
            required
            placeholder={REVISION_UPDATE_LABELS.notesPlaceholder}
            rules={{ required: REVISION_UPDATE_LABELS.notesRequiredMessage }}
          />
        </div>
        <FileUpload
          name="attachments"
          label={REVISION_UPDATE_LABELS.attachmentLabel}
          accept=".pdf,.jpeg,.jpg,.png"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            className="px-4"
            onClick={onClose}
            type="button"
          >
            {REVISION_UPDATE_LABELS.cancel}
          </Button>
          <Button
            className="bg-teal-800 hover:bg-teal-900 text-white px-5"
            type="submit"
          >
            {REVISION_UPDATE_LABELS.submit}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default RevisionRequestUpdateForm;
