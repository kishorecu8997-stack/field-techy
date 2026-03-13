import { defaultPricingTiers } from "@/dummy_data/admin/rateCard";
import { Button } from "@/shared/components/commonUI/Buttons";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import type { PricingFormValues, SkillPricing } from "../types";
import SkillAccordion from "./SkillAccordion";
import { IoMdAdd } from "react-icons/io";

/**
 * Root Pricing Model Component with route-based edit/view logic
 */
const PricingModel: React.FC = () => {
  const { pathname } = useLocation();
  const isView = pathname.includes("/view");
  const isEdit = pathname.includes("/edit");

  const { control, watch } = useFormContext<PricingFormValues>();
  const [isExperienceLevelAdded, setIsExperienceLevelAdded] = useState(false);

  const {
    fields: skills,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "skills",
  });

  // Watch for changes in skills field
  const watchedSkills = watch("skills");

  // Effect to populate skills when in edit/view mode and data is available
  useEffect(() => {
    if ((isEdit || isView) && watchedSkills && watchedSkills.length === 0) {
      // In edit/view mode with no skills, don't auto-populate
      // Let the parent component handle population via reset
    }
  }, [isEdit, isView, watchedSkills]);

  const createDefaultSkill = (name: string, id: string): SkillPricing => ({
    id,
    name,
    isEditing: true,
    tiers: JSON.parse(JSON.stringify(defaultPricingTiers)),
  });

  const addExperinceLevel = () => {
    // Add a single skill with all 3 experience levels (L1, L2, L3)
    append(
      createDefaultSkill(
        "Experience Level",
        Math.random().toString(36).substring(2, 15),
      ),
    );
    setIsExperienceLevelAdded(true);
  };

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between items-center mb-4">
        {!isView && !isEdit && (
          <Button
            variant="link"
            type="button"
            leftIcon={<IoMdAdd />}
            className="text-emerald-800 dark:text-neutral-200"
            onClick={addExperinceLevel}
            disabled={isExperienceLevelAdded}
          >
            Add Experinece Level Rate Card
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <SkillAccordion
            key={skill.id}
            skill={skill}
            removeSkill={() => remove(index)}
            control={control}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingModel;
