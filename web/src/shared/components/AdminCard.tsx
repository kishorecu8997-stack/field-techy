// StatCardWithImageIcon.tsx
import { assetsConfig } from "@/assets";
import React from "react";

/**
 * Props for the StatCard component.
 *
 * @typedef {Object} StatCardProps
 * @property {string} title - The title/label shown on the card.
 * @property {number | string} value - The numeric or textual value to display.
 * @property {string} [iconSrc] - Optional image source to override the default icon.
 * @property {string} [alt] - Alt text for the icon image.
 * @property {string} [className] - Additional CSS class names to apply to the card container.
 */
interface StatCardProps {
  title: string;
  value: number | string;
  iconSrc?: string;
  alt?: string;
  className?: string;
}

/**
 * StatCard (AdminCard) component.
 *
 * Renders a small statistic card with an icon, title and value. The
 * default icon comes from `assetsConfig.admin.adminCard` but can be
 * overridden via the `iconSrc` prop. Designed for use across admin dashboard
 * sections to display concise metrics.
 *
 * @param {StatCardProps} props - Component props
 * @returns {JSX.Element} Rendered statistic card
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  alt = "Icon",
  className = "",
}) => {
  return (
    <div
      className={`rounded-lg p-2 flex items-center gap-2 w-full ${className}`}
      style={{
        background:
          "linear-gradient(to right, #034645 0%, #034645 85%, #375e43 120%)",
      }}
    >
      <div className="rounded-full p-2">
        <img
          src={`${assetsConfig.admin.adminCard}`}
          alt={alt}
          className="w-8 h-8 md:w-11 md:h-11 object-contain"
        />
      </div>

      <div>
        <p className="text-sm md:text-md text-white">{title}</p>
        <p className="text-sm md:text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
