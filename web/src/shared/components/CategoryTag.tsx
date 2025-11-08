import React from 'react';

interface CategoryTagProps {
  category: string[]; 
  label?: string;  
  isShowLabel?: boolean;
  required?: boolean;
}

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
            className="px-4 py-2 bg-green-75 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-full border border-gray-300 dark:border-gray-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>    
  );
};

export default CategoryTag;