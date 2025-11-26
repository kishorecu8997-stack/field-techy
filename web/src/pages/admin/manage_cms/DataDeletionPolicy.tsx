"use client";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useQuillEditor } from "@/shared/components/commonUI/text_editor";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { toast } from "react-toastify";

/**
 * DataDeletionPolicy Component
 *
 * Renders a simple CMS management editor that uses a custom Quill text editor hook (`useQuillEditor`).
 * Users can edit HTML content directly in the editor and save (or preview) the current content value.
 *
 * @component
 * @example
 * return (
 *   <DataDeletionPolicy />
 * );
 *
 * @returns {JSX.Element} The rendered DataDeletionPolicy component.
 */
export default function DataDeletionPolicy() {
  const [value, setValue] =
    useState(`<p>This policy explains how users can request the removal of their personal data.
We ensure all deletion requests are processed securely and within the required timeframe.
Once deleted, the data cannot be recovered and is permanently removed from our systems.</p>`);
  const { containerRef } = useQuillEditor({ value, onChange: setValue });

  const { showPopup } = usePopupStore();
  //Save confirmation
  const handleSaveConfirmation = async () => {
    await showPopup({
      title: "Data Deletion Policy",
      body: "Are you sure you want to save this details?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting:", close);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Data Deletion Policy added successfully!");
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div ref={containerRef} className="h-full w-full" />
      <div className="w-full flex justify-end ">
        <Button
          className="w-fit mt-6 bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          onClick={handleSaveConfirmation}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
