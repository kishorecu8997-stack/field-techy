import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import ProjectSidebar from "./ProjectSidebar";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { ProjectSiteForm } from "../types";
import { useState } from "react";
import { initialSites } from "@/dummy_data/client/myProject";
import { toast } from "react-toastify";
import useDrawerStore from "@/shared/store/useDrawerStore";

const EditProjects = () => {
  const [sites] = useState(initialSites);
  const editProjectSiteId = localStorage.getItem("editSiteId");
  const siteDetail = sites.find((s) => s.id === Number(editProjectSiteId));

  const { setISOpenSidebar } = useDrawerStore();

  const methods = useForm<ProjectSiteForm>({
    defaultValues: {
      siteId: siteDetail?.siteId || "",
      siteName: siteDetail?.siteName || "",
      coordinates: siteDetail?.coordinates || [20.5937, 78.9629],
    },
  });

  const onSubmit = (data: ProjectSiteForm) => {
    console.log("Submitted:", data);
    toast.success("Project site updated successfully");
    setISOpenSidebar(false);
  };

  return (
    <div>
      <FormContainer methods={methods} onSubmit={onSubmit}>
        <ProjectSidebar />
        <div className="mt-6 flex justify-end mr-4">
          <Button
            type="submit"
            className="w-fit rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
          >
            Update Project Site
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default EditProjects;
