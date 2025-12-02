import { validateBudget, validatePurchaseOrderNumber } from "@/utils/validate";
import SectionHeader from "./SectionHeader";
import { InputField } from "@/shared/components/commonUI/inputs";

export default function ProjectBudget({
  isDisable,
  billingcurreny,
}: {
  isDisable: boolean;
  billingcurreny: string;
}) {
  return (
    <div>
      <SectionHeader title="Budget" />
      <InputField
        disabled={isDisable}
        name="budget"
        label={`Approved Budget (in ${billingcurreny})`}
        placeholder="Enter Budget"
        required
        rules={{ validate: (v: string) => validateBudget(v) }}
      />
      <InputField
        disabled={isDisable}
        name="purchaseOrder"
        label="PO"
        placeholder="Enter PO"
        required
        rules={{ validate: (v: string) => validatePurchaseOrderNumber(v) }}
      />
    </div>
  );
}
