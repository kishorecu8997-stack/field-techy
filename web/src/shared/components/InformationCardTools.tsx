import React from 'react';
import type { InformationCardPropsTools } from './type';
import CategoryTag from './CategoryTag';


const InformationCardTools: React.FC<InformationCardPropsTools> = ({ 
  title, 
  description,
  category, 
  className = '' 
}) => {
  return (
    <div 
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 ${className}`}
    >
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 ">        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      </div>      
      {/* Details Section */}
      <div className="px-4 py-3 space-y-2">        
                <CategoryTag
                  category={category}
                  label={description}
                  isShowLabel
                  required
                />
      </div>
    </div>
  );
};

export default InformationCardTools;