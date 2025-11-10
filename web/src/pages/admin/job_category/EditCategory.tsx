import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { validateCategoryName } from "@/utils/validate";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { CategoryFormData } from "./types";

/**
 * EditCategory component provides a form interface to update an existing job category.
 *
 * Responsibilities:
 * - Render a form for editing category name and image.
 * - Validate the category name using shared validation rules.
 * - Submit the form and show user feedback (toast) on success.
 * - Provide navigation back to the categories list.
 *
 * Usage:
 * ```tsx
 * <EditCategory />
 * ```
 *
 * Notes:
 * - Uses `react-hook-form` for form state management via `useForm`.
 * - `ImageUploaderField` is used for image selection and preview.
 * - This component is intended to be used within the admin layout and expects
 *   routing to provide the category context (id, pre-filled values) in a future enhancement.
 *
 * @component
 * @returns {JSX.Element} Form UI for editing a job category
 */
export default function EditCategory() {
  const methods = useForm<CategoryFormData>({
    defaultValues: {
      categoryName: "",
      categoryImage: null,
    },
  });
  const navigate = useNavigate();

  const handleSubmit = () => {
    toast.success("Category updated successfully!");
  };
  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold ">Edit Category</h1>
        <Button
          variant="solid"
          className=""
          onClick={() =>
            navigate(`${absoluteUrls.admin.home.manage_categories}`)
          }
        >
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2 mt-4">
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mt-6 px-2 pb-4 w-full"
        >
          <div className="mb-6 mt-2 w-fit">
            <ImageUploaderField label="Profile Image" name="profileImage" />
          </div>
          <div className="flex w-1/2">
            <InputField
              name="categoryName"
              label="Category Name"
              type="text"
              placeholder="Enter Name"
              required
              rules={{ validate: (v: string) => validateCategoryName(v) }}
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Save
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
