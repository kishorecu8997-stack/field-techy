import { existingMembers, memberRoles } from "@/dummy_data/client";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { useForm } from "react-hook-form";
import type { ExistingFTMember } from "../../types";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { toast } from "react-toastify";
/**
 * AddExistingFTMember
 *
 * A small form used to add an existing field-technical (FT) member to a project.
 *
 * Features:
 * - Select an existing member from a dropdown and choose their role
 * - Uses `react-hook-form` for local form state
 * - On submit, shows a success toast and closes the sidebar via `useDrawerStore`
 *
 * @component
 * @returns {JSX.Element} Form UI for selecting and adding an existing project member
 */
export default function AddExistingFTMember() {
  const methods = useForm<ExistingFTMember>({});
  const { setISOpenSidebar } = useDrawerStore();

  const handleSubmit = (data: ExistingFTMember) => {
    console.log("ExistingFTMember", data);
    toast.success("Project member added successfully!");
    setISOpenSidebar(false);
  };

  return (
    <FormContainer
      methods={methods}
      className="flex flex-col h-full"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <SelectField
          label="Select Existing Member"
          name="existingMember"
          options={existingMembers}
          required
        />
        <SelectField label="Role" name="role" options={memberRoles} required />
      </div>
      <div className="mt-auto">
        <Button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
        >
          Add Project Member
        </Button>
      </div>
    </FormContainer>
  );
}
