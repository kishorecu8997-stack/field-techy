import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { CategoryFormData } from "./types";
import JobCategoryForm from "./JobCategoryForm";
import { usePopupStore } from "@/shared/store/popupStore";
import { useAdminCreateServiceCategory } from "@/shared/apiServices/admin/adminOpenApiService";
import { useQueryClient } from "@tanstack/react-query";

/**
 * `AddCategory` component renders a page with a form to add a new Service category.
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
  const queryClient = useQueryClient();

  const { showPopup } = usePopupStore();
  const { mutateAsync: createServiceCategory, isPending: isCreatingCategory } =
    useAdminCreateServiceCategory({
      onSuccess: (data) => {
        queryClient.setQueriesData(
          {
            predicate: (query) =>
              Array.isArray(query.queryKey) &&
              query.queryKey[0] !== null &&
              typeof query.queryKey[0] === "object" &&
              (query.queryKey[0] as { _id?: string })._id === "adminGetServiceCategories",
          },
          (oldData: unknown) => {
            if (!oldData || typeof oldData !== "object") return oldData;
            const prev = oldData as {
              data?: Array<{ id: number; name: string }>;
              total?: number;
              page?: number;
              limit?: number;
            };
            if (!Array.isArray(prev.data)) return oldData;
            const newItem = {
              id: data?.id ?? Date.now(),
              name: methods.getValues("categoryName"),
            };
            return {
              ...prev,
              data: [newItem, ...prev.data],
              total:
                typeof prev.total === "number" ? prev.total + 1 : prev.total,
            };
          },
        );
        toast.success("Service category added successfully!");
        methods.reset();
        navigate(absoluteUrls.admin.home.manage_categories);
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "A category with this name already exists";
        toast.error(errorMessage);
      },
    });

  const handleSubmit = async (data: CategoryFormData) => {
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
          action: async (close) => {
            if (isCreatingCategory) return;
            await createServiceCategory({
              body: {
                name: data.categoryName,
              },
            });
            close(true);
          },
        },
      ],
    });
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
