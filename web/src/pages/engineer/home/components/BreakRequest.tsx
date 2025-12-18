import { useForm } from "react-hook-form";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import BreakStatusTable from "./BreakStatusTable";
import BreakCalendar from "./BreakCalendar";

const sampleJobs = [
  {
    id: 6,
    title: "Junior Web Designer",
    client: "TechNova Co",
    status: "inprogress",
    startDate: "December 18, 2025, 10:00 AM",
    endDate: "December 18, 2025, 1:00 PM",
  },
  {
    id: 9,
    title: "Innovate Tech",
    client: "Innovate Tech",
    status: "inprogress",
    startDate: "December 19, 2025, 9:00 AM",
    endDate: "December 20, 2025, 1:00 PM",
  },
  {
    id: 10,
    title: "Senior Product Designer",
    client: "TechNova Co",
    status: "completed",
    startDate: "December 20, 2025, 2:00 PM",
    endDate: "December 21, 2025, 1:00 PM",
  },
];

interface BreakRequestFormData {
  startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  endTime: Date | null;
  breakType: "short" | "long" | "";
  purpose: string;
  remarks: string;
}

const BreakRequest = () => {
  const methods = useForm<BreakRequestFormData>({
    defaultValues: {
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      breakType: "",
      purpose: "",
      remarks: "",
    },
  });

  const { showPopup } = usePopupStore();

  const handleSubmit = async (data: BreakRequestFormData) => {
    await showPopup({
      title: "Confirm Break Request",
      body: "Are you sure you want to submit this break request?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Yes, Submit",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            const breakStart = new Date(data.startDate!);
            const breakEnd = new Date(data.endDate!);

            const parseDate = (dateStr: string) => new Date(dateStr);

            const toDateOnly = (date: Date) =>
              new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              ).getTime();

            const conflicts = sampleJobs.filter((job) => {
              if (job.status !== "inprogress") return false;

              const jobStart = parseDate(job.startDate);
              const jobEnd = parseDate(job.endDate);

              const breakStartDate = toDateOnly(breakStart);
              const breakEndDate = toDateOnly(breakEnd);
              const jobStartDate = toDateOnly(jobStart);
              const jobEndDate = toDateOnly(jobEnd);

              return (
                breakStartDate === jobStartDate ||
                breakStartDate === jobEndDate ||
                breakEndDate === jobStartDate ||
                breakEndDate === jobEndDate
              );
            });

            if (conflicts.length > 0) {
              conflicts
                .map(
                  (job) =>
                    `• ${job.title} (${job.client})\n  ${job.startDate} – ${job.endDate}`
                )
                .join("\n\n");

              toast.warn(
                `Conflict detected! Your selected date matches an in-progress job
                 Please cancel conflicting jobs or continue jobs during break`,
                { autoClose: 10000 }
              );
            } else {
              console.log("Break request submitted:", data);
              toast.success("Break request submitted successfully!");
            }

            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:order-1">
            <div className="bg-white shadow-xl rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Request a Break
              </h2>

              <FormContainer
                methods={methods}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DatePickerInput
                    name="startDate"
                    label="Start Date"
                    placeholder="Select start date"
                    required
                  />
                  <CustomTimePicker
                    name="startTime"
                    label="Start Time"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DatePickerInput
                    name="endDate"
                    label="End Date"
                    placeholder="Select end date"
                    required
                  />
                  <CustomTimePicker name="endTime" label="End Time" required />
                </div>

                <SelectField
                  label="Break Type"
                  name="breakType"
                  placeholder="Select break type"
                  required
                  options={[
                    {
                      value: "short",
                      label: "Short (Emergency, Personal – hours)",
                    },
                    {
                      value: "long",
                      label: "Long (Sick Leave, Vacation, Personal)",
                    },
                  ]}
                />

                <TextareaInput
                  label="Purpose / Reason"
                  name="purpose"
                  placeholder="Enter reason for break"
                  required
                />

                <TextareaInput
                  label="Remarks / Notes"
                  name="remarks"
                  placeholder="Additional notes (optional)"
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto px-8"
                >
                  Submit Break Request
                </Button>
              </FormContainer>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:order-2">
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Break Status
              </h2>
              <div className="overflow-x-auto">
                <BreakStatusTable />
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Break Calendar
                </h2>
                <div className="h-80 sm:h-96 lg:h-[400px] overflow-auto border border-gray-200 rounded-lg">
                  <BreakCalendar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakRequest;
