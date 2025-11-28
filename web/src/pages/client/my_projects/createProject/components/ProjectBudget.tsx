import React from "react";
import SectionHeader from "./SectionHeader";
import { InputField } from "@/shared/components/commonUI/inputs";

export default function ProjectBudget() {
  return (
    <div>
      <SectionHeader title="Budget" />
      <InputField
        name="budget"
        label="Approved Budget (in INR)"
        placeholder="Enter Budget"
        required
      />
      <InputField
        name="purchaseOrder"
        label="PO"
        placeholder="Enter PO"
        required
      />
    </div>
  );
}
