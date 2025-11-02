import { bankList } from "@/dummy_data/bankDetails";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { SelectField } from "@/shared/components/commonUI/inputs/SelectField";
import { useFormContext } from "react-hook-form";
import {
  validateAccountNumber,
  validateIBANForCountry,
  validateSWIFTForBank,
} from "../validation";

/**
 * Reusable form component for adding or editing bank details, with fields for bank name, account number,
 * SWIFT code, address, IBAN, and account holder name. Submit button text adapts based on `formType`.
 */
const BankDetailsForm = ({ formType }: { formType?: string }) => {
  const ctx = useFormContext();
  const bankValue = ctx.watch("bankName");
  const countryCode = "BR"; //Brazil
  return (
    <>
      <div className="flex flex-col overflow-auto">
        <SelectField
          name="bankName"
          label="Bank"
          // isShowLabel={false}
          options={bankList}
          placeholder="Select a bank"
          required
        />
        <InputField
          name="bankAddress"
          label="Bank Address"
          placeholder="Bank address"
          required
          // isShowLabel={false}
          rules={{
            maxLength: {
              value: 100,
              message: "Maximum length is 100 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9\s\-#,.]+$/,
              message:
                "Only letters, numbers, spaces, hyphens, and # are allowed",
            },
          }}
        />
        <InputField
          name="name"
          label="Name"
          placeholder="Name"
          // isShowLabel={false}
          required
          rules={{
            maxLength: {
              value: 36,
              message: "Maximum length is 100 characters",
            },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Only letters and spaces are allowed",
            },
          }}
        />
        <InputField
          name="accountNumber"
          label="Account Number"
          // isShowLabel={false}
          placeholder="Account number"
          required
          rules={{
            validate: (v: string) => validateAccountNumber(v, bankValue),
          }}
        />
        <InputField
          name="iban"
          label="IBAN"
          placeholder="IBAN"
          // isShowLabel={false}
          required
          rules={{
            validate: (v: string) => validateIBANForCountry(v, countryCode),
          }}
        />
        <InputField
          name="swiftcode"
          label="Swift Code"
          placeholder="SWIFT code"
          // isShowLabel={false}
          required
          rules={{
            validate: (v: string) => validateSWIFTForBank(v, bankValue),
          }}
        />
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
