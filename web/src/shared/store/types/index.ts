/**
 * FCM Message types
 */

export interface FCMNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  tag?: string;
  badge?: string;
  click_action?: string;
}

export interface FCMDataPayload {
  [key: string]: string;
}

export interface FCMMessage {
  notification?: FCMNotificationPayload;
  data?: FCMDataPayload;
  from?: string;
  messageId?: string;
  sentTime?: number;
}

export interface RegisterTokenRequest {
  token: string;
  platform: "ios" | "android" | "web";
  deviceId?: string;
  userId?: string;
}

export interface RegisterTokenResponse {
  success: boolean;
  message: string;
}

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface TokenStore {
  token: string | null;
  registeredWithServer: boolean;
  lastError: AppError | null;
}
