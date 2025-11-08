// "use client"; // ✅ if using Next.js 13+, ensures this runs only on the client

// import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";

// export interface QuillEditorProps {
//   value?: string;
//   onChange?: (html: string) => void;
//   placeholder?: string;
//   readOnly?: boolean;
// }

// export interface QuillEditorRef {
//   getHtml: () => string;
//   quillInstance: Quill | null;
// }

// const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(
//   (
//     {
//       value = "",
//       onChange,
//       placeholder = "Start writing here...",
//       readOnly = false,
//     },
//     ref
//   ) => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const quillRef = useRef<Quill | null>(null);

//     // ✅ Expose helper methods to parent components
//     useImperativeHandle(
//       ref,
//       () => ({
//         getHtml: () => quillRef.current?.root.innerHTML || "",
//         quillInstance: quillRef.current,
//       }),
//       []
//     );

//     // ✅ Initialize Quill only once — even in StrictMode
//     useEffect(() => {
//       if (!containerRef.current || quillRef.current) return; // prevent double init

//       const q = new Quill(containerRef.current, {
//         theme: "snow",
//         placeholder,
//         readOnly,
//         modules: {
//           toolbar: [
//             [{ header: [1, 2, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link", "image"],
//             ["clean"],
//           ],
//         },
//       });

//       quillRef.current = q;

//       // Set initial value
//       q.root.innerHTML = value;

//       // Handle text changes
//       const handleChange = () => {
//         onChange?.(q.root.innerHTML);
//       };
//       q.on("text-change", handleChange);

//       // Cleanup when component unmounts
//       return () => {
//         q.off("text-change", handleChange);
//         quillRef.current = null;
//       };
//     }, []); // ✅ empty deps — run only once

//     // ✅ Update content when `value` prop changes externally
//     useEffect(() => {
//       if (
//         quillRef.current &&
//         value !== quillRef.current.root.innerHTML
//       ) {
//         quillRef.current.root.innerHTML = value;
//       }
//     }, [value]);

//     // ✅ Toggle read-only dynamically
//     useEffect(() => {
//       if (quillRef.current) {
//         quillRef.current.enable(!readOnly);
//       }
//     }, [readOnly]);

//     // ✅ Update placeholder dynamically
//     useEffect(() => {
//       if (quillRef.current && placeholder) {
//         quillRef.current.root.dataset.placeholder = placeholder;
//       }
//     }, [placeholder]);

//     return (
//       <div
//         ref={containerRef}
//         style={{
//           minHeight: "100%",
//           backgroundColor: "white",
//         }}
//       />
//     );
//   }
// );

// QuillEditor.displayName = "QuillEditor";
// export default QuillEditor;


import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export function useQuillEditor({
  value = "",
  onChange,
  placeholder = "Start writing...",
  readOnly = false,
}: {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const q = new Quill(containerRef.current, {
      theme: "snow",
      placeholder,
      readOnly,
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    quillRef.current = q;
    q.root.innerHTML = value;
    q.on("text-change", () => onChange?.(q.root.innerHTML));

    return () => {
      q.off("text-change", () => onChange?.(q.root.innerHTML));
      quillRef.current = null;
    };
  }, []);

  return { containerRef, quillRef };
}
