import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { CategoryFormData } from "./types";
import JobCategoryForm from "./JobCategoryForm";
import { serviceCategoriesData } from "@/dummy_data/admin";
import type { ServerCategoryProps } from ".";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * `EditCategory` component renders a page with a form to edit an existing job category.
 * It uses `react-hook-form` for form state management and reuses the `JobCategoryForm`.
 *
 * **Note:** This component currently initializes with empty default values. In a real-world
 * application, it should fetch the specific category's data (e.g., using a category ID from
 * the URL) and use it to populate the form's default values.
 *
 * @returns {JSX.Element} The rendered component for editing a category.
 */
export default function EditCategory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the category by ID (replace with real API call if needed)
  const category = serviceCategoriesData.find(
    (cat: ServerCategoryProps) => cat.id === id
  );

  const methods = useForm<CategoryFormData>({
    defaultValues: {
      categoryName: category?.categoryName || "",
      categoryImage: null,
    },
  });

  const { showPopup } = usePopupStore();

  const handleSaveConfirmation = async (data: CategoryFormData) => {
    await showPopup({
      title: "Update Category",
      body: "Are you sure you want to update this details?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          action: async (close) => {
            console.log("data :", data);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Job category updated successfully!");
            methods.reset();
            navigate(absoluteUrls.admin.home.manage_categories);
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = () => {
    handleSaveConfirmation(methods.getValues());
  };
  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold ">Edit Category</h1>
        <Button
          variant="solid"
          className=""
          onClick={() => navigate(absoluteUrls.admin.home.manage_categories)}
        >
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2 mt-4">
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mt-2 px-2 pb-4 w-full"
        >
          <JobCategoryForm />
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
