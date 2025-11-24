import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { addEditToolsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";

/**
 * Defines the shape of the form data for adding tools.
 * @typedef {Object} AddToolsFormData
 * @property {string[]} tools - An array of selected tool IDs.
 */
export type AddToolsFormData = {
  tools: string[];
};

/**
 * The AddTools component renders a form for adding new professional tools.
 * It uses `react-hook-form` for form management and a `TagSelectField` for multi-selection.
 * @param {AddToolsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered AddTools form component.
 */
const AddTools = () => {
  /**
   * Initializes `react-hook-form` with default values for the tools form.
   */
  const methods = useForm<AddToolsFormData>({
    defaultValues: {
      tools: [],
    },
  });

  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the selected tools.
   * @param {AddToolsFormData} data - The validated form data containing an array of tool IDs.
   */
  const onSubmit = (data: AddToolsFormData) => {
    console.log("Form data:", data);
    toast.success("Tools Saved Successfully");  
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Transforms the raw tools data into a format suitable for the `TagSelectField` component.
   * @type {Array<{label: string, value: string}>}
   */
  const toolOptions = addEditToolsData.map((tool) => ({
    label: tool.label,
    value: tool.id.toString(),
  }));

  return (
    <FormContainer
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <TagSelectField
          label="Tools"
          isShowLabel={false}
          name="tools"
          placeholder="Select Tool Name"
          required
          options={toolOptions}
          maxTags={15}
        />
      </div>

      <div className="bg-white ">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Save
        </Button>
      </div>
    </FormContainer>
  );
};

export default AddTools;
