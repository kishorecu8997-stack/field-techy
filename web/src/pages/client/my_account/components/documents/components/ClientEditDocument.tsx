import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";

/**
 * Defines the shape of the form data for editing a document.
 * @typedef {Object} EditDocumentFormData
 * @property {FileList} resume - The file list containing the uploaded resume/CV.
 */
export type EditDocumentFormData = {
  resume: FileList;
};

/**
 * The EditDocument component renders a form to upload or replace a user's document.
 * It uses `react-hook-form` for form management and includes a `FileUpload` component.
 * @param {EditDocumentProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditDocument form component.
 */
const ClientEditDocument = () => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to upload the user's document.
   * @param {EditDocumentFormData} data - The validated form data.
   */
  const onSubmit = (data: EditDocumentFormData) => {
    console.log("Form submitted with updated data:", data);
    toast.success("Document Updated Successfully");
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Initializes `react-hook-form`.
   */
  const methods = useForm<EditDocumentFormData>({ mode: "onSubmit" });

  return (
    <FormContainer
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
        <FileUpload
          name="resume"
          label="Document"
          required
          accept=".pdf"
          maxPages={5}
          validatePDF={true}
        />
      </div>

      <div className="bg-white ">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Save
        </Button>
      </div>
    </FormContainer>
  );
};

export default ClientEditDocument;
