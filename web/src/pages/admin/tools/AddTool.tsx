import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { ToolFormData } from "./types";
import ToolForm from "./ToolForm";
import { usePopupStore } from "@/shared/store/popupStore";
import { useAdminCreateTool } from "@/shared/apiServices/admin/adminOpenApiService";
import { useQueryClient } from "@tanstack/react-query";

/**
 * `AddTool` component renders a page with a form to add a new Tool.
 * It uses `react-hook-form` for form state management and provides UI for creating
 * a new tool, including a name and an image.
 *
 * @returns {JSX.Element} The rendered component for adding a tool.
 */
export default function AddTool() {
  const methods = useForm<ToolFormData>({
    defaultValues: {
      toolName: "",
      toolImage: null,
    },
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { showPopup } = usePopupStore();
  const { mutateAsync: createTool, isPending: isCreatingTool } =
    useAdminCreateTool({
      onSuccess: (data) => {
        queryClient.setQueriesData(
          {
            predicate: (query) =>
              Array.isArray(query.queryKey) &&
              query.queryKey[0] !== null &&
              typeof query.queryKey[0] === "object" &&
              (query.queryKey[0] as { _id?: string })._id ===
                "adminGetTools",
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
              name: methods.getValues("toolName"),
            };
            return {
              ...prev,
              data: [newItem, ...prev.data],
              total:
                typeof prev.total === "number" ? prev.total + 1 : prev.total,
            };
          },
        );
        toast.success("Tool added successfully!");
        methods.reset();
        navigate(absoluteUrls.admin.home.manage_tools);
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "A tool with this name already exists";
        toast.error(errorMessage);
      },
    });

  const handleSubmit = async (data: ToolFormData) => {
    await showPopup({
      title: "Add Tool",
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
            if (isCreatingTool) return;
            await createTool({
              body: {
                name: data.toolName,
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
        <h1 className="font-semibold ">Add Tool</h1>
        <Button
          variant="solid"
          onClick={() => navigate(absoluteUrls.admin.home.manage_tools)}
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
          <ToolForm />
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
