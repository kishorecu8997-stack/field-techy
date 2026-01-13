import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import SectionHeader from "../SectionHeader";
import { useFormContext } from "react-hook-form";
import {
  primaryLanguageOptions,
  secondaryLanguageOptions,
} from "@/dummy_data/client";

/*
 * Languages component
 *
 * Displays a section for selecting primary and secondary languages.
 * It uses the SelectField component to render the dropdown options.
 * It filters out the selected language options to prevent duplicates.
 */
const Languages = ({ isDisable }: { isDisable: boolean }) => {
  const ctx = useFormContext();
  const watchPrimaryLanguage = ctx.watch("primaryLanguage");
  const watchSecondaryLanguage = ctx.watch("secondaryLanguage");

  const filteredPrimaryLanguageOptions = primaryLanguageOptions.filter(
    (opt) => opt.value !== watchSecondaryLanguage,
  );
  const filteredSecondaryLanguageOptions = secondaryLanguageOptions.filter(
    (opt) => opt.value !== watchPrimaryLanguage,
  );

  return (
    <div className="w-full flex flex-col gap-2">
      <SectionHeader title="Languages" />
      <div className="flex flex-row w-full gap-4 items-center">
        <div className="w-full">
          <SelectField
            disabled={isDisable}
            required
            name="primaryLanguage"
            label="Primary Language"
            options={filteredPrimaryLanguageOptions}
          />
        </div>
        <div className="w-full">
          <SelectField
            disabled={isDisable}
            required
            name="secondaryLanguage"
            label="Secondary Language"
            options={filteredSecondaryLanguageOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Languages;
