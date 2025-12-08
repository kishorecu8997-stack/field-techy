import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { CategoryFormData } from "./types";
import JobCategoryForm from "./JobCategoryForm";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * `AddCategory` component renders a page with a form to add a new job category.
 * It uses `react-hook-form` for form state management and provides UI for creating
 * a new category, including a name and an image.
 *
 * @returns {JSX.Element} The rendered component for adding a category.
 */
export default function AddCategory() {
  const methods = useForm<CategoryFormData>({
    defaultValues: {
      categoryName: "",
      categoryImage: null,
    },
  });
  const navigate = useNavigate();

  const { showPopup } = usePopupStore();

  const handleSaveConfirmation = async (data: CategoryFormData) => {
    console.log("data :", data);
    await showPopup({
      title: "Add Category",
      body: "Are you sure you want to save this details?",
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting job:", close);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Job category added successfully!");
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
        <h1 className="font-semibold ">Add Category</h1>
        <Button
          variant="solid"
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
