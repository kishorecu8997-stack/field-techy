import React from "react";
import type { ClientInfoCardProps } from "../types";
import { icons } from "@/config/icons";

/**
 * Displays client profile information including name, location, rating, and verifications.
 *
 * @param props - The component props.
 * @returns Client information sidebar component.
 */
const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  name,
  memberSince,
  location,
  rating,
  reviews,
  verifications,
}) => {
  console.log('verifications :', verifications);
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
        About the Client
      </h2>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-800 dark:text-teal-400 text-xl">
          🏢
        </div>
        <div>
          <div className="font-bold text-gray-900 dark:text-white">{name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Member since {memberSince}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
          <icons.locationDot className="h-4 w-4 flex-shrink-0" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <span>⭐</span>
          <span>
            {rating} • {reviews} Reviews
          </span>
        </div>
      </div>
      {verifications.length ? (
        <>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Client Verification
          </h3>
          <ul className="space-y-1.5">
            {verifications.map((v, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ClientInfoCard;
