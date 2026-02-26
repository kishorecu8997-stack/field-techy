/**
 * Environment configuration
 */

interface FCMConfig {
  apiKey: string;
  projectId: string;
  senderId: string;
  appId: string;
  vapidKey?: string;
}

interface EnvConfig {
  fcm: FCMConfig;
  serverUrl: string;
}

/**
 * Get environment variables with validation
 */
export function getEnvConfig(): EnvConfig {
  const fcmApiKey = (import.meta.env as Record<string, string>)
    .VITE_FCM_API_KEY;
  const fcmProjectId = (import.meta.env as Record<string, string>)
    .VITE_FCM_PROJECT_ID;
  const fcmSenderId = (import.meta.env as Record<string, string>)
    .VITE_FCM_SENDER_ID;
  const fcmAppId = (import.meta.env as Record<string, string>).VITE_FCM_APP_ID;
  const serverUrl = (import.meta.env as Record<string, string>).VITE_API_URL;
  const fcmVapidKey = (import.meta.env as Record<string, string>)
    .VITE_FCM_VAPID_KEY;

  if (!fcmApiKey) {
    throw new Error(
      "Missing VITE_FCM_API_KEY environment variable. Check .env file.",
    );
  }

  if (!fcmProjectId) {
    throw new Error(
      "Missing VITE_FCM_PROJECT_ID environment variable. Check .env file.",
    );
  }

  if (!fcmSenderId) {
    throw new Error(
      "Missing VITE_FCM_SENDER_ID environment variable. Check .env file.",
    );
  }

  if (!fcmAppId) {
    throw new Error(
      "Missing VITE_FCM_APP_ID environment variable. Check .env file.",
    );
  }

  if (!serverUrl) {
    throw new Error(
      "Missing VITE_API_URL environment variable. Check .env file.",
    );
  }

  return {
    fcm: {
      apiKey: fcmApiKey,
      projectId: fcmProjectId,
      senderId: fcmSenderId,
      appId: fcmAppId,
      vapidKey: fcmVapidKey,
    },
    serverUrl,
  };
}

/**
 * Backward compatible config object
 */
const env = getEnvConfig();
export const config = {
  apiUrl: env.serverUrl,
  tokenExpirationDuration: import.meta.env.VITE_TOKEN_EXPIRATION_DURATION
    ? Number(import.meta.env.VITE_TOKEN_EXPIRATION_DURATION)
    : 60 * 60 * 1000, // Default: 1 hour
  firebase: {
    apiKey: env.fcm.apiKey,
    authDomain: `${env.fcm.projectId}.firebaseapp.com`,
    projectId: env.fcm.projectId,
    storageBucket: `${env.fcm.projectId}.appspot.com`,
    messagingSenderId: env.fcm.senderId,
    appId: env.fcm.appId,
    vapidKey: env.fcm.vapidKey || "",
  },
};
