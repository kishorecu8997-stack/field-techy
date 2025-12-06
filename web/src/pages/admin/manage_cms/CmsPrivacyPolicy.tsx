"use client";
import { quillContent } from "@/dummy_data/client";
import { Button } from "@/shared/components/commonUI/Buttons";
import QuillEditor from "@/shared/components/QuillEditor";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { toast } from "react-toastify";

/**
 * CMSPrivacyPolicy Component
 *
 * Renders a simple CMS management editor that uses a custom Quill text editor hook (`useQuillEditor`).
 * Users can edit HTML content directly in the editor and save (or preview) the current content value.
 *
 * @component
 * @example
 * return (
 *   <CMSPrivacyPolicy />
 * );
 *
 * @returns {JSX.Element} The rendered CMSPrivacyPolicy component.
 */
export default function CMSPrivacyPolicy() {
  const [content, setContent] = useState(quillContent);

  const { showPopup } = usePopupStore();

  //Save confirmation
  const handleSaveConfirmation = async () => {
    await showPopup({
      title: "Privacy Policy",
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
            toast.success("Privacy Policy added successfully!");
            close(true);
          },
        },
      ],
    });
  };

  const onChange = (html: string) => {
    setContent(html);
  };
  return (
    <div className="w-full h-full flex flex-col">
      <QuillEditor
        value={content}
        onChange={onChange}
        placeholder={"Start writing..."}
        isEdit={true}
      />
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
