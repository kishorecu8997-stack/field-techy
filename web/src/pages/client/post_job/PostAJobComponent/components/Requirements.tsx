import {
  experienceLevel,
  safetyWears,
  skills,
  task,
  tools,
} from "@/dummy_data/client";
import { validateDescription } from "@/pages/engineer/home/validation";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import SectionHeader from "../SectionHeader";
/*
 *  Requirements
 *    - Displays a form to add requirements
 * @returns {JSX.Element} The rendered Requirements
 * @constructor
 */
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
            options={experienceLevel}
          />
        </div>
        <InputField
          name="numberOfVacancy"
          label="Number of Persons Required"
          inputMode="number"
          disabled={isDisable}
        />
      </div>
      <TagSelectField
        required
        placeholder="Select a Skills"
        disabled={isDisable}
        name="skills"
        label="Skills"
        options={skills}
      />
      <TagSelectField
        disabled={isDisable}
        required
        placeholder="Select a Tools"
        name="tools"
        label="Tools"
        options={tools}
      />
      {currentLocation !== CurrentLocation.dedicated && (
        <TagSelectField
          name="task"
          placeholder="Select a Task"
          label="Task"
          required
          options={task}
        />
      )}
      <TagSelectField
        disabled={isDisable}
        name="safetyWears"
        label="Safety Wears"
        placeholder="Select a Safety Wears"
        options={safetyWears}
      />
      <TextareaInput
        required
        name="description"
        label="Description"
        disabled={isDisable}
        rules={validateDescription(5, 2000, "Description")}
      />
    </div>
  );
};

export default Requirements;
