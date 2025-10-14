/**
 * @file EditDocument.tsx
 * @description This component provides a form for users to upload or replace a document, such as a resume.
 * It features a file upload input and validation for file type and page count.
 */

import React from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";

/**
 * Defines the shape of the form data for editing a document.
 * @typedef {Object} EditDocumentFormData
 * @property {FileList} resume - The file list containing the uploaded resume/CV.
 */
export type EditDocumentFormData = {
  resume: FileList;
};

/**
 * Props for the EditDocument component.
 */
interface EditDocumentProps {
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}

/**
 * The EditDocument component renders a form to upload or replace a user's document.
 * It uses `react-hook-form` for form management and includes a `FileUpload` component.
 * @param {EditDocumentProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditDocument form component.
 */
const EditDocument: React.FC<EditDocumentProps> = ({ onClose, onMenuItemClick }) => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to upload the user's document.
   * @param {EditDocumentFormData} data - The validated form data.
   */
  const onSubmit = (data: EditDocumentFormData) => {
    console.log("Form submitted with updated data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Initializes `react-hook-form`.
   */
  const methods = useForm<EditDocumentFormData>({mode:"onSubmit", });

 
  return (
    <div className="relative flex flex-col h-screen bg-white">
      <FormContainer
        methods={methods}
        onSubmit={onSubmit}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <DrawerHeader
          title="Edit Document"
          onClose={onClose}
          onBack={() => onMenuItemClick("documents")}
        />

        {/* Edit document content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
          <FileUpload name="resume" label="Document" required accept=".pdf" maxPages={5} validatePDF={true}/>
        </div>

        {/* Fixed bottom button */}
        <div className=" bottom-0  p-10 bg-white ">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default EditDocument;
