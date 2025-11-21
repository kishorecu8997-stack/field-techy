import { InputField } from "@/shared/components/commonUI/inputs";
import usePostAJobStore, { CurrentLocation } from "@/shared/store/postAJobStore";

const BasicInfo = ({isDisable}:{isDisable:boolean}) => {

const {currentLocation} = usePostAJobStore()  

  return (
    <div className="w-full space-y-2">
      <InputField
        label="Project Name"
        name="projectName"
        placeholder="Project Name"
        disabled={isDisable}
        required={currentLocation === CurrentLocation.dedicated}
      />
      <InputField label="Job Name" name="jobName" placeholder="Job Name" required disabled={isDisable}/>
      <InputField label="Job Title" name="jobTitle" placeholder="Job Title" required disabled={isDisable}/>
    </div>
  );
};

export default BasicInfo;
