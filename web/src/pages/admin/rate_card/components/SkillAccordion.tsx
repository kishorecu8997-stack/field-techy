import { Button } from "@/shared/components/commonUI/Buttons";
import React from "react";
import { useFieldArray, type Control } from "react-hook-form";
import { useLocation } from "react-router-dom";
import type { SkillPricing } from "../types";
import { Accordion } from "./Accordion";
import PricingTable from "./PricingTable";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";

/**
 * Accordion wrapper for each skill's pricing section
 * Shows edit buttons only on edit routes
 */
const SkillAccordion: React.FC<{
  skill: SkillPricing;
  control: Control<any>;
  index: number;
  removeSkill: () => void;
}> = ({ skill, control, index, removeSkill }) => {
  const location = useLocation();
  const isView = location.pathname.includes("/view");
  const { fields } = useFieldArray({
    control,
    name: `skills.${index}.tiers`,
  });

  const { showPopup } = usePopupStore();

  //Delete confirmation
  const handleDeleteSkill = async (skill: SkillPricing) => {
    await showPopup({
      title: "Delete Skill",
      body: "Are you sure you want to delete this skill?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close) => {
            console.log("Deleting:", skill.id);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            close(true);
          },
        },
      ],
    });
  };

  const handleRemove = (skill: SkillPricing) => {
    handleDeleteSkill(skill);
    removeSkill();
  };

  //Save confirmation
  const handleSaveConfirmation = async (data: any) => {
    await showPopup({
      title: "Add Skill",
      body: "Are you sure you want to save this details?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          action: async (close) => {
            console.log("Deleting:", data);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Skill added successfully!");
            close(true);
          },
        },
      ],
    });
  };

  return (
    <Accordion title={skill.name} remove={() => handleRemove(skill)}>
      <PricingTable
        control={control}
        index={index}
        tiers={fields as unknown as SkillPricing["tiers"]}
        editable={!isView}
      />

      {!isView && (
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="secondary"
            onClick={() => handleSaveConfirmation(skill)}
          >
            Save
          </Button>
        </div>
      )}
    </Accordion>
  );
};

export default SkillAccordion;
