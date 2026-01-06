import { jobSkillsData, toolsData } from "@/dummy_data";
import {
  useEngineerGetById
} from "@/shared/apiServices/engineer/engineerService";
import ChipsCard from "@/shared/components/ChipsCard";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import React from "react";

interface DrawerMenuProps {
  onMenuItemClick: (key: string) => void;
  onClose: () => void;
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

  const engineerSkills = engineerData?.jobSkills as string[] || []
  const engineerTools = engineerData?.tools as string[] || []

  return (
    <>
      <div className="flex flex-col gap-4">
        <ChipsCard
          title="Skills"
           chips={engineerSkills.map((skill) => skill)}
          onAddAction={() => onMenuItemClick(`addSkills`)}
          onEditAction={() => {
            onMenuItemClick(`editSkills`);
            localStorage.setItem(
              "editSkillsId",
              JSON.stringify(jobSkillsData.map((skill) => skill.id))
            );
          }}
        />
        <ChipsCard
          title="Tools"
          chips={engineerTools.map((tool) => tool)}
          onAddAction={() => onMenuItemClick(`addTools`)}
          onEditAction={() => {
            onMenuItemClick(`editTools`);
            localStorage.setItem(
              "editToolsId",
              JSON.stringify(toolsData.map((tool) => tool.id))
            );
          }}
        />
      </div>
    </>
  );
};

export default SkillsAndTools;
