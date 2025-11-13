import React from 'react';
import type { CompanyInfo } from '../../types';


const BasicInformation: React.FC<CompanyInfo> = ({
  profileImage = "https://via.placeholder.com/100",
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
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Profile Image</div>
         <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="lg:w-1/4 flex flex-col items-center">
         
          
          
          {/* Left Column Info */}
          <div className="w-full space-y-4">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company Name</div>
              <div className="font-semibold text-gray-800 dark:text-white">{companyName}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Business Type</div>
              <div className="font-semibold text-gray-800 dark:text-white">{businessType}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Country</div>
              <div className="font-semibold text-gray-800 dark:text-white">{country}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Postal Code</div>
              <div className="font-semibold text-gray-800 dark:text-white">{postalCode}</div>
            </div>
          </div>
        </div>
        
        {/* Middle Column Info */}
        <div className="lg:w-1/4 flex flex-col space-y-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contact Person Name</div>
            <div className="font-semibold text-gray-800 dark:text-white">{contactPersonName}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Industry</div>
            <div className="font-semibold text-gray-800 dark:text-white">{industry}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">State</div>
            <div className="font-semibold text-gray-800 dark:text-white">{state}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tax Document (VAT)</div>
            <div className="font-semibold text-gray-800 dark:text-white">{taxDocument}</div>
          </div>
        </div>
        
        {/* Right Column Info */}
        <div className="lg:w-1/2 flex flex-col space-y-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number</div>
            <div className="font-semibold text-gray-800 dark:text-white">{phoneNumber}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Address</div>
            <div className="font-semibold text-gray-800 dark:text-white">{address}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">City</div>
            <div className="font-semibold text-gray-800 dark:text-white">{city}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">VAT Registration Number</div>
            <div className="font-semibold text-gray-800 dark:text-white">{vatRegistrationNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
// // Example usage with sample data
// const SampleCompanyProfile: React.FC = () => {
//   return (
//     <CompanyProfileCard
//       companyName="ABC Pvt Ltd"
//       businessType="Retail"
//       country="India"
//       postalCode="110001"
//       contactPersonName="John Doe"
//       industry="E-commerce"
//       state="Delhi"
//       taxDocument="VAT Type A"
//       phoneNumber="+91 9876543210"
//       address="123 Business Street, Sector 45"
//       city="New Delhi"
//       vatRegistrationNumber="VAT12345678"
//     />
//   );
// };

// export default SampleCompanyProfile;