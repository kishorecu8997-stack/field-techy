import { Button } from "@/shared/components/commonUI/Buttons";
import React, { useMemo } from "react";
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
  update: (index: number, value: SkillPricing) => void;
}> = ({ skill, control, index }) => {
  const isView = useMemo(() => useLocation().pathname.includes("/view"), []);
  const { fields } = useFieldArray({
    control,
    name: `skills.${index}.tiers`,
  });

  return (
    <Accordion title={skill.name}>
      <PricingTable
        control={control}
        index={index}
        tiers={fields as unknown as SkillPricing["tiers"]}
        editable={!isView}
      />

      {!isView && (
        <div className="flex justify-end mt-4 space-x-2">
          <Button type="submit">Save</Button>
        </div>
      )}
    </Accordion>
  );
};

export default SkillAccordion;
