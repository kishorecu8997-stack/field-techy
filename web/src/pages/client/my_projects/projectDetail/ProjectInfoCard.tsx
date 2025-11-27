import type { Project } from "../types";
import dayjs from "dayjs";

export default function ProjectInfoCard({
  projectDetails,
}: {
  projectDetails: Project | undefined;
}) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 dark:text-white rounded-xl p-4 shadow-sm my-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Info</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex items-start">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong>On-site Countries:</strong>{" "}
            {projectDetails?.onSiteCountries?.join(", ")}
          </span>
        </li>
        <li className="flex items-start">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong>Remote Countries:</strong>{" "}
            {projectDetails?.remoteCountries?.join(", ")}
          </span>
        </li>
        <li className="flex items-start">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong>Created On:</strong>{" "}
            {dayjs(projectDetails?.createdAt).format("DD-MM-YYYY")}
          </span>
        </li>
        <li className="flex items-start">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="pr-1">Tentative Start Date:</strong>
            {projectDetails?.duration.start}
          </span>
        </li>
        <li className="flex items-start">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong className="pr-1">Tentative End Date:</strong>{" "}
            {projectDetails?.duration.end}
          </span>
        </li>
        <li className="flex items-start">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong>Budget:</strong> {projectDetails?.budget}{" "}
            <span>({projectDetails?.purchaseOrder})</span>
          </span>
        </li>
        <li className="flex items-start">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong>Job Type:</strong>
            {projectDetails && projectDetails?.jobTypeDetails.type}
            {projectDetails?.jobTypeDetails.hours}
          </span>
        </li>
        <li className="flex items-start">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2"></span>
          <span>
            <strong>Description:</strong> {projectDetails?.description}
          </span>
        </li>
      </ul>
    </div>
  );
}
