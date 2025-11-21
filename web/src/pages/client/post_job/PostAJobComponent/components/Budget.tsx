import { InputField } from "@/shared/components/commonUI/inputs";
import SectionHeader from "../SectionHeader";

const Budget = ({ isDisable }: { isDisable: boolean }) => {
  return (
   <div className="w-full space-y-2">
      <SectionHeader title="Budget" />
      <InputField
        disabled={isDisable}
        required
        name="budget"
        label="Estimated Budget"
        placeholder="e.g. $50,000"
      />
    </div>
  );
};

export default Budget;
