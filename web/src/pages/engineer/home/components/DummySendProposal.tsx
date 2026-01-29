import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { validateDescription } from "../validation";

interface DummyProposalTypes {
  description: string;
  attachment: FileList | null;
}

interface DummySendProposalProps {
  onCancel?: () => void;
}

const DummySendProposal: React.FC<DummySendProposalProps> = ({
  onCancel,
}) => {
  const formCtx = useForm<DummyProposalTypes>({
    mode: "onChange",
    defaultValues: {
      description: "",
      attachment: undefined,
    },
  });

  const handleSubmit = async () => {
try {
toast.success("Proposal submitted successfully!");
if (onCancel) onCancel();
} catch (error) {
console.error("Proposal submission failed:", error);
toast.error("Failed to submit proposal. Please try again.");
}
};

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Please fill these details
        </h2>

        <FormContainer
          methods={formCtx}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <TextareaInput
              name="description"
              label="Proposal Description"
              required
              placeholder="Write your pitch to the client here..."
              rules={validateDescription(50, 2000, "Proposal Description")}
            />
          </div>

          <div>
            <FileUpload
              name="attachment"
              label="Attachments (If any)"
              accept=".pdf"
              maxPages={5}
              validatePDF={true}
              required={false}
            />
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            <Button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 bg-teal-700 dark:bg-teal-800 text-white rounded-lg hover:bg-teal-800 dark:hover:bg-teal-900 transition"
            >
              Review Proposal
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default DummySendProposal;
