import type { Project } from "../types";
import dayjs from "dayjs";

/**
 * ProjectInfoCard
 *
 * Displays summary information about a project in a compact card layout.
 *
 * Props:
 * - `projectDetails` (Project | undefined): The project object containing
 *   metadata such as countries, duration, budget, job type and description.
 *
 * Behavior:
 * - Formats the `createdAt` date using `dayjs`.
 * - Gracefully handles `undefined` project data by using optional chaining.
 *
 * Example:
 * ```tsx
 * <ProjectInfoCard projectDetails={project} />
 * ```
 *
 * @param {{ projectDetails: Project | undefined }} props Component props
 * @returns {JSX.Element} A styled card with project metadata
 */
export default function ProjectInfoCard({
  projectDetails,
}: {
  projectDetails: Project | undefined;
}) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 dark:text-white rounded-xl p-4 shadow-sm my-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Project Info
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex items-start dark:text-gray-400">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="dark:text-gray-300">On-site Countries:</strong>{" "}
            {projectDetails?.onSiteCountries?.join(", ")}
          </span>
        </li>
        <li className="flex items-start dark:text-gray-400">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="dark:text-gray-300">Remote Countries:</strong>{" "}
            {projectDetails?.remoteCountries?.join(", ")}
          </span>
        </li>
        <li className="flex items-start dark:text-gray-400">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="dark:text-gray-300">Created On:</strong>{" "}
            {dayjs(projectDetails?.createdAt).format("DD-MM-YYYY")}
          </span>
        </li>
        <li className="flex items-start dark:text-gray-400">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="pr-1 dark:text-gray-300">
              Tentative Start Date:
            </strong>
            {projectDetails?.duration.start}
          </span>
        </li>
        <li className="flex items-start dark:text-gray-400">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="pr-1 dark:text-gray-300">
              Tentative End Date:
            </strong>{" "}
            {projectDetails?.duration.end}
          </span>
        </li>
        <li className="flex items-start dark:text-gray-400">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="dark:text-gray-300">Budget:</strong>{" "}
            {projectDetails?.budget}{" "}
            <span>({projectDetails?.purchaseOrder})</span>
          </span>
        </li>
        <li className="flex items-start dark:text-gray-400">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="dark:text-gray-300">Job Type:</strong>
            {projectDetails && projectDetails?.jobTypeDetails.type}
            {projectDetails?.jobTypeDetails.hours}
          </span>
        </li>
        <li className="flex items-start dark:text-gray-400">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="dark:text-gray-300">Description:</strong>{" "}
            {projectDetails?.description}
          </span>
        </li>
      </ul>
    </div>
  );
}
