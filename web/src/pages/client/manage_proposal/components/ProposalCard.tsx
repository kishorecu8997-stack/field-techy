import React from 'react';

const ProposalCard: React.FC<EngineerCardProps> = ({ engineer }) => {
  return (
    <div 
      className="p-4 rounded-lg flex items-center gap-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white transition-colors duration-300"
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
          className="mt-2 px-3 py-1 rounded text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
        >
          Invite to Job
        </button>
      </div>
    </div>
  );
};

export default ProposalCard;