import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { icons } from "@/config/icons";

export const DURATION_TYPES = ["short_term", "long_term"] as const;
export const STATUS_TYPES = ["pending", "approved", "rejected"] as const;

type DurationType = (typeof DURATION_TYPES)[number];
type StatusType = (typeof STATUS_TYPES)[number];

// API types for break requests from GetJobLogsResponse
type ApiBreakRequest = {
  id: number;
  assignmentId: number;
  type: DurationType;
  status: StatusType;
  reason: string;
  startAt: string;
  endAt: string;
  approverComment?: string | null;
  createdAt: string | null;
};

interface BreakCalendarProps {
  breakRequests?: ApiBreakRequest[];
}

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
 * - Color-coded statuses: Pending (Amber), Approved (Green), Rejected (Red)
 * - Long breaks span multiple days; short breaks display start and end times
 * - Weekend highlighting for better readability
 * - Event tooltip shows status and duration/time
 * - Status legend with icons below the calendar
 *
 * @component
 * @param {BreakCalendarProps} props - Props including breakRequests from API
 * @returns {JSX.Element} Rendered break calendar
 */
const BreakCalendar: React.FC<BreakCalendarProps> = ({
  breakRequests = [],
}) => {
  const statusConfig = {
    pending: {
      Icon: icons.pending,
      bg: "#fef3c7",
      border: "#f59e0b",
      text: "#92400e",
      label: "Pending",
      iconColor: "text-amber-600 dark:text-amber-400",
      textColor: "text-amber-800 dark:text-amber-300",
    },
    approved: {
      Icon: icons.check,
      bg: "#d1fae5",
      border: "#10b981",
      text: "#065f46",
      label: "Approved",
      iconColor: "text-green-600 dark:text-green-400",
      textColor: "text-green-800 dark:text-green-300",
    },
    rejected: {
      Icon: icons.close,
      bg: "#fee2e2",
      border: "#f87171",
      text: "#b91c1c",
      label: "Rejected",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-800 dark:text-red-300",
    },
  };

  // Calculate duration between two dates
  const calculateDuration = (startAt: string, endAt: string): string => {
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "1 day";
    } else if (diffDays === 1) {
      return "1 day";
    } else {
      return `${diffDays + 1} days`;
    }
  };

  const events = breakRequests.map((brk) => {
    const config = statusConfig[brk.status];
    const duration = calculateDuration(brk.startAt, brk.endAt);

    if (brk.type === "long_term") {
      const endDate = new Date(brk.endAt);
      endDate.setDate(endDate.getDate() + 1);
      return {
        id: String(brk.id),
        title: `${config.label} - ${duration}`,
        start: brk.startAt,
        end: endDate.toISOString().split("T")[0],
        allDay: true,
        backgroundColor: config.bg,
        borderColor: config.border,
        textColor: config.text,
        extendedProps: { Icon: config.Icon },
      };
    }

    return {
      id: String(brk.id),
      title: `${config.label} - ${duration}`,
      start: brk.startAt,
      end: brk.startAt,
      allDay: true,
      backgroundColor: config.bg,
      borderColor: config.border,
      textColor: config.text,
      extendedProps: { Icon: config.Icon },
    };
  });

  const statusArray = Object.values(statusConfig);

  if (breakRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No break requests to display</p>
      </div>
    );
  }

  return (
    <div className="py-5 px-4 bg-white dark:bg-gray-900">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
                ? "bg-gray-100 dark:bg-gray-800/60"
                : "dark:bg-gray-800"
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
        <div className="bg-gray-50 dark:bg-gray-800/70 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
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
