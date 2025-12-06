import type { Project } from "../types";
import { IoCalendarOutline } from "react-icons/io5";
import { TbCash } from "react-icons/tb";
import { TiDocumentText } from "react-icons/ti";

interface ProjectCardProps {
  project: Project;
}

/**
 * `ProjectCard` component displays a summary of a single project.
 * It shows title, ID, type, budget, duration, and work mode.
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  if (!project) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-yellow-600 dark:text-yellow-400";
      case "Completed":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getWorkModeColor = (workMode: string) => {
    return workMode.toLowerCase().includes("remote")
      ? "bg-indigo-600 text-white"
      : "bg-blue-600 text-white";
  };

  // Format duration as "DD/MM/YYYY – DD/MM/YYYY"
  const formatDuration = () => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB");
    };
    return `${formatDate(project.duration.start)} – ${formatDate(
      project.duration.end
    )}`;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium ${getWorkModeColor(
            project.workMode
          )}`}
        >
          {project.workMode}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-sm font-semibold dark:text-gray-400 mt-1 items-center">
          <span className="text-emerald-900 font-semibold mr-1">ID:</span>
          {project.id}
        </p>
        <span
          className={`text-xs font-medium ${getStatusColor(project.status)}`}
        >
          {project.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm  dark:text-gray-300">
          <TiDocumentText className="text-emerald-900 font-semibold text-lg mr-1" />
          {project.type}
        </div>
        <div className="flex items-center text-sm  dark:text-gray-300">
          <TbCash className="text-emerald-900 font-semibold text-lg mr-1" />
          {project.budget}
        </div>
        <div className="flex items-center text-sm  dark:text-gray-300">
          <IoCalendarOutline className="text-emerald-900 font-semibold text-lg mr-1" />
          <span>{formatDuration()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;