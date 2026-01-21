import { useClientUpdateCompanyInfo } from "@/shared/apiServices/client/clientOpenApiService";
import { useVatOptions } from "@/shared/apiServices/client/clientService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import type { LookupItem } from "@/shared/hooks/useLookup";
import { useCities, useCountries, useIndustries, useStates } from "@/shared/hooks/useLookup";
import { useClientCompanyInfoStore } from "@/shared/store/useClientCompanyInfoStore";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CiLocationOn } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { TbFileText } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  validateAddress,
  validateIsPhoneVerified,
  validateName,
  validateVatNumber,
  validateZipcode,
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

  const { companyInfo, setCompanyInfo } = useClientCompanyInfoStore();
  const token = localStorage.getItem("auth_token") || undefined;

  const { mutateAsync: updateClient } = useClientUpdateCompanyInfo({
    onSuccess: () => {
      toast.success("Profile Updated Successfully");
      const data = methods.getValues();
      if (companyInfo) {
        setCompanyInfo({
          ...companyInfo,
          name: data.contactPersonName,
          phoneNumber: data.phoneNumber,
          ...("companyName" in companyInfo ? { companyName: data.companyName } : {}),
          ...("personName" in companyInfo ? { personName: data.contactPersonName } : {}),
          ...("address" in companyInfo ? { address: data.address } : {}),
          ...("postalCode" in companyInfo ? { postalCode: data.postalCode } : {}),
        } as any);
      }
      onMenuItemClick("clientAccount");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    }
  });

  const methods = useForm<PersonalInfo>({
    defaultValues: {
      companyName: "",
      contactPersonName: "",
      phoneNumber: "",
      businessType: "",
      industry: "",
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      taxDocument: "",
      vatRegistrationNumber: "",
    },
    mode: "onSubmit",
  });
  const { control, trigger, reset } = methods;
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const country = useWatch({ control, name: "country" });
  const selectedState = useWatch({ control, name: "state" });

  // Fetch dropdown data from API
  const countriesQuery = useCountries();
  const parentCountryId = (typeof country === 'object' && country !== null && 'value' in country) ? (country as any).value : country;
  const statesQuery = useStates(parentCountryId);
  const parentStateId = (typeof selectedState === 'object' && selectedState !== null && 'value' in selectedState) ? (selectedState as any).value : selectedState;
  const citiesQuery = useCities(parentStateId);
  const industryQuery = useIndustries();

  const countries = useMemo(() => (countriesQuery.data || []).map((i: LookupItem) => ({ value: i.id, label: i.name })), [countriesQuery.data]);
  const states = useMemo(() => (statesQuery.data || []).map((i: LookupItem) => ({ value: i.id, label: i.name })), [statesQuery.data]);
  const cities = useMemo(() => (citiesQuery.data || []).map((i: LookupItem) => ({ value: i.id, label: i.name })), [citiesQuery.data]);
  const industries = useMemo(() => (industryQuery.data || []).map((i: LookupItem) => ({ value: i.id, label: i.name })), [industryQuery.data]);

  const { data: vatOptions = [], isLoading: vatLoading } = useVatOptions();
  // Sync form with store data
  useEffect(() => {
    if (companyInfo) {
      const isCorporate = companyInfo.clientType === "corporate";

      reset({
        companyName: (companyInfo.clientType === "corporate" && companyInfo.companyName) || "",
        contactPersonName: (companyInfo.clientType === "corporate" ? companyInfo.personName : companyInfo.name) || "",
        phoneNumber: companyInfo.phoneNumber || "",
        businessType: isCorporate ? "1" : "2",
        industry: (companyInfo.clientType === "corporate" && companyInfo.industryId) ? String(companyInfo.industryId) : "",
        address: (companyInfo.clientType === "corporate" ? companyInfo.address : "") || "",
        country: companyInfo.countryId ? String(companyInfo.countryId) : "",
        state: companyInfo.stateId ? String(companyInfo.stateId) : "",
        city: companyInfo.cityId ? String(companyInfo.cityId) : "",
        postalCode: companyInfo.postalCode || "",
        taxDocument: (companyInfo.clientType === "corporate" && companyInfo.documentType) || "",
        vatRegistrationNumber: (companyInfo.clientType === "corporate" && companyInfo.documentNumber) || "",
      });

      if (companyInfo.phoneNumber) {
        setIsPhoneVerified(true);
      }
    }
  }, [companyInfo, reset]);

  const handleSubmit = async (data: PersonalInfo) => {
    const isCorporate = data.businessType === "1"; // "1" is Corporate

    // Helper to get ID
    const getId = (val: any) => {
      if (!val) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };

    await updateClient({
      token,
      body: {
        clientType: isCorporate ? "corporate" : "home",
        name: data.contactPersonName, // Login name update?
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
      }
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
        <InputField
          label="Company Name"
          name="companyName"
          type="text"
          placeholder="Company Name"
          leftIcon={<FaRegUser className="text-lg text-gray-500" />}
          required
          rules={{ validate: (v: string) => validateName(v) }}
        />
        <InputField
          label="Contact Person Name"
          name="contactPersonName"
          type="text"
          placeholder="Contact Person Name"
          leftIcon={<FaRegUser className="text-lg text-gray-500" />}
          required
          allowedCharacters="string"
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
            { value: "1", label: "Corporate" },
            { value: "2", label: "Home" },
          ]}
          required
        />

        <SelectField
          label="Industry"
          name="industry"
          placeholder="Industry"
          leftIcon={<TbFileText className="text-lg text-gray-500" />}
          options={industries}
          required
        />
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
        />
        <SelectField
          name="city"
          placeholder="City"
          options={cities}
          required
          label="City"
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
          allowedCharacters="alphanumeric"
          label="VAT Registration Number"
          rules={{ validate: (v: string) => validateVatNumber(v) }}
        />
      </div>

      <div className="bg-white ">
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
