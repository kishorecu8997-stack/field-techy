import type { OfflineAction } from "./types";

/**
 * Manages the queue of offline actions in localStorage.
 */

const QUEUE_KEY = "offline_actions_queue";

export function getQueue(): OfflineAction[] {
  return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
}

export function addToQueue(action: OfflineAction) {
  const queue = getQueue();
  queue.push(action);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}
