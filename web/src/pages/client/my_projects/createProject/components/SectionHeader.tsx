/**
 * SectionHeader
 *
 * Small presentational component that renders a section title with a horizontal divider.
 * Intended for use inside multi-section forms or pages to visually separate sections.
 *
 * Props:
 * - `title` (string): The heading text displayed at the start of the section.
 *
 * @component
 * @param {{ title: string }} props
 * @returns {JSX.Element} A section header with title and divider
 */
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center w-full">
      <h2 className="text-lg font-bold text-teal-900 dark:text-teal-500 mr-3">
        {title}
      </h2>
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>
  );
}

export default SectionHeader;
