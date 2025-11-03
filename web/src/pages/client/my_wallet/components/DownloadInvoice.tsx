import React from 'react';
import { GoDownload } from "react-icons/go";
import { IoCloseSharp } from 'react-icons/io5';
import type { DownloadInvoiceModalProps } from '../types';


const DownloadInvoiceModal: React.FC<DownloadInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onDownload 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl transform transition-all">
        {/* Modal Content */}
        <div className="bg-white dark:bg-gray-900 p-6 relative">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <IoCloseSharp className="h-6 w-6 cursor-pointer" />
          </button>

          {/* Header with Question Mark Icon */}
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-700 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.858-2.292c-1.35-1.102-2.515-2.37-2.515-3.822V12a9.863 9.863 0 01-2.515-3.822C3.935 6.86 4.03 4.418 8 4h8c3.97 0 4.03 2.418 4.03 3.822c0 1.452-1.165 2.72-2.515 3.822C16.03 12.86 16 14.418 16 16v1.5a2.5 2.5 0 005 0V16c0-1.105-.895-2-2-2z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Download Invoice?
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Do You Want to Download Invoice as PDF Document?
          </p>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <GoDownload className="mr-1"/>
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadInvoiceModal;