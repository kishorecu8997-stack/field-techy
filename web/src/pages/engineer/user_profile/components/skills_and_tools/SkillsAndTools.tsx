import React from "react";
import ChipsCard from "@/shared/components/ChipsCard";
import { jobSkillsData, toolsData } from "@/dummy_data";

/**
 * Props for components rendered within a drawer that require navigation and close actions.
 */
interface DrawerMenuProps {
  /** Callback to navigate to a different view within the drawer (e.g., 'addSkills'). */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the parent drawer or sidebar. */
  onClose: () => void;
}

/**
 * The SkillsAndTools component renders a summary of the user's skills and tools.
 * It uses data from a dummy source and provides navigation callbacks for editing.
 * @param {DrawerMenuProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered SkillsAndTools component.
 */
const SkillsAndTools: React.FC<DrawerMenuProps> = ({ onMenuItemClick }) => {


  
  return (
    <>
      <div className="flex flex-col gap-4">
        <ChipsCard
          title="Skills"
          chips={jobSkillsData.map((skill) => skill.label)}
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
          chips={toolsData.map((tool) => tool.label)}
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
