import React from "react";
import ChipsCard from "@/shared/components/ChipsCard";
import { getUserId } from "@/utils";
import { useEngineerGetById } from "@/shared/apiServices/engineer/engineerService";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

import { jobSkillsData, toolsData } from "@/dummy_data";

interface DrawerMenuProps {
  onMenuItemClick: (key: string) => void;
  onClose?: () => void;
}
/**
 * The SkillsAndTools component renders a summary of the user's skills and tools.
 * It uses data from a dummy source and provides navigation callbacks for editing.
 * @param {DrawerMenuProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered SkillsAndTools component.
 */
const SkillsAndTools: React.FC<DrawerMenuProps> = ({ onMenuItemClick }) => {
  const { session } = useUserSessionStore();
  const engineerId = session?.userId || "";
  const { data: engineerData } = useEngineerGetById(engineerId);

  const selectedSkillIds = (engineerData?.jobSkills as string[]) || [];
  const selectedToolIds = (engineerData?.tools as string[]) || [];

  const skillLabels = selectedSkillIds
    .map((id) => {
      const skill = jobSkillsData.find((s) => s.id === parseInt(id));
      return skill?.label;
    })
    .filter(Boolean) as string[];

  const toolLabels = selectedToolIds
    .map((id) => {
      const tool = toolsData.find((t) => t.id === id);
      return tool?.label;
    })
    .filter(Boolean) as string[];

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
