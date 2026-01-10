import { useEffect } from "react";
import { getSavedJobs, BOOKMARK_CHANGE_EVENT } from "@/utils/bookmarkUtils";
import { toast } from "react-toastify";

const shownReminders = new Set<string>();
/**
 * Custom hook for job expiration/start reminders (uniform toast style)
 *
 * Features:
 * - Shows each reminder only once per job
 * - Re-checks every minute for accurate timing
 * - Re-checks when bookmarks change
 * - Robust date parsing
 * - Proper punctuation
 */
export const useJobExpirationNotification = (): void => {
  const checkReminders = () => {
    const savedJobs = getSavedJobs();
    const now = new Date();

    savedJobs.forEach((job) => {
      if (!job.startDate) return;

      const cleanDateStr = job.startDate.replace(",", "").trim();
      const startTimestamp = Date.parse(cleanDateStr);

      if (isNaN(startTimestamp)) {
        console.warn("Invalid date format:", job.startDate);
        return;
      }

      const diffMs = startTimestamp - now.getTime();

      if (diffMs <= 0) {
        const key = `expired-${job.id}`;
        if (!shownReminders.has(key)) {
          toast.error(
            `Saved Job Expired: "${job.jobTitle}" has passed its start date.`,
            {
              toastId: key,
            }
          );
          shownReminders.add(key);
        }
        return;
      }

      const diffHours = diffMs / (1000 * 60 * 60);
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffHours >= 0.5 && diffHours < 1.5) {
        const key = `1hour-${job.id}`;
        if (!shownReminders.has(key)) {
          toast.success(
            `1 Hour to Go: "${job.jobTitle}" starts in 1 hour. Apply now!`,
            {
              toastId: key,
            }
          );
          shownReminders.add(key);
        }
      } else if (diffHours >= 5 && diffHours < 7) {
        const key = `6hours-${job.id}`;
        if (!shownReminders.has(key)) {
          toast.success(
            `6 Hours Left: "${job.jobTitle}" starts in 6 hours. Apply now!`,
            {
              toastId: key,
            }
          );
          shownReminders.add(key);
        }
      } else if (diffDays >= 0.5 && diffDays < 1.5) {
        const key = `1day-${job.id}`;
        if (!shownReminders.has(key)) {
          toast.success(
            `Starts Tomorrow: "${job.jobTitle}" begins tomorrow. Apply now!`,
            {
              toastId: key,
            }
          );
          shownReminders.add(key);
        }
      } else if (diffDays >= 2.5 && diffDays < 3.5) {
        const key = `3days-${job.id}`;
        if (!shownReminders.has(key)) {
          toast.success(
            `3 Days to Go: "${job.jobTitle}" is approaching. Apply now!`,
            {
              toastId: key,
            }
          );
          shownReminders.add(key);
        }
      } else if (diffDays >= 4.5 && diffDays < 5.5) {
        const key = `5days-${job.id}`;
        if (!shownReminders.has(key)) {
          toast.success(`5 Days Left: "${job.jobTitle}" starts soon. Apply now!`, {
            toastId: key,
          });
          shownReminders.add(key);
        }
      } else if (diffDays >= 6.5 && diffDays < 7.5) {
        const key = `week-${job.id}`;
        if (!shownReminders.has(key)) {
          toast.success(
            `1 Week Reminder: "${job.jobTitle}" starts in 7 days. Apply now!`,
            {
              toastId: key,
            }
          );
          shownReminders.add(key);
        }
      }
    });
  };

  useEffect(() => {
    shownReminders.clear();
    checkReminders();
    const interval = setInterval(checkReminders, 60_000);
    window.addEventListener(BOOKMARK_CHANGE_EVENT, checkReminders);

    return () => {
      clearInterval(interval);
      window.removeEventListener(BOOKMARK_CHANGE_EVENT, checkReminders);
    };
  }, []);
};
