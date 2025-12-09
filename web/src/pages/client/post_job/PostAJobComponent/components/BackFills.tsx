import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import SectionHeader from "../SectionHeader";

/*
 *  Backfill Engineer
 *    - Displays a form to add backfill engineer details
 * @returns {JSX.Element} The rendered Backfill Engineer
 * @constructor
 */
const BackFills = ({ isDisable }: { isDisable: boolean }) => {
  return (
    <div className="w-full space-y-2">
      <SectionHeader title=" Backfill Engineer" />
      <RadioField
        disabled={isDisable}
        label="Backfill Engineer"
        name="backFills"
        direction="horizontal"
        options={[
          { label: "Required", value: "required" },
          { label: "Not Required", value: "not-required" },
        ]}
      />
    </div>
  );
};

export default BackFills;
