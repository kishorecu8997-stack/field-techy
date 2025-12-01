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
import useDrawerStore from "@/shared/store/useDrawerStore";
import { toast } from "react-toastify";

export default function AddProjectMember() {
  const methods = useForm<ProjectMember>({});
  const { setISOpenSidebar } = useDrawerStore();

  const handleSubmit = (data: ProjectMember) => {
    console.log("AddProjectMember", data);
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
          Add Project Member
        </Button>
      </div>
    </FormContainer>
  );
}
