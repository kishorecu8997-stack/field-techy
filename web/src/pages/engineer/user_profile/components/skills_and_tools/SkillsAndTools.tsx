import { useEngineerGetSkillsAndTools } from "@/shared/apiServices/engineer/engineerOpenApiService";
import ChipsCard from "@/shared/components/ChipsCard";
import React from "react";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

interface DrawerMenuProps {
  onMenuItemClick: (key: string) => void;
  onClose?: () => void;
}

/**
 * The SkillsAndTools component renders a summary of the user's skills and tools.
 */
const SkillsAndTools: React.FC<DrawerMenuProps> = ({ onMenuItemClick }) => {
  const { data: skillsAndTools, isLoading } = useEngineerGetSkillsAndTools();

  if (isLoading) return <LoaderComponent />;

  const skillLabels = skillsAndTools?.skills.map((s) => s.name) || [];
  const toolLabels = skillsAndTools?.tools.map((t) => t.name) || [];

  return (
    <div className="flex flex-col gap-4">
      <ChipsCard
        title="Skills"
        chips={skillLabels}
        onAddAction={() => onMenuItemClick("addSkills")}
        onEditAction={() => onMenuItemClick("editSkills")}
      />

      <ChipsCard
        title="Tools"
        chips={toolLabels}
        onAddAction={() => onMenuItemClick("addTools")}
        onEditAction={() => onMenuItemClick("editTools")}
      />
    </div>
  );
};

export default SkillsAndTools;
