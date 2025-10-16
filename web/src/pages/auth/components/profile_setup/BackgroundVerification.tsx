import FileUpload from '@/shared/components/commonUI/inputs/FileUpload';

const BackgroundVerification = () => {
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
    </div>
  );
}

export default BackgroundVerification
