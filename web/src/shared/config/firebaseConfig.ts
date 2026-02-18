/**
 * FCM Service for handling Firebase Cloud Messaging
 */

import { initializeApp } from "firebase/app";
import {
  getMessaging,
  onMessage,
  isSupported,
  getToken,
} from "firebase/messaging";
import { operationsStore, type Step } from "@/shared/store/operations";
import type { FCMMessage } from "@/shared/store/types/index";
import { getEnvConfig } from "./configService";

interface FCMServiceCallbacks {
  onMessage?: (message: FCMMessage) => void;
  onTokenRefresh?: (token: string) => void;
  onError?: (error: Error) => void;
  onTokenLoading?: (loading: boolean) => void;
}

class FCMService {
  private initialized: boolean = false;
  private callbacks: FCMServiceCallbacks = {};
  private messaging: any = null;
  private app: any = null;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  /**
   * Initialize FCM service
   */
  async initialize(callbacks: FCMServiceCallbacks): Promise<void> {
    const operationId = `fcm-init-${Date.now()}`;
    const operation = {
      id: operationId,
      name: "Initialize FCM Service",
      status: "in-progress" as const,
      steps: [] as Step[],
      createdAt: Date.now(),
    };

    operationsStore.addOperation(operation);

    try {
      if (this.initialized) {
        console.warn("FCMService is already initialized");
        return;
      }

      this.callbacks = callbacks;

      // Step 1: Check FCM support
      const checkSupportStep: Step = {
        id: "check-support",
        name: "Check FCM browser support",
        status: "in-progress",
        message: undefined,
        timestamp: Date.now(),
      };
      operationsStore.addStep(operationId, checkSupportStep);

      // Check if FCM is supported
      const supported = await isSupported();
      if (!supported) {
        throw new Error(
          "Firebase Cloud Messaging is not supported in this browser",
        );
      }

      operationsStore.updateStep(operationId, "check-support", {
        status: "done",
        message: "FCM is supported",
        timestamp: Date.now(),
      });

      // Step 2: Check Service Worker support
      const checkSWStep: Step = {
        id: "check-sw",
        name: "Check Service Worker support",
        status: "in-progress",
        message: undefined,
        timestamp: Date.now(),
      };
      operationsStore.addStep(operationId, checkSWStep);

      // Check if Service Worker API is available
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service Workers are not supported in this browser");
      }

      operationsStore.updateStep(operationId, "check-sw", {
        status: "done",
        message: "Service Worker is supported",
        timestamp: Date.now(),
      });

      // Step 3: Initialize Firebase App
      const initFirebaseStep: Step = {
        id: "init-firebase",
        name: "Initialize Firebase App",
        status: "in-progress",
        message: undefined,
        timestamp: Date.now(),
      };
      operationsStore.addStep(operationId, initFirebaseStep);

      // Initialize Firebase App
      const envConfig = getEnvConfig();
      this.app = initializeApp({
        apiKey: envConfig.fcm.apiKey,
        authDomain: `${envConfig.fcm.projectId}.firebaseapp.com`,
        projectId: envConfig.fcm.projectId,
        messagingSenderId: envConfig.fcm.senderId,
        appId: envConfig.fcm.appId,
      });

      // Get Firebase Messaging instance
      this.messaging = getMessaging(this.app);

      operationsStore.updateStep(operationId, "init-firebase", {
        status: "done",
        message: "Firebase App initialized",
        timestamp: Date.now(),
      });

      // Step 4: Register Service Worker
      const registerSWStep: Step = {
        id: "register-sw",
        name: "Register Service Worker",
        status: "in-progress",
        message: undefined,
        timestamp: Date.now(),
      };
      operationsStore.addStep(operationId, registerSWStep);

      // Register service worker
      this.serviceWorkerRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" },
      );

      operationsStore.updateStep(operationId, "register-sw", {
        status: "done",
        message: "Service Worker registered",
        timestamp: Date.now(),
      });

      // Set up service worker message listener for FCM messages
      navigator.serviceWorker.addEventListener(
        "message",
        (event: MessageEvent) => {
          const { type, data } = event.data;
          if (type === "FCM_MESSAGE") {
            this.callbacks.onMessage?.(data as FCMMessage);
          }
        },
      );

      // Step 5: Wait for Service Worker ready
      const swReadyStep: Step = {
        id: "sw-ready",
        name: "Wait for Service Worker ready",
        status: "in-progress",
        message: undefined,
        timestamp: Date.now(),
      };
      operationsStore.addStep(operationId, swReadyStep);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      operationsStore.updateStep(operationId, "sw-ready", {
        status: "done",
        message: "Service Worker is ready",
        timestamp: Date.now(),
      });

      // Step 7: Check notification permission
      const checkPermissionStep: Step = {
        id: "check-permission",
        name: "Check notification permission",
        status: "in-progress",
        message: undefined,
        timestamp: Date.now(),
      };
      operationsStore.addStep(operationId, checkPermissionStep);

      // Just check current permission status during initialization
      const permission = Notification.permission;

      operationsStore.updateStep(operationId, "check-permission", {
        status: "done",
        message: `Notification permission is: ${permission}`,
        timestamp: Date.now(),
      });

      // Step 8: Set up message listeners
      const setupListenersStep: Step = {
        id: "setup-listeners",
        name: "Set up message listeners",
        status: "in-progress",
        message: undefined,
        timestamp: Date.now(),
      };
      operationsStore.addStep(operationId, setupListenersStep);

      // Listen for foreground messages
      onMessage(this.messaging, (payload) => {
        this.callbacks.onMessage?.(payload as FCMMessage);
      });

      // Service worker message listener is already set up above

      operationsStore.updateStep(operationId, "setup-listeners", {
        status: "done",
        message: "Message listeners set up",
        timestamp: Date.now(),
      });

      // Step 9: Get FCM token (only if permission is granted)
      const getTokenStep: Step = {
        id: "get-token",
        name: "Retrieve FCM token",
        status: "in-progress",
        message: undefined,
        timestamp: Date.now(),
      };
      operationsStore.addStep(operationId, getTokenStep);

      if (Notification.permission !== "granted") {
        operationsStore.updateStep(operationId, "get-token", {
          status: "done",
          message: "Skipped: Notification permission not granted",
          timestamp: Date.now(),
        });
        this.initialized = true;
        return;
      }

      // Set loading state to true
      this.callbacks.onTokenLoading?.(true);

      // Get the FCM token
      try {
        const envConfig = getEnvConfig();
        const vapidKey =
          envConfig.fcm.vapidKey || import.meta.env.VITE_FCM_VAPID_KEY;

        if (!vapidKey) {
          throw new Error("VAPID key not configured");
        }

        const token = await getToken(this.messaging, {
          vapidKey,
          serviceWorkerRegistration: this.serviceWorkerRegistration!,
        });

        operationsStore.updateStep(operationId, "get-token", {
          status: "done",
          message: token
            ? "FCM token retrieved successfully"
            : "No FCM token available",
          timestamp: Date.now(),
        });

        // Set loading state to false
        this.callbacks.onTokenLoading?.(false);

        // Call the token refresh callback with the initial token
        if (token && this.callbacks.onTokenRefresh) {
          this.callbacks.onTokenRefresh(token);
        }
      } catch (error) {
        operationsStore.updateStep(operationId, "get-token", {
          status: "failed",
          message: `Failed to retrieve FCM token: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: Date.now(),
        });

        // Set loading state to false even on error
        this.callbacks.onTokenLoading?.(false);

        // Don't throw here - token retrieval failure shouldn't prevent FCM initialization
      }

      this.initialized = true;

      operationsStore.updateOperation(operationId, {
        status: "done",
        completedAt: Date.now(),
      });
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Unknown error during FCMService initialization");

      operationsStore.updateOperation(operationId, {
        status: "failed",
        error: err.message,
        completedAt: Date.now(),
      });

      this.callbacks.onError?.(err);
      throw err;
    }
  }

  /**
   * Request notification permission and get token if granted
   */
  async requestPermission(): Promise<NotificationPermission> {
    const permission = await Notification.requestPermission();

    if (permission === "granted" && this.initialized) {
      try {
        const token = await this.getToken();
        if (token && this.callbacks.onTokenRefresh) {
          this.callbacks.onTokenRefresh(token);
        }
      } catch (error) {
        console.error("Failed to get token after permission grant:", error);
      }
    }

    return permission;
  }

  /**
   * Get FCM token directly from Firebase
   */
  async getToken(): Promise<string> {
    if (!this.messaging) {
      throw new Error("Firebase messaging not initialized");
    }

    // Check notification permission
    if (Notification.permission !== "granted") {
      throw new Error("Notification permission not granted");
    }

    const envConfig = getEnvConfig();
    const vapidKey =
      envConfig.fcm.vapidKey || import.meta.env.VITE_FCM_VAPID_KEY;

    if (!vapidKey) {
      throw new Error(
        "VAPID key not configured. Please set VITE_FCM_VAPID_KEY in your environment variables.",
      );
    }

    try {
      const token = await getToken(this.messaging, { vapidKey });
      return token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    // Firebase handles cleanup automatically
    this.messaging = null;
    this.app = null;
    this.serviceWorkerRegistration = null;
    this.initialized = false;
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

export const fcmService = new FCMService();
