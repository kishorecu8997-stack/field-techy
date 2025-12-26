import type { OfflineAction } from "./types";

/**
 * Manages the queue of offline actions in localStorage.
 */

export const STORAGE_KEYS = {
  OFFLINE_QUEUE: "offline_actions_queue",
};
export function getQueue(): OfflineAction[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || "[]");
}

export function addToQueue(action: OfflineAction) {
  const queue = getQueue();
  queue.push(action);
  localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
}

export function clearQueue() {
  localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
}
