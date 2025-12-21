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
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
    
      <FileUpload
        name="governmentId"
        label="Government ID"
        placeholder="Government ID"
        // required
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
