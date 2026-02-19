import { useClientUpdateCompanyInfo } from "@/shared/apiServices/client/clientOpenApiService";
import { useVatOptions } from "@/shared/apiServices/client/clientOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import type { LookupItem } from "@/shared/hooks/useLookup";
import {
  useCities,
  useCountries,
  useIndustries,
  useStates,
} from "@/shared/hooks/useLookup";
import { useClientCompanyInfoStore } from "@/shared/store/useClientCompanyInfoStore";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CiLocationOn } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { TbFileText } from "react-icons/tb";
import { toast } from "react-toastify";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import {
  validateAddress,
  validateIsPhoneVerified,
  validateName,
  validateVatNumber,
  validateZipcode,
  validateCompany,
} from "../../Validate";

interface ClientPersonalInformationProps {
  onMenuItemClick: (key: string) => void;
}
/**
 * The PersonalInformation component renders a form for editing user profile details.
 * It uses `react-hook-form` for state management and validation.
 * @param {PersonalInfoProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered PersonalInformation form component.
 */
const ClientPersonalInformation: React.FC<ClientPersonalInformationProps> = ({
  onMenuItemClick,
}) => {
  const { companyInfo } = useClientCompanyInfoStore();

  const { mutateAsync: updateClient } = useClientUpdateCompanyInfo({
    onSuccess: () => {
      toast.success("Profile Updated Successfully");
      onMenuItemClick("clientAccount");
    },
    onError: (error: unknown) => {
      toast.error(GlobalApiErrorHandler.handle(error).message);
    },
  });

  const methods = useForm<PersonalInfo>({
    defaultValues: {
      companyName: "",
      contactPersonName: "",
      phoneNumber: "",
      businessType: "PRIVATE",
      industry: "",
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      taxDocument: "",
      vatRegistrationNumber: "",
    },
    mode: "onChange",
  });
  const { control, trigger, reset } = methods;
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Watch values for dependent fields
  const country = useWatch({ control, name: "country" });
  const selectedStateValue = useWatch({ control, name: "state" });

  // Fetch dropdown data from API
  const countriesQuery = useCountries();

  const parentCountryId =
    typeof country === "object" && country !== null && "value" in country
      ? (country as any).value
      : country;

  const statesQuery = useStates(parentCountryId);

  const parentStateId =
    typeof selectedStateValue === "object" &&
    selectedStateValue !== null &&
    "value" in selectedStateValue
      ? (selectedStateValue as any).value
      : selectedStateValue;

  const citiesQuery = useCities(parentStateId);
  const industryQuery = useIndustries();

  const countries = useMemo(
    () =>
      (countriesQuery.data || []).map((i: LookupItem) => ({
        value: i.id,
        label: i.name,
      })),
    [countriesQuery.data],
  );
  const states = useMemo(
    () =>
      (statesQuery.data || []).map((i: LookupItem) => ({
        value: i.id,
        label: i.name,
      })),
    [statesQuery.data],
  );
  const cities = useMemo(
    () =>
      (citiesQuery.data || []).map((i: LookupItem) => ({
        value: i.id,
        label: i.name,
      })),
    [citiesQuery.data],
  );
  const industries = useMemo(
    () =>
      (industryQuery.data || []).map((i: LookupItem) => ({
        value: i.id,
        label: i.name,
      })),
    [industryQuery.data],
  );

  const { data: vatOptions = [], isLoading: vatLoading } = useVatOptions();

  // Sync form with store data
  useEffect(() => {
    if (companyInfo) {
      reset({
        companyName:
          ("companyName" in companyInfo && companyInfo.companyName) || "",
        contactPersonName:
          ("personName" in companyInfo
            ? companyInfo.personName
            : companyInfo.name) || "",
        phoneNumber: companyInfo.phoneNumber || "",
        businessType: "PRIVATE", // Default or map if exists
        industry:
          ("industryId" in companyInfo ? companyInfo.industryId : "") || "",
        address: ("address" in companyInfo ? companyInfo.address : "") || "",
        country: companyInfo.countryId || "",
        state: companyInfo.stateId || "",
        city: companyInfo.cityId || "",
        postalCode: companyInfo.postalCode || "",
        taxDocument:
          ("documentType" in companyInfo && companyInfo.documentType) || "",
        vatRegistrationNumber:
          ("documentNumber" in companyInfo && companyInfo.documentNumber) || "",
      });

      if (companyInfo.phoneNumber) {
        setIsPhoneVerified(true);
      }
    }
  }, [companyInfo, reset]);

  const handleSubmit = async (data: PersonalInfo) => {
    const isCorporate = companyInfo?.clientType === "corporate";

    // Helper to get ID
    const getId = (val: any) => {
      if (!val) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };

    await updateClient({
      body: {
        clientType: isCorporate ? "corporate" : "home",
        name: data.contactPersonName,
        companyName: isCorporate ? data.companyName : undefined,
        personName: data.contactPersonName,
        address: data.address,
        countryId: getId(data.country),
        stateId: getId(data.state),
        cityId: getId(data.city),
        postalCode: data.postalCode,
        industryId: isCorporate ? getId(data.industry) : undefined,
        documentType: isCorporate ? data.taxDocument : undefined,
        documentNumber: isCorporate ? data.vatRegistrationNumber : undefined,
      },
    });
  };

  useEffect(() => {
    if (isPhoneVerified) {
      trigger("phoneNumber");
    }
  }, [isPhoneVerified, trigger]);

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        {companyInfo?.clientType === "corporate" && (
          <InputField
            label="Company Name"
            name="companyName"
            type="text"
            placeholder="Company Name"
            leftIcon={<FaRegUser className="text-lg text-gray-500" />}
            required
            rules={{ validate: (v: string) => validateCompany(v) }}
          />
        )}
        <InputField
          label="Contact Person Name"
          name="contactPersonName"
          type="text"
          placeholder="Contact Person Name"
          leftIcon={<FaRegUser className="text-lg text-gray-500" />}
          required
          rules={{ validate: (v: string) => validateName(v) }}
        />
        <VerifiedPhoneInputField
          name="phoneNumber"
          label="Phone Number"
          isShowLabel={true}
          placeholder="Enter Phone Number"
          required
          rules={{
            validate: () => validateIsPhoneVerified(isPhoneVerified),
          }}
          verified={isPhoneVerified}
          setVerified={setIsPhoneVerified}
        />
        <SelectField
          label="Business Type"
          name="businessType"
          placeholder="Business Type"
          leftIcon={<TbFileText className="text-lg text-gray-500" />}
          options={[
            { value: "PRIVATE", label: "Private" },
            { value: "GOVERNMENT", label: "Government" },
            { value: "NGO", label: "NGO" },
            { value: "OTHER", label: "Other" },
          ]}
          required
        />

        {companyInfo?.clientType === "corporate" && (
          <SelectField
            label="Industry"
            name="industry"
            placeholder="Industry"
            leftIcon={<TbFileText className="text-lg text-gray-500" />}
            options={industries}
            required
          />
        )}

        <InputField
          label="Address"
          name="address"
          type="text"
          placeholder="Address"
          leftIcon={<CiLocationOn className="text-lg text-gray-500" />}
          required
          rules={{ validate: (v: string) => validateAddress(v) }}
        />
        <SelectField
          label="Country"
          name="country"
          placeholder="Country"
          options={countries}
          required
        />
        <SelectField
          name="state"
          placeholder="State"
          options={states}
          required
          label="State"
          disabled={!country}
        />
        <SelectField
          name="city"
          placeholder="City"
          options={cities}
          required
          label="City"
          disabled={!selectedStateValue}
        />
        <InputField
          name="postalCode"
          label="Postal Code"
          type="text"
          placeholder="Postal Code"
          required
          allowedCharacters="alphanumeric"
          rules={{
            validate: (value: string) =>
              validateZipcode(
                value,
                typeof country === "string" ? country : (country as any)?.value,
              ),
          }}
        />
        {companyInfo?.clientType === "corporate" && (
          <>
            <SelectField
              label="Tax Document"
              name="taxDocument"
              placeholder="Tax Document(VAT)"
              options={vatOptions}
              required
              disabled={vatLoading}
            />
            <InputField
              name="vatRegistrationNumber"
              type="text"
              placeholder="VAT Registration Number"
              required
              label="VAT Registration Number"
              rules={{ validate: (v: string) => validateVatNumber(v) }}
            />
          </>
        )}
      </div>

      <div className="p-3 mt-auto">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Edit Profile
        </Button>
      </div>
    </FormContainer>
  );
};

export default ClientPersonalInformation;
