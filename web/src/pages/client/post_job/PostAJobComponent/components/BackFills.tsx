import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import SectionHeader from "../SectionHeader";

const BackFills = () => {
  return (
    <div className="w-full space-y-2">
      <SectionHeader title=" Backfill Engineer" />
      <RadioField
        label="Backfill Engineer"
        name="backfillEngineer"
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
