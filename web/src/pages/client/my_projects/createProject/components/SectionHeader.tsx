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
