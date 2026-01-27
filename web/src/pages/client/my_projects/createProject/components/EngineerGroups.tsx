import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import SectionHeader from "./SectionHeader";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import { projectGroups } from "@/dummy_data/client";
import { useFormContext } from "react-hook-form";

/**
 * EngineerGroups
 *
 * Form section that allows selecting how engineers should be sourced for a project
 * and optionally choosing specific engineer groups. It renders a radio control
 * for source selection and a tag-select field for picking groups.
 *
 * Props:
 * - `isDisable` (boolean): disables inputs when true (used during review mode)
 *
 * Notes:
 * - This component is intended to be used inside the multi-step project form
 *   and relies on surrounding `FormProvider` context for form wiring via the
 *   input components it contains.
 *
 * @component
 * @returns {JSX.Element} Engineer selection and group picker section
 */
export default function EngineerGroups({ isDisable }: { isDisable: boolean }) {
  const { watch } = useFormContext();
  const engineersNeededFrom = watch("engineersNeededFrom", "all");

  return (
    <div>
      <SectionHeader title="Engineer & Groups" />
      <RadioField
        disabled={isDisable}
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
      {engineersNeededFrom === "specificGroup" && (
        <TagSelectField
          disabled={isDisable}
          name="group"
          label="Select Group"
          placeholder="Select Group"
          required
          options={projectGroups}
        />
      )}
    </div>
  );
}
