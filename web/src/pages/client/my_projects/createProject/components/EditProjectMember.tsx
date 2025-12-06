import { memberRoles } from "@/dummy_data/client";
import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { validateName } from "@/utils/validate";
import { useForm } from "react-hook-form";
import type { ProjectMember } from "../../types";
import { projectMembers } from "@/dummy_data/client/myProject";
import { toast } from "react-toastify";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * EditProjectMember
 *
 * Form used to edit an existing project member. The component prefills the
 * form with data from `projectMembers` (selected by `editMemberId` stored in
 * localStorage) and allows updating member fields such as name, email, mobile,
 * and role.
 *
 * Features:
 * - Uses `react-hook-form` for form state and validation
 * - Validates fields using shared validation utilities
 * - On submit, shows a success toast and closes the sidebar via `useDrawerStore`
 *
 * Notes:
 * - This component expects `editMemberId` to be present in localStorage.
 * - Mobile numbers are normalized to include the `+91` prefix if missing.
 *
 * @component
 * @returns {JSX.Element} The edit-member form UI
 */
export default function EditProjectMember() {
  const { setISOpenSidebar } = useDrawerStore();

  const memberId = localStorage.getItem("editMemberId");
  const member = projectMembers.find((m) => m.id === Number(memberId));

  const methods = useForm<ProjectMember>({
    defaultValues: {
      ...member,
      mobile: member?.mobile?.startsWith("+91")
        ? member?.mobile
        : `+91 ${member?.mobile || "9876543212"}`,
    },
  });

  const handleSubmit = (data: ProjectMember) => {
    console.log("EditProjectMember", data);
    toast.success("Project member updated successfully!");
    setISOpenSidebar(false);
  };

  return (
    <FormContainer
      methods={methods}
      className="flex flex-col h-full"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <InputField
          name="firstName"
          label="First Name"
          required
          placeholder="First Name"
          rules={{ validate: (v: string) => validateName(v) }}
        />
        <InputField
          name="lastName"
          label="Last Name"
          required
          placeholder="Last Name"
          rules={{ validate: (v: string) => validateName(v) }}
        />
        <InputField
          name="email"
          label="Email"
          required
          placeholder="Email"
          rules={validateEmailRules}
        />
        <PhoneInputField name="mobile" label="Mobile Number" required />
        <SelectField
          label="Role"
          name="role"
          placeholder="Select Role"
          options={memberRoles}
          required
        />
      </div>
      <div className="mt-auto">
        <Button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
        >
          Save Changes
        </Button>
      </div>
    </FormContainer>
  );
}
