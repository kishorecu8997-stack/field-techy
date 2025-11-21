import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import SectionHeader from "../SectionHeader";

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
