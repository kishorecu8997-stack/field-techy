import { InputField } from "@/shared/components/commonUI/inputs";
import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";
import {
  validateCompany,
  validateDesignation,
  validateExperience,
  validateLocation,
} from "@/utils/validate";

/**
 * ExperienceDetails component handles the professional experience section of the engineer registration form.
 * It captures the engineer's work history, current role, and professional documentation.
 *
 * Form Fields:
 * - Resume: Upload functionality for CV/resume
 * - Current Designation: Current job title or role
 * - Location: Work or preferred location
 * - Company/Employer: Current or most recent employer
 * - Total Experience: Professional experience in years
 *
 * Features:
 * - File upload for resume
 * - Input validation for required fields
 * - Responsive layout with grid/flex arrangement
 * - Professional details collection
 *
 * @component
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <ExperienceDetails />
 * </FormProvider>
 * ```
 *
 * @remarks
 * This component must be used within a FormProvider context as it relies on
 * form context for field validation and state management.
 * Note: The employer field currently uses email validation rules, which might need review.
 *
 * @returns {JSX.Element} A form section component with professional experience fields
 */
export default function ExperienceDetails() {
  return (
    <div>
      <div className="w-60">
        <FileUpload
          name="resume"
          label="Resume"
          placeholder="Resume"
          required
          accept=".pdf"
        />
      </div>
      <div className="grid md:flex gap-4 w-full">
        <div className="gap-4 w-1/2 space-y-2">
          <InputField
            name="designation"
            label="Current Designation"
            type="text"
            placeholder="Enter Designation"
            required
            rules={{ validate: (v: string) => validateDesignation(v) }}
          />
          <InputField
            name="location"
            label="Location"
            type="text"
            placeholder="Enter Location"
            required
            rules={{ validate: (v: string) => validateLocation(v) }}
          />
        </div>

        <div className="w-1/2 space-y-2">
          <InputField
            name="employer"
            label="Company/Employer"
            type="text"
            required
            rules={{ validate: (v: string) => validateCompany(v) }}
          />
          <InputField
            name="experience"
            label="Total Experience (In years)"
            type="text"
            required
            rules={{ validate: (v: string) => validateExperience(v) }}
          />
        </div>
      </div>
    </div>
  );
}
