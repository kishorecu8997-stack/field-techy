import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import SectionHeader from "../../SectionHeader";
import { validateDescription } from "@/pages/engineer/home/validation";

const JobDetailsSection = ({ isDisable }: { isDisable: boolean }) => {
    return (
        <div className="space-y-3">
            <SectionHeader title="Job Details" />
            <InputField
                name="jobTitle"
                label="Job Title"
                placeholder="Enter Job Title"
                required
                disabled={isDisable}
            />
            <TextareaInput
                name="description"
                label="Job Description"
                placeholder="Describe the role"
                required
                disabled={isDisable}
                rules={validateDescription(5, 2000, "Job Description")}
            />
        </div>
    );
};
export default JobDetailsSection;
