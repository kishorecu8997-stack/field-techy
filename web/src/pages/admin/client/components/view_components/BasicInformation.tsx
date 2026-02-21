import React from "react";
import type { CompanyInfo } from "../../types";
import placeholdr_user from "@/assets/user-image/placeholdr_user.svg";

/**
 * BasicInformation component displays the basic information of a company.
 * It shows details like company name, contact person, address, and other business-related information.
 */
const BasicInformation: React.FC<CompanyInfo> = ({
  profileImage,
  clientType,
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
  documentNumber,
}) => {
  const isCorporate = clientType === "corporate";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Profile Image Section */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Profile Image
      </div>
      <div className="w-24 h-24 bg-transparent rounded-full mb-6 overflow-hidden border-2 border-gray-100 dark:border-gray-700 shadow-sm">
        <img
          src={profileImage || placeholdr_user}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/4 flex flex-col">
          {/* Left Column Info */}
          <div className="w-full space-y-5">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {isCorporate ? "Company Name" : "Client Name"}
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {companyName}
              </div>
            </div>

            {isCorporate && (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Business Type
                </div>
                <div className="font-semibold text-gray-800 dark:text-white">
                  {businessType}
                </div>
              </div>
            )}

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
        <div className="lg:w-1/4 flex flex-col space-y-5">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {isCorporate ? "Contact Person Name" : "Phone Number"}
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {isCorporate ? contactPersonName : phoneNumber}
            </div>
          </div>

          {isCorporate && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Industry
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {industry}
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              State
            </div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {state}
            </div>
          </div>

          {isCorporate && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Tax Document (VAT)
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {taxDocument}
              </div>
            </div>
          )}
        </div>

        {/* Right Column Info */}
        <div className="lg:w-1/2 flex flex-col space-y-5">
          {isCorporate && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Phone Number
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {phoneNumber}
              </div>
            </div>
          )}

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

          {isCorporate && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                VAT Registration Number
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {documentNumber}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
