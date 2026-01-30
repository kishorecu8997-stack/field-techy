import { useForm, Controller } from "react-hook-form";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import {
  CheckboxInput,
  InputField,
  TextareaInput,
} from "@/shared/components/commonUI/inputs";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { icons } from "@/config/icons";
import { useWatch } from "react-hook-form";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { useEffect } from "react";
import { useGetJobs } from "@/shared/apiServices/client/clientService";

type BreakType = "Long Term Break" | "Short Term Break" | "";
interface BreakRequestFormData {
  breakType: BreakType;
  startDate: Date | null;
  endDate: Date | null;
  checkboxLong?: boolean;
  checkboxShort?: boolean;
  startTime?: string;
  endTime?: string;
  duration: string;
  purpose: string;
}
/**
 * BreakRequest
 *
 * Form component used to create and submit a break request.
 * Allows users to select break type, date, time, and provide a reason.
 * Also displays existing break status information in table and calendar views.
 *
 * Features:
 * - Uses react-hook-form for form state and validation
 * - Supports date and time selection
 * - Displays toast notifications on submit
 * - Integrates popup state handling
 *
 * @component
 *
 * @returns {JSX.Element} Rendered break request form with status table and calendar
 */
const BreakRequest = ({ onClose }: { onClose: () => void }) => {
  const { data: apiJobs } = useGetJobs();
  const methods = useForm<BreakRequestFormData>({
    defaultValues: {
      breakType: "Long Term Break",
      startDate: null,
      endDate: null,
      checkboxLong: true,
      checkboxShort: true,
      startTime: "",
      endTime: "",
      duration: "",
      purpose: "",
    },
  });
  const { showPopup } = usePopupStore();
  const { control, setValue, getValues } = methods;

  const breakType = useWatch({
    control,
    name: "breakType",
  });
  const checkboxLong = useWatch({ control, name: "checkboxLong" });
  const checkboxShort = useWatch({ control, name: "checkboxShort" });
  useEffect(() => {
    if (breakType === "Short Term Break") {
      const today = new Date();
      const start = getValues("startDate");
      if (!start) {
        setValue("startDate", today);
        setValue("endDate", today);
      }
    }
  }, [breakType, getValues, setValue]);

  const toDateOnly = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const parseTime = (time: string | undefined, date: Date) => {
    if (!time) return new Date(date);
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  const getJobEndDate = (job: any) => {
    const startDate = job.startDate;
    const duration = job.jobDuration || job.duration;

    if (!startDate || !duration) return new Date(startDate || Date.now());
    const start = new Date(startDate);
    const durMatch = String(duration).match(/(\d+)\s*Hours?/i);
    if (durMatch) {
      const hours = parseInt(durMatch[1], 10);
      const end = new Date(start);
      end.setHours(end.getHours() + hours);
      return end;
    }
    return new Date(start.getTime() + 8 * 60 * 60 * 1000);
  };
  const checkConflicts = (data: BreakRequestFormData) => {
    if (!data.startDate || !data.endDate) return { jobConflicts: [] };
    const breakStartDate = new Date(data.startDate);
    const breakEndDate = new Date(data.endDate);
    const jobConflicts = (apiJobs || []).filter((job: any) => {
      if (!job.startDate) return false;
      const jobStart = new Date(job.startDate);
      const jobEnd = getJobEndDate(job);
      if (data.breakType === "Long Term Break") {
        if (data.checkboxLong) {
          return (
            job.status === "IN_PROGRESS" &&
            toDateOnly(breakStartDate) <= toDateOnly(jobEnd) &&
            toDateOnly(breakEndDate) >= toDateOnly(jobStart)
          );
        }
        const bStart = parseTime(data.startTime, breakStartDate);
        const bEnd = parseTime(data.endTime, breakEndDate);
        return (
          job.status === "IN_PROGRESS" && bStart < jobEnd && bEnd > jobStart
        );
      }
      if (data.breakType === "Short Term Break") {
        const sameDay = toDateOnly(breakStartDate) === toDateOnly(jobStart);
        if (!sameDay || job.status !== "IN_PROGRESS") return false;
        if (data.checkboxShort) return true; // full day
        const bStart = parseTime(data.startTime, breakStartDate);
        const bEnd = parseTime(data.endTime, breakStartDate);
        return bStart < jobEnd && bEnd > jobStart;
      }
      return false;
    });
    return { jobConflicts };
  };
  const handleSubmit = async (data: BreakRequestFormData) => {
    methods.reset({
      breakType: "",
      startDate: null,
      endDate: null,
      startTime: "",
      endTime: "",
      duration: "",
      purpose: "",
    });

    await showPopup({
      title: "Confirm Break Request",
      body: "Are you sure you want to submit this break request?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "danger" },
        {
          label: "Yes, Submit",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            const { jobConflicts } = checkConflicts(data);

            if (jobConflicts.length > 0) {
              toast.warn(
                `Conflict detected with existing jobs: ${jobConflicts
                  .map((j: any) => j.jobTitle || j.title)
                  .join(", ")}`,
                { autoClose: 10000 },
              );
            } else {
              toast.success("Break request submitted successfully!");
              console.log("Submitted Break Request:", data);
            }
            close(true);
            onClose();
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col p-6">
      <div className="relative mb-4">
        <h2 className="text-xl text-gray-900 dark:text-white font-bold text-center">
          Break Request
        </h2>
        <div
          className="absolute right-0 top-0 cursor-pointer text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <icons.close className="w-6 h-6" />
        </div>
      </div>

      <FormContainer methods={methods} onSubmit={handleSubmit}>
        <SelectField
          label="Break Type"
          name="breakType"
          placeholder="Select break type"
          required
          options={[
            { label: "Long Term Break", value: "Long Term Break" },
            { label: "Short Term Break", value: "Short Term Break" },
          ]}
        />
        {breakType === "Long Term Break" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <DatePickerInput
                name="startDate"
                label="Start Date"
                placeholder="Select start date"
                required
              />
              <DatePickerInput
                name="endDate"
                label="End Date"
                placeholder="Select end date"
                required
              />
            </div>
            <Controller
              name="checkboxLong"
              control={control}
              render={({ field }) => (
                <CheckboxInput
                  {...field}
                  secondaryLabel="hide time selection"
                />
              )}
            />
            {!checkboxLong && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                <CustomTimePicker
                  name="startTime"
                  label="Start Time"
                  required
                />
                <CustomTimePicker name="endTime" label="End Time" required />
              </div>
            )}
            <InputField
              label="Duration"
              name="duration"
              placeholder="Eg:5 days,2 hours"
              required
            />
          </>
        )}
        {breakType === "Short Term Break" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              <CustomTimePicker name="startTime" label="Start Time" required />
              <CustomTimePicker name="endTime" label="End Time" required />
            </div>
            <Controller
              name="checkboxShort"
              control={control}
              render={({ field }) => (
                <CheckboxInput
                  {...field}
                  secondaryLabel="hide date selection"
                />
              )}
            />
            {!checkboxShort && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <DatePickerInput
                  name="startDate"
                  label="Start Date"
                  placeholder="Select start date"
                  required
                />
              </div>
            )}
            <InputField
              label="Duration"
              name="duration"
              placeholder="Eg: 2 hours on the selected date"
              required
            />
          </>
        )}
        <TextareaInput
          label="Reason for Break"
          name="purpose"
          placeholder="Enter reason for break"
          required
        />
        <Button variant="primary" type="submit" className="w-full">
          Submit
        </Button>
      </FormContainer>
    </div>
  );
};

export default BreakRequest;
