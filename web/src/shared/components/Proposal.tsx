import React from "react";
import type { ProposalTermsProps } from "../../pages/my_job/types";

/**
 * Main component for rendering proposal terms and conditions.
 *
 * @param {ProposalTermsProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const Proposal: React.FC<ProposalTermsProps> = ({
  jobTitle,
  terms,
  element,
}) => {
  return (
    <section className="p-4" aria-labelledby="proposal-title">
      <h2 id="proposal-title" className="text-xl font-bold mb-4 text-gray-800">
        {jobTitle || "Proposal Terms"}
      </h2>
      <div className="bg-gray-100 p-5 rounded-md">
        {terms.title && (
          <h3 className="font-semibold text-gray-700 mb-3">{terms.title}</h3>
        )}
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {terms.items.map((item, index) => (
            <li key={index}>
              {item.text}
              {item.subItems && item.subItems.length > 0 && (
                <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-700">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>{subItem}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        {element}
      </div>
    </section>
  );
};

export default Proposal;
