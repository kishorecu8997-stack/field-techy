import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import LocationPage from "./components/LocationPage";
import ProjectScheduling from "./components/ProjectScheduling";
import EngineerGroups from "./components/EngineerGroups";
import ProjectBudget from "./components/ProjectBudget";
import ProjectJobSetting from "./components/ProjectJobSetting";
import ProjectServiceConfig from "./components/ProjectServiceConfig";

export default function CreateProjectForm() {
  return (
    <div className="p-4">
      <div className="grid md:flex gap-8">
        <div className="grid lg:w-9/12">
          <div className="space-y-4">
            <InputField
              //   disabled={true}
              name={"projectName"}
              required
              label={"Project Name"}
              placeholder={"Enter Project Name"}
            />
            <InputField
              name={"projectType"}
              required
              label={"Project Type"}
              placeholder={"Enter Project Type"}
            />

            <LocationPage isDisable={false} />

            <ProjectScheduling />

            <EngineerGroups />

            <ProjectBudget />

            <ProjectJobSetting />

            <ProjectServiceConfig />
          </div>
        </div>

        <div className="grid lg:w-3/12 h-fit mt-4">
          <div className="bg-gray-200 space-y-2 dark:bg-gray-800 dark:text-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold">Project Member</h3>
            <p>No project member has been added yet.</p>
            <Button className="w-fit mt-2 rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition">
              Add Project Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
