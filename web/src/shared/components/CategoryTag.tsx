import React from 'react';
import type { CategoryTagProps } from './type';

/**
 * A component to display a list of categories as tags, with an optional label.
 *
 * @param {object} props - The props for the component.
 * @param {string[]} props.category - An array of strings, where each string is a category to be displayed as a tag.
 * @param {string} [props.label] - An optional label to display above the tags.
 * @param {boolean} [props.isShowLabel=true] - Whether to show the label. Defaults to true.
 * @param {boolean} [props.required] - If not explicitly false, displays a red asterisk next to the label to indicate it's a required field.
 * @returns {React.ReactElement} A React functional component that renders a set of category tags.
 */
const CategoryTag: React.FC<CategoryTagProps> = ({  category, label, isShowLabel=true, required }) => {
  return (    
    <div className="mb-6">
      {isShowLabel && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label}{" "}
          {required !== false && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-2 pt-2">
        {category.map((item, index) => (  // Fixed: removed extra parenthesis, and better to use 'index' than 'id' for array index
          <span 
            key={index} 
            className="px-4 py-2 bg-teal-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-full border border-gray-300 dark:border-gray-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>    
  );
};

export default CategoryTag;