import { bankList } from "@/dummy_data/bankDetails";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { SelectField } from "@/shared/components/commonUI/inputs/SelectField";
import {
  validateAccNumber,
  validateAddress,
  validateIBANForCountrywise,
  validateNameWithSpace,
  validateSWIFTBank,
  validateName,
} from "../validation";
 
/**
 * Reusable form component for adding or editing bank details, with fields for bank name, account number,
 * SWIFT code, address, IBAN, and account holder name. Submit button text adapts based on `formType`.
 */
const BankDetailsForm = ({ formType }: { formType?: string }) => {
  return (
    <div className="flex flex-col h-full pb-4">
      <div className="flex flex-col overflow-auto flex-grow gap-4">
        <div className="p-4">
          <SelectField
            name="bankName"
            label="Bank"
            options={bankList}
            placeholder="Select a bank"
            required
          />
          <InputField
            name="bankAddress"
            label="Branch Address"
            placeholder="Branch address"
            required
            rules={{ validate: validateAddress }}
          />
          <InputField
            name="name"
            label="Name"
            placeholder="Name"
            required
            inputMode="string"
            rules={{
              validate: (value) => validateNameWithSpace(value),
            }}
          />
          <InputField
            name="accountNumber"
            label="Account Number"
            placeholder="Account number"
            required
         
            rules={{ validate: validateAccNumber }}
          />
          <InputField
            name="iban"
            label="IBAN"
            placeholder="IBAN"
            required
            rules={{ validate: validateIBANForCountrywise }}
          />
          <InputField
            name="swiftcode"
            label="Swift Code"
            placeholder="SWIFT code"
            required
           
            rules={{ validate: validateSWIFTBank }}
          />
        </div>
        <div className="mt-auto flex justify-end">
          <Button
            type="submit"
            className="w-full bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded"
          >
            {formType === "add" ? "Add Account" : "Save Bank Details"}
          </Button>
        </div>
      </div>
    </div>
  );
};
 
export default BankDetailsForm;