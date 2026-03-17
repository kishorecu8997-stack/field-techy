import { InputField } from "@/shared/components/commonUI/inputs";
import { validateSkillName } from "@/utils/validate";
/**
 * `SkillForm` provides the form fields for creating or editing a skill.
 * It is designed to be used within a `FormContainer` that provides the `react-hook-form` context.
 * This component includes a text input for the skill name.
 *
 * @returns {JSX.Element} The rendered form fields for a skill.
 */

export default function SkillForm() {
  return (
    <div>
      <div className="flex md:w-1/2">
        <InputField
          name="skillName"
          label="Skill Name"
          type="text"
          placeholder="Enter Name"
          required
          rules={{ validate: (v: string) => validateSkillName(v) }}
        />
      </div>
    </div>
  );
}
