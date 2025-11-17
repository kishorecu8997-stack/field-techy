import { InputField } from "@/shared/components/commonUI/inputs";
import { validatePricingModel } from "@/utils/validate";
import React from "react";
import { Controller, useWatch, type Control } from "react-hook-form";
import type { PricingField, PricingTier } from "../types";

/**
 * Table for displaying/editing tiered pricing
 */
const PricingTable: React.FC<{
  control: Control<any>;
  index: number;
  tiers: PricingTier[];
  editable: boolean;
}> = ({ control, index, tiers, editable }) => {
  const headers = [
    "Experience Level",
    "Hourly",
    "Half-Day (4h)",
    "Full-Day (8h)",
    "Weekly (5d)",
    "Monthly",
  ];
  const fields = ["hourly", "halfDay", "fullDay", "weekly", "monthly"];

  const rowValues = useWatch({
    control,
    name: `skills.${index}.tiers`,
  });

  return (
    <div className="overflow-x-auto mt-2 rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, tierIdx) => {
            const relatedValues = rowValues?.[tierIdx] || {};
            return (
              <tr
                key={tier.level}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-1 font-medium dark:text-gray-200">
                  {tier.level} – {tier.description}
                </td>
                {fields.map((field) => (
                  <td key={field} className="px-4 py-2">
                    {editable ? (
                      <InputField
                        name={`skills.${index}.tiers.${tierIdx}.${field}`}
                        placeholder="$"
                        rules={{
                          validate: (v: string) =>
                            validatePricingModel(v, field as PricingField, {
                              hourly: Number(relatedValues.hourly),
                              halfDay: Number(relatedValues.halfDay),
                              fullDay: Number(relatedValues.fullDay),
                              weekly: Number(relatedValues.weekly),
                              monthly: Number(relatedValues.monthly),
                            }),
                        }}
                        inputClassName="h-8 border border-neutral-700 dark:border-neutral-400 rounded-md p-1"
                      />
                    ) : (
                      <Controller
                        control={control}
                        name={`skills.${index}.tiers.${tierIdx}.${field}`}
                        render={({ field: controllerField }) => (
                          <span className="text-gray-800 dark:text-gray-200">
                            ${controllerField.value || "—"}
                          </span>
                        )}
                      />
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
