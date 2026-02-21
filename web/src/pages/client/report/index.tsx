import { Button } from "@/shared/components/commonUI/Buttons";
import { FileUpload, TextareaInput } from "@/shared/components/commonUI/inputs";
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
        <FormContainer methods={formCtx} className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-center dark:text-gray-100 text-gray-800">
            Report a problem
          </h1>

          <SelectField
            label="Issue Category"
            name="name"
            placeholder="Enter your name"
            options={[
              { value: "1", label: "categories1" },
              { value: "2", label: "categories2" },
            ]}
          />
          <SelectField
            label="Priority Level"
            name="name"
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
          <FileUpload
            name="file"
            label="Attach File (If any)"
            accept=".pdf, .jpg, .png"
            placeholder="Attach File"
            maxPages={5}
            validatePDF={true}
          />
          <Button variant="primary" size="lg">Submit</Button>
        </FormContainer>
      </div>
    </Popup>
  );
};

export default ReportPage;
