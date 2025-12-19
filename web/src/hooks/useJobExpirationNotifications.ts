import { useEffect } from "react";
import { getSavedJobs } from "@/utils/bookmarkUtils";
import { toast } from "react-toastify";

/**
 * Custom hook for job expiration/start reminders (uniform toast style)
 */
export const useJobExpirationNotification = (): void => {
  useEffect(() => {
    const savedJobs = getSavedJobs();
    const now = new Date();

    savedJobs.forEach((job) => {
      if (!job.startDate) return;

      const cleanDateStr = job.startDate.replace(",", "").trim();
      const startDateTime = new Date(cleanDateStr);

      if (isNaN(startDateTime.getTime())) {
        console.warn("Invalid date format:", job.startDate);
        return;
      }

      const diffMs = startDateTime.getTime() - now.getTime();

      if (diffMs <= 0) {
        toast.error(
          `Saved Job Expired: "${job.title}" has passed its start date.`,
          {
            toastId: `expired-${job.id}`,
          }
        );
        return;
      }

      const diffHours = diffMs / (1000 * 60 * 60);
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays >= 6.9 && diffDays < 7.1) {
        toast.success(
          `1 Week Reminder: "${job.title}" starts in 7 days,Apply now!`,
          {
            toastId: `week-${job.id}`,
          }
        );
      } else if (diffDays >= 4.9 && diffDays < 5.1) {
        toast.success(`5 Days Left: "${job.title}" starts soon,Apply now!`, {
          toastId: `5days-${job.id}`,
        });
      } else if (diffDays >= 2.9 && diffDays < 3.1) {
        toast.success(
          `3 Days to Go: "${job.title}" is approaching,Apply now!`,
          {
            toastId: `3days-${job.id}`,
          }
        );
      } else if (diffDays >= 0.9 && diffDays < 1.1) {
        toast.success(
          `Starts Tomorrow: "${job.title}" begins tomorrow,Apply now!`,
          {
            toastId: `1day-${job.id}`,
          }
        );
      } else if (diffHours >= 5.9 && diffHours < 6.1) {
        toast.success(
          `6 Hours Left: "${job.title}" starts in 6 hours,Apply now!`,
          {
            toastId: `6hours-${job.id}`,
          }
        );
      } else if (diffHours >= 0.9 && diffHours < 1.1) {
        toast.success(
          `1 Hour to Go: "${job.title}" starts in 1 hour,Apply now!`,
          {
            toastId: `1hour-${job.id}`,
          }
        );
      }
    });
  }, []);
};
