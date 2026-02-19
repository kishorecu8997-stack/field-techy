import React from "react";
import {
  businessTypes,
  citiesByCountry,
  countries,
  industries,
  statesByCountry,
  taxDocuments,
} from "@/dummy_data/adminClientData";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import {
  validateAddress,
  validateCompany,
  validateName,
  validateVatNumber,
  validateZipcode,
} from "../Validates";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import type { ClientFormData } from "../types";
import { useFormContext } from "react-hook-form";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";

interface ClientAddProps {
  isEdit?: boolean;
}

/**
 * ClientAdd component renders the form fields for adding or editing the basic information of a client.
 * It is designed to be nested within a `FormProvider` from `react-hook-form`.
 * This component includes fields for profile image, company details, contact information, and address.
 * It utilizes custom input components like `InputField`, `SelectField`, `ImageUploaderField`, and `PhoneInputField`,
 * and applies validation rules to them.
 *
 * @component
 * @returns {JSX.Element} The rendered form fields for client's basic information.
 */
const ClientAdd: React.FC<ClientAddProps> = ({ isEdit = false }) => {
  const { watch } = useFormContext<ClientFormData>();
  const clientType = watch("clientType");
  const selectedCountry = watch("country");

  const cityOptions = selectedCountry
    ? citiesByCountry[selectedCountry] || []
    : [];

  const stateOptions = selectedCountry
    ? statesByCountry[selectedCountry] || []
    : [];

  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto flex-col bg-transparent rounded-md p-4">
      <div className="mb-8">
        <label className="block mb-3 font-medium">Profile Image</label>
        <div className="w-fit">
          <ImageUploaderField name="profileImage" />
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SelectField
            label="Client Type"
            name="clientType"
            placeholder="Select Client Type"
            options={[
              { label: "Corporate", value: "corporate" },
              { label: "Home", value: "home" },
            ]}
            required
            disabled={isEdit}
          />

          {clientType === "corporate" && (
            <InputField
              name="companyName"
              label="Company Name"
              placeholder="Enter Company Name"
              required
              rules={{ validate: (v: string) => validateCompany(v) }}
            />
          )}

          <PhoneInputField
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter Phone Number"
            required
          />

          <InputField
            name="email"
            label="Email Address"
            type="text"
            required
            rules={validateEmailRules}
            disabled={isEdit}
          />

          {clientType === "corporate" && (
            <SelectField
              label="Industry"
              name="industry"
              placeholder="Select Industry"
              options={industries}
              required
            />
          )}

          <SelectField
            label="Country"
            name="country"
            placeholder="Select Country"
            options={countries}
            required
          />

          <SelectField
            label="City"
            name="city"
            placeholder="Select city"
            options={cityOptions}
            required
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <InputField
            label="Contact Person Name"
            name="contactPersonName"
            placeholder="Enter Contact Person Name"
            required
            rules={{ validate: (v: string) => validateName(v) }}
          />

          {clientType === "corporate" && (
            <SelectField
              label="Business Type"
              name="businessType"
              placeholder="Select business type"
              options={businessTypes}
              required
            />
          )}

          {clientType === "corporate" && (
            <InputField
              label="Address"
              name="address"
              placeholder="Enter Address"
              required
              rules={{ validate: (v: string) => validateAddress(v) }}
            />
          )}

          <SelectField
            label="State"
            name="state"
            placeholder="Select state"
            options={stateOptions}
            required
          />

          <InputField
            name="postalCode"
            label="Postal Code"
            type="text"
            placeholder="Enter Postal Code"
            required
            rules={{
              validate: (value: string) =>
                validateZipcode(value, selectedCountry),
            }}
          />

          {clientType === "corporate" && (
            <>
              <InputField
                label="Enter VAT registration number"
                name="vatRegistrationNumber"
                required
                placeholder="Enter VAT registration number"
                rules={{ validate: (v: string) => validateVatNumber(v) }}
              />

              <SelectField
                label="Tax Document (VAT)"
                name="taxDocument"
                placeholder="Select tax document"
                options={taxDocuments}
                required
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientAdd;
