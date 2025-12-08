import { quillContent } from "@/dummy_data/client";
import { Button } from "@/shared/components/commonUI/Buttons";
import QuillEditor from "@/shared/components/QuillEditor";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { toast } from "react-toastify";

/**
 * CMSLegal Component
 *
 * Renders a simple CMS management editor that uses a custom Quill text editor hook (`useQuillEditor`).
 * Users can edit HTML content directly in the editor and save (or preview) the current content value.
 *
 * @component
 * @example
 * return (
 *   <CMSLegal />
 * );
 *
 * @returns {JSX.Element} The rendered CMSLegal component.
 */
export default function CMSLegal() {
  const [content, setContent] = useState(quillContent);

  const onChange = (html: string) => {
    setContent(html);
  };

  const { showPopup } = usePopupStore();

  //Save confirmation
  const handleSaveConfirmation = async () => {
    await showPopup({
      title: "Legal",
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
            toast.success("Legal added successfully!");
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <QuillEditor
        value={content}
        onChange={onChange}
        placeholder={"Start writing..."}
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
