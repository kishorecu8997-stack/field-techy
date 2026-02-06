import { useState, useMemo, useEffect } from "react";
import { FAQData } from "@/dummy_data/policyDatas";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { scrollToTop } from "@/utils";

/**
 * FAQ page displaying frequently asked questions using static dummy data.
 * Renders a header and content section via reusable components.
 */
const FAQ = () => {
  useEffect(() => {
    scrollToTop();
  }, []);
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const filteredData = useMemo(() => {
    const searchText = search.toLowerCase();

    return FAQData.map((section) => {
      const items = section.items ?? [];

      const filteredItems = items.filter((item) => {
        const titleMatch = item.title
          ? item.title.toLowerCase().includes(searchText)
          : false;

        const descriptionMatch = item.description
          ? item.description.toLowerCase().includes(searchText)
          : false;

        const sectionMatch = section.title.toLowerCase().includes(searchText);

        return titleMatch || descriptionMatch || sectionMatch;
      });
      return {
        ...section,
        items: filteredItems,
      };
    }).filter(
      (section) =>
        section.items.length > 0 ||
        section.title.toLowerCase().includes(searchText),
    );
  }, [search]);
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
          filteredData.map((section, secIndex) => (
            <div key={secIndex} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map((item, index) => {
                  const itemKey = `${secIndex}-${item.title}-${index}`;
                  const isExpanded = expandedIndex === itemKey;
                  return (
                    <div
                      key={itemKey}
                      className="cursor-pointer border-b border-gray-200 dark:border-gray-700 pb-4"
                      onClick={() =>
                        setExpandedIndex(isExpanded ? null : itemKey)
                      }
                    >
                      <div className="flex justify-between items-center font-medium">
                        <span>{item.title || section.title}</span>
                        <span className="text-gray-400 text-xl">
                          {isExpanded ? "−" : "+"}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No FAQs match your search.</p>
        )}
      </div>
    </div>
  );
};

export default FAQ;
