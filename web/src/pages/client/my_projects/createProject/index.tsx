import { SORT_OPTIONS } from "@/pages/engineer/search_result/types";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import CreateProjectForm from "./CreateProjectForm";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useState } from "react";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import type { CreateProjectFormValues } from "../types";
import { scrollToTop } from "@/utils";

/**
 * CreateProject
 *
 * Page component that renders the multi-section Create Project flow for clients.
 * It composes `CreateProjectForm` inside a `FormContainer` and provides top-level
 * actions such as Review, Submit and Cancel.
 *
 * Behavior:
 * - Initializes form state via `useForm` with sensible defaults.
 * - `reviewProject` freezes the form for review by setting `isDisable`.
 * - `handleCreate` shows a confirmation popup and navigates back to the projects list on confirm.
 *
 * Notes:
 * - Uses shared UI stores (`usePopupStore`) and `toast` for user feedback.
 * - This component is the page-level wrapper; the actual form sections live
 *   inside `CreateProjectForm` and are wired with `react-hook-form`.
 *
 * @component
 * @returns {JSX.Element} The Create Project page with form and actions
 */
export default function CreateProject() {
  const methods = useForm<CreateProjectFormValues>({
    defaultValues: { engineerLevel: "Level 1 - Level 2", discount: 10 },
    mode: "onChange",
  });
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const navigate = useNavigate();

  const { showPopup } = usePopupStore();

  const reviewProject = (data: CreateProjectFormValues) => {
    console.log("reviewProject", data);
    setIsDisable(true);
    scrollToTop();
  };

  //Save project
  const handleCreate = async (data: CreateProjectFormValues) => {
    showPopup({
      title: "Create Project",
      body: "Are you sure you want to create this project?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            console.log("Submitted popover:", data);
            methods.reset();
            setIsDisable(false);
            navigate(absoluteUrls.client.home.my_projects);
            toast.success("Project created successfully");
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = async (data: CreateProjectFormValues) => {
    handleCreate(data);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4 bg-white dark:bg-gray-800">
        <FormContainer methods={methods} onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="lg:col-span-2">
              <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
                <MyJobsHeader
                  title="Create Project"
                  currentSort={SORT_OPTIONS.NEWEST}
                  onSortChange={() => {}}
                  isShowSort={false}
                  action={
                    isDisable && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() => setIsDisable(false)}
                        >
                          Back to Edit
                        </Button>
                        <Button
                          type="submit"
                          className="w-fit rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
                        >
                          Submit Project
                        </Button>
                      </div>
                    )
                  }
                />
              </div>
            </div>
          </div>

          <CreateProjectForm isDisable={isDisable} />
          {!isDisable && (
            <div className="flex justify-end w-9/12 items-center gap-4 pr-8">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  methods.reset();
                  navigate(absoluteUrls.client.home.my_projects);
                  scrollToTop();
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={methods.handleSubmit(reviewProject)}
                className="w-fit rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
              >
                Review Project
              </Button>
            </div>
          )}
        </FormContainer>
      </div>
    </div>
  );
}
