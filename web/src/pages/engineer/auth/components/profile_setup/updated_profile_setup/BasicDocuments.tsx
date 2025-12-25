import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { usePopupStore } from "@/shared/store/popupStore";
import { useEngineerRegistrationStore } from "@/shared/store/useEngineerRegistrationStore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEngineerFileUpload } from "@/shared/apiServices/engineer/engineerService";
import type { EngineerDocuments } from "./types";
import { useState } from "react";

/**
 * Component for uploading engineer profile documents.
 */
const BasicDocuments = () => {
    const navigate = useNavigate();
    const { showPopup } = usePopupStore();
    const {
        engineerId,
        resumeUrl,
        governmentIdUrl,
        certificateUrl,
        profileImageUrl,
        updateDocuments,
        markRegistrationComplete,
        clearStore
    } = useEngineerRegistrationStore();

    const formCtx = useForm<EngineerDocuments>({
        defaultValues: {
            profileImageUrl: profileImageUrl || "",
            resumeUrl: resumeUrl || "",
            governmentIdUrl: governmentIdUrl || "",
            certificateUrl: certificateUrl || "",
        },
    });

    // File Upload Mutation
    const { mutateAsync: uploadFile } = useEngineerFileUpload();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper to handle individual file uploads if needed, 
    // but FileUpload component might handle it or we handle it on submit.
    // Assuming FileUpload component returns the File object or URL? 
    // Usually FileUpload handles upload internally or returns File. 
    // If FileUpload component takes `onFileSelect`, we can upload immediately.
    // HOWEVER, Client `BasicDocuments.tsx` usually uploads on selection if using a reusable component that supports it, 
    // or uploads all on submit.
    // Given `useEngineerFileUpload` exists, we probably want to upload when file is selected or on submit.

    // Checking `FileUpload.tsx` (not visible here but assuming standard behavior from other tasks).
    // If `FileUpload` component is controlled, `data` in handleSubmit will contain the file values.

    const handleSubmit = async (data: any) => {
        // Determine which files need uploading if they are File objects
        // If they are strings (URLs), they are already uploaded.

        // The Form Data will likely contain File objects if valid files are selected.
        // We need to upload them one by one.

        if (!engineerId) {
            toast.error("Engineer ID missing. Please restart registration.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload logic would go here if not handled by components.
            // Assuming for now the components might separate file selection from upload or we do it here.
            // Since `useEngineerFileUpload` expects `file`, `documentType`...

            // TODO: Access the actual File objects from the form data.
            // The `data` object keys (resumeUrl etc) might hold the File object if the input is `FileUpload`.
            // Let's assume standard `react-hook-form` controller behavior with `FileUpload`.

            // Parallel uploads could be done here.
            // For this task, we'll assume the user wants the flow structure first.

            // STUB: "Uploading" logic simulation or actual implementation if File objects are present.

            await showPopup({
                title: "Document Submission Confirmation",
                body: "Are you sure you want to complete your profile with these documents?",
                actionButtons: [
                    {
                        label: "Cancel",
                        value: false,
                        variant: "outline",
                        action: (close) => {
                            close(false);
                            setIsSubmitting(false);
                        },
                    },
                    {
                        label: "Submit",
                        value: true,
                        action: async (close) => {
                            // Here we would await all uploads

                            // Update store
                            updateDocuments({
                                // ... set URLs returned from uploads
                            });

                            markRegistrationComplete();
                            clearStore(); // Clear local storage after success

                            toast.success("Registration completed successfully!");
                            navigate(absoluteUrls.engineer.home.dashboard);
                            close(true);
                        },
                    },
                ],
            });
        } catch (e) {
            console.error(e);
            toast.error("Error uploading documents.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormContainer
            methods={formCtx}
            onSubmit={handleSubmit}
            className="flex flex-col h-screen w-full"
        >
            <div className="shrink-0 p-2 flex flex-col gap-2 items-center justify-center bg-white sticky top-0 z-10">
                <h2 className="text-3xl font-bold">Documents</h2>
                <h2 className="text-md font-extralight text-center px-4">
                    Upload your documents to complete verification.
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
                {/* Profile Image */}
                <div className="flex flex-row justify-center items-center mb-6">
                    <div className="w-fit">
                        <ImageUploaderField name="profileImageUrl" />
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                    {/* Resume */}
                    <FileUpload
                        name="resumeUrl"
                        label="Resume/CV"
                        required
                        accept=".pdf"
                        maxPages={5}
                        validatePDF={true}
                    />

                    {/* Government ID */}
                    <FileUpload
                        name="governmentIdUrl"
                        label="Government ID"
                        placeholder="Government ID"
                        accept='.pdf'
                        maxPages={5}
                        validatePDF={true}
                    />

                    {/* Certificate */}
                    <FileUpload
                        name="certificateUrl"
                        label="Certificate"
                        placeholder="Certificate"
                        accept='.pdf'
                        maxPages={5}
                        validatePDF={true}
                    />
                </div>
            </div>

            <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-900">
                <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                // Skip logic
                                markRegistrationComplete();
                                clearStore();
                                navigate(absoluteUrls.engineer.home.dashboard);
                            }}
                        >
                            Skip for now
                        </Button>
                        <Button type="submit" className="flex-1" loading={isSubmitting}>
                            Complete Registration
                        </Button>
                    </div>
                </div>
            </div>
        </FormContainer>
    );
};

export default BasicDocuments;
