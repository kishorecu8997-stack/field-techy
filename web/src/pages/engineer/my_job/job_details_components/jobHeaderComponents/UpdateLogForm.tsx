import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import type { ProgressUpdate } from "../../types.d";
import { toast } from "react-toastify";
import {
  UPDATE_LOG_COLORS,
  UPDATE_LOG_DEFAULTS,
  UPDATE_LOG_LABELS,
  UPDATE_LOG_MESSAGES,
  UPDATE_LOG_STATUS,
} from "@/dummy_data/engineerUpdateLogDummyData";

interface UpdateLogFormProps {
  onClose: () => void;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
}

interface UpdateLogFields {
  notes: string;
  attachments: FileList | null;
}

const UpdateLogForm = ({ onClose, onAddProgressUpdate }: UpdateLogFormProps) => {
  const formCtx = useForm<UpdateLogFields>({
    defaultValues: UPDATE_LOG_DEFAULTS,
  });

  const { showPopup } = usePopupStore();

  const formatNow = () =>
    new Date().toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const handleSubmit = async (data: UpdateLogFields) => {
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
            const attachmentName = data.attachments?.[0]?.name;
            const baseUpdate: Omit<ProgressUpdate, "statusText" | "statusColor"> = {
              title: UPDATE_LOG_LABELS.title,
              description: data.notes,
              attachmentName,
              timestamp: formatNow(),
              accentColor: UPDATE_LOG_COLORS.accent,
            };

            toast.success(UPDATE_LOG_MESSAGES.submitSuccess);
            // Add three cards in order: Waiting -> Approved -> Revision Requested
            // Revision Requested card shows client's feedback note
            onAddProgressUpdate?.({
              ...baseUpdate,
              description: UPDATE_LOG_MESSAGES.revisionFeedback,
              statusText: UPDATE_LOG_STATUS.revision,
              statusColor: UPDATE_LOG_COLORS.revision,
            });
            // Approved card shows engineer's submitted notes
            onAddProgressUpdate?.({
              ...baseUpdate,
              description: data.notes,
              statusText: UPDATE_LOG_STATUS.approved,
              statusColor: UPDATE_LOG_COLORS.approved,
            });
            // Waiting for Approval shows engineer's submitted notes
            onAddProgressUpdate?.({
              ...baseUpdate,
              description: data.notes,
              statusText: UPDATE_LOG_STATUS.waiting,
              statusColor: UPDATE_LOG_COLORS.waiting,
            });
            close(true);
            onClose();
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col p-6 gap-4">
      <h2 className="text-xl font-semibold text-gray-900">{UPDATE_LOG_LABELS.title}</h2>
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
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
          <Button className="bg-teal-800 hover:bg-teal-900 text-white px-5" type="submit">
            {UPDATE_LOG_LABELS.submit}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default UpdateLogForm;
