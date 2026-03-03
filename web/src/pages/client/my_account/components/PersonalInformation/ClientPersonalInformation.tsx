import {
  useAppResolveSignupRegion,
  useClientGetCompanyInfo,
  useClientUpdateCompanyInfo,
  useVatOptions,
} from "@/shared/apiServices/client/clientOpenApiService";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import type { LookupItem } from "@/shared/hooks/useLookup";
import {
  useCities,
  useCountries,
  useIndustries,
  useLookup,
  useStates,
} from "@/shared/hooks/useLookup";
import { usePopupStore } from "@/shared/store/popupStore";
import { useClientCompanyInfoStore } from "@/shared/store/useClientCompanyInfoStore";
import { useClientStore } from "@/shared/store/useClientStore";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CiLocationOn } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { TbFileText } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  validateAddress,
  validateCompany,
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
  const { showPopup } = usePopupStore();
  const { companyInfo, setCompanyInfo } = useClientCompanyInfoStore();

  // Fetch company info
  const {
    data: clientInfo,
    isLoading: isFetchingInfo,
    isFetching,
  } = useClientGetCompanyInfo(true);
  console.log(clientInfo);

  useEffect(() => {
    if (clientInfo) {
      setCompanyInfo(clientInfo);
      if (clientInfo.phoneNumber) {
        setIsPhoneVerified(true);
      }
    }
  }, [clientInfo, setCompanyInfo]);

  const { data: businessTypesData } = useLookup("businessTypes");

  const businessTypes = useMemo(
    () =>
      (businessTypesData || []).map((i: LookupItem) => ({
        value: i.id,
        label: i.name,
      })),
    [businessTypesData],
  );

  const { fetchClientProfile } = useClientStore();

  const { mutateAsync: updateClient } = useClientUpdateCompanyInfo({
    onSuccess: () => {
      toast.success("Profile Updated Successfully");
      fetchClientProfile();
      onMenuItemClick("clientAccount");
    },
    onError: (error: unknown) => {
      toast.error(GlobalApiErrorHandler.handle(error).message);
    },
  });

  const corporateInfo =
    clientInfo?.clientType === "corporate" ? clientInfo : null;

  const methods = useForm<PersonalInfo>({
    // useForm reads defaultValues ONCE at mount — clientInfo is null at that
    // point (async fetch). Actual population is done via setValue in useEffects below.
    defaultValues: {
      companyName: corporateInfo?.companyName,
      contactPersonName: clientInfo?.name,
      phoneNumber: clientInfo?.phoneNumber,
      businessType: corporateInfo?.businessTypeId,
      industry: corporateInfo?.industryId,
      address: corporateInfo?.address,
      country: clientInfo?.countryId,
      state: clientInfo?.stateId,
      city: clientInfo?.cityId,
      postalCode: clientInfo?.postalCode,
      taxDocument: corporateInfo?.documentType,
      vatRegistrationNumber: corporateInfo?.documentNumber,
    },
    mode: "onChange",
  });

  const { control, trigger } = methods;
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Watch values for dependent fields
  const country = useWatch({ control, name: "country" });
  const selectedStateValue = useWatch({ control, name: "state" });

  const { data: signupRegion } = useAppResolveSignupRegion();

  // Fetch dropdown data from API
  const regionId = signupRegion?.regionId;
  const countriesQuery = useCountries(regionId);

  const parentCountryId =
    typeof country === "object" && country !== null && "value" in country
      ? (country as { value: string | number }).value
      : country;

  const statesQuery = useStates(parentCountryId);

  const parentStateId =
    typeof selectedStateValue === "object" &&
    selectedStateValue !== null &&
    "value" in selectedStateValue
      ? (selectedStateValue as { value: string | number }).value
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

  const showLoader = (isFetchingInfo || isFetching) && !companyInfo;

  useEffect(() => {
    if (isPhoneVerified) {
      trigger("phoneNumber");
    }
  }, [isPhoneVerified, trigger]);

  if (showLoader) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <LoaderComponent />
        <p className="mt-4 text-gray-500 animate-pulse">
          Refreshing company information...
        </p>
      </div>
    );
  }

  const handleSubmit = async (data: PersonalInfo) => {
    const isCorporate = companyInfo?.clientType === "corporate";

    // Extract a numeric ID from a raw number/string value (SelectField stores the option's value directly)
    const getId = (
      val: string | number | null | undefined,
    ): number | undefined => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };

    const updateBody = {
      clientType: (isCorporate ? "corporate" : "home") as "corporate" | "home",
      name: data.contactPersonName,
      companyName: isCorporate ? data.companyName : undefined,
      personName: data.contactPersonName,
      address: data.address ?? undefined,
      countryId: getId(data.country),
      stateId: getId(data.state),
      cityId: getId(data.city),
      postalCode: data.postalCode,
      industryId: isCorporate ? getId(data.industry) : undefined,
      businessTypeId: isCorporate ? getId(data.businessType) : undefined,
      documentType: isCorporate ? (data.taxDocument ?? undefined) : undefined,
      documentNumber: isCorporate ? data.vatRegistrationNumber : undefined,
    };

    await showPopup({
      title: "Update Profile",
      body: "Are you sure you want to update your profile?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "danger",
          action: async (close) => {
            close(true);
          },
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            try {
              await updateClient({
                body: updateBody,
              });
              close(true);
            } catch (error: unknown) {
              toast.error(GlobalApiErrorHandler.handle(error).message);
              close(true);
            }
          },
        },
      ],
    });
  };

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
          options={
            businessTypes.length > 0
              ? businessTypes
              : [
                  { value: "PRIVATE", label: "Private" },
                  { value: "GOVERNMENT", label: "Government" },
                  { value: "NGO", label: "NGO" },
                  { value: "OTHER", label: "Other" },
                ]
          }
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
                typeof country === "string"
                  ? country
                  : String(
                      country !== null &&
                        typeof country === "object" &&
                        "value" in country
                        ? (country as { value: string | number }).value
                        : country,
                    ),
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

      <div className="bg-white">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition rounded-none"
        >
          Edit Profile
        </Button>
      </div>
    </FormContainer>
  );
};

export default ClientPersonalInformation;
