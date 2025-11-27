import { Controller, useForm } from "react-hook-form";
import { InputField } from "@/shared/components/commonUI/inputs";
import { Button } from "@/shared/components/commonUI/Buttons";
import MapSearch from "@/shared/components/MapWithSearch";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";

interface ProjectSiteForm {
  siteId: string;
  siteName: string;
  coordinates: [number, number];
}

export default function ProjectSidebar() {
  const methods = useForm<ProjectSiteForm>({
    defaultValues: {
      siteId: "",
      siteName: "",
      coordinates: [20.5937, 78.9629],
    },
  });

  const { control, handleSubmit } = methods;

  const onSubmit = (data: ProjectSiteForm) => {
    console.log("Submitted:", data);
  };

  return (
    <div className="p-4 w-full max-w-md">
      <FormContainer methods={methods}>
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
                initialPosition={value} // current form value
                onPositionChange={onChange} // update form when map changes
                viewOnly={false}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <Button
            className="w-fit mt-2 rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
            onClick={handleSubmit(onSubmit)} // ✅ Use handleSubmit from destructured methods
          >
            Add Project Site
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}
