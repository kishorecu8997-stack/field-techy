import React from 'react';
import type { InformationCardPropsTools } from './type';
import CategoryTag from './CategoryTag';


/**
 * A reusable card component to display tool information.
 *
 * @param {object} props - The props for the component.
 * @param {string} props.title - The title to be displayed in the card header.
 * @param {string} props.description - The description or label for the category tag.
 * @param {string} props.category - The category of the tool, used by the CategoryTag component.
 * @param {string} [props.className=''] - Optional additional CSS classes to apply to the card container.
 * @returns {React.ReactElement} A React functional component that renders an information card for tools.
 */
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