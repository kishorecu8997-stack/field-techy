import React from "react";
import {
  businessTypes,
  cities,
  countries,
  industries,
  stateOptions,
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

const ClientAdd: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md">
      {/* Profile Image */}
      <div className="mb-8">
        <label className="block mb-3 font-medium">Profile Image</label>
        <div className="w-fit">
          <ImageUploaderField name="profileImage" />
        </div>
      </div>
      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <InputField
            name="companyName"
            label="Company Name"
            placeholder="Enter Company Name"
            required
            rules={{ validate: (v: string) => validateCompany(v) }}
          />
          <PhoneInputField
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter Phone Number"
            required
          />

          <SelectField
            label="Industry"
            name="industry"
            placeholder="Select Industry"
            options={industries}
            required
          />

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
            options={cities}
            required
          />
          <div className="relative">
            <SelectField
              label="Tax Document (VAT)"
              name="taxDocument"
              placeholder="Select tax document"
              options={taxDocuments}
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InputField
            label="Contact Person Name"
            name="contactPersonName"
            placeholder="Enter Contact Person Name"
            required
            rules={{ validate: (v: string) => validateName(v) }}
          />

          <SelectField
            label="Business Type"
            name="businessType"
            placeholder="Select business type"
            options={businessTypes}
            required
          />

          <InputField
            label="Address"
            name="address"
            required
            rules={{ validate: (v: string) => validateAddress(v) }}
          />
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
              validate: (value: string) => validateZipcode(value),
            }}
          />
          <InputField
            label="Enter VAT registration number"
            name="vatRegistrationNumber"
            required
            placeholder="Enter VAT registration number"
            rules={{ validate: (v: string) => validateVatNumber(v) }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientAdd;
