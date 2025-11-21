import { TextareaInput } from "@/shared/components/commonUI/inputs";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { validateDescription } from "../Validation";
import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";

export type EditDocumentFormData = {
  notes: string;
  file?: File;
};

interface RequestRevisionProps {
  onClose: () => void;
  onSubmit: (data: { notes: string; file?: File }) => void;
}

const RequestRevision: React.FC<RequestRevisionProps> = ({
  onClose,
  onSubmit,
}) => {
  const methods = useForm<EditDocumentFormData>({
    defaultValues: { notes: "" },
    mode: "onSubmit",
  });
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Request Revision
          </h2>
          <IoCloseSharp
            onClick={onClose}
            className="h-7 w-7 cursor-pointer text-black hover:text-orange-400"
          />
        </div>

        <FormContainer
          methods={methods}
          onSubmit={onSubmit}
          className="flex flex-col h-full"
        >
          <div className="mb-6">
            <TextareaInput
              name="notes"
              label="Your Notes"
              placeholder="Enter your message here..."
              required
              rules={validateDescription(5, 200, "notes")}
            />
            <FileUpload
              name="file"
              label="Attach File(lf any)"
              required
              accept=".pdf,.jpg,.png"
              maxPages={5}
              validatePDF={true}
            />
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Send
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};

export default RequestRevision;
