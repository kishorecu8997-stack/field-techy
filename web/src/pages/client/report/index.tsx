import { useSaveReportClient } from "@/shared/apiServices/client/clientOpenApiService";
import { useSaveReportEngineer } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FileUpload, TextareaInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { SelectField } from "@/shared/components/commonUI/inputs/SelectField";
import Popup from "@/shared/components/Popup";
import { usePopupStore } from "@/shared/store/popupStore";
import { useForm } from "react-hook-form";
import { IoCloseSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

type PriorityLevel = "high" | "low" | "medium" | "critical";

type PostReportProps = {
  category: string;
  priority: PriorityLevel;
  description: string;
  file: FileList | null;
};

const ReportPage = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { showPopup } = usePopupStore();
  const { jobId } = useParams();

  const isClient = location.pathname.includes("client");
  const { mutate: saveClientReport } = useSaveReportClient();
  const { mutate: saveEngineerReport } = useSaveReportEngineer();

  const formCtx = useForm({
    defaultValues: {
      category: "",
      priority: "" as PriorityLevel,
      description: "",
      file: null,
    },
  });
  const { reset } = formCtx;

  const handleReportSubmit = async (data: PostReportProps) => {
    await showPopup({
      title: "Report a Problem",
      body: "Are you sure you want to upload this report?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Confirm",
          value: "submit",
          variant: "primary",
          action: async (close) => {
            const selectedFile =
              data.file && data.file.length > 0 ? data.file[0] : null;

            const attachmentData = selectedFile
              ? {
                  filename: selectedFile.name,
                  size: selectedFile.size,
                  mimeType: selectedFile.type,
                }
              : undefined;

            const reportPayload = {
              jobId: Number(jobId),
              detailedDescription: data.description,
              issueCategory: data.category,
              priorityLevel: data.priority,
              attachment: attachmentData,
            };

            try {
              if (isClient) {
                saveClientReport({
                  body: reportPayload,
                });
              } else {
                saveEngineerReport({
                  body: reportPayload,
                });
              }

              console.log("Submitting Report Data:", data);

              toast.success("Report submitted successfully!");
              reset();
              close(true);
              onClose();
            } catch {
              toast.error("Failed to submit report.");
            }
          },
        },
      ],
    });
  };

  return (
    <Popup onClose={onClose} open={open}>
      <div className="flex flex-col p-6 overflow-y-auto h-full">
        <div className="flex justify-end">
          <button
            className="cursor-pointer text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <IoCloseSharp className="w-6 h-6" />
          </button>
        </div>
        <FormContainer
          methods={formCtx}
          onSubmit={handleReportSubmit}
          className="flex flex-col gap-2"
        >
          <h1 className="text-xl font-bold text-center dark:text-gray-100 text-gray-800">
            Report a problem
          </h1>

          <SelectField
            label="Issue Category"
            name="category"
            placeholder="Enter your name"
            required
            rules={{ required: "Category is required" }}
            options={[
              { value: "backend", label: "Backend" },
              { value: "frontend", label: "Frontend" },
              { value: "performance", label: "Performance" },
              { value: "accessibility", label: "Accessibility" },
            ]}
          />
          <SelectField
            label="Priority Level"
            name="priority"
            required
            rules={{ required: "Priority level is required" }}
            placeholder="select a priority"
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
          />
          <TextareaInput
            label="Description"
            name="description"
            required
            rules={{
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Minimum 10 characters required",
              },
            }}
            placeholder="Enter your description"
          />
          <FileUpload
            name="file"
            label="Attach File (If any)"
            accept=".pdf, .jpg, .png"
            placeholder="Attach File"
            maxPages={5}
            validatePDF={true}
          />
          <Button type="submit" variant="primary" size="lg">
            Submit
          </Button>
        </FormContainer>
      </div>
    </Popup>
  );
};

export default ReportPage;
