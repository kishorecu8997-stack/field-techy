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
  const headers = ["Hourly", "Daily", "Monthly"];
  const fields = ["hourly", "daily", "monthly"];

  const rowValues = useWatch({
    control,
    name: `skills.${index}.tiers`,
  });

  return (
    <div className="overflow-x-auto mt-2 rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          <tr>
            <th className="px-4 py-2 font-semibold text-left">
              Experience Level
            </th>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 font-semibold text-left">
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
                <td className="px-4 py-2 font-medium text-left align-middle text-gray-900 dark:text-gray-100">
                  {tier.level} - {tier.description}
                </td>
                {fields.map((field) => (
                  <td key={field} className="px-6 py-2 align-middle text-left">
                    {editable ? (
                      <InputField
                        name={`skills.${index}.tiers.${tierIdx}.${field}`}
                        rules={{
                          validate: (v: string) =>
                            validatePricingModel(v, field as PricingField, {
                              hourly: Number(relatedValues.hourly),
                              daily: Number(relatedValues.daily),
                              monthly: Number(relatedValues.monthly),
                            }),
                        }}
                        inputClassName="h-8 border border-neutral-700 dark:border-neutral-400 rounded-md p-1 text-center"
                      />
                    ) : (
                      <Controller
                        control={control}
                        name={`skills.${index}.tiers.${tierIdx}.${field}`}
                        render={({ field: controllerField }) => (
                          <span className="text-gray-800 dark:text-gray-200">
                            {controllerField.value || "—"}
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
