import serviceCategories from "@/dummy_data/serviceCategories";
import skills from "@/dummy_data/skills";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import {
  validateAddress,
  validateName,
  validatePortfolioLink,
  validatePricePerHour,
} from "@/utils/validate";

/**
 * BasicInformation component handles the first step of the engineer registration form.
 * It captures essential personal and professional information about the engineer.
 *
 * Form Fields:
 * - Profile Image: Upload functionality for engineer's profile picture
 * - Name: Engineer's full name with validation
 * - Mobile Number: Phone number with international format support
 * - Skills: Technical skills and expertise
 * - Service Category: Dropdown for selecting service specialization
 * - Email Address: Business email with validation
 * - Address: Physical/Business address
 * - Portfolio Link: URL to professional portfolio
 * - Price per/hour: Hourly rate for services
 *
 * @component
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <BasicInformation />
 * </FormProvider>
 * ```
 *
 * @remarks
 * This component must be used within a FormProvider context as it relies on
 * form context for field validation and state management.
 *
 * @returns {JSX.Element} A form section component with basic information fields
 */
export default function BasicInformation() {
  return (
    <div>
      <div className="mb-6 mt-2 w-fit">
        <ImageUploaderField label="Profile Image" name="profileImage" />
      </div>
      <div className="grid md:flex gap-4 w-full">
        <div className="gap-4 w-1/2 space-y-2">
          <InputField
            name="name"
            label="Full Name"
            type="text"
            placeholder="Enter Name"
            required
            rules={{ validate: (v: string) => validateName(v) }}
          />
          <PhoneInputField name="phoneNumber" label="Mobile Number" required />
          <TagSelectField
            name="skills"
            label="Skills"
            placeholder="Add your skills"
            required
            options={skills}
            maxTags={15}
          />
          <SelectField
            name="serviceCategory"
            label="Service Category"
            placeholder="Select Category"
            options={serviceCategories}
            required
          />
        </div>

        <div className="w-1/2 space-y-2">
          <InputField
            name="email"
            label="Email Address"
            type="text"
            required
            rules={validateEmailRules}
          />
          <InputField
            name="address"
            label="Address"
            type="text"
            required
            rules={{ validate: (v: string) => validateAddress(v) }}
          />
          <InputField
            name="portfolio"
            label="Portfolio Link"
            type="text"
            placeholder="Portfolio Link"
            required
            rules={{ validate: (v: string) => validatePortfolioLink(v) }}
          />
          <InputField
            name="price"
            label="Price per/hour"
            type="text"
            placeholder="Enter Price per/hour"
            required
            allowedCharacters="currency"
            rules={{ validate: (v: string) => validatePricePerHour(v) }}
          />
        </div>
      </div>
    </div>
  );
}
