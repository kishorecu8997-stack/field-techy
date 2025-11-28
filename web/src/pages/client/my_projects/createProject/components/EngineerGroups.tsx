import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import SectionHeader from "./SectionHeader";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import { projectGroups } from "@/dummy_data/client";

export default function EngineerGroups() {
  return (
    <div>
      <SectionHeader title="Engineer & Groups" />
      <RadioField
        // disabled={isDisable}
        label="Engineers Needed From"
        required
        name="engineersNeededFrom"
        direction="horizontal"
        wrapperClassName="border pl-2 pt-2 bg-white border-gray-300 rounded-sm dark:bg-gray-800 dark:text-white"
        options={[
          { label: "All", value: "all" },
          { label: "Specific Group", value: "specificGroup" },
        ]}
      />
      <TagSelectField
        name="group"
        label="Select Group"
        placeholder="Select Group"
        required
        options={projectGroups}
      />
    </div>
  );
}
