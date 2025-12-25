import countries from "@/dummy_data/countries";
import {
    validateName,
    validateAddress,
    validateZipcode,
    validateAmount,
    validateCompany,
    validateDesignation,
    validateExperience,
} from "@/pages/engineer/auth/components/profile_setup/profileValidators";
import { validatePortfolioLink } from "@/shared/libs/utils";
import { InputField } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import { useFormContext } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoUnlinkSharp, IoWalletOutline } from "react-icons/io5";
import { serviceCategories } from "@/dummy_data/serviceCategories";
import skills from "@/dummy_data/skills";
import { useStates, useCities } from "@/shared/apiServices/client/clientService"; // Reusing location hooks from client service if generic, or check if engineer has them

const BasicDetailsFields = () => {
    const { watch } = useFormContext();
    const country = watch("country");
    const selectedState = watch("state");

    // Fetch dropdown data - assuming these hooks are shared or available
    const { data: states = [], isLoading: statesLoading } = useStates(
        country?.value || country
    );
    const { data: cities = [], isLoading: citiesLoading } = useCities(
        selectedState?.value || selectedState
    );

    return (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <InputField
                name="fullName"
                type="text"
                placeholder="Full Name"
                leftIcon={<FaRegUser className="text-lg text-gray-500" />}
                required
                label="Full Name"
                rules={{ validate: (v: string) => validateName(v, "Full Name") }}
            />

            <PhoneInputField name="phone" required label="Phone Number" />

            <InputField
                name="email"
                type="email"
                placeholder="Email Address"
                required
                label="Email Address"
            // disabled removed
            />

            {/* Location Section */}
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
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
                label="State"
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
                            typeof country === "string" ? country : country?.value
                        ),
                }}
            />

            {/* Professional Details Section */}
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
                Professional Details
            </div>

            <TagSelectField
                name="skills"
                label="Skills"
                placeholder="Add your skills"
                required
                options={skills}
                maxTags={15}
            />

            <SelectField
                name="serviceCategory"
                label="Service Category"
                placeholder="Select Category"
                options={serviceCategories}
                required
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
