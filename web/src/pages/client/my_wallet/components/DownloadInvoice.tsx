import React from 'react';
import { GoDownload } from "react-icons/go";
import { IoCloseSharp } from 'react-icons/io5';
import type { DownloadInvoiceModalProps } from '../types';
import { Button } from '@/shared/components/commonUI/Buttons';
import question_icon from '@/assets/gif-file/question_icon.gif';


const DownloadInvoice: React.FC<DownloadInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onDownload 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          <div className="flex justify-center mb-4 ">           
            <img
              src={question_icon}
              alt="question icon"
              className="h-12 w-12 text-emerald-700 dark:text-emerald-500"
            />
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
          <Button
            onClick={onDownload}
            leftIcon={<GoDownload className="h-6 w-6" />}
            className="cursor-pointer w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadInvoice;