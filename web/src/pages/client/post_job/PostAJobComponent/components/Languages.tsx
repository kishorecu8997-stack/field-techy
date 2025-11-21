import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import SectionHeader from "../SectionHeader";

const Languages = ({ isDisable }: { isDisable: boolean }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <SectionHeader title="Languages" />
      <div className="flex flex-row w-full gap-2 items-center">
        <div className="w-full">
          <SelectField
            disabled={isDisable}
            required
            name="primaryLanguage"
            label="Primary Language"
            options={[
              { value: "language1", label: "Language 1" },
              { value: "language2", label: "Language 2" },
              { value: "language3", label: "Language 3" },
            ]}
          />
        </div>
        <div className="w-full">
          <SelectField
            disabled={isDisable}
            required
            name="secondaryLanguage"
            label="Secondary Language"
            options={[
              { value: "language1", label: "Language 1" },
              { value: "language2", label: "Language 2" },
              { value: "language3", label: "Language 3" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Languages;
