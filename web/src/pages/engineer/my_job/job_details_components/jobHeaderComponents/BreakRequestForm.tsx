import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { Button } from "@/shared/components/commonUI/Buttons";
import { icons } from "@/config/icons";
import { calculateTimeDuration, validateStartDate, validateEndDate } from "@/utils/validate";
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
  startDate: string;
  endDate: string;
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
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const requestType = watch("requestType");
  const isLongTermBreak = requestType === "Long Term Break";

  // Auto-calculate duration when times or dates change
  useEffect(() => {
    if (isLongTermBreak) {
      // For long-term breaks, calculate days between dates
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setValue("duration", diffDays > 0 ? `${diffDays} days` : "");
      }
    } else {
      // For short-term breaks, calculate time duration
      const duration = calculateTimeDuration(startTime, endTime);
      setValue("duration", duration);
    }
  }, [startTime, endTime, startDate, endDate, isLongTermBreak, setValue]);

  // compute today's start (00:00) and min end-date (one day after selected startDate)
  const todayStart = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const minEndDate = startDate
    ? (() => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        return d;
      })()
    : undefined;

  const formatDateToMMDDYYYY = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSubmit = (data: BreakRequestFormFields) => {
    const descriptionParts = [] as string[];
    if (data.reason?.trim()) descriptionParts.push(data.reason.trim());
    
    let dateRange = "";
    if (isLongTermBreak) {
      const formattedStartDate = formatDateToMMDDYYYY(data.startDate);
      const formattedEndDate = formatDateToMMDDYYYY(data.endDate);
      dateRange = `${formattedStartDate} to ${formattedEndDate}`;
    } else {
      dateRange = `${data.startTime || "-"} - ${data.endTime || "-"}`;
    }
    
    descriptionParts.push(
      `${dateRange}${data.duration ? ` (${data.duration})` : ""}`,
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
      startDate: data.startDate,
      endDate: data.endDate,
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
    <div className="flex flex-col p-2 w-full max-w-2xl mx-auto -mb-3">
      <div className="relative mb-2">
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
        <div className="mb-2">
          <SelectField
            label="Request Type"
            name="requestType"
            placeholder={BREAK_REQUEST_LABELS.requestTypePlaceholder}
            required
            options={BREAK_REQUEST_OPTIONS}
          />
        </div>

        {!isLongTermBreak && (
          <div className="grid grid-cols-2 gap-4 mb-2">
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
        )}

        {isLongTermBreak && (
          <div className="grid grid-cols-2 gap-4 mb-2">
            <DatePickerInput
              name="startDate"
              label="Start Date"
              required
              placeholder="Select start date"
              minDate={todayStart}
              rules={{
                validate: (value) => validateStartDate(value),
              }}
            />
            <DatePickerInput
              name="endDate"
              label="End Date"
              required
              placeholder="Select end date"
              minDate={minEndDate}
              rules={{
                validate: (value) => validateEndDate(value, startDate),
              }}
            />
          </div>
        )}

        <div className="mb-2">
          <InputField
            label="Duration"
            name="duration"
            placeholder={BREAK_REQUEST_LABELS.durationPlaceholder}
            disabled
          />
        </div>

        <div className="mb-2">
          <TextareaInput
            label="Reason for Break"
            name="reason"
            required
            placeholder={BREAK_REQUEST_LABELS.reasonPlaceholder}
          />
        </div>

        <div className="flex justify-end gap-3 pt-0">
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
