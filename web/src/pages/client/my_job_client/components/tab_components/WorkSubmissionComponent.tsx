import React from "react";
import type { WorkInfoItem, WorkSubmissionComponentProps } from "../../types";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import { icons } from "@/config/icons";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import { validateDescription } from "@/pages/engineer/home/validation";
import SignatureField from "@/shared/components/commonUI/inputs/SignatureField";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import { toast } from "react-toastify";
import { scrollToTop } from "@/utils";

/**
 * A reusable component displaying a complete work submission panel.
 * Includes technician info, job details, file attachment, notes, signature, approval, payment status, and user review.
 * Styled with Tailwind CSS to match provided UI design.
 *
 * @param {WorkSubmissionComponentProps} props - The props for the WorkSubmissionComponent
 * @returns {JSX.Element} Rendered work submission panel
 */
const WorkSubmissionComponent: React.FC<{
  workSubmissions: WorkSubmissionComponentProps;
  isWorkSubmitted?: boolean;
}> = ({ workSubmissions, isWorkSubmitted }) => {
  const navigate = useNavigate();
  const {
    name,
    workDates,
    startTime,
    endTime,
    onsiteTask,
    location,
    fileName,
    notes,
    signatureUrl,
  } = workSubmissions;

  const infoItems: WorkInfoItem[] = [
    { label: "Name", value: name },
    { label: "Date(s) of Work", value: workDates },
    { label: "Work Start Date & Time", value: startTime },
    { label: "Work End Date & Time", value: endTime },
    // {
    //   label: "Task Carried out at the site?",
    //   value: onsiteTask ? "Yes" : "No",
    // },
  ];

  const FormCtx = useForm();

  const handleSubmit = () => {
    console.log("Submitted");
    toast.success("Work submission submitted successfully!");
    navigate(absoluteUrls.engineer.home.my_jobs);
    scrollToTop();
  };

  return (
    <div className="p-4 ">
      <FormContainer methods={FormCtx} onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl  p-6 mb-4 dark:bg-gray-700">
          <div className="space-y-4">
            {infoItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap min-w-[180px]">
                  {item.label}:
                </span>
                <span className="text-gray-900 flex-1 break-words dark:text-gray-300">
                  {item.value}
                </span>
              </div>
            ))}
            {!isWorkSubmitted ? (
              <div className="flex gap-2 bg-white rounded-xl dark:bg-gray-700">
                <span className="font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap min-w-[180px]">
                  Task Carried out at the site?:
                </span>
                <p className="text-gray-700 dark:text-gray-300">
                  {onsiteTask ? "Yes" : "No"}
                </p>
              </div>
            ) : (
              <RadioField
                name="onsiteTask"
                direction="horizontal"
                label="Task Carried out at the site"
                required
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
              />
            )}
          </div>
        </div>
        <div className="bg-gray-200 rounded-xl  p-6 mb-4 dark:bg-gray-700">
          <h4 className="font-semibold mb-2">Location of Job</h4>
          <p className="text-gray-700 dark:text-gray-300">{location}</p>
        </div>
        {isWorkSubmitted ? (
          <>
            <FileUpload
              name="file"
              label="Upload completed task File"
              required
              accept=".pdf"
              validatePDF
            />
            <TextareaInput
              name="notes"
              label="Technician notes (if any)"
              required
              rules={validateDescription(50, 2000, "Technician notes")}
            />
            <SignatureField
              name="signature"
              label="Technician Signature"
              required
              accept=".png,.jpg,.jpeg"
            />
            <Button
              type="submit"
              className="px-4 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition mt-5"
            >
              Submit Work
            </Button>
          </>
        ) : (
          <>
            <div className="mb-4 px-5">
              <h4 className="font-semibold mb-2">Completed Task File</h4>
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md w-fit">
                <span className="text-sm text-gray-700 flex justify-center items-center text-center gap-2">
                  <icons.file />
                  {fileName}
                </span>
              </div>
            </div>

            <div className="mb-4 px-5">
              <h4 className="font-semibold mb-2">Technician Notes</h4>
              <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                {notes}
              </p>
            </div>

            <div className="mb-4 px-5">
              <h4 className="font-semibold mb-2">Technician Signature</h4>
              <div className="flex items-center  justify-between">
                {signatureUrl ? (
                  <div className="w-fit">
                    <img
                      src={signatureUrl}
                      alt="Signature not found"
                      className="max-w-full h-auto border border-gray-300 rounded p-2"
                    />
                  </div>
                ) : (
                  <div className="h-16 bg-gray-100 flex items-center justify-center text-gray-500 italic">
                    signature not found
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </FormContainer>
    </div>
  );
};

export default WorkSubmissionComponent;
