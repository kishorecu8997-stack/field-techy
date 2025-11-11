import React, { useState } from 'react';

/**
 * Simple Accordion component
 */
export const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-3 text-lg font-semibold text-gray-800"
      >
        {title}
        <span>{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};
