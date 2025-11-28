import { InputField } from "@/shared/components/commonUI/inputs";
import MapSearch from "@/shared/components/MapWithSearch";
import { Controller, useFormContext } from "react-hook-form";

export default function ProjectSidebar() {
  const { control } = useFormContext();

  return (
    <div className="p-4 w-full max-w-md">
      <InputField
        name="siteId"
        label="Site ID"
        required
        placeholder="Enter Site ID"
      />
      <InputField
        name="siteName"
        label="Site Name"
        required
        placeholder="Enter Site Name"
      />

      {/* Map Field */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Site Location
        </label>
        <Controller
          name="coordinates"
          control={control}
          render={({ field: { value, onChange } }) => (
            <MapSearch
              initialPosition={value}
              onPositionChange={onChange}
              viewOnly={false}
            />
          )}
        />
      </div>
    </div>
  );
}
