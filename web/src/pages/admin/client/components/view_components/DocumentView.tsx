import Certificate from "@/assets/document/Certificate.jpg";
import QualificationCertificate from"@/assets/document/QualificationCertificate.jpg"

export default function DocumentView() {
    
  return (
    <div className="flex p-2 gap-4 bg-white dark:bg-neutral-800 rounded-md">
        <div className="grid md:flex mb-6 mt-2 md:w-8/12 gap-8 justify-between">
          {/* Government ID Proof */}
          <div className="w-60">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Government ID Proof
            </label>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-700">
              <img
                src={Certificate}
                alt="Government ID Proof"
                className="max-w-full max-h-full object-contain"
              />             
            </div>
          </div>

          {/* Qualification Certificate */}
          <div className="w-60">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Qualification Certificate
            </label>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-700">
              <img
                src={QualificationCertificate}
                alt="Qualification Certificate"
                className="max-w-full max-h-full object-contain"
              />            
            </div>
          </div>
        </div>
    </div>
  );
}