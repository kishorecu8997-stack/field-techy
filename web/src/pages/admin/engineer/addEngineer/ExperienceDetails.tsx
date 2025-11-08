import { useFormContext } from "react-hook-form";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import type { EngineerFormData } from "../types";
import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";

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
  const methods = useFormContext<EngineerFormData>();

  return (
    <div>
      <FormContainer
        methods={methods} // ✅
        className="flex flex-col gap-2 mt-6 px-2 pb-4 w-full"
      >
        <div className="w-60">
          <FileUpload
            name="resume"
            label="Resume"
            placeholder="Government ID"
            required
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
              // rules={{ validate: (v: string) => validateName(v) }}
            />
            <InputField
              name="location"
              label="Location"
              type="text"
              placeholder="Enter Location"
              required
            />
          </div>

          <div className="w-1/2 space-y-2">
            <InputField
              name="employer"
              label="Company/Employer"
              type="text"
              required
              rules={validateEmailRules} // ← you had this; keeping it
            />
            <InputField
              name="experience"
              label="Total Experience (In years)"
              type="text"
              required
            />
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
