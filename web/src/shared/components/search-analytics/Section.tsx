import React from "react";

/**
 * Section Component
 * 
 * Wrapper component for a section of the analytics page.
 * Displays a title and its children content (cards, rows, tables, etc.).
 *
 * @param {string} title - The title of the section.
 * @param {React.ReactNode} children - The content inside the section.
 * 
 * @example
 * <Section title="Most Searched Keywords">
 *   <KeywordRow keyword="React" count={120} total={1000} />
 * </Section>
 */

interface Props {
  title: string;
  children: React.ReactNode;
  titleClassName?: string;
  className?: string;
}

const Section: React.FC<Props> = ({ title, children, titleClassName, className }) => (
  <div className={`mb-8 ${className}`}>
    <h4 className={`text-lg font-semibold p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${titleClassName}`}>
      {title}
    </h4>
    <div>{children}</div>
  </div>
);

export default Section;
