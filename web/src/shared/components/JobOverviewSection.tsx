import React from "react";
import { Button } from "./commonUI/Buttons";
import type { Attachment, JobOverviewProps } from "./types";

/**
 * Reusable Job Overview Component
 * Displays comprehensive job details including description, skills, work details, and earnings
 *
 * @param {Object} props - The component props.
 * @param {string} props.jobTitle - The title of the job.
 * @param {string} props.jobDescription - The detailed description of the job.
 * @param {string[]} [props.skills] - Optional array of required skills.
 * @param {Array<{name: string; price: string; image?: string}>} [props.tools] - Optional array of tools with prices.
 * @param {string} [props.duration] - Optional job duration (e.g., '3 months').
 * @param {string} [props.engagementModel] - Optional engagement model (e.g., 'Full-time', 'Contract').
 * @param {string} [props.experienceLevel] - Optional experience level required.
 * @param {number} [props.numberOfVacancies] - Optional number of available positions.
 * @param {string} [props.weeklyPay] - Optional weekly payment amount.
 * @param {string} [props.toolAllowance] - Optional tool allowance.
 * @param {string} [props.totalPayment] - Optional total payment amount.
 * @param {string} [props.weeklyPayNote] - Optional note about weekly pay.
 * @param {string[]} [props.additionalDetails] - Optional additional details array.
 * @param {Array<{name: string; url: string} | string>} [props.attachments] - Optional attachments (objects or strings).
 * @returns {JSX.Element} A formatted job overview section with all job details.
 *
 * @example
 * <JobOverviewSection
 *   jobTitle="Senior React Developer"
 *   jobDescription="Build scalable web applications..."
 *   skills={['React', 'TypeScript']}
 *   weeklyPay="$1500"
 * />
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
  weeklyPay,
  toolAllowance,
  totalPayment,
  weeklyPayNote,
  additionalDetails = [],
  attachments = [],
}) => {
  const attachmentItems: Attachment[] = attachments.map((item) =>
    typeof item === "string" ? { name: item, url: "" } : item
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
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
          <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
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
                {tools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2 py-1.5 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600"
                  >
                    {tool.image && (
                      <img
                        src={tool.image}
                        alt={tool.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div className="h-7 w-px bg-gray-200 dark:bg-gray-600" />
                    <div className="space-y-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                        {tool.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {tool.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Work Details Section */}
      {(duration || engagementModel || experienceLevel || numberOfVacancies) && (
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
                  {numberOfVacancies} Engineers
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Earnings Per Engineer Section */}
      {(weeklyPay || toolAllowance || totalPayment) && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Earnings Per Engineer
          </h3>

          <div className="space-y-4">
            {weeklyPay && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Weekly Pay
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {weeklyPay}
                </p>
              </div>
            )}

            {toolAllowance && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Tool Allowance
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {toolAllowance}
                </p>
              </div>
            )}

            {totalPayment && (
              <div className="pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total You'll Receive
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {totalPayment}
                </p>
              </div>
            )}

            {weeklyPayNote && (
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                {weeklyPayNote}
              </p>
            )}
          </div>
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
                    <span aria-hidden>📎</span>
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
                    <span aria-hidden>📎</span>
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
