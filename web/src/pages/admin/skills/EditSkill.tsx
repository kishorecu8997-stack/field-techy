import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { SkillFormData } from "./types";
import SkillForm from "./SkillForm";
import { usePopupStore } from "@/shared/store/popupStore";
import { useAdminUpdateSkill } from "@/shared/apiServices/admin/adminOpenApiService";
import { useQueryClient } from "@tanstack/react-query";

/**
 * `EditSkill` component renders a page with a form to edit an existing Skill.
 * It uses `react-hook-form` for form state management and reuses the `SkillForm`.
 *
 * @returns {JSX.Element} The rendered component for editing a skill.
 */
export default function EditSkill() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const skillId = id ? Number(id) : undefined;
  const skill =
    (location.state as { skill?: { id: number; name: string } } | null)
      ?.skill ?? null;

  const methods = useForm<SkillFormData>({
    defaultValues: {
      skillName: skill?.name || "",
      skillImage: null,
    },
  });

  useEffect(() => {
    if (!skill) return;
    methods.reset({
      skillName: skill.name || "",
      skillImage: null,
    });
  }, [skill]);

  const { showPopup } = usePopupStore();
  const { mutateAsync: updateSkill, isPending: isUpdatingSkill } =
    useAdminUpdateSkill({
      onSuccess: async () => {
        toast.success("Skill updated successfully!");
        methods.reset();
        // Invalidate and refetch the skills list
        await queryClient.invalidateQueries({
          queryKey: ["lookup", "skills", "root"],
        });
        await queryClient.invalidateQueries({ queryKey: ["adminGetSkills"] });
        navigate(absoluteUrls.admin.home.manage_skills);
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Update skill failed";
        toast.error(errorMessage);
      },
    });

  const handleSaveConfirmation = async (data: SkillFormData) => {
    await showPopup({
      title: "Update Skill",
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
            if (!skillId) return;
            if (isUpdatingSkill) return;
            await updateSkill({
              body: { id: skillId, name: data.skillName },
            });
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
        <h1 className="font-semibold ">Edit Skill</h1>
        <Button
          variant="solid"
          className=""
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
              Update
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
