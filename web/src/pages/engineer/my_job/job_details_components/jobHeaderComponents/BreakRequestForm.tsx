import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { Button } from "@/shared/components/commonUI/Buttons";
import { icons } from "@/config/icons";
import { calculateTimeDuration } from "@/utils/validate";
import { formatDateTime } from "@/utils/formatDateTime";
import type { ProgressUpdate } from "../../types.d";
import {
  BREAK_REQUEST_COLORS,
  BREAK_REQUEST_DEFAULTS,
  BREAK_REQUEST_LABELS,
  BREAK_REQUEST_MESSAGES,
  BREAK_REQUEST_OPTIONS,
  BREAK_REQUEST_STATUS,
} from "@/dummy_data/engineerBreakRequestDummyData";

interface BreakRequestFormFields {
  requestType: "Short Term Break" | "Long Term Break" | "";
  startTime: string;
  endTime: string;
  duration: string;
  reason: string;
}

const BreakRequestForm = ({
  onClose,
  onAddProgressUpdate,
}: {
  onClose: () => void;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
}) => {
  const formCtx = useForm<BreakRequestFormFields>({
    defaultValues: BREAK_REQUEST_DEFAULTS,
  });

  const { watch, setValue } = formCtx;
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // Auto-calculate duration when times change
  useEffect(() => {
    const duration = calculateTimeDuration(startTime, endTime);
    setValue("duration", duration);
  }, [startTime, endTime, setValue]);

  const handleSubmit = (data: BreakRequestFormFields) => {
    const descriptionParts = [] as string[];
    if (data.reason?.trim()) descriptionParts.push(data.reason.trim());
    const timeRange = `${data.startTime || "-"} - ${data.endTime || "-"}`;
    descriptionParts.push(
      `${timeRange}${data.duration ? ` (${data.duration})` : ""}`,
    );

    const baseUpdate: ProgressUpdate = {
      title: data.requestType || BREAK_REQUEST_LABELS.fallbackTitle,
      description: descriptionParts.join(": "),
      timestamp: formatDateTime(),
      detailsType: "break",
      detailsLabel: BREAK_REQUEST_LABELS.detailsLabel,
      accentColor: BREAK_REQUEST_COLORS.accent,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      reason: data.reason,
      requestType: data.requestType,
    };

// TEMP: Adding both statuses for UI demo until API integration
    onAddProgressUpdate?.({
      ...baseUpdate,
      statusText: BREAK_REQUEST_STATUS.waiting,
      statusColor: BREAK_REQUEST_COLORS.waiting,
    });

// TEMP: Adding both statuses for UI demo until API integration
    onAddProgressUpdate?.({
      ...baseUpdate,
      statusText: BREAK_REQUEST_STATUS.approved,
      statusColor: BREAK_REQUEST_COLORS.approved,
    });

    toast.success(BREAK_REQUEST_MESSAGES.submitSuccess);
    onClose();
  };

  return (
    <div className="flex flex-col p-6 w-full max-w-2xl mx-auto">
      <div className="relative mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{BREAK_REQUEST_LABELS.title}</h2>
        <button
          type="button"
          className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <icons.close className="w-5 h-5" />
        </button>
      </div>

      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <div className="mb-4">
          <SelectField
            label="Request Type"
            name="requestType"
            placeholder={BREAK_REQUEST_LABELS.requestTypePlaceholder}
            required
            options={BREAK_REQUEST_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative z-10">
            <CustomTimePicker
              name="startTime"
              label="Start Time"
              required
              dropdownPosition="below"
            />
          </div>
          <div className="relative z-10">
            <CustomTimePicker
              name="endTime"
              label="End Time"
              required
              dropdownPosition="below"
            />
          </div>
        </div>

        <div className="mb-4">
          <InputField
            label="Duration"
            name="duration"
            placeholder={BREAK_REQUEST_LABELS.durationPlaceholder}
            disabled
          />
        </div>

        <div className="mb-4">
          <TextareaInput
            label="Reason for Break"
            name="reason"
            required
            placeholder={BREAK_REQUEST_LABELS.reasonPlaceholder}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" className="px-6" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-teal-800 hover:bg-teal-900 text-white px-6" type="submit">
            Submit
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default BreakRequestForm;
