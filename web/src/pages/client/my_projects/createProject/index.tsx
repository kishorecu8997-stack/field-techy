import { SORT_OPTIONS } from "@/pages/engineer/search_result/types";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import CreateProjectForm from "./CreateProjectForm";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";

export default function CreateProject() {
  const methods = useForm<any>({
    defaultValues: {},
    mode: "onChange",
  });

  const handleSubmit = async (data: any) => {
    console.log("submittesd", data);
  };

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="lg:col-span-2">
            <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
              <MyJobsHeader
                title="Create Project"
                currentSort={SORT_OPTIONS.NEWEST}
                onSortChange={() => {}}
                isShowSort={false}
              />
            </div>
          </div>
        </div>

        <FormContainer methods={methods} onSubmit={handleSubmit}>
          <CreateProjectForm />
          <div className="flex justify-end w-9/12 items-center gap-4 pr-8">
            <Button variant="outline" className="rounded-full">
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-fit rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
            >
              Review Project
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
