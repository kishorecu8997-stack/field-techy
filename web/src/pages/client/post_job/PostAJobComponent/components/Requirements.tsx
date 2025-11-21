import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import SectionHeader from "../SectionHeader";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";

const Requirements = ({ isDisable }: { isDisable: boolean }) => {
  const { currentLocation } = usePostAJobStore();

  return (
    <div className="w-full space-y-2">
      <SectionHeader title="Requirements" />
      <div className="flex flex-row w-full gap-4 items-center">
        <div className="w-full">
          <SelectField
            disabled={isDisable}
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
        <InputField
          name="numberOfVacancy"
          label="Number of Persons Required"
          disabled={isDisable}
        />
      </div>
      <TagSelectField
        required
        placeholder="Select a Skills"
        disabled={isDisable}
        name="skills"
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
      <TagSelectField
        disabled={isDisable}
        required
        placeholder="Select a Tools"
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
      {currentLocation === CurrentLocation.dispatch && (
        <TagSelectField
          name="task"
          placeholder="Select a Task"
          label="Task"
          required
          options={[
            {
              value: "task1",
              label: "Task 1",
            },
            {
              value: "task2",
              label: "Task 2",
            },
          ]}
        />
      )}
      <TagSelectField
        disabled={isDisable}
        name="safetyWears"
        label="Safety Wears"
        placeholder="Select a Safety Wears"
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
      <TextareaInput
        required
        name="description"
        label="Description"
        disabled={isDisable}
      />
    </div>
  );
};

export default Requirements;
