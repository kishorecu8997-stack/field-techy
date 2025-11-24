"use client";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useQuillEditor } from "@/shared/components/commonUI/text_editor";
import { useState } from "react";

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
  const [value, setValue] = useState(`<p>
CMSLegal provides comprehensive legal solutions for modern businesses.<br/><br/>
Our team delivers trusted guidance across multiple practice areas.<br/><br/>
We focus on clarity, compliance, and actionable legal insights.<br/><br/>
Empowering clients with reliable and efficient legal support.</p>`);
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
