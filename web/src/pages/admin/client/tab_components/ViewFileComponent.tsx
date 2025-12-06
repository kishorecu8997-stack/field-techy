import { assetsConfig } from "@/assets";
import React from "react";
import { IoClose } from "react-icons/io5";

interface ViewFileComponentProps {
  onClose: () => void;
  title?: string;
}

const ViewFileComponent: React.FC<ViewFileComponentProps> = ({
  onClose,
  title = "View File",
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-4">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
        <IoClose
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-7 w-7 cursor-pointer"
          onClick={onClose}
        />
      </div>

      {/* File preview area */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          {/* Image placeholder icon */}
          <div className="text-gray-400 dark:text-gray-500">
            <img
              src={assetsConfig.placeholder}
              alt="Document Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFileComponent;
