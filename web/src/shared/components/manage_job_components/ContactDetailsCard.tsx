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
  engineers?: Contact[];
  onEngineerAssign?: (engineerId: string) => void;
  engineersList?: { id: string; name: string }[]; // List for dropdown
}

const ContactDetailsCard: React.FC<ContactDetailsCardProps> = ({
  client,
  engineers = [],
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

        {engineers && engineers.length > 0 ? (
          engineers.map((engineer, index) => (
            <div key={index} className="flex items-start space-x-3">
              {defaultAvatar}
              <div>
                <p className="text-gray-800 font-medium">{engineer.name}</p>
                <p className="text-gray-600 text-sm">{engineer.email}</p>
                <p className="text-gray-600 text-sm">{engineer.phone}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No engineer assigned</p>
        )}
      </div>
    </div>
  );
};

export default ContactDetailsCard;
