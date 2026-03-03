import { getJobLogs } from "@/api";
import { getJobLogsQueryKey } from "@/api/@tanstack/react-query.gen";
import { icons } from "@/config/icons";
import {
  FINAL_STATEMENT_DEFAULTS,
  FINAL_STATEMENT_LABELS,
  FINAL_STATEMENT_MESSAGES,
} from "@/constants/finalStatementConstants";
import { apiClient } from "@/shared/apiServices/apiClient";
import { useEngineerSubmitSignOff } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { queryKeys } from "@/shared/apiServices/queryKeys";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ProgressUpdate } from "../../types.d";

interface FinalStatementFields {
  notes: string;
  completedTaskFile: FileList | null;
  signatureFile: FileList | null;
}

const FinalStatementForm = ({
  onClose,
  assignmentId,
}: {
  onClose?: () => void;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  assignmentId?: number;
}) => {
  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();

  const { mutateAsync: submitSignOff } = useEngineerSubmitSignOff({
    assignmentId,
    onSuccess: async () => {
      toast.success(FINAL_STATEMENT_MESSAGES.submitSuccess);

      if (assignmentId) {
        try {
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId },
          });

          const exactQueryKey = getJobLogsQueryKey({
            path: { assignmentId },
          });

          queryClient.setQueryData(exactQueryKey, response.data);
          queryClient.setQueryData(
            ["getJobLogs", { path: { assignmentId } }],
            response.data,
          );
          queryClient.setQueryData(
            queryKeys.engineer.jobLogs(assignmentId),
            response.data,
          );
        } catch (error) {
          console.error("Error refetching job logs:", error);
          queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
        }
      }

      onClose?.();
    },
    onError: (error) => {
      console.error("Failed to submit final statement:", error);
      toast.error("Failed to submit final statement. Please try again.");
    },
  });

  const formCtx = useForm<FinalStatementFields>({
    defaultValues: FINAL_STATEMENT_DEFAULTS,
  });

  const handleSubmit = async (data: FinalStatementFields) => {
    await showPopup({
      title: FINAL_STATEMENT_LABELS.title,
      body: FINAL_STATEMENT_MESSAGES.modalBody,
      containerClassName: "sm:max-w-md",
      bodyClassName: "text-sm text-gray-700",
      actionButtons: [
        {
          label: FINAL_STATEMENT_LABELS.modalCancel,
          value: "cancel",
          variant: "secondary",
        },
        {
          label: FINAL_STATEMENT_LABELS.modalSubmit,
          value: "submit",
          variant: "primary",
          className: "bg-teal-900 hover:bg-teal-800 text-white",
          action: async (close) => {
            try {
              if (!assignmentId) {
                toast.error("Assignment ID is missing");
                return;
              }

              const taskFile = data.completedTaskFile?.[0];
              const signatureFile = data.signatureFile?.[0];

              const workAttachment = taskFile
                ? {
                  filename: taskFile.name,
                  size: taskFile.size,
                  mimeType: taskFile.type,
                }
                : undefined;

              const signatureAttachment = signatureFile
                ? {
                  filename: signatureFile.name,
                  size: signatureFile.size,
                  mimeType: signatureFile.type,
                }
                : undefined;

              const response = await submitSignOff({
                body: {
                  assignmentId: Number(assignmentId),
                  workAttachment: workAttachment || {
                    filename: "",
                    size: 0,
                    mimeType: "",
                  },
                  signatureAttachment: signatureAttachment || {
                    filename: "",
                    size: 0,
                    mimeType: "",
                  },
                  comments: data.notes || "",
                },
              });

              const uploadFile = async (file: File, url: string) => {
                await fetch(url, {
                  method: "PUT",
                  body: file,
                  headers: { "Content-Type": file.type },
                });
              };

              if (taskFile && response.workAttachmentUrl) {
                await uploadFile(taskFile, response.workAttachmentUrl);
              }

              if (signatureFile && response.signatureAttachmentUrl) {
                await uploadFile(
                  signatureFile,
                  response.signatureAttachmentUrl,
                );
              }

              close(true);
            } catch (error) {
              console.error("Failed to submit final statement:", error);
              toast.error(
                "Failed to submit final statement. Please try again.",
              );
              close(true);
            }
          },
        },
      ],
    });
  };

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={handleSubmit}
      className="flex flex-col h-[80vh] "
    >
      <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6  bg-white dark:bg-gray-800 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {FINAL_STATEMENT_LABELS.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {FINAL_STATEMENT_LABELS.subtitle}
            </p>
          </div>

          <Button
            type="button"
            variant="no_style"
            onClick={onClose}
            aria-label="Close"
          >
            <icons.close className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <TextareaInput
            name="notes"
            label={FINAL_STATEMENT_LABELS.notesLabel}
            required
            placeholder={FINAL_STATEMENT_LABELS.notesPlaceholder}
            rules={{
              required: FINAL_STATEMENT_LABELS.notesRequiredMessage,
            }}
          />

          <FileUpload
            name="completedTaskFile"
            label={FINAL_STATEMENT_LABELS.completedTaskLabel}
            required
            accept=".pdf,.jpeg,.jpg,.png"
            placeholder={FINAL_STATEMENT_LABELS.completedTaskPlaceholder}
          />

          <FileUpload
            name="signatureFile"
            label={FINAL_STATEMENT_LABELS.signatureLabel}
            required
            accept=".pdf,.jpeg,.jpg,.png"
            placeholder={FINAL_STATEMENT_LABELS.signaturePlaceholder}
          />
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-gray-800 px-6 shrink-0">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              type="button"
              onClick={onClose}
            >
              {FINAL_STATEMENT_LABELS.cancel}
            </Button>

            <Button
              className="bg-teal-800 hover:bg-teal-900 text-white w-full sm:w-auto"
              type="submit"
            >
              {FINAL_STATEMENT_LABELS.submitCta}
            </Button>
          </div>
        </div>

      </div>
    </FormContainer>
  );
};

export default FinalStatementForm;