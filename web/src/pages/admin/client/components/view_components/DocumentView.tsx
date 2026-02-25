import placeholdr_user from "@/assets/user-image/placeholdr_user.svg";
/**
 * DocumentView component displays the client's uploaded documents.
 * Currently, it shows placeholders for "Government ID Proof" and "Qualification Certificate".
 * The image sources are hardcoded for demonstration purposes.
 *
 * @component
 * @returns {JSX.Element} The rendered DocumentView component.
 */
export default function DocumentView() {
  return (
    <div className="flex p-2 gap-4 bg-white dark:bg-neutral-800 rounded-md">
      <div className="grid md:flex mb-6 mt-2 md:w-8/12 gap-8 justify-between">
        <div className="w-60">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Government ID Proof
          </label>
          <div className="w-full h-48 bg-transparent rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-700">
            <img
              src={placeholdr_user}
              alt="Government ID Proof"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        <div className="w-60">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Certificate
          </label>
          <div className="w-full h-48 bg-transparent rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-700">
            <img
              src={placeholdr_user}
              alt="Certificate"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
