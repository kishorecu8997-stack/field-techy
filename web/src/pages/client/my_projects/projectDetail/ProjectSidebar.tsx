import { InputField } from "@/shared/components/commonUI/inputs";
import MapSearch from "@/shared/components/MapWithSearch";
import { validateSiteId, validateSiteName } from "@/utils/validate";
import { Controller, useFormContext } from "react-hook-form";

/**
 * ProjectSidebar
 *
 * Sidebar form section used when creating or editing a project site.
 *
 * Responsibilities:
 * - Render input fields for `siteId` and `siteName` with validation rules.
 * - Provide a `MapSearch` component controlled via `react-hook-form` for selecting coordinates.
 *
 * Notes:
 * - Must be used inside a `FormProvider` / `useFormContext` so the `Controller` and `InputField`
 *   can access form state.
 *
 * @component
 * @returns {JSX.Element} Form sidebar containing site inputs and map selector
 */
export default function ProjectSidebar() {
  const { control } = useFormContext();

  return (
    <div className="p-4 w-full max-w-md">
      <InputField
        name="siteId"
        label="Site ID"
        required
        placeholder="Enter Site ID"
        rules={{ validate: (v: string) => validateSiteId(v) }}
      />
      <InputField
        name="siteName"
        label="Site Name"
        required
        placeholder="Enter Site Name"
        rules={{ validate: (v: string) => validateSiteName(v) }}
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
