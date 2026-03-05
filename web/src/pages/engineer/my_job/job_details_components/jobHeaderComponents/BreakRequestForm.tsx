import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/apiServices/apiClient";
import { getJobLogs } from "@/api";
import { getJobLogsQueryKey } from "@/api/@tanstack/react-query.gen";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { Button } from "@/shared/components/commonUI/Buttons";
import { icons } from "@/config/icons";
import {
  calculateTimeDuration,
  validateStartDate,
  validateEndDate,
} from "@/utils/validate";
import { formatDateTime } from "@/utils/formatDateTime";
import type { ProgressUpdate } from "../../types.d";
import type { BreakRequestFormFields } from "@/pages/engineer/my_job/types";
import {
  BREAK_REQUEST_OPTIONS,
  BREAK_REQUEST_DEFAULTS,
  BREAK_REQUEST_LABELS,
  BREAK_REQUEST_STATUS,
  BREAK_REQUEST_COLORS,
  BREAK_REQUEST_MESSAGES,
} from "@/dummy_data/breakRequestDummy";
import { useEngineerRequestBreak } from "@/shared/apiServices/engineer/engineerOpenApiService";
// import { queryKeys } from "@/shared/apiServices/queryKeys";

/**
 * BreakRequestForm component for submitting engineer break requests.
 * Supports short-term and long-term break types.
 * Automatically calculates break duration based on time or date inputs.
 * Uses react-hook-form for form state and validation.
 * Sends break request updates to the job progress timeline.
 */

const BreakRequestForm = ({
  onClose,
  onAddProgressUpdate,
  assignmentId,
  jobStartDate,
  jobEndDate,
}: {
  onClose: () => void;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  assignmentId?: number;
  jobStartDate?: string;
  jobEndDate?: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formCtx = useForm<BreakRequestFormFields>({
    defaultValues: BREAK_REQUEST_DEFAULTS,
  });

  const { watch, setValue, setError, clearErrors } = formCtx;
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const requestType = watch("requestType");
  const isLongTermBreak = requestType === "Long Term Break";

  const queryClient = useQueryClient();

  // Use the API mutation for submitting break request
  const breakRequestMutation = useEngineerRequestBreak({
    assignmentId,
    onSuccess: async () => {
      toast.success(BREAK_REQUEST_MESSAGES.submitSuccess);

      // Force refetch the job logs to update timeline immediately
      if (assignmentId) {
        try {
          // Directly fetch the latest job logs from API
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId },
          });

          // Update the query cache with the new data using exact key from getJobLogsQueryKey
          const exactQueryKey = getJobLogsQueryKey({ path: { assignmentId } });
          queryClient.setQueryData(exactQueryKey, response.data);
        } catch (error) {
          console.error("Failed to refetch timeline:", error);
          // Fallback: try to invalidate all queries
          queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
        }
      }
      onClose();
    },
    onError: (error) => {
      console.error("Failed to submit break request:", error);
      toast.error("Failed to submit break request");
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    // Validate end time is after start time
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      if (end <= start) {
        setError("endTime", {
          type: "manual",
          message: "End time must be after start time",
        });
      } else {
        clearErrors("endTime");
      }
    }
  }, [startTime, endTime, setError, clearErrors]);

  useEffect(() => {
    if (isLongTermBreak) {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const dayText = diffDays === 1 ? "day" : "days";
        setValue("duration", diffDays > 0 ? `${diffDays} ${dayText}` : "");
      }
    } else {
      const duration = calculateTimeDuration(startTime, endTime);
      setValue("duration", duration);
    }
  }, [startTime, endTime, startDate, endDate, isLongTermBreak, setValue]);

  // compute today's start (00:00) and min end-date (one day after selected startDate)
  // const todayStart = (() => {
  //   const d = new Date();
  //   d.setHours(0, 0, 0, 0);
  //   return d;
  // })();

  // Calculate minimum start date: max of today and job start date
  const minStartDate = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (jobStartDate) {
      const jobStart = new Date(jobStartDate);
      jobStart.setHours(0, 0, 0, 0);
      return jobStart > today ? jobStart : today;
    }
    return today;
  })();

  // Calculate maximum end date based on job end date
  const maxEndDate = (() => {
    if (jobEndDate) {
      const end = new Date(jobEndDate);
      end.setHours(23, 59, 59, 999);
      return end;
    }
    return undefined;
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

  const handleSubmit = async (data: BreakRequestFormFields) => {
    // Validate end time is after start time for short term breaks
    if (!isLongTermBreak && data.startTime && data.endTime) {
      const start = new Date(`2000-01-01T${data.startTime}`);
      const end = new Date(`2000-01-01T${data.endTime}`);
      if (end <= start) {
        toast.error("End time must be after start time");
        return;
      }
    }

    // If assignmentId is provided, use the API
    if (assignmentId) {
      setIsSubmitting(true);

      const breakType =
        data.requestType === "Long Term Break" ? "long_term" : "short_term";

      // Format dates for API
      let startAt: string | null = null;
      let endAt: string | null = null;

      if (isLongTermBreak) {
        startAt = data.startDate
          ? new Date(data.startDate).toISOString()
          : null;
        endAt = data.endDate ? new Date(data.endDate).toISOString() : null;
      } else {
        // For short term, use today's local date with the selected local time
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-based
        const day = String(today.getDate()).padStart(2, "0");
        const localDate = `${year}-${month}-${day}`;

        startAt = data.startTime
          ? new Date(`${localDate}T${data.startTime}`).toISOString()
          : null;
        endAt = data.endTime
          ? new Date(`${localDate}T${data.endTime}`).toISOString()
          : null;
      }

      breakRequestMutation.mutate({
        body: {
          assignmentId,
          type: breakType,
          reason: data.reason || "",
          startAt,
          endAt,
        },
      });

      return;
    }

    // Fallback to local state update if no assignmentId (legacy behavior)
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

    onAddProgressUpdate?.({
      ...baseUpdate,
      statusText: BREAK_REQUEST_STATUS.waiting,
      statusColor: BREAK_REQUEST_COLORS.waiting,
    });

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
        <h2 className="text-lg font-semibold text-gray-900">
          {BREAK_REQUEST_LABELS.title}
        </h2>
        {/* <Button
          type="button"
          variant="headerClose"
          className="absolute right-0 top-0"
          onClick={onClose}
          aria-label="Close"
        >
          <icons.close className="w-5 h-5" />
        </Button> */}
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
            <div className="relative z-10 px-1">
              <CustomTimePicker
                name="startTime"
                label="Start Time"
                required
                dropdownPosition="below"
              />
            </div>
            <div className="relative z-10 px-1">
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
              minDate={minStartDate}
              maxDate={maxEndDate}
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
              maxDate={maxEndDate}
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
            rules={{
               maxLength: {
                value: 200,
                message: "Reason must be 200 characters or less",
              },
            }}
          />
        </div>

        <div className="flex justify-end gap-3 pt-0">
          <Button
            variant="outline"
            className="px-6"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-teal-800 hover:bg-teal-900 text-white px-6"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default BreakRequestForm;
