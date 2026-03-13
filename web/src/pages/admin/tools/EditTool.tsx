import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { ToolFormData } from "./types";
import ToolForm from "./ToolForm";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * `EditTool` component renders a page with a form to edit an existing Tool.
 * It uses `react-hook-form` for form state management and reuses the `ToolForm`.
 *
 * @returns {JSX.Element} The rendered component for editing a tool.
 */
export default function EditTool() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const toolId = id ? Number(id) : undefined;
  const tool =
    (location.state as { tool?: { id: number; name: string } } | null)?.tool ??
    null;

  const methods = useForm<ToolFormData>({
    defaultValues: {
      toolName: tool?.name || "",
      toolImage: null,
    },
  });

  useEffect(() => {
    if (!tool) return;
    methods.reset({
      toolName: tool.name || "",
      toolImage: null,
    });
  }, [tool]);

  const { showPopup } = usePopupStore();

  const handleSaveConfirmation = async (data: ToolFormData) => {
    await showPopup({
      title: "Update Tool",
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
            // API call would go here in the future
            toast.success("Tool updated successfully!");
            methods.reset();
            navigate(absoluteUrls.admin.home.manage_tools);
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
        <h1 className="font-semibold ">Edit Tool</h1>
        <Button
          variant="solid"
          className=""
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
              Update
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
