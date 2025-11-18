import { ClientNameList, countryList, projectNameList, rateCardTypes, regionList } from "@/dummy_data/admin";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { useFormContext } from "react-hook-form";

/*
 * RateCardForm
 *
 * A form component for creating or editing a rate card.
 * Displays a form with fields for rate card type, client name, project name,
 * region, and country. Renders a SelectField component for each field.
 *
 * @returns {JSX.Element} The rendered rate card form.
 */
const RateCardForm = () => {
  const ctx = useFormContext();

  const watchRateType = ctx.watch("rateType");

  return (
    <div className="p-2 flex flex-col gap-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          name="rateType"
          label="Rate Card Type"
          required
          options={rateCardTypes}
        />
        {watchRateType === "clientSpecificRateCard" && (
          <SelectField
            name="clientName"
            label="Client Name"
            required
            multiple
            options={ClientNameList}
          />
        )}
        {watchRateType === "projectSpecificRateCard" && (
          <>
            <SelectField
              name="projectName"
              label="Project Name"
              required
              options={projectNameList}
            />
            <SelectField
              name="clientNameOfProject"
              label="Client Name of Project"
              required
              options={ClientNameList}
            />
            <SelectField
              name="region"
              label="Region"
              options={regionList}
            />
          </>
        )}
        <SelectField
          name="country"
          required
          label="Country"
          options={countryList}
        />
      </div>
    </div>
  );
};

export default RateCardForm;
