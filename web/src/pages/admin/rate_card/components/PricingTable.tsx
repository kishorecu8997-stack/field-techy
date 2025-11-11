import React from "react";
import { Controller, type Control } from "react-hook-form";
import type { PricingTier } from "../types";
import { InputField } from "@/shared/components/commonUI/inputs";

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

  return (
    <div className="overflow-x-auto mt-2 rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, tierIdx) => (
            <tr key={tier.level} className="border-t border-gray-200">
              <td className="px-4 py-1 font-medium">
                {tier.level} – {tier.description}
              </td>
              {fields.map((field) => (
                <td key={field} className="px-4 py-2">
                  {editable ? (
                    <InputField
                      name={`skills.${index}.tiers.${tierIdx}.${field}`}
                      type="number"
                      placeholder="$"
                      inputClassName="h-8 border border-neutral-700 rounded-md p-1"
                    />
                  ) : (
                    <Controller
                      control={control}
                      name={`skills.${index}.tiers.${tierIdx}.${field}`}
                      render={({ field: controllerField }) => (
                        <span className="text-gray-800">
                          ${controllerField.value || "—"}
                        </span>
                      )}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
