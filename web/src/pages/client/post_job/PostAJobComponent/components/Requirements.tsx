import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import SectionHeader from "../SectionHeader";

const Requirements = () => {
  return (
    <div className="w-full space-y-2">
      <SectionHeader title="Requirements" />
      <div className="flex flex-row w-full gap-2 items-center">
        <div className="w-full">
          <SelectField
            required
            name="experienceLevel"
            label=" Engineer Experience Level"
            options={[
              { value: "experience1", label: "Experience 1" },
              { value: "experience2", label: "Experience 2" },
              { value: "experience3", label: "Experience 3" },
            ]}
          />
        </div>
        <InputField name="numberOfVacancy" label="Number of Persons Required" />
      </div>
      <SelectField
        required
        name="skillsRequired"
        label="Skills"
        options={[
          {
            value: "skill1",
            label: "Skill 1",
          },
          {
            value: "skill2",
            label: "Skill 2",
          },
        ]}
      />
      <SelectField
        required
        name="tools"
        label="Tools"
        options={[
          {
            value: "tool1",
            label: "Tool 1",
          },
          {
            value: "tool2",
            label: "Tool 2",
          },
        ]}
      />
      <SelectField
        name="safetyWears"
        label="Safety Wears"
        options={[
          {
            value: "safetyWear1",
            label: "Safety Wear 1",
          },
          {
            value: "safetyWear2",
            label: "Safety Wear 2",
          },
        ]}
      />
      <TextareaInput required name="description" label="Description" />
    </div>
  );
};

export default Requirements;
