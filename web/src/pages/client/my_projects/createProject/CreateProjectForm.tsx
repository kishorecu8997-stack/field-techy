import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import LocationPage from "./components/LocationPage";
import ProjectScheduling from "./components/ProjectScheduling";
import EngineerGroups from "./components/EngineerGroups";
import ProjectBudget from "./components/ProjectBudget";
import ProjectJobSetting from "./components/ProjectJobSetting";
import ProjectServiceConfig from "./components/ProjectServiceConfig";
import { useState } from "react";
import MemberPopup from "./components/MemberPopup";
import ClientInterviewerSection from "@/shared/components/ClientInterviewerSection";
import { usePopupStore } from "@/shared/store/popupStore";
import { projectMembers } from "@/dummy_data/client/myProject";
import { toast } from "react-toastify";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { validateProjectName } from "@/utils/validate";
import { useFormContext } from "react-hook-form";

export default function CreateProjectForm({
  isDisable,
}: {
  isDisable: boolean;
}) {
  const ctx = useFormContext();
  const [isMember, setIsMember] = useState<boolean>(false);
  const { showPopup } = usePopupStore();
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();
  const [members, setMembers] = useState(projectMembers);

  const billingcurreny = ctx.watch("curency");

  const handleDeleteConfirmation = async (id: number) => {
    await showPopup({
      title: "Delete",
      body: "Are you sure you want to delete this member?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: "danger",
          action: async (close) => {
            setMembers(members.filter((m) => m.id !== id));
            toast.success("Member deleted successfully");
            close(true);
          },
        },
      ],
    });
  };

  const handleEdit = (id: number) => () => {
    localStorage.setItem("editMemberId", id.toString());
    setActiveKey("editProjectMember");
    setISOpenSidebar(true);
  };

  const handleDelete = (id: number) => async () => {
    handleDeleteConfirmation(id);
  };

  const sections = members.map((member) => ({
    title: "Project Member",
    items: [
      { label: "First Name", value: member.firstName },
      { label: "Last Name", value: member.lastName },
      { label: "Email ID", value: member.email },
      { label: "Mobile Number", value: member.mobile },
      { label: "Role", value: member.role },
    ],
    onEdit: handleEdit(member.id),
    onDelete: handleDelete(member.id),
  }));

  return (
    <div className="p-4">
      <div className="grid md:flex gap-8">
        <div className="grid lg:w-9/12">
          <div className="space-y-4">
            <InputField
              disabled={isDisable}
              name={"projectName"}
              required
              label={"Project Name"}
              placeholder={"Enter Project Name"}
              rules={{ validate: (v: string) => validateProjectName(v) }}
            />
            <InputField
              disabled={isDisable}
              name={"projectType"}
              required
              label={"Project Type"}
              placeholder={"Enter Project Type"}
              rules={{ validate: (v: string) => validateProjectName(v) }}
            />

            <LocationPage isDisable={isDisable} />

            <ProjectScheduling isDisable={isDisable} />

            <EngineerGroups isDisable={isDisable} />

            <ProjectBudget isDisable={isDisable} billingcurreny={billingcurreny} />

            <ProjectJobSetting isDisable={isDisable} />

            <ProjectServiceConfig />
          </div>
        </div>

        <div className="grid lg:w-3/12 h-fit mt-4">
          {/* <div className="bg-gray-200 space-y-2 dark:bg-gray-800 dark:text-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold">Project Member</h3>
            <p>No project member has been added yet.</p>
            <Button
              className="w-fit mt-2 rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
              onClick={() => setIsMember(!isMember)}
            >
              Add Project Member
            </Button>
          </div> */}

          <ClientInterviewerSection
            title="Project Member"
            sections={sections}
            addAction={
              <Button
                className="w-fit mt-2 rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
                onClick={() => setIsMember(!isMember)}
              >
                Add Project Member
              </Button>
            }
            disabled={false}
          />
        </div>
        {isMember && (
          <MemberPopup isMember={isMember} setIsMember={setIsMember} />
        )}
      </div>
    </div>
  );
}
