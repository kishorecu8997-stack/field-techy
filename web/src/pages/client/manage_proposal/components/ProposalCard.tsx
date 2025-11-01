import React from 'react';


/**
 * `ProposalCard` displays information about an engineer who has submitted a proposal.
 * It shows the engineer's profile picture, name, rating, and title.
 * It includes a button to invite the engineer to the job.
 * The card supports both light and dark themes.
 * 
 * @param {EngineerCardProps} props The properties for the component.
 * @param {object} props.engineer An object containing the engineer's details.
 * @param {boolean} props.isDarkMode A flag to determine if the card should render in dark mode.
 */
const ProposalCard: React.FC<EngineerCardProps> = ({ engineer, isDarkMode }) => {
  return (
    <div 
      className={`p-4 rounded-lg flex items-center gap-4 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
      } transition-colors duration-300`}
    >
      <img 
        src={engineer.imageUrl} 
        alt={engineer.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="font-bold text-lg">{engineer.name}</h3>
        <div className="flex items-center gap-1 text-sm mb-1">
          <span className="text-yellow-500">★</span>
          <span>{engineer.rating} ({engineer.reviewCount} reviews)</span>
        </div>
        <p className="text-sm font-medium">{engineer.title}</p>
        <button 
          className={`mt-2 px-3 py-1 rounded text-sm font-medium ${
            isDarkMode 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          } transition-colors`}
        >
          Invite to Job
        </button>
      </div>
    </div>
  );
};

export default ProposalCard;