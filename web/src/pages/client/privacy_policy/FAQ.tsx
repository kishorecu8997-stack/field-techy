import { useState, useMemo, useEffect } from "react";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { scrollToTop } from "@/utils";
import { useGetCmsContent } from "@/shared/apiServices/admin/adminOpenApiService";
import DOMPurify from "dompurify";

/**
 * FAQ page component that displays frequently asked questions fetched from CMS.
 *
 * Features:
 * - Scrolls to top on mount
 * - Fetches FAQ content using CMS API (slug: "faq")
 * - Search/filter functionality across questions and answers
 * - Accordion-style expandable answers
 * - Sanitizes HTML content with DOMPurify to prevent XSS
 * - Handles loading and error states
 * - Responsive design with dark mode support
 *
 * @component
 * @example
 * <FAQ />
 */
const FAQ = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  const {
    data: cmsData,
    isLoading,
    error,
  } = useGetCmsContent("faq", {
    enabled: true,
    refetchInterval: () =>
      document.visibilityState === "visible" ? 15000 : false,
  });

  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqData = useMemo(() => {
    if (!cmsData || cmsData.type !== "faq") return [];

    return cmsData.data
      .slice()
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((faq) => ({
        id: faq.id,
        title: faq.question,
        description: DOMPurify.sanitize(faq.answer),
        sortOrder: faq.sortOrder,
      }));
  }, [cmsData]);
  const filteredData = useMemo(() => {
    const searchText = search.toLowerCase();

    return faqData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText),
    );
  }, [faqData, search]);

  if (isLoading) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
            {filteredData.map((item) => {
              const itemKey = item.id;
              const isExpanded = expandedIndex === itemKey;

              return (
                <div
                  key={itemKey}
                  onClick={() => setExpandedIndex(isExpanded ? null : itemKey)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer transition"
                >
                  {/* Question */}
                  <div className="flex justify-between items-center p-6 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <span>{item.title}</span>

                    <span className="text-gray-400 text-xl">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>

                  {/* Answer */}
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div
                        className="
    prose 
    prose-lg 
    dark:prose-invert 
    max-w-none

    [&_ul]:list-disc
    [&_ul]:pl-6
    [&_ol]:list-decimal
    [&_ol]:pl-6
    [&_li]:mb-1

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
