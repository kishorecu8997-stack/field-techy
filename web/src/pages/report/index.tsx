import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { SelectField } from "@/shared/components/commonUI/inputs/SelectField";
import Popup from "@/shared/components/Popup";
import { useForm } from "react-hook-form";
import { IoCloseSharp } from "react-icons/io5";

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
  return (
    <Popup onClose={onClose} open={open}>
      <div className="flex flex-col p-6">
        <div className="flex justify-end">
          <button
            className="cursor-pointer text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <IoCloseSharp className="w-6 h-6" />
          </button>
        </div>
        <FormContainer methods={formCtx} className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-center">Report a problem</h1>

          <SelectField
            label="Issue Category"
            name="issue"
            placeholder="Enter Issue Category"
            options={[
              { value: "1", label: "categories1" },
              { value: "2", label: "categories2" },
            ]}
          />
          <SelectField
            label="Priority Level"
            name="level"
            placeholder="select a priority"
            options={[
              { value: "1", label: "levels1" },
              { value: "2", label: "levels2" },
            ]}
          />
          <TextareaInput
            label="Description"
            name="description"
            placeholder="Enter your description"
          />
          <FileUpload name="file" label="Attach File(If any)" required />
          <Button className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition mt-5">
            Submit
          </Button>
        </FormContainer>
      </div>
    </Popup>
  );
};

export default ReportPage;
