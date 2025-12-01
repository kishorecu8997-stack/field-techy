"use client";
import { quillContent } from "@/dummy_data/client";
import { Button } from "@/shared/components/commonUI/Buttons";
import QuillEditor from "@/shared/components/QuillEditor";
import { useState } from "react";

/**
 * TermsAndCondition Component
 *
 * Renders a simple CMS management editor that uses a custom Quill text editor hook (`useQuillEditor`).
 * Users can edit HTML content directly in the editor and save (or preview) the current content value.
 *
 * @component
 * @example
 * return (
 *   <TermsAndCondition />
 * );
 *
 * @returns {JSX.Element} The rendered TermsAndCondition component.
 */
export default function TermsAndCondition() {
  const [content, setContent] = useState(quillContent);

  const onChange = (html: string) => {
    console.log("onChange:", html);
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
          onClick={() => alert(content)}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
