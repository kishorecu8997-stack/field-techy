import React, { useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Button } from "./commonUI/Buttons";
/**
 * ShareScreen
 *
 * A modal that lets users select a window to share.
 * Includes a dropdown, preview cards, and Cancel/Share buttons.
 *
 * @param props - Component props
 * @returns Window sharing modal
 */
interface ShareScreenProps {
  isVisible: boolean;
  onCancel: () => void;
  onShare: () => void;
}

const ShareScreen: React.FC<ShareScreenProps> = ({
  isVisible,
  onCancel,
  onShare,
}) => {
  const [selectedWindow, setSelectedWindow] = useState<number | null>(null);

  const windows = useMemo(
    () => [
      { id: 1, name: "Window 1" },
      { id: 2, name: "Window 2" },
      { id: 3, name: "Window 3" },
    ],
    [],
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onCancel}
        className="absolute inset-0 bg-black/20"
      />

      {/* Modal */}
      <div className="relative z-10 w-[88vw] max-w-4xl h-[70vh] bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col">
        {/* Top Section */}
        <div className="px-6 pt-6">
          <div className="relative w-full max-w-xs">
            <select
              className="w-full h-10 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none cursor-pointer text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={selectedWindow ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedWindow(v ? Number(v) : null);
              }}
            >
              {/* Placeholder option */}
              <option value="" disabled hidden>
                Share your window
              </option>

              {windows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>

            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Cards Section */}
        <div className="px-6 pt-6 flex-1">
          <div className="flex gap-6">
            {windows.map((w) => {
              const active = selectedWindow === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWindow(w.id)}
                  className={`rounded-lg overflow-hidden border transition-all text-left
                    w-[260px]
                    ${
                      active
                        ? "border-gray-900 dark:border-gray-100 shadow-md"
                        : "border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-md"
                    }`}
                >
                  {/* Header */}
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 px-3 flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {w.name}
                    </span>
                  </div>

                  {/* Preview */}
                  <div className="h-[180px] bg-gray-100 dark:bg-gray-800" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="px-6 pb-6 flex justify-end gap-4">
          <Button onClick={onCancel} variant="cancel">
            Cancel
          </Button>

          <Button onClick={onShare} disabled={!selectedWindow} variant="accept">
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareScreen;
