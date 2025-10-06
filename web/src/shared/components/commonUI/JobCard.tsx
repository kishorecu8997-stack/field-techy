// src/components/JobCard.tsx
import { urls } from '@/config/urls';
import { Link } from 'react-router-dom';

interface JobCardProps {
  id: string;
  title: string;
  client: string;
  startDate: string;
  duration: string;
  location: string;
  pay: string;
  status: 'Completed' | 'Applied' | 'In-Progress';
  type: 'On Site' | 'Remote';
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  client,
  startDate,
  duration,
  location,
  pay,
  status,
  type,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Applied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'In-Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = () => {
    return type === 'On Site'
      ? 'bg-teal-800 text-white dark:bg-teal-700'
      : 'bg-purple-600 text-white dark:bg-purple-700';
  };

  return (
    <Link
      to={`${urls.home.my_jobs}/${id}`}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      {/* Header: Title + Type */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{title}</h3>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
          {type}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <p><span className="font-medium">Client:</span> {client}</p>
        <p><span className="font-medium">Start:</span> {startDate}</p>
        <p><span className="font-medium">Duration:</span> {duration}</p>
      </div>

      {/* Footer: Location + Pay */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.995 1.995 0 01-2.828 0l-4.244-4.244a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-800 dark:text-teal-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{pay}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-3">
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {status}
        </span>
      </div>
    </Link>
  );
};

export default JobCard;