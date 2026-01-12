import React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold uppercase mb-4 pb-2 border-b text-gray-600 border-gray-200 dark:text-gray-300 dark:border-gray-700">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default FormSection;
