import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import React from "react";
import { useForm } from "react-hook-form";
import { IoCloseSharp } from "react-icons/io5";
import { validateDescription } from "../Validation";

export type EditDocumentFormData = {
  notes: string;
  file?: File;
};

interface RequestRevisionProps {
  onClose: () => void;
  onSubmit: (data: { notes: string; file?: File }) => void;
}

/*
 * RequestRevision component is used to request a revision of a document
 * It contains a form for entering notes and a file upload
 */
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
              label="Attach File(if any)"
              required
              accept=".pdf,.jpg,.png"
              maxPages={5}
              validatePDF={true}
            />
          </div>
          {/* Submit Button */}
          <Button type="submit" variant="primary">
            Send
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};

export default RequestRevision;
