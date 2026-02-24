import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { CategoryFormData } from "./types";
import JobCategoryForm from "./JobCategoryForm";
import { usePopupStore } from "@/shared/store/popupStore";
import { useAdminUpdateServiceCategory } from "@/shared/apiServices/admin/adminOpenApiService";
import { useQueryClient } from "@tanstack/react-query";

/**
 * `EditCategory` component renders a page with a form to edit an existing Service category.
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
  const queryClient = useQueryClient();
  const location = useLocation();

  const categoryId = id ? Number(id) : undefined;
  const category =
    (location.state as { category?: { id: number; name: string } } | null)
      ?.category ?? null;

  const methods = useForm<CategoryFormData>({
    defaultValues: {
      categoryName: category?.name || "",
      categoryImage: null,
    },
  });

  useEffect(() => {
    if (!category) return;
    methods.reset({
      categoryName: category.name || "",
      categoryImage: null,
    });
  }, [category]);

  const { showPopup } = usePopupStore();
  const { mutateAsync: updateServiceCategory, isPending: isUpdatingCategory } =
    useAdminUpdateServiceCategory({
      onSuccess: () => {
        toast.success("Service category updated successfully!");
        methods.reset();
        navigate(absoluteUrls.admin.home.manage_categories);
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Update category failed";
        toast.error(errorMessage);
      },
    });

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
            if (!categoryId) return;
            if (isUpdatingCategory) return;
            await updateServiceCategory({
              path: { id: categoryId },
              body: { name: data.categoryName },
            });
            queryClient.setQueriesData(
              {
                predicate: (query) =>
                  Array.isArray(query.queryKey) &&
                  query.queryKey[0] &&
                  typeof query.queryKey[0] === "object" &&
                  (query.queryKey[0] as { _id?: string })._id ===
                    "adminGetServiceCategories",
              },
              (oldData) => {
                if (!oldData || typeof oldData !== "object") return oldData;
                const prev = oldData as {
                  data?: Array<{ id: number; name: string }>;
                  total?: number;
                  page?: number;
                  limit?: number;
                };
                if (!Array.isArray(prev.data)) return oldData;
                return {
                  ...prev,
                  data: prev.data.map((item) =>
                    item.id === categoryId
                      ? { ...item, name: data.categoryName }
                      : item,
                  ),
                };
              },
            );
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
              Update
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
