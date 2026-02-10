import { useForm } from "react-hook-form";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { Button } from "@/shared/components/commonUI/Buttons";
import { icons } from "@/config/icons";
import { toast } from "react-toastify";
import type { ProgressUpdate } from "../../types.d";
import { usePopupStore } from "@/shared/store/popupStore";
import { formatDateTime } from "@/utils/formatDateTime";

const FINAL_STATEMENT_DEFAULTS = {
  notes: "",
  completedTaskFile: null as FileList | null,
  signatureFile: null as FileList | null,
};

export const FINAL_STATEMENT_LABELS = {
  title: "Final Statement",
  subtitle: "Please fill these details",
  notesLabel: "Your Notes",
  notesPlaceholder: "Add your notes here",
  notesRequiredMessage: "Notes are required",
  completedTaskLabel: "Completed Task File",
  completedTaskPlaceholder: "Upload file in PDF, JPEG, PNG",
  signatureLabel: "Your Signature",
  signaturePlaceholder: "Upload file in PDF, JPEG, PNG",
  cancel: "Cancel",
  submitCta: "Submit Work",
  modalCancel: "Cancel",
  modalSubmit: "Submit",
} as const;

const FINAL_STATEMENT_STATUS = {
  waiting: "Waiting for Client Approval",
  approved: "Approved by Client",
} as const;

const FINAL_STATEMENT_COLORS = {
  accent: "#0f766e",
  waiting: "#f59e0b",
  approved: "#22c55e",
} as const;

const FINAL_STATEMENT_MESSAGES = {
  submitSuccess: "Final statement submitted",
  modalBody: "Are you sure you want to submit the final statement?",
} as const;

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
  onAddProgressUpdate,
}: {
  onClose?: () => void;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
}) => {
  const { showPopup } = usePopupStore();
  const formCtx = useForm<FinalStatementFields>({
    defaultValues: FINAL_STATEMENT_DEFAULTS,
  });

  const handleSubmit = (data: FinalStatementFields) => {
    const submitFinalStatement = () => {
      const taskFileName = data.completedTaskFile?.[0]?.name;
      const signatureFileName = data.signatureFile?.[0]?.name;
      const attachmentName = [
        taskFileName && `Task: ${taskFileName}`,
        signatureFileName && `Signature: ${signatureFileName}`,
      ]
        .filter(Boolean)
        .join(" | ");

      const baseUpdate: ProgressUpdate = {
        title: FINAL_STATEMENT_LABELS.title,
        description: data.notes,
        attachmentName: attachmentName || undefined,
        timestamp: formatDateTime(),
        accentColor: FINAL_STATEMENT_COLORS.accent,
      };

      onAddProgressUpdate?.({
        ...baseUpdate,
        statusText: FINAL_STATEMENT_STATUS.waiting,
        statusColor: FINAL_STATEMENT_COLORS.waiting,
      });

      onAddProgressUpdate?.({
        ...baseUpdate,
        statusText: FINAL_STATEMENT_STATUS.approved,
        statusColor: FINAL_STATEMENT_COLORS.approved,
      });

      toast.success(FINAL_STATEMENT_MESSAGES.submitSuccess);
      onClose?.();
    };

    showPopup({
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
            submitFinalStatement();
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col p-6 w-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{FINAL_STATEMENT_LABELS.title}</h2>
          <p className="text-sm text-gray-600">{FINAL_STATEMENT_LABELS.subtitle}</p>
        </div>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <icons.close className="w-5 h-5" />
        </button>
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
          <Button className="bg-teal-800 hover:bg-teal-900 text-white px-5" type="submit">
            {FINAL_STATEMENT_LABELS.submitCta}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default FinalStatementForm;
