"use client";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useQuillEditor } from "@/shared/components/commonUI/text_editor";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { toast } from "react-toastify";

/**
 * AboutUs Component
 *
 * Renders a simple CMS management editor that uses a custom Quill text editor hook (`useQuillEditor`).
 * Users can edit HTML content directly in the editor and save (or preview) the current content value.
 *
 * @component
 * @example
 * return (
 *   <AboutUs />
 * );
 *
 * @returns {JSX.Element} The rendered AboutUs component.
 */
export default function AboutUs() {
  const [value, setValue] =
    useState(`<p>We are a dedicated team focused on delivering high-quality services to our customers.
Our mission is to create innovative solutions that make a meaningful impact.
With a commitment to excellence, we continuously strive to improve and grow.
We believe in building long-term relationships based on trust and reliability.</p>`);
  const { containerRef } = useQuillEditor({ value, onChange: setValue });

  const { showPopup } = usePopupStore();

  //Save confirmation
  const handleSaveConfirmation = async () => {
    await showPopup({
      title: "About Us",
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
            toast.success("About Us added successfully!");
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
