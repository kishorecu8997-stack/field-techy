// ContactDetailsCard.tsx
import React from "react";

interface Contact {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string; // Optional custom avatar
}

interface ContactDetailsCardProps {
  client?: Contact;
  engineer?: Contact; // Optional — if no engineer assigned yet
  onEngineerAssign?: (engineerId: string) => void;
  engineersList?: { id: string; name: string }[]; // List for dropdown
}

const ContactDetailsCard: React.FC<ContactDetailsCardProps> = ({
  client,
  engineer,
  onEngineerAssign,
  engineersList = [],
}) => {
  const defaultAvatar = (
    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 w-full">
      {/* Client Details */}
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-3">Client Details</h3>
        <div className="flex items-start space-x-3">
          {defaultAvatar}
          <div>
            <p className="text-gray-800 font-medium">{client?.name || "-"}</p>
            <p className="text-gray-600 text-sm">{client?.email || "-"}</p>
            <p className="text-gray-600 text-sm">{client?.phone || "-"}</p>
          </div>
        </div>
      </div>

      {/* Engineer Details */}
      <div className="flex-1 space-y-4">
        <h3 className="font-bold text-lg mb-3">Engineer Details</h3>
        <div className="flex items-start space-x-3">
          {defaultAvatar}
          <div>
            <p className="text-gray-800 font-medium">{engineer?.name || "-"}</p>
            <p className="text-gray-600 text-sm">{engineer?.email || "-"}</p>
            <p className="text-gray-600 text-sm">{engineer?.phone || "-"}</p>
          </div>
        </div>
        <div>
          <select
            onChange={(e) => onEngineerAssign?.(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>
              Assign Engineer
            </option>
            {engineersList.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsCard;
