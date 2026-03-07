import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import {  TextareaInput } from "@/shared/components/commonUI/inputs";
import { MODAL_TITLES } from "@/constants/timelineConstants";
import type { UseFormReturn } from "react-hook-form";
import type { RevisionFormData } from "./clientTimelineTypes";

interface RevisionFormModalProps {
  isOpen: boolean;
  isRevisionMode: boolean;
  formMethods: UseFormReturn<RevisionFormData>;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * RevisionFormModal - Unified modal for revision and revision update form
 */
const RevisionFormModal: React.FC<RevisionFormModalProps> = ({
  isOpen,
  // isRevisionMode,
  formMethods,
  onSubmit,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {MODAL_TITLES.requestRevision}
          </h2>

          <FormContainer
            methods={formMethods}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            {/* {isRevisionMode && (
              <InputField
                name="title"
                label="Title"
                placeholder="Enter title"
                required
              />
            )} */}
            <TextareaInput
              name="notes"
              label="Your Notes"
              placeholder=""
              required
            />

            <FileUpload
              name="attachment"
              label="Attach File(if any)"
              placeholder="Attachments (Guidelines, Docs)"
              accept=".pdf,.jpg,.jpeg,.png"
              required={false}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="no_style"
                type="button"
                onClick={onCancel}
                className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
              >
                Submit
              </Button>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default RevisionFormModal;
