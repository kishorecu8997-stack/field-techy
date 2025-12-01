import React from "react";
import SectionHeader from "./SectionHeader";
import { InputField } from "@/shared/components/commonUI/inputs";

export default function ProjectBudget({ isDisable }: { isDisable: boolean }) {
  return (
    <div>
      <SectionHeader title="Budget" />
      <InputField
        disabled={isDisable}
        name="budget"
        label="Approved Budget (in INR)"
        placeholder="Enter Budget"
        required
      />
      <InputField
        disabled={isDisable}
        name="purchaseOrder"
        label="PO"
        placeholder="Enter PO"
        required
      />
    </div>
  );
}
