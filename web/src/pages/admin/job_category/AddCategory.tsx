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
 * AddCategory component provides a simple form to create a new job category in the admin panel.
 *
 * Responsibilities:
 * - Render a small form for category name and image upload.
 * - Validate the category name using shared validation rules.
 * - Submit the form and show user feedback (toast) on success.
 * - Provide navigation back to the categories list.
 *
 * @component
 * @returns {JSX.Element} Form UI for adding a job category
 */
export default function AddCategory() {
  const methods = useForm<CategoryFormData>({
    defaultValues: {
      categoryName: "",
      categoryImage: null,
    },
  });
  const navigate = useNavigate();

  const handleSubmit = () => {
    toast.success("Category added successfully!");
  };
  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold ">Add Category</h1>
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
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="w-fit bg-linear-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Save
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
