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
 *
 * @component
 * @returns {JSX.Element} Rendered break calendar
 */
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { icons } from "@/config/icons";
import breakData from "@/dummy_data/break.json";

type RawBreak = {
  id: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  duration: string;
  type: "Short" | "Long";
  status: "Pending" | "Approved" | "Active" | "Rejected";
};

const BreakCalendar: React.FC = () => {
  const statusConfig = {
    Pending: {
      Icon: icons.pending,
      bg: "#fef3c7",
      border: "#f59e0b",
      text: "#92400e",
      label: "Pending",
    },
    Approved: {
      Icon: icons.check,
      bg: "#d1fae5",
      border: "#10b981",
      text: "#065f46",
      label: "Approved",
    },
    Active: {
      Icon: icons.active,
      bg: "#dbeafe",
      border: "#3b82f6",
      text: "#1e40af",
      label: "Active",
    },
    Rejected: {
      Icon: icons.close,
      bg: "#fee2e2",
      border: "#f87171",
      text: "#b91c1c",
      label: "Rejected",
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

  return (
    <div className="py-5 px-4">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
        <div className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "", // Only month view
            }}
            height="600px"
            events={events}
            dayCellClassNames={(arg) =>
              arg.date.getDay() === 0 || arg.date.getDay() === 6
                ? "bg-gray-100"
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
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-3">
              <icons.active className="text-2xl text-blue-600" />
              <span className="font-bold text-blue-800">Active</span>
            </div>
            <div className="flex items-center gap-3">
              <icons.check className="text-2xl text-green-600" />
              <span className="font-bold text-green-800">Approved</span>
            </div>
            <div className="flex items-center gap-3">
              <icons.pending className="text-2xl text-amber-600" />
              <span className="font-bold text-amber-800">Pending</span>
            </div>
            <div className="flex items-center gap-3">
              <icons.close className="text-2xl text-red-600" />
              <span className="font-bold text-red-800">Rejected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakCalendar;
