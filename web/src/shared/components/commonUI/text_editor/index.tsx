import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

/**
 * Initializes a Quill rich-text editor with two-way binding.
 *
 * @param {Object} options - Editor config.
 * @param {string} [options.value=""] - Initial HTML content.
 * @param {(html: string) => void} [options.onChange] - Callback on content change.
 * @param {string} [options.placeholder="Start writing..."] - Placeholder text.
 * @param {boolean} [options.readOnly=false] - If true, editor is read-only.
 * @returns {{ containerRef: React.RefObject<HTMLDivElement>, quillRef: React.MutableRefObject<Quill | null> }}
 * React refs for editor container and Quill instance.
 */
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
