import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useEngineerFileUpload } from "@/shared/apiServices/engineer/engineerService";
import { useMemo } from "react";
import type { DocumentType } from "@/shared/apiServices/engineer/engineerTypes";
import { SelectField } from "@/shared/components/commonUI/inputs/SelectField";
import { getUserId } from "@/utils";

/**
 * Defines the shape of the form data for editing a document.
 */
export type EditDocumentFormData = {
  documentType: DocumentType;
  file: FileList;
};

/**
 * The EditDocument component renders a form to upload or replace a user's document.
 * It uses `react-hook-form` for form management and includes a `FileUpload` component.
 * @returns {React.ReactElement} The rendered EditDocument form component.
 */
const EditDocument = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const userId = useMemo(() => getUserId(), []);

  const uploadMutation = useEngineerFileUpload({
    engineerId: userId || undefined,
    onSuccess: () => {
      toast.success("Document Uploaded Successfully");
      setActiveKey("documents");
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
    },
  });

  const onSubmit = async (data: EditDocumentFormData) => {
    if (!userId) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    if (!data.file || data.file.length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }

    await showPopup({
      title: "Confirm Upload",
      body: `Are you sure you want to upload this ${data.documentType.toLowerCase().replace("_", " ")}?`,
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            close(true);
          },
        },
        {
          label: "Yes, upload",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            uploadMutation.mutate({
              engineerId: userId,
              file: data.file[0],
              documentType: data.documentType,
            });
            close(true);
          },
        },
      ],
    });
  };

  const methods = useForm<EditDocumentFormData>({
    mode: "onSubmit",
    defaultValues: {
      documentType: "RESUME",
    },
  });

  const documentTypeOptions = [
    { label: "Resume", value: "RESUME" },
    { label: "Government ID", value: "GOVERNMENT_ID" },
    { label: "Certificate", value: "CERTIFICATE" },
  ];

  return (
    <FormContainer
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-4 pt-4">
        <SelectField
          name="documentType"
          label="Document Type"
          required
          options={documentTypeOptions}
        />

        <FileUpload
          name="file"
          label="Upload File"
          required
          accept=".pdf"
          maxPages={5}
          validatePDF={true}
        />

        {uploadMutation.isPending && (
          <div className="mt-2 text-sm text-blue-600 animate-pulse">
            Uploading document...
          </div>
        )}
      </div>

      <div className="bg-white p-3 border-t">
        <Button
          type="submit"
          disabled={uploadMutation.isPending}
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {uploadMutation.isPending ? "Uploading..." : "Save"}
        </Button>
      </div>
    </FormContainer>
  );
};

export default EditDocument;
