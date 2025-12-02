import { validateBudget, validatePurchaseOrderNumber } from "@/utils/validate";
import SectionHeader from "./SectionHeader";
import { InputField } from "@/shared/components/commonUI/inputs";
/**
 * ProjectBudget
 *
 * Renders the budget section of the create-project form. Shows inputs for the
 * approved budget and the purchase order (PO) number and applies shared
 * validation rules.
 *
 * Props:
 * - `isDisable` (boolean): disables the inputs when true (used for review mode).
 * - `billingcurreny` (string): currency code displayed in the budget label.
 *
 * Behavior:
 * - Uses `validateBudget` and `validatePurchaseOrderNumber` for field validation.
 * - Integrates with surrounding `FormProvider`/`react-hook-form` via shared input components.
 *
 * @component
 * @param {{ isDisable: boolean; billingcurreny: string }} props
 * @returns {JSX.Element} Budget input section for project creation
 */
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
