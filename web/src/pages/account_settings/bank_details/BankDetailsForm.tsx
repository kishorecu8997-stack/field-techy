import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { SelectField } from "@/shared/components/commonUI/inputs/SelectField";

/**
 * Reusable form component for adding or editing bank details, with fields for bank name, account number,
 * SWIFT code, address, IBAN, and account holder name. Submit button text adapts based on `formType`.
 */
const BankDetailsForm = ({ formType }: { formType?: string }) => {
  return (
    <>
      <div className="flex flex-col">
        <SelectField
          name="bankName"
          label="Bank Name"
          isShowLabel={false}
          options={[{ value: "1", label: "Bank of America" }, { value: "2", label: "Citi" }]}
          placeholder="Select a bank"
          required
        />
        <InputField
          name="accountNumber"
          label="Account Number"
          isShowLabel={false}
          placeholder="Enter account number"
          required
        />
        <InputField name="swiftcode" label="Swift Code" placeholder="Enter swift code"  isShowLabel={false}  required/>
        <InputField
          name="bankAddress"
          label="Bank Address"
          placeholder="Enter bank address"
          required
           isShowLabel={false}
        />
        <InputField name="iban" label="IBAN" placeholder="Enter IBAN"  isShowLabel={false}  required/>
        <InputField name="name" label="Name" placeholder="Enter name"  isShowLabel={false}  required/>
      </div>
      <div className="mt-auto flex justify-end">
        <Button
          type="submit"
          className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded"
        >
          {formType === "add" ? "Add Account" : "Save Bank Details"}
        </Button>
      </div>
    </>
  );
};

export default BankDetailsForm;
