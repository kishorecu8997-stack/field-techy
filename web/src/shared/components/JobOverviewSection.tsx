import React from "react";
import { IoAttach } from "react-icons/io5";
import { Button } from "./commonUI/Buttons";
import type { Attachment, JobOverviewProps } from "./types";
import { FaFilePdf } from "react-icons/fa";

/**
 * Helper function to check if a URL points to a PDF file
 */
const isPdfFile = (url: string): boolean => {
  return (
    url?.toLowerCase().endsWith(".pdf") ||
    url?.includes(".pdf?") ||
    url?.includes("%2Epdf")
  );
};

/**
 * Formats a price string with comma separators while preserving the currency symbol/unit
 * @param price - The price string (e.g., "₹1000", "$500", "1000")
 * @param unit - Optional unit/currency to display (e.g., "INR", "USD")
 * @returns Formatted price with comma separators (e.g., "₹ 1,000", "$ 5,000", "INR 1,000")
 */
const formatPriceWithComma = (
  price: string | undefined,
  unit?: string,
): string => {
  if (!price) return "";

  // If unit is provided separately, use it - place currency symbol first
  if (unit) {
    // Extract numeric part from price
    const numericPart = price.replace(/[^0-9.]/g, "");
    if (!numericPart) return price;

    const number = parseFloat(numericPart);
    if (isNaN(number)) return price;

    const formattedNumber = number.toLocaleString("en-US");
    return `${unit} ${formattedNumber}`;
  }

  // Extract currency symbol/unit from the beginning of the string
  const currencyMatch = price.match(/^[₹$€£¥A-Z]+/i);
  const currencySymbol = currencyMatch ? currencyMatch[0] : "";

  // Extract numeric part
  const numericPart = price.replace(/^[₹$€£¥A-Z]+/i, "").trim();

  // If no numeric part, return original
  if (!numericPart) return price;

  // Parse the number and format with commas
  const number = parseFloat(numericPart.replace(/,/g, ""));
  if (isNaN(number)) return price;

  // Format with comma separators
  const formattedNumber = number.toLocaleString("en-US");

  // Return with currency symbol (add space between if symbol exists)
  return currencySymbol
    ? `${currencySymbol} ${formattedNumber}`
    : formattedNumber;
};

/**
 * Displays comprehensive job details with skills, tools, earnings, and attachments.
 * Renders job title, description, required skills, tools with pricing, duration,
 * engagement model, experience level, vacancies, weekly/total pay, and additional details.
 * @param {JobOverviewProps} props - Job details including title, description, skills, tools, earnings info, and optional attachments.
 * @returns {JSX.Element} Formatted job overview section with all job information displayed.
 */

const JobOverviewSection: React.FC<JobOverviewProps> = ({
  jobTitle,
  jobDescription,
  skills = [],
  tools = [],
  duration,
  engagementModel,
  experienceLevel,
  numberOfVacancies,
  totalPayment,
  // engineerEarnings,
  additionalDetails = [],
  attachments = [],
  userType = "client",
}) => {
  const attachmentItems: Attachment[] = attachments.map((item) =>
    typeof item === "string" ? { name: item, url: "" } : item,
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Job Details Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Job Details
        </h3>

        {/* Job Title */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Job Title
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {jobTitle}
          </p>
        </div>

        {/* Job Description */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Job Description
          </p>
          <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {jobDescription}
          </p>
        </div>
      </div>

      {/* Skills and Tools Section */}
      {(skills.length > 0 || tools.length > 0) && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Skills And Tools
          </h3>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-gray-900 dark:text-white text-sm rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          {tools.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tools
              </p>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool, idx) => {
                  const toolImage = tool.image || tool.imageUrl;
                  const isPdf = toolImage ? isPdfFile(toolImage) : false;

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-2 py-1.5 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600"
                    >
                      {toolImage && (
                        <>
                          {isPdf ? (
                            <a
                              href={toolImage}
                              target="_blank"
                              rel="noreferrer"
                              className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700"
                              title="View PDF"
                            >
                              <FaFilePdf className="w-6 h-6" />
                            </a>
                          ) : (
                            <a
                              href={toolImage}
                              target="_blank"
                              rel="noreferrer"
                              className="w-8 h-8 flex-shrink-0"
                            >
                              <img
                                src={toolImage}
                                alt={tool.name}
                                className="w-8 h-8 object-contain"
                              />
                            </a>
                          )}
                          <div className="h-7 w-px bg-gray-200 dark:bg-gray-600" />
                        </>
                      )}
                      <div className="space-y-0 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug truncate">
                          {tool.name}
                        </p>
                        {(tool.price || tool.engineerPrice) && (
                          <div className="flex flex-wrap gap-x-2 text-xs">
                            {tool.price && (
                              <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Price: </span>{" "}
                                {formatPriceWithComma(tool.price, tool.unit)}
                              </p>
                            )}
                            {tool.engineerPrice && (
                              <p className="text-green-600 dark:text-green-400">
                                <span className="font-medium">:</span>{" "}
                                {formatPriceWithComma(
                                  tool.engineerPrice,
                                  tool.unit,
                                )}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Work Details Section */}
      {(duration ||
        engagementModel ||
        experienceLevel ||
        numberOfVacancies) && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Work Details
          </h3>

          <div className="space-y-4">
            {duration && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Duration
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {duration}
                </p>
              </div>
            )}

            {engagementModel && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Engagement Model
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {engagementModel}
                </p>
              </div>
            )}

            {experienceLevel && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Engineer Experience Level
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {experienceLevel}
                </p>
              </div>
            )}

            {numberOfVacancies && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Number of Vacancies
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {numberOfVacancies === 1
                    ? "1 Engineer"
                    : `${numberOfVacancies} Engineers`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {userType === "engineer" && totalPayment && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          {totalPayment && (
            <div className="pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Amount
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {formatPriceWithComma(totalPayment)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Total Cost Section - Only show for clients */}
      {userType === "client" && totalPayment && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Total Cost
          </h3>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {formatPriceWithComma(totalPayment)}
          </p>
        </div>
      )}

      {/* Additional Details and Attachments Section */}
      {(additionalDetails.length > 0 || attachments.length > 0) && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Additional Details And Attachments
          </h3>

          {/* Additional Details */}
          {additionalDetails.length > 0 && (
            <div className="mb-4">
              <ul className="space-y-2">
                {additionalDetails.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-gray-900 dark:text-white font-bold">
                      •
                    </span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Attachments */}
          {attachmentItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachmentItems.map((attachment, idx) => {
                const hasUrl = attachment.url && attachment.url.trim() !== "";
                return hasUrl ? (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <IoAttach
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate max-w-xs">{attachment.name}</span>
                  </a>
                ) : (
                  <Button
                    key={idx}
                    variant="no_style"
                    type="button"
                    disabled
                    title="Attachment URL not available"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg text-sm cursor-not-allowed opacity-60"
                  >
                    <IoAttach
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate max-w-xs">{attachment.name}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobOverviewSection;
