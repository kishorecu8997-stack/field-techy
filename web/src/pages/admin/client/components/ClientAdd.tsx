import React from "react";
import { taxDocuments } from "@/dummy_data/adminClientData";
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
import type { ClientAddProps, ClientFormData } from "../types";
import { useFormContext } from "react-hook-form";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import {
  LookupTable,
  useAppGetLookupData,
} from "@/shared/apiServices/admin/adminOpenApiService";

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
const ClientAdd: React.FC<ClientAddProps> = ({
  isEdit = false,
  isView = false,
}) => {
  const { watch, setValue } = useFormContext<ClientFormData>();
  const clientType = watch("clientType");
  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Lookup APIs
  const { data: businessTypes } = useAppGetLookupData(
    LookupTable.BusinessTypes,
  );
  const { data: countries } = useAppGetLookupData(LookupTable.Countries);
  const { data: states } = useAppGetLookupData(
    LookupTable.States,
    selectedCountry,
    { enabled: !!selectedCountry },
  );
  const { data: cities } = useAppGetLookupData(
    LookupTable.Cities,
    selectedState,
    {
      enabled: !!selectedState,
    },
  );
  const { data: industriesData } = useAppGetLookupData(LookupTable.Industries);

  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto flex-col bg-transparent p-4">
      <div className="mb-8">
        <label className="block mb-3 font-medium">Profile Image</label>
        <div className="w-fit">
          <ImageUploaderField name="profileImage" allowUpload={!isView} />
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
            disabled={isEdit || isView}
          />

          {clientType === "corporate" && (
            <InputField
              name="companyName"
              label="Company Name"
              placeholder="Enter Company Name"
              required
              rules={{ validate: (v: string) => validateCompany(v) }}
              disabled={isView}
            />
          )}

          <PhoneInputField
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter Phone Number"
            required
            disabled={isView}
          />

          <InputField
            name="email"
            label="Email Address"
            type="text"
            required
            rules={validateEmailRules}
            disabled={isEdit || isView}
          />
          <SelectField
            label="Country"
            name="country"
            placeholder="Select Country"
            options={
              countries?.map((item) => ({
                value: item.id,
                label: item.name,
              })) ?? []
            }
            required
            disabled={isView}
            onChange={() => {
              setValue("state", "");
              setValue("city", "");
            }}
          />
          <SelectField
            label="State"
            name="state"
            placeholder="Select state"
            options={
              states?.map((item) => ({
                value: item.id,
                label: item.name,
              })) ?? []
            }
            required
            disabled={!selectedCountry || isView}
            onChange={() => {
              setValue("city", "");
            }}
          />
          <SelectField
            label="City"
            name="city"
            placeholder="Select city"
            options={
              cities?.map((item) => ({
                value: item.id,
                label: item.name,
              })) ?? []
            }
            required
            disabled={!selectedState || isView}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {clientType === "corporate" && (
            <InputField
              label="Address"
              name="address"
              placeholder="Enter Address"
              required
              rules={{ validate: (v: string) => validateAddress(v) }}
              disabled={isView}
            />
          )}

          <InputField
            name="postalCode"
            label="Postal Code"
            type="text"
            placeholder="Enter Postal Code"
            required
            disabled={isView}
            rules={{
              validate: (value: string) =>
                validateZipcode(
                  value,
                  selectedCountry ? String(selectedCountry) : undefined,
                ),
            }}
          />
          <InputField
            label="Contact Person Name"
            name="contactPersonName"
            placeholder="Enter Contact Person Name"
            required
            rules={{ validate: (v: string) => validateName(v) }}
            disabled={isView}
          />
          {clientType === "corporate" && (
            <SelectField
              label="Industry"
              name="industry"
              placeholder="Select Industry"
              options={
                industriesData?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) ?? []
              }
              required
              disabled={isView}
            />
          )}
          {clientType === "corporate" && (
            <SelectField
              label="Business Type"
              name="businessType"
              placeholder="Select business type"
              options={
                businessTypes?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) ?? []
              }
              required
              disabled={isView}
            />
          )}

          {clientType === "corporate" && (
            <InputField
              label="Enter VAT registration number"
              name="documentNumber"
              required
              placeholder="Enter VAT registration number"
              rules={{ validate: (v: string) => validateVatNumber(v) }}
              disabled={isView}
            />
          )}
          {clientType === "corporate" && (
            <SelectField
              label="Tax Document (VAT)"
              name="documentType"
              placeholder="Select tax document"
              options={taxDocuments}
              required
              disabled={isView}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientAdd;
