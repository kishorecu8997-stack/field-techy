import { InputField } from "@/shared/components/commonUI/inputs";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { validateName } from "../../Validates";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";

/*
 *  Basic Info
 *    - Displays a form to add basic info
 * @returns {JSX.Element} The rendered Basic Info
 * @constructor
 */
const BasicInfo = ({ isDisable }: { isDisable: boolean }) => {
  const { currentLocation } = usePostAJobStore();

  return (
    <div className="w-full space-y-2">
      <SelectField
        label="Project Name"
        name="projectName"
        placeholder="Project Name"
        required={currentLocation === CurrentLocation.dedicated}
        options={[
          { label: "Project 1", value: "project1" },
          { label: "Project 2", value: "project2" },
        ]}
        disabled={isDisable}
      />
      <InputField
        label="Job Name"
        name="jobName"
        placeholder="Job Name"
        required
        disabled={isDisable}
        rules={{ validate: (v: string) => validateName(v) }}
      />
      <InputField
        label="Job Title"
        name="jobTitle"
        placeholder="Job Title"
        required
        disabled={isDisable}
        rules={{ validate: (v: string) => validateName(v) }}
      />
    </div>
  );
};

export default BasicInfo;
