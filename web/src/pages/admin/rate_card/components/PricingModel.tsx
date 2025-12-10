import { defaultPricingTiers } from "@/dummy_data/admin/rateCard";
import { Button } from "@/shared/components/commonUI/Buttons";
import React from "react";
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

  const { control } = useFormContext<PricingFormValues>();

  const {
    fields: skills,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const createDefaultSkill = (name: string, id: string): SkillPricing => ({
    id,
    name,
    isEditing: true,
    tiers: JSON.parse(JSON.stringify(defaultPricingTiers)),
  });

  const addSkill = () => {
    append(
      createDefaultSkill(
        `Skill ${skills.length + 1}`,
        Math.random().toString(36).substring(2, 15)
      )
    );
  };

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-900 dark:text-neutral-200">
          Pricing Models
        </h2>
        {!isView && (
          <Button
            variant="link"
            type="button"
            leftIcon={<IoMdAdd />}
            className="text-emerald-800 dark:text-neutral-200"
            onClick={addSkill}
          >
            Add Skill
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
