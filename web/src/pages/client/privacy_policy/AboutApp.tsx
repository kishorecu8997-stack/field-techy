import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useEffect } from "react";
import { scrollToTop } from "@/utils";
import { useGetCmsContent } from "@/shared/apiServices/admin/adminOpenApiService";
import RichTextContent from "@/shared/components/RichTextContent";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * About App page displaying information about the application.
 * Fetches content from CMS API and renders directly with HTML sanitization.
 */
const AboutApp = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  const { data: cmsData, isLoading, error } = useGetCmsContent("about-us");

  if (isLoading) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader title="About App" isShowSort={false} />
          <div className="flex items-center justify-center min-h-[400px]">
            <LoaderComponent />
          </div>
        </div>
      </div>
    );
  }

  if (error || !cmsData || !("type" in cmsData) || cmsData.type !== "page") {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader title="About App" isShowSort={false} />
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-500">Failed to load about information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title={cmsData.data.title || "About App"}
          isShowSort={false}
        />

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

export default AboutApp;
