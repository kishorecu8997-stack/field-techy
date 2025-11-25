import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { addEditToolsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

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
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const methods = useForm<AddToolsFormData>({
    defaultValues: {
      tools: [],
    },
  });

  const onSubmit = async (data: AddToolsFormData) => {
    await showPopup({
      title: "Add Tools",
      body: "Are you sure you want to add these tools?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            console.log("No button clicked");
            close(true);
          },
        },
        {
          label: "Yes, add",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Tools Added Successfully");
            close(true);
            setActiveKey("skillsAndTools");
          },
        },
      ],
    });
  };

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
