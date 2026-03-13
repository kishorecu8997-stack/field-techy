import React from "react";
import { useFieldArray, type Control } from "react-hook-form";
import { useLocation } from "react-router-dom";
import type { SkillPricing } from "../types";
import { Accordion } from "./Accordion";
import PricingTable from "./PricingTable";

/**
 * Accordion wrapper for each skill's pricing section
 * Shows edit buttons only on edit routes
 */
const SkillAccordion: React.FC<{
  skill: SkillPricing;
  control: Control<any>;
  index: number;
  removeSkill?: () => void;
}> = ({ skill, control, index }) => {
  const location = useLocation();
  const isView = location.pathname.includes("/view");
  const { fields } = useFieldArray({
    control,
    name: `skills.${index}.tiers`,
  });

  return (
    <Accordion
      title={skill.name}
      showRemove={false}
    >
      <PricingTable
        control={control}
        index={index}
        tiers={fields as unknown as SkillPricing["tiers"]}
        editable={!isView}
      />
    </Accordion>
  );
};

export default SkillAccordion;
