import React from "react";
import type { CompanyInfo } from "../../types";
import placeholdr_user from "@/assets/user-image/placeholdr_user.svg";

/**
 * BasicInformation component displays the basic information of a company.
 * It shows details like company name, contact person, address, and other business-related information.
 *
 * @component
 * @param {CompanyInfo} props - The props for the component.
 * @param {string} [props.profileImage="https://via.placeholder.com/100"] - The URL of the profile image.
 * @param {string} props.companyName - The name of the company.
 * @param {string} props.businessType - The type of business.
 * @param {string} props.country - The country where the company is located.
 * @param {string} props.postalCode - The postal code of the company's address.
 * @param {string} props.contactPersonName - The name of the contact person.
 * @param {string} props.industry - The industry the company belongs to.
 * @param {string} props.state - The state where the company is located.
 * @param {string} props.taxDocument - The type or name of the tax document.
 * @param {string} props.phoneNumber - The phone number of the company.
 * @param {string} props.address - The address of the company.
 * @param {string} props.city - The city where the company is located.
 * @param {string} props.vatRegistrationNumber - The VAT registration number of the company.
 * @returns {JSX.Element} The rendered BasicInformation component.
 */
const BasicInformation: React.FC<CompanyInfo> = ({
  // profileImage = placeholdr_user,
  companyName,
  businessType,
  country,
  postalCode,
  contactPersonName,
  industry,
  state,
  taxDocument,
  phoneNumber,
  address,
  city,
  vatRegistrationNumber,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      {/* Profile Image Section */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Profile Image
      </div>
      <div className="w-24 h-24 bg-transparent rounded-full mb-4 overflow-hidden border border-gray-300 dark:border-gray-700">
        <img
          src={placeholdr_user}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4 flex flex-col items-center">
          {/* Left Column Info */}
          <div className="w-full space-y-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Company Name
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {companyName}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Business Type
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {businessType}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Country
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {country}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Postal Code
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {postalCode}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column Info */}
        <div className="lg:w-1/4 flex flex-col space-y-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Contact Person Name
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {contactPersonName}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Industry
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {industry}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              State
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {state}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Tax Document (VAT)
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {taxDocument}
            </div>
          </div>
        </div>

        {/* Right Column Info */}
        <div className="lg:w-1/2 flex flex-col space-y-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Phone Number
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {phoneNumber}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Address
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {address}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              City
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {city}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              VAT Registration Number
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {vatRegistrationNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
