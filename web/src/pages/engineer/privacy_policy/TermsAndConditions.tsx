import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useLocation } from "react-router-dom";
import { useGetCmsContent } from "@/shared/apiServices/admin/adminOpenApiService";
import RichTextContent from "@/shared/components/RichTextContent";

const TermsAndConditionsPage = () => {
  const location = useLocation();
  const { data: cmsData, isLoading, error } = useGetCmsContent("terms");

  if (isLoading) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          {!location.pathname.includes("/auth") && (
            <MyJobsHeader
              title="Terms & Conditions"
              onSortChange={() => {}}
              isShowSort={false}
            />
          )}
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500">Loading terms and conditions...</p>
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
              title="Terms & Conditions"
              onSortChange={() => {}}
              isShowSort={false}
            />
          )}
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-500">Failed to load terms and conditions</p>
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
            title={cmsData.data.title || "terms and conditions"}
            onSortChange={() => {}}
            isShowSort={false}
          />
        )}

        {/* Render HTML content directly */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <RichTextContent html={cmsData.data.content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
