import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { useGetCmsContent } from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * Privacy Policy page that conditionally renders a header based on route context.
 * Displays static privacy policy content from CMS.
 */
const PolicyPage = () => {
  const location = useLocation();
  const {
    data: cmsData,
    isLoading,
    error,
  } = useGetCmsContent("customer-privacy-policy");

  if (isLoading) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          {!location.pathname.includes("/auth") && (
            <MyJobsHeader
              title="Privacy Policy"
              onSortChange={() => {}}
              isShowSort={false}
            />
          )}
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500">Loading privacy policy...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cmsData || !("type" in cmsData) || cmsData.type !== "page") {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          {!location.pathname.includes("/auth") && (
            <MyJobsHeader
              title="Privacy Policy"
              onSortChange={() => {}}
              isShowSort={false}
            />
          )}
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-500">Failed to load privacy policy</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        {!location.pathname.includes("/auth") && (
          <MyJobsHeader
            title={cmsData.data.title || "Privacy Policy"}
            onSortChange={() => {}}
            isShowSort={false}
          />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div
            className="text-wrap break-words whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(cmsData.data.content),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
