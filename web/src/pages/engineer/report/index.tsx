import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { SelectField } from "@/shared/components/commonUI/inputs/SelectField";
import Popup from "@/shared/components/Popup";
import { useForm } from "react-hook-form";
import { IoCloseSharp } from "react-icons/io5";
import { validateDescription } from "@/pages/engineer/home/validation";

const ReportPage = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const formCtx = useForm({
    defaultValues: {},
  });

  const handleClose = () => {
    formCtx.reset();
    onClose();
  };

  return (
    <Popup onClose={handleClose} open={open}>
      <FormContainer methods={formCtx} className="flex flex-col gap-2">
        <div className="flex flex-col h-full max-h-[90vh] w-full max-w-md">
          {/* Fixed Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4">
            <div className="flex justify-end">
              <button
                className="cursor-pointer text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                onClick={handleClose}
              >
                <IoCloseSharp className="w-6 h-6" />
              </button>
            </div>
            <h1 className="text-xl font-bold text-center">Report an Issue</h1>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-0">
            <SelectField
              label="Issue Category"
              name="issue"
              required
              placeholder="Enter Issue Category"
              options={[
                { value: "1", label: "categories1" },
                { value: "2", label: "categories2" },
              ]}
            />
            <SelectField
              label="Priority Level"
              name="level"
              required
              placeholder="select a priority"
              options={[
                { value: "1", label: "levels1" },
                { value: "2", label: "levels2" },
              ]}
            />
            <TextareaInput
              label="Detailed Description"
              name="description"
              placeholder="Enter your Detailed Description"
              required
              rules={validateDescription(50, 2000, "Detailed Description")}
            />
            <FileUpload
              name="file"
              label="Attach File (If any)"
              required
              accept=".pdf, .jpg, .png"
              maxPages={5}
              validatePDF={true}
            />
          </div>

          {/* Fixed Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-6 ">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Submit
            </Button>
          </div>
        </div>
      </FormContainer>
    </Popup>
  );
};

export default ReportPage;
