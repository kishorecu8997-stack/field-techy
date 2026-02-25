import { useState, useMemo, useEffect } from "react";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { scrollToTop } from "@/utils";
import { useGetCmsContent } from "@/shared/apiServices/admin/adminOpenApiService";
import DOMPurify from "dompurify";

interface FAQItem {
  title: string;
  description: string;
}

/**
 * FAQ page displaying FAQs fetched from CMS
 * Uses  UI + Search + Expand functionality
 */
const FAQ = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  const { data: cmsData, isLoading, error } = useGetCmsContent("faq");

  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const faqData: FAQItem[] = useMemo(() => {
    if (!cmsData || !("type" in cmsData) || cmsData.type !== "faq") {
      return [];
    }

    return [...cmsData.data]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((faq) => ({
        title: faq.question,
        description: DOMPurify.sanitize(faq.answer),
      }));
  }, [cmsData]);

  const filteredData = useMemo(() => {
    const searchText = search.toLowerCase();

    return faqData.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(searchText);

      const descriptionMatch = item.description
        ?.toLowerCase()
        .includes(searchText);

      return titleMatch || descriptionMatch;
    });
  }, [faqData, search]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader
            title="FAQ"
            onSortChange={() => {}}
            isShowSort={false}
          />
          <div className="flex justify-center mt-20">
            <p className="text-gray-500">Loading FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader
            title="FAQ"
            onSortChange={() => {}}
            isShowSort={false}
          />
          <div className="flex justify-center mt-20">
            <p className="text-red-500">Failed to load FAQs</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader title="FAQ" onSortChange={() => {}} isShowSort={false} />

        {/* Search */}
        <div className="flex justify-end mt-6 mb-6">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 px-4 py-2 rounded-lg border border-gray-300
            dark:border-gray-600 dark:bg-gray-700 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* FAQ List */}
        {filteredData.length > 0 ? (
          <div className="space-y-4">
            {filteredData.map((item, index) => {
              const itemKey = `${item.title}-${index}`;
              const isExpanded = expandedIndex === itemKey;

              return (
                <div
                  key={itemKey}
                  className="cursor-pointer border-b border-gray-200 dark:border-gray-700 pb-4"
                  onClick={() => setExpandedIndex(isExpanded ? null : itemKey)}
                >
                  <div className="flex justify-between items-center font-medium">
                    <span>{item.title}</span>

                    <span className="text-gray-400 text-xl">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div
                        className="
                        text-sm text-gray-600 dark:text-gray-400
                        prose prose-sm dark:prose-invert      
                        max-w-none
                        break-words
                        overflow-x-hidden
                        w-full
                        "
                        dangerouslySetInnerHTML={{
                          __html: item.description,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No FAQs match your search.</p>
        )}
      </div>
    </div>
  );
};

export default FAQ;
