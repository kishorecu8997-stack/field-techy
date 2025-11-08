"use client";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useQuillEditor } from "@/shared/components/commonUI/text_editor";
import { useState } from "react";

export default function ManageCMS() {
  const [value, setValue] = useState("<p>Hello world</p>");
  const { containerRef } = useQuillEditor({ value, onChange: setValue });

  return (
    <div className="w-full h-full flex flex-col">
      <div ref={containerRef} className="h-full w-full" />
      <div className="w-full flex justify-end ">

      <Button className="w-fit " onClick={() => alert(value)}>Save</Button>
      </div>
    </div>
  );
}
