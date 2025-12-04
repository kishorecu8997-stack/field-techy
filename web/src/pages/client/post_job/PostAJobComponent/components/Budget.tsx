import { InputField } from "@/shared/components/commonUI/inputs";
import SectionHeader from "../SectionHeader";
import { validateAmount } from "@/pages/engineer/auth/components/profile_setup/profileValidators";

/*
 *  Budget
 *    - Displays a form to add budget
 * @returns {JSX.Element} The rendered Budget
 * @constructor
 */
const Budget = ({ isDisable }: { isDisable: boolean }) => {
  return (
    <div className="w-full space-y-2">
      <SectionHeader title="Budget" />
      <InputField
        disabled={isDisable}
        required
        inputMode="number"
        name="budget"
        label="Estimated Budget"
        placeholder="e.g. $50,000"
        rules={{ validate: (v) => validateAmount(v) }}
      />
    </div>
  );
};

export default Budget;
