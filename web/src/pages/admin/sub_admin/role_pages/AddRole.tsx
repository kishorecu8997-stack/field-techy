import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import RoleTable from "./RoleTable";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * AddRole Component
 *
 * Renders a form for creating or editing a role.
 * Includes sections for role details and permissions.
 *
 * @component
 * @returns {JSX.Element} The rendered AddRole component.
 */
const AddRole = () => {
  const formCtx = useForm({
    defaultValues: {
      moduleName: "",
      addAndEdit: true,
      view: false,
      delete: false,
    },
  });

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-md">
      <FormContainer
        methods={formCtx}
        className="flex items-center gap-3 flex-wrap w-full"
      >
        <div className="flex flex-col w-full flex-1 p-2">
          <div className="flex flex-col sm:flex-row px-3 w-full gap-3 items-end sm:items-center sm:max-w-[30rem] flex-1">
            <InputField
              name="moduleName"
              placeholder="Enter Role Name"
              required
              label="Add Role Name"
            />
          </div>
          <RoleTable />
          <div className="px-3">
            <Button type="submit" className="w-fit bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
              Submit
            </Button>
          </div>
        </div>
      </FormContainer>
    </div>
  );
};

export default AddRole;
