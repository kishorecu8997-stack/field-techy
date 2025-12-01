import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";

/**
 * QuillEditor Component
 * Renders a Quill editor with a custom theme and placeholder.
 * @param param0
 * @returns
 */
const QuillEditor = ({
  value,
  onChange,
  isEdit = true,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  isEdit?: boolean;
  placeholder: string;
}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div>
      <ReactQuill
        value={value}
        onChange={onChange}
        readOnly={!isEdit}
        modules={isEdit ? modules : { toolbar: false }}
        theme={isEdit ? "snow" : "bubble"}
        placeholder={placeholder}
        style={{ minHeight: "200px" }}
      />
    </div>
  );
};

export default QuillEditor;
