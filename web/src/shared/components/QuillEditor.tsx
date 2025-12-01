import ReactQuill from "react-quill-new";

const QuillEditor = ({
  value,
  onChange,
  isEdit,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  isEdit: boolean;
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
        theme={"snow"}
        placeholder={placeholder}
        style={{ minHeight: "200px" }}
      />
    </div>
  );
};

export default QuillEditor;
