"use client";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useQuillEditor } from "@/shared/components/commonUI/text_editor";
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
  const [value, setValue] =
    useState(`<p>These Terms and Conditions outline the rules and guidelines for using our services.
By accessing our platform, you agree to comply with all stated requirements.
We reserve the right to update or modify these terms at any time.
Continued use of our services indicates acceptance of the latest terms.</p>`);
  const { containerRef } = useQuillEditor({ value, onChange: setValue });

  return (
    <div className="w-full h-full flex flex-col">
      <div ref={containerRef} className="h-full w-full" />
      <div className="w-full flex justify-end ">
        <Button
          className="w-fit mt-6 bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          onClick={() => alert(value)}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
