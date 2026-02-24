import { useForm } from "react-hook-form";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { Button } from "@/shared/components/commonUI/Buttons";
import { icons } from "@/config/icons";
import { toast } from "react-toastify";
import type { ProgressUpdate } from "../../types.d";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  FINAL_STATEMENT_DEFAULTS,
  FINAL_STATEMENT_LABELS,
  FINAL_STATEMENT_MESSAGES,
} from "@/constants/finalStatementConstants";
import { useEngineerSubmitSignOff } from "@/shared/apiServices/engineer/engineerOpenApiService";

interface FinalStatementFields {
  notes: string;
  completedTaskFile: FileList | null;
  signatureFile: FileList | null;
}

/**
 * Final statement form for engineers to submit closing notes with proof and signature.
 * Uses react-hook-form plus shared inputs/upload for validation and attachments.
 * Pops a confirmation modal before posting updates to the timeline feed.
 * Emits two progress updates (waiting, then approved) via onAddProgressUpdate.
 * Shows toasts for success and supports optional onClose callback.
 */
const FinalStatementForm = ({
  onClose,
  assignmentId,
}: {
  onClose?: () => void;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  assignmentId?: number;
}) => {
  const { showPopup } = usePopupStore();
  const { mutateAsync: submitSignOff, } = useEngineerSubmitSignOff({
    assignmentId,
    onSuccess: () => {
      toast.success(FINAL_STATEMENT_MESSAGES.submitSuccess);
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
    // Show confirmation modal first
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

              // Get the files from the form
              const taskFile = data.completedTaskFile?.[0];
              const signatureFile = data.signatureFile?.[0];

              // Prepare attachment metadata if files exist
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

              // Call the API to submit final statement
              await submitSignOff({
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

              close(true);
            } catch (error) {
              console.error("Failed to submit final statement:", error);
              toast.error("Failed to submit final statement. Please try again.");
              close(true);
            }
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col p-6 w-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {FINAL_STATEMENT_LABELS.title}
          </h2>
          <p className="text-sm text-gray-600">
            {FINAL_STATEMENT_LABELS.subtitle}
          </p>
        </div>
        <Button
          type="button"
          variant="no_style"
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <icons.close className="w-5 h-5" />
        </Button>
      </div>

      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <div className="mb-4">
          <TextareaInput
            name="notes"
            label={FINAL_STATEMENT_LABELS.notesLabel}
            required
            placeholder={FINAL_STATEMENT_LABELS.notesPlaceholder}
            rules={{ required: FINAL_STATEMENT_LABELS.notesRequiredMessage }}
          />
        </div>

        <div className="mb-4">
          <FileUpload
            name="completedTaskFile"
            label={FINAL_STATEMENT_LABELS.completedTaskLabel}
            required
            accept=".pdf,.jpeg,.jpg,.png"
            placeholder={FINAL_STATEMENT_LABELS.completedTaskPlaceholder}
          />
        </div>

        <div className="mb-4">
          <FileUpload
            name="signatureFile"
            label={FINAL_STATEMENT_LABELS.signatureLabel}
            required
            accept=".pdf,.jpeg,.jpg,.png"
            placeholder={FINAL_STATEMENT_LABELS.signaturePlaceholder}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            className="px-4"
            type="button"
            onClick={onClose}
          >
            {FINAL_STATEMENT_LABELS.cancel}
          </Button>
          <Button
            className="bg-teal-800 hover:bg-teal-900 text-white px-5"
            type="submit"
          >
            {FINAL_STATEMENT_LABELS.submitCta}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default FinalStatementForm;
