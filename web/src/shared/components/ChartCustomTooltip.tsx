import React from "react";

/**
 * Props for the custom chart tooltip used by Recharts.
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string | number;
    value: string | number | Array<string | number>;
    color?: string;
    [key: string]: unknown;
  }>;
  label?: string | number;
}

/**
 * CustomTooltip
 *
 * A simple styled tooltip to render inside Recharts' <Tooltip />. It expects
 * the payload array from Recharts and renders the first entry's name, value
 * and color swatch. Returns null when not active or when payload is empty.
 *
 * @param {CustomTooltipProps} props
 * @returns {JSX.Element | null}
 */
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload?.length) return null;

  const { name, value, color } = payload[0];

  return (
    <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700 text-sm">
      <div className="font-semibold mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2.5 h-2.5 rounded-sm"
          style={{ backgroundColor: color || "#999" }}
        />
        <span>
          {name}: {value}
        </span>
      </div>
    </div>
  );
};

export default CustomTooltip;
