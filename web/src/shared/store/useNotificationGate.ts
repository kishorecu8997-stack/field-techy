import { create } from "zustand";

interface NotificationGateState {
  isPaused: boolean;
  pendingId: string | number | null;
  pause: (id: string | number) => void;
  resume: () => void;
}
/**
 * Notification Gate Store
 * -----------------------
 * Controls the pause/resume flow of job-related notifications
 * that require explicit user confirmation (e.g. Job Offers).
 *
 * Purpose:
 * - Prevent multiple job notifications from appearing at once
 * - Ensure the user confirms presence before receiving new job alerts
 *
 * Flow:
 * 1. A confirmation-required notification arrives (job_offer)
 * 2. `pause(notificationId)` is called
 *    → Notifications are paused
 *    → Only the pending notification remains visible
 * 3. User confirms or declines the offer
 * 4. `resume()` is called
 *    → Notification flow resumes normally
 */

/**
 * Zustand store that manages the notification
 * confirmation gate.
 */
const useNotificationGate = create<NotificationGateState>((set) => ({
  isPaused: false,
  pendingId: null,
  pause: (id) => set({ isPaused: true, pendingId: id }),
  resume: () => set({ isPaused: false, pendingId: null }),
}));

export default useNotificationGate;
