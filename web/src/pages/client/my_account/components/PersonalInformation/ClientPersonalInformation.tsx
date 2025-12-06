import React, { useEffect, useState } from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import { CiLocationOn } from "react-icons/ci";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm, useWatch } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import {
  validateAddress,
  validateIsPhoneVerified,
  validateName,
  validateVatNumber,
  validateZipcode,
} from "../../Validate";
import { Button } from "@/shared/components/commonUI/Buttons";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import { toast } from "react-toastify";
import { loginData } from "@/dummy_data/personalInfoData";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import countries, {
  BUSINESS_TYPES,
} from "@/dummy_data/client/clientMyProfieTypes";
import { TbFileText } from "react-icons/tb";

interface ClientPersonalInformationProps {
  onMenuItemClick: (key: string) => void;
  onClose: () => void;
}
/**
 * The PersonalInformation component renders a form for editing user profile details.
 * It uses `react-hook-form` for state management and validation.
 * @param {PersonalInfoProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered PersonalInformation form component.
 */
const ClientPersonalInformation: React.FC<ClientPersonalInformationProps> = ({onMenuItemClick,onClose}) => {
  /**
   * Initializes `react-hook-form` with default values for the personal information form.
   */
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
  const { control, trigger } = methods;
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const country = useWatch({ control, name: "country" });

  const handleSubmit = (data: PersonalInfo) => {
    console.log("Form submitted with data:", data);
    toast.success("Profile Updated Successfully");
    onMenuItemClick("clientAccount");
    
    // TODO: Replace with actual submission logic (e.g., API call)
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
          rules={{ validate: (v: string) => validateName(v) }}
        />
        <VerifiedPhoneInputField
          name="phoneNumber"
          label="Phone Number"
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
          options={[
            { value: "1", label: "Information Technology" },
            { value: "2", label: "Construction" },
          ]}
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
          options={countries.map((e) => ({
            value: e.value,
            label: e.label,
          }))}
          required
        />
        <SelectField
          name="state"
          placeholder="State"
          options={[
            { value: "1", label: "Maharashtra" },
            { value: "2", label: "Manchester" },
          ]}
          required
          label="State"
        />
        <SelectField
          name="city"
          placeholder="City"
          options={[
            { value: "1", label: "Mumbai" },
            { value: "2", label: "London" },
          ]}
          required
          label="City"
        />
        <InputField
          name="postalCode"
          label="Postal Code"
          type="text"
          placeholder="Postal Code"
          required
          rules={{
            validate: (value: string) =>
              validateZipcode(
                value,
                typeof country === "string" ? country : (country as any)?.value
              ),
          }}
        />
        <SelectField
          label="Tax Document"
          name="taxDocument"
          placeholder="Tax Document(VAT)"
          options={BUSINESS_TYPES.map((e) => ({
            value: e.id,
            label: e.name,
          }))}
          required
        />
        <InputField
          name="vatRegistrationNumber"
          type="text"
          placeholder="VAT Registration Number"
          required
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
