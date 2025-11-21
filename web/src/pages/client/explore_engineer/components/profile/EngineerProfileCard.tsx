import React from 'react';
import { assetsConfig } from '@/assets';
import type { ProfileCardProps } from '../../types';
import { Button } from '@/shared/components/commonUI/Buttons';

/**
 * A card component to display a summary of an engineer's profile.
 * It includes their name, photo, rating, job title, and location,
 * along with a button to invite them to a job.
 *
 * @param {object} props - The props for the component.
 * @param {ProfileCardProps['profile']} props.profile - An object containing the engineer's profile details.
 * @param {() => void} props.onInviteClick - Callback function to be executed when the "Invite To Job" button is clicked.
 * @returns {React.ReactElement} A React functional component that renders the engineer's profile card.
 */
const EngineerProfileCard: React.FC<ProfileCardProps> = ({profile, onInviteClick}) => {
  return (
    <div className="bg-emerald-900 dark:bg-emerald-800 rounded-2xl p-6 shadow-lg transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img 
            // src={engineer.imageUrl} 
            src={assetsConfig.images.users.user} 
            alt={profile.name} 
            className="w-24 h-24 rounded-xl object-cover border-2 border-emerald-100/20"
          />
        </div>
        
        {/* Content */}
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-white text-sm">{profile.rating} ({profile.reviewCount} reviews)</span>
          </div>
          
          {/* Job Title */}
          <p className="text-white text-base mb-1">{profile.jobTitle}</p>
          
          {/* Location */}
          <p className="text-white text-sm opacity-80">{profile.location}</p>
        </div>
        
        {/* Button */}
        <div className="flex-shrink-0 mt-4 md:mt-auto">
          <Button 
            onClick={onInviteClick}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-opacity-50"
          >
            Invite To Job
          </Button>
        </div>
      </div>      
    </div>
  );
};
export default EngineerProfileCard;