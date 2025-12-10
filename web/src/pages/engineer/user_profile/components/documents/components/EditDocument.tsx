import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

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
const EditDocument = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const onSubmit = async (data: EditDocumentFormData) => {
    await showPopup({
      title: "Update Document",
      body: "Are you sure you want to update this document?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            console.log("No button clicked");
            close(true);
          },
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Document Updated Successfully");
            close(true);
            setActiveKey("documents");
          },
        },
      ],
    });
  };

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

export default EditDocument;
