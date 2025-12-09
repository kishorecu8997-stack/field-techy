import {
  currencyTypes,
  projectCountries,
  workTypes,
} from "@/dummy_data/client";
import SectionHeader from "./SectionHeader";
import { CheckboxField } from "@/shared/components/commonUI/inputs/CheckBoxField";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";

/**
 * LocationPage
 *
 * Form section responsible for selecting project location, work type and billing currency.
 * It exposes controls for on-site/remote country selection, location type, project address
 * and billing currency. Fields can be disabled via the `isDisable` prop (used for review mode).
 *
 * Props:
 * - `isDisable` (boolean): When true, input fields are rendered in a disabled state.
 *
 * Notes:
 * - This component is designed to be used inside a `FormProvider` and relies on the
 *   shared input components to integrate with `react-hook-form`.
 *
 * @component
 * @param {{ isDisable: boolean }} props
 * @returns {JSX.Element} Location and currency selection section
 */
const LocationPage = ({ isDisable }: { isDisable: boolean }) => {
  return (
    <div>
      <SectionHeader title="Location and Currency" />
      <CheckboxField
        name="locationType"
        disabled={isDisable}
        label="Location Type"
        required
        direction="horizontal"
        options={workTypes}
        wrapperClassName="border pl-2 pt-2 bg-white border-gray-300 rounded-sm dark:bg-gray-800 dark:text-white"
      />
      <TagSelectField
        name="onSiteCoutry"
        label="On-site Countries"
        placeholder="Select countries from the list"
        required
        disabled={isDisable}
        options={projectCountries}
      />
      <TagSelectField
        disabled={isDisable}
        name="remoteCoutry"
        label="Remote Countries"
        placeholder="Select countries from the list"
        required
        options={projectCountries}
      />

      <RadioField
        disabled={isDisable}
        label="Remote Service Address"
        required
        name="remoteServiceAddress"
        direction="horizontal"
        wrapperClassName="border pl-2 pt-2 bg-white border-gray-300 rounded-sm dark:bg-gray-800 dark:text-white"
        options={[
          { label: "Mandatory", value: "mandatory" },
          { label: "Optional", value: "optional" },
        ]}
      />

      <RadioField
        disabled={isDisable}
        label="Project Address"
        required
        name="projectAddress"
        direction="horizontal"
        wrapperClassName="border pl-2 pt-2 bg-white border-gray-300 rounded-sm dark:bg-gray-800 dark:text-white"
        options={[
          { label: "Predefined Address", value: "predefinedAddress" },
          { label: "Any Address", value: "anyAddress" },
        ]}
      />

      <SelectField
        disabled={isDisable}
        name="curency"
        label="Billing Currency"
        placeholder="Select Curreny"
        required
        options={currencyTypes}
      />
    </div>
  );
};

export default LocationPage;
