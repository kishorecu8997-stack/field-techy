import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { SkillFormData } from "./types";
import SkillForm from "./SkillForm";
import { usePopupStore } from "@/shared/store/popupStore";
import { useAdminCreateSkill } from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * `AddSkill` component renders a page with a form to add a new Skill.
 * It uses `react-hook-form` for form state management and provides UI for creating
 * a new skill, including a name and an image.
 *
 * @returns {JSX.Element} The rendered component for adding a skill.
 */
export default function AddSkill() {
  const methods = useForm<SkillFormData>({
    defaultValues: {
      skillName: "",
      skillImage: null,
    },
  });
  const navigate = useNavigate();

  const { showPopup } = usePopupStore();
  const { mutateAsync: createSkill, isPending: isCreatingSkill } =
    useAdminCreateSkill({
      onSuccess: () => {
        toast.success("Skill added successfully!");
        methods.reset();
        navigate(absoluteUrls.admin.home.manage_skills);
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "A skill with this name already exists";
        toast.error(errorMessage);
      },
    });

  const handleSubmit = async (data: SkillFormData) => {
    await showPopup({
      title: "Add Skill",
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
            if (isCreatingSkill) return;
            await createSkill({
              body: {
                name: data.skillName,
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
        <h1 className="font-semibold ">Add Skill</h1>
        <Button
          variant="solid"
          onClick={() => navigate(absoluteUrls.admin.home.manage_skills)}
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
          <SkillForm />
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
