import { useState } from "react";
import { FAQData } from "@/dummy_data/policyDatas";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import ContentPage from "./ContentPage";

/**
 * FAQ page displaying frequently asked questions using static dummy data.
 * Renders a header and content section via reusable components.
 */
const FAQ = () => {
  const [search, setSearch] = useState(""); // For search input
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredData = FAQData.map((section) => ({
  ...section,
  items: section.items
    ? section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      )
    : [], // If items is undefined, return empty array
})).filter((section) => section.items && section.items.length > 0);

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader title="FAQ" onSortChange={() => {}} isShowSort={false} />
        {/* Search Bar */}
        <div className="flex gap-2 flex-1 md:justify-end md:flex-none mb-4">
  <input
    type="text"
    placeholder="Search FAQs..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 mt-10"
  />
</div>
        {/* FAQ List */}
        {filteredData.length > 0 ? (
          filteredData.map((section, secIndex) => (
            <div key={secIndex} className="mb-6">
              <h2 className="font-semibold text-lg mb-2">{section.title}</h2>
              <div className="space-y-2">
                {section.items.map((item, index) => {
                  const globalIndex = secIndex * 100 + index; // Unique index for expand/collapse
                  const isExpanded = expandedIndex === globalIndex;
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-3 cursor-pointer bg-white dark:bg-gray-800"
                      onClick={() =>
                        setExpandedIndex(isExpanded ? null : globalIndex)
                      }
                    >
                      <div className="font-medium">{item.title || "Question"}</div>
                      {isExpanded && (
                        <div className="mt-2 text-gray-700 dark:text-gray-300">
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
          <div className="text-gray-500">No FAQs match your search.</div>
        )}
      </div>
    </div>
  );
};


export default FAQ;
