import React, { useState } from "react";
import { Button } from "../commonUI/Buttons";

export interface GenericPopupButton {
  label: string;
  value: unknown;
  variant?:
    | "primary"
    | "outline"
    | "danger"
    | "secondary"
    | "link"
    | "ghost"
    | "text"
    | "solid"
    | "warning"
    | undefined;

  action?: (close: (result: unknown) => void) => Promise<void> | void;
}

export interface GenericPopupProps {
  title: string | React.ReactNode;
  body: string | React.ReactNode;
  actionButtons: GenericPopupButton[];
  onClose: (value: unknown) => void;
}

/*
 * A reusable modal/popup component for React + TS.
 * Supports async button actions and resolves via onClose().
 */
export function GenericPopup(props: GenericPopupProps) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleClick = async (button: GenericPopupButton, index: number) => {
    if (button.action) {
      setLoadingIndex(index);
      try {
        await button.action(props.onClose);
      } finally {
        setLoadingIndex(null);
      }
    } else {
      props.onClose(button.value);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden">
      <div className="p-4 bg-white dark:bg-neutral-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {props.title}
        </h2>
      </div>

      <div className="px-4 pb-2 flex-grow overflow-y-auto bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200">
        {typeof props.body === "string" ? <p>{props.body}</p> : props.body}
      </div>

      <div className="p-4 bg-white dark:bg-neutral-800 flex gap-2 justify-end">
        {props.actionButtons.map((button, idx) => {
          const isLoading = loadingIndex === idx;
          return (
            <Button
              key={idx}
              type="button"
              variant={button.variant}
              className={`px-4 py-2 font-medium transition-all ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
              onClick={() => handleClick(button, idx)}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClick(button, idx);
                }
              }}
            >
              {isLoading ? "Loading..." : button.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
