import { useState } from 'react';
import FileUpload from '@/shared/components/commonUI/inputs/FileUpload';

/**
 * A component representing the "Background Verification" step in a multi-step form.
 *
 * This component renders a form section that allows users to upload documents
 * required for background checks, such as a government-issued ID and professional
 * certificates. It utilizes the reusable `FileUpload` component for handling the
 * file inputs.
 *
 * This component is designed to be rendered within a `FormProvider` from `react-hook-form`
 * to connect the file inputs to the main form state.
 */

const BackgroundVerification = () => {
  const [expiryDate, setExpiryDate] = useState('');
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Background Verification</h2>
        <h2 className="text-md font-extralight">
          Please upload the required documents for background verification.
        </h2>
      </div>
      <FileUpload
        name="governmentId"
        label="Government ID"
        placeholder="Government ID"
        required
        accept='.pdf'
        maxPages={5}
        validatePDF={true}
      />
      <FileUpload
        name="certificate"
        label="Certificate"
        placeholder="Certificate"
        accept='.pdf'
        maxPages={5}
        validatePDF={true}
      />
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Expiry Date of Certificate:</label>
        <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="px-19 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
      </div>
    </div>
  );
}

export default BackgroundVerification
