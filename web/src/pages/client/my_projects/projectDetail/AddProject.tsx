import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import ProjectSidebar from "./ProjectSidebar";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { ProjectSiteForm } from "../types";
import { toast } from "react-toastify";
import useDrawerStore from "@/shared/store/useDrawerStore";

const AddProject = () => {
  const methods = useForm<ProjectSiteForm>({
    defaultValues: {
      siteId: "",
      siteName: "",
      coordinates: [20.5937, 78.9629],
    },
  });

  const { setISOpenSidebar } = useDrawerStore();

  const onSubmit = (data: ProjectSiteForm) => {
    console.log("Submitted:", data);
    localStorage.setItem(
      "projectSiteCoordinates",
      JSON.stringify(data.coordinates)
    );
    toast.success("Project site added successfully");
    setISOpenSidebar(false);
  };

  return (
    <div>
      <FormContainer
        methods={methods}
        onSubmit={onSubmit}
        className="flex flex-col h-full"
      >
        <ProjectSidebar />
        <div className="mt-6 flex justify-end mr-4">
          <Button
            type="submit"
            className="w-fit rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
          >
            Add Project Site
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default AddProject;
