# Real-time Notification Integration Guide

This document defines the architecture and changes made to enable robust, real-time push notifications in the Field Techy web application using Firebase Cloud Messaging (FCM).

## Architecture Overview

The notification system uses a hybrid approach to ensure reliability:
1.  **Service Worker (`firebase-messaging-sw.js`)**: Handles incoming push notifications even when the app is in the background or closed. It also "wakes up" the client app by sending a message to all open tabs.
2.  **React Hook (`useFCM.ts`)**: Manages permission requests, retrieves the FCM token, registers it with the backend, and listens for foreground messages.
3.  **Main Entry (`main.tsx`)**: Explicitly registers the Service Worker to ensure the browser installs it correctly.

---

## 1. Service Worker (`public/firebase-messaging-sw.js`)

**Role:** The backend of your frontend. It sits between your app and the network/OS.

**Key Changes:**
*   **Detailed Push Handling**: It now accepts both `notification` (standard) and `data` (custom) payloads. If the standard `notification` object is missing, it constructs one from the `data` payload.
*   **"Socket" Simulation**: When a push is received, it iterates through all open browser tabs and sends a `postMessage` (`type: "FCM_MESSAGE"`). This mimics a WebSocket event, allowing the UI (e.g., notification badge) to update immediately without a reload.
*   **Immediate Control**: Uses `clients.claim()` during activation to take control of open pages immediately, rather than waiting for a reload.
*   **Smart Click Handling**: When a user clicks a notification, the SW checks if the app is already open. If so, it focuses that tab; if not, it opens a new one.

## 2. Notification Hook (`src/shared/hooks/useFCM.ts`)

**Role:** The bridge between React and the Service Worker. This hook is now **self-contained**, meaning it handles the Service Worker registration internally to ensure reliability.

**Key Changes:**
*   **Self-Contained Registration**: The hook now includes a `registerServiceWorker` helper. Before requesting a token, it idempotently registers (or ensures the existence of) `firebase-messaging-sw.js`. This prevents race conditions where the app might try to use the SW before `main.tsx` has finished loading it.
*   **Explicit SW Binding**: When calling `getToken()`, we pass the registration returned by our helper. This guarantees that the FCM SDK uses *our* custom `firebase-messaging-sw.js`.
*   **Automatic Registration**: Functionality remains to automatically retrieve/register tokens if permission is already "granted".
*   **Global Listener**: Listens for the `FCM_MESSAGE` event sent by the Service Worker and triggers a React Query invalidation (`queryClient.invalidateQueries`) to refresh the notification list instantly.

## 3. App Entry Point (`src/main.tsx`)

**Role:** Optional global bootstrapper.

**Key Changes:**
*   **Redundant but Safe Registration**: We still keep the registration in `main.tsx` as a fallback or for earlier initialization, but `useFCM.ts` is now robust enough to handle the registration on its own if this fails.

---

## Troubleshooting Checklist

If notifications are still not appearing, check these specific items in your browser DevTools (F12):

1.  **Console Logs**:
    *   Look for: `"Service Worker registered successfully"` (Confirmation that `main.tsx` worked).
    *   Look for: `"FCM Service Worker starting up"` (Confirmation that the SW file is loaded).
    *   Look for: `"Device token registered successfully"` (Confirmation that `useFCM` sent the token to your backend).

2.  **Application Tab -> Service Workers**:
    *   Ensure the Status is **"Activated and is running"**.
    *   If it says "Waiting to Activate", click "Skip Waiting" or reload the page hard (Ctrl+F5).

3.  **Network Tab -> WS / XHR**:
    *   When you reload, look for a call to your backend `register-device-token` API. If this fails (400/500), the backend won't know where to send the push.

4.  **Backend Payload Format**:
    *   Ensure your backend sends the payload in this structure:
        ```json
        {
          "token": "DEVICE_FCM_TOKEN",
          "notification": {
            "title": "Hello",
            "body": "World"
          },
          "data": {
            "type": "job_offer",
            "id": "123"
          }
        }
        ```
    *   If `notification` is missing, our updated SW will try to build it from `data`, but it's safer to include it.
