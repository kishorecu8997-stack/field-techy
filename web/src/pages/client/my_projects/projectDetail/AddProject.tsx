import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import ProjectSidebar from "./ProjectSidebar";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { ProjectSiteForm } from "../types";

const AddProject = () => {
  const methods = useForm<ProjectSiteForm>({
    defaultValues: {
      siteId: "",
      siteName: "",
      coordinates: [20.5937, 78.9629],
    },
  });

  const onSubmit = (data: ProjectSiteForm) => {
    console.log("Submitted:", data);
    localStorage.setItem(
      "projectSiteCoordinates",
      JSON.stringify(data.coordinates)
    );
  };

  return (
    <div>
      <FormContainer methods={methods} onSubmit={onSubmit}>
        <ProjectSidebar />
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            className="w-fit mt-2 rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
          >
            Add Project Site
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default AddProject;
