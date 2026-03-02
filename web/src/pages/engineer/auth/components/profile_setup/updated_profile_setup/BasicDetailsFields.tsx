// lookup data fetched from API
import {
  validateAddress,
  validateAmount,
  validateCompany,
  validateDesignation,
  validateExperience,
  validateName,
  validateZipcode,
} from "@/pages/engineer/auth/components/profile_setup/profileValidators";

import { InputField } from "@/shared/components/commonUI/inputs";
import { PhoneInputWithValidation } from "@/shared/components/commonUI/inputs/PhoneInputWithValidation";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import {
  useCities,
  useCountries,
  useServiceCategories,
  useSkills,
  useStates,
  type LookupItem,
} from "@/shared/hooks/useLookup";
import { validatePortfolioLink } from "@/shared/libs/utils";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { CiLocationOn } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoUnlinkSharp, IoWalletOutline } from "react-icons/io5";
import EmailFieldWithValidation from "@/shared/components/commonUI/inputs/EmailFieldWithValidation";
import { useAppResolveSignupRegion } from "@/shared/apiServices/commonOpenApiService";

const BasicDetailsFields = () => {
  const { watch } = useFormContext();
  const country = watch("country");
  const selectedState = watch("state");
  const { data: signupRegion } = useAppResolveSignupRegion();

  const regionId = signupRegion?.regionId;
  const countriesQuery = useCountries(regionId);

  const parentCountryId = country?.value ?? country;
  const statesQuery = useStates(parentCountryId);

  const parentStateId = selectedState?.value ?? selectedState;
  const citiesQuery = useCities(parentStateId);

  // Skills and Service Categories from API
  const skillsQuery = useSkills();
  const serviceCategoriesQuery = useServiceCategories();

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
  const skills = useMemo(
    () =>
      (skillsQuery.data || []).map((i: LookupItem) => ({
        value: i.id,
        label: i.name,
      })),
    [skillsQuery.data],
  );
  const serviceCategories = useMemo(
    () =>
      (serviceCategoriesQuery.data || []).map((i: LookupItem) => ({
        value: i.id,
        label: i.name,
      })),
    [serviceCategoriesQuery.data],
  );

  const statesLoading = statesQuery.isLoading;
  const citiesLoading = citiesQuery.isLoading;
  const skillsLoading = skillsQuery.isLoading;
  const serviceCategoriesLoading = serviceCategoriesQuery.isLoading;

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <InputField
        name="fullName"
        type="text"
        placeholder="Full Name"
        leftIcon={<FaRegUser className="text-lg text-gray-500" />}
        required
        label="Full Name"
        rules={{ validate: (v: string) => validateName(v, "Full Name") }}
      />

      <PhoneInputWithValidation />

      <EmailFieldWithValidation />

      {/* Location Section */}
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 ">
        Location Details
      </div>

      <InputField
        name="address"
        label="Address"
        type="text"
        placeholder="Address"
        required
        leftIcon={<CiLocationOn className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validateAddress(v) }}
      />

      <SelectField
        name="country"
        label="Country"
        placeholder="Select Country"
        options={countries}
        required
      />

      <SelectField
        name="state"
        placeholder={statesLoading ? "Loading states..." : "Select State"}
        options={states}
        required
        label="State/Region"
        disabled={statesLoading || !country}
      />

      <SelectField
        name="city"
        placeholder={citiesLoading ? "Loading cities..." : "Select City"}
        options={cities}
        required
        label="City"
        disabled={citiesLoading || !selectedState}
      />

      <InputField
        name="postalCode"
        label="Postal Code"
        type="text"
        placeholder="Postal Code"
        required
        leftIcon={<HiOutlineLocationMarker className="text-lg text-gray-500" />}
        rules={{
          validate: (value: string) =>
            validateZipcode(
              value,
              typeof country === "string" ? country : country?.value,
            ),
        }}
      />

      {/* Professional Details Section */}
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 ">
        Professional Details
      </div>

      <TagSelectField
        name="skills"
        label="Skills"
        placeholder={skillsLoading ? "Loading skills..." : "Add your skills"}
        required
        options={skills}
        maxTags={15}
        disabled={skillsLoading}
      />

      <SelectField
        name="serviceCategory"
        label="Service Category"
        placeholder={
          serviceCategoriesLoading ? "Loading categories..." : "Select Category"
        }
        options={serviceCategories}
        required
        disabled={serviceCategoriesLoading}
      />

      <InputField
        name="amount"
        label="Hourly Rate / Budget"
        type="text"
        placeholder="$50/hr"
        required
        leftIcon={<IoWalletOutline className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validateAmount(v) }}
      />

      <InputField
        name="portfolioLink"
        label="Portfolio Link"
        type="text"
        placeholder="https://..."
        leftIcon={<IoUnlinkSharp className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validatePortfolioLink(v) }}
      />

      <InputField
        name="designation"
        label="Current Designation"
        type="text"
        placeholder="Current Designation"
        required
        rules={{ validate: (v: string) => validateDesignation(v) }}
      />

      <InputField
        name="company"
        label="Company/Employer"
        type="text"
        placeholder="Company/Employer"
        required
        rules={{ validate: (v: string) => validateCompany(v) }}
      />

      <InputField
        name="experienceYears"
        label="Years of Experience"
        type="text"
        placeholder="e.g. 5"
        required
        rules={{ validate: (v: string) => validateExperience(v) }}
      />
    </div>
  );
};

export default BasicDetailsFields;
