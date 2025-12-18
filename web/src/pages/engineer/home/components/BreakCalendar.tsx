import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";


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
    { icon: string; bg: string; border: string; text: string }
  > = {
    Pending: { icon: "⏳", bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
    Approved: { icon: "✓", bg: "#d1fae5", border: "#10b981", text: "#065f46" },
    Active: { icon: "⚡", bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
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
        icon: config.icon,
      },
      display: "block",
    };
  });

  return (
    <div className="py-5 px-4 max-w-xl mx-aut">
      <div className=" rounded-2xl overflow-hidden">
        <div className="p-1">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            initialDate="2025-12-01"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "",
            }}
            height="auto"
            events={events}
            displayEventTime={false}
            eventDidMount={(info) => {
              const icon = (info.event.extendedProps as { icon: string }).icon;

              const iconElement = document.createElement("div");
              iconElement.innerHTML = icon;
              iconElement.className =
                "text-2xl font-bold flex items-center justify-center h-full";

              info.el.innerHTML = "";
              info.el.appendChild(iconElement);
              info.el.classList.add("flex", "items-center", "justify-center");
            }}
          />
        </div>

        <div className="px-2 py-2">
          <div className="flex flex-wrap justify-center gap-4 text-md">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-bold text-blue-800">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span className="font-bold text-green-800">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⏳</span>
              <span className="font-bold text-amber-800">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakCalendar;
