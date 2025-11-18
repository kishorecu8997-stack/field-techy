import { InputField } from "@/shared/components/commonUI/inputs";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { validateCategoryName } from "@/utils/validate";
/**
 * `JobCategoryForm` provides the form fields for creating or editing a job category.
 * It is designed to be used within a `FormContainer` that provides the `react-hook-form` context.
 * This component includes an image uploader for the category image and a text input for the category name.
 *
 * @returns {JSX.Element} The rendered form fields for a job category.
 */
export default function JobCategoryForm() {
  return (
    <div>
      <div className="mb-6 mt-2 w-26">
        <ImageUploaderField name="profileImage" required />
      </div>
      <div className="flex md:w-1/2">
        <InputField
          name="categoryName"
          label="Category Name"
          type="text"
          placeholder="Enter Name"
          required
          rules={{ validate: (v: string) => validateCategoryName(v) }}
        />
      </div>
    </div>
  );
}
