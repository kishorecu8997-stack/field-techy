import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { icons } from "@/config/icons";
import breakData from "@/dummy_data/break.json";

export const DURATION_TYPES = ["Short", "Long"] as const;
export const STATUS_TYPES = [
  "Pending",
  "Approved",
  "Active",
  "Rejected",
] as const;

type DurationType = (typeof DURATION_TYPES)[number];
type StatusType = (typeof STATUS_TYPES)[number];

type RawBreak = {
  id: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  duration: string;
  type: DurationType;
  status: StatusType;
};
/**
 * StatusLegendItem
 *
 * Small component to display a single status in the legend with icon and label.
 *
 * @component
 * @param {React.ComponentType<any>} Icon - Icon component to display
 * @param {string} label - Status label text
 * @param {string} iconColor - Tailwind CSS color class for the icon
 * @param {string} textColor - Tailwind CSS color class for the text
 * @returns {JSX.Element} Rendered status legend item
 */
interface StatusLegendItemProps {
  Icon: React.ComponentType<any>;
  label: string;
  textColor: string;
  iconColor: string;
}

const StatusLegendItem: React.FC<StatusLegendItemProps> = ({
  Icon,
  label,
  textColor,
  iconColor,
}) => (
  <div className="flex items-center gap-3">
    <Icon className={`text-2xl ${iconColor}`} />
    <span className={`font-bold ${textColor}`}>{label}</span>
  </div>
);

/**
 * BreakCalendar
 *
 * Displays employee break requests in a month-view calendar using FullCalendar.
 *
 * Features:
 * - Month-only view (`dayGridMonth`)
 * - Color-coded statuses: Pending (Amber), Approved (Green), Active (Blue), Rejected (Red)
 * - Long breaks span multiple days; short breaks display start and end times
 * - Weekend highlighting for better readability
 * - Event tooltip shows status and duration/time
 * - Status legend with icons below the calendar
 *
 * @component
 * @returns {JSX.Element} Rendered break calendar
 */
const BreakCalendar: React.FC = () => {
  const statusConfig = {
    Pending: {
      Icon: icons.pending,
      bg: "#fef3c7",
      border: "#f59e0b",
      text: "#92400e",
      label: "Pending",
      iconColor: "text-amber-600",
      textColor: "text-amber-800",
    },
    Approved: {
      Icon: icons.check,
      bg: "#d1fae5",
      border: "#10b981",
      text: "#065f46",
      label: "Approved",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
    Active: {
      Icon: icons.active,
      bg: "#dbeafe",
      border: "#3b82f6",
      text: "#1e40af",
      label: "Active",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
    Rejected: {
      Icon: icons.close,
      bg: "#fee2e2",
      border: "#f87171",
      text: "#b91c1c",
      label: "Rejected",
      iconColor: "text-red-600",
      textColor: "text-red-800",
    },
  };

  const events = (breakData as RawBreak[]).map((brk) => {
    const config = statusConfig[brk.status];

    if (brk.type === "Long") {
      const endDate = new Date(brk.endDate);
      endDate.setDate(endDate.getDate() + 1);
      return {
        id: brk.id,
        title: `${config.label} - ${brk.duration}`,
        start: brk.startDate,
        end: endDate.toISOString().split("T")[0],
        allDay: true,
        backgroundColor: config.bg,
        borderColor: config.border,
        textColor: config.text,
        extendedProps: { Icon: config.Icon },
      };
    }

    return {
      id: brk.id,
      title: `${config.label} (${brk.startTime} - ${brk.endTime})`,
      start: brk.startDate,
      end: brk.startDate,
      allDay: true,
      backgroundColor: config.bg,
      borderColor: config.border,
      textColor: config.text,
      extendedProps: { Icon: config.Icon },
    };
  });

  const statusArray = Object.values(statusConfig);

  return (
    <div className="py-5 px-4">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
        <div className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            height="600px"
            events={events}
            dayCellClassNames={(arg) =>
              arg.date.getDay() === 0 || arg.date.getDay() === 6
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
            }
            eventContent={(arg) => {
              const IconComponent = (
                arg.event.extendedProps as { Icon: React.ComponentType<any> }
              ).Icon;
              return (
                <div className="flex justify-center items-center h-full w-full">
                  <IconComponent className="text-xl" />
                </div>
              );
            }}
            eventDidMount={(info) => {
              info.el.setAttribute("title", info.event.title);
            }}
          />
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {statusArray.map((status) => (
              <StatusLegendItem
                key={status.label}
                Icon={status.Icon}
                label={status.label}
                iconColor={status.iconColor}
                textColor={status.textColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakCalendar;
