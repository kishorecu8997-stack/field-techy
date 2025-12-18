import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { icons } from "@/config/icons";

interface Break {
  id: string;
  startDate: string;
  endDate: string;
  type: "Short" | "Long";
  status: "Pending" | "Approved" | "Active";
}

const breakData: Break[] = [
  {
    id: "1",
    startDate: "2026-01-18 09:00",
    endDate: "2026-01-20 12:00",
    type: "Short",
    status: "Pending",
  },
  {
    id: "2",
    startDate: "2025-12-21 13:00",
    endDate: "2025-12-22 18:00",
    type: "Long",
    status: "Approved",
  },
  {
    id: "3",
    startDate: "2025-12-23 10:00",
    endDate: "2025-12-23 14:00",
    type: "Short",
    status: "Active",
  },
];

const BreakCalendar: React.FC = () => {
  const statusConfig: Record<
    "Pending" | "Approved" | "Active",
    { Icon: React.ComponentType; bg: string; border: string; text: string }
  > = {
    Pending: {
      Icon: icons.pending,
      bg: "#fef3c7",
      border: "#f59e0b",
      text: "#92400e",
    },
    Approved: {
      Icon: icons.check,
      bg: "#d1fae5",
      border: "#10b981",
      text: "#065f46",
    },
    Active: {
      Icon: icons.active,
      bg: "#dbeafe",
      border: "#3b82f6",
      text: "#1e40af",
    },
  };

  const events = breakData.map((brk) => {
    const config = statusConfig[brk.status];

    return {
      id: brk.id,
      start: brk.startDate,
      end: brk.endDate,
      backgroundColor: config.bg,
      borderColor: config.border,
      textColor: config.text,
      extendedProps: {
        Icon: config.Icon,
      },
      display: "block",
    };
  });

  return (
    <div className="py-5 px-4">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
        <div className="p-2">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            initialDate="2025-12-01"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            height="auto"
            events={events}
            displayEventTime={false}
            eventContent={(arg) => {
              const IconComponent = (
                arg.event.extendedProps as {
                  Icon: React.ComponentType<{ className?: string }>;
                }
              ).Icon;

              return (
                <div className="flex items-center justify-center h-full w-full">
                  <IconComponent className="text-3xl" />
                </div>
              );
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakCalendar;
