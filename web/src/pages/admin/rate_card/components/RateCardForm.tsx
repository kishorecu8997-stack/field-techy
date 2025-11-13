import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { useFormContext } from "react-hook-form";

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
          options={[
            { label: "Master Rate Card", value: "masterRateCard" },
            {
              label: "Client Specific Rate Card",
              value: "clientSpecificRateCard",
            },
            {
              label: "Project Specific Rate Card",
              value: "projectSpecificRateCard",
            },
          ]}
        />
        {watchRateType === "clientSpecificRateCard" && (
          <SelectField
            name="clientName"
            label="Client Name"
            options={[
              { label: "Client 1", value: "client1" },
              { label: "Client 2", value: "client2" },
              { label: "Client 3", value: "client3" },
            ]}
          />
        )}
        {watchRateType === "projectSpecificRateCard" && (
          <>
            <SelectField
              name="projectName"
              label="Project Name"
              required
              options={[
                { label: "Project 1", value: "project1" },
                { label: "Project 2", value: "project2" },
                { label: "Project 3", value: "project3" },
              ]}
            />
            <SelectField
              name="clientNameOfProject"
              label="Client Name of Project"
              options={[
                { label: "Client 1", value: "client1" },
                { label: "Client 2", value: "client2" },
                { label: "Client 3", value: "client3" },
              ]}
            />
            <SelectField
              name="region"
              label="Region"
              options={[
                { label: "Region 1", value: "region1" },
                { label: "Region 2", value: "region2" },
                { label: "Region 3", value: "region3" },
              ]}
            />
          </>
        )}
        <SelectField
          name="country"
          required
          label="Country"
          options={[
            { label: "Country 1", value: "country1" },
            { label: "Country 2", value: "country2" },
            { label: "Country 3", value: "country3" },
          ]}
        />
      </div>
    </div>
  );
};

export default RateCardForm;
