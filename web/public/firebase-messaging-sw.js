/**
 * Service Worker for FCM Message Handling
 *
 * This service worker handles:
 * - FCM message reception from Firebase (Background & Terminated states)
 * - Real-time message forwarding to all open tabs (Simulating WebSocket behavior to update UI)
 * - Notification display and click handling
 * Claim clients immediately on activation to ensure control
 */
self.addEventListener("activate", (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(), // Take control of all clients immediately
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== "fcm-receiver-v1") {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

/**
 * Send message to all open tabs immediately to trigger UI updates
 * This acts as a "socket" push to the client to refresh data
 */
async function sendToAllOpenTabs(message) {
    try {
        // Match all clients including those not controlled yet
        const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });

        clients.forEach(client => {
            client.postMessage({
                type: "FCM_MESSAGE",
                data: message,
            });
        });

        return clients.length; // Return number of tabs messaged
    } catch (error) {
        console.error("Failed to send message to open tabs:", error);
        return 0;
    }
}

/**
 * Handle incoming messages from the app (if any)
 */
self.addEventListener("message", async (event) => {
    if (!event.data) return;
    const { type, data } = event.data;

    if (type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

/**
 * Handle push notifications from FCM
 */
self.addEventListener("push", async (event) => {

    if (!event.data) {
        console.warn("No data in push event");
        return;
    }

    try {
        const payload = event.data.json();

        // Extract notification details, falling back to 'data' if 'notification' is missing
        // This handles cases where the payload is data-only (common in some backend implementations)
        const notification = payload.notification || {};
        const data = payload.data || {};

        const title = notification.title || data.title || "New Notification";
        const body = notification.body || data.body || "You have a new message";
        const icon = notification.icon || data.icon || "/favicon.svg";
        const badge = notification.badge || data.badge || "/favicon.svg";
        const tag = notification.tag || data.tag || "fcm-message";
        const image = notification.image || data.image;

        const options = {
            body: body,
            icon: icon,
            badge: badge,
            tag: tag,
            image: image,
            requireInteraction: false, // Set to true if you want it to persist until user interaction
            data: { ...data, ...notification }, // Pass all data to the notification click handler
        };

        // Show the notification
        const notificationPromise = self.registration.showNotification(title, options);

        // Prepare message for main thread (Client UI)
        const clientMessage = {
            notification: { title, body, icon, badge, tag, image },
            data: data,
            from: payload.from,
            messageId: payload.messageId,
            sentTime: payload.sentTime,
        };

        // Send message to all open tabs immediately to update the UI (WebSocket-like behavior)
        const clientUpdatePromise = sendToAllOpenTabs(clientMessage);

        event.waitUntil(Promise.all([notificationPromise, clientUpdatePromise]));

    } catch (error) {
        console.error("Error handling push notification:", error);
    }
});

/**
 * Handle notification clicks
 * content-available handling logic
 */
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const clickedNotification = event.notification;
    // You can access custom data sent with the notification
    const notificationData = clickedNotification.data;

    // Determine the URL to open (can be dynamic based on payload)
    const urlToOpen = notificationData?.url || "/";

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
            // Check if there is already a window/tab open with the app
            for (const client of clients) {
                // Determine if we should focus this client
                // Simple check for now, can be more specific like checking client.url
                if ("focus" in client) {
                    return client.focus().then((focusedClient) => {
                        // Optionally navigate the focused client
                        if (focusedClient && "navigate" in focusedClient) {
                            return focusedClient.navigate(urlToOpen);
                        }
                        return focusedClient;
                    });
                }
            }
            // If not, open a new window/tab
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
});

/**
 * Install event - cache resources
 */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("fcm-receiver-v1").then((cache) => {
            return cache.addAll(["/", "/index.html", "/favicon.svg"]).catch((error) => {
                console.warn("Cache addAll error:", error);
            });
        })
    );
    self.skipWaiting();
});
