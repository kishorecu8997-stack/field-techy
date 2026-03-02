import React, { useEffect } from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import { MODAL_TITLES } from "@/constants/timelineConstants";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";

type ShortBreakFormValues = {
  notes: string;
};

interface ShortBreakRejectModalProps {
  isOpen: boolean;
  notes: string;
  onNotesChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

/**
 * ShortBreakRejectModal - Modal for rejecting short break with notes
 */
const ShortBreakRejectModal: React.FC<ShortBreakRejectModalProps> = ({
  isOpen,
  notes,
  onNotesChange,
  onCancel,
  onSubmit,
}) => {
  const formMethods = useForm<ShortBreakFormValues>({
    defaultValues: {
      notes,
    },
  });

  useEffect(() => {
    formMethods.setValue("notes", notes, { shouldDirty: false });
  }, [formMethods, notes]);

  useEffect(() => {
    const subscription = formMethods.watch((value) => {
      const nextNotes = value.notes ?? "";
      if (nextNotes !== notes) {
        onNotesChange(nextNotes);
      }
    });

    return () => subscription.unsubscribe();
  }, [formMethods, notes, onNotesChange]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {MODAL_TITLES.shortBreakRejection}
          </h2>

          <FormContainer methods={formMethods} onSubmit={onSubmit}>
            <div className="space-y-4">
              <TextareaInput
                name="notes"
                label="Reason for Rejection"
                placeholder="Please provide a reason for rejecting this break request"
              />
            </div>

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
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
              >
                Reject
              </Button>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default ShortBreakRejectModal;
